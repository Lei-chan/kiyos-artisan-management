import * as z from "zod";

const History = z.object({
  year: z.number(),
  month: z.number().gt(1).lt(12),
  contents: z.array(
    z.object({
      images: z.array(
        z.object({
          buffer: z.instanceof(Buffer),
          name: z.object({
            en: z.string().trim(),
            ja: z.string().trim(),
          }),
        }),
      ),
      sentence: z.object({
        en: z.array(z.string().trim()),
        ja: z.array(z.string().trim()),
      }),
    }),
  ),
  lastModifiedUserId: z.string(),
});

export default History;
