const { z } = require("zod");

exports.createChannelSchema = z
  .object({
    name: z
      .string("نام کانال باید رشته متنی باشد")
      .min(1, "نام کانال را وارد کنید")
      .max(255, "نام کانال حداکثر ۲۵۵ کاراکتر است"),
    username: z
      .string()
      .min(3, "یوزرنیم حداقل باید ۳ کاراکتر باشد")
      .max(255, "یوزرنیم حداکثر ۲۵۵ کاراکتر است")
      .regex(/^[a-zA-Z0-9_]+$/, "یوزرنیم باید شامل حروف، اعداد و اندرلاین باشد")
      .optional()
      .or(z.literal("")),
    is_private: z
      .preprocess(
        (val) => val === "true" || val === true || val === 1,
        z.boolean(),
      )
      .optional()
      .default(false),
    bio: z
      .string()
      .max(65535, "بیوگرافی خیلی طولانی است")
      .optional()
      .or(z.literal("")),
  })
  .strict("شما فیلدهای نامتعارف ارسال کردید");

exports.sendChannelMessageSchema = z
  .object({
    channel_id: z.coerce
      .number({ message: "شناسه کانال معتبر نیست" })
      .int()
      .positive("شناسه کانال معتبر نیست"),
    text: z.string().optional().or(z.literal("")),
    parent_id: z.coerce.number().int().positive().optional().nullable(),
    is_free: z
      .preprocess(
        (val) => val === "true" || val === true || val === 1,
        z.boolean(),
      )
      .optional()
      .default(true),
  })
  .strict("شما فیلدهای نامتعارف ارسال کردید");

exports.joinChannelSchema = z
  .object({
    channel_id: z.coerce
      .number({ message: "شناسه کانال معتبر نیست" })
      .int()
      .positive()
      .optional(),
    private_link: z.string().optional().or(z.literal("")),
    username: z.string().optional().or(z.literal("")),
  })
  .strict("شما فیلدهای نامتعارف ارسال کردید")
  .refine((data) => data.channel_id || data.private_link || data.username, {
    message: "شناسه کانال، آیدی عمومی یا لینک خصوصی کانال را وارد کنید",
  });
