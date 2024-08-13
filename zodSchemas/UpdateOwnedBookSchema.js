import { z } from "zod";

export default z.object({
  cover: z.string().startsWith("http").optional(),
  quantity: z.string().optional(),
  price: z.string().optional(),
  status: z.enum(["free", "rented"]).optional(),
  approved: z.enum(["true", "false"]).optional(),
});
