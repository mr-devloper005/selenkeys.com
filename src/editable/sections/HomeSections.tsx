import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, CheckCircle2, FileText, Image as ImageIcon, Megaphone, Search, Star, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

const labelMap: Partial<Record<TaskKey, string>> = {
  listing: 'Places',
  pdf: 'Guides & Reports',
}

function taskLabel(task: TaskKey) {
  return labelMap[task] || SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function latestPostImages(posts: SitePost[], max = 5) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function TrustStars() {
  return (
    <span className="inline-flex items-center gap-1 text-[var(--slot4-accent)]">
      {[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-4 w-4 fill-current" />)}
    </span>
  )
}

export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Explore ${SITE_CONFIG.name}`

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 pb-16 pt-16 text-center sm:pb-20 sm:pt-20 lg:px-8 lg:pb-28">
        <EditableReveal>
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-sm text-[var(--slot4-muted-text)]">
            <TrustStars />
            <span>{pagesContent.home.hero.badge}</span>
          </div>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className="editable-display mx-auto mt-7 max-w-6xl text-balance text-5xl leading-[1.04] tracking-[-0.02em] sm:text-7xl lg:text-[6.4rem]">
            {heroTitle}
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
        </EditableReveal>
        <EditableReveal index={3}>
          <form action="/search" className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 shadow-[0_18px_70px_rgba(19,42,46,0.12)] sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
              <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
            </label>
            <button className="rounded-full bg-[var(--slot4-page-text)] px-7 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-page-text)]">
              Search
            </button>
          </form>
        </EditableReveal>

        <EditableReveal index={4}>
          <div className="mt-12 grid gap-4 md:grid-cols-[0.8fr_1.2fr_0.8fr] md:items-end">
            {heroImages.slice(0, 3).map((image, index) => (
              <div key={image} className={`overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)] ${index === 1 ? 'aspect-[16/8] md:aspect-[16/10]' : 'aspect-[4/3] md:translate-y-8'}`}>
                <img src={image} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {!heroImages.length ? (
              <div className="col-span-full rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-12 text-[var(--slot4-muted-text)]">
                Fresh visuals will appear here as new entries are published.
              </div>
            ) : null}
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  if (!categories.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8">
        <EditableReveal className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Explore</p>
            <h2 className="editable-display mt-3 text-4xl leading-[1.12] sm:text-5xl">Choose a lane, then keep moving.</h2>
          </div>
          <Link href={primaryRoute} className="hidden rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium transition hover:border-[var(--slot4-page-text)] sm:inline-flex">
            Browse latest
          </Link>
        </EditableReveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((task, index) => {
            const Icon = taskIcon[task.key] || FileText
            return (
              <EditableReveal key={task.key} index={index}>
                <Link href={task.route} className="group flex h-full flex-col rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-300 hover:border-[var(--slot4-page-text)]">
                  <Icon className="h-6 w-6 text-[var(--slot4-accent)]" />
                  <h3 className="editable-display mt-8 text-2xl">{taskLabel(task.key)}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{task.description}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ActivityCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post) || 'Entry'
  return (
    <EditableReveal index={index}>
      <Link href={href} className="group block overflow-hidden rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:border-[var(--slot4-page-text)]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" />
        </div>
        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{category}</p>
          <h3 className="editable-display mt-4 line-clamp-2 text-2xl leading-[1.18]">{post.title}</h3>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 150)}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Open entry <ArrowRight className="h-4 w-4" /></span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!activity.length) return null
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 lg:px-8 lg:py-28">
        <EditableReveal className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Latest</p>
            <h2 className="editable-display mt-3 text-4xl leading-[1.12] sm:text-6xl">Fresh records with practical context.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
            New local entries, reference resources and supporting posts appear in a flat card grid that mirrors the reference site’s restrained product-card rhythm.
          </p>
        </EditableReveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {activity.map((post, index) => (
            <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'This week', title: 'Recently added' },
  browse: { eyebrow: 'This month', title: 'Worth another look' },
  index: { eyebrow: 'Archive', title: 'Useful any time' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 4), href: primaryRoute },
          { key: 'browse', posts: posts.slice(4, 8), href: primaryRoute },
          { key: 'index', posts: posts.slice(8, 12), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.slice(0, 3).map((section, sectionIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        return (
          <section key={section.key} className={sectionIndex % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-panel-bg)]'}>
            <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8">
              <EditableReveal className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-3 text-4xl leading-[1.12] sm:text-5xl">{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium transition hover:border-[var(--slot4-page-text)]">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {section.posts.slice(0, 4).map((post, index) => (
                  <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-20 text-center lg:px-8 lg:py-28">
        <EditableReveal>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[var(--slot4-accent)]">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="editable-display mx-auto mt-6 max-w-4xl text-4xl leading-[1.1] text-white sm:text-6xl">{pagesContent.home.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">{pagesContent.home.cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/create" className="rounded-full bg-white px-7 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)]">Submit</Link>
            <Link href="/contact" className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition hover:border-white">Contact</Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
