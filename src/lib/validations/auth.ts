import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak")
    .max(30, "Foydalanuvchi nomi juda uzun")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Foydalanuvchi nomida faqat harf, son, _, ., - bo'lishi mumkin"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak")
      .regex(/[A-Z]/, "Parolda kamida bitta katta harf bo'lishi kerak")
      .regex(/[0-9]/, "Parolda kamida bitta raqam bo'lishi kerak"),
    confirmPassword: z.string().min(1, "Parolni tasdiqlang"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parollar bir-biriga mos kelmadi",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const createAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak")
    .max(30, "Foydalanuvchi nomi juda uzun")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Foydalanuvchi nomida faqat harf, son, _, ., - bo'lishi mumkin"),
  temporaryPassword: z
    .string()
    .min(8, "Vaqtinchalik parol kamida 8 ta belgidan iborat bo'lishi kerak"),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
