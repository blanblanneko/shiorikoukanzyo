import "./globals.css";

export const metadata = {
  title: "栞の交換所 | あなたの好きな一文を、誰かと交換する読書コミュニティ",
  description: "心に残った本の一文を綴り、誰かの大切な一文を受け取る。匿名で楽しめる、本好きのための『栞』交換プラットフォームです。読書記録や名言の共有に。",
  keywords: ["栞の交換所", "本", "読書", "名言", "一文", "読書記録", "コミュニティ", "本好き"],
  openGraph: {
    title: "栞の交換所",
    description: "心に残った本の一文を、誰かと交換しませんか？",
    url: "https://shiori-exchange.vercel.app",
    siteName: "栞の交換所",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "栞の交換所",
    description: "あなたの好きな一文を、誰かの好きな一文と交換する場所。",
  },
  verification: {
    google: "XD_wmJtJlr0DaXS-Lq3-bh9ARFL5vSYBVUeoN7O2u_s",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
