"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SnapController from "./components/SnapController";

type MonthKey = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09";
type RailKey = "00" | MonthKey;

type Work = {
  src: string;
  alt: string;
  title: string;
  artist?: string;
  subtitle?: string;
  scripture: string;
  verse: {
    reference: string;
    text: string;
  };
  orientation?: "landscape" | "portrait";
  width?: number;
  height?: number;
};

const monthLinks: { month: MonthKey; id: string }[] = [
  { month: "01", id: "january" },
  { month: "02", id: "february" },
  { month: "03", id: "march" },
  { month: "04", id: "april" },
  { month: "05", id: "may" },
  { month: "06", id: "june" },
  { month: "07", id: "july" },
  { month: "08", id: "august" },
  { month: "09", id: "september" },
];

const railLinks: { key: RailKey; id: string; ariaLabel: string }[] = [
  { key: "00", id: "top", ariaLabel: "색채와 쉼 표지" },
  ...monthLinks.map(({ month, id }) => ({
    key: month,
    id,
    ariaLabel: `2026년 ${month}월`,
  })),
];

const grapeWorks = [
  { src: "/images/grape-0.webp", alt: "오한결님의 포도나무 참여 작품", title: "포도주와 아몬드 테이스팅", artist: "오한결", scripture: "요한복음 15장", verse: { reference: "요한복음 15:1", text: "나는 참포도나무요 내 아버지는 농부라." } },
  { src: "/images/grape-1.webp", alt: "김선심님의 포도나무 참여 작품", title: "포도주와 아몬드 테이스팅", artist: "김선심", scripture: "요한복음 15장", verse: { reference: "요한복음 15:2", text: "열매 맺는 가지는 더 열매를 맺게 하려 하여 그것을 깨끗하게 하시느니라." } },
  { src: "/images/grape-2-color-v24.webp", alt: "유영희님의 포도나무 참여 작품", title: "포도주와 아몬드 테이스팅", artist: "유영희", scripture: "요한복음 15장", verse: { reference: "요한복음 15:4", text: "내 안에 거하라 나도 너희 안에 거하리라." } },
  { src: "/images/grape-3.webp", alt: "김민경님의 포도나무 참여 작품", title: "포도주와 아몬드 테이스팅", artist: "김민경", scripture: "요한복음 15장", verse: { reference: "요한복음 15:8", text: "너희가 열매를 많이 맺으면 내 아버지께서 영광을 받으실 것이요." } },
  { src: "/images/grape-4.webp", alt: "류광률님의 포도나무 참여 작품", title: "포도주와 아몬드 테이스팅", artist: "류광률", scripture: "요한복음 15장", verse: { reference: "요한복음 15:5", text: "나는 포도나무요 너희는 가지라." } },
] satisfies Work[];

const ladderWorks = [
  { src: "/images/ladder-1.webp", alt: "유영희님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "유영희", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:10", text: "야곱이 브엘세바에서 떠나 하란으로 향하여 가더니." } },
  { src: "/images/ladder-2-color-v24.webp", alt: "김민경님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "김민경", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:12", text: "사닥다리가 땅 위에 서 있는데 그 꼭대기가 하늘에 닿았고." } },
  { src: "/images/ladder-3.webp", alt: "류광률님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "류광률", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:16", text: "여호와께서 과연 여기 계시거늘 내가 알지 못하였도다." } },
  { src: "/images/ladder-4.webp", alt: "김선심님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "김선심", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:15", text: "내가 너와 함께 있어 네가 어디로 가든지 너를 지키며." } },
  { src: "/images/ladder-5.webp", alt: "이영숙님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "이영숙", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:13", text: "네가 누워 있는 땅을 내가 너와 네 자손에게 주리니." } },
  { src: "/images/ladder-6.webp", alt: "오한결님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "오한결", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:17", text: "이곳이 하나님의 집이요 이는 하늘의 문이로다." } },
  { src: "/images/jacob-ladder.webp", alt: "김청아님의 야곱의 사다리 참여 작품", title: "야곱의 사다리", artist: "김청아", subtitle: "무정하게 흐르는 강, 마중하는 하나의 빛", scripture: "창세기 28장", verse: { reference: "창세기 28:12", text: "하나님의 사자들이 그 위에서 오르락내리락하고." } },
] satisfies Work[];

