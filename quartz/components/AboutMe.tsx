import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const AboutMe: QuartzComponent = ({ cfg, ctx, displayClass }: QuartzComponentProps) => {
  // Determine if we're running locally based on ctx.argv.serve
  const isLocal = ctx.argv.serve;

  // Construct the about-me URL based on the environment
  const aboutMeUrl = isLocal
    ? `http://localhost:${ctx.argv.port}/about-me`
    : `https://${cfg.baseUrl}/about-me`;

  return (
    <div class={classNames(displayClass)}>
        <a href={aboutMeUrl} class="about-me">
            <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20technologist/Light/Color/man_technologist_color_light.svg" alt="About me" />
            About me
        </a>
    </div>
  )
}

AboutMe.css = `
.about-me {
  display: flex;
  align-items: center;
  margin-top: -2rem;
  text-decoration: none;
  color: inherit;
  font-size: 1.5rem;
}

.about-me img {
  width: 36px;
  height: 36px;
  margin-right: 0.5rem;
}

/* Hide on mobile */
.desktop-only {
    display: block;
}

@media (max-width: 1024px) {
    .desktop-only {
        display: none;
    }
}
`

export default (() => AboutMe) satisfies QuartzComponentConstructor