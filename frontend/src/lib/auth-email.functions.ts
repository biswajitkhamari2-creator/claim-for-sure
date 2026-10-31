import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createHash, randomInt } from "crypto";

const FROM_EMAIL = "noreply@claimforsure.in";
const FROM_NAME = "ClaimForSure";
const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function hashOtp(otp: string, email: string) {
  return createHash("sha256").update(`${email.toLowerCase()}:${otp}`).digest("hex");
}

function otpEmailHtml(otp: string, fullName: string) {
  const name = fullName?.trim() || "there";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:32px 12px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;max-width:480px;">
        <tr><td style="font-size:20px;font-weight:700;color:#0f172a;padding-bottom:8px;">ClaimForSure</td></tr>
        <tr><td style="font-size:22px;font-weight:700;padding:12px 0 4px;">Your signup code</td></tr>
        <tr><td style="font-size:14px;line-height:22px;color:#334155;padding-bottom:20px;">
          Hi ${name},<br/><br/>
          Use the code below to complete your ClaimForSure signup. This code expires in ${OTP_TTL_MINUTES} minutes.
        </td></tr>
        <tr><td align="center" style="padding:8px 0 20px;">
          <div style="display:inline-block;background:#0f172a;color:#ffffff;font-size:32px;letter-spacing:10px;font-weight:700;padding:16px 28px;border-radius:10px;">${otp}</div>
        </td></tr>
        <tr><td style="font-size:12px;color:#94a3b8;padding-top:16px;border-top:1px solid #e2e8f0;">
          If you did not request this code, you can safely ignore this email.
        </td></tr>
      </table>
      <div style="font-size:11px;color:#94a3b8;padding-top:16px;">© ClaimForSure · Bhubaneswar, India</div>
    </td></tr>
  </table>
</body></html>`;
}

async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const portStr = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !portStr || !user || !pass) {
    throw new Error("SMTP credentials not configured");
  }
  const port = Number(portStr);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function verifyEmailHtml(actionLink: string, fullName: string) {
  const name = fullName?.trim() || "there";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:32px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;max-width:560px;">
        <tr><td style="font-size:20px;font-weight:700;color:#0f172a;padding-bottom:8px;">ClaimForSure</td></tr>
        <tr><td style="font-size:22px;font-weight:700;padding:12px 0 4px;">Verify your email</td></tr>
        <tr><td style="font-size:14px;line-height:22px;color:#334155;padding-bottom:20px;">
          Hi ${name},<br/><br/>
          Thanks for signing up on ClaimForSure. Please confirm your email address to activate your account and start tracking your claim.
        </td></tr>
        <tr><td align="center" style="padding:8px 0 20px;">
          <a href="${actionLink}" style="background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;display:inline-block;">Verify email</a>
        </td></tr>
        <tr><td style="font-size:12px;color:#64748b;padding-top:8px;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${actionLink}" style="color:#2563eb;word-break:break-all;">${actionLink}</a>
        </td></tr>
        <tr><td style="font-size:12px;color:#94a3b8;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:16px;">
          If you did not create this account, you can safely ignore this email.
        </td></tr>
      </table>
      <div style="font-size:11px;color:#94a3b8;padding-top:16px;">© ClaimForSure · Bhubaneswar, India</div>
    </td></tr>
  </table>
</body></html>`;
}

function recoveryEmailHtml(actionLink: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:32px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;max-width:560px;">
        <tr><td style="font-size:20px;font-weight:700;color:#0f172a;padding-bottom:8px;">ClaimForSure</td></tr>
        <tr><td style="font-size:22px;font-weight:700;padding:12px 0 4px;">Reset your password</td></tr>
        <tr><td style="font-size:14px;line-height:22px;color:#334155;padding-bottom:20px;">
          We received a request to reset your ClaimForSure password. Click the button below to choose a new password. This link expires shortly.
        </td></tr>
        <tr><td align="center" style="padding:8px 0 20px;">
          <a href="${actionLink}" style="background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;display:inline-block;">Reset password</a>
        </td></tr>
        <tr><td style="font-size:12px;color:#64748b;padding-top:8px;">
          If the button doesn't work, copy and paste this link:<br/>
          <a href="${actionLink}" style="color:#2563eb;word-break:break-all;">${actionLink}</a>
        </td></tr>
        <tr><td style="font-size:12px;color:#94a3b8;padding-top:24px;border-top:1px solid #e2e8f0;">
          If you didn't request this, you can safely ignore this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const SignupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/),
  ip: z.string().optional(),
  user_agent: z.string().optional(),
});

