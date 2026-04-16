export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const GH_TOKEN = process.env.GH_TOKEN;
  const GH_API = "https://api.github.com/repos/softlogycorporativo-sketch/soporte-disponible/contents/estado.json";

  if (!GH_TOKEN) return res.status(500).json({ error: "GH_TOKEN no configurado" });

  try {
    const revisiones = req.body;
    if (!revisiones || typeof revisiones !== "object") throw new Error("body inválido");

    // GET current estado.json
    const r = await fetch(GH_API, {
      headers: { "Authorization": "Bearer " + GH_TOKEN, "Accept": "application/vnd.github.v3+json" }
    });
    if (!r.ok) throw new Error("GET " + r.status);
    const meta = await r.json();
    const content = JSON.parse(Buffer.from(meta.content, "base64").toString("utf-8"));

    // Merge revisiones
    if (Array.isArray(content)) {
      // formato array plano: convertir a objeto para agregar revisiones
      const wrapped = { estados: content, revisiones, actualizado: new Date().toISOString() };
      const body = JSON.stringify(wrapped, null, 2);
      const encoded = Buffer.from(body, "utf-8").toString("base64");
      const w = await fetch(GH_API, {
        method: "PUT",
        headers: { "Authorization": "Bearer " + GH_TOKEN, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "rev " + new Date().toLocaleTimeString("es-CO"), content: encoded, sha: meta.sha })
      });
      if (!w.ok) throw new Error("PUT " + w.status);
    } else {
      content.revisiones = revisiones;
      const body = JSON.stringify(content, null, 2);
      const encoded = Buffer.from(body, "utf-8").toString("base64");
      const w = await fetch(GH_API, {
        method: "PUT",
        headers: { "Authorization": "Bearer " + GH_TOKEN, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "rev " + new Date().toLocaleTimeString("es-CO"), content: encoded, sha: meta.sha })
      });
      if (!w.ok) throw new Error("PUT " + w.status);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}