const multer = require("multer");
const fs = require("fs");
const path = require("path");

// یه تابع می‌سازیم که تنظیمات رو می‌گیره و یه میدلور مالتر برمی‌گردونه
const createUploader = (folderName, allowedTypes, maxSizeMB = 5) => {
  // ۱. تنظیمات ذخیره‌سازی داینامیک
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // آدرس داینامیک بر اساس ورودی تابع
      const dir = `./public/uploads/${folderName}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  // ۲. فیلتر فرمت‌ها داینامیک
  const fileFilter = (req, file, cb) => {
    // allowedTypes الان یه Regex هست که از بیرون پاس داده میشه
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error(`فرمت فایل مجاز نیست! فقط فرمت‌های تعریف شده مجازند.`),
        false,
      );
    }
  };

  // ۳. ساخت و ریترن کردن مالتر نهایی
  return multer({
    storage: storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 }, // تبدیل مگابایت به بایت
    fileFilter: fileFilter,
  });
};

// تابع رو اکسپورت می‌کنیم تا هر جا خواستیم ازش استفاده کنیم
module.exports = createUploader;
