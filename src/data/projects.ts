export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  colorAccent: string;
  pdfUrl: string;
  challenge: string;
  approach: string;
  outcome: string;
  year: string;
  category: string;
};

export const projects: Project[] = [
  {
    id: "horizon",
    title: "Horizon",
    description: "A full-stack CRM built for high-volume real estate teams. Streamlined lead tracking, automated follow-ups, and pipeline analytics.",
    tags: ["React", "FastAPI", "Firebase", "Figma"],
    colorAccent: "#00B4D8", // teal
    pdfUrl: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
    year: "2024",
    category: "Web Application",
    challenge: "High-volume real estate teams were struggling with lead leakage. Existing CRMs were too generic, requiring extensive customization that agents didn't have time for.",
    approach: "I led the end-to-end product design and frontend engineering. We focused on a 'zero-click' philosophy, surfacing the most urgent leads immediately upon login and automating initial outreach.",
    outcome: "Reduced average lead response time from 4 hours to 12 minutes. Adopted by 3 major brokerages within the first two months of launch."
  },
  {
    id: "gloss",
    title: "Gloss",
    description: "A mobile-first booking experience for independent beauty professionals. Handles scheduling, payments, and client management elegantly.",
    tags: ["React Native", "Stripe", "Figma", "Firebase"],
    colorAccent: "#E8A0BF", // rose/mauve
    pdfUrl: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
    year: "2023",
    category: "Mobile App",
    challenge: "Independent beauty professionals were juggling Instagram DMs for booking, Venmo for payments, and Apple Notes for client history.",
    approach: "Designed a consumer-grade mobile application that feels like a premium lifestyle app rather than a utilitarian business tool. Integrated seamless Stripe payments and automated SMS reminders.",
    outcome: "Processed over $2M in bookings in the first year. Increased professional retention rate by 40% compared to previous piecemeal solutions."
  },
  {
    id: "roots-foundation",
    title: "Roots Foundation",
    description: "A complete digital identity overhaul for a nonprofit serving 50,000+ community members. Accessibility-first, story-driven design.",
    tags: ["React", "Figma", "WCAG 2.1", "SEO"],
    colorAccent: "#84A98C", // sage green
    pdfUrl: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
    year: "2023",
    category: "Web Design & Development",
    challenge: "The foundation's previous website was entirely inaccessible, visually outdated, and failed to communicate their profound impact on the local community.",
    approach: "Conducted extensive user research with community members to establish a new information architecture. Built a highly accessible, performant React application with a bespoke CMS.",
    outcome: "Achieved perfect Lighthouse accessibility scores. Increased online donations by 150% and volunteer sign-ups by 85%."
  }
];
