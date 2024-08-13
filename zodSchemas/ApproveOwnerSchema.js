import { z } from "zod";

export default z.object({
  approved: z.enum(["true", "false"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
