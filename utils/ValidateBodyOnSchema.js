import { z, ZodError } from "zod";

function ValidateBodyOnSchema(body, schema = z.object({})) {
  const validation = schema.safeParse(body);
  if (!validation.success) {
    console.error("failing validation");
    throw new ZodError(validation.error.issues);
  }

  return validation.data;
}

export default ValidateBodyOnSchema;
