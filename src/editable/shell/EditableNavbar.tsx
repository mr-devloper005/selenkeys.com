'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const staticLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const navLink = (item: { label: string; href: string }) => {
    const active = pathname === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={`relative overflow-hidden px-1 py-2 text-sm font-medium transition duration-300 ${
          active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
        }`}
      >
        {item.label}
        {active ? <span className="absolute inset-x-1 bottom-1 h-px bg-[var(--slot4-accent)]" /> : null}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-20 w-full max-w-[var(--editable-container)] items-center gap-5 px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition group-hover:border-[var(--slot4-page-text)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="editable-display block max-w-[210px] truncate text-xl leading-none">{SITE_CONFIG.name}</span>
            <span className="mt-1 hidden max-w-[240px] truncate text-[11px] text-[var(--slot4-muted-text)] sm:block">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {staticLinks.map(navLink)}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/search" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] transition hover:border-[var(--slot4-page-text)]">
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-sm font-medium text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-page-text)] sm:inline-flex">
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button type="button" onClick={logout} className="hidden rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--slot4-page-text)] sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--slot4-page-text)] sm:inline-flex">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-sm font-medium text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-page-text)] sm:inline-flex">
                <UserPlus className="h-4 w-4" /> Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-6 py-5 lg:hidden">
          <div className="grid gap-1">
            {[...staticLinks, { label: 'Search', href: '/search' }, ...(session ? [{ label: 'Submit', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }])].map(navLink)}
            {session ? (
              <button type="button" onClick={() => { logout(); setOpen(false) }} className="px-1 py-2 text-left text-sm font-medium text-[var(--slot4-muted-text)]">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
