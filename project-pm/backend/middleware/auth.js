const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware للتحقق من صحة التوكن
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // البحث عن المستخدم
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // إضافة معلومات المستخدم إلى الطلب
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

// Middleware للتحقق من الأدوار
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Middleware للتحقق من ملكية المورد
const authorizeOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // السماح للمشرف العام والمدير بالوصول لجميع الموارد
    if (['superadmin', 'admin'].includes(req.user.role)) {
      return next();
    }

    // التحقق من الملكية للأدوار الأخرى
    const resourceUserId = req.params.id || req.body[resourceField] || req.query[resourceField];
    
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own resources.' 
      });
    }

    next();
  };
};

// Middleware اختياري للمصادقة (لا يرفض الطلب إذا لم يكن هناك توكن)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // في حالة الخطأ، نتجاهله ونتابع بدون مستخدم
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeOwnership,
  optionalAuth
};
