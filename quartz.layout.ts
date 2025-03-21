import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import config from "./quartz.config"

const latestResearchComponent = Component.RecentNotes({
  title: "Latest research review",
  limit: 1,
  filter: (page) => page.slug.startsWith("Research-review/"),
  showTags: false
});

const recentNotesComponent = Component.RecentNotes({
  title: "Recent writing",
  limit: 3,
  filter: (page) => !["index", "about-me"].includes(page.slug) && !page.slug.startsWith("Bookmarks/") && !page.slug.startsWith("Research-review/"),
  showTags: false
});

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.MobileOnly(Component.PageTitle()),
    Component.LinksHeader({
      links: [
        {
          text: 'Blog',
          url: `/Blog/`,
          iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Black nib/Color/black_nib_color.svg'
        },
        {
          text: 'Research review',
          url: `/Research-review/`,
          iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Microscope/Color/microscope_color.svg'
        },
        {
          text: 'Projects',
          url: `/Projects/`,
          iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hammer%20and%20wrench/Color/hammer_and_wrench_color.svg'
        },
        {
          text: 'Bookmarks',
          url: `/Bookmarks/`,
          iconUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bookmark/Color/bookmark_color.svg'
        }
      ],
    })
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      'GitHub': "https://github.com/dechantoine",
      'LinkedIn': "https://www.linkedin.com/in/antoine-dechappe/",
      'Email': 'mailto:dechantoine@gmail.com'
    },
  }),
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
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(latestResearchComponent),
    Component.DesktopOnly(recentNotesComponent),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.Spacer(),
    Component.Search(),
  ],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(latestResearchComponent),
    Component.DesktopOnly(recentNotesComponent),
  ],
  right: [],
}

// CUSTOM LAYOUTS

// components for the index page
export const indexPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(latestResearchComponent),
    Component.DesktopOnly(recentNotesComponent),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for the bookmarks page
export const bookmarksPageLayout: PageLayout = {
  beforeBody: [
    Component.IntroText({
      text: "Here’s a collection of resources that I’ve found incredibly useful, inspiring and still relevant over the years. I hope you’ll discover something here that sparks your interest too!",
    }),
    Component.Spacer(),
    Component.Search(),
  ],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(latestResearchComponent),
    Component.DesktopOnly(recentNotesComponent),
  ],
  right: [],
}

// components for the research review page
export const researchReviewListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.Spacer(),
    Component.Search(),
  ],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(latestResearchComponent),
    Component.DesktopOnly(recentNotesComponent),
  ],
  right: [],
}
