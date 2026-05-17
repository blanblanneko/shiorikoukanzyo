import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// .env.localから環境変数を読み込む簡易処理
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars['SUPABASE_URL'];
const supabaseAnonKey = envVars['SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seedData = [
  // 現代小説・エッセイ
  { book_title: '傲慢と善良', author: '辻村深月', url: 'https://www.amazon.co.jp/dp/B07R4RFPXY', sentence: '自分がどれほど傲慢かに気づかないまま、私たちは無邪気に善良であろうとする。', impression: '自分の内側にある無自覚なエゴを突きつけられ、痛いほど共感しました。' },
  { book_title: '変な家', author: '雨穴', url: 'https://www.amazon.co.jp/dp/B099K1Z42V', sentence: '人が本当に恐ろしいのは、幽霊や化け物ではなく、その心の奥底に隠された悪意だ。', impression: '間取り図を見ながら読むという新しい体験。ページをめくる手が止まりませんでした。' },
  { book_title: '推し、燃ゆ', author: '宇佐見りん', url: 'https://www.amazon.co.jp/dp/B08L7F1K91', sentence: '推しは私の背骨だ。', impression: '何かに熱狂し、それなしでは立っていられない危うさと純粋さに、深く心を揺さぶられました。' },
  { book_title: '成瀬は天下を取りにいく', author: '宮島未奈', url: 'https://www.amazon.co.jp/dp/B0BWMYF7D2', sentence: '誰かに言われたからやるんじゃない。自分がやりたいから、そうするだけだ。', impression: '予測不能な成瀬の行動に何度も笑い、最後は爽やかな感動に包まれました。' },
  // 往年の人気作品
  { book_title: 'ハリー・ポッターと賢者の石', author: 'J.K.ローリング', url: 'https://www.amazon.co.jp/dp/B0192UU6O8', sentence: '自分が何者かは、能力で決まるのではない。どんな選択をするかで決まるのじゃ。', impression: 'ダンブルドア校長の言葉は、大人になった今でも心の支えになっています。' },
  { book_title: '容疑者Xの献身', author: '東野圭吾', url: 'https://www.amazon.co.jp/dp/B009IXO00S', sentence: 'どんなに絶望的な状況でも、愛する人を守り抜こうとする論理は、残酷なほどに美しい。', impression: 'ミステリーとしての面白さはもちろん、深すぎる愛の形に涙が止まりません。' },
  { book_title: '舟を編む', author: '三浦しをん', url: 'https://www.amazon.co.jp/dp/B00C392RQU', sentence: '辞書は、言葉の海を渡る舟だ。人は辞書という舟に乗り、暗い海面に浮かび上がる小さな光を集める。', impression: '誰かに思いを伝えるため、一つ一つの言葉を大切に紡ぐことの尊さを教えてくれます。' },
  { book_title: '告白', author: '湊かなえ', url: 'https://www.amazon.co.jp/dp/B009M3M2AA', sentence: '誰かに裁かれる前に、人は自分自身の罪と向き合わなければならない。', impression: '衝撃的な告白から、最後まで一気に読まされる圧倒的な引力があります。' },
  // 視点を変える作品
  { book_title: '目の見えない白鳥さんとアートを見にいく', author: '川内有緒', url: 'https://www.amazon.co.jp/dp/B09CLLQL2V', sentence: '見えない人と一緒に見つめることで、私の知っていた世界が全く別の輝きを放ち始めた。', impression: 'アートの楽しみ方は一つじゃない。世界が少し違って見えるようになる素敵な一冊。' },
  { book_title: 'わけあって絶滅しました。', author: '今泉忠明', url: 'https://www.amazon.co.jp/dp/B07FL199XZ', sentence: '環境に適応できなかったからといって、その生き方が間違っていたわけじゃない。', impression: 'ユーモアたっぷりに語られる絶滅の理由に笑いつつ、生き物の不思議を学べます。' },
  // 文豪作品
  { book_title: 'こころ', author: '夏目漱石', url: 'https://www.amazon.co.jp/dp/B009F2188Y', sentence: '精神的に向上心のない者は、馬鹿だ。', impression: 'Ｋの放ったこの一言が、あまりにも重く冷たく心に刺さる。何度読んでも新しい発見があります。' },
  { book_title: '銀河鉄道の夜', author: '宮沢賢治', url: 'https://www.amazon.co.jp/dp/B009IWY2B6', sentence: 'ほんとうのさいわいは一体何だろう。', impression: '幻想的で美しい情景の中に、生きることの意味を問いかける永遠の名作。' },
  // 通好み・マニアックな名作（追加分）
  { book_title: '悲しみの秘義', author: '若松英輔', url: 'https://www.amazon.co.jp/dp/B01N2AENB8', sentence: '悲しむことができるのは、私たちがそれだけ深く、誰かを愛することができたからです。', impression: '言葉にならない喪失感に寄り添い、悲しみという感情を美しく肯定してくれる。心が擦り切れた時に開きたい一冊です。' },
  { book_title: '紙の動物園', author: 'ケン・リュウ', url: 'https://www.amazon.co.jp/dp/B01N0P6A2X', sentence: '愛するということは、自分自身の魂のひとかけらを、相手の中に置いてくることだ。', impression: '言語や文化の壁を超えて伝わる、不器用で深すぎる家族の愛。読み終わった後、しばらく動けなくなるほどの余韻がありました。' },
  { book_title: 'すべての見えない光', author: 'アンソニー・ドーア', url: 'https://www.amazon.co.jp/dp/B01HQ393FQ', sentence: '目を開きなさい。そして、永遠の暗闇が訪れる前に、あなたが見ることができるものすべてを見なさい。', impression: '過酷な状況下でも失われない人間の尊厳と、見えない光を見出そうとする意志に、生きる勇気をもらえました。' },
  { book_title: 'センス・オブ・ワンダー', author: 'レイチェル・カーソン', url: 'https://www.amazon.co.jp/dp/B00J7P83XQ', sentence: '「知る」ことは、「感じる」ことの半分も重要ではない。', impression: '大人になるにつれて失っていく、世界への驚きや感動。効率ばかりを求めてしまう日々に、立ち止まる勇気をもらえました。' }
];

async function run() {
  const { data, error } = await supabase.from('bookmarks').insert(seedData);
  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log(`Successfully inserted ${seedData.length} records!`);
  }
}

run();
