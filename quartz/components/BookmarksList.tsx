import { FullSlug, joinSegments, resolveRelative, SimpleSlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const BookmarksList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabetical(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="bookmarks-list section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const summary = page.frontmatter?.summary
        const tags = page.frontmatter?.tags ?? []
        const isFolder = tags.includes("folder")
        const href = page.frontmatter?.link

        return (
          <li class="bookmarks-list section-li">
            {/*
            <div>
              {page.dates && (
                <p class="meta">
                  <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                </p>
              )}
            </div> */}
            <div class="bookmarks-list desc">
              <h3>
                <a href={href}>
                  {title}
                </a>
              </h3>
              {summary && <p className="bookmarks-list summary">{summary}</p>}
              <ul class="bookmarks-list tags">
                {tags.map((tag) => (
                  <li>
                    <a
                      class="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )
}