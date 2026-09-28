import Image from "next/image";
import Link from "next/link";
import type { EssayEntry } from "./content";

const exhibitionAnchors: Record<string, string> = {
  "01": "january",
  "02": "february",
  "03": "march",
  "04": "april",
  "05": "may",
  "06": "june",
  "07": "july",
  "08": "august",
  "09": "september",
};

function EssayHeader() {
  return (
    <header className="site-header essay-header">
      <Link className="wordmark" href="/" aria-label="색채와 쉼 월간 매거진 처음으로">
        <span>색채와 쉼</span>
        <small>월간 매거진</small>
      </Link>
      <nav className="site-nav" aria-label="주요 메뉴">
        <Link href="/#top">전시</Link>
        <Link href="/essay" aria-current="page">에세이</Link>
        <Link href="/credits">크레딧</Link>
      </nav>
    </header>
  );
}

export default function EssayArticle({ entry }: { entry: EssayEntry }) {
  const exhibitionAnchor = exhibitionAnchors[entry.index];
  const coverExcerpt = entry.subtitle ?? entry.excerpt;

  return (
    <>
      <EssayHeader />
      <main className="article-scroll">
        <header className="article-hero">
          <div className="article-hero-copy">
            <p className="eyebrow">ESSAY / {entry.month}</p>
            <span className="article-number" aria-hidden="true">{entry.index}</span>
            <h1>{entry.title}</h1>
            <p className="article-scripture">{entry.scripture}</p>
            <p className="article-cover-excerpt">{coverExcerpt}</p>
          </div>
          <figure className={`article-hero-image ${entry.coverImage ? "" : "article-hero-placeholder"} ${entry.index === "09" ? "september-cover-image" : ""}`}>
            {entry.coverImage ? (
              <Image
                unoptimized
                priority
                width={entry.coverImage.width}
                height={entry.coverImage.height}
                src={entry.coverImage.src}
                alt={entry.coverImage.alt}
              />
            ) : (
              <div className="article-night-field" aria-label="7월 작품 이미지 준비 중">
                <i /><i /><i /><i /><i /><i /><i />
              </div>
            )}
          </figure>
        </header>

        <article className="article-body">
          {entry.guide && (
            <aside className="article-guide">
              {entry.guide.label ? <span>{entry.guide.label}</span> : null}
              <p>{entry.guide.text}</p>
            </aside>
          )}

          {entry.blocks.map((block, index) => {
            if (block.type === "section") {
              return <h2 key={`${block.type}-${index}`}>{block.text}</h2>;
            }
            if (block.type === "quote") {
              return <blockquote key={`${block.type}-${index}`}>{block.text}</blockquote>;
            }
            if (block.type === "sourceQuote") {
              return <blockquote className="article-source-quote" key={`${block.type}-${index}`}>{block.text}</blockquote>;
            }
            if (block.type === "lines") {
              return <p className="article-lines" key={`${block.type}-${index}`}>{block.text}</p>;
            }
            return <p key={`${block.type}-${index}`}>{block.text}</p>;
          })}

          {entry.image && (
            <figure className={`article-end-image ${entry.image.width && entry.image.height && entry.image.width >= entry.image.height ? "is-landscape" : "is-portrait"}`}>
              <Image unoptimized width={entry.image.width ?? 1800} height={entry.image.height ?? 1200} src={entry.image.src} alt={entry.image.alt} />
              {entry.image.caption ? <figcaption>{entry.image.caption}</figcaption> : null}
            </figure>
          )}

          {exhibitionAnchor && (
            <Link className="text-link article-exhibition-return" href={`/#${exhibitionAnchor}`}>
              전시로 돌아가기 <span>↗</span>
            </Link>
          )}

          <footer className="article-footer">
            <span>{entry.index} / {entry.title} · {entry.scripture}</span>
            <Link href="/essay">월별 에세이 목록으로 <b>→</b></Link>
          </footer>
        </article>
      </main>
    </>
  );
}
