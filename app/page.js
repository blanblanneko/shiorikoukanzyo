import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.verticalTitle}>
          <h1 className="vertical-text">栞の交換所</h1>
        </div>
        
        <div className={styles.content}>
          <p className={styles.tagline}>
            好きな一文を贈ると、<br className={styles.mobileOnly} />誰かの好きな本に出会う。
          </p>
          <div className={styles.description}>
            <p>あなたが大切にしている本の一文を綴れば、誰かの好きな本の一文や感想に出会えます。</p>
            <p>この小さな交換をきっかけに、今まで読んだことのない新しい一冊に出会えるかもしれません。</p>
          </div>
          
          <div className={styles.actions}>
            <Link href="/post" className={styles.primaryButton}>
              栞を贈り、本に出会う
            </Link>
            <Link href="/read" className={styles.secondaryButton}>
              栞を贈らずに誰かの一文を見る
            </Link>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2026 栞の交換所</p>
      </footer>
    </main>
  );
}
