import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Antoine Déchappe",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "antoine-does-ai.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Sans Mono",
        body: "Lexend",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 50%, rgba(3,119,143,1) 100%)",
          lightgray: "#84a6a6",
          gray: "#879b9b",
          darkgray: "#d4d4d4",
          dark: "#f6f6f6",
          secondary: "#9dc8e3",
          tertiary: "#e1f3ee",
          highlight: "rgba(2,179,152,0.15)",
          textHighlight: "rgba(2,179,152,0.15)",
        },
        darkMode: {
          light: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 50%, rgba(3,119,143,1) 100%)",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#e1f3ee",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-dark",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
          explorerOptions: {
            folderClickBehavior: "link",
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
          }
        }
      ),
      Plugin.BookmarksPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
