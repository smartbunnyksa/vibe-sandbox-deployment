@echo off
echo === تشغيل Basmah Academy على الخادم المحلي ===
echo.
echo عنوان IP الخادم: 192.168.100.14
echo.

REM الانتقال إلى مجلد الخادم الخلفي
cd backend

echo جاري تشغيل الخادم الخلفي على المنفذ 3001...
start cmd /k "npm run dev"

REM الانتقال إلى مجلد الواجهة الأمامية
cd ..\web

echo جاري تشغيل الواجهة الأمامية على المنفذ 3000...
start cmd /k "npx live-server --port=3000 --host=192.168.100.14"

echo.
echo === التطبيق يعمل الآن ===
echo الخادم الخلفي: http://192.168.100.14:3001
echo الواجهة الأمامية: http://192.168.100.14:3000
echo.
echo اضغط أي مفتاح للخروج...
pause >nul
