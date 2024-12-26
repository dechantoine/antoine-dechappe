import { QuartzComponentConstructor } from "./types"
import style from "./styles/linksHeader.scss"

interface Options {
  links: Record<string, string>
}

export default (() => {
  function LinksHeader() {
    return (
      <div>
        <div id="links-header">
          <span>
            <img
              src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20scientist/Default/Color/man_scientist_color_default.svg"></img>
            <a href="/antoine-dechappe/Research-review">Research review</a>
          </span>
          <span>
            <img
              src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20scientist/Default/Color/man_scientist_color_default.svg"></img>
            <a href="/antoine-dechappe/Research-review">Research review</a>
          </span>
        </div>
        <hr style="background-color: var(--gray); border-top: 1px var(--gray) solid; margin-top: 1.3rem"></hr>
      </div>
    )
  }

  LinksHeader.css = style
  return LinksHeader
}) satisfies QuartzComponentConstructor