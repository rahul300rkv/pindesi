// Pinterest API v5 — full integration layer

const PINTEREST_API = "https://api.pinterest.com/v5";
const CLIENT_ID = process.env.PINTEREST_CLIENT_ID!;
const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET!;
const REDIRECT_URI = process.env.PINTEREST_REDIRECT_URI!;

// ─── OAuth ────────────────────────────────────────────────────────────────────

export function getPinterestAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "boards:read,boards:write,pins:read,pins:write,user_accounts:read",
    state,
  });
  return `https://www.pinterest.com/oauth/?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PINTEREST_API}/oauth/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  if (!res.ok) throw new Error(`Pinterest token exchange failed: ${await res.text()}`);
  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PINTEREST_API}/oauth/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Pinterest token refresh failed: ${await res.text()}`);
  return res.json();
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getPinterestUser(accessToken: string) {
  const res = await fetch(`${PINTEREST_API}/user_account`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Pinterest user");
  return res.json();
}

// ─── Boards ───────────────────────────────────────────────────────────────────

export async function getPinterestBoards(accessToken: string): Promise<PinterestBoard[]> {
  const res = await fetch(`${PINTEREST_API}/boards?page_size=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch boards");
  const data = await res.json();
  return data.items ?? [];
}

export async function createPinterestBoard(
  accessToken: string,
  name: string,
  description: string
): Promise<PinterestBoard> {
  const res = await fetch(`${PINTEREST_API}/boards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, privacy: "PUBLIC" }),
  });
  if (!res.ok) throw new Error(`Failed to create board: ${await res.text()}`);
  return res.json();
}

// ─── Pins ─────────────────────────────────────────────────────────────────────

export interface CreatePinParams {
  boardId: string;
  title: string;
  description: string;
  imageUrl: string;       // Publicly accessible image URL
  linkUrl?: string;       // Destination link
  altText?: string;
}

export interface PinterestPin {
  id: string;
  link: string;
  title: string;
  description: string;
  board_id: string;
  created_at: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  pin_count: number;
  privacy: string;
}

export async function createPin(
  accessToken: string,
  params: CreatePinParams
): Promise<PinterestPin> {
  const body: Record<string, unknown> = {
    board_id: params.boardId,
    title: params.title.slice(0, 100),           // Pinterest max: 100 chars
    description: params.description.slice(0, 500), // Pinterest max: 500 chars
    media_source: {
      source_type: "image_url",
      url: params.imageUrl,
    },
  };

  if (params.linkUrl) body.link = params.linkUrl;
  if (params.altText) body.alt_text = params.altText;

  const res = await fetch(`${PINTEREST_API}/pins`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create pin: ${err}`);
  }
  return res.json();
}

export async function getPinAnalytics(
  accessToken: string,
  pinId: string,
  startDate: string,  // YYYY-MM-DD
  endDate: string
) {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    metric_types: "IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK",
  });
  const res = await fetch(
    `${PINTEREST_API}/pins/${pinId}/analytics?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch pin analytics");
  return res.json();
}
