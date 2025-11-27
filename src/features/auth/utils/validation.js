import { z } from "zod";
//* Can add validation per feature
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(7, { message: "Password is required." }),
});

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    name: z.string().min(2, { message: "Name is required." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    bornDate: z.string().min(10, { message: "Born date is required." }),
    gender: z.string().min(1, { message: "Gender is required." }),
    occupation: z.string().min(1, { message: "Occupation is required." }),
    country: z.string().min(1, { message: "Country is required." }),
    city: z.string().min(1, { message: "City is required." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters." }),
    phoneNumber: z.string().min(12, "Phone number must be at least 12 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
