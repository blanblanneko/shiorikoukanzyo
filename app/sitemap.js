export default function sitemap() {
  return [
    {
      url: 'https://shiori-exchange.vercel.app',
      lastModified: new RegExp().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://shiori-exchange.vercel.app/post',
      lastModified: new RegExp().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
