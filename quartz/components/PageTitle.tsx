import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title-container")}>
      <h2 class={classNames(displayClass, "page-title")}>
        <a href={baseDir}>{title}</a>
      </h2>
      <a href="https://dechantoine.github.io/antoine-dechappe/about-me" class="about-me-link">
        <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20technologist/Light/Color/man_technologist_color_light.svg" alt="About me" />
        About me
      </a>
    </div>
  )
}

PageTitle.css = `
.page-title-container {
margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
}

.about-me-link {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  text-decoration: none;
  color: inherit;
  font-size: 1.5rem;
}

.about-me-link img {
  width: 36px;
  height: 36px;
  margin-right: 0.5rem;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
