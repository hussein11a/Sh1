# 🚛 سطحة هيدروليك - موقع خدمات نقل ورفع السيارات

موقع ثابت احترافي لعرض خدمات نقل ورفع السيارات باستخدام أحدث التقنيات الهيدروليكية، مُحسّن للنشر على منصة Netlify.

## ✨ المميزات

### 🎨 التصميم والواجهة
- تصميم حديث ومتجاوب مع جميع الأجهزة
- دعم كامل للغة العربية والتخطيط RTL
- نظام ألوان احترافي (أزرق داكن، برتقالي، أخضر)
- وضع مظلم/فاتح مع تبديل تلقائي
- خط Cairo المحسن للعربية
- تأثيرات بصرية وانتقالات سلسة

### 🔧 الوظائف الأساسية
- عرض 5 خدمات رئيسية لنقل السيارات
- أزرار عائمة للاتصال والواتساب
- قسم المميزات (خدمة 24/7، معدات حديثة، إلخ)
- معلومات تواصل واضحة
- تحديث ديناميكي للمحتوى

### 🛡️ الأمان والحماية
- تعطيل النقر بالزر الأيمن ومنع النسخ
- حماية من أدوات المطورين
- رؤوس أمنية قوية
- حماية لوحة التحكم
- منع البرمجيات الخبيثة

### ⚡ الأداء والتحسين
- Service Worker للعمل offline
- تحسين البطارية للهواتف
- ضغط وتحسين الصور
- تحميل سريع للخطوط
- PWA جاهز للتثبيت

### 🎛️ إدارة المحتوى (Netlify CMS)
- لوحة تحكم باللغة العربية
- تحرير المحتوى بدون مطور
- معاينة حية للتغييرات
- إدارة الخدمات والمميزات
- حماية بكلمات مرور

### 🚀 محركات البحث (SEO)
- بنية HTML5 محسنة
- ملفات robots.txt و sitemap.xml
- Schema markup للبيانات المنظمة
- Open Graph للمشاركة الاجتماعية
- تحسين للبحث المحلي

## 📁 هيكل المشروع

```
netlify-site/
├── index.html                 # الصفحة الرئيسية
├── manifest.json             # إعدادات PWA
├── sw.js                     # Service Worker
├── netlify.toml              # إعدادات Netlify
├── robots.txt                # قواعد محركات البحث
├── sitemap.xml              # خريطة الموقع
├── favicon.svg              # أيقونة الموقع
├── apple-touch-icon.png     # أيقونة iOS
├── _redirects              # قواعد التوجيه والأمان
├── assets/
│   ├── css/
│   │   └── style.css       # الأنماط الرئيسية
│   └── js/
│       ├── main.js         # الوظائف الرئيسية
│       └── data.js         # بيانات الموقع
├── admin/
│   ├── config.yml          # إعدادات Netlify CMS
│   ├── index.html          # واجهة الإدارة
│   └── preview.css         # أنماط المعاينة
└── _data/
    ├── privacy.md          # سياسة الخصوصية
    └── terms.md            # شروط الاستخدام
```

## 🚀 النشر على Netlify

### الطريقة الأولى: Git Deploy
1. ارفع الملفات إلى مستودع GitHub
2. اربط المستودع بـ Netlify
3. سيتم النشر تلقائياً

### الطريقة الثانية: Manual Deploy
1. اضغط على جميع الملفات في ملف ZIP
2. ارفع الملف على Netlify Drop
3. سيكون الموقع جاهزاً فوراً

### الطريقة الثالثة: Netlify CLI
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# النشر
netlify deploy --prod --dir=netlify-site
```

## ⚙️ إعدادات Netlify المطلوبة

### Build Settings
- **Build command**: `echo 'Static site - no build needed'`
- **Publish directory**: `.` (الملف الجذر)

### Environment Variables
لا توجد متغيرات بيئة مطلوبة للتشغيل الأساسي.

### Netlify CMS Setup
1. فعّل Git Gateway في إعدادات Netlify
2. فعّل Identity service
3. أضف admin كـ External Provider
4. ادخل على `/admin` لإعداد كلمة المرور

## 🛠️ التخصيص

### تغيير المحتوى
1. ادخل على `/admin` بعد النشر
2. سجل دخول بحساب Netlify
3. عدّل المحتوى من الواجهة

### تغيير الألوان
عدّل المتغيرات في `assets/css/style.css`:
```css
:root {
  --btn-primary: #f59e0b;        /* برتقالي */
  --btn-whatsapp: #25d366;       /* أخضر واتساب */
  --btn-phone: #3b82f6;          /* أزرق */
}
```

### تحديث بيانات الاتصال
عدّل في `assets/js/data.js`:
```javascript
site: {
  phone: "+966501234567",
  whatsapp: "+966501234567",
  // ... باقي البيانات
}
```

## 📱 المتطلبات التقنية

- **المتصفحات المدعومة**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **الأجهزة**: جميع أحجام الشاشات من 320px إلى 4K
- **الشبكة**: يعمل offline بعد التحميل الأول
- **الأداء**: أقل من 3 ثواني للتحميل الكامل

## 🔒 الأمان

- تشفير HTTPS إجباري
- حماية CSRF
- منع XSS
- رؤوس أمنية شاملة
- حماية من الزحف الآلي الضار

## 📊 Analytics (اختياري)

لإضافة Google Analytics:
1. احصل على Tracking ID
2. أضفه في `_data/seo.yml` عبر CMS
3. سيتم تطبيقه تلقائياً

## 🐛 استكشاف الأخطاء

### الموقع لا يظهر
- تأكد من أن `index.html` في المجلد الجذر
- تحقق من إعدادات Netlify Deploy

### CMS لا يعمل
- تأكد من تفعيل Git Gateway
- تحقق من صحة `admin/config.yml`
- راجع إعدادات Identity

### الخطوط لا تظهر
- تحقق من اتصال الإنترنت
- تأكد من عدم حجب Google Fonts

## 📞 الدعم

للمساعدة في التخصيص أو حل المشاكل:
- راجع [وثائق Netlify](https://docs.netlify.com)
- راجع [وثائق Netlify CMS](https://www.netlifycms.org/docs)

## 📄 الرخصة

هذا المشروع مُرخص للاستخدام الشخصي والتجاري.

---

**تم تطوير هذا الموقع خصيصاً لخدمات سطحة هيدروليك بأعلى معايير الجودة والأمان.**

🚛 **سطحة هيدروليك - خدمات احترافية على مدار الساعة**