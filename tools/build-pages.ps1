# Bumubuo ng isang HTML page kada product mula sa js/products.js
# at ng 1200x630 na share image para sa Facebook.
#
#   Patakbuhin:  powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1
#
# Patakbuhin ulit tuwing may binabago ka sa js/products.js.
# HUWAG i-edit nang direkta ang products/<slug>/index.html —
# mapapalitan ito sa susunod na pagbuo.

Add-Type -AssemblyName System.Drawing

$root     = Split-Path $PSScriptRoot -Parent
$template = Join-Path $PSScriptRoot "templates\product.html"
$jsFile   = Join-Path $root "js\products.js"
$socialOut = Join-Path $root "assets\social"
New-Item -ItemType Directory -Force -Path $socialOut | Out-Null

# ---------- Kunin ang catalog mula sa products.js ----------
$js = Get-Content $jsFile -Raw -Encoding UTF8
$start = $js.IndexOf("window.GDS_PRODUCTS")
if ($start -lt 0) { Write-Host "Hindi mahanap ang window.GDS_PRODUCTS sa products.js"; exit 1 }
$open  = $js.IndexOf("[", $start)
$close = $js.IndexOf("`n];", $open)
if ($close -lt 0) { Write-Host "Hindi mahanap ang dulo ng array (kailangan ay `n];)"; exit 1 }
$json = $js.Substring($open, $close - $open + 2)

try { $products = $json | ConvertFrom-Json }
catch { Write-Host "Hindi mabasa ang products.js bilang JSON: $_"; exit 1 }

$tpl = Get-Content $template -Raw -Encoding UTF8

function HtmlEnc([string]$s) {
  if ($null -eq $s) { return "" }
  return $s.Replace("&","&amp;").Replace("<","&lt;").Replace(">","&gt;").Replace('"',"&quot;")
}
function AttrEnc([string]$s) {
  # Para sa loob ng attribute — inaalis din ang mga line break
  return (HtmlEnc $s) -replace "\s+", " "
}

$check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'

# ---------- Share image (1200x630) ----------
$jpgEnc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88L)

function New-ShareImage($srcPath, $dstPath) {
  $src = [System.Drawing.Bitmap]::FromFile($srcPath)
  $bmp = New-Object System.Drawing.Bitmap(1200, 630)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#00102C"))
  # Isukat sa lapad, tapos i-crop ang labis sa taas at ibaba
  $h = [int](1200 * $src.Height / $src.Width)
  $y = [int]((630 - $h) / 2)
  $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, $y, 1200, $h)))
  $bmp.Save($dstPath, $jpgEnc, $ep)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose()
}

