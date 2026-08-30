"""Optional offline fallback for French/German dictionaries after Argos models are installed."""

import json
import re
import sys
from pathlib import Path

import argostranslate.translate


HOME = Path(__file__).resolve().parent.parent
I18N = HOME / "assets" / "i18n"
TARGETS = sys.argv[1:] or ["fr", "de"]


def protect(value: str) -> str:
    return re.sub(r"\{([a-z]+)\}", r"ZXQ\1QXZ", value, flags=re.IGNORECASE)


def restore(value: str) -> str:
    return re.sub(r"ZXQ([a-z]+)QXZ", r"{\1}", value, flags=re.IGNORECASE)


english = json.loads((I18N / "en.json").read_text(encoding="utf-8"))
entries = list(english.items())

for target in TARGETS:
    installed = argostranslate.translate.get_installed_languages()
    source_language = next(language for language in installed if language.code == "en")
    target_language = next(language for language in installed if language.code == target)
    translator = source_language.get_translation(target_language)
    dictionary = {}
    batches = []
    batch = []
    size = 0
    for index, (source, value) in enumerate(entries):
        item = (f"{index:06d}", source, value)
        if batch and size + len(value) > 10000:
            batches.append(batch)
            batch = []
            size = 0
        batch.append(item)
        size += len(value) + 12
    if batch:
        batches.append(batch)

    for batch_index, items in enumerate(batches, 1):
        payload = "\n".join(f"[G{identifier}] {protect(value)}" for identifier, _, value in items)
        result = restore(translator.translate(payload))
        translated = {
            match.group(1): match.group(2).strip()
            for match in re.finditer(r"\[G(\d{6})\]\s*([\s\S]*?)(?=\n?\[G\d{6}\]|$)", result)
        }
        for identifier, source, value in items:
            dictionary[source] = translated.get(identifier) or restore(translator.translate(protect(value)))
        print(f"{target}: {batch_index}/{len(batches)}", flush=True)

    (I18N / f"{target}.json").write_text(
        json.dumps(dictionary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"{target}: {len(dictionary)} messages", flush=True)
