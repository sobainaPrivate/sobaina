/**
 * Projects shown as scroll-driven image sequences in the Work section.
 * Frames live in public/work/<id>/ as WebP (screens ~600px wide, poster crops 1000px).
 * `folderId` links to the matching entry in figma-projects.ts, which the folder at the
 * end of the page opens for the full screens / PDF (empty for live websites, which link out instead).
 */
export type FrameStyle = "phone" | "screen" | "poster" | "browser";

export interface WorkProject {
  id: string;
  folderId: string;
  title: string;
  kind: string;
  role: string;
  summary: string;
  tags: string[];
  frames: string[];
  /**
   * phone = raw app screens in a device bezel; screen = portrait mockups; poster = landscape crops;
   * browser = one full-page capture of a live site that scrolls inside a browser window.
   */
  frameStyle: FrameStyle;
  /** browser only: the live address shown in the URL bar, and the capture's height ÷ width. */
  site?: { url: string; pageRatio: number };
  /** Fills the viewer behind the frames, matched to each design's own background. */
  surface: string;
  /** Soft glow behind the section. */
  glow: string;
  link: { label: string; href: string };
}

const frames = (id: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/work/${id}/${String(i + 1).padStart(2, "0")}.webp`);

const site = (id: string) => [`/work/${id}/full.webp`];

export const workProjects: WorkProject[] = [
  {
    id: "ihsan",
    folderId: "",
    title: "Ihsan Connect",
    kind: "Community network · Live website",
    role: "Designed, built & maintained",
    summary:
      "A home for a global network of Muslim professionals, where career success and spiritual growth rise together: programmes, cohorts, a members directory by country and network registration.",
    tags: ["Next.js", "React", "Node.js", "Vercel"],
    frames: site("ihsan"),
    frameStyle: "browser",
    site: { url: "ihsanconnect.org", pageRatio: 2.217 },
    surface: "#F4F1EA",
    glow: "#B08D57",
    link: { label: "Visit ihsanconnect.org", href: "https://ihsanconnect.org/" },
  },
  {
    id: "tasleem",
    folderId: "",
    title: "Tasleem Institute",
    kind: "Islamic learning institute · Live website",
    role: "Designed, built & maintained",
    summary:
      "The online home of a nonprofit institute for Muslim women: programmes, course enrolment with live dates, past events, values and team, rooted in classical scholarship and calm, editorial design.",
    tags: ["Vite", "Tailwind", "Vercel", "Content design"],
    frames: site("tasleem"),
    frameStyle: "browser",
    site: { url: "tasleemwomen.org", pageRatio: 4.122 },
    surface: "#FFFFFF",
    glow: "#E58FA6",
    link: { label: "Visit tasleemwomen.org", href: "https://tasleemwomen.org/" },
  },
  {
    id: "aistear",
    folderId: "",
    title: "Aistear",
    kind: "Children's Islamic education · Live website",
    role: "Designed, built & maintained",
    summary:
      "A bright, welcoming site for a Lahore school nurturing future leaders: five programme streams from Hifdh to STEM, parent testimonials and WhatsApp enrolment.",
    tags: ["Jekyll", "React", "Node.js", "HTML & CSS"],
    frames: site("aistear"),
    frameStyle: "browser",
    site: { url: "aistearedu.vercel.app", pageRatio: 2.707 },
    surface: "#FFFFFF",
    glow: "#1E4FD8",
    link: { label: "Visit aistearedu.vercel.app", href: "https://aistearedu.vercel.app/" },
  },
  {
    id: "synckaro",
    folderId: "synckaro",
    title: "SyncKaro",
    kind: "Real-estate CRM · Mobile app",
    role: "End-to-end product & UI design",
    summary:
      "A lead-management app for real-estate agents and teams. I designed the full two-role system, Member and Team Manager, covering onboarding, lead pipelines, contacts, targets and team oversight.",
    tags: ["Figma", "Two-role UX", "Design system", "DM Sans"],
    frames: frames("synckaro", 5),
    frameStyle: "screen",
    surface: "#0A3D3D",
    glow: "#2FB8A6",
    link: {
      label: "Open in Figma",
      href: "https://www.figma.com/design/HmctoQxlZF5jokiRMx6A8p/CCT-SyncKaro?node-id=0-1&t=646RN85XbSxDR5Vi-1",
    },
  },
  {
    id: "pal",
    folderId: "mental-health",
    title: "PAL",
    kind: "Mental-health app · HCI group project",
    role: "Prototype docs, usability testing, poster",
    summary:
      "A privacy-first AI peer-listener for LUMS students, built with my five-person HCI group. I owned the prototype documentation, the usability testing plan and the presentation poster.",
    tags: ["Figma", "Usability testing", "HCI", "Team of 5"],
    frames: frames("pal", 5),
    frameStyle: "phone",
    surface: "#14082B",
    glow: "#6F28DB",
    link: {
      label: "Open in Figma",
      href: "https://www.figma.com/design/SipWuy9VQJMs3r2tkAEa33/PAL-Mental-Health?node-id=0-1&t=cWew6r7EFfL0FBxV-1",
    },
  },
  {
    id: "carelink",
    folderId: "canva-carelink",
    title: "CareLink",
    kind: "Promotional assets · Canva",
    role: "Visual storytelling for a dual-user app",
    summary:
      "Turning a caregiver / care-receiver app into clear, high-converting promotional assets: one app, two perspectives, told screen by screen.",
    tags: ["Canva", "Marketing design", "Storytelling"],
    frames: frames("carelink", 6),
    frameStyle: "poster",
    surface: "#FDF6EE",
    glow: "#C2667A",
    link: { label: "View the full poster", href: "/figma/CareLinkPortfolio.pdf" },
  },
  {
    id: "ijs",
    folderId: "canva-ijs-myfav",
    title: "IJS",
    kind: "App Store assets · Canva",
    role: "Store graphics for user acquisition",
    summary:
      "App Store graphics for IJS, a document vault: showcasing organisation, shared vaults and renewal reminders so the value lands in a single scroll.",
    tags: ["Canva", "App Store", "Acquisition"],
    frames: frames("ijs", 5),
    frameStyle: "poster",
    surface: "#E2E3CF",
    glow: "#C9A227",
    link: { label: "View the full poster", href: "/figma/IJS_myFAV.pdf" },
  },
];
