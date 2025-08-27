# دليل رفع التطبيق على النطاق smartbunnyksa.com

## المتطلبات الأساسية
1. خادم استضافة (VPS أو استضافة مشتركة)
2. نطاق مسجل: smartbunnyksa.com
3. وصول SSH/FTP إلى الخادم
4. Node.js و MongoDB مثبتان على الخادم

## خطوات الرفع

### 1. تحضير الملفات
```bash
# نسخ الملفات إلى الخادم
scp -r backend/ user@smartbunnyksa.com:/var/www/basmah-academy/backend
scp -r web/ user@smartbunnyksa.com:/var/www/basmah-academy/web
```

### 2. تثبيت التبعيات
```bash
ssh user@smartbunnyksa.com
cd /var/www/basmah-academy/backend
npm install
```

### 3. تكوين البيئة
```bash
# إنشاء ملف .env على الخادم
nano /var/www/basmah-academy/backend/.env
```

محتوى ملف .env (استخدم backend/.env.example كمرجع):
```
# انسخ من backend/.env.example وقم بتعديل القيم حسب بيئة الإنتاج
MONGODB_URI=mongodb://localhost:27017/basmah_academy
PORT=3001
JWT_SECRET=your_very_secure_jwt_secret_here_minimum_32_characters
NODE_ENV=production
DNS_SERVER_1=8.8.8.8
DNS_SERVER_2=8.8.4.4
```

### 4. تكوين Nginx (لخدمة الواجهة الأمامية والوكيل العكسي)
```bash
# إنشاء ملف تكوين Nginx
sudo nano /etc/nginx/sites-available/smartbunnyksa.com
```

محتوى تكوين Nginx:
```nginx
server {
    listen 80;
    server_name smartbunnyksa.com www.smartbunnyksa.com;

    # خدمة الملفات الثابتة (الواجهة الأمامية)
    location / {
        root /var/www/basmah-academy/web;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # الوكيل العكسي للـ API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. تفعيل الموقع
```bash
sudo ln -s /etc/nginx/sites-available/smartbunnyksa.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. إعداد خدمة Systemd للخادم الخلفي
```bash
sudo nano /etc/systemd/system/basmah-academy.service
```

محتوى ملف الخدمة:
```ini
[Unit]
Description=Basmah Academy Backend Service
After=network.target

[Service]
User=user
WorkingDirectory=/var/www/basmah-academy/backend
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### 7. تشغيل الخدمة
```bash
sudo systemctl daemon-reload
sudo systemctl start basmah-academy
sudo systemctl enable basmah-academy
```

### 8. تكوين SSL (HTTPS)
```bash
# تثبيت certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d smartbunnyksa.com -d www.smartbunnyksa.com
```

### 9. تكوين DNS
قم بتوجيه النطاق smartbunnyksa.com إلى عنوان IP الخاص بالخادم عبر لوحة تحكم مزود الاستضافة.

## الاختبار بعد الرفع
1. زيارة https://smartbunnyksa.com للتأكد من عمل الواجهة الأمامية
2. اختبار API: https://smartbunnyksa.com/api/health
3. اختبار نقاط النهاية المختلفة

## المراقبة والصيانة
```bash
# مراقبة السجلات
sudo journalctl -u basmah-academy -f
sudo tail -f /var/log/nginx/access.log
```

## النسخ الاحتياطي
```bash
# نسخ احتياطي للقاعدة البيانات
mongodump --db basmah_academy --out /backup/$(date +%Y%m%d)
```

ملاحظة: استبدل `user` ومسارات الملفات بمعلومات الخادم الفعلية الخاصة بك.
