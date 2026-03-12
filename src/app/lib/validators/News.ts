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
    sentence: StringForLanguage,
    link: { href: z.string().trim(), name: StringForLanguage },
  }),
  lastModifiedUserId: z.string(),
});

export default News;
