import { z } from "zod";

const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

const searchPaginationSchema = z.object({
  query: paginationSchema.shape.query.extend({
    search: z.string().trim().optional(),
  }),
});

export { paginationSchema, searchPaginationSchema };

export type SearchPaginationType = z.infer<typeof searchPaginationSchema>;
export type PaginationType = z.infer<typeof paginationSchema>;
