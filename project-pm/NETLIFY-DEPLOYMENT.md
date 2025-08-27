# دليل رفع منصة بصمة لاعب على Netlify

## نظرة عامة
هذا الدليل يوضح كيفية رفع الواجهة الأمامية لمنصة بصمة لاعب على Netlify مع ربطها بالخادم الخلفي.

## المتطلبات المسبقة
- حساب على [Netlify](https://netlify.com)
- حساب على [GitHub](https://github.com) (اختياري للنشر التلقائي)
- Netlify CLI مثبت محلياً

## الطريقة الأولى: النشر المباشر باستخدام Netlify CLI

### 1. تسجيل الدخول إلى Netlify
```bash
netlify login
```

### 2. تهيئة المشروع
```bash
# من المجلد الرئيسي للمشروع
netlify init
```

### 3. النشر للاختبار
```bash
netlify deploy --dir=web
```

### 4. النشر النهائي
```bash
netlify deploy --prod --dir=web
```

## الطريقة الثانية: النشر عبر GitHub (موصى بها)

### 1. إنشاء مستودع GitHub
```bash
git init
git add .
git commit -m "Initial commit: Basmah Academy Platform"
git branch -M main
git remote add origin https://github.com/yourusername/basmah-academy.git
git push -u origin main
```

### 2. ربط المستودع بـ Netlify
1. اذهب إلى [Netlify Dashboard](https://app.netlify.com)
2. اضغط على "New site from Git"
3. اختر GitHub واختر المستودع
4. اضبط الإعدادات:
   - **Build command**: `echo 'Building frontend...'`
   - **Publish directory**: `web`
   - **Branch to deploy**: `main`

### 3. إعداد متغيرات البيئة
في لوحة تحكم Netlify:
1. اذهب إلى Site settings > Environment variables
2. أضف المتغيرات التالية:
```
REACT_APP_API_URL=https://your-backend-url.herokuapp.com
NODE_VERSION=18
```

## إعداد الخادم الخلفي

### خيار 1: Heroku (موصى به)
```bash
# في مجلد backend
heroku create basmah-academy-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_jwt_secret_here
heroku config:set MONGODB_URI=your_mongodb_connection_string
git subtree push --prefix backend heroku main
```

### خيار 2: Railway
```bash
# في مجلد backend
railway login
railway init
railway add
railway deploy
```

### خيار 3: Render
1. اذهب إلى [Render Dashboard](https://render.com)
2. أنشئ Web Service جديد
3. اربطه بمجلد `backend`
4. اضبط متغيرات البيئة

## تحديث إعدادات API في الواجهة الأمامية

### تحديث ملف api.js
```javascript
// في web/assets/js/api.js
const API_BASE_URL = 'https://your-backend-url.herokuapp.com/api';
// أو
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://your-backend-url.herokuapp.com/api';
```

## إعدادات الأمان المتقدمة

### 1. تحديث netlify.toml
```toml
# تحديث رابط API في netlify.toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend-url.herokuapp.com/api/:splat"
  status = 200
  force = true
```

### 2. إعداد CORS في الخادم الخلفي
```javascript
// في backend/server.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

## اختبار النشر

### 1. اختبار الواجهة الأمامية
```bash
# زيارة الرابط المؤقت
https://amazing-site-name.netlify.app
```

### 2. اختبار API
```bash
curl https://your-netlify-site.netlify.app/api/health
```

### 3. اختبار المصادقة
```bash
curl -X POST https://your-netlify-site.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

## إعداد النطاق المخصص

### 1. في لوحة تحكم Netlify
1. اذهب إلى Site settings > Domain management
2. اضغط على "Add custom domain"
3. أدخل النطاق: `smartbunnyksa.com`

### 2. إعداد DNS
أضف السجلات التالية في مزود النطاق:
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

### 3. تفعيل SSL
Netlify سيقوم بتفعيل SSL تلقائياً لنطاقك المخصص.

## مراقبة الأداء

### 1. Analytics
```bash
# تفعيل Netlify Analytics
netlify open --admin
# اذهب إلى Analytics tab
```

### 2. Functions (للميزات المتقدمة)
```javascript
// netlify/functions/api.js
exports.handler = async (event, context) => {
  // Serverless functions للمعالجة الخلفية
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify Functions!' })
  };
};
```

## استكشاف الأخطاء

### مشاكل شائعة وحلولها:

#### 1. خطأ 404 عند التنقل
**الحل**: تأكد من وجود إعادة التوجيه في `netlify.toml`

#### 2. مشاكل CORS
**الحل**: تحديث إعدادات CORS في الخادم الخلفي

#### 3. مشاكل API
**الحل**: التأكد من صحة رابط API في الكود

#### 4. مشاكل البناء
**الحل**: فحص سجلات البناء في Netlify Dashboard

## الأوامر المفيدة

```bash
# عرض معلومات الموقع
netlify status

# فتح الموقع في المتصفح
netlify open

# عرض السجلات
netlify logs

# إعادة النشر
netlify deploy --prod --dir=web

# حذف الموقع
netlify sites:delete
```

## الخطوات التالية

1. ✅ رفع الواجهة الأمامية على Netlify
2. ✅ رفع الخادم الخلفي على Heroku/Railway/Render
3. ✅ ربط النطاق المخصص
4. ✅ تفعيل SSL
5. ✅ إعداد مراقبة الأداء
6. ✅ اختبار جميع الوظائف

## الدعم الفني

للحصول على المساعدة:
- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Community](https://community.netlify.com)
- [Netlify Support](https://netlify.com/support)

---

**ملاحظة مهمة**: تأكد من تحديث جميع الروابط والمتغيرات بالقيم الفعلية قبل النشر النهائي.
