export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://shiori-exchange.vercel.app/sitemap.xml',
  };
}
