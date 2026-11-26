import type { SVGProps } from 'react'

export type IconName = 'bag' | 'search' | 'menu' | 'close' | 'arrow' | 'minus' | 'plus' | 'whatsapp'

const paths: Record<IconName, React.ReactNode> = {
  bag: <><path d="M6.5 8.5h11l1 12h-13l1-12Z" /><path d="M9 9V6.5a3 3 0 0 1 6 0V9" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 6v12M6 12h12" />,
  whatsapp: <><path d="M20.2 11.7a8.1 8.1 0 0 1-11.9 7.1L4 20l1.2-4.2a8.1 8.1 0 1 1 15-4.1Z" /><path d="M9 8.2c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.3 0 .5-.1.7l-.6.8c-.2.2-.1.4 0 .6.7 1.2 1.7 2.1 3 2.7.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .4-.2 1.3-.7 1.8-.5.5-1.3.8-2.2.6-1.1-.2-2.6-.7-4.3-2.2-1.4-1.3-2.4-2.8-2.7-3.9-.4-1.2 0-2.2.4-2.7l.4-.1Z" /></>,
}

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}
