import { z } from "zod";

// Uzbek phone format regex: +998 followed by 9 digits
const phoneRegex = /^(\+998|998)[0-9]{9}$/;

export const cleanPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("998") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+998${digits}`;
  }
  return phone.trim();
};

export const leadSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak")
    .max(50, "Ism juda uzun"),
  lastName: z
    .string()
    .trim()
    .min(2, "Familiya kamida 2 ta harfdan iborat bo'lishi kerak")
    .max(50, "Familiya juda uzun"),
  primaryPhone: z
    .string()
    .min(9, "Telefon raqamini to'liq kiriting")
    .refine((val) => {
      const cleaned = cleanPhoneNumber(val);
      return phoneRegex.test(cleaned);
    }, "Telefon raqami noto'g'ri. Masalan: +998 90 123 45 67"),
  secondaryPhone: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const cleaned = cleanPhoneNumber(val);
      return phoneRegex.test(cleaned);
    }, "Qo'shimcha telefon raqami noto'g'ri"),
  courseInterest: z.string().optional().nullable(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirish shart",
  }),
});

export type LeadInput = z.infer<typeof leadSchema>;
