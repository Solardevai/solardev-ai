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
      className="text-sm text-slate-400 transition hover:text-amber-400 focus:outline-none focus-visible:text-amber-400"
    >
      Cookie preferences
    </button>
  );
}
