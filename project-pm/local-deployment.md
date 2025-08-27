# دليل الرفع على الخادم المحلي

## معلومات الخادم
- **عنوان IP**: 192.168.100.14
- **نظام التشغيل**: Windows
- **الاتصال**: Ethernet

## خطوات الرفع على الخادم المحلي

### 1. تشغيل الخادم الخلفي محلياً
```bash
cd backend
npm install
npm run dev
```

سيتم تشغيل الخادم على: `http://192.168.100.14:3001`

### 2. تشغيل الواجهة الأمامية
```bash
cd web
# يمكن استخدام أي خادم ويب محلي مثل:
# python -m http.server 3000
# أو استخدام live-server
npx live-server --port=3000 --host=192.168.100.14
```

### 3. تكوين الوصول من الأجهزة الأخرى على الشبكة
لتمكين الأجهزة الأخرى من الوصول للتطبيق:

#### أ. تكوين جدار الحماية
```powershell
# فتح المنفذ 3001 في جدار الحماية
New-NetFirewallRule -DisplayName "Basmah Academy API" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow

# فتح المنفذ 3000 للواجهة الأمامية  
New-NetFirewallRule -DisplayName "Basmah Academy Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

#### ب. تكوين المضيف الافتراضي
إنشاء ملف `hosts` على الأجهزة الأخرى:
```
192.168.100.14 smartbunnyksa.com
192.168.100.14 www.smartbunnyksa.com
```

### 4. اختبار الوصول
من أي جهاز على الشبكة:
```bash
# اختبار الخادم الخلفي
curl http://192.168.100.14:3001/api/health

# اختبار الواجهة الأمامية
curl http://192.168.100.14:3000
```

### 5. تكوين MongoDB محلياً
```bash
# تثبيت MongoDB على Windows
# تنزيل من: https://www.mongodb.com/try/download/community

# تشغيل MongoDB
mongod --dbpath C:\data\db
```

### 6. ملف .env للخادم المحلي
```env
# انسخ من backend/.env.example وقم بتعديل القيم
MONGODB_URI=mongodb://localhost:27017/basmah_academy
PORT=3001
JWT_SECRET=your_very_secure_jwt_secret_here_minimum_32_characters
NODE_ENV=development
DNS_SERVER_1=8.8.8.8
DNS_SERVER_2=8.8.4.4
```

### 7. تشغيل تلقائي عند بدء النظام
إنشاء ملف `start-basmah.bat`:
```batch
@echo off
cd /d C:\path\to\basmah-academy\backend
npm start
```

## استكشاف الأخطاء وإصلاحها

### إذا لم تعمل الاتصالات:
1. تحقق من إعدادات جدار الحماية
2. تأكد من تشغيل الخدمات على المنافذ الصحيحة
3. تحقق من اتصال الشبكة المحلية

### لاختبار الاتصال:
```bash
ping 192.168.100.14
telnet 192.168.100.14 3001
```

## الوصول من الإنترنت (اختياري)
إذا كنت تريد الوصول من خارج الشبكة المحلية:
1. إعداد إعادة توجيه المنفذ على الراوتر
2. استخدام خدمة مثل ngrok
```bash
ngrok http 3000
ngrok http 3001
```

ملاحظة: استبدل المسارات بأماكن الملفات الفعلية على جهازك.
