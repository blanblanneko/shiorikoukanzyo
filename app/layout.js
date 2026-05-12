import "./globals.css";

export const metadata = {
  title: "栞の交換所 - 好きな一文を贈ると、誰かの好きな本に出会う。",
  description: "あなたの好きな一文を贈ると、見知らぬ誰かの好きな本と出会う。静かな読書体験の交換所。",
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
