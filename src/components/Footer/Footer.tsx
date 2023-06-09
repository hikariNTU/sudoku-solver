import { GitHubLogoIcon, HomeIcon } from '@radix-ui/react-icons'

import './footer.scss'
type Link = {
  icon: JSX.Element
  text: string
  to: string
}

const links: Link[] = [
  {
    icon: <GitHubLogoIcon />,
    text: 'GitHub',
    to: 'https://github.com/hikariNTU',
  },
  {
    icon: <HomeIcon />,
    text: 'Homepage',
    to: 'https://hikarintu.github.io/homepage/',
  },
]

const Footer = () => {
  return (
    <footer className="Footer">
      <span>HikariNTU@2023</span>
      <div className="FooterLinkContainer">
        {links.map((l) => (
          <a className="FooterLink" key={l.text} href={l.to}>
            {l.icon}
            {l.text}
          </a>
        ))}
      </div>
    </footer>
  )
}
export default Footer