export const sendSignupOtp = createServerFn({ method: "POST" })
  .validator((data: unknown) => SignupInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();

    // Check if email already registered
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();
    if (existing) {
      return { ok: false as const, code: "already_registered" as const };
    }

    // Generate 6-digit OTP
    const otp = String(randomInt(0, 1000000)).padStart(6, "0");
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

    // Clear old OTPs for this email; store new one
    await supabaseAdmin.from("signup_otps").delete().eq("email", email);
    const { error: insertErr } = await supabaseAdmin.from("signup_otps").insert({
      email,
      otp_hash: hashOtp(otp, email),
      full_name: data.full_name,
      phone: data.phone,
      password_hash: data.password, // stored transiently; deleted after verify
      ip: data.ip ?? null,
      user_agent: data.user_agent ?? null,
      expires_at: expiresAt,
    });
    if (insertErr) throw new Error(insertErr.message);

    const transporter = await getTransporter();
    const smtpUser = process.env.SMTP_USER || "";
    // Use SMTP_USER as the FROM address if it doesn't match FROM_EMAIL's domain,
    // otherwise many SMTP providers silently reject the message.
    const fromEmail =
      smtpUser && smtpUser.split("@")[1] !== FROM_EMAIL.split("@")[1]
        ? smtpUser
        : FROM_EMAIL;
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${fromEmail}>`,
        replyTo: FROM_EMAIL,
        to: email,
        subject: `Your ClaimForSure signup code: ${otp}`,
        html: otpEmailHtml(otp, data.full_name),
        text: `Hi ${data.full_name || "there"},\n\nYour ClaimForSure signup code is: ${otp}\nIt expires in ${OTP_TTL_MINUTES} minutes.\n\nIf you did not request this, ignore this email.`,
      });
      console.log("[signup-otp] sent", { to: email, from: fromEmail, messageId: info.messageId, accepted: info.accepted, rejected: info.rejected, response: info.response });
    } catch (mailErr) {
      console.error("[signup-otp] sendMail failed", mailErr);
      throw new Error(`Could not send OTP email: ${(mailErr as Error).message}`);
    }

    return { ok: true as const };
  });

const VerifyInput = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

export const verifySignupOtp = createServerFn({ method: "POST" })
  .validator((data: unknown) => VerifyInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();

    const { data: row, error: selErr } = await supabaseAdmin
      .from("signup_otps")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (selErr) throw new Error(selErr.message);
    if (!row) return { ok: false as const, code: "no_pending" as const };
    if (row.consumed_at) return { ok: false as const, code: "already_used" as const };
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return { ok: false as const, code: "expired" as const };
    }
    if ((row.attempts ?? 0) >= MAX_ATTEMPTS) {
      return { ok: false as const, code: "too_many_attempts" as const };
    }

    if (row.otp_hash !== hashOtp(data.otp, email)) {
      await supabaseAdmin
        .from("signup_otps")
        .update({ attempts: (row.attempts ?? 0) + 1 })
        .eq("id", row.id);
      return { ok: false as const, code: "invalid" as const };
    }

    // Create the confirmed user
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: row.password_hash,
      email_confirm: true,
      user_metadata: { full_name: row.full_name, phone: row.phone },
    });
    if (createErr || !created.user) {
      const msg = (createErr?.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return { ok: false as const, code: "already_registered" as const };
      }
      throw new Error(createErr?.message || "Could not create user");
    }

    // Audit trail
    try {
      await supabaseAdmin.from("agreement_acceptances").insert({
        user_id: created.user.id,
        agreement_version: "1.0",
        agreement_title: "ClaimForSure Service Agreement",
        full_name: row.full_name,
        email,
        phone: row.phone,
        ip_address: row.ip ?? "",
        user_agent: row.user_agent ?? "",
      });
    } catch (e) {
      console.error("agreement_acceptances insert failed", e);
    }

    // Clean up all OTP rows for this email
    await supabaseAdmin.from("signup_otps").delete().eq("email", email);

    return { ok: true as const };
  });

const RecoveryInput = z.object({
  email: z.string().email(),
  redirect_to: z.string().url(),
});

export const sendPasswordRecovery = createServerFn({ method: "POST" })
  .validator((data: unknown) => RecoveryInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: data.email,
      options: { redirectTo: data.redirect_to },
    });

    // Don't leak whether the email exists — always report success
    if (linkErr || !linkData.properties?.action_link) {
      console.warn("recovery generateLink issue:", linkErr?.message);
      return { ok: true as const };
    }

    const actionLink = linkData.properties.action_link;
    try {
      const transporter = await getTransporter();
      await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: data.email,
        subject: "Reset your ClaimForSure password",
        html: recoveryEmailHtml(actionLink),
        text: `Reset your ClaimForSure password:\n${actionLink}`,
      });
    } catch (e) {
      console.error("recovery email send failed", e);
    }
    return { ok: true as const };
  });