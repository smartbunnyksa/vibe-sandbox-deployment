# دليل الأمان - Basmah Academy

## نظرة عامة على الأمان

تم تطبيق مجموعة شاملة من الإجراءات الأمنية لضمان حماية التطبيق والبيانات.

## الإجراءات الأمنية المطبقة

### 1. حماية المصادقة والتفويض
- **JWT Tokens**: استخدام رموز JWT آمنة مع انتهاء صلاحية (24 ساعة)
- **تشفير كلمات المرور**: استخدام bcryptjs مع salt rounds = 12
- **التحقق من صحة المدخلات**: فلترة وتنظيف جميع المدخلات
- **أدوار المستخدمين**: نظام أدوار متدرج (superadmin, admin, coach, player, parent)

### 2. حماية من الهجمات
- **Rate Limiting**: حدود مختلفة للطلبات حسب نوع العملية
  - عام: 100 طلب كل 15 دقيقة
  - مصادقة: 5 محاولات كل 15 دقيقة
  - تسجيل: 3 محاولات كل ساعة
- **CORS**: تكوين آمن للمصادر المسموحة
- **Helmet**: رؤوس أمان HTTP شاملة
- **Input Sanitization**: تنظيف المدخلات من الأكواد الخطيرة

### 3. حماية البيانات
- **متغيرات البيئة**: جميع البيانات الحساسة في ملفات .env
- **عدم تسريب كلمات المرور**: إزالة كلمات المرور من الاستجابات
- **التحقق من الملكية**: المستخدمون يمكنهم الوصول لبياناتهم فقط
- **تشفير الاتصال**: فرض HTTPS في بيئة الإنتاج

### 4. المراقبة والتسجيل
- **تسجيل أمني**: تسجيل جميع العمليات الحساسة
- **مراقبة الأخطاء**: تتبع محاولات الوصول غير المصرح بها
- **سجلات الوصول**: تسجيل جميع طلبات API

## ملفات الأمان

### الملفات الأساسية
- `backend/middleware/auth.js` - middleware المصادقة والتفويض
- `backend/config/security.js` - تكوينات الأمان الشاملة
- `backend/.env.example` - مثال على متغيرات البيئة
- `.gitignore` - حماية الملفات الحساسة من Git

### متغيرات البيئة المطلوبة
```env
JWT_SECRET=your_very_secure_jwt_secret_here_minimum_32_characters
MONGODB_URI=mongodb://localhost:27017/basmah_academy
NODE_ENV=production
```

## إرشادات الأمان للمطورين

### 1. كلمات المرور
- يجب أن تكون 8 أحرف على الأقل
- تحتوي على حرف كبير وصغير ورقم ورمز خاص
- يتم تشفيرها قبل الحفظ في قاعدة البيانات

### 2. JWT Tokens
- انتهاء صلاحية: 24 ساعة
- يجب تمرير التوكن في header: `Authorization: Bearer <token>`
- التحقق من صحة التوكن في كل طلب محمي

### 3. الأدوار والصلاحيات
- **superadmin**: وصول كامل لجميع الموارد
- **admin**: إدارة الفرع والمستخدمين
- **coach**: إدارة اللاعبين والجلسات
- **player**: عرض البيانات الشخصية فقط
- **parent**: عرض بيانات الأطفال فقط

### 4. التحقق من المدخلات
```javascript
// مثال على التحقق من صحة البريد الإلكتروني
body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address')
```

## نقاط النهاية المحمية

### مصادقة مطلوبة
- `GET /api/auth/me` - معلومات المستخدم الحالي
- `GET /api/users` - قائمة المستخدمين (admin فقط)
- `PUT /api/users/:id` - تحديث المستخدم
- جميع عمليات الفروع والجلسات

### بدون مصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - التسجيل
- `GET /api/health` - فحص حالة الخادم

## اختبار الأمان

### اختبارات يدوية
```bash
# اختبار Rate Limiting
for i in {1..10}; do curl -X POST http://localhost:3001/api/auth/login; done

# اختبار CORS
curl -H "Origin: http://malicious-site.com" http://localhost:3001/api/health

# اختبار التوكن غير الصحيح
curl -H "Authorization: Bearer invalid_token" http://localhost:3001/api/auth/me
```

### أدوات الاختبار الموصى بها
- **OWASP ZAP**: فحص الثغرات الأمنية
- **Postman**: اختبار API والمصادقة
- **npm audit**: فحص الثغرات في التبعيات

## التحديثات الأمنية

### مراجعة دورية
- فحص التبعيات شهرياً: `npm audit`
- مراجعة سجلات الأمان أسبوعياً
- تحديث كلمات المرور كل 3 أشهر

### الاستجابة للحوادث
1. تحديد نوع الهجوم
2. عزل النظام المتأثر
3. تحليل السجلات
4. إصلاح الثغرة
5. تحديث إجراءات الأمان

## الإبلاغ عن الثغرات

إذا اكتشفت ثغرة أمنية، يرجى الإبلاغ عنها فوراً:
- البريد الإلكتروني: security@smartbunnyksa.com
- لا تنشر الثغرة علناً قبل الإصلاح

## المراجع

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
