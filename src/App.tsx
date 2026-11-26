import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Icon } from "./components/Icon";
import { storeConfig, type Language } from "./config/store";
import { copy } from "./content/copy";
import { products, type Product } from "./data/products";
import { cartTotals, changeQuantity, normalizeCart, type Cart } from "./lib/cart";
import { buildInquiryMessage, money, whatsappInquiryUrl } from "./lib/checkout";

type View = "home" | "catalog";

function useOverlayFocus(
  open: boolean,
  panel: RefObject<HTMLElement | null>,
  returnTo: RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open || !panel.current) return;
    const container = panel.current;
    const previous = returnTo.current;
    const focusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") return;
      const controls = focusable();
      if (!controls.length) {
        event.preventDefault();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      if (!document.querySelector(".cart.open, .product-modal")) previous?.focus();
    };
  }, [open, panel, returnTo, close]);
}

function ProductCard({
  product,
  lang,
  onAdd,
  onOpen,
}: {
  product: Product;
  lang: Language;
  onAdd: () => void;
  onOpen: () => void;
}) {
  const t = copy[lang];
  return (
    <article className="product-card group">
      <button
        className="product-image"
        onClick={onOpen}
        aria-label={`${t.discover} ${product.name[lang]}`}
      >
        <img src={product.image} alt={product.name[lang]} loading="lazy" />
        <span className="discover-link">
          {t.discover} <Icon name="arrow" />
        </span>
      </button>
      <div className="product-meta">
        <button className="text-start" onClick={onOpen}>
          <h3>{product.name[lang]}</h3>
          <p>{product.subtitle[lang]}</p>
        </button>
        <div className="price-row">
          <span>{money(product.price, lang, storeConfig)}</span>
          <button
            className="add-round"
            onClick={onAdd}
            aria-label={`${t.add} ${product.name[lang]}`}
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      return localStorage.getItem("catalogflow-language") === "ar" ? "ar" : "en";
    } catch {
      return "en";
    }
  });
  const [view, setView] = useState<View>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const priceBounds = useMemo(
    () => ({
      min: products.length ? Math.min(...products.map((p) => p.price)) : 0,
      max: products.length ? Math.max(...products.map((p) => p.price)) : 0,
    }),
    [],
  );
  const [price, setPrice] = useState(priceBounds.max);
  const [cart, setCart] = useState<Cart>(() => {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem("catalogflow-cart") || "{}"), products);
    } catch {
      return {};
    }
  });
  const cartPanel = useRef<HTMLElement>(null);
  const modalPanel = useRef<HTMLDivElement>(null);
  const cartReturn = useRef<HTMLElement | null>(null);
  const modalReturn = useRef<HTMLElement | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const t = copy[lang];
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeModal = useCallback(() => setSelected(null), []);
  useOverlayFocus(cartOpen, cartPanel, cartReturn, closeCart);
  useOverlayFocus(Boolean(selected), modalPanel, modalReturn, closeModal);

  useEffect(() => {
    try {
      localStorage.setItem("catalogflow-cart", JSON.stringify(cart));
    } catch {
      /* Storage may be unavailable. */
    }
  }, [cart]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.title = `${storeConfig.brand} | ${view === "home" ? storeConfig.hero.title[lang] : storeConfig.catalog.title[lang]}${storeConfig.isDemo ? ` | ${t.demoBadge}` : ""}`;
    try {
      localStorage.setItem("catalogflow-language", lang);
    } catch {
      /* Storage may be unavailable. */
    }
  }, [lang, view]);

  useEffect(() => {
    const root = document.documentElement;
    for (const [name, value] of Object.entries(storeConfig.colors))
      root.style.setProperty(`--${name}`, value);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const { count: cartCount, subtotal } = cartTotals(cart, products);
  const checkoutUrl = whatsappInquiryUrl(
    buildInquiryMessage(cart, products, lang, storeConfig),
    storeConfig,
  );
  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          p.name[lang].toLowerCase().includes(query) ||
          p.notes[lang].some((n) => n.toLowerCase().includes(query));
        return matchesSearch && (category === "all" || p.category === category) && p.price <= price;
      }),
    [search, category, price, lang],
  );

  const add = (id: string) => {
    cartReturn.current = selected ? modalReturn.current : (document.activeElement as HTMLElement);
    setCart((c) => changeQuantity(c, id, 1, products));
    setSelected(null);
    setCartOpen(true);
  };
  const update = (id: string, delta: number) =>
    setCart((c) => changeQuantity(c, id, delta, products));
  const openProduct = (product: Product) => {
    modalReturn.current = document.activeElement as HTMLElement;
    setSelected(product);
  };
  const openCart = () => {
    cartReturn.current = document.activeElement as HTMLElement;
    setCartOpen(true);
  };
  const scrollBehavior = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  const goCatalog = () => {
    setView("catalog");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };
  const checkout = () => {
    if (checkoutUrl) window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main" inert={cartOpen || Boolean(selected)}>
        {lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <div className="announcement">
        {storeConfig.isDemo ? t.demoBadge : storeConfig.delivery.announcement[lang]}
      </div>
      <header className="site-header" inert={cartOpen || Boolean(selected)}>
        <button
          ref={menuButton}
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t.menu}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <button
          className="brand"
          onClick={() => {
            setView("home");
            window.scrollTo(0, 0);
            setMenuOpen(false);
          }}
        >
          {storeConfig.wordmark.primary}
          <span>{storeConfig.wordmark.secondary}</span>
        </button>
        <nav id="site-nav" className={menuOpen ? "nav open" : "nav"} aria-label={t.menu}>
          <button onClick={goCatalog}>{t.nav[0]}</button>
          <button
            onClick={() => {
              setView("home");
              setTimeout(
                () =>
                  document.querySelector("#story")?.scrollIntoView({ behavior: scrollBehavior() }),
                10,
              );
              setMenuOpen(false);
            }}
          >
            {t.nav[1]}
          </button>
          <button
            onClick={() => {
              document.querySelector("#contact")?.scrollIntoView({ behavior: scrollBehavior() });
              setMenuOpen(false);
            }}
          >
            {t.nav[2]}
          </button>
        </nav>
        <div className="header-actions">
          <button className="language" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {lang === "en" ? "العربية" : "EN"}
          </button>
          <button className="bag-button" onClick={openCart} aria-label={`${t.bag} (${cartCount})`}>
            <Icon name="bag" />
            <span>{cartCount}</span>
          </button>
        </div>
      </header>

      {view === "home" ? (
        <main id="main" tabIndex={-1} inert={cartOpen || Boolean(selected)}>
          <section className="hero">
            <img src={storeConfig.hero.image} alt={storeConfig.hero.imageAlt[lang]} />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="eyebrow">{storeConfig.hero.eyebrow[lang]}</p>
              <h1>{storeConfig.hero.title[lang]}</h1>
              <p className="hero-body">{storeConfig.hero.body[lang]}</p>
              <button className="light-cta" onClick={goCatalog}>
                {t.explore}
                <Icon name="arrow" />
              </button>
            </div>
            <span className="hero-number">01 / {String(products.length).padStart(2, "0")}</span>
          </section>

          <section className="featured section">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">{storeConfig.featured.eyebrow[lang]}</p>
                <h2>{storeConfig.featured.title[lang]}</h2>
              </div>
              <div>
                <p>{storeConfig.featured.body[lang]}</p>
                <button className="text-link" onClick={goCatalog}>
                  {t.viewAll}
                  <Icon name="arrow" />
                </button>
              </div>
            </div>
            <div className="product-grid">
              {products
                .filter((p) => p.featured)
                .map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    lang={lang}
                    onOpen={() => openProduct(p)}
                    onAdd={() => add(p.id)}
                  />
                ))}
            </div>
          </section>

          <section className="story" id="story">
            <div className="story-image">
              <img src={storeConfig.story.image} alt="" loading="lazy" />
            </div>
            <div className="story-copy">
              <p className="eyebrow dark">{storeConfig.story.eyebrow[lang]}</p>
              <h2>{storeConfig.story.title[lang]}</h2>
              <p>{storeConfig.story.body[lang]}</p>
              <div className="story-stat">
                <span>{storeConfig.story.stat.value}</span>
                <p>{storeConfig.story.stat.description[lang]}</p>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main
          id="main"
          tabIndex={-1}
          className="catalog section"
          inert={cartOpen || Boolean(selected)}
        >
          <div className="catalog-title">
            <p className="eyebrow dark">{storeConfig.catalog.eyebrow[lang]}</p>
            <h1>{storeConfig.catalog.title[lang]}</h1>
            <p>{storeConfig.catalog.body[lang]}</p>
          </div>
          <div className="filters">
            <label className="search-box">
              <Icon name="search" />
              <span className="sr-only">{t.search}</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
              />
            </label>
            <div
              className="category-tabs"
              role="group"
              aria-label={storeConfig.catalog.title[lang]}
            >
              {[{ id: "all", label: { en: t.all, ar: t.all } }, ...storeConfig.categories].map(
                (c) => (
                  <button
                    className={category === c.id ? "active" : ""}
                    aria-pressed={category === c.id}
                    onClick={() => setCategory(c.id)}
                    key={c.id}
                  >
                    {c.label[lang]}
                  </button>
                ),
              )}
            </div>
            <label className="price-filter">
              <span>
                {t.price}: {money(price, lang, storeConfig)}
              </span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="results-count" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? t.item : t.items}
          </div>
          {filtered.length ? (
            <div className="product-grid catalog-grid">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  onOpen={() => openProduct(p)}
                  onAdd={() => add(p.id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>{t.noResults}</p>
              <button
                className="dark-cta"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setPrice(priceBounds.max);
                }}
              >
                {t.clear}
              </button>
            </div>
          )}
        </main>
      )}

      <footer id="contact" inert={cartOpen || Boolean(selected)}>
        <div className="footer-brand">
          <div className="brand inverse">
            {storeConfig.wordmark.primary}
            <span>{storeConfig.wordmark.secondary}</span>
          </div>
          <p>{storeConfig.footer.line[lang]}</p>
        </div>
        <div>
          <h4>{t.contact}</h4>
          {storeConfig.isDemo ? (
            <>
              <span>{storeConfig.email}</span>
              <span>{storeConfig.phone}</span>
            </>
          ) : (
            <>
              <a href={`mailto:${storeConfig.email}`}>{storeConfig.email}</a>
              <a href={`tel:${storeConfig.phone}`}>{storeConfig.phone}</a>
            </>
          )}
          <span>{storeConfig.location[lang]}</span>
        </div>
        <div>
          <h4>{t.follow}</h4>
          {storeConfig.isDemo ? (
            <>
              <span>Instagram</span>
              <span>TikTok</span>
            </>
          ) : (
            <>
              <a href={storeConfig.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={storeConfig.social.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
            </>
          )}
        </div>
        <p className="copyright">
          © {storeConfig.footer.copyrightYear} {storeConfig.brand}. {t.rights} ·{" "}
          {storeConfig.footer.credit}
        </p>
      </footer>

      <div
        className={cartOpen ? "overlay visible" : "overlay"}
        onClick={() => setCartOpen(false)}
      />
      <aside
        ref={cartPanel}
        className={cartOpen ? "cart open" : "cart"}
        role="dialog"
        aria-modal={cartOpen}
        aria-label={t.bag}
        inert={!cartOpen}
      >
        <div className="cart-head">
          <h2>
            {t.bag} <span>({cartCount})</span>
          </h2>
          <button onClick={closeCart} aria-label={t.close}>
            <Icon name="close" />
          </button>
        </div>
        {!cartCount ? (
          <div className="empty-cart">
            <Icon name="bag" />
            <h3>{t.empty}</h3>
            <p>{t.emptyBody}</p>
            <button
              className="dark-cta"
              onClick={() => {
                setCartOpen(false);
                goCatalog();
              }}
            >
              {t.explore}
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {products
                .filter((p) => cart[p.id])
                .map((p) => (
                  <div className="cart-item" key={p.id}>
                    <img src={p.image} alt="" />
                    <div>
                      <h3>{p.name[lang]}</h3>
                      <p>
                        {p.size} · {p.subtitle[lang]}
                      </p>
                      <div className="quantity">
                        <button
                          onClick={() => update(p.id, -1)}
                          aria-label={`${t.decrease} ${p.name[lang]}`}
                        >
                          <Icon name="minus" />
                        </button>
                        <span>{cart[p.id]}</span>
                        <button
                          onClick={() => update(p.id, 1)}
                          aria-label={`${t.increase} ${p.name[lang]}`}
                        >
                          <Icon name="plus" />
                        </button>
                      </div>
                    </div>
                    <strong>{money(p.price * cart[p.id], lang, storeConfig)}</strong>
                  </div>
                ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>{t.subtotal}</span>
                <strong>{money(subtotal, lang, storeConfig)}</strong>
              </div>
              <div>
                <span>{t.delivery}</span>
                <span>{storeConfig.delivery.label[lang]}</span>
              </div>
              <small id="checkout-notice">
                {!checkoutUrl
                  ? t.demoUnavailable
                  : storeConfig.isDemo
                    ? t.demoNote
                    : t.checkoutNote}
              </small>
              <button
                className="whatsapp-cta"
                onClick={checkout}
                disabled={!checkoutUrl}
                aria-describedby="checkout-notice"
              >
                <Icon name="whatsapp" />
                {storeConfig.isDemo ? t.demoCheckout : t.checkout}
              </button>
              <button className="continue" onClick={closeCart}>
                {t.continue}
              </button>
            </div>
          </>
        )}
      </aside>

      {selected && (
        <div className="modal-wrap">
          <button
            className="modal-backdrop"
            onClick={closeModal}
            aria-label={t.close}
            tabIndex={-1}
          />
          <div
            ref={modalPanel}
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selected.name[lang]}
          >
            <button className="modal-close" onClick={closeModal} aria-label={t.close}>
              <Icon name="close" />
            </button>
            <div className="modal-image">
              <img src={selected.image} alt={selected.name[lang]} />
            </div>
            <div className="modal-copy">
              <p className="eyebrow dark">{selected.subtitle[lang]}</p>
              <h2>{selected.name[lang]}</h2>
              <span className="modal-price">
                {money(selected.price, lang, storeConfig)} · {selected.size}
              </span>
              <p className="description">{selected.description[lang]}</p>
              <div className="notes">
                <p>{t.details}</p>
                <div>
                  {selected.notes[lang].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>
              <p className={selected.availability === "low" ? "availability low" : "availability"}>
                <i />
                {t[selected.availability]}
              </p>
              <button className="dark-cta full" onClick={() => add(selected.id)}>
                {t.add}
                <Icon name="bag" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
