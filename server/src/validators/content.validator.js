const { z } = require('zod');

const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1).max(150).optional(),
  authorName: z.string().min(1).max(100).optional(),
  authorSubtitle: z.string().max(150).optional(),
  deskStickyNote: z.string().min(1).max(250).optional(),
  musicBoxLabel: z.string().min(1).max(50).optional(),
  deskPageTitle: z.string().max(100).optional(),
  deskProjectsTitle: z.string().max(100).optional(),
  deskSnippetsTitle: z.string().max(100).optional(),
  deskLogsTitle: z.string().max(100).optional(),
  deskSneakPeeksTitle: z.string().max(100).optional()
});

const homeSettingsSchema = z.object({
  welcomeGreeting: z.string().max(100).optional(),
  heroTitle: z.string().min(1).max(150).optional(),
  heroTagline: z.string().max(300).optional(),
  aboutCardTitle: z.string().min(1).max(100).optional(),
  aboutCardQuote: z.string().max(250).optional(),
  aboutCardSummary: z.string().min(1).optional(),
  aboutCardClosing: z.string().optional(),
  featuredBookId: z.string().nullable().optional().transform(val => (val === '' || val === 'none' ? null : val)),
  bannerTitlePrefix: z.string().max(100).optional(),
  bannerButtonText: z.string().max(50).optional()
});

const aboutSettingsSchema = z.object({
  pageTitle: z.string().min(1).max(100).optional(),
  pageSubtitle: z.string().max(200).optional(),
  whyIWrite: z.string().min(1).optional(),
  anonLocation: z.string().max(150).optional(),
  anonCompanion: z.string().max(150).optional(),
  anonBeverage: z.string().max(150).optional()
});

const bookSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe (lowercase letters, numbers, hyphens)'),
  title: z.string().min(1).max(150),
  genre: z.string().max(100).optional().default(''),
  tagline: z.string().max(250).optional().default(''),
  synopsis: z.string().min(1),
  coverImage: z.string().nullable().optional().transform(v => (v === '' ? null : v)),
  coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#aa7f66'),
  coverDoodle: z.enum(['quill', 'key', 'star', 'candle', 'moon', 'potion', 'dagger', 'heart', 'book', 'leaf']).optional().default('quill'),
  characterArtImage: z.string().nullable().optional().transform(v => (v === '' ? null : v)),
  characterArtCaption: z.string().nullable().optional().transform(v => (v === '' ? null : v)),
  characterArtPlaceholder: z.string().nullable().optional().transform(v => (v === '' ? null : v)),
  pinterestMoodboard: z.string().nullable().optional().transform(v => (v === '' ? null : v)),
  authorNotes: z.string().optional().default(''),
  published: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
  characters: z.array(z.object({
    name: z.string().min(1),
    role: z.string().optional().default(''),
    desc: z.string().optional().default('')
  })).optional().default([]),
  playlist: z.array(z.object({
    title: z.string().min(1),
    artist: z.string().optional().default('')
  })).optional().default([]),
  purchaseLinks: z.array(z.object({
    store: z.string().min(1),
    url: z.string().optional().default('#'),
    disabled: z.boolean().optional().default(false)
  })).optional().default([])
});

const writingProjectSchema = z.object({
  title: z.string().min(1).max(150),
  status: z.string().max(100).optional().default('Drafting'),
  progress: z.number().int().min(0).max(100).optional().default(0),
  wordCount: z.string().max(100).optional().default(''),
  synopsis: z.string().optional().default(''),
  isPrimary: z.boolean().optional().default(false)
});

const storeProductSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1),
  price: z.string().min(1).max(30),
  status: z.enum(['active', 'coming-soon', 'out-of-stock']).optional().default('coming-soon'),
  link: z.string().optional().default('#'),
  displayOrder: z.number().int().optional().default(0)
});

module.exports = {
  siteSettingsSchema,
  homeSettingsSchema,
  aboutSettingsSchema,
  bookSchema,
  writingProjectSchema,
  storeProductSchema
};
