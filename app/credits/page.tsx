import Image from "next/image";
import Link from "next/link";

const participatingArtists = [
  "김민경",
  "김선심",
  "김청아",
  "류광률",
  "오한결",
  "유영희",
  "이영숙",
  "황유정",
];

export default function CreditsPage() {
  return (
    <>
      <header className="site-header essay-header">
        <Link className="wordmark" href="/" aria-label="색채와 쉼 월간 매거진 처음으로">
          <span>색채와 쉼</span>
          <small>월간 매거진</small>
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/#top">전시</Link>
          <Link href="/essay">에세이</Link>
          <span aria-current="page">크레딧</span>
        </nav>
      </header>

      <main className="credits-scroll">
        <section className="year-review-panel credits-page" aria-labelledby="credits-title">
          <div className="year-review-editorial">
            <header className="year-review-title">
              <p className="eyebrow">CREDITS / VOLUME 01</p>
              <h1 id="credits-title">함께한 사람들</h1>
            </header>

            <figure className="year-review-photo">
              <Image
                unoptimized
                priority
                width={1536}
                height={966}
                src="/images/color-and-rest-community-2026.jpg"
                alt="참여자들이 한 테이블에 둘러앉아 색채 활동을 함께하는 흑백 기록 사진"
              />
              <figcaption>색채와 쉼 활동 현장 · 2026</figcaption>
            </figure>

            <div className="year-review-community-copy">
              <div className="year-review-credits" aria-label="2026년 색채와 쉼 참여 크레딧">
                <div>
                  <span>진행, 글</span>
                  <p className="person-name">김강산</p>
                </div>
                <div>
                  <span>참여 작가</span>
                  <p className="artist-credit-list person-name">{participatingArtists.join(" · ")}</p>
                </div>
                <div>
                  <span>6월 게스트</span>
                  <div>
                    <p className="person-name">이웅용</p>
                    <small>성서유니온 대전지부 총무</small>
                  </div>
                </div>
                <div>
                  <span>소속 교회</span>
                  <p>한국기독교장로회 신세계교회</p>
                </div>
              </div>
            </div>

            <div className="year-review-overview">
              <h2>2026년의 기록</h2>
              <p className="year-review-summary">
                2026년의 색채 활동 주제는 창세기에서 시작해 요한복음, 다시 창세기,
                고린도전서, 시편, 이사야 ... 순으로 매일성경의 본문 일정에 따라
                진행됩니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
