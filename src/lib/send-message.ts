export const CONTACT_EMAIL = "sobainashiekh@gmail.com";

/**
 * Web3Forms (https://web3forms.com) delivers form submissions to CONTACT_EMAIL with no backend.
 * Put the access key in `.env.local` as VITE_WEB3FORMS_KEY (and in the host's env vars when deploying).
 * The key is designed to be public, so shipping it in the bundle is fine.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export interface Message {
  name: string;
  email: string;
  message: string;
}

/**
 * Send a contact message. With a Web3Forms key it goes straight to the inbox ("sent");
 * without one it opens the visitor's email app, already addressed and filled in ("mailto").
 */
export async function sendMessage(m: Message): Promise<"sent" | "mailto"> {
  const subject = `Portfolio message from ${m.name}`;
  if (!WEB3FORMS_KEY) {
    const body = `${m.message}\n\n— ${m.name} (${m.email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return "mailto";
  }
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: "Portfolio", ...m }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !data.success) throw new Error(data.message ?? "Could not send the message");
  return "sent";
}
