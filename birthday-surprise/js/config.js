/* =====================================================================
   ✨ PERSONALIZATION FILE — this is the ONLY file you need to edit ✨

   • Replace every [PLACEHOLDER] in square brackets with your own text.
   • Use {herName} and {yourName} anywhere in a text to insert the
     names set below — change a name once and it updates everywhere.
   • Keep the quotation marks "like this" and the commas at line ends.
   • Photos go in  assets/images/   and music in  assets/audio/
   ===================================================================== */

window.BIRTHDAY_CONFIG = {

  /* ---------- 1. NAMES ---------- */
  herName: "[HER_NAME]",            // her name or nickname
  yourName: "[YOUR_NAME]",          // your name (shown in the letter's sign-off)

  /* Browser tab title */
  pageTitle: "A Birthday Surprise, Just for You ❤️",


  /* ---------- 2. THEME COLORS ---------- */
  theme: {
    bg: "#FFF0F5",
    softPink: "#FFD6E7",
    rose: "#F7A8B8",
    coral: "#F47778",
    burgundy: "#702E3A",
    white: "#FFFFFF"
  },


  /* ---------- 3. FIRST SCREEN ---------- */
  hero: {
    eyebrow: "For {herName}",
    title: "Happy Birthday, Beautiful! ❤️",
    subtitle: "Today is all about celebrating you and the happiness you bring into my life.",
    button: "Start Your Surprise 💗"
  },


  /* ---------- 4. PHOTO GALLERY ----------
     Add, remove or reorder photos freely (4–8 look best).
     To use your own photo: copy it into assets/images/ and change `src`.
     Tip: resize photos to ~1200px wide (under 300 KB) so the page loads fast. */
  memories: {
    eyebrow: "Chapter One",
    title: "Our Beautiful Memories",
    subtitle: "A few of my favourite moments, kept safe in one little place."
  },
  photos: [
    { src: "assets/images/photo-1.svg", alt: "Placeholder photo 1 — replace with your own", caption: "The beginning of something beautiful." },
    { src: "assets/images/photo-2.svg", alt: "Placeholder photo 2 — replace with your own", caption: "My favourite moments are the ones with you." },
    { src: "assets/images/photo-3.svg", alt: "Placeholder photo 3 — replace with your own", caption: "Every little memory means everything to me." },
    { src: "assets/images/photo-4.svg", alt: "Placeholder photo 4 — replace with your own", caption: "And somehow, you make ordinary days special." }
  ],


  /* ---------- 5. OUR STORY (timeline) ----------
     Replace each [DATE] and each [text in brackets] with your real story. */
  story: {
    eyebrow: "Chapter Two",
    title: "Our Story",
    subtitle: "Every love story is beautiful, but ours is my favourite.",
    milestones: [
      {
        date: "[DATE]",
        title: "The day we met",
        text: "[Write a few lines about the day you met — where you were and what you remember.]"
      },
      {
        date: "[DATE]",
        title: "Our first special memory",
        text: "[Describe the first memory together that you will never forget.]"
      },
      {
        date: "[DATE]",
        title: "My favourite moment with you",
        text: "[Tell her about your favourite moment together and why it matters to you.]"
      },
      {
        date: "[DATE]",
        title: "The reason you are so special to me",
        text: "[Tell her, in your own words, what makes her so special to you.]"
      }
    ]
  },


  /* ---------- 6. THE LETTER ----------
     Option A (easy): write your whole message in `yourBirthdayMessage` below.
                      Leave a blank line between paragraphs.
     Option B: keep "[YOUR_BIRTHDAY_MESSAGE]" as it is, and the starter
               letter in `paragraphs` will be used instead. */
  yourBirthdayMessage: "[YOUR_BIRTHDAY_MESSAGE]",

  letter: {
    eyebrow: "Chapter Three",
    heading: "A Little Letter for You 💌",
    paragraphs: [
      "Happy Birthday, my love. ❤️",
      "Today is your special day, but I feel lucky every day to have someone as wonderful as you in my life.",
      "Your smile makes ordinary moments feel special, and your presence brings a kind of happiness that words can never fully explain.",
      "I hope this new year of your life brings you endless reasons to smile, beautiful memories, success, peace, and all the love your heart deserves.",
      "No matter how many birthdays come and go, I hope you always remember how special you are to me.",
      "Today, this little corner of the internet is just for you. Every detail is made to celebrate the beautiful person you are.",
      "Happy Birthday, my beautiful girl. You deserve the world. ❤️"
    ],
    signOff: "Forever yours,",
    signature: "{yourName}",
    skipButton: "Show the whole letter"
  },


  /* ---------- 7. MUSIC ----------
     Put your song in assets/audio/ and change `file`.
     Only use music you have permission to use.
     Set file to "" to hide the player completely. */
  music: {
    file: "assets/audio/birthday-melody.mp3",
    title: "A Little Melody for You",
    unavailableText: "Music isn't available right now"
  },


  /* ---------- 8. BIRTHDAY CAKE ---------- */
  cake: {
    eyebrow: "Chapter Four",
    title: "Make a Wish",
    intro: "Close your eyes, think of something beautiful, and then tap the button.",
    button: "Make a Wish ✨",
    relightButton: "Light the Candles Again 🕯️",
    candles: 5,                      // 1 – 9
    finalMessage: "May your smile always shine as brightly as your dreams. Happy Birthday, my love! ❤️"
  },


  /* ---------- 9. FINAL SURPRISE ---------- */
  final: {
    title: "One Last Thing, Beautiful... 💗",
    paragraphs: [
      "If I could give you one thing in this world, it would be the ability to see yourself through my eyes, because then you would understand just how incredibly special you are to me.",
      "Happy Birthday, my favourite person. ❤️"
    ],
    button: "Replay Our Little Story"
  }
};
