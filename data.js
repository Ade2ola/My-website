// data.js - Contains all the content and configurations for Dessy Ackerman's website.

window.authorData = {
  siteConfig: {
    siteTitle: "Dessy Ackerman | Storyteller & Dreamer",
    authorName: "Dessy Ackerman",
    authorSubtitle: "Storyteller & Dreamer",
    deskStickyNote: "Remember: The magic is in the rewriting.",
    musicBoxLabel: "Cozy Music Box",
    socialLinks: [
      { id: "pinterest", name: "Pinterest", icon: "📌", url: "https://pinterest.com", active: true },
      { id: "instagram", name: "Instagram", icon: "📷", url: "https://instagram.com", active: true },
      { id: "substack", name: "Substack", icon: "✍️", url: "https://substack.com", active: true },
      { id: "tiktok", name: "TikTok", icon: "🎵", url: "https://tiktok.com", active: true }
    ],
    mascot: {
      name: "Poe the Desk Cat",
      initialSpeech: "Meow? (Click me!)",
      quotes: [
        "\"The first draft is just sand. You mold it into sandcastles later. Now, please rub my chin.\"",
        "\"I see you are typing. I too like to press keys: lkasjdlkfjaskldfj.\"",
        "\"A keyboard is warm. That is why I lie on it. Not because of your grammar.\"",
        "\"A library isn't complete without a shadow with claws. Write more spells!\"",
        "\"If the plot is stuck, try pushing a mug off the counter. It clears the mind.\"",
        "\"Staring out into the fog counts as writing. I do it for hours. Mostly looking for gulls.\"",
        "\"Make it cozy, make it mysterious, but most importantly... make it smell like fish.\""
      ]
    }
  },

  homeData: {
    welcomeGreeting: "Hello dear reader,",
    heroTitle: "Welcome to Dessy's Archive",
    heroTagline: "Storyteller. Dreamer. Avid coffee lover. Writing secret worlds from the cozy corners of the universe.",
    aboutCardTitle: "About the Author",
    aboutCardQuote: "Stories are houses built out of whispers.",
    aboutCardSummary: "I'm a reader with a wide, curious taste for all kinds of stories and writing styles. My mind is always wandering—filled with daydreams and constant imaginary conversations that never seem to quiet down. I write as a way to give those thoughts a place to live, building small worlds out of everything swirling in my head.",
    aboutCardClosing: "Explore this archive to read the snippets pinned on my desk, listen to the soundtracks driving the chapters, and uncover the worlds of fantasy and shadows.",
    featuredBookId: "our-hundred-days",
    bannerTitlePrefix: "Currently Drafting:",
    bannerButtonText: "Visit Writing Desk →"
  },

  aboutData: {
    pageTitle: "About Dessy",
    pageSubtitle: "Writing secret stories from behind a mask of parchment and ink.",
    tagline: "Storyteller. Dreamer. Avid coffee lover. Writing secret worlds from the cozy corners of the universe.",
    whyIWrite: "I'm a reader with a wide, curious taste for all kinds of stories and writing styles. My mind is always wandering—filled with daydreams and constant imaginary conversations that never seem to quiet down. I write as a way to give those thoughts a place to live, building small worlds out of everything swirling in my head. And I write because I believe that even fictional characters deserve to be seen, felt, and remembered by someone out there.",
    favoriteTropes: [
      { name: "Found Family", description: "Misfits finding a home in one another." },
      { name: "Enemies to Lovers", description: "The delicious tension of two rivals slowly finding common ground." },
      { name: "Grumpy x Sunshine", description: "A dark cloud falling for a warm sunbeam." },
      { name: "Academic Rivals", description: "Late nights in libraries, competing for top marks and secretly falling in love." },
      { name: "Haunted Artefacts", description: "Objects with a soul, carrying voices from a forgotten past." },
      { name: "Slow Burn", description: "So slow you can feel every spark, every sigh, and every brushing of hands." }
    ],
    favoriteGenres: [
      "Fantasy (I would read any type of fantasy)",
      "Romance (Any setting is fine with me)",
      "Thriller & Suspense",
      "Historical fiction (with yearning)"
    ],
    hobbies: [
      "I play the violin",
      "Paint & draw (traditional and digital)",
      "Crochet and sewing",
      "Reading",
      "Anime watcher",
      "3D animation",
      "Coding",
      "Journalling",
      "I know it's a lot, I like to collect hobbies!"
    ],
    funFacts: [
      "Most of my stories and scenes are inspired by random dialogues, which I then build an entire world around.",
      "I keep a dedicated journal for each story where I rant and literally give my own personal review on each character.",
      "It hurts so much to kill off some of my characters. I genuinely mourn them.",
      "I have a coffee addiction... kinda. Okay, maybe definitely."
    ],
    anonymityDetails: {
      location: "My favorite local pastries shop, surrounded by the smell of warm ovens.",
      companion: "A plushie of Rafayel from Love and Deepspace .",
      beverage: "Coffee (a cup is always next to my keyboard)."
    }
  },

  bookshelfConfig: {
    pageTitle: "The Bookshelf",
    pageSubtitle: "Step inside stories written in ink, magic, and shadow. Click on any volume to open its scrapbook journal."
  },

  booksData: [
    {
      id: "our-hundred-days",
      title: "Our Hundred Days",
      coverImage: "assets/our-hundred-days.jpg",
      genre: "Cozy Fantasy / Romance",
      tagline: "A story about healing, small steps, and the days that shape our forever.",
      synopsis: "Deep in the whispering forest of Aveline, Elora Vance runs a struggling bookstore where the books are alive but slowly losing their voices. When a reclusive, scarred alchemist named Alistair Thorne arrives with a rusted iron quill that bleeds golden ink, their fates entwine. To save the library, they must translate an ancient ledger of forgotten dreams. But some dreams are meant to stay asleep, and others are far too dangerous to write down.",
      tropes: ["Found Family", "Grumpy x Sunshine", "Slow Burn", "Magical Library", "Forced Proximity"],
      characters: [
        {
          name: "Elora Vance",
          role: "The Dreamer & Bookseller",
          desc: "A cheerful bibliophile who talks to books, grows glow-in-the-dark ivy, and brews potions that taste like warm apple pie. She hides her own grief behind a bright smile."
        },
        {
          name: "Alistair Thorne",
          role: "The Reclusive Alchemist",
          desc: "A quiet, scarred alchemist obsessed with fixing his past alchemy failures. He claims he prefers isolation, yet always makes sure there's hot tea waiting for Elora."
        },
        {
          name: "Bramble",
          role: "The Book-Sprite",
          desc: "A tiny creature made of moss and scrap paper who lives in the rafters, steals bookmarks, and occasionally leaves acorn caps as rent."
        }
      ],
      characterArtPlaceholder: "A cozy ink-wash sketch of Elora's plant-filled bookstore with a tiny book-sprite hiding behind a leather volume.",
      pinterestMoodboard: "https://pinterest.com",
      playlist: [
        { title: "Rain on the Greenhouse Glass", artist: "Cozy Lofi Cabin" },
        { title: "Golden Ink & Rusting Gears", artist: "The Alchemist's Quintet" },
        { title: "Alistair's Hearth", artist: "Acoustic Fireplace" },
        { title: "Whispers of the Spruce Trees", artist: "Forest Folk" }
      ],
      purchaseLinks: [
        { store: "IndieBound", url: "https://indiebound.org", disabled: false },
        { store: "Bookshop.org", url: "https://bookshop.org", disabled: false },
        { store: "Signed Copy (Coming Soon)", url: "#", disabled: true }
      ],
      authorNotes: "This book was written during a cold winter when I needed a place to escape. Elora's bookstore is based on a tiny shop I found in Edinburgh that smelled of old paper, rain, and cinnamon. Writing Bramble, the book-sprite, was pure joy—he is based on my cat's habit of shredding my notes.",
      coverColor: "#aa7f66",
      coverDoodle: "quill"
    },
    {
      id: "whispers-in-the-ink",
      title: "Whispers in the Ink",
      genre: "Dark Academia / Gothic Romance",
      tagline: "Secrets are written in blood; love is written in shadow.",
      synopsis: "At the prestigious, fog-drenched Blackwood Conservatory, piano student Jane Eyrewood finds an unsigned diary hidden inside a century-old grand piano. The pages seem to answer her writing in real-time, guided by a brilliant, cynical shadow named Julian. As Jane falls under the spell of the diary, a series of mysterious disappearances plagues the conservatory. Jane must decide if Julian is her muse, or the monster everyone is searching for.",
      tropes: ["Academic Rivals", "Enemies to Lovers", "Haunted Diary", "Forced Proximity", "Secrets & Lies"],
      characters: [
        {
          name: "Jane Eyrewood",
          role: "The Aspiring Pianist",
          desc: "Driven and stubborn, Jane is determined to win the Conservatory Gold Medal at any cost. Her music is technically perfect, but she lacks the passion until the shadow arrives."
        },
        {
          name: "Julian Vance",
          role: "The Whispering Shadow",
          desc: "A brilliant, arrogant composer from 1924 trapped in the diary's ink. He is possessive, sarcastic, and harbors a dark secret about the conservatory's history."
        }
      ],
      characterArtPlaceholder: "A gothic, dark sketch of a candlelit piano keyboard, with ink mist rising to form the silhouette of a man holding a music sheet.",
      pinterestMoodboard: "https://pinterest.com",
      playlist: [
        { title: "Nocturne in C# Minor, Op. Posth.", artist: "Frederic Chopin" },
        { title: "Letters Written in Dust", artist: "The Blackwood Cello Ensemble" },
        { title: "Cello & Shadow", artist: "Jane & Julian (Piano/Cello duet)" },
        { title: "The Dark Room at Midnight", artist: "Gothic Orchestration" }
      ],
      purchaseLinks: [
        { store: "Barnes & Noble", url: "https://barnesandnoble.com", disabled: false },
        { store: "Amazon", url: "https://amazon.com", disabled: false },
        { store: "Signed Copy (Coming Soon)", url: "#", disabled: true }
      ],
      authorNotes: "For everyone who spent too much time in dark libraries listening to cello music. Julian's dialogue was the most fun (and terrifying) to write. If you listen closely to the Chopin piece in the playlist while reading chapter 15, you'll hear the exact tempo I was writing to.",
      coverColor: "#443025",
      coverDoodle: "key"
    }
  ],

  deskData: {
    pageTitle: "Writing Desk",
    projectsTitle: "Current Work-in-Progress",
    snippetsTitle: "Manuscript Snippets & Scraps",
    logsTitle: "Logs from the Desk",
    sneakPeeksTitle: "Sneak Peeks & Extras",
    projects: [
      {
        id: "kindred",
        title: "Kindred",
        status: "Drafting Chapter 14",
        progress: 68,
        wordCount: "58,240 / 85,000 words",
        synopsis: "A cozy but mysterious fantasy about two souls bound across lifetimes, dealing with ancient magic, secrets, and a connection that defies the boundaries of time."
      }
    ],
    updates: [
      {
        date: "June 20, 2026",
        text: "Drafted a very cozy scene today involving a tea party with a grumpy dragon. The dragon preferred chamomile over Earl Grey, which felt historically accurate for a beast of fire. Word count is climbing slowly but surely!"
      },
      {
        date: "May 30, 2026",
        text: "Finished structural edits for *Whispers in the Ink*! Sent it off to my beta readers. Now, time for two days of pure sleep, coffee, and reading book blogs."
      },
      {
        date: "April 12, 2026",
        text: "Bramble, my little book-sprite character, is officially getting a sticker sheet! I've been sketching him all afternoon instead of writing Chapter 10. No regrets."
      }
    ],
    snippets: [
      {
        source: "Kindred, Chapter 4",
        text: "\"The magic in lavender isn't in its ability to sleep,\" Maeve said, stirring the violet pot as steam curled around her nose. \"It's in its ability to quiet the mind enough to let the dreams speak. There is a great difference between slumbering and dreaming, dear knight.\"\n\nThe frog on the window sill blinked its golden eyes and let out a soft, doubtful croak."
      },
      {
        source: "Deleted Scene: Our Hundred Days",
        text: "Alistair held the lamp high, casting long, wavering shadows across the floorboards. \"If you step on the floorboards that groan, they will wake up. The books in the history section are particularly cranky when disturbed after midnight.\"\n\n\"And what happens if they wake?\" Elora whispered, her heel hovering an inch above a knot in the wood.\n\n\"They lecture you on the salt tax of 1642,\" he said, his lips twitching. \"For hours.\""
      }
    ],
    quotes: [
      "\"We are all just drafts of the stories we hope to leave behind.\" — Dessy Ackerman",
      "\"Some stories don't want to be told; they want to be lived.\" — Our Hundred Days",
      "\"It is a dangerous thing, falling in love with a shadow. They disappear when the light comes.\" — Whispers in the Ink",
      "\"A library isn't a collection of books. It is a gathering of open doors.\" — Dessy Ackerman",
      "\"Magic isn't always fireworks. Sometimes, it's just a warm cup of tea brewed exactly when you need it.\" — Kindred"
    ],
    sneakPeeks: [
      {
        title: "Map of Aveline's Whispering Forest",
        desc: "A sneak peek at the hand-inked cartography for the endpapers of *Our Hundred Days*."
      },
      {
        title: "Jane's Music Sheet",
        desc: "A reproduction of the handwritten piano sonata sheet Jane finds tucked inside the piano in *Whispers in the Ink*."
      }
    ]
  },

  adminConfig: {
    passcode: "dessy123"
  },

  storeData: [
    {
      id: "signed-our-hundred-days",
      title: "Signed Hardcover: Our Hundred Days",
      description: "Get a personalized, hand-signed hardcover edition of Our Hundred Days, complete with a custom wax-sealed letter and botanical bookmark.",
      price: "$28.00",
      status: "coming-soon",
      link: "#"
    },
    {
      id: "bramble-sticker-pack",
      title: "Bramble the Book-Sprite Sticker Pack",
      description: "A set of five cozy, die-cut vinyl stickers featuring Bramble reading, drinking tea, and sleeping in bookshelves.",
      price: "$8.50",
      status: "coming-soon",
      link: "#"
    }
  ]
};
