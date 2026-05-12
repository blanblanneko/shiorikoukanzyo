'use client';

import { useState } from 'react';
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
                <input type="text" placeholder="例：走れメロス" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} required />
              </div>

              <div className={styles.inputGroup}>
                <label>作者名</label>
                <input type="text" placeholder="例：太宰治" value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </div>

              <div className={styles.inputGroup}>
                <label>本のURL</label>
                <input type="url" placeholder="参考リンク" value={url} onChange={(e) => setUrl(e.target.value)} required />
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
