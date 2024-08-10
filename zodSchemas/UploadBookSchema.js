import { z } from "zod";

export default z.object({
  cover: z.string("Cover image is required").startsWith("http"),
  quantity: z.string("Quantity is required"),
  price: z.string("Price is required"),
  bookId: z.string("Book ID is required"),
});