const goshenWorks = [
  { src: "/images/goshen-1.webp", alt: "류광률님의 고센의 대지 참여 작품", title: "고센의 대지", artist: "류광률", scripture: "창세기 46~47장", verse: { reference: "창세기 46:3", text: "애굽으로 내려가기를 두려워하지 말라." } },
  { src: "/images/goshen-2-color-v35.webp", alt: "김강산님의 고센의 대지 참여 작품", title: "고센의 대지", artist: "김강산", scripture: "창세기 46~47장", verse: { reference: "창세기 46:4", text: "내가 너와 함께 애굽으로 내려가겠고 반드시 너를 인도하여 다시 올라올 것이며." } },
  { src: "/images/goshen-kim-sunsim.jpg", alt: "김선심님의 고센의 대지 참여 작품", title: "고센의 대지", artist: "김선심", scripture: "창세기 46~47장", verse: { reference: "창세기 47:6", text: "애굽 땅이 당신 앞에 있으니 땅의 좋은 곳에 당신의 아버지와 형들이 거주하게 하소서." } },
  { src: "/images/goshen-4.webp", alt: "김민경님의 고센의 대지 참여 작품", title: "고센의 대지", artist: "김민경", scripture: "창세기 46~47장", verse: { reference: "창세기 47:12", text: "요셉이 그의 아버지와 형들과 아버지의 온 집에 그 식구를 따라 먹을 것을 주어 봉양하였더라." } },
  { src: "/images/goshen-kim-cheonga.jpg", alt: "김청아님의 고센의 대지 참여 작품", title: "고센의 대지", artist: "김청아", scripture: "창세기 46~47장", verse: { reference: "창세기 47:27", text: "이스라엘 족속이 애굽 고센 땅에 거주하며 거기서 생업을 얻어 생육하고 번성하였더라." } },
] satisfies Work[];

const seaWorks = [
  { src: "/images/sea-1-color-v24.webp", alt: "이웅용님의 은사의 바다 참여 작품", title: "은사의 바다", artist: "이웅용", scripture: "고린도전서 16장", verse: { reference: "고린도전서 16:3", text: "내가 편지를 주어 너희의 은혜를 예루살렘으로 가져가게 하리니." }, orientation: "portrait" },
  { src: "/images/sea-2.webp", alt: "김선심님의 은사의 바다 참여 작품", title: "은사의 바다", artist: "김선심", scripture: "고린도전서 16장", verse: { reference: "고린도전서 16:9", text: "내게 광대하고 유효한 문이 열렸으나 대적하는 자가 많음이라." }, orientation: "portrait" },
  { src: "/images/sea-3-shadow-corrected-color-v24.webp", width: 1080, height: 810, alt: "이영숙님의 은사의 바다 참여 작품", title: "은사의 바다", artist: "이영숙", scripture: "고린도전서 16장", verse: { reference: "고린도전서 16:13", text: "깨어 믿음에 굳게 서서 남자답게 강건하라." } },
  { src: "/images/sea-4.webp", alt: "오한결님의 은사의 바다 참여 작품", title: "은사의 바다", artist: "오한결", scripture: "고린도전서 16장", verse: { reference: "고린도전서 16:14", text: "너희 모든 일을 사랑으로 행하라." }, orientation: "portrait" },
  { src: "/images/sea-5.webp", alt: "류광률님의 은사의 바다 참여 작품", title: "은사의 바다", artist: "류광률", scripture: "고린도전서 16장", verse: { reference: "고린도전서 16:15", text: "성도 섬기기로 작정한 줄을 너희가 아는지라." }, orientation: "portrait" },
  { src: "/images/sea-6.webp", alt: "김청아님의 은사의 바다 참여 작품", title: "은사의 바다", artist: "김청아", scripture: "고린도전서 16장", verse: { reference: "고린도전서 16:18", text: "그들이 나와 너희 마음을 시원하게 하였으니." } },
] satisfies Work[];

