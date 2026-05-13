import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    // 国立国会図書館(NDL)のAPIを使用
    const res = await fetch(`https://iss.ndl.go.jp/api/opensearch?title=${encodeURIComponent(query)}&cnt=5`);
    const xml = await res.text();

    // XMLから必要な情報を抽出（簡易正規表現パース）
    const items = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const content = match[1];
      const title = content.match(/<title>(.*?)<\/title>/)?.[1] || '不明なタイトル';
      const author = content.match(/<author>(.*?)<\/author>/)?.[1] || 
                     content.match(/<dc:creator>(.*?)<\/dc:creator>/)?.[1] || '不明';
      
      items.push({
        volumeInfo: {
          title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          authors: [author.replace(/&amp;/g, '&')],
        }
      });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('NDL Search Error:', error);
    return NextResponse.json({ items: [] });
  }
}
