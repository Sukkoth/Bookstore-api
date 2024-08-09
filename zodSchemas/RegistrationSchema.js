import { z } from "zod";

export default z
  .object({
    firstName: z.string("First name is required").min(2),
    lastName: z.string("Last name is required").min(2),
    email: z.string("Email is required").email("Invalid email"),
    password: z.string("Password field is required").min(6),
    confirmPassword: z.string("Password field is required").min(6),
    location: z.string("Location is required"),
    phone: z.string("Phone number is required"),
    userType: z.enum(["owner", "admin", "user"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
