import * as z from "zod";

const StringForLanguage = z.object({
  en: z.string().trim(),
  ja: z.string().trim(),
});

const News = z.object({
  date: z.string(),
  type: z.string(),
  content: z.object({
    title: StringForLanguage,
    sentence: z.object({
      en: z.array(z.string().trim()),
      ja: z.array(z.string().trim()),
    }),
    link: z.string().trim(),
  }),
  lastModifiedUserId: z.string(),
});

export default News;
