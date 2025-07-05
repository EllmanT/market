import { z } from "zod";
export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const uploadDocumentSchema = z.object({
 file: z.custom<File>((val) => {
    if (!(val instanceof File)) return false;
    const isPdf =
      val.type.includes("pdf") ||
      val.name.toLowerCase().endsWith(".pdf");
    return isPdf;
  }, {
    message: "Only PDF files allowed",
  }),

});
