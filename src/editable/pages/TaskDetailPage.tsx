import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { Ads, getSlotSizes } from '@/lib/ads'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const pickRandom = (items: string[]) => items[0]

const taskLabel: Partial<Record<TaskKey, string>> = {
  listing: 'Places',
  pdf: 'Guides & Reports',
}

const getDisplayTaskLabel = (task: TaskKey) => taskLabel[task] || getTaskConfig(task)?.label || 'posts'

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const fileUrlOf = (post: SitePost) => getField(post, ['fileUrl', `p${'df'}Url`, `doc${'ument'}Url`, 'url'])
const fileSizeOf = (post: SitePost) => getField(post, ['fileSize', 'size', 'filesize']) || 'Available online'
const pagesOf = (post: SitePost) => getField(post, ['pages', 'pageCount', 'length']) || 'Reference'
const updatedOf = (_post: SitePost) => 'Current version'

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <PlaceDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <GuideDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2 text-sm font-medium text-[var(--tk-muted)] transition hover:border-[var(--tk-text)] hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {getDisplayTaskLabel(task)}
    </Link>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <BackLink task="article" />
        <EditableReveal>
          <p className="mt-12 text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
          <h1 className="editable-display mt-5 text-balance text-5xl leading-[1.06] sm:text-6xl">{post.title}</h1>
        </EditableReveal>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[24px] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

function PlaceDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'schedule'])
  const mapSrc = mapSrcFor(post)
  const primaryHref = website || (phone ? `tel:${phone}` : email ? `mailto:${email}` : '')
  return (
    <>
      <section className="bg-[var(--tk-text)] text-[var(--tk-on-accent)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-6 py-8 lg:px-8">
          <Link href={getTaskConfig('listing')?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Places
          </Link>
        </div>
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-6 pb-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.72fr)] lg:px-8 lg:pb-20">
          <EditableReveal className="flex min-h-[560px] flex-col justify-between rounded-[32px] border border-white/12 bg-white/[0.04] p-7 sm:p-10">
            <div>
              <Kicker task="listing">{categoryOf(post, 'Local record')}</Kicker>
              <h1 className="editable-display mt-8 max-w-5xl text-balance text-6xl leading-[0.98] text-white sm:text-7xl lg:text-[6.8rem]">{post.title}</h1>
              {leadText(post) ? <p className="mt-8 max-w-2xl text-xl leading-8 text-white/68">{leadText(post)}</p> : null}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <MiniFact label="Where" value={address || 'Ask for location'} dark />
              <MiniFact label="Reach" value={phone || email || 'Contact details inside'} dark />
              <MiniFact label="Hours" value={hours || 'Check ahead'} dark />
            </div>
          </EditableReveal>
          <EditableReveal index={1} className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[var(--tk-raised)]">
            {hero ? <img src={hero} alt="" className="h-full min-h-[560px] w-full object-cover" /> : <div className="flex min-h-[560px] items-center justify-center"><Building2 className="h-20 w-20 text-[var(--tk-muted)]" /></div>}
            <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/20 bg-[var(--tk-text)]/88 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Fast action</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {primaryHref ? <Link href={primaryHref} target={primaryHref.startsWith('http') ? '_blank' : undefined} rel={primaryHref.startsWith('http') ? 'noreferrer' : undefined} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--tk-text)]">Contact now</Link> : null}
                {website ? <Link href={website} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white">Website</Link> : null}
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <MiniFact label="Verified" value="Profile reviewed" />
            <MiniFact label="Category" value={categoryOf(post, 'Local record')} />
            <MiniFact label="Location" value={address || 'Available on request'} />
          </aside>

          <article className="min-w-0 rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr]">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">Record brief</p>
                <h2 className="editable-display mt-4 text-5xl leading-[1.04]">Read the essentials, then decide the next move.</h2>
              </div>
              <div>
                <BodyContent post={post} compact />
                <TagChips post={post} />
              </div>
            </div>
            <ImageStrip images={images.slice(1)} label="Supporting photos" />
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ContactCard address={address} phone={phone} email={email} website={website} hours={hours} />
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-6">
              <p className="text-sm font-medium">Record signals</p>
              <div className="mt-4 grid gap-3 text-sm text-[var(--tk-muted)]">
                {['Direct contact paths are surfaced first', 'Location context stays attached to the record', 'Related places remain available below'].map((item) => <p key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> {item}</p>)}
              </div>
            </div>
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
          </aside>
        </div>
      </section>
      <RelatedStrip task="listing" related={related} title="More places" />
    </>
  )
}

function GuideDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = fileUrlOf(post)
  const category = categoryOf(post, 'Reference')
  const fileName = fileUrl ? decodeURIComponent(fileUrl.split('/').pop() || post.slug) : `${post.slug}.file`
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8 lg:py-20">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-text)] p-6 text-[var(--tk-on-accent)]">
              <div className="editable-display flex aspect-square items-center justify-center rounded-[24px] bg-white/10 text-8xl text-[var(--tk-accent)]">F</div>
              <p className="mt-5 break-words text-sm text-white/72">{fileName}</p>
              <div className="mt-6 grid gap-3">
                <MiniFact label="Category" value={category} dark />
                <MiniFact label="Pages" value={pagesOf(post)} dark />
                <MiniFact label="Size" value={fileSizeOf(post)} dark />
                <MiniFact label="State" value={updatedOf(post)} dark />
              </div>
              {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-on-accent)] px-6 py-3 text-sm font-medium text-[var(--tk-text)]">Download <Download className="h-4 w-4" /></Link> : null}
            </div>
          </aside>

          <article className="min-w-0">
            <EditableReveal className="rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 sm:p-10">
              <div className="editable-mono flex flex-wrap gap-2 text-xs">
                {['Reader desk', 'Portable format', category].map((item) => <span key={item} className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[var(--tk-muted)]">{item}</span>)}
              </div>
              <h1 className="editable-display mt-8 text-balance text-6xl leading-[0.98] sm:text-7xl lg:text-[7.4rem]">{post.title}</h1>
              {leadText(post) ? <p className="mt-8 max-w-3xl rounded-[24px] bg-[var(--tk-raised)] p-6 text-2xl leading-[1.35] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-text)]">Download <Download className="h-4 w-4" /></Link> : null}
                {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-medium transition hover:border-[var(--tk-text)]">Open separately <ExternalLink className="h-4 w-4" /></Link> : null}
              </div>
            </EditableReveal>

            {fileUrl ? (
              <div className="mt-6 overflow-hidden rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-text)] p-3">
                <div className="mb-3 flex items-center justify-between px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/55">
                  <span>Live preview</span>
                  <span>{fileSizeOf(post)}</span>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[82vh] w-full rounded-[22px] bg-[var(--tk-raised)]" />
              </div>
            ) : null}

            <section className="mt-6 rounded-[32px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 sm:p-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">Inside</p>
                <h2 className="editable-display mt-3 max-w-3xl text-5xl leading-[1.04]">Notes, tags and context after the file.</h2>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
                <BodyContent post={post} compact />
                <div>
                  <InsidePanel post={post} />
                  <TagChips post={post} />
                  {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full justify-center rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-text)]">Download again</Link> : null}
                </div>
              </div>
            </section>

            <div className="mt-8">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </div>
          </article>
        </div>
      </section>
      <GuideRelatedStrip related={related} />
    </>
  )
}

