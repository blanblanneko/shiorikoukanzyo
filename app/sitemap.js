export default function sitemap() {
  const baseUrl = 'https://shiori-exchange.vercel.app'; // あなたのサイトのURLに合わせてください

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/post`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
  ];
}
