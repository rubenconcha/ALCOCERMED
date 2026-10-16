"""Rebuild simulations using source files inside the protected authoring directory."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).resolve().parents[1]/"api/_simulations/rebuild_reviewed.py.source"))
