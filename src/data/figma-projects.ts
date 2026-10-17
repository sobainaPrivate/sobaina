export interface FigmaProject {
    id: string;
    name: string;
    color: string;
    /** Cover thumbnail shown on the bouquet file. */
    cover: string;
    /** 3-5 curated screens shown in the expanded view — not the full file. */
    screens: string[];
    pdf?: string;
    /** One or two line summary shown under the project title. */
    description: string;
    /** Which tool this was made in — drives the label/button text shown. */
    platform: "figma" | "canva";
    /** Link to the actual file (Figma "view only" link, or a Canva share link). */
    sourceUrl: string;
}

// Drop your exported PNGs into public/figma/<project-id>/ using these exact
// filenames, or change the paths below to match whatever you export.
export const figmaProjects: FigmaProject[] = [
    {
        id: "synckaro",

        name: "Sync Karo - Real Estate App",

        color: "#246e36",
        platform: "figma",

        cover: "/figma/synckaro/cover.png",

        screens: [

            "/figma/synckaro/10.png",
            "/figma/synckaro/9.png",
            "/figma/synckaro/12.png",
            "/figma/synckaro/18.png",
        ],

        sourceUrl: "https://www.figma.com/design/HmctoQxlZF5jokiRMx6A8p/CCT-SyncKaro?node-id=0-1&t=646RN85XbSxDR5Vi-1",
        description: "SyncKaro is a real estate lead-management CRM app designed to help agents and teams track leads, contacts, and targets in one place. I designed a complete two-role system (Member and Team Manager) in Figma, covering onboarding, lead pipelines, contact management, target tracking, and team oversight:built around a teal (`#0A3D3D`) and gold (`#C9A668`) brand identity with a clean DM Sans type system. Launcing on Play Store soon",
    },
    {
        id: "mental-health",
        name: "PAL-A Mental Health App",
        color: "#6f28db",
        platform: "figma",
        cover: "/figma/PAL/28.png",
        screens: [
            "/figma/PAL/32.png",
            "/figma/PAL/12.png",
            "/figma/PAL/Score.png",
        ],
        sourceUrl: "https://www.figma.com/design/SipWuy9VQJMs3r2tkAEa33/PAL-Mental-Health?node-id=0-1&t=cWew6r7EFfL0FBxV-1",
        description: "PAL is a privacy-first AI peer-listener app for LUMS students, designed with my HCI group 'Mentallica' (5 members). This was a full-semester group project:teammates led the brainstorming, research, sketches, and hi-fi Figma design. My contribution was the prototype documentation, usability testing plan, presentation poster, and printable test materials",
    },
    {
        id: "canva-carelink",
        name: "CareLink Portfolio",
        color: "#9B5DE5",
        platform: "canva",
        cover: "/figma/CoverCare.png",
        screens: [],
        pdf: "/figma/CareLinkPortfolio.pdf",
        sourceUrl: "https://www.canva.com/design/REPLACE_ME/view",
        description: "Desgined this for translating complex dual-user app features into clear, high-converting promotional assets",
    },
    {
        id: "canva-ijs-myfav",
        name: "IJS Portfolio",
        color: "#00BBF9",
        platform: "canva",
        cover: "/figma/CoverIJF.png",
        screens: [],
        pdf: "/figma/IJS_myFAV.pdf",
        sourceUrl: "https://www.canva.com/design/REPLACE_ME/view",
        description: "Designed App Store graphic assets for IJS, showcasing document organization and renewal reminder features to maximize user acquisition",
    },
];