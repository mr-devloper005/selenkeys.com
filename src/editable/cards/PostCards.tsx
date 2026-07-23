import Link from 'next/link'
import { ArrowRight, Clock3, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
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

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:border-[var(--slot4-page-text)] lg:grid-cols-[1.15fr_0.85fr]">
      <div className="min-h-[360px] p-8 sm:p-10 lg:p-12">
        <p className={dc.type.eyebrow}>{label}</p>
        <h3 className="editable-display mt-8 max-w-3xl text-4xl leading-[1.08] sm:text-6xl">{post.title}</h3>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 210)}</p>
        <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-[var(--slot4-page-text)]">
          Open entry <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <div className="min-h-[360px] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`group block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
        <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="p-6">
          <p className={dc.type.eyebrow}>No. {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
          <h3 className="editable-display mt-4 line-clamp-3 text-2xl leading-[1.18]">{post.title}</h3>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 135)}</p>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <EditableReveal index={index}>
      <Link href={href} className="group grid min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-4 rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 transition duration-300 hover:border-[var(--slot4-page-text)]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-medium">{index + 1}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--slot4-accent)]"><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="editable-display mt-2 line-clamp-2 text-xl leading-[1.2]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <EditableReveal index={index}>
      <Link href={href} className="group grid min-w-0 gap-5 overflow-hidden rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 transition duration-300 hover:border-[var(--slot4-page-text)] sm:grid-cols-[240px_minmax(0,1fr)]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[200px]">
          <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="min-w-0 p-2 sm:py-5 sm:pr-5">
          <p className={dc.type.eyebrow}>Read {String(index + 1).padStart(2, '0')}</p>
          <h2 className="editable-display mt-3 line-clamp-3 text-3xl leading-[1.1]">{post.title}</h2>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Open article <FileText className="h-4 w-4" /></span>
        </div>
      </Link>
    </EditableReveal>
  )
}
