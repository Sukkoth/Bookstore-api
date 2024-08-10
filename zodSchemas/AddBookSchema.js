import { z } from "zod";

export default z.object({
  name: z
    .string("Name field is required")
    .min(2, "Enter valid length for name"),
  authorName: z
    .string("Author field is required")
    .min(2, "Enter valid length for author"),
  categoryId: z.string("Category Id is required"),
});
