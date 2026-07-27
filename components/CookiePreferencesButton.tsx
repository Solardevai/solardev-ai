"use client";

export default function CookiePreferencesButton() {
  function openPreferences() {
    window.dispatchEvent(
      new Event("solardev:open-cookie-preferences"),
    );
  }

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-sm text-slate-400 transition hover:text-emerald-400 focus:outline-none focus-visible:text-emerald-400"
    >
      Cookie preferences
    </button>
  );
}
