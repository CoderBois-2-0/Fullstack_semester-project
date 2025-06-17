import { commentSelectSchema } from "@/db/handlers/commentHandler/dto";

const commentResponseSchema = commentSelectSchema.openapi("Comment Response");

export { commentResponseSchema };
