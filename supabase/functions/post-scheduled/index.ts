// Supabase Edge Function — runs every 15 minutes via pg_cron (free, no Vercel Pro needed)
// Deploy with: supabase functions deploy post-scheduled
// Schedule with the SQL at the bottom of this file

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PINTEREST_API = "https://api.pinterest.com/v5";
const PLAN_LIMITS: Record<string, number> = { chai: 10, biryani: 999, thali: 999 };

async function refreshPinterestToken(refreshToken: string, clientId: string, clientSecret: string) {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`${PINTEREST_API}/oauth/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; refresh_token: string }>;
}

async function postPin(accessToken: string, pin: Record<string, string>) {
  const res = await fetch(`${PINTEREST_API}/pins`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      board_id: pin.board_id,
      title: pin.title?.slice(0, 100),
      description: pin.description?.slice(0, 500),
      link: pin.link_url ?? undefined,
      media_source: { source_type: "image_url", url: pin.image_url },
    }),
  });
  if (!res.ok) throw new Error(`Pinterest post failed: ${await res.text()}`);
  return res.json() as Promise<{ id: string }>;
}

Deno.serve(async (req) => {
  // Verify request is from Supabase scheduler (or your own call)
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const clientId = Deno.env.get("PINTEREST_CLIENT_ID")!;
  const clientSecret = Deno.env.get("PINTEREST_CLIENT_SECRET")!;

  const now = new Date();
  const windowEnd = new Date(now.getTime() + 16 * 60 * 1000);

  // Fetch all pins due in this 15-min window
  const { data: duePins, error } = await supabase
    .from("pins")
    .select("*, profiles!inner(id, plan, pins_used_this_month, pinterest_access_token, pinterest_refresh_token)")
    .eq("status", "scheduled")
    .lte("scheduled_at", windowEnd.toISOString())
    .gte("scheduled_at", now.toISOString())
    .limit(50);

  if (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: "DB fetch failed" }), { status: 500 });
  }

  if (!duePins || duePins.length === 0) {
    return new Response(JSON.stringify({ posted: 0, message: "No pins due" }));
  }

  const results = { posted: 0, failed: 0, skipped: 0 };

  for (const pin of duePins) {
    const profile = (pin as Record<string, unknown>).profiles as Record<string, unknown>;

    if (!profile.pinterest_access_token || !pin.image_url) {
      await supabase.from("pins").update({ status: "failed" }).eq("id", pin.id);
      results.failed++; continue;
    }

    const limit = PLAN_LIMITS[profile.plan as string] ?? 10;
    if ((profile.pins_used_this_month as number) >= limit) {
      results.skipped++; continue;
    }

    try {
      let token = profile.pinterest_access_token as string;
      let postedPin: { id: string };

      try {
        postedPin = await postPin(token, pin as Record<string, string>);
      } catch {
        // Token expired — refresh and retry
        const newTokens = await refreshPinterestToken(
          profile.pinterest_refresh_token as string, clientId, clientSecret
        );
        token = newTokens.access_token;
        await supabase.from("profiles").update({
          pinterest_access_token: newTokens.access_token,
          pinterest_refresh_token: newTokens.refresh_token,
        }).eq("id", profile.id);
        postedPin = await postPin(token, pin as Record<string, string>);
      }

      await Promise.all([
        supabase.from("pins").update({
          status: "posted",
          posted_at: new Date().toISOString(),
          pinterest_pin_id: postedPin.id,
        }).eq("id", pin.id),
        supabase.from("profiles").update({
          pins_used_this_month: (profile.pins_used_this_month as number) + 1,
        }).eq("id", profile.id),
      ]);

      results.posted++;
      console.log(`Posted pin ${pin.id} → Pinterest ${postedPin.id}`);
    } catch (err) {
      console.error(`Failed pin ${pin.id}:`, err);
      await supabase.from("pins").update({ status: "failed" }).eq("id", pin.id);
      results.failed++;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log("Results:", results);
  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
});

/*
──────────────────────────────────────────────────────────────────────────────
SCHEDULE THIS FUNCTION: run this SQL in Supabase SQL Editor after deploying

  select cron.schedule(
    'post-scheduled-pins',
    '*/15 * * * *',
    $$
      select net.http_post(
        url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-scheduled',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.service_role_key')
        ),
        body := '{}'::jsonb
      );
    $$
  );

Replace YOUR_PROJECT_REF with your actual Supabase project ref (from the URL).
──────────────────────────────────────────────────────────────────────────────
*/
