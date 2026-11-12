// Only a verified paid subscription unlocks the complete game catalogue.
window.GameAccess = (() => {
  function isPaid(data, now = Date.now()) {
    return Boolean(data && data.ready && data.premium && !data.trial &&
      (!data.expires_at || (Number.isFinite(Date.parse(data.expires_at)) && Date.parse(data.expires_at) > now)));
  }
  async function check(client) {
    try {
      const {data, error} = await client.rpc('campus_access');
      return !error && data?.ready ? isPaid(data) : null;
    } catch (_) { return null; }
  }
  async function verify(client) { return (await check(client)) === true; }
  return {isPaid, check, verify};
})();
