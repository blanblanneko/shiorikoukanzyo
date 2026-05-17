export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://shiori-exchange.vercel.app/sitemap.xml',
  };
}
