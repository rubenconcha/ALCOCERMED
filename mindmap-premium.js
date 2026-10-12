/* Subscription-only concept maps: the public catalog contains no explanations. */
(function () {
  const pending = new Map();
  async function request(id, format) {
    const { data } = await getSupabase().auth.getSession();
    if (!data.session?.access_token) throw new Error('Inicia sesión para abrir este mapa.');
    const response = await fetch('/api/mindmap?id=' + encodeURIComponent(id) + '&format=' + format, {
      headers: { Authorization: 'Bearer ' + data.session.access_token }, cache: 'no-store', signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) {
      const error = new Error(response.status === 403 ? 'Este mapa requiere un plan activo.' : 'No se pudo cargar el mapa. Intenta otra vez.');
      error.status = response.status; throw error;
    }
    return format === 'image' ? response.blob() : response.json();
  }
  window.MindmapPremium = {
    async load(map) {
      // Do not cache content across sessions or trust a mutable client flag.
      const id = map.id;
      if (!pending.has(id)) pending.set(id, request(id, 'json').finally(() => pending.delete(id)));
      const payload = await pending.get(id);
      (window.MINDMAP_DETAILED_CONTENT ||= {})[id + '.json'] = payload.sections;
      (window.MINDMAP_ASSETS ||= {})[id + '.json'] = payload.assets;
      return payload;
    },
    async download(map) {
      const blob = await request(map.id, 'image');
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = map.id + '-Prepa-Ben-Carson.webp';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  };
})();
