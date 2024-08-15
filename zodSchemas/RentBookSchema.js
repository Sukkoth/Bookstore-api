import { z } from "zod";

export default z.object({
  dueDate: z.string().refine(
    (dateString) => {
      const dueDate = new Date(dateString);
      const now = new Date();

      if (isNaN(dueDate.getTime())) {
        return false;
      }
      //has to be future
      return dueDate > now;
    },
    {
      message: "Due date must be a valid date in the future",
    }
  ),
  quantity: z.number().optional(),
});
