import { QuartzComponentConstructor } from "./types"
import style from "./styles/linksHeader.scss"

interface Link {
  text: string
  url: string
  iconUrl: string
}

interface Options {
  links: Link[]
}

export default ((opts: Options) => {
  function LinksHeader() {
    return (
      <div>
        <div id="links-header">
          {opts.links.map((link) => (
            <span key={link.text}>
              <img src={link.iconUrl} alt={link.text} />
              <a href={link.url}>{link.text}</a>
            </span>
          ))}
        </div>
        <hr style="background-color: var(--gray); border-top: 1px var(--gray) solid; margin-top: 1.3rem"></hr>
      </div>
    )
  }

  LinksHeader.css = style
  return LinksHeader
}) satisfies QuartzComponentConstructor