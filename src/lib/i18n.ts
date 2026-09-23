import { Fragment, createElement, type ReactNode } from "react";

// Translation for the whole site. The English text is the key: t("Search")
// looks "Search" up in the current language's dictionary and falls back to
// the English when there is no entry. Dictionaries live in src/i18n/*.json
// and are built from every t()/tr()/tx() call by scripts/i18n-extract.mjs.

export type Dictionary = Record<string, string>;
type Vars = Record<string, string | number>;

let dictionary: Dictionary = {};

/** Called by LanguageProvider before the app re-renders in a new language. */
export function setDictionary(d: Dictionary) {
  dictionary = d;
}

function fill(text: string, vars?: Vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, k) =>
    k in vars ? String(vars[k]) : m,
  );
}

/** Translate a whole sentence. Use {name} placeholders for values. */
export function t(source: string, vars?: Vars): string {
  return fill(dictionary[source] ?? source, vars);
}

/** Pick the singular or plural sentence by count; {n} is the count. */
export function tn(n: number, one: string, other: string, vars?: Vars) {
  return t(n === 1 ? one : other, { n, ...vars });
}

/** Like t(), but placeholders may be elements, e.g. a link inside a
 *  sentence: tr("Read our {terms}.", { terms: <Link>…</Link> }). */
export function tr(source: string, vars: Record<string, ReactNode>): ReactNode {
  const parts = (dictionary[source] ?? source).split(/(\{\w+\})/);
  return createElement(
    Fragment,
    null,
    ...parts.map((p, i) => {
      const key = p.match(/^\{(\w+)\}$/)?.[1];
      return createElement(
        Fragment,
        { key: i },
        key !== undefined && key in vars ? vars[key] : p,
      );
    }),
  );
}

/** Marks text kept in data files so the extractor finds it. It returns the
 *  English unchanged; the place that shows it calls t(). */
export const tx = (source: string) => source;
