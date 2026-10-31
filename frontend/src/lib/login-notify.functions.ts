import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const FROM_EMAIL = "noreply@claimforsure.in";
const FROM_NAME = "ClaimForSure";

const Input = z.object({
  ip: z.string().optional(),
  user_agent: z.string().optional(),
  device: z.string().optional(),
});

function htmlBody(name: string, whenIST: string, ip: string, ua: string) {
  const safeName = name?.trim() || "there";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:32px 12px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;max-width:480px;">
        <tr><td style="font-size:20px;font-weight:700;color:#0f172a;padding-bottom:8px;">ClaimForSure</td></tr>
        <tr><td style="font-size:20px;font-weight:700;padding:12px 0 4px;">New sign-in to your account</td></tr>
        <tr><td style="font-size:14px;line-height:22px;color:#334155;padding-bottom:16px;">
          Hi ${safeName},<br/><br/>
          We noticed a new sign-in to your ClaimForSure account. If this was you, no action is needed.
        </td></tr>
        <tr><td style="font-size:13px;line-height:22px;color:#334155;background:#f8fafc;border-radius:8px;padding:14px 16px;">
          <b>Time:</b> ${whenIST} (IST)<br/>
          <b>IP:</b> ${ip || "unknown"}<br/>
          <b>Device / browser:</b> ${ua || "unknown"}
        </td></tr>
        <tr><td style="font-size:13px;line-height:22px;color:#334155;padding-top:18px;">
          If this <b>wasn't you</b>, please reset your password immediately and contact us.
        </td></tr>
        <tr><td style="font-size:12px;color:#94a3b8;padding-top:20px;border-top:1px solid #e2e8f0;margin-top:16px;">
          © ClaimForSure · Bhubaneswar, India
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export const sendLoginNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => Input.parse(data))
  .handler(async ({ data, context }) => {
    const host = process.env.SMTP_HOST;
    const portStr = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !portStr || !user || !pass) {
      console.warn("[login-notify] SMTP not configured; skipping");
      return { ok: false as const, code: "smtp_not_configured" as const };
    }

    const email = (context.claims.email as string | undefined) || "";
    if (!email) return { ok: false as const, code: "no_email" as const };

    const fullName =
      (context.claims.user_metadata as { full_name?: string } | undefined)?.full_name || "";

    const whenIST = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const port = Number(portStr);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const fromEmail =
      user && user.split("@")[1] !== FROM_EMAIL.split("@")[1] ? user : FROM_EMAIL;

    try {
      await transporter.sendMail({
        from: `"${FROM_NAME}" <${fromEmail}>`,
        replyTo: FROM_EMAIL,
        to: email,
        subject: "New sign-in to your ClaimForSure account",
        html: htmlBody(fullName, whenIST, data.ip || "", data.user_agent || ""),
        text: `Hi ${fullName || "there"},\n\nA new sign-in to your ClaimForSure account was detected.\n\nTime: ${whenIST} IST\nIP: ${data.ip || "unknown"}\nDevice: ${data.user_agent || "unknown"}\n\nIf this wasn't you, please reset your password immediately.`,
      });
    } catch (e) {
      console.error("[login-notify] sendMail failed", e);
      return { ok: false as const, code: "send_failed" as const };
    }

    return { ok: true as const };
  });