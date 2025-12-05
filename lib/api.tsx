const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiRequest(
  path: string,
  options: RequestInit & { json?: any; requireAuth?: boolean } = {}
) {
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const { json, requireAuth = false, headers = {}, ...fetchOpts } = options as any;
  const reqHeaders: Record<string, string> = { ...(headers as Record<string, string>) };

  if (json !== undefined) {
    reqHeaders["Content-Type"] = reqHeaders["Content-Type"] ?? "application/json";
    fetchOpts.body = JSON.stringify(json);
  }

  // For public endpoints, don't send credentials unless explicitly required
  const credentials = requireAuth ? "include" : "omit";

  let res: Response;
  try {
    res = await fetch(url, { ...fetchOpts, headers: reqHeaders, cache: "no-store", credentials });
  } catch (err) {
    throw new Error("Network request failed");
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object"
        ? data.message ?? data.error
        : String(data) || res.statusText;
    const error: any = new Error(message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}