export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const FLOW_URL =
    "https://defaulta40856b5235f4600a3d45cce33adbf.ef.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/7caed77cad8f4edca19b433c60f31948/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Y2TGmXUBknhe-zTGM5_U-A6nXUJGhPB7R1ojzNF23Us";

  try {
    const r = await fetch(FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const status = r.status;
    let text = "";
    try { text = await r.text(); } catch (e) {}
    res.status(status >= 200 && status < 300 ? 200 : 502).json({ status, body: text.substring(0, 200) });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
