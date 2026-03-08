// ─────────────────────────────────────────────────────────────────────────────
//  SWAY – Community Content
//  Edit this file to update the Community page. No React knowledge needed.
//  Dates: use "YYYY-MM-DD" format for consistent sorting.
// ─────────────────────────────────────────────────────────────────────────────


// ── NEWS ─────────────────────────────────────────────────────────────────────
//  Add new posts at the TOP of this list (newest first).
//  Each post needs: date, title (optional), and text.

export const news = [
  {
    date: "2025-12-04",
    text: "Started going public 36 hours ago. The site has been viewed ~2000 times since, starting from almost 0 people knowing... it's all mind blowing really.",
  },
  {
    date: "2025-11-29",
    text: "I'm stoked to start building this community section, even though the project is still a big secret.",
  },
];


// ── COMMUNITIES ───────────────────────────────────────────────────────────────
//  Groups are shown under "open player groups".
//  Resources are shown under "Online Sites & Resources".

export const groups = [
  { label: "SWEDEN, STOCKHOLM: GROPEN", url: "https://www.youtube.com/@GropenGaming" },
];

export const resources = [
  { label: "BoardGameGeek", url: "https://boardgamegeek.com/boardgame/459365/sway" },
];

export const contact = {
  name:  "Tom Waldton",
  email: "hello@swaygame.info",
};


// ── ROADMAP ───────────────────────────────────────────────────────────────────
//  Each section has a title and a list of items.
//  Sub-items start with "– " (en-dash + space) and will be indented.

export const roadmap = [
  {
    title: "Website",
    items: [
      "Team Creator",
      "– fix layout for phones",
    ],
  },
  {
    title: "Releases",
    items: [
      "DriveThruRPG",
      "– plan to release the physical book for US & UK",
      "Other store intakes",
    ],
  },
  {
    title: "Future releases",
    items: [
      "Scenarios & missions",
      "– if all goes well, more campaigns & missions",
    ],
  },
];