# ---------- Bumuo ----------
$made = 0
foreach ($p in $products) {

  # -- highlights --
  $highlights = ($p.highlights | ForEach-Object {
    "<li>$check<span>" + (HtmlEnc $_) + "</span></li>"
  }) -join "`n              "

  # -- specs --
  $specRows = ""
  foreach ($k in $p.specs.PSObject.Properties.Name) {
    $specRows += "<tr><th scope=`"row`">" + (HtmlEnc $k) + "</th><td>" + (HtmlEnc $p.specs.$k) + "</td></tr>`n                  "
  }

  # -- requirements --
  $reqs = ($p.requirements | ForEach-Object { "<li>" + (HtmlEnc $_) + "</li>" }) -join "`n              "

  # -- warning --
  $warn = ""
  if ($p.warning) {
    $warn = @"
<div class="notice notice--warn" style="margin-top:var(--s-5)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 9v5M12 17h.01"/></svg>
              <div>
                <strong>Basahin bago bumili</strong>
                $(HtmlEnc $p.warning)
              </div>
            </div>
"@
  }

  # -- faq --
  $faq = ""
  foreach ($f in $p.faq) {
    $faq += @"
<details>
                <summary>$(HtmlEnc $f.q)</summary>
                <div class="faq__answer"><p>$(HtmlEnc $f.a)</p></div>
              </details>

"@
  }

  # -- thumbs (kapag mahigit isa ang larawan) — may alt at caption kada larawan mula sa imageInfo --
  $thumbs = ""
  if ($p.images.Count -gt 1) {
    $btns = ""
    for ($i = 0; $i -lt $p.images.Count; $i++) {
      $cur = if ($i -eq 0) { "true" } else { "false" }
      $info = if ($p.imageInfo) { $p.imageInfo.($p.images[$i]) } else { $null }
      $alt = if ($info -and $info.alt) { AttrEnc $info.alt } else { "" }
      $capAttr = if ($info -and $info.caption) { " data-caption=`"" + (AttrEnc $info.caption) + "`"" } else { "" }
      $btns += "<button type=`"button`" aria-current=`"$cur`" aria-label=`"Larawan $($i+1)`"$capAttr><img src=`"../../assets/products/$($p.images[$i])`" alt=`"$alt`" loading=`"lazy`"></button>`n              "
    }
    $thumbs = "<div class=`"gallery__thumbs`">`n              $btns</div>"
  }

  # -- CTA labels (pwedeng i-override kada produkto sa products.js) --
  $cta = if ($p.ctaLabel) { $p.ctaLabel } elseif ($p.quoteOnly) { "Humingi ng quote" } else { "Umorder ngayon" }
  $ctaSecondary = if ($p.ctaSecondary) { $p.ctaSecondary } else { "Magtanong muna sa Messenger" }

  # -- Presyo bilang static na teksto (pareho ng ui.js priceLabel; pinapalitan din ito ng JS) --
  $priceLabel = if ($p.quoteOnly) { "Libreng quote" } elseif ($null -eq $p.price) { "Message for price" } else { "₱" + [string]::Format([System.Globalization.CultureInfo]::InvariantCulture, "{0:N0}", $p.price) }

  # -- Hero image ng product page (hiwalay sa card/share image na `image`) --
  $hero     = if ($p.heroImage) { $p.heroImage } else { $p.image }
  $heroInfo = if ($p.imageInfo) { $p.imageInfo.($hero) } else { $null }
  $heroAlt  = if ($heroInfo -and $heroInfo.alt) { AttrEnc $heroInfo.alt } else { AttrEnc $p.name }
  $caption  = if ($heroInfo -and $heroInfo.caption) { "<p class=`"gallery__caption small muted`" data-gallery-caption>" + (HtmlEnc $heroInfo.caption) + "</p>" } else { "" }

  # -- "Hindi ka sigurado?" notice at delivery note — kada produkto, may default --
  $unsureTitle  = if ($p.unsureTitle) { HtmlEnc $p.unsureTitle } else { "Hindi ka sigurado?" }
  $unsureLead   = if ($null -ne $p.unsureLead) { HtmlEnc $p.unsureLead } else { "Mas mabuting magtanong muna kaysa mabili ang maling bagay." }
  $unsureTail   = if ($p.unsureTail) { HtmlEnc $p.unsureTail } else { "ng model ng unit mo." }
  $deliveryNote = if ($p.deliveryNote) { HtmlEnc $p.deliveryNote } else { "Tinitingnan namin ang bayad, tapos ipinapadala namin ang binili mo — download link at license key, o setup, depende sa produkto —" }

  # -- Compatibility & Use Notice (opsyonal kada produkto) --
  $useNotice = ""
  if ($p.useNotice) {
    $paras = ($p.useNotice.paragraphs | ForEach-Object { "<p>" + (HtmlEnc $_) + "</p>" }) -join "`n                "
    $useNotice = @"
<div class="notice notice--info" style="margin-top:var(--s-5)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>
              <div>
                <strong>$(HtmlEnc $p.useNotice.title)</strong>
                $paras
              </div>
            </div>
"@
  }

  # -- JSON-LD --
  $ld = [ordered]@{
    "@context"    = "https://schema.org"
    "@type"       = "Product"
    "name"        = $p.name
    "description" = $p.summary
    "category"    = $p.categoryLabel
    "brand"       = [ordered]@{ "@type" = "Brand"; "name" = "GDS Digital Solutions" }
    "image"       = "../../assets/social/$($p.slug)-share.jpg"
  }
  if ($null -ne $p.price) {
    $ld["offers"] = [ordered]@{
      "@type"         = "Offer"
      "price"         = $p.price
      "priceCurrency" = "PHP"
      "availability"  = "https://schema.org/InStock"
    }
  }
  $jsonld = ($ld | ConvertTo-Json -Depth 5)

  # -- palitan ang mga placeholder --
  $out = $tpl
  $productLogo = if ($p.logo) { "<img class=""product-logo"" src=""../../assets/products/$($p.logo)"" alt=""$(HtmlEnc $p.name) logo"" loading=""eager"">" } else { "" }
  $out = $out.Replace("{{SLUG}}",           $p.slug)
  $out = $out.Replace("{{NAME}}",           (HtmlEnc $p.name))
  $out = $out.Replace("{{SHORT}}",          (AttrEnc $p.short))
  $out = $out.Replace("{{SUMMARY}}",        (HtmlEnc $p.summary))
  $out = $out.Replace("{{CATEGORY}}",       $p.category)
  $out = $out.Replace("{{CATEGORY_LABEL}}", (HtmlEnc $p.categoryLabel))
  $out = $out.Replace("{{IMAGE_ALT}}",      $heroAlt)
  $out = $out.Replace("{{IMAGE}}",          $hero)
  $out = $out.Replace("{{PRODUCT_LOGO}}",   $productLogo)
  $out = $out.Replace("{{CAPTION}}",        $caption)
  $out = $out.Replace("{{PRICE_LABEL}}",    $priceLabel)
  $out = $out.Replace("{{PRICE_NOTE}}",     (HtmlEnc $p.priceNote))
  $out = $out.Replace("{{CTA_LABEL}}",      (HtmlEnc $cta))
  $out = $out.Replace("{{CTA_SECONDARY}}",  (HtmlEnc $ctaSecondary))
  $out = $out.Replace("{{UNSURE_TITLE}}",   $unsureTitle)
  $out = $out.Replace("{{UNSURE_LEAD}}",    $unsureLead)
  $out = $out.Replace("{{UNSURE_TAIL}}",    $unsureTail)
  $out = $out.Replace("{{DELIVERY_NOTE}}",  $deliveryNote)
  $out = $out.Replace("{{USE_NOTICE}}",     $useNotice)
  $out = $out.Replace("{{HIGHLIGHTS}}",     $highlights)
  $out = $out.Replace("{{SPECS}}",          $specRows.TrimEnd())
  $out = $out.Replace("{{REQUIREMENTS}}",   $reqs)
  $out = $out.Replace("{{WARNING}}",        $warn)
  $out = $out.Replace("{{FAQ}}",            $faq.TrimEnd())
  $out = $out.Replace("{{THUMBS}}",         $thumbs)
  $out = $out.Replace("{{JSONLD}}",         $jsonld)

  # -- isulat --
  $dir = Join-Path $root "products\$($p.slug)"
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  [System.IO.File]::WriteAllText((Join-Path $dir "index.html"), $out, (New-Object System.Text.UTF8Encoding($false)))

  # -- share image --
  $srcImg = Join-Path $root "assets\products\$($p.image)"
  if (Test-Path $srcImg) {
    New-ShareImage $srcImg (Join-Path $socialOut "$($p.slug)-share.jpg")
  } else {
    Write-Host "  (walang larawan: $($p.image))" -ForegroundColor Yellow
  }

  "products/$($p.slug)/index.html"
  $made++
}

"`n$made na product page ang nabuo. Share images: assets/social/"

# ============================================================
# Mga simpleng content page (about, contact, terms, privacy, refund)
# Galing sa tools/content/*.html gamit ang tools/templates/page.html
# ============================================================
$pageTpl = Join-Path $PSScriptRoot "templates\page.html"
$contentDir = Join-Path $PSScriptRoot "content"

if ((Test-Path $pageTpl) -and (Test-Path $contentDir)) {
  $ptpl = Get-Content $pageTpl -Raw -Encoding UTF8
  $pages = 0

  foreach ($f in (Get-ChildItem $contentDir -Filter *.html)) {
    $raw = Get-Content $f.FullName -Raw -Encoding UTF8
    $parts = $raw -split "(?m)^---\s*$", 2
    if ($parts.Count -lt 2) { Write-Host "  laktawan (walang --- separator): $($f.Name)" -ForegroundColor Yellow; continue }

    $meta = $parts[0]
    $body = $parts[1].TrimStart("`r", "`n")

    $title = ""; $desc = ""
    foreach ($line in ($meta -split "`r?`n")) {
      if ($line -match '^\s*TITLE:\s*(.+)$') { $title = $Matches[1].Trim() }
      if ($line -match '^\s*DESC:\s*(.+)$')  { $desc  = $Matches[1].Trim() }
    }
    if (-not $title) { $title = $f.BaseName }

    $out = $ptpl
    $out = $out.Replace("{{TITLE}}",   (HtmlEnc $title))
    $out = $out.Replace("{{DESC}}",    (AttrEnc $desc))
    $out = $out.Replace("{{CONTENT}}", $body)

    $dir = Join-Path $root $f.BaseName
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    [System.IO.File]::WriteAllText((Join-Path $dir "index.html"), $out, (New-Object System.Text.UTF8Encoding($false)))
    "$($f.BaseName)/index.html"
    $pages++
  }
  "$pages na content page ang nabuo."
}

# ============================================================
# sitemap.xml at robots.txt — kapag may site.baseUrl sa config.js
# ============================================================
$cfgFile = Join-Path $root "js\config.js"
$baseUrl = ""
if (Test-Path $cfgFile) {
  $cfgText = Get-Content $cfgFile -Raw -Encoding UTF8
  if ($cfgText -match 'baseUrl:\s*"([^"]+)"') { $baseUrl = $Matches[1].TrimEnd("/") }
}

if ($baseUrl) {
  $today = Get-Date -Format "yyyy-MM-dd"
  $urls = @("", "products/", "about/", "contact/", "track/", "terms/", "privacy/", "refund/")
  foreach ($p in $products) { $urls += "products/$($p.slug)/" }

  $xml = "<?xml version=`"1.0`" encoding=`"UTF-8`"?>`n<urlset xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n"
  foreach ($u in $urls) {
    $prio = if ($u -eq "") { "1.0" } elseif ($u -like "products/*/") { "0.9" } else { "0.6" }
    $xml += "  <url><loc>$baseUrl/$u</loc><lastmod>$today</lastmod><priority>$prio</priority></url>`n"
  }
  $xml += "</urlset>`n"
  [System.IO.File]::WriteAllText((Join-Path $root "sitemap.xml"), $xml, (New-Object System.Text.UTF8Encoding($false)))

  $robots = "User-agent: *`nAllow: /`nDisallow: /order/`n`nSitemap: $baseUrl/sitemap.xml`n"
  [System.IO.File]::WriteAllText((Join-Path $root "robots.txt"), $robots, (New-Object System.Text.UTF8Encoding($false)))

  "sitemap.xml at robots.txt — nabuo para sa $baseUrl"
} else {
  "sitemap.xml — nilaktawan (walang site.baseUrl sa js/config.js; punan ito pagka-deploy)"
}
