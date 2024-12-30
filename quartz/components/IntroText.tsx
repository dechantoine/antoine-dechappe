import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface IntroTextProps extends QuartzComponentProps {
  text: string
}

export default ((opts: IntroTextProps) => {
  const IntroText: QuartzComponent = (TextProps) => {
    return <div id="intro-text">{opts.text}</div>
  }

  IntroText.css = `
  #intro-text {
    font-size: 1rem;
    color: var(--dark);
    padding-right: 1rem;
    padding-bottom: 2rem;
  }
  `

  return IntroText
}) satisfies QuartzComponentConstructor