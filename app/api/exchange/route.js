import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 初期データ（DBが空の時のためのバックアップ）
const backupBookmarks = [
  {
    bookTitle: '走れメロス',
    author: '太宰治',
    url: 'https://www.amazon.co.jp/s?k=走れメロス+太宰治',
    sentence: 'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。',
    impression: '友情と信実について考えさせられる、永遠の古典です。'
  },
  {
    bookTitle: '人間失格',
    author: '太宰治',
    url: 'https://www.amazon.co.jp/s?k=人間失格+太宰治',
    sentence: '恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。',
    impression: 'この一文の衝撃は、いつ読んでも色あせることがありません。'
  }
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { bookTitle, author, url, sentence, impression } = body;

    // 1. 投稿された栞を保存
    const { error: insertError } = await supabase
      .from('bookmarks')
      .insert([{ book_title: bookTitle, author, url, sentence, impression }]);

    if (insertError) throw insertError;

    // 2. 誰かの栞をランダムに取得
    // PostgreSQLの 'random()' 関数を使用
    const { data: randomBookmarks, error: fetchError } = await supabase
      .from('bookmarks')
      .select('*')
      .limit(10); // 一旦10件取得して、その中からJSでランダムに選ぶ（簡易的な抽選）

    if (fetchError) throw fetchError;

    let result;
    if (randomBookmarks && randomBookmarks.length > 0) {
      // 自分が今送ったもの以外を選びたいが、簡単のためランダムに抽出
      const randomIndex = Math.floor(Math.random() * randomBookmarks.length);
      const dbResult = randomBookmarks[randomIndex];
      
      result = {
        bookTitle: dbResult.book_title,
        author: dbResult.author,
        url: dbResult.url,
        sentence: dbResult.sentence,
        impression: dbResult.impression
      };
    } else {
      // DBが空の場合はバックアップから
      result = backupBookmarks[Math.floor(Math.random() * backupBookmarks.length)];
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Exchange error:', error);
    // エラー時はバックアップを返してユーザー体験を損なわないようにする
    return NextResponse.json(backupBookmarks[0]);
  }
}
