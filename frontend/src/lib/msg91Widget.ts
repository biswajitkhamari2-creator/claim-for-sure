// MSG91 OTP widget in "exposeMethods" mode: MSG91 sends and checks the SMS code, our own
// login page provides the UI. A successful verifyOtp() yields an access token, which the
// PHP backend confirms with MSG91 (POST /api/auth/otp/verify) before signing anyone in.
//
// widgetId and tokenAuth are MSG91's public, browser-side widget credentials.

const WIDGET_ID = (import.meta.env.VITE_MSG91_WIDGET_ID as string | undefined) || "366a456b5272333132353030";
const TOKEN_AUTH = (import.meta.env.VITE_MSG91_TOKEN_AUTH as string | undefined) || "586237T7LW8wihp6ae5d53dP1";
const SCRIPT_URLS = ["https://verify.msg91.com/otp-provider.js", "https://verify.phone91.com/otp-provider.js"];
const SMS_CHANNEL = "11";

/** VITE_OTP_TEST_MODE=1 skips MSG91 entirely (local / staging with server OTP_TEST_MODE=1). */
export const OTP_TEST_MODE = import.meta.env.VITE_OTP_TEST_MODE === "1";
export const TEST_ACCESS_TOKEN = "test-mode-token";

type Cb = (data: any) => void;
type WidgetWindow = Window & {
  initSendOTP?: (config: Record<string, unknown>) => void;
  sendOtp?: (identifier: string, success: Cb, failure: Cb) => void;
  verifyOtp?: (otp: string, success: Cb, failure: Cb, reqId?: string) => void;
  retryOtp?: (channel: string | null, success: Cb, failure: Cb, reqId?: string) => void;
};

let ready: Promise<void> | null = null;

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { s.remove(); reject(new Error(`Could not load ${url}`)); };
    document.head.appendChild(s);
  });
}

/** Loads the widget script once (with MSG91's fallback host) and initialises it. */
export function loadOtpWidget(): Promise<void> {
  if (OTP_TEST_MODE) return Promise.resolve();
  if (ready) return ready;
  ready = (async () => {
    let lastErr: unknown;
    for (const url of SCRIPT_URLS) {
      try {
        await loadScript(url);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    const w = window as WidgetWindow;
    if (lastErr || typeof w.initSendOTP !== "function") {
      throw new Error("Could not load the OTP service. Check your connection and try again.");
    }
    w.initSendOTP({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      exposeMethods: true,
      captchaRenderId: "msg91-captcha",
      success: () => {},
      failure: () => {},
    });
  })();
  ready.catch(() => { ready = null; });
  return ready;
}

function errorMessage(err: any, fallback: string): string {
  const m = typeof err === "string" ? err : err?.message;
  return typeof m === "string" && m.trim() ? m : fallback;
}

function call<T>(fn: (ok: Cb, fail: Cb) => void, fallback: string): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      fn((data) => resolve(data as T), (err) => reject(new Error(errorMessage(err, fallback))));
    } catch (e) {
      reject(new Error(errorMessage(e, fallback)));
    }
  });
}

/** Sends the SMS code; resolves with MSG91's request id. */
export async function sendOtp(phone10: string): Promise<string> {
  if (OTP_TEST_MODE) return "test-request";
  await loadOtpWidget();
  const w = window as WidgetWindow;
  const data = await call<any>((ok, fail) => w.sendOtp!(`91${phone10}`, ok, fail), "Could not send OTP");
  return String(data?.message ?? "");
}

/** Re-sends the code by SMS for an earlier request. */
export async function resendOtp(reqId: string): Promise<void> {
  if (OTP_TEST_MODE) return;
  await loadOtpWidget();
  const w = window as WidgetWindow;
  await call((ok, fail) => w.retryOtp!(SMS_CHANNEL, ok, fail, reqId || undefined), "Could not resend OTP");
}

/** Checks the code with MSG91; resolves with the access token for our backend. */
export async function verifyOtp(otp: string, reqId: string): Promise<string> {
  if (OTP_TEST_MODE) return TEST_ACCESS_TOKEN;
  await loadOtpWidget();
  const w = window as WidgetWindow;
  const data = await call<any>((ok, fail) => w.verifyOtp!(otp, ok, fail, reqId || undefined), "Incorrect OTP");
  const token = String(data?.message ?? "");
  if (!token) throw new Error("OTP verification failed. Please try again.");
  return token;
}
