export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const FLOW_URL =
    "https://defaulta40856b5235f4600a3d45cce33adbf.ef.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/37c7c842e2e3443691e1e99701cc6248/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Kf3J4qASFhkWPsdc54fLQrULMJgbYFx6lnU5w_co_6I";

  try {
    const r = await fetch(FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const status = r.status;
    let text = "";
    try { text = await r.text(); } catch (e) {}
    res.status(status >= 200 && status < 300 ? 200 : 502).json({ status, body: text.substring(0, 200) });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}