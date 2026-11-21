// Launch waitlist: sends the email to /api/waitlist on this site (a Cloudflare Worker that forwards it to our inbox).
// Without JavaScript the form still posts normally and lands on /thanks/.
for (const form of document.querySelectorAll("form[data-waitlist]")) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = form.querySelector(".wl-msg"), btn = form.querySelector("button");
    const email = form.email.value.trim();
    if (!form.email.checkValidity()) { msg.textContent = "Please enter a valid email address."; form.email.focus(); return; }
    btn.disabled = true; btn.textContent = "Adding you…"; msg.textContent = "";
    try {
      const r = await fetch(form.action, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, website: form.website.value }) });
      if (!r.ok) throw new Error(String(r.status));
      form.classList.add("done");
      msg.textContent = "You're on the list. We'll email you once, the day Couchbird launches.";
      btn.textContent = "You're in ✓";
    } catch {
      btn.disabled = false; btn.textContent = "Get notified";
      msg.innerHTML = 'That didn\'t go through. Try again, or email <a href="mailto:support@couchbird.app?subject=Waitlist">support@couchbird.app</a>.';
    }
  });
}
