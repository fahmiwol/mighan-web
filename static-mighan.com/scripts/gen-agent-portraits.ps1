# Generate agent portraits via Pollinations AI (free, no key)
# Style: low-poly 3D chibi figurine, Pop Mart / Fall Guys aesthetic
# Run: powershell -ExecutionPolicy Bypass -File .\scripts\gen-agent-portraits.ps1

$ErrorActionPreference = 'Stop'
$outDir = "$PSScriptRoot\..\assets\agents"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$BASE_STYLE = "low-poly 3D chibi figurine, kawaii vinyl plush character, Pop Mart Fall Guys aesthetic, Pixar-style soft shading, pastel gradient studio background, 3/4 front view portrait, soft rim lighting, clean isolated, WebGL render quality, collectible toy photography"

$agents = @(
  @{ id='sari';     seed=1001; prompt="confident young Indonesian woman strategist, short black bob hair, purple jacket, holding glowing brain hologram, thoughtful smile" },
  @{ id='budi';     seed=1002; prompt="young Indonesian male tech engineer, messy black hair, blue hoodie with laptop, circuit pattern, glasses, focused look" },
  @{ id='dewi';     seed=1003; prompt="creative young Indonesian woman artist, long wavy dark hair, pink blazer, holding art palette and paintbrush, joyful smile" },
  @{ id='profesor'; seed=2041; prompt="elderly friendly scientist bald on top with white hair ring on sides, big thick white mustache NO BEARD, round spectacles, white lab coat, holding microscope and green glowing flask, curious researcher expression" },
  @{ id='iris';     seed=1005; prompt="adventurous young explorer woman, short teal hair, cyan hoodie, holding tablet with globe hologram, curious grin, aviator goggles on head" },
  @{ id='rina';     seed=1006; prompt="energetic young Indonesian woman marketer, ponytail hair, orange jacket, holding megaphone, confident pose, speech bubble icon" },
  @{ id='hafiz';    seed=1007; prompt="friendly Indonesian male project manager, short black hair, green shirt, holding clipboard with checklist, thumbs up, neat appearance" },
  @{ id='kalinda';  seed=1008; prompt="young creative writer woman, red cardigan, glasses, holding laptop and pen, warm smile, cozy book aesthetic" }
)

Write-Host "Generating $($agents.Count) portraits to $outDir" -ForegroundColor Cyan
Write-Host ""

$ok = 0; $fail = 0
foreach ($a in $agents) {
  $fullPrompt = "$($a.prompt), $BASE_STYLE"
  $encoded = [System.Uri]::EscapeDataString($fullPrompt)
  $url = "https://image.pollinations.ai/prompt/$encoded" +
         "?width=768&height=768&model=flux&nologo=true&seed=$($a.seed)&enhance=true"
  $outFile = Join-Path $outDir "$($a.id).png"

  Write-Host "[$($a.id)] " -NoNewline -ForegroundColor Yellow
  try {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -TimeoutSec 180
    $sw.Stop()
    $sz = [math]::Round((Get-Item $outFile).Length / 1024, 1)
    Write-Host "OK $($sz)KB in $($sw.Elapsed.TotalSeconds.ToString('0.0'))s" -ForegroundColor Green
    $ok++
  } catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $fail++
  }
}

Write-Host ""
Write-Host "Done: $ok OK, $fail failed" -ForegroundColor $(if ($fail -eq 0) { 'Green' } else { 'Yellow' })
