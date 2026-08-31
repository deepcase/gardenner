"""Repair product and technology names in generated dictionaries with local Argos models."""

import json
import re
from pathlib import Path

import argostranslate.translate


HOME = Path(__file__).resolve().parent.parent
I18N = HOME / "assets" / "i18n"
LOCALES = ["ja", "ko", "es", "fr", "de"]
TERMS = sorted([
    "Gardenerim", "AngularJS", "TypeScript", "JavaScript", "WebAssembly",
    "Chromium", "Electron", "WebView", "Firefox", "WebKit", "Blazor",
    "Tauri", "React", "NuGet", "GitHub", "Node.js", "WCAG", "HTML",
    "CSS", "SSR", "API", "DOM", "Vue", "Axe",
], key=len, reverse=True)


def protect(value: str):
    replacements = {}
    for index, term in enumerate(TERMS):
        token = f"ZXQTERM{index:02d}QXZ"
        if term in value:
            value = value.replace(term, token)
            replacements[token] = term
    return value, replacements


def restore(value: str, replacements):
    for token, term in replacements.items():
        value = re.sub(re.escape(token), term, value, flags=re.IGNORECASE)
    return value


english_path = I18N / "en.json"
english = json.loads(english_path.read_text(encoding="utf-8"))
for source, value in english.items():
    if "Axe" in source and "Axe" not in value:
        english[source] = re.sub(r"\bAx\b", "Axe", value)
english_path.write_text(json.dumps(english, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

installed = argostranslate.translate.get_installed_languages()
source_language = next(language for language in installed if language.code == "en")

for locale in LOCALES:
    path = I18N / f"{locale}.json"
    dictionary = json.loads(path.read_text(encoding="utf-8"))
    targets = [
        source for source, value in dictionary.items()
        if any(term in source and term not in value for term in TERMS)
    ]
    translator = source_language.get_translation(next(language for language in installed if language.code == locale))
    for index, source in enumerate(targets, 1):
        protected, replacements = protect(english[source])
        repaired = restore(translator.translate(protected), replacements)
        required = [term for term in TERMS if term in source]
        if any(term not in repaired for term in required) or re.search(r"ZXQ|QXZ|ZXZ", repaired, re.IGNORECASE):
            repaired = english[source]
        dictionary[source] = repaired
        print(f"{locale}: {index}/{len(targets)}", flush=True)
    path.write_text(json.dumps(dictionary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{locale}: repaired {len(targets)} technical translations", flush=True)
