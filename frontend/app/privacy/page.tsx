import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for our services.",
};

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "public", "legal", "privacy-policy.html");
  const html = await fs.readFile(filePath, "utf8");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10" style={{ background: "white" }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

import fs from "fs";
import path from "path";

export default function PrivacyPolicyPage() {
  const policyPath = path.join(process.cwd(), "..", "temp-priv-policy.html");
  let html = "";
  try {
    html = fs.readFileSync(policyPath, "utf8");
    // Fill in company name blanks while leaving address blanks at the end
    // Replace only the first occurrence of "__________" with the site name.
    html = html.replace("__________", "PaperGrader");
  } catch {
    html = "<main style='max-width:720px;margin:120px auto 48px;padding:0 24px;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;color:#111'><h1>Privacy Policy</h1><p>Privacy policy file not found.</p></main>";
  }

  return (
    <div className="min-h-dvh bg-white">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    </div>
  );
}