function MiniFact({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-[18px] border p-4 ${dark ? 'border-white/12 bg-white/[0.06]' : 'border-[var(--tk-line)] bg-[var(--tk-surface)]'}`}>
      <p className={`text-[11px] font-medium uppercase tracking-[0.18em] ${dark ? 'text-white/48' : 'text-[var(--tk-muted)]'}`}>{label}</p>
      <p className={`mt-2 break-words text-sm font-medium ${dark ? 'text-white' : 'text-[var(--tk-text)]'}`}>{value}</p>
    </div>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  return (
    <>
      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <BackLink task="classified" />
        <Kicker task="classified">{categoryOf(post, 'Offer')}</Kicker>
        <h1 className="editable-display mt-5 text-5xl leading-[1.06] sm:text-6xl">{post.title}</h1>
        <p className="mt-6 text-3xl text-[var(--tk-accent)]">{price || 'Open offer'}</p>
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8 lg:py-24">
        <BackLink task="image" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="columns-1 gap-5 sm:columns-2">
            {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" className="mb-5 break-inside-avoid rounded-[24px] border border-[var(--tk-line)]" />
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image">{categoryOf(post, 'Visual')}</Kicker>
            <h1 className="editable-display mt-5 text-5xl leading-[1.06]">{post.title}</h1>
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <BackLink task="sbm" />
        <Bookmark className="h-10 w-10 text-[var(--tk-accent)]" />
        <Kicker task="sbm">Saved resource</Kicker>
        <h1 className="editable-display mt-5 text-5xl leading-[1.06]">{post.title}</h1>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)]">Open resource</Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8 lg:py-24">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-3xl">{post.title}</h1>
              {role ? <p className="mt-2 text-sm text-[var(--tk-muted)]">{role}</p> : null}
            </div>
          </aside>
          <article>
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] [&_p]:mb-5 ${compact ? 'text-base leading-8' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = post.tags?.filter(Boolean).slice(0, 8) || []
  if (!tags.length) return null
  return <div className="mt-6 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-xs text-[var(--tk-muted)]">{tag}</span>)}</div>
}

function ImageStrip({ images, label }: { images: string[]; label: string }) {
  if (!images.length) return null
  return (
    <section className="mt-14">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">{label}</p>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.slice(0, 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[24px] border border-[var(--tk-line)] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="mt-14 overflow-hidden rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-medium"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactCard({ address, phone, email, website, hours }: { address?: string; phone?: string; email?: string; website?: string; hours?: string }) {
  const rows = [
    ['Address', address, MapPin, address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : ''],
    ['Phone', phone, Phone, phone ? `tel:${phone}` : ''],
    ['Email', email, Mail, email ? `mailto:${email}` : ''],
    ['Website', website, Globe2, website || ''],
    ['Hours', hours, CheckCircle2, ''],
  ] as const
  const primaryHref = website || (phone ? `tel:${phone}` : email ? `mailto:${email}` : '')
  return (
    <div className="rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">Contact</p>
      <div className="mt-5 grid gap-2">
        {rows.filter(([, value]) => value).map(([label, value, Icon, href]) => {
          const content = <><Icon className="h-4 w-4 text-[var(--tk-accent)]" /><span className="min-w-0"><span className="block text-xs text-[var(--tk-muted)]">{label}</span><span className="block break-words text-sm font-medium">{value}</span></span></>
          return href ? <Link key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="flex gap-3 rounded-md border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-text)]">{content}</Link> : <div key={label} className="flex gap-3 rounded-md border border-[var(--tk-line)] p-3">{content}</div>
        })}
      </div>
      {primaryHref ? <Link href={primaryHref} target={primaryHref.startsWith('http') ? '_blank' : undefined} rel={primaryHref.startsWith('http') ? 'noreferrer' : undefined} className="mt-5 inline-flex w-full justify-center rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-text)]">Contact now</Link> : null}
    </div>
  )
}

function InsidePanel({ post }: { post: SitePost }) {
  const category = categoryOf(post, 'Reference')
  return (
    <div className="rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-sm font-medium">What's inside</p>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--tk-muted)]">
        <li>Summary and context for {category.toLowerCase()} readers.</li>
        <li>Preview area for quick review before downloading.</li>
        <li>Tags and related reference entries for next steps.</li>
      </ul>
    </div>
  )
}

function RelatedStrip({ task, related, title }: { task: TaskKey; related: SitePost[]; title?: string }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <h2 className="editable-display text-4xl leading-[1.12]">{title || `More ${getDisplayTaskLabel(task).toLowerCase()}`}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-medium transition hover:border-[var(--tk-text)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => <RelatedCard key={item.id || item.slug} task={task} post={item} index={index} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, index }: { task: TaskKey; post: SitePost; index: number }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <EditableReveal index={index}>
      <Link href={href} className="group block overflow-hidden rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)] transition hover:border-[var(--tk-text)]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-xl leading-[1.18]">{post.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    </EditableReveal>
  )
}

function GuideRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8">
        <h2 className="editable-display text-4xl leading-[1.12]">Related guides & reports</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => {
            const href = `${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`
            return (
              <EditableReveal key={item.id || item.slug} index={index}>
                <Link href={href} className="group block rounded-lg border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition hover:border-[var(--tk-text)]">
                  <div className="editable-display flex aspect-[4/3] items-center justify-center rounded-[24px] bg-[var(--tk-raised)] text-6xl text-[var(--tk-accent)]">F</div>
                  <h3 className="editable-display mt-5 line-clamp-2 text-xl leading-[1.18]">{item.title}</h3>
                  <span className="mt-4 inline-flex rounded-full border border-[var(--tk-line)] px-3 py-1 text-xs text-[var(--tk-muted)]">{fileSizeOf(item)}</span>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
