import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    const arxivLink = fileData.frontmatter?.paper
    const githubLink = fileData.frontmatter?.code
    const originalPaper = fileData.frontmatter?.originalPaper
    const replicationCode = fileData.frontmatter?.replicationCode

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      // Add arXiv link if it exists
      if (arxivLink) {
        segments.push(<a href={arxivLink} target="_blank" rel="noopener noreferrer"><em>Original paper</em></a>)
      }

      // Add GitHub link if it exists
      if (githubLink) {
        segments.push(<a href={githubLink} target="_blank" rel="noopener noreferrer"><em>Code for paper</em></a>)
      }

      // Add original paper link if it exists
      if (originalPaper) {
        segments.push(<a href={originalPaper} target="_blank" rel="noopener noreferrer"><em>Original paper</em></a>)
      }

      // Add replication code link if it exists
      if (replicationCode) {
        segments.push(<a href={replicationCode} target="_blank" rel="noopener noreferrer"><em>Replication code</em></a>)
      }


      const segmentsElements = segments.map((segment, index) => (
        <span key={index}>
          {segment}
          {index < segments.length - 1 && options.showComma ? ', ' : ''}
        </span>
      ))

      return (
        <p class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
