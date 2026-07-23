import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Articles with room to think and move.',
    description: 'Browse essays, explainers and updates in a calm editorial rhythm.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Reading surfaces need space, hierarchy and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving offers and timely notes.',
    description: 'Scan short posts, opportunities and updates built for quick action.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize urgency, short summaries and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Useful links arranged like curated shelves.',
    description: 'Move through collections, references and external resources without losing context.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Profiles with identity and trust cues.',
    description: 'Discover people, teams and entities through clear, scannable cards.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Profile cards'],
  },
  pdf: {
    eyebrow: 'Guides & Reports',
    headline: 'Guides & Reports for deeper reference work.',
    description: 'Open, preview and download reference files with enough context to know what is inside.',
    filterLabel: 'Filter guide type',
    secondaryNote: 'Reference surfaces need file context, previews and clear download paths.',
    chips: ['Reference files', 'Preview ready', 'Downloadable'],
  },
  listing: {
    eyebrow: 'Places',
    headline: 'Places worth finding, comparing and contacting.',
    description: 'Browse local records with trust cues, practical details and direct action paths.',
    filterLabel: 'Filter place category',
    secondaryNote: 'Prioritize comparison, location and direct contact paths.',
    chips: ['Local records', 'Compare', 'Contact ready'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with a gallery-first rhythm.',
    description: 'Browse visual entries led by image, composition and quick context.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
