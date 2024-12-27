import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import config from "./quartz.config"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.LinksHeader({
    links: [
      {
        text: 'About me',
        url: `https://dechantoine.github.io/antoine-dechappe/about-me`,
        iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20technologist/Light/Color/man_technologist_color_light.svg'
      },
      {
        text: 'Research review',
        url: `https://dechantoine.github.io/antoine-dechappe/Research-review`,
        iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Microscope/Color/microscope_color.svg'
      },
      {
        text: 'Projects',
        url: `https://dechantoine.github.io/antoine-dechappe/Projects`,
        iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hammer%20and%20wrench/Color/hammer_and_wrench_color.svg'
      },
      {
        text: 'Bookmarks',
        url: `https://dechantoine.github.io/antoine-dechappe/Bookmarks`,
        iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bookmark/Color/bookmark_color.svg'
      }
    ],
  })],
  afterBody: [],
  footer: Component.Footer({
    links: {
      'GitHub': "https://github.com/dechantoine",
      'LinkedIn': "https://www.linkedin.com/in/antoine-dechappe/",
      'Email': 'mailto:dechantoine@gmail.com'
    },
  }),
}

// components for the index page
export const indexPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    Component.PageTitle(),
    Component.RecentNotes({
      title: "Recent writing" ,
      limit: 3,
      filter: (page) => !["index", "about-me", "projects"].includes(page.slug),
      showTags: false}),
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer()),
    Component.Darkmode(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    // Component.Search(),
    Component.RecentNotes({
      title: "Recent writing" ,
      limit: 3,
      filter: (page) => !["index", "about-me", "projects"].includes(page.slug),
      showTags: false}),
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(Component.Explorer()),
    Component.Darkmode(),
  ],
  right: [
    // Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    //Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
