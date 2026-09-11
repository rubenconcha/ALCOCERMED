$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
foreach ($video in @('Repaso', 'Simulacro', 'RetoBiologia')) {
  & npx.cmd remotion render faceless/index.tsx $video "../outputs/ben-carson-sin-camara/$video.mp4" --concurrency=3 --crf=19 --x264-preset=fast
  if ($LASTEXITCODE -ne 0) { throw "Error al renderizar $video" }
}
