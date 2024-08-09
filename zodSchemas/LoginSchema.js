import { z } from "zod";

export default z.object({
  email: z.string("Email field is required").email("Invalid email address"),
  password: z
    .string("password field is required")
    .min(6, "Minimum password should be greater than 5 characters"),
  userType: z.enum(["owner", "admin", "user"]),
});
