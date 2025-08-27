# PowerShell script to setup Windows Firewall for Basmah Academy

Write-Host "=== إعداد جدار حماية Windows لـ Basmah Academy ===" -ForegroundColor Green

# فتح منفذ API (3001)
Write-Host "جاري فتح منفذ 3001 للخادم الخلفي..." -ForegroundColor Yellow
$rule1 = Get-NetFirewallRule -DisplayName "Basmah Academy API" -ErrorAction SilentlyContinue
if (-not $rule1) {
    New-NetFirewallRule -DisplayName "Basmah Academy API" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
    Write-Host "✓ تم فتح منفذ 3001" -ForegroundColor Green
} else {
    Write-Host "منفذ 3001 مفتوح بالفعل" -ForegroundColor Cyan
}

# فتح منفذ الواجهة الأمامية (3000)
Write-Host "جاري فتح منفذ 3000 للواجهة الأمامية..." -ForegroundColor Yellow
$rule2 = Get-NetFirewallRule -DisplayName "Basmah Academy Frontend" -ErrorAction SilentlyContinue
if (-not $rule2) {
    New-NetFirewallRule -DisplayName "Basmah Academy Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
    Write-Host "✓ تم فتح منفذ 3000" -ForegroundColor Green
} else {
    Write-Host "منفذ 3000 مفتوح بالفعل" -ForegroundColor Cyan
}

# فتح منفذ MongoDB (27017)
Write-Host "جاري فتح منفذ 27017 لقاعدة البيانات..." -ForegroundColor Yellow
$rule3 = Get-NetFirewallRule -DisplayName "MongoDB" -ErrorAction SilentlyContinue
if (-not $rule3) {
    New-NetFirewallRule -DisplayName "MongoDB" -Direction Inbound -LocalPort 27017 -Protocol TCP -Action Allow
    Write-Host "✓ تم فتح منفذ 27017" -ForegroundColor Green
} else {
    Write-Host "منفذ 27017 مفتوح بالفعل" -ForegroundColor Cyan
}

# عرض القواعد المضافة
Write-Host "`n=== قواعد جدار الحماية الحالية ===" -ForegroundColor Green
Get-NetFirewallRule -DisplayName "Basmah Academy*" | Format-Table DisplayName, Direction, LocalPort, Action -AutoSize
Get-NetFirewallRule -DisplayName "MongoDB" | Format-Table DisplayName, Direction, LocalPort, Action -AutoSize

Write-Host "`n=== التعليمات ===" -ForegroundColor Green
Write-Host "1. تشغيل الخادم الخلفي: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. تشغيل الواجهة الأمامية: cd web && npx live-server --port=3000 --host=192.168.100.14" -ForegroundColor White
Write-Host "3. الوصول من الأجهزة الأخرى: http://192.168.100.14:3000" -ForegroundColor White

Write-Host "`nتم الانتهاء من الإعداد!" -ForegroundColor Green
Read-Host "اضغط Enter للخروج"
