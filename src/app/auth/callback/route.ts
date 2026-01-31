import { createServerClient } from "@supabase/ssr";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() { },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] Exchange error:", error);
      return new Response("Auth error: " + error.message, { status: 400 });
    }

    const session = data.session;
    const sessionJson = JSON.stringify(session);
    const projectId = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0];
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    // We build the HTML string carefully using concatenation to avoid "Unterminated template" errors
    const html =
      "<!DOCTYPE html>" +
      "<html lang='en'>" +
      "<head>" +
      "<title>Finalizing Session...</title>" +
      "<script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script>" +
      "</head>" +
      "<body style='margin:0; font-family:sans-serif; background:#f9fafb; display:flex; align-items:center; justify-content:center; height:100vh;'>" +
      "<div style='background:white; padding:2rem; border-radius:1rem; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); text-align:center;'>" +
      "<h2 style='margin:0 0 1rem; color:#111827;'>Securely Saving Session...</h2>" +
      "<p id='status' style='color:#6b7280;'>Initializing local storage...</p>" +
      "</div>" +
      "<script>" +
      "const status = document.getElementById('status');" +
      "const session = " + sessionJson + ";" +
      "const projectId = '" + projectId + "';" +
      "const nextUrl = '" + next + "';" +

      "async function run() {" +
      "try {" +
      "// 1. Init Client \n" +
      "const client = supabase.createClient('" + url + "', '" + key + "');" +

      "// 2. Set Session (Writes to LocalStorage mostly) \n" +
      "status.innerText = 'Writing to browser storage...';" +
      "await client.auth.setSession(session);" +

      "// 3. Manual Fallback for our Provider \n" +
      "const storageKey = 'sb-' + projectId + '-auth-token';" +
      "const rawToken = JSON.stringify(session);" +
      "localStorage.setItem(storageKey, rawToken);" +

      "// 4. Manual Cookie Cookie (Base64) \n" +
      "const tokenArray = [session.access_token, session.refresh_token, null, null, null];" +
      "const b64 = btoa(JSON.stringify(tokenArray));" +
      "const expires = '; expires=' + new Date(Date.now() + 7*24*60*60*1000).toUTCString();" +
      "document.cookie = storageKey + '=' + b64 + expires + '; path=/; SameSite=Lax';" +

      "// 5. Redirect \n" +
      "status.innerText = 'Success! Redirecting...';" +
      "setTimeout(() => { window.location.href = nextUrl; }, 500);" +

      "} catch (e) {" +
      "status.innerText = 'Error: ' + e.message;" +
      "console.error(e);" +
      "}" +
      "}" +
      "run();" +
      "</script>" +
      "</body>" +
      "</html>";

    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }

  return new Response("No code", { status: 400 });
}