import Link from "next/link";
import { essays } from "./content";

export default function EssayIndex() {
  return (
    <>
      <header className="site-header essay-header">
        <Link className="wordmark" href="/" aria-label="색채와 쉼 월간 매거진 처음으로">
          <span>색채와 쉼</span>
          <small>월간 매거진</small>
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/#top">전시</Link>
          <span aria-current="page">에세이</span>
          <Link href="/credits">크레딧</Link>
        </nav>
      </header>
      <main className="essay-list-scroll">
        <header className="essay-list-intro">
          <p className="eyebrow">ESSAY / VOLUME 01</p>
          <h1>색채와 쉼 에세이</h1>
          <div className="essay-intro-note">
            <p>이 에세이는 성경을 묵상하고, 그 내용을 ‘색채와 쉼’으로 연결해 쓴 글입니다.</p>
            <p>성경의 풍경 속에 잠시 머물도록 돕는 글로, 참여 작가에게는 같은 그림을 함께 채색해 가는 안내서이며 관객에게는 작품의 배경과 의미를 소개하는 큐레이션입니다.</p>
          </div>
        </header>
        <ol className="essay-list">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <Link href={`/essay/${essay.slug}`}>
                <span>{essay.index}</span>
                <div>
                  <small>{essay.month}</small>
                  <h2>{essay.title}</h2>
                  <p>{essay.scripture}</p>
                  <blockquote>{essay.subtitle ?? essay.excerpt}</blockquote>
                </div>
                <b aria-hidden="true">↗</b>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
