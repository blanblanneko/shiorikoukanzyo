import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // キャッシュを無効化し、毎回ランダムに取得する

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
    const { data: insertedData, error: insertError } = await supabase
      .from('bookmarks')
      .insert([{ book_title: bookTitle, author, url, sentence, impression }])
      .select('id')
      .single();

    if (insertError) {
      console.error('【Supabase保存エラー】:', insertError.message, insertError.details, insertError.hint);
      throw insertError;
    }

    // 2. 誰かの栞をランダムに取得（自分のIDは除外する）
    const { data: randomBookmarks, error: fetchError } = await supabase
      .from('bookmarks')
      .select('*')
      .neq('id', insertedData.id) // 自分のIDを除外！
      .limit(10);

    if (fetchError) {
      console.error('【Supabase取得エラー】:', fetchError.message);
      throw fetchError;
    }

    let result;
    if (randomBookmarks && randomBookmarks.length > 0) {
      // 取得した候補の中からランダムに1つ選ぶ
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
      // 他にデータがない場合はバックアップから
      result = backupBookmarks[Math.floor(Math.random() * backupBookmarks.length)];
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Detailed Exchange Error:', error);
    return NextResponse.json(backupBookmarks[0]);
  }
}

export async function GET() {
  try {
    // 誰かの栞をランダムに取得
    const { data: randomBookmarks, error: fetchError } = await supabase
      .from('bookmarks')
      .select('*')
      .limit(50); // ランダム性を高めるため少し多めに取得

    if (fetchError) {
      console.error('【Supabase取得エラー(GET)】:', fetchError.message);
      throw fetchError;
    }

    let result;
    if (randomBookmarks && randomBookmarks.length > 0) {
      // 取得した候補の中からランダムに1つ選ぶ
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
      // 他にデータがない場合はバックアップから
      result = backupBookmarks[Math.floor(Math.random() * backupBookmarks.length)];
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Detailed Exchange Error (GET):', error);
    return NextResponse.json(backupBookmarks[0]);
  }
}
