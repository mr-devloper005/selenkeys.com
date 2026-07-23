import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const proofPoints = [
  { label: 'Structure', value: 'Clear paths' },
  { label: 'Reading', value: 'Quiet focus' },
  { label: 'Updates', value: 'Steady care' },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8 lg:py-20">
          <EditableReveal className="overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
            <div className="grid gap-12 p-7 sm:p-10 lg:grid-cols-[1fr_0.44fr] lg:p-14">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent-2)]">{pagesContent.about.badge}</p>
                <h1 className="editable-display mt-6 max-w-5xl text-5xl leading-[1.02] sm:text-7xl">{pagesContent.about.title}</h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-[color-mix(in_srgb,var(--slot4-dark-text)_78%,transparent)]">
                  {pagesContent.about.description}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-8 border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent-2)]">Built as</p>
                  <p className="editable-display mt-4 text-4xl leading-none">{SITE_CONFIG.name}</p>
                </div>
                <div className="grid gap-3">
                  {proofPoints.map((item, index) => (
                    <EditableReveal
                      key={item.label}
                      index={index}
                      className="flex items-center justify-between border-t border-white/15 pt-4 text-sm"
                    >
                      <span className="text-[color-mix(in_srgb,var(--slot4-dark-text)_62%,transparent)]">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </EditableReveal>
                  ))}
                </div>
              </div>
            </div>
          </EditableReveal>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-16 lg:px-8 lg:pb-24">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <EditableReveal className="lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Principles</p>
              <h2 className="editable-display mt-5 max-w-xl text-4xl leading-[1.08] sm:text-5xl">Designed for attention, not distraction.</h2>
            </EditableReveal>

            <div className="grid gap-5">
              <EditableReveal className="rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[var(--editable-shadow-soft)] lg:p-10">
                <div className="space-y-6 text-lg leading-8 text-[var(--slot4-muted-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </EditableReveal>

              {pagesContent.about.values.map((value, index) => (
                <EditableReveal
                  key={value.title}
                  index={index}
                  className="group grid gap-5 rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:bg-[var(--slot4-surface-bg)]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="editable-display text-3xl leading-[1.12]">{value.title}</h3>
                    <span className="editable-mono rounded-full border border-[var(--editable-border)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
