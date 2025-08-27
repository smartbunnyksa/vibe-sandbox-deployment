const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// إعدادات Rate Limiting
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Rate limiters مختلفة
const rateLimiters = {
  // حد عام للـ API
  general: createRateLimiter(
    15 * 60 * 1000, // 15 دقيقة
    100, // 100 طلب
    'Too many requests from this IP, please try again later.'
  ),

  // حد صارم للمصادقة
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 دقيقة
    5, // 5 محاولات فقط
    'Too many authentication attempts, please try again later.'
  ),

  // حد للتسجيل
  register: createRateLimiter(
    60 * 60 * 1000, // ساعة واحدة
    3, // 3 تسجيلات فقط
    'Too many registration attempts, please try again later.'
  ),

  // حد لإعادة تعيين كلمة المرور
  passwordReset: createRateLimiter(
    60 * 60 * 1000, // ساعة واحدة
    3, // 3 محاولات فقط
    'Too many password reset attempts, please try again later.'
  )
};

// إعدادات Helmet للأمان
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // تعطيل لتجنب مشاكل مع بعض المتصفحات
  hsts: {
    maxAge: 31536000, // سنة واحدة
    includeSubDomains: true,
    preload: true
  }
};

// إعدادات CORS آمنة
const corsConfig = {
  origin: function (origin, callback) {
    // السماح للطلبات بدون origin (مثل التطبيقات المحمولة)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          'https://smartbunnyksa.com',
          'https://www.smartbunnyksa.com'
        ]
      : [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://192.168.100.14:3000'
        ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
};

// قائمة بالمسارات الحساسة التي تحتاج حماية إضافية
const sensitivePaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/users',
  '/api/admin'
];

// التحقق من صحة البيانات المدخلة
const sanitizeInput = (req, res, next) => {
  // إزالة الخصائص الخطيرة من الطلب
  const dangerousFields = ['__proto__', 'constructor', 'prototype'];
  
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      dangerousFields.forEach(field => {
        delete obj[field];
      });
      
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        } else if (typeof obj[key] === 'string') {
          // إزالة الأكواد الخطيرة
          obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
      });
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  
  next();
};

// Middleware للتسجيل الأمني
const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // تسجيل الطلبات الحساسة
  if (sensitivePaths.some(path => req.path.startsWith(path))) {
    console.log(`[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  }
  
  // تسجيل الاستجابات مع رموز الخطأ
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      console.log(`[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms - IP: ${req.ip}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  rateLimiters,
  helmetConfig,
  corsConfig,
  sanitizeInput,
  securityLogger,
  sensitivePaths
};
