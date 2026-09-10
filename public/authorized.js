(function () {
  // Trello redirects here as #token=XXXX after the member approves access.
  var params = new URLSearchParams(window.location.hash.substring(1));
  var token = params.get("token");
  var el = document.getElementById("status");

  if (!token) {
    if (el) el.textContent = "Something went wrong — no token received. You can close this window.";
    return;
  }

  // Drop the token from the address bar immediately so it cannot leak via history or logs
  history.replaceState(null, "", window.location.pathname);

  if (window.opener) {
    // Post token to the opener popup (auth.html) on the same origin
    window.opener.postMessage(
      { source: "prioritize-auth", token: token },
      window.location.origin
    );
  }

  if (el) el.textContent = "Connected! Closing this window…";

  window.close();

  // If window.close() was blocked by browser pop-up restrictions
  setTimeout(function () {
    if (el) el.textContent = "Connected! You can close this window now.";
  }, 400);
})();
