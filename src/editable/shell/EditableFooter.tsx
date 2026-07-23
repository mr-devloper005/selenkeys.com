'use client'

import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const taskLabel: Record<string, string> = {
  listing: 'Places',
  pdf: 'Guides & Reports',
}

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-8 lg:py-24">
        <div className="rounded-lg border border-white/15 bg-white/[0.03] p-8 text-center sm:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Keep exploring</p>
          <h2 className="editable-display mx-auto mt-4 max-w-4xl text-4xl leading-[1.12] text-white sm:text-6xl">
            Useful records are easier to trust when everything has a place.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent)]">
              <Search className="h-4 w-4" /> Search the collection
            </Link>
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-white">
              Submit <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
              </span>
              <span className="editable-display text-2xl text-white">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/62">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            
          </div>

          <FooterColumn title="Discovery" links={taskLinks.map((task) => ({ label: taskLabel[task.key] || task.label, href: task.route }))} />
          <FooterColumn title="Resources" links={[{ label: 'Search', href: '/search' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }]} />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Account</p>
            <div className="mt-4 grid gap-2">
              {session ? (
                <>
                  <Link href="/create" className="text-sm text-white/65 transition hover:text-white">Submit</Link>
                  <button type="button" onClick={logout} className="text-left text-sm text-white/65 transition hover:text-white">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-white/65 transition hover:text-white">Sign in</Link>
                  <Link href="/signup" className="text-sm text-white/65 transition hover:text-white">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/50">
        © {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{title}</p>
      <div className="mt-4 grid gap-2">
        {links.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white">
            {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
