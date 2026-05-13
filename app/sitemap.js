export default function sitemap() {
  const lastModified = new Date().toISOString();
  return [
    {
      url: 'https://shiori-exchange.vercel.app',
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://shiori-exchange.vercel.app/post',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
