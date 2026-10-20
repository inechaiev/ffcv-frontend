import type { MetadataRoute } from 'next'
import { competitionLabels } from '@/lib/leagues'
import { getAllMatches } from '@/lib/matches'
import { siteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let matches: Awaited<ReturnType<typeof getAllMatches>> = []
  try {
    matches = await getAllMatches()
  } catch (error) {
    console.log('[sitemap] Error loading matches:', error instanceof Error ? error.message : error)
  }
  const now = new Date()

  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${siteUrl}/partidos`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/calendario`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ]

  const leagues: MetadataRoute.Sitemap = Object.keys(competitionLabels).map((id) => ({
    url: `${siteUrl}/?league=${id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const matchPages: MetadataRoute.Sitemap = matches.map((match) => ({
    url: `${siteUrl}/match/${match.match_id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  return [...pages, ...leagues, ...matchPages]
}
