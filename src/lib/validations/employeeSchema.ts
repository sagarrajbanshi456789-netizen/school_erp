import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Enter a valid email"),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 7, {
      message: "Phone must be at least 7 digits",
    }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number"),
});
