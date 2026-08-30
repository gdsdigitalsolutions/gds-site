# Maliit na local web server para ma-preview ang site bago i-deploy.
#
#   Patakbuhin:  powershell -ExecutionPolicy Bypass -File tools\serve.ps1
#   Buksan:      http://localhost:8080/
#   Itigil:      Ctrl+C
#
# Kailangan ito dahil ang mga folder-style na link (products/bayadtrack/)
# ay hindi gumagana kapag double-click lang ang HTML file.

param([int]$Port = 8080)

$rootDir = Split-Path $PSScriptRoot -Parent
$prefix  = "http://localhost:$Port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png"; ".gif"="image/gif";
  ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".webp"="image/webp";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".txt"="text/plain; charset=utf-8";
  ".md"="text/plain; charset=utf-8"; ".xml"="application/xml; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() }
catch { Write-Host "Hindi mabuksan ang $prefix — subukan ang ibang port: tools\serve.ps1 -Port 8090"; exit 1 }

Write-Host "GDS site: $prefix   (root: $rootDir)"
Write-Host "Ctrl+C para itigil."

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    try {

    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart("/")
    if ($rel -eq "") { $rel = "index.html" }
    $path = Join-Path $rootDir ($rel -replace "/", "\")
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }

    # Huwag paglabas sa site folder
    $full = [System.IO.Path]::GetFullPath($path)
    if (-not $full.StartsWith([System.IO.Path]::GetFullPath($rootDir), [StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403; $res.Close(); continue
    }

    $isHead = $req.HttpMethod -eq "HEAD"

    if (Test-Path $full -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $res.Headers.Add("Cache-Control", "no-store")
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $res.ContentLength64 = $bytes.Length
      if (-not $isHead) { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      Write-Host ("200  /{0}" -f $rel)
    } else {
      $res.StatusCode = 404
      $res.ContentType = "text/html; charset=utf-8"
      $msg = [System.Text.Encoding]::UTF8.GetBytes("<h1>404</h1><p>Wala ang: /$rel</p>")
      $res.ContentLength64 = $msg.Length
      if (-not $isHead) { $res.OutputStream.Write($msg, 0, $msg.Length) }
      Write-Host ("404  /{0}" -f $rel) -ForegroundColor Yellow
    }

    } catch {
      # Ang isang masamang request ay hindi dapat magpatumba sa server
      Write-Host ("ERR  {0}" -f $_.Exception.Message) -ForegroundColor Red
      try { $res.StatusCode = 500 } catch {}
    }

    try { $res.Close() } catch {}
  }
} finally {
  $listener.Stop(); $listener.Close()
}
