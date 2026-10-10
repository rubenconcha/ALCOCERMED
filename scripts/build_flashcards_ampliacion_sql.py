"""Build the idempotent import for the reviewed flashcard expansion."""

from pathlib import Path

from build_flashcards_sql import ROOT, main


if __name__ == "__main__":
    main(
        [
            ROOT / "content" / "flashcards_ampliacion_2026.json",
            ROOT / "content" / "flashcards_ampliacion_lote2_2026.json",
            ROOT / "content" / "flashcards_ampliacion_lote3_2026.json",
            ROOT / "content" / "flashcards_ampliacion_lote4_2026.json",
            ROOT / "content" / "flashcards_ampliacion_lote5_2026.json",
            ROOT / "content" / "flashcards_ampliacion_lote6_2026.json",
        ],
        ROOT / "SQL_FLASHCARDS_AMPLIACION_2026.sql",
    )