const julyWorks = [
  { src: "/images/july-lee-youngsook.webp", alt: "이영숙님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "이영숙", scripture: "시편 8편", verse: { reference: "시편 8:1", text: "여호와 우리 주여 주의 이름이 온 땅에 어찌 그리 아름다운지요." } },
  { src: "/images/july-kim-minkyung.webp", alt: "김민경님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "김민경", scripture: "시편 8편", verse: { reference: "시편 8:3", text: "주의 손가락으로 만드신 주의 하늘과 주께서 베풀어 두신 달과 별들을 내가 보오니." } },
  { src: "/images/july-kim-sunsim.webp", alt: "김선심님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "김선심", scripture: "시편 8편", verse: { reference: "시편 8:4", text: "사람이 무엇이기에 주께서 그를 생각하시며 인자가 무엇이기에 주께서 그를 돌보시나이까." } },
  { src: "/images/july-kim-cheonga.webp", alt: "김청아님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "김청아", scripture: "시편 8편", verse: { reference: "시편 8:5", text: "그를 하나님보다 조금 못하게 하시고 영화와 존귀로 관을 씌우셨나이다." } },
  { src: "/images/july-ryu-gwangryul-color-v24.webp", alt: "류광률님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "류광률", scripture: "시편 8편", verse: { reference: "시편 8:6", text: "주의 손으로 만드신 것을 다스리게 하시고 만물을 그의 발 아래 두셨으니." } },
  { src: "/images/july-oh-hangyeol.webp", alt: "오한결님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "오한결", scripture: "시편 8편", verse: { reference: "시편 8:9", text: "여호와 우리 주여 주의 이름이 온 땅에 어찌 그리 아름다운지요." } },
  { src: "/images/july-hwang-yujeong.jpg", alt: "짙은 푸른색과 초록색 위에 금빛이 펼쳐진 황유정님의 시인의 밤하늘 작품", title: "시인의 밤하늘", artist: "황유정", scripture: "시편 8편", verse: { reference: "시편 8:8", text: "공중의 새와 바다의 물고기와 바닷길에 다니는 것이니이다." } },
] satisfies Work[];

const augustWorks = [
  {
    src: "/images/august-kim-sunsim-color-v35.webp",
    alt: "주황빛 배경과 짙은 푸른 나뭇잎을 그린 김선심님의 푸른 그늘 작품",
    title: "푸른 그늘",
    artist: "김선심",
    scripture: "이사야 28–35장",
    verse: {
      reference: "이사야 25:4",
      text: "폭풍 중의 피난처시며 폭양을 피하는 그늘이 되셨사오니.",
    },
  },
  {
    src: "/images/august-kim-cheonga.webp",
    alt: "노을빛 들판과 두 그루 나무를 그린 김청아님의 푸른 그늘 작품",
    title: "푸른 그늘",
    artist: "김청아",
    scripture: "이사야 28–35장",
    verse: {
      reference: "이사야 32:18",
      text: "내 백성이 화평한 집과 안전한 거처와 조용히 쉬는 곳에 있으려니와.",
    },
  },
  {
    src: "/images/august-oh-hangyeol.webp",
    alt: "붉은 숲과 길게 드리운 푸른 그림자를 그린 오한결님의 푸른 그늘 작품",
    title: "푸른 그늘",
    artist: "오한결",
    scripture: "이사야 28–35장",
    verse: {
      reference: "이사야 32:2",
      text: "또 그 사람은 광풍을 피하는 곳, 폭우를 가리는 곳 같을 것이며 마른 땅에 냇물 같을 것이며 곤비한 땅에 큰 바위 그늘 같으리니.",
    },
  },
] satisfies Work[];

const septemberWorks = [
  {
    "src": "/images/september-kim-minkyung.jpg",
    "alt": "파란 색면 중앙에 큰 흰 여백이 있고 아래에는 연두색과 노란색 띠가 이어지는 김민경님의 하얀 안개 작품",
    "title": "하얀 안개",
    "artist": "김민경",
    "scripture": "사사기 6-16장",
    "verse": {
      "reference": "사사기 6:18",
      "text": "내가 너 돌아올 때까지 머무르리라"
    },
    "width": 2048,
    "height": 1447
  },
  {
    "src": "/images/september-hwang-yujeong-color-v31.webp",
    "alt": "위쪽의 파란 색면과 아래쪽 노랑·초록 식물 형태 사이로 밝은 여백이 펼쳐지는 황유정님의 하얀 안개 작품",
    "title": "하얀 안개",
    "artist": "황유정",
    "scripture": "사사기 6-16장",
    "verse": {
      "reference": "사사기 6:23",
      "text": "너는 안심하라 두려워하지 말라"
    },
    "width": 1484,
    "height": 1060
  },
  {
    "src": "/images/september-kim-sunsim.jpg",
    "alt": "흰 바탕에 연두색과 청록색 나무들이 늘어서 있고 아래에 황토색과 노란색 땅이 펼쳐지는 김선심님의 하얀 안개 작품",
    "title": "하얀 안개",
    "artist": "김선심",
    "scripture": "사사기 6-16장",
    "verse": {
      "reference": "사사기 7:2",
      "text": "이는 이스라엘이 나를 거슬러 스스로 자랑하기를 내 손이 나를 구원하였다 할까 함이니라"
    },
    "width": 2048,
    "height": 1507
  },
  {
    "src": "/images/september-oh-hangyeol-color-v24.webp",
    "alt": "노랑과 연두, 청록이 겹친 넓은 나무 수관 아래에 여러 줄기가 서 있고 주변은 옅은 청회색으로 번지는 오한결님의 하얀 안개 작품",
    "title": "하얀 안개",
    "artist": "오한결",
    "scripture": "사사기 6-16장",
    "verse": {
      "reference": "사사기 6:16",
      "text": "내가 반드시 너와 함께 하리니"
    },
    "width": 2048,
    "height": 1449
  },
  {
    "src": "/images/september-kim-cheonga-color-v24.webp",
    "alt": "보라색 테두리 안 흰 바탕에 노랑과 연두 색면, 중앙의 짙은 청록색이 겹쳐 있는 김청아님의 하얀 안개 작품",
    "title": "하얀 안개",
    "artist": "김청아",
    "scripture": "사사기 6-16장",
    "verse": {
      "reference": "사사기 6:11",
      "text": "오브라에 이르러 상수리나무 아래에 앉으니라"
    },
    "width": 2047,
    "height": 1465
  },
  {
    "src": "/images/september-ryu-gwangryul-color-v24.webp",
    "alt": "분홍색 바탕을 가로질러 빨강과 노랑, 진한 파랑의 색면이 대각선으로 이어지고 그 사이에 흰 틈이 남아 있는 류광률님의 하얀 안개 작품",
    "title": "하얀 안개",
    "artist": "류광률",
    "scripture": "사사기 6-16장",
    "verse": {
      "reference": "사사기 6:24",
      "text": "기드온이 여호와를 위하여 거기서 제단을 쌓고 그것을 여호와 살롬이라 하였더라"
    },
    "width": 1536,
    "height": 1024
  }
] satisfies Work[];

function FixedHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="#top" aria-label="색채와 쉼 처음으로">
        <span>색채와 쉼</span>
        <small>월간 매거진</small>
      </Link>
      <nav className="site-nav" aria-label="주요 메뉴">
        <a href="#top" aria-current="page">전시</a>
        <Link href="/essay">에세이</Link>
        <Link href="/credits">크레딧</Link>
      </nav>
    </header>
  );
}

function MonthRail({ active }: { active: RailKey }) {
  return (
    <aside
      className="month-rail is-visible"
      aria-label="2026년 색채와 쉼 페이지 이동"
    >
      <span className="rail-title">2026</span>
      {railLinks.map(({ key, id, ariaLabel }, index) => (
        <a
          key={key}
          href={`#${id}`}
          style={{
            top: `${12 + index * (76 / (railLinks.length - 1))}%`,
          }}
          className={key === active ? "is-active" : ""}
          aria-label={ariaLabel}
          aria-current={key === active ? "page" : undefined}
        >
          <i />
          <span>{key}</span>
        </a>
      ))}
    </aside>
  );
}

function ArtworkPanel({
  month,
  index,
  work,
}: {
  month: MonthKey;
  index: number;
  work: Work;
}) {
  return (
    <section
      id={`${monthLinks.find((item) => item.month === month)?.id}-work-${index + 1}`}
      className={`snap-panel artwork-panel ${work.orientation === "portrait" ? "portrait-work" : "landscape-work"}`}
      data-snap-panel
      data-month={month}
    >
      <div className="artwork-index">{month} / WORK {String(index + 1).padStart(2, "0")}</div>
      <figure className="artwork-frame">
        <Image unoptimized width={work.width ?? (work.orientation === "portrait" ? 1200 : 1800)} height={work.height ?? (work.orientation === "portrait" ? 1800 : 1200)} src={work.src} alt={work.alt} />
      </figure>
      <div className="artwork-meta">
        {work.artist ? (
          <strong
            className="artwork-artist person-name"
            aria-label={`${work.artist} 작품`}
          >
            {work.artist}<span className="artwork-artist-mark" aria-hidden="true">作</span>
          </strong>
        ) : null}
        <blockquote className="artwork-verse">
          <cite>{work.verse.reference}</cite>
          <p>{work.verse.text}</p>
        </blockquote>
      </div>
    </section>
  );
}

function CoverActions({
  essayHref,
  firstWorkHref,
}: {
  essayHref: string;
  firstWorkHref?: string;
}) {
  return (
    <div className="cover-actions">
      <Link className="text-link" href={essayHref}>
        묵상 에세이 읽기 <span aria-hidden="true">→</span>
      </Link>
      {firstWorkHref ? (
        <a className="text-link" href={firstWorkHref}>
          전시 작품 바로 보기 <span aria-hidden="true">↓</span>
        </a>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [activeRail, setActiveRail] = useState<RailKey>("00");

  return (
    <>
      <FixedHeader />
      <MonthRail active={activeRail} />
      <SnapController
        onActiveMonthChange={(month) =>
          setActiveRail((month ?? "00") as RailKey)
        }
      >
        <section id="top" className="snap-panel intro-panel" data-snap-panel data-month="00">
          <div className="intro-copy">
            <p className="magazine-label">
              <span>월간 매거진</span>
              <small>MONTHLY MAGAZINE</small>
            </p>
            <h1>색채와 쉼</h1>
            <p className="intro-lead">
              한 달에 한 번씩 성경의 한 장면을 묵상하며 공동체와 함께 그린 색채 활동을 기록합니다.
            </p>
            <div className="status-note">
              <span className="issue-meta">VOL. 01 · ISSUE 09 · 2026</span>
              <span className="update-note">매월 새로운 이야기가 업데이트됩니다.</span>
            </div>
          </div>
          <div className="intro-process" aria-label="색채와 쉼 조색과 채색 과정">
            <div className="intro-process-grid">
              <figure className="intro-process-main">
                <Image unoptimized priority width={1415} height={1512} src="/images/mixing-blue.webp" alt="푸른 물감이 서로 섞이는 조색 접사" />
              </figure>
              <figure>
                <Image unoptimized width={1200} height={1800} src="/images/vineyard-painting.webp" alt="포도나무 그림을 채색하는 실제 과정" />
              </figure>
              <figure>
                <Image unoptimized width={1200} height={1200} src="/images/process-brush.webp" alt="팔레트에서 색을 골라 종이에 옮기는 실제 과정" />
              </figure>
            </div>
          </div>
        </section>

        <section id="january" className="snap-panel month-panel split-image-panel january-panel" data-snap-panel data-month="01">
          <div className="month-copy compact-copy">
            <p className="eyebrow">JANUARY / GENESIS 8—10</p>
            <div className="month-number inline-number" aria-hidden="true">01</div>
            <h2>색채와 안식</h2>
            <p className="scripture-label">창세기 8장-10장</p>
            <p className="feature-quote">
              색으로 말씀을 묵상하는 첫 아이디어가 ‘색채와 쉼’이라는 모임의 구상과 실행으로 이어졌다.
            </p>
            <CoverActions essayHref="/essay/color-and-rest" />
          </div>
          <figure className="month-image january-image">
            <Image unoptimized width={1800} height={1200} src="/images/manual-mixing.webp" alt="서로 다른 색의 물감이 붓끝에서 섞이는 조색 과정" />
          </figure>
        </section>

        <section id="february" className="snap-panel month-panel split-image-panel february-panel" data-snap-panel data-month="02">
          <div className="month-copy compact-copy">
            <p className="eyebrow">FEBRUARY / ORIENTATION</p>
            <div className="month-number inline-number" aria-hidden="true">02</div>
            <h2>인식의 색채화<br />매뉴얼</h2>
            <p className="scripture-label">감정을 색으로 치환하는 방법</p>
            <p className="feature-quote">
              감정을 색으로 치환한다는 것은 감정마다 다른 결을 획일화하는 것이 아니라, 말로 설명하기 어려운 감정을 명료한 색으로 정돈해 보는 일이다.
            </p>
            <CoverActions essayHref="/essay/orientation" />
          </div>
          <figure className="month-image manual-mixing-cover">
            <Image unoptimized width={1800} height={1200} src="/images/process-prologue.webp" alt="인식의 색채화 매뉴얼과 물감, 붓, 종이가 놓인 작업대" />
          </figure>
        </section>

        <section id="march" className="snap-panel month-panel split-image-panel march-panel" data-snap-panel data-month="03">
          <div className="month-copy compact-copy">
            <p className="eyebrow">MARCH / JOHN 15</p>
            <div className="month-number inline-number" aria-hidden="true">03</div>
            <h2>포도주와 아몬드 테이스팅</h2>
            <p className="scripture-label">요한복음 15장</p>
            <p className="feature-quote">
              포도주 테이스팅이 ‘숙성된 결과’를 음미하는 것이라면, 아몬드에는 가공되지 않은 채로
              존재하는 ‘압축된 본질’의 풍미가 있었다.
            </p>
            <CoverActions essayHref="/essay/march" firstWorkHref="#march-work-1" />
          </div>
          <figure className="month-image march-main-image">
            <Image unoptimized width={1012} height={1555} src="/images/exhibition-grape-main-v5-natural.webp" alt="포도주와 아몬드 테이스팅을 위한 여러 색의 조색 물감" />
          </figure>
        </section>

        {grapeWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="03" index={index} work={work} />
        ))}

        <section id="april" className="snap-panel month-panel split-image-panel" data-snap-panel data-month="04">
          <div className="month-copy compact-copy">
            <p className="eyebrow">APRIL / GENESIS 28</p>
            <div className="month-number inline-number" aria-hidden="true">04</div>
            <h2>야곱의 사다리</h2>
            <p className="scripture-label">창세기 28장</p>
            <p className="feature-quote">
              무정하게 흐르는 강, 마중하는 하나의 빛
            </p>
            <CoverActions essayHref="/essay/april" firstWorkHref="#april-work-1" />
          </div>
          <figure className="month-image tall-image">
            <Image unoptimized width={917} height={1536} src="/images/jacob-ladder-cover.jpg" alt="보라색과 푸른색 물감을 조색하는 야곱의 사다리 작업 과정" />
          </figure>
        </section>

        {ladderWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="04" index={index} work={work} />
        ))}

        <section id="may" className="snap-panel month-panel may-panel" data-snap-panel data-month="05">
          <div className="month-copy may-copy">
            <p className="eyebrow">MAY / GENESIS 46—47</p>
            <div className="month-number inline-number" aria-hidden="true">05</div>
            <h2>고센의 대지</h2>
            <p className="scripture-label">창세기 46~47장</p>
            <p className="feature-quote">
              이제 주권적인 보내심을 통해 하나님께서 마련하신 고센 땅을 밟으며 비로소 숨을 깊게
              내쉬는 파스텔톤의 이완을 경험한다.
            </p>
            <CoverActions essayHref="/essay/goshen" firstWorkHref="#may-work-1" />
          </div>
          <figure className="month-image crop-image">
            <Image unoptimized width={2048} height={1639} src="/images/exhibition-goshen-main.webp" alt="고센의 빛과 들판을 그린 작품, 물감과 붓이 놓인 작업 기록" />
          </figure>
        </section>

        {goshenWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="05" index={index} work={work} />
        ))}

        <section id="june" className="snap-panel month-panel split-image-panel june-panel" data-snap-panel data-month="06">
          <div className="month-copy compact-copy">
            <p className="eyebrow">JUNE / 1 CORINTHIANS 16</p>
            <div className="month-number inline-number" aria-hidden="true">06</div>
            <h2>은사의 바다</h2>
            <p className="scripture-label">고린도전서 16장</p>
            <p className="feature-quote">
              색이 섞이는 물감의 마찰 또한 갈등이다. 하지만 그 마찰은 무의미한 충돌이 아니라 결국
              더 깊은 색을 이끌어내는 조색 과정이다.
            </p>
            <CoverActions essayHref="/essay/june" firstWorkHref="#june-work-1" />
          </div>
          <figure className="month-image mixing-image">
            <Image unoptimized width={1800} height={1200} src="/images/sea-mixing.webp" alt="바다색을 만들기 위해 푸른 물감을 섞은 실제 조색 팔레트" />
          </figure>
        </section>

        {seaWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="06" index={index} work={work} />
        ))}

        <section id="july" className="snap-panel month-panel split-image-panel july-panel" data-snap-panel data-month="07">
          <div className="month-copy compact-copy">
            <p className="eyebrow">JULY / PSALM 8</p>
            <div className="month-number inline-number" aria-hidden="true">07</div>
            <h2>시인의 밤하늘</h2>
            <p className="scripture-label">시편 8편</p>
            <p className="feature-quote">
              그러나, 오히려 그렇게 찬양이 된다.
            </p>
            <CoverActions essayHref="/essay/july" firstWorkHref="#july-work-1" />
          </div>
          <figure className="month-image july-cover-image">
            <Image unoptimized width={2048} height={1077} src="/images/july-cover.webp" alt="붓과 함께 촬영한 시인의 밤하늘 채색 과정" />
          </figure>
        </section>

        {julyWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="07" index={index} work={work} />
        ))}

        <section id="august" className="snap-panel month-panel split-image-panel august-panel" data-snap-panel data-month="08">
          <div className="month-copy compact-copy">
            <p className="eyebrow">AUGUST / ISAIAH 28—35</p>
            <div className="month-number inline-number" aria-hidden="true">08</div>
            <h2>푸른 그늘</h2>
            <p className="scripture-label">이사야 28–35장</p>
            <p className="feature-quote">
              빛의 단서는 그림자에 있다
            </p>
            <CoverActions essayHref="/essay/august" firstWorkHref="#august-work-1" />
          </div>
          <figure className="month-image august-cover-image">
            <Image unoptimized width={1536} height={1152} src="/images/august-cover.webp" alt="팔레트의 따뜻한 색과 푸른색 물감, 붓이 놓인 푸른 그늘 작업 과정" />
          </figure>
        </section>

        {augustWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="08" index={index} work={work} />
        ))}

        <section id="september" className="snap-panel month-panel split-image-panel september-panel" data-snap-panel data-month="09">
          <div className="month-copy compact-copy">
            <p className="eyebrow">SEPTEMBER / JUDGES 6–16</p>
            <div className="month-number inline-number" aria-hidden="true">09</div>
            <h2>하얀 안개</h2>
            <p className="scripture-label">사사기 6-16장</p>
            <p className="feature-quote">여백이 나를 채우도록 기다린다.</p>
            <CoverActions essayHref="/essay/september" firstWorkHref="#september-work-1" />
          </div>
          <figure className="month-image september-cover-image">
            <Image unoptimized width={1448} height={1086} src="/images/september-palette-refined.png" alt="흰 조색 바탕 위에 보라색과 흰색 물감이 길게 섞이고 노란 물감이 놓인 하얀 안개 조색 과정" />
          </figure>
        </section>

        {septemberWorks.map((work, index) => (
          <ArtworkPanel key={work.src} month="09" index={index} work={work} />
        ))}
      </SnapController>
    </>
  );
}
