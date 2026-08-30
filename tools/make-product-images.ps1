# Bumubuo ng branded na product images (1600x1000) para sa catalog.
# Patakbuhin ulit kapag nagdagdag ka ng bagong product sa listahan sa ibaba.
# Palitan ang mga ito ng TOTOONG screenshots kapag meron ka na — mas mabenta.

Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $root "assets\products"
$logo = Join-Path $root "assets\brand\logo-256.png"
New-Item -ItemType Directory -Force -Path $out | Out-Null

# Ang malaking teksto ay ang MODEL o BUILD — hindi ang pangalan ng product,
# dahil nasa ibaba na naman ito bilang pamagat ng page.
$items = @(
  @{ file = "bayadtrack";          cat = "BUSINESS SYSTEM"; title = "BayadTrack"; sub = "Google Sheets   /   Kayang-kaya sa cellphone   /   Hanggang 1,000 kliyente" },
  @{ file = "website-development"; cat = "SERBISYO";        title = "Websites";   sub = "Landing pages   /   Order at payment flow   /   Mobile-ready" }
)

$W = 1600; $H = 1000
$navy   = [System.Drawing.ColorTranslator]::FromHtml("#00102C")
$navy2  = [System.Drawing.ColorTranslator]::FromHtml("#04244F")
$cyan   = [System.Drawing.ColorTranslator]::FromHtml("#03C6FA")
$blue   = [System.Drawing.ColorTranslator]::FromHtml("#008AFC")
$slate  = [System.Drawing.ColorTranslator]::FromHtml("#9FB8DC")

$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep  = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)

$logoImg = [System.Drawing.Bitmap]::FromFile($logo)

foreach ($it in $items) {
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'ClearTypeGridFit'
  $g.InterpolationMode = 'HighQualityBicubic'

  # Diagonal navy gradient background
  $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
  $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $navy2, $navy, 35.0)
  $g.FillRectangle($grad, $rect)

  # Circuit motif — angled traces sa kanang itaas
  $penDim = New-Object System.Drawing.Pen((
    [System.Drawing.Color]::FromArgb(46, $blue.R, $blue.G, $blue.B)), 3)
  for ($i = 0; $i -lt 7; $i++) {
    $y = 60 + ($i * 46)
    $x1 = 980 + ($i * 34)
    $g.DrawLine($penDim, $x1, $y, ($x1 + 150), $y)
    $g.DrawLine($penDim, ($x1 + 150), $y, ($x1 + 220), ($y - 70))
    $g.DrawLine($penDim, ($x1 + 220), ($y - 70), $W, ($y - 70))
  }
  $dotBrush = New-Object System.Drawing.SolidBrush((
    [System.Drawing.Color]::FromArgb(120, $cyan.R, $cyan.G, $cyan.B)))
  for ($i = 0; $i -lt 7; $i++) {
    $y = 60 + ($i * 46); $x1 = 980 + ($i * 34)
    $g.FillEllipse($dotBrush, ($x1 - 7), ($y - 7), 14, 14)
  }

  # Glow sa kanang itaas
  $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
  $gp.AddEllipse(1000, -260, 900, 900)
  $pg = New-Object System.Drawing.Drawing2D.PathGradientBrush($gp)
  $pg.CenterColor = [System.Drawing.Color]::FromArgb(70, $blue.R, $blue.G, $blue.B)
  $pg.SurroundColors = @([System.Drawing.Color]::FromArgb(0, $navy.R, $navy.G, $navy.B))
  $g.FillEllipse($pg, 1000, -260, 900, 900)

  # Logo — naka-clip sa bilog para walang kitang parisukat na kahon
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddEllipse(96, 88, 128, 128)
  $g.SetClip($clip)
  $g.DrawImage($logoImg, (New-Object System.Drawing.Rectangle(90, 82, 140, 140)))
  $g.ResetClip()
  $penRing = New-Object System.Drawing.Pen((
    [System.Drawing.Color]::FromArgb(70, $cyan.R, $cyan.G, $cyan.B)), 2)
  $g.DrawEllipse($penRing, 96, 88, 128, 128)

  # Accent rule + category label
  $penCyan = New-Object System.Drawing.Pen($cyan, 4)
  $g.DrawLine($penCyan, 100, 486, 196, 486)
  $fCat = New-Object System.Drawing.Font("Segoe UI", 17, [System.Drawing.FontStyle]::Bold)
  $bCyan = New-Object System.Drawing.SolidBrush($cyan)
  $catText = ($it.cat.ToCharArray() -join ' ')
  $g.DrawString($catText, $fCat, $bCyan, 100, 508)

  # Title
  $fTitle = New-Object System.Drawing.Font("Segoe UI", 58, [System.Drawing.FontStyle]::Bold)
  $bWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $titleTop = 566
  $titleRect = New-Object System.Drawing.RectangleF(96, $titleTop, 1180, 300)
  $g.DrawString($it.title, $fTitle, $bWhite, $titleRect)
  $titleH = $g.MeasureString($it.title, $fTitle, 1180).Height

  # Subtitle — sumusunod sa aktwal na taas ng title
  $fSub = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular)
  $bSlate = New-Object System.Drawing.SolidBrush($slate)
  $g.DrawString($it.sub, $fSub, $bSlate, 100, ($titleTop + $titleH + 22))

  $path = Join-Path $out ($it.file + ".jpg")
  $bmp.Save($path, $jpg, $ep)

  foreach ($d in @($grad,$penDim,$dotBrush,$gp,$pg,$fCat,$bCyan,$penCyan,$clip,$penRing,$fTitle,$bWhite,$titleRect,$fSub,$bSlate)) {
    if ($d -is [System.IDisposable]) { $d.Dispose() }
  }
  $g.Dispose(); $bmp.Dispose()
  "{0}.jpg  ({1} KB)" -f $it.file, [int]((Get-Item $path).Length / 1KB)
}

$logoImg.Dispose()
"`nTapos. Nasa: $out"
