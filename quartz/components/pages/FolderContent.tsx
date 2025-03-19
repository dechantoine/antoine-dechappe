import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import path from "path"

import style from "../styles/listPage.scss"
import { byDateAndAlphabetical, SortFn } from "../PageList"
import { stripSlashes, simplifySlug, joinSegments, FullSlug } from "../../util/path"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"
import { FileNode, Options } from "../ExplorerNode"
import { ExplorerNode } from "../ExplorerNode"

interface FolderContentOptions {
  /**
   * Whether to display number of folders
   */
  showFolderCount: boolean
  sort?: SortFn
  explorerOptions?: Partial<Options>
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  explorerOptions: {},
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const folderSlug = stripSlashes(simplifySlug(fileData.slug!))
    const folderParts = folderSlug.split(path.posix.sep)

    // Filter files to only include descendants of the current folder
    const relevantFiles = allFiles.filter((file) => {
      const fileSlug = stripSlashes(simplifySlug(file.slug!))
      return fileSlug.startsWith(folderSlug) && fileSlug !== folderSlug
    })

    // Build the FileNode tree
    const fileTree = new FileNode("")
    relevantFiles.forEach((file) => fileTree.add(file))

    // Apply sorting, filtering, etc.
    const explorerOptions: Options = {
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      useSavedState: true,
      mapFn: (node) => {
        return node
      },
      sortFn: (a, b) => {
        // Sort order: folders first, then files. Sort folders and files alphabetically
        if ((!a.file && !b.file) || (a.file && b.file)) {
          // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
          // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }

        if (a.file && !b.file) {
          return 1
        } else {
          return -1
        }
      },
      filterFn: (node) => node.name !== "tags",
      order: ["filter", "map", "sort"],
      ...options.explorerOptions
    }

    // Execute all functions (sort, filter, map) that were provided (if none were provided, only default "sort" is applied)
    if (explorerOptions.order) {
      // Order is important, use loop with index instead of order.map()
      for (let i = 0; i < explorerOptions.order.length; i++) {
        const functionName = explorerOptions.order[i]
        if (functionName === "map") {
          fileTree.map(explorerOptions.mapFn)
        } else if (functionName === "sort") {
          fileTree.sort(explorerOptions.sortFn)
        } else if (functionName === "filter") {
          fileTree.filter(explorerOptions.filterFn)
        }
      }
    }

    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = ["popover-hint", ...cssClasses].join(" ")

    const content =
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)

    return (
      <div class={classes}>
        <article>{content}</article>
        <div class="page-listing">
          <div>
            <ul class="content">
              <ExplorerNode node={fileTree} opts={explorerOptions} fileData={fileData} />
            </ul>
          </div>
        </div>
      </div>
    )
  }

  FolderContent.css = style + ExplorerNode.css
  return FolderContent
}) satisfies QuartzComponentConstructor