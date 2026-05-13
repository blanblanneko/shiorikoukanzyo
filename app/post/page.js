'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Post() {
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [sentence, setSentence] = useState('');
  const [impression, setImpression] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, sending, result
  const [receivedBook, setReceivedBook] = useState(null);
  
  // 候補表示用のステート
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // デバウンス用のタイマー（useRefで確実に管理）
  const searchTimerRef = useRef(null);

  // 本を検索する関数（より慎重なデバウンス）
  const searchBooks = (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // 前のタイマーがあれば確実にキャンセル
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // 800ms（0.8秒）後に検索を実行
    searchTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.items) {
          const books = data.items.map(item => ({
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : '不明',
            amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors[0] : ''))}`
          }));
          setSuggestions(books);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 800);
  };

  // 候補を選択した時の処理
  const selectSuggestion = (book) => {
    setBookTitle(book.title);
    setAuthor(book.author);
    setUrl(book.amazonUrl);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const fetchExchange = async () => {
      const res = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle, author, url, sentence, impression }),
      });
      return await res.json();
    };

    const [data] = await Promise.all([
      fetchExchange(),
      new Promise(resolve => setTimeout(resolve, 7000))
    ]);

    setReceivedBook(data);
    setStatus('result');
  };

  if (status === 'idle') {
    return (
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>← 戻る</Link>
        <div className={styles.container}>
          <div className={styles.previewSection}>
            <div className={styles.shiori}>
              <div className={`${styles.verticalText} vertical-text`}>
                {sentence || 'ここに好きな一文が綴られます'}
              </div>
            </div>
            {bookTitle && (
              <div className={styles.bookMiniInfo}>
                <p>『{bookTitle}』</p>
                <p>{author}</p>
              </div>
            )}
          </div>
          <div className={styles.formSection}>
            <h2 className={styles.title}>栞を綴る</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>本のタイトル</label>
                <div className={styles.suggestWrapper}>
                  <div className={styles.inputWithButton}>
                    <input 
                      type="text" 
                      placeholder="例：走れメロス" 
                      value={bookTitle} 
                      onChange={(e) => {
                        setBookTitle(e.target.value);
                        searchBooks(e.target.value);
                      }} 
                      required 
                    />
                    <button type="button" className={styles.searchIconBtn} onClick={() => searchBooks(bookTitle)}>🔍</button>
                  </div>
                  {isSearching && <div className={styles.searchingStatus}>検索中...</div>}
                  {suggestions.length > 0 && (
                    <ul className={styles.suggestionList}>
                      {suggestions.map((book, i) => (
                        <li key={i} onMouseDown={() => selectSuggestion(book)} className={styles.suggestionItem}>
                          <span className={styles.suggestTitle}>{book.title}</span>
                          <span className={styles.suggestAuthor}>{book.author}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>作者名</label>
                <div className={styles.suggestWrapper}>
                  <div className={styles.inputWithButton}>
                    <input 
                      type="text" 
                      placeholder="例：太宰治" 
                      value={author} 
                      onChange={(e) => {
                        setAuthor(e.target.value);
                        searchBooks(e.target.value);
                      }} 
                      required 
                    />
                    <button type="button" className={styles.searchIconBtn} onClick={() => searchBooks(author)}>🔍</button>
                  </div>
                  {suggestions.length > 0 && !bookTitle && (
                    <ul className={styles.suggestionList}>
                      {suggestions.map((book, i) => (
                        <li key={i} onMouseDown={() => selectSuggestion(book)} className={styles.suggestionItem}>
                          <span className={styles.suggestTitle}>{book.title}</span>
                          <span className={styles.suggestAuthor}>{book.author}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>本のURL (Amazon等)</label>
                <input 
                  type="url" 
                  placeholder="候補を選択すると自動入力されます" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>好きな一文 (必須)</label>
                <textarea 
                  placeholder="心に残った一行を..." 
                  value={sentence} 
                  onChange={(e) => setSentence(e.target.value)} 
                  maxLength={140} 
                  required 
                />
                <div className={styles.charCount}>
                  {sentence.length} / 140
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>感想 (任意)</label>
                <textarea placeholder="この一文について..." value={impression} onChange={(e) => setImpression(e.target.value)} />
              </div>

              <button type="submit" className={styles.submitButton}>栞を贈る</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'sending') {
    return (
      <div className={styles.waitOverlay}>
        <div className={styles.flutteringShiori}></div>
        <p className={styles.waitMessage}>栞が旅をしています</p>
      </div>
    );
  }

  if (status === 'result' && receivedBook) {
    return (
      <main className={styles.main}>
        <div className={styles.resultContainer}>
          <div className={styles.resultDisplay}>
            <div className={styles.shiori}>
              <div className={`${styles.verticalText} vertical-text`}>
                {receivedBook.sentence}
              </div>
            </div>
          </div>
          
          <div className={styles.resultInfo}>
            <h2 className={styles.resultHeading}>誰かの好きな本に出会いました</h2>
            <p className={styles.resultBookTitle}><strong>『{receivedBook.bookTitle}』</strong></p>
            <p className={styles.resultAuthor}>{receivedBook.author}</p>
            {receivedBook.impression && (
              <div className={styles.resultImpression}>
                <p>{receivedBook.impression}</p>
              </div>
            )}
            <a href={receivedBook.url} target="_blank" rel="noopener noreferrer" className={styles.bookLink}>
              この本を詳しく見る
            </a>
            <div className={styles.resultActions}>
              <Link href="/" className={styles.primaryButton}>
                トップへ戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
