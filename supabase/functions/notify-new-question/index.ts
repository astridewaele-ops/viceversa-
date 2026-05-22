// Supabase Edge Function — notify-new-question
//
// Wordt door een Database Webhook aangeroepen bij elke nieuwe rij in
// public.questions. De functie haalt het boek + asker + doelgroep op en
// verstuurt voor elke ontvanger een mail via Resend.
//
// Vereiste env-vars (gezet in Supabase → Project Settings → Edge Functions → Secrets):
//   RESEND_API_KEY   — Resend secret (re_...)
//   APP_URL          — basis-URL van de site (bv. http://localhost:3000 in dev)
//   MAIL_FROM        — afzender, bv. "¿ vice versa ? <onboarding@resend.dev>"
//
// Automatisch beschikbaar (geïnjecteerd door Supabase):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

interface QuestionRecord {
  id: string;
  book_id: string;
  asker_id: string;
  title: string;
  tags: string[];
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: QuestionRecord;
}

interface BookRow {
  id: string;
  code: string;
  title: string;
  author: string;
  source_language: "NL" | "FR";
}

interface ProfileRow {
  id: string;
  name: string;
}

const LANG_LABELS: Record<"NL" | "FR", string> = {
  NL: "Nederlandse",
  FR: "Franse",
};

const LANG_FULL: Record<"NL" | "FR", string> = {
  NL: "Nederlands",
  FR: "Frans",
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const appUrl = Deno.env.get("APP_URL") ?? "http://localhost:3000";
  const mailFrom =
    Deno.env.get("MAIL_FROM") ?? "¿ vice versa ? <onboarding@resend.dev>";

  if (!resendApiKey) {
    return new Response("Missing RESEND_API_KEY secret", { status: 500 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  if (payload.type !== "INSERT" || payload.table !== "questions") {
    return new Response("Ignored — not a question insert", { status: 200 });
  }

  const question = payload.record;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1) Boek ophalen voor brontaal en titel
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, code, title, author, source_language")
    .eq("id", question.book_id)
    .single<BookRow>();
  if (bookError || !book) {
    return new Response(`Book not found: ${bookError?.message}`, { status: 404 });
  }

  // 2) Asker (naam voor in de mail)
  const { data: asker } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", question.asker_id)
    .single<ProfileRow>();

  // 3) Doelgroep — moedertaal == brontaal, opt-in, niet de vragensteller zelf
  const { data: recipients, error: recipientsError } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("native_language", book.source_language)
    .eq("email_notifications", true)
    .neq("id", question.asker_id);
  if (recipientsError) {
    return new Response(`Recipients query failed: ${recipientsError.message}`, {
      status: 500,
    });
  }
  if (!recipients || recipients.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: "no recipients" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4) E-mailadressen ophalen uit auth.users via de admin-API
  const emails: { id: string; name: string; email: string }[] = [];
  for (const r of recipients as ProfileRow[]) {
    const { data: userData } = await supabase.auth.admin.getUserById(r.id);
    if (userData?.user?.email) {
      emails.push({ id: r.id, name: r.name, email: userData.user.email });
    }
  }
  if (emails.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: "no emails" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 5) Voor elke ontvanger: mail versturen via Resend
  const subject = `Vraag over een ${LANG_LABELS[book.source_language]} tekst`;
  const askerName = asker?.name ?? "een collega";

  const sends = emails.map(async (r) => {
    const html = buildHtml({
      recipientName: r.name,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCode: book.code,
      sourceLang: LANG_FULL[book.source_language],
      questionTitle: question.title,
      questionTags: question.tags,
      askerName,
      appUrl,
    });
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: mailFrom,
        to: r.email,
        subject,
        html,
      }),
    });
    let detail: unknown = null;
    try {
      detail = await res.json();
    } catch {
      // resend returns text on some errors
    }
    return {
      recipient: r.email,
      status: res.status,
      ok: res.ok,
      detail,
    };
  });

  const results = await Promise.all(sends);

  return new Response(
    JSON.stringify({ sent: results.length, results }, null, 2),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});

function buildHtml(args: {
  recipientName: string;
  bookTitle: string;
  bookAuthor: string;
  bookCode: string;
  sourceLang: string;
  questionTitle: string;
  questionTags: string[];
  askerName: string;
  appUrl: string;
}): string {
  const tagsLine =
    args.questionTags && args.questionTags.length > 0
      ? ` · ${args.questionTags.join(", ")}`
      : "";
  return `<!doctype html>
<html lang="nl">
  <body style="margin:0; padding:0; background-color:#fafaf8; font-family: Georgia, 'Times New Roman', serif; color:#222;">
    <div style="max-width:560px; margin:0 auto; padding:40px 24px;">
      <p style="font-family: 'Courier New', monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:#999; margin:0 0 32px;">
        ¿ vice versa ?
      </p>
      <p style="font-size:16px; line-height:1.55; margin:0 0 16px;">
        Beste ${escapeHtml(args.recipientName)},
      </p>
      <p style="font-size:16px; line-height:1.55; margin:0 0 24px;">
        ${escapeHtml(args.askerName)} heeft een vraag gesteld bij
        <em>${escapeHtml(args.bookTitle)}</em> van ${escapeHtml(args.bookAuthor)} —
        een tekst in jouw moedertaal (${escapeHtml(args.sourceLang)}). Misschien kun je iets bijdragen.
      </p>
      <div style="border-left:3px solid #c4a559; background:#faf7ee; padding:16px 20px; margin:0 0 24px;">
        <p style="font-family: 'Courier New', monospace; font-size:11px; color:#777; margin:0 0 6px;">
          ${escapeHtml(args.bookCode)} · ${escapeHtml(args.bookTitle)}${escapeHtml(tagsLine)}
        </p>
        <p style="font-size:17px; font-weight:500; margin:0;">
          ${escapeHtml(args.questionTitle)}
        </p>
      </div>
      <p style="font-size:15px; margin:0 0 32px;">
        <a href="${args.appUrl}" style="color:#111; text-decoration:underline;">
          Lees de vraag en antwoord →
        </a>
      </p>
      <p style="font-size:14px; color:#555; margin:0 0 4px;">
        Vriendelijke groet,
      </p>
      <p style="font-size:14px; color:#555; margin:0 0 32px;">
        ¿ vice versa ?
      </p>
      <hr style="border:none; border-top:1px solid #e8e8e3; margin:32px 0;">
      <p style="font-family: 'Courier New', monospace; font-size:10px; letter-spacing:0.05em; color:#999; margin:0;">
        Wil je dit soort meldingen niet meer? Pas je voorkeuren aan in je profiel.
      </p>
    </div>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
