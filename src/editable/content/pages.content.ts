import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Local records and reference files',
      description: 'Explore Places, Guides & Reports, articles, images and curated resources through one calm discovery platform.',
      openGraphTitle: 'Local records and reference files',
      openGraphDescription: 'Find useful local records and downloadable reference material in one connected browsing experience.',
      keywords: ['local directory', 'reference library', 'guides', 'reports', 'local records'],
    },
    hero: {
      badge: 'Reference-ready discovery',
      title: ['Find the places', 'and files worth keeping close.'],
      description: 'Search local records, open reference files, and move through connected resources without the usual browsing noise.',
      primaryCta: { label: 'Search the collection', href: '/search' },
      secondaryCta: { label: 'Submit a record', href: '/create' },
      searchPlaceholder: 'Search places, guides, topics and categories',
      focusLabel: 'Focus',
      featureCardBadge: 'Latest rotation',
      featureCardTitle: 'Fresh records and reference files shape the homepage.',
      featureCardDescription: 'New images, local entries and guides stay visible while the platform keeps its data flow intact.',
    },
    intro: {
      badge: 'How it works',
      title: 'A quieter way to browse local context and reference material.',
      paragraphs: [
        'The platform brings local records, long-form articles, saved resources and reference files into one connected surface.',
        'Visitors can start with a place, continue into a guide, or search across the whole site without learning separate browsing rules.',
        'Every section keeps the same rhythm: clear summaries, useful metadata, direct actions and lightweight discovery.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Places for local records and contact details.',
        'Guides & Reports for files that need preview and download actions.',
        'Articles, images and saved resources for supporting context.',
        'Clean navigation that keeps task archives out of the top bar.',
      ],
      primaryLink: { label: 'Search now', href: '/search' },
      secondaryLink: { label: 'Contact us', href: '/contact' },
    },
    cta: {
      badge: 'Contribute',
      title: 'Have a useful record or reference file to share?',
      description: 'Submit local details, a new guide, or supporting context so visitors can find it in the right place.',
      primaryCta: { label: 'Submit', href: '/create' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About us',
    title: 'A calm way to make sense of useful information.',
    description: `${slot4BrandConfig.siteName} is built to make helpful information easier to read, compare and act on without unnecessary noise.`,
    paragraphs: [
      'The site keeps the experience simple on purpose: clear structure, readable summaries and steady navigation that helps visitors understand what they are seeing.',
      'Each page is arranged around practical context, so people can scan quickly, slow down when needed and leave with a clearer next step.',
    ],
    values: [
      {
        title: 'Clear by design',
        description: 'Plain language, strong hierarchy and restrained layouts make the site easier to browse from the first screen.',
      },
      {
        title: 'Useful before decorative',
        description: 'Visual polish supports the content instead of competing with it, keeping important details close at hand.',
      },
      {
        title: 'Built to grow',
        description: 'The structure can expand over time while preserving a familiar rhythm for returning visitors.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what you need help with.',
    description: 'Send a question, correction, collaboration idea or support request. We will route your note to the right place.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search local records, reference files, topics and categories across the site.',
    },
    hero: {
      badge: 'Search the collection',
      title: 'Find places, guides and supporting context faster.',
      description: 'Use keywords, categories and content types to discover entries from every active section of the site.',
      placeholder: 'Search by keyword, topic, category or title',
    },
    resultsTitle: 'Latest searchable entries',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit a new entry for the site.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit a new entry.',
      description: 'Use your account to open the publishing workspace and prepare a clean entry for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Prepare a useful entry for the collection.',
      description: 'Choose the section, add details, and save a clear post with images, links, summary and body content.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your workspace.',
      description: 'Sign in to manage submissions, save details and continue publishing useful entries.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in successfully. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Account creation page for this site.',
      badge: 'Site access',
      title: 'Create your account and start contributing.',
      description: 'Create an account to access the publishing workspace and submit entries through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'More places',
      fallbackTitle: 'Place details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
