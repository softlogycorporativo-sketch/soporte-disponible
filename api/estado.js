export default async function handler(req, res) {
  const GH_TOKEN = process.env.GH_TOKEN;
  const GH_API = "https://api.github.com/repos/softlogycorporativo-sketch/soporte-disponible/contents/estado.json";

  if (!GH_TOKEN) return res.status(500).json({ error: "GH_TOKEN no configurado" });

  try {
    const r = await fetch(GH_API, {
      headers: { "Authorization": "Bearer " + GH_TOKEN, "Accept": "application/vnd.github.v3+json" }
    });
    if (!r.ok) throw new Error("GitHub " + r.status);
    const meta = await r.json();
    const content = Buffer.from(meta.content, "base64").toString("utf-8");
    const data = JSON.parse(content);
    res.status(200).json({ data, sha: meta.sha });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}