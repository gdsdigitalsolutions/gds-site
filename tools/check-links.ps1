# Tinitingnan ang lahat ng internal link at larawan ng site para sa 404.
# Kailangang tumatakbo muna ang tools\serve.ps1 sa ibang window.
#
#   powershell -ExecutionPolicy Bypass -File tools\check-links.ps1

param([string]$BaseUrl = "http://localhost:8080")

$root = Split-Path $PSScriptRoot -Parent
$pages = Get-ChildItem $root -Recurse -Filter *.html |
  Where-Object { $_.FullName -notlike "*\tools\*" }

$checked = @{}
$broken = @()
$total = 0

foreach ($page in $pages) {
  $rel = $page.FullName.Substring($root.Length + 1).Replace("\", "/")
  # Backslash ang ibinabalik ng Split-Path — kailangang forward slash para tama ang paghati
  $dir = (Split-Path $rel -Parent).Replace("\", "/")
  $html = Get-Content $page.FullName -Raw -Encoding UTF8

  # Ang \s sa unahan ay pumipigil sa pagtama sa data-gds-href="contact.email"
  $links = [regex]::Matches($html, '\s(?:href|src)="([^"#][^"]*)"') |
    ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -notmatch '^(https?:|mailto:|tel:|data:|#|javascript:)' }

  foreach ($link in ($links | Select-Object -Unique)) {
    $clean = ($link -split '[?#]')[0]
    if (-not $clean) { continue }

    # Resolbahin ang relative path mula sa kinaroroonan ng page
    $combined = if ($dir) { "$dir/$clean" } else { $clean }
    $parts = New-Object System.Collections.ArrayList
    foreach ($seg in ($combined -split "/")) {
      if ($seg -eq "." -or $seg -eq "") { continue }
      elseif ($seg -eq "..") { if ($parts.Count -gt 0) { $parts.RemoveAt($parts.Count - 1) } }
      else { [void]$parts.Add($seg) }
    }
    $target = ($parts -join "/")
    if ($clean.EndsWith("/")) { $target += "/" }

    $url = "$BaseUrl/$target"
    $total++

    if ($checked.ContainsKey($url)) {
      if (-not $checked[$url]) { $broken += "$rel  ->  $link" }
      continue
    }

    try {
      $res = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
      $ok = $res.StatusCode -eq 200
    } catch {
      $ok = $false
    }

    $checked[$url] = $ok
    if (-not $ok) { $broken += "$rel  ->  $link" }
  }
}

"Nasuri: $($pages.Count) na page, $total na link ($($checked.Count) na natatangi)"
if ($broken.Count -eq 0) {
  "Walang sirang link."
} else {
  "`nSIRA ($($broken.Count)):"
  $broken | Sort-Object -Unique | ForEach-Object { "  $_" }
}
