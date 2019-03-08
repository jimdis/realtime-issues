/* global $, fetch */

(async () => {
  let res = await fetch(`auth/session`)
  res = await res.json()
  if (!res.active) {
    $('#index-banner').removeClass('hide')
    $('#logged-in-banner').addClass('hide')
  }
})()
