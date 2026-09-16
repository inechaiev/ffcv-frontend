'use client'

import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { SiteNav } from '@/components/site-nav'

type SiteHeaderProps = {
  title: string
  subtitle?: ReactNode
  search?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
  activeView?: 'schedule' | 'calendar'
  onViewChange?: (view: 'schedule' | 'calendar') => void
}

export function SiteHeader({
  title,
  subtitle,
  search,
  onSearchChange,
  showSearch = true,
  activeView = 'schedule',
  onViewChange,
}: SiteHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-navy text-navy-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(120% 90% at 12% -10%, oklch(0.32 0.12 265) 0%, transparent 55%), radial-gradient(90% 80% at 100% 0%, oklch(0.28 0.11 250) 0%, transparent 50%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-6 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <BrandLogo />
          <SiteNav activeView={activeView} onViewChange={onViewChange} />
        </div>

        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-extrabold italic uppercase tracking-tight text-balance md:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <div className="mt-2 text-sm text-navy-foreground/70">{subtitle}</div>
            ) : null}
          </div>

          {showSearch ? (
            <div className="relative w-full md:max-w-sm">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/50"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search ?? ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Buscar club..."
                aria-label="Buscar club"
                className="h-12 w-full rounded-full bg-white pl-11 pr-4 text-sm text-foreground shadow-lg outline-none ring-2 ring-transparent transition placeholder:text-muted-foreground focus:ring-orange"
              />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
