// Shared click logger — fire-and-forget intent event to Supabase.
// Used by the homepage catalog (app.js) and the per-season SEO pages.
// Publishable key is safe in the browser; RLS allows insert-only.
(function () {
  "use strict";
  var URL = "https://tiufjhllkxddctuihzaz.supabase.co";
  var KEY = "sb_publishable_if1PYVYZPVy2pk1J35_p4w_2MVzfF08";
  window.ggLogClick = function (payload) {
    try {
      fetch(URL + "/rest/v1/click_events", {
        method: "POST",
        keepalive: true,
        headers: {
          apikey: KEY,
          Authorization: "Bearer " + KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(Object.assign({ event_type: "product_click" }, payload)),
      }).catch(function () {});
    } catch (e) {
      /* never block the outbound click */
    }
  };
})();
