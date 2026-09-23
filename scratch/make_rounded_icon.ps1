Add-Type -AssemblyName System.Drawing

function Get-RoundedImage {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height,
        [float]$CornerRadius
    )
    $src = [System.Drawing.Image]::FromFile($InputPath)
    $dest = New-Object System.Drawing.Bitmap($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)
    
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = $CornerRadius
    $w = $Width
    $h = $Height
    
    $path.AddArc(0, 0, $r * 2, $r * 2, 180, 90)
    $path.AddArc($w - $r * 2, 0, $r * 2, $r * 2, 270, 90)
    $path.AddArc($w - $r * 2, $h - $r * 2, $r * 2, $r * 2, 0, 90)
    $path.AddArc(0, $h - $r * 2, $r * 2, $r * 2, 90, 90)
    $path.CloseFigure()
    
    $g.SetClip($path)
    $g.DrawImage($src, 0, 0, $Width, $Height)
    
    $dest.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $dest.Dispose()
    $src.Dispose()
}

$baseDir = "c:\Users\LimJongTae\Downloads\ai_temp\Project\Daily-Fortune\public"
$inputFile = "$baseDir\un-512.png"

Get-RoundedImage -InputPath $inputFile -OutputPath "$baseDir\pwa-rounded-512.png" -Width 512 -Height 512 -CornerRadius 96
Get-RoundedImage -InputPath $inputFile -OutputPath "$baseDir\pwa-rounded-192.png" -Width 192 -Height 192 -CornerRadius 36

Write-Host "Rounded PWA icons created successfully!"
