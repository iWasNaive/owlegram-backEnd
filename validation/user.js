const { z } = require("zod");

exports.userSchema = z
  .object({
    username: z
      .string("رشته متنی باید ارسال کنید")
      .min(3, "یوزرنیم حداقل باید 3 کاراکتر باشد")
      .regex(/^[a-zA-Z0-9_]+$/, "یوزرنیم باید شامل حروف اعداد و اندرلاین باشد"),
    password: z.string().min(3, "رمز حدقل ۳ کرکتر"),
  })
  .strict("شما فیلدهای نامتعارف ارسال کردید");

exports.usernameSchema = z.object({
  username: z
    .string("رشته متنی باید ارسال کنید")
    .min(3, "یوزرنیم حداقل باید 3 کاراکتر باشد")
    .regex(/^[a-zA-Z0-9_]+$/, "یوزرنیم باید شامل حروف اعداد و اندرلاین باشد"),
});
