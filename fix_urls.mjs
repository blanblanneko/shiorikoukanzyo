import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

async function fixUrls() {
  const { data: books, error: fetchError } = await supabase.from('bookmarks').select('id, book_title, author');
  
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }

  for (const book of books) {
    // タイトルと著者名でAmazon検索するURLに書き換える（これなら確実に表示されます）
    const searchUrl = `https://www.amazon.co.jp/s?k=${encodeURIComponent(book.book_title + ' ' + book.author)}`;
    const { error: updateError } = await supabase.from('bookmarks').update({ url: searchUrl }).eq('id', book.id);
    
    if (updateError) {
      console.error(`Update error for ${book.book_title}:`, updateError);
    }
  }
  console.log('All URLs have been updated to reliable search links!');
}

fixUrls();
