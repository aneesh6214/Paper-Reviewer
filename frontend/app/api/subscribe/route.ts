export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());
    if (!isValid) {
      return Response.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const fromEnv = process.env.MAILGUN_FROM;
    const bcc = process.env.MAILGUN_BCC;

    if (!apiKey || !domain) {
      return Response.json({ success: false, error: "Server email config missing" }, { status: 500 });
    }

    console.log("apiKey", apiKey);
    console.log("domain", domain);

    const from = fromEnv && fromEnv.includes("@") ? fromEnv : `no-reply@${domain}`;

    const form = new URLSearchParams();
    form.append("from", `PaperReviewer <${from}>`);
    form.append("to", (email as string).trim());
    if (bcc) form.append("bcc", bcc);
    form.append("subject", "Thanks for your interest in PaperReviewer");
    form.append("text", "Thanks for your interest! We’ll keep you posted with updates soon. Releasing Winter 2025.");
    form.append("html", "<p>Thanks for your interest! We’ll keep you posted with updates soon. Releasing Winter 2025.</p>");

    const auth = "Basic " + Buffer.from(`api:${apiKey}`).toString("base64");
    const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return Response.json({ success: false, error: text || "Mailgun request failed" }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}


