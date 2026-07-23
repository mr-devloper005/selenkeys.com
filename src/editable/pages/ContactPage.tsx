'use client'

import { CheckCircle2, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  { icon: MessageSquare, title: 'General questions', body: 'Ask about the site, the experience, or anything that needs a clearer answer.' },
  { icon: Mail, title: 'Content updates', body: 'Send a correction, context note, or useful detail that should be reviewed.' },
  { icon: Sparkles, title: 'Partnerships', body: 'Start a conversation about collaboration, publishing, or shared work.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8 lg:py-20">
          <EditableReveal className="border-b border-[var(--editable-border)] pb-10">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
            <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.62fr] lg:items-end">
              <h1 className="editable-display max-w-4xl text-5xl leading-[1.02] sm:text-7xl">{pagesContent.contact.title}</h1>
              <p className="max-w-xl text-lg leading-8 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
            </div>
          </EditableReveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <aside className="grid gap-4 lg:sticky lg:top-24">
              {lanes.map((lane, index) => (
                <EditableReveal
                  key={lane.title}
                  index={index}
                  className="rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[var(--slot4-accent)] hover:bg-[var(--slot4-surface-bg)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="editable-display text-2xl leading-tight">{lane.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}

              <EditableReveal index={lanes.length} className="rounded-xl bg-[var(--slot4-dark-bg)] p-6 text-[var(--slot4-dark-text)]">
                <p className="editable-display text-3xl leading-tight">We read every note with context.</p>
                <p className="mt-4 text-sm leading-7 text-[color-mix(in_srgb,var(--slot4-dark-text)_72%,transparent)]">
                  Include links, names, screenshots, or extra background when they help us understand the request.
                </p>
              </EditableReveal>
            </aside>

            <EditableReveal className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 shadow-[var(--editable-shadow-soft)] sm:p-7 lg:p-9">
              <div className="mb-8 flex flex-col gap-5 border-b border-[var(--editable-border)] pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">Direct message</p>
                    <h2 className="editable-display mt-1 text-3xl leading-none">{pagesContent.contact.formTitle}</h2>
                  </div>
                </div>
                <span className="editable-mono w-fit rounded-full border border-[var(--editable-border)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                  Secure form
                </span>
              </div>
              <EditableContactLeadForm />
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
