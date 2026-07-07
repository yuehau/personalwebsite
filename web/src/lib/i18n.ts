/** Trilingual support. Content text is stored as JSONB {en, zh, ms}. */
export const locales = ["en", "zh", "ms"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ms: "BM",
};

export type I18nText = Partial<Record<Locale, string>> | null | undefined;

/**
 * Pick a localized string with graceful fallback:
 * requested locale → English → first non-empty value → "".
 * This is what keeps a page from ever showing blank when a translation
 * hasn't been written yet.
 */
export function pick(field: I18nText, locale: Locale = defaultLocale): string {
  if (!field) return "";
  if (typeof field === "string") return field; // tolerate plain strings
  return (
    field[locale] ||
    field[defaultLocale] ||
    Object.values(field).find((v) => Boolean(v)) ||
    ""
  );
}
