'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../post/page.module.css';

export default function Read() {
  const [status, setStatus] = useState('sending');
  const [receivedBook, setReceivedBook] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRandom = async () => {
      try {
        const res = await fetch('/api/exchange', { cache: 'no-store' });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        // 3.5秒待機してから結果を表示
        setTimeout(() => {
          if (isMounted) {
            setReceivedBook(data);
            setStatus('result');
          }
        }, 3500);

      } catch (error) {
        console.error('Fetch error:', error);
        setTimeout(() => {
          if (isMounted) {
            setReceivedBook({
              bookTitle: '走れメロス',
              author: '太宰治',
              url: 'https://www.amazon.co.jp/s?k=走れメロス+太宰治',
              sentence: 'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。',
              impression: '友情と信実について考えさせられる、永遠の古典です。'
            });
            setStatus('result');
          }
        }, 3500);
      }
    };

    fetchRandom();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'sending') {
    return (
      <div className={styles.waitOverlay}>
        <div className={styles.flutteringShiori}></div>
        <p className={styles.waitMessage}>栞を探しています</p>
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
