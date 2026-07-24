import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// ─── HOME ───────────────────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>위드엔딩 - 삶의 마지막 장을, 가장 아름답게 써드립니다.</title>
  <meta name="description" content="대한민국 최초 무빈소 특화 후불 장례 + 자산관리 통합 서비스. 선불 없이, 추가비용 없이, 투명하게." />
  <link rel="stylesheet" href="/static/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <!-- NAVIGATION -->
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo">
        <img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" />
      </a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle" aria-label="메뉴 열기">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>

  <!-- HERO SECTION -->
  <section class="hero" id="hero">
    <div class="hero-bg-overlay"></div>
    <div class="hero-content">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        무빈소 특화 후불장례 + 자산관리 통합
      </div>
      <h1 class="hero-title">
        삶의 마지막 장을,<br />
        <span class="hero-title-accent">가장 아름답게 써드립니다.</span>
      </h1>
      <p class="hero-sub">
        선불 없이, 추가비용 없이, 투명하게.<br />
        故人을 존엄하게 모시고, 남은 가족의 미래를 설계합니다.
      </p>
      <div class="hero-buttons">
        <a href="/contact" class="btn btn-emergency pulse-btn">
          <i class="fas fa-phone-alt"></i>
          지금 임종하셨나요?<br /><small>즉시 연결</small>
        </a>
        <a href="/funeral#calculator" class="btn btn-primary">
          <i class="fas fa-calculator"></i>
          예상 비용<br /><small>3분 계산</small>
        </a>
        <a href="/membership" class="btn btn-outline">
          <i class="fas fa-leaf"></i>
          위드 멤버십<br /><small>월 6,900원~</small>
        </a>
      </div>
      <div class="hero-hotline">
        <i class="fas fa-headset"></i>
        <strong>24시간 365일</strong>&nbsp;1588-9999
      </div>
    </div>
    <div class="hero-scroll-hint">
      <i class="fas fa-chevron-down"></i>
    </div>
  </section>

  <!-- TRUST BAR -->
  <section class="trust-bar">
    <div class="trust-container">
      <div class="trust-item" data-count="1247" data-suffix="건">
        <span class="trust-number" id="count1">0</span>건
        <span class="trust-label">누적 서비스</span>
      </div>
      <div class="trust-divider"></div>
      <div class="trust-item" data-count="98.7" data-suffix="%" data-decimal="1">
        <span class="trust-number" id="count2">0</span>%
        <span class="trust-label">고객 만족도</span>
      </div>
      <div class="trust-divider"></div>
      <div class="trust-item" data-count="347" data-suffix="만원">
        <span class="trust-number" id="count3">0</span>만원
        <span class="trust-label">평균 절감 비용</span>
      </div>
      <div class="trust-divider"></div>
      <div class="trust-item" data-count="127" data-suffix="명">
        <span class="trust-number" id="count4">0</span>명
        <span class="trust-label">제휴 전문가</span>
      </div>
    </div>
  </section>

  <!-- CORE DIFF 3 -->
  <section class="diff-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">핵심 차별화</span>
        <h2 class="section-title">위드엔딩이 다른 이유</h2>
        <p class="section-sub">장례를 넘어 삶의 마무리 전체를 설계합니다</p>
      </div>
      <div class="diff-grid">
        <div class="diff-card" data-aos="fade-up" data-delay="0">
          <div class="diff-icon-wrap" style="background:#E8F5F0">
            <i class="fas fa-hand-holding-usd" style="color:#2D6A4F"></i>
          </div>
          <h3>후불 정산</h3>
          <p>선불 없이 서비스를 먼저 받고 이후에 정산합니다. 상조사 폐업으로 인한 선수금 손실 걱정이 없습니다.</p>
          <ul class="diff-list">
            <li><i class="fas fa-check"></i> 선불금 0원</li>
            <li><i class="fas fa-check"></i> 추가비용 완전 차단</li>
            <li><i class="fas fa-check"></i> 투명한 정찰제</li>
          </ul>
          <a href="/funeral" class="diff-link">더 알아보기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="diff-card featured" data-aos="fade-up" data-delay="100">
          <div class="diff-badge">가장 인기</div>
          <div class="diff-icon-wrap" style="background:#E8F5F0">
            <i class="fas fa-seedling" style="color:#2D6A4F"></i>
          </div>
          <h3>무빈소 전문성</h3>
          <p>허례허식 없이 존엄하고 아름답게. 실명제 장례지도사가 처음부터 끝까지 함께합니다.</p>
          <ul class="diff-list">
            <li><i class="fas fa-check"></i> 전담 장례지도사 배정</li>
            <li><i class="fas fa-check"></i> 사회적 편견 해소 지원</li>
            <li><i class="fas fa-check"></i> 디지털 온라인 추모관</li>
          </ul>
          <a href="/funeral" class="diff-link">더 알아보기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="diff-card" data-aos="fade-up" data-delay="200">
          <div class="diff-icon-wrap" style="background:#E8F5F0">
            <i class="fas fa-landmark" style="color:#2D6A4F"></i>
          </div>
          <h3>자산관리 통합</h3>
          <p>장례 이후의 삶도 설계합니다. 상속·증여·사회적 가치 유산까지 원스톱으로 관리합니다.</p>
          <ul class="diff-list">
            <li><i class="fas fa-check"></i> 상속·증여 절세 설계</li>
            <li><i class="fas fa-check"></i> 사회적 유산 레거시</li>
            <li><i class="fas fa-check"></i> 전문가 원스톱 서비스</li>
          </ul>
          <a href="/asset" class="diff-link">더 알아보기 <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <!-- COMPARISON TABLE -->
  <section class="compare-section section-padding bg-light">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">비교 분석</span>
        <h2 class="section-title">기존 상조 vs 위드엔딩</h2>
        <p class="section-sub">수십 년간 변하지 않은 상조 업계의 구조적 문제를 위드엔딩이 해결합니다</p>
      </div>
      <div class="compare-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="compare-th-label">구분</th>
              <th class="compare-th-old"><i class="fas fa-times-circle"></i> 기존 선불상조</th>
              <th class="compare-th-new"><i class="fas fa-check-circle"></i> 위드엔딩</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>납입 방식</td>
              <td class="bad">수년간 선불 적립</td>
              <td class="good">월 구독 (언제든 해지)</td>
            </tr>
            <tr>
              <td>폐업 리스크</td>
              <td class="bad">선수금 50% 손실 가능</td>
              <td class="good">선불금 없음 — 리스크 제로</td>
            </tr>
            <tr>
              <td>추가 비용</td>
              <td class="bad">현장 압박 빈번</td>
              <td class="good">고정가 100% 보장</td>
            </tr>
            <tr>
              <td>자산관리</td>
              <td class="bad">없음</td>
              <td class="good">상속·증여 설계 포함</td>
            </tr>
            <tr>
              <td>사회적 가치</td>
              <td class="bad">없음</td>
              <td class="good">레거시 설계 포함</td>
            </tr>
            <tr>
              <td>해지 위약금</td>
              <td class="bad">최대 30%</td>
              <td class="good">없음 (즉시 해지)</td>
            </tr>
            <tr>
              <td>장례지도사</td>
              <td class="bad">익명 배정</td>
              <td class="good">실명제 사전 공개</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ROI PREVIEW -->
  <section class="roi-section section-padding">
    <div class="container">
      <div class="roi-wrapper">
        <div class="roi-left">
          <span class="section-tag">구독 서비스 ROI</span>
          <h2 class="roi-title">월 12,900원으로<br /><span class="accent">연 108만원 혜택</span></h2>
          <p class="roi-sub">구독료는 현재 제공되는 서비스 이용료이며, 장례 발생 시 별도 후불 계약으로 진행됩니다.</p>
          <a href="/membership" class="btn btn-primary roi-cta">멤버십 자세히 보기</a>
        </div>
        <div class="roi-right">
          <div class="roi-card">
            <div class="roi-header">
              <span class="roi-tier">🌿 스탠다드 멤버십 — 월 12,900원</span>
              <span class="roi-tag">ROI 697%</span>
            </div>
            <ul class="roi-benefits">
              <li>
                <span class="benefit-name"><i class="fas fa-user-md"></i> 전문가 상담 월 1회</span>
                <span class="benefit-value">연 600,000원 가치</span>
              </li>
              <li>
                <span class="benefit-name"><i class="fas fa-file-alt"></i> 상속설계 보고서 연 1회</span>
                <span class="benefit-value">300,000원 가치</span>
              </li>
              <li>
                <span class="benefit-name"><i class="fas fa-mobile-alt"></i> 엔딩노트 앱 이용권</span>
                <span class="benefit-value">60,000원 가치</span>
              </li>
              <li>
                <span class="benefit-name"><i class="fas fa-database"></i> 디지털 자산 관리</span>
                <span class="benefit-value">120,000원 가치</span>
              </li>
              <li>
                <span class="benefit-name"><i class="fas fa-percentage"></i> 장례 발생 시 10% 할인</span>
                <span class="benefit-value">최대 499,000원 절감</span>
              </li>
            </ul>
            <div class="roi-total">
              <div class="roi-row">
                <span>연 구독료</span>
                <span class="roi-cost">154,800원</span>
              </div>
              <div class="roi-row highlight">
                <span>연 혜택 가치</span>
                <span class="roi-value">1,080,000원</span>
              </div>
              <div class="roi-bar-wrap">
                <div class="roi-bar" style="width:0%" id="roiBar"></div>
              </div>
              <p class="roi-result-text">실질 ROI <strong>697%</strong> — 지금 바로 시작하세요</p>
            </div>
            <a href="/membership" class="btn btn-primary btn-full">지금 가입하기</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PROCESS -->
  <section class="process-section section-padding bg-light">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">서비스 절차</span>
        <h2 class="section-title">임종 후 24시간, 위드엔딩이 함께합니다</h2>
      </div>
      <div class="process-steps">
        <div class="process-step">
          <div class="step-number">01</div>
          <div class="step-icon"><i class="fas fa-phone-alt"></i></div>
          <h4>즉시 연락</h4>
          <p>24시간 전담 코디네이터에게 연락하면 즉시 출동합니다</p>
        </div>
        <div class="process-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="process-step">
          <div class="step-number">02</div>
          <div class="step-icon"><i class="fas fa-user-tie"></i></div>
          <h4>전담 배정</h4>
          <p>실명제 장례지도사가 고인과 가족의 상황을 파악합니다</p>
        </div>
        <div class="process-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="process-step">
          <div class="step-number">03</div>
          <div class="step-icon"><i class="fas fa-heart"></i></div>
          <h4>존엄한 장례</h4>
          <p>선택한 패키지로 가족 중심의 품격 있는 장례를 진행합니다</p>
        </div>
        <div class="process-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="process-step">
          <div class="step-number">04</div>
          <div class="step-icon"><i class="fas fa-receipt"></i></div>
          <h4>투명한 정산</h4>
          <p>장례 완료 후 명세서 기반으로 후불 정산합니다</p>
        </div>
        <div class="process-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="process-step">
          <div class="step-number">05</div>
          <div class="step-icon"><i class="fas fa-balance-scale"></i></div>
          <h4>사후 지원</h4>
          <p>상속·증여 설계 등 가족의 미래까지 함께 설계합니다</p>
        </div>
      </div>
    </div>
  </section>

  <!-- REVIEWS -->
  <section class="reviews-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">고객 후기</span>
        <h2 class="section-title">위드엔딩을 선택한 이유</h2>
      </div>
      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"아버지 갑자기 임종하셨는데 새벽 2시에 바로 연결돼서 너무 감사했습니다. 예상 비용 그대로 정산되고 추가 청구 하나도 없었어요. 이게 진짜 장례 서비스입니다."</p>
          <div class="review-author">
            <div class="review-avatar">김</div>
            <div>
              <strong>김○○ 님</strong>
              <span>서울 / 베이직 패키지</span>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"기존 상조 가입해 두었다가 폐업으로 날린 경험이 있어서 위드엔딩 선택했습니다. 구독만 하고 실제 장례는 후불로 처리하는 구조가 정말 합리적이에요."</p>
          <div class="review-author">
            <div class="review-avatar">박</div>
            <div>
              <strong>박○○ 님</strong>
              <span>경기 / 스탠다드 멤버십</span>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"무빈소가 불효라는 편견이 있었는데, 위드엔딩 코디네이터 분이 친척들한테 직접 설명해 주셔서 오해 없이 진행됐습니다. 상속 설계까지 연결해 주셔서 한 곳에서 다 해결했어요."</p>
          <div class="review-author">
            <div class="review-avatar">이</div>
            <div>
              <strong>이○○ 님</strong>
              <span>부산 / 패밀리 멤버십</span>
            </div>
          </div>
        </div>
      </div>
      <div class="review-cta">
        <a href="/reviews" class="btn btn-outline">전체 후기 보기</a>
      </div>
    </div>
  </section>

  <!-- EMERGENCY CTA -->
  <section class="emergency-section">
    <div class="container">
      <div class="emergency-inner">
        <div class="emergency-left">
          <div class="emergency-icon-big"><i class="fas fa-phone-volume"></i></div>
          <div>
            <h2>지금 임종하셨나요?</h2>
            <p>당황하지 마세요. 위드엔딩이 즉시 출동합니다.</p>
          </div>
        </div>
        <div class="emergency-right">
          <a href="tel:15889999" class="btn btn-emergency-big pulse-btn">
            <i class="fas fa-phone-alt"></i> 1588-9999
          </a>
          <p class="emergency-small">24시간 365일 · 주말·공휴일 포함</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="footer-logo-img" /></div>
          <p>무빈소 장례 특화 서비스 / AI 엔딩 노트<br />후불제 프리미엄 장례 + 자산관리 통합 서비스</p>
          <div class="footer-social">
            <a href="#" aria-label="카카오채널"><i class="fas fa-comment"></i></a>
            <a href="#" aria-label="유튜브"><i class="fab fa-youtube"></i></a>
            <a href="#" aria-label="인스타그램"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="블로그"><i class="fas fa-blog"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <h4>서비스</h4>
          <ul>
            <li><a href="/funeral">무빈소 후불장례</a></li>
            <li><a href="/membership">위드 멤버십</a></li>
            <li><a href="/asset">자산관리 서비스</a></li>
            <li><a href="/guide">웰다잉 가이드</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>회사</h4>
          <ul>
            <li><a href="/about">회사소개</a></li>
            <li><a href="/reviews">고객후기</a></li>
            <li><a href="/contact">24시간 상담</a></li>
            <li><a href="/contact">상담 예약</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>상담</h4>
          <p><i class="fas fa-phone"></i> 1588-9999</p>
          <p><i class="fas fa-clock"></i> 24시간 365일</p>
          <p><i class="fas fa-envelope"></i> memorialcastles@gmail.com</p>
          <p><i class="fas fa-map-marker-alt"></i> 인천광역시 부평구 서달로298번길 50, 2층(청천동)</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="/privacy">개인정보처리방침</a>
          <a href="/terms">이용약관</a>
          <a href="/legal">법적 고지</a>
        </div>
        <p class="footer-copy">
          ⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료이며, 장례비를 선납하는 상조가 아닙니다.
        </p>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn" aria-label="긴급상담">
    <i class="fas fa-phone-alt"></i>
    <span>긴급상담</span>
  </a>

  <script src="/static/main.js"></script>
</body>
</html>`)
})

// ─── FUNERAL PAGE ────────────────────────────────────────────────────────────
app.get('/funeral', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>무빈소 후불장례 — 위드엔딩</title>
  <meta name="description" content="투명한 가격, 후불 정산, 실명제 장례지도사. 무빈소 장례 전문 위드엔딩." />
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link active">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <!-- PAGE HERO -->
  <section class="page-hero funeral-hero">
    <div class="page-hero-content">
      <span class="section-tag">무빈소 후불장례</span>
      <h1>우리 가족끼리 존엄하게<br /><span class="accent">고인 추모</span></h1>
      <p>대한민국 최초 후불 정산 시스템. 선불금 0원, 추가비용 0원, 투명한 정찰제.</p>
      <a href="#calculator" class="btn btn-primary">
        <i class="fas fa-calculator"></i> 지금 예상 비용 계산하기
      </a>
    </div>
  </section>

  <!-- CALCULATOR -->
  <section class="calc-section section-padding" id="calculator">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">실시간 견적 계산기</span>
        <h2 class="section-title">3분 만에 정확한 비용 확인</h2>
        <p class="section-sub">입력하는 즉시 예상 비용이 업데이트됩니다</p>
      </div>
      <div class="calc-wrapper">
        <div class="calc-form">
          <div class="calc-step">
            <label class="calc-label">1. 장례 패키지 선택</label>
            <div class="package-radio-group">
              <label class="package-radio">
                <input type="radio" name="package" value="basic" checked />
                <div class="package-radio-content">
                  <div class="pkg-name">🌱 베이직</div>
                  <div class="pkg-price">3,900,000원</div>
                  <div class="pkg-desc">합리적 기본 장례</div>
                </div>
              </label>
              <label class="package-radio">
                <input type="radio" name="package" value="standard" />
                <div class="package-radio-content">
                  <div class="pkg-name">🌳 스탠다드</div>
                  <div class="pkg-price">4,900,000원</div>
                  <div class="pkg-desc">품격 있는 가족장</div>
                </div>
              </label>
              <label class="package-radio">
                <input type="radio" name="package" value="premium" />
                <div class="package-radio-content">
                  <div class="pkg-name">🏆 프리미엄</div>
                  <div class="pkg-price">5,900,000원</div>
                  <div class="pkg-desc">최상위 존엄장례</div>
                </div>
              </label>
            </div>
          </div>

          <div class="calc-step">
            <label class="calc-label">2. 위드 멤버십 가입 여부</label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" name="membership" value="none" checked /> 미가입
              </label>
              <label class="radio-item">
                <input type="radio" name="membership" value="lite" /> 라이트 (월 6,900원)
              </label>
              <label class="radio-item">
                <input type="radio" name="membership" value="standard" /> 스탠다드 (월 12,900원)
              </label>
              <label class="radio-item">
                <input type="radio" name="membership" value="family" /> 패밀리 (월 24,900원)
              </label>
            </div>
          </div>

          <div class="calc-step" id="monthsStep" style="display:none">
            <label class="calc-label">3. 구독 유지 기간</label>
            <div class="slider-wrap">
              <input type="range" id="monthsSlider" min="1" max="60" value="12" class="slider" />
              <div class="slider-value"><span id="monthsVal">12</span>개월</div>
            </div>
          </div>

          <div class="calc-step">
            <label class="calc-label">4. 선택 옵션 (실비 별도)</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" name="options" value="cremation" data-price="120000" />
                화장장 실비 포함 (약 12만원)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="options" value="transport" data-price="80000" />
                원거리 이송 (100km 이상, 약 8만원)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="options" value="grief" data-price="150000" />
                그리프케어 상담 (2회, 약 15만원)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="options" value="digital" data-price="50000" />
                AI 추모관 영구 등록 (5만원)
              </label>
            </div>
          </div>
        </div>

        <div class="calc-result" id="calcResult">
          <div class="result-header">
            <i class="fas fa-receipt"></i> 예상 비용 계산 결과
          </div>
          <div class="result-body">
            <div class="result-row">
              <span>패키지 기본가</span>
              <span id="r-base">3,900,000원</span>
            </div>
            <div class="result-row discount" id="r-discount-row" style="display:none">
              <span>멤버십 할인</span>
              <span id="r-discount" style="color:#2D6A4F">-0원</span>
            </div>
            <div class="result-row discount" id="r-accum-row" style="display:none">
              <span>누적 혜택 공제</span>
              <span id="r-accum" style="color:#2D6A4F">-0원</span>
            </div>
            <div class="result-row" id="r-options-row" style="display:none">
              <span>선택 옵션 합계</span>
              <span id="r-options">0원</span>
            </div>
            <div class="result-divider"></div>
            <div class="result-total">
              <span>최종 예상 비용</span>
              <span id="r-total" class="total-price">3,900,000원</span>
            </div>
            <p class="result-note">* 화장장 실비(8~15만원)는 실제 발생 금액으로 청구됩니다</p>
            <p class="result-note">* 최종 금액은 상담 후 계약서에 명시됩니다</p>
          </div>
          <a href="/contact" class="btn btn-primary btn-full">
            <i class="fas fa-comments"></i> 무료 상담 신청
          </a>
          <a href="tel:15889999" class="btn btn-emergency btn-full mt-8">
            <i class="fas fa-phone-alt"></i> 지금 임종 — 즉시 연결
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- PACKAGES -->
  <section class="packages-section section-padding bg-light">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">투명한 패키지</span>
        <h2 class="section-title">명확한 가격, 숨겨진 비용 없음</h2>
      </div>
      <div class="packages-grid">
        <div class="pkg-card">
          <div class="pkg-header">
            <span class="pkg-icon">🌱</span>
            <h3>베이직</h3>
            <p class="pkg-tagline">합리적 기본 장례</p>
            <div class="pkg-price-big">3,900,000<span>원</span></div>
          </div>
          <ul class="pkg-features">
            <li class="yes"><i class="fas fa-check"></i> 장례지도사 2인 [입관 및 보조]</li>
            <li class="yes"><i class="fas fa-check"></i> 의전지도사 1인 [20시간 기준]</li>
            <li class="yes"><i class="fas fa-check"></i> 의전관리사 4인 [총 40시간]</li>
            <li class="yes"><i class="fas fa-check"></i> 왕복 150km 버스 &amp; 리무진</li>
            <li class="yes"><i class="fas fa-check"></i> 이송 앰뷸런스 관내 20km</li>
            <li class="yes"><i class="fas fa-check"></i> MC 명품 3호 수의 / 저마</li>
            <li class="yes"><i class="fas fa-check"></i> 헌화 30송이</li>
            <li class="yes"><i class="fas fa-check"></i> 유골함 MC-2호 (황토함)</li>
            <li class="note"><i class="fas fa-info-circle"></i> 화장장 실비 별도 (8~15만원)</li>
          </ul>
          <a href="/contact" class="btn btn-outline btn-full">지금 상담</a>
        </div>
        <div class="pkg-card featured-pkg">
          <div class="pkg-badge">가장 많이 선택</div>
          <div class="pkg-header">
            <span class="pkg-icon">🌳</span>
            <h3>스탠다드</h3>
            <p class="pkg-tagline">품격 있는 가족장</p>
            <div class="pkg-price-big">4,900,000<span>원</span></div>
          </div>
          <ul class="pkg-features">
            <li class="yes"><i class="fas fa-check"></i> 장례지도사 2인 [입관 및 보조]</li>
            <li class="yes"><i class="fas fa-check"></i> 의전지도사 1인 [20시간 기준]</li>
            <li class="yes"><i class="fas fa-check"></i> 의전관리사 6인 [총 60시간]</li>
            <li class="yes"><i class="fas fa-check"></i> 왕복 300km 버스 &amp; 리무진</li>
            <li class="yes"><i class="fas fa-check"></i> 이송 앰뷸런스 관내 30km</li>
            <li class="yes"><i class="fas fa-check"></i> MC 4호 수의 / 대마</li>
            <li class="yes"><i class="fas fa-check"></i> 헌화 60송이</li>
            <li class="yes"><i class="fas fa-check"></i> 유골함 MC-3호 (도자기함)</li>
            <li class="note"><i class="fas fa-info-circle"></i> 화장장 실비 별도 (8~15만원)</li>
          </ul>
          <a href="/contact" class="btn btn-primary btn-full">지금 상담</a>
        </div>
        <div class="pkg-card">
          <div class="pkg-header">
            <span class="pkg-icon">🏆</span>
            <h3>프리미엄</h3>
            <p class="pkg-tagline">최상위 존엄장례</p>
            <div class="pkg-price-big">5,900,000<span>원</span></div>
          </div>
          <ul class="pkg-features">
            <li class="yes"><i class="fas fa-check"></i> 장례지도사 2인 [입관 및 보조]</li>
            <li class="yes"><i class="fas fa-check"></i> 의전지도사 1인 [20시간 기준]</li>
            <li class="yes"><i class="fas fa-check"></i> 의전관리사 8인 [총 80시간]</li>
            <li class="yes"><i class="fas fa-check"></i> 왕복 500km 버스 &amp; 리무진</li>
            <li class="yes"><i class="fas fa-check"></i> 이송 앰뷸런스 관내/관외 30km</li>
            <li class="yes"><i class="fas fa-check"></i> MC 4호 수의 / 실크</li>
            <li class="yes"><i class="fas fa-check"></i> 헌화 60송이</li>
            <li class="yes"><i class="fas fa-check"></i> 유골함 MC-3호 (진공도자기함)</li>
            <li class="yes"><i class="fas fa-check"></i> <strong>화장장 비용 포함</strong></li>
          </ul>
          <a href="/contact" class="btn btn-outline btn-full">지금 상담</a>
        </div>
      </div>
    </div>
  </section>

  <!-- DETAIL PRICE TABLE (탭: 베이직/스탠다드/프리미엄 + 무빈소 기본형/고급형) -->
  <section class="detail-price-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">상세 구성 비교</span>
        <h2 class="section-title">패키지별 구성 항목 한눈에 비교</h2>
        <p class="section-sub">아래 탭을 선택해 원하는 상품의 구성을 확인하세요</p>
      </div>

      <!-- 탭 버튼 -->
      <div class="detail-tab-group">
        <button class="detail-tab active" onclick="switchTab('tab-full')">📋 베이직 · 스탠다드 · 프리미엄</button>
        <button class="detail-tab" onclick="switchTab('tab-mubinso')">🏠 무빈소 기본형 · 고급형</button>
      </div>

      <!-- 탭 패널 -->
      <div class="detail-tab-panels">

        <!-- ① 베이직 / 스탠다드 / 프리미엄 -->
        <div class="tab-panel active" id="tab-full">
          <div class="detail-table-wrap">
            <table class="detail-price-table">
              <thead>
                <tr>
                  <th class="col-category">구분</th>
                  <th class="col-basic">🌱 베이직<span class="price-sub">상품가 : 390만원</span></th>
                  <th class="col-standard">🌳 스탠다드<span class="price-sub">상품가 : 490만원</span></th>
                  <th class="col-premium">🏆 프리미엄<span class="price-sub">상품가 : 590만원</span></th>
                </tr>
              </thead>
              <tbody>
                <!-- 장례인력 -->
                <tr class="row-group-header"><td colspan="4">장례인력</td></tr>
                <tr class="sub-item"><td>장례지도사</td><td>2인[입관 및 보조]</td><td>2인[입관 및 보조]</td><td>2인[입관 및 보조]</td></tr>
                <tr class="sub-item"><td>의전지도사</td><td>1인[20시간 기준]</td><td>1인[20시간 기준]</td><td>1인[20시간 기준]</td></tr>
                <tr class="sub-item"><td>의전관리사</td><td class="highlight-blue">4인 [총 40시간]</td><td class="highlight-blue">6인 [총 60시간]</td><td class="highlight-red">8인 [총 80시간]</td></tr>

                <!-- 장의차량 -->
                <tr class="row-group-header"><td colspan="4">장의차량</td></tr>
                <tr class="sub-item"><td>리무진 버스 · 고급 리무진</td><td class="highlight-blue">왕복 150km 제공 버스 &amp; 리무진</td><td class="highlight-blue">왕복 300km 제공 버스 &amp; 리무진</td><td>왕복 500km 제공 버스 &amp; 리무진</td></tr>
                <tr class="sub-item"><td>이송 앰뷸런스</td><td>관내 20km 제공</td><td>관내 30km 제공</td><td>관내/관외 30km 제공</td></tr>

                <!-- 입관용품 -->
                <tr class="row-group-header"><td colspan="4">입관용품</td></tr>
                <tr class="sub-item"><td>관 (화장)</td><td>화장 : 1.7cm 오동[보통]</td><td class="highlight-red">화장 : 1.7cm 오동[특]</td><td class="highlight-red">화장 : 1.7cm 오동[특]</td></tr>
                <tr class="sub-item"><td>관 (매장)</td><td>매장 : 4.2cm 오동[보통]</td><td class="highlight-red">매장 : 4.2cm 오동[특]</td><td class="highlight-red">매장 : 4.2cm 오동[특]</td></tr>
                <tr class="sub-item"><td>수의</td><td>MC 명품 3호 / 저마</td><td>MC 4호 / 대마</td><td>MC 4호 / 실크</td></tr>
                <tr class="sub-item"><td>고인용품</td><td>일체 제공</td><td>일체 제공</td><td>일체 제공</td></tr>

                <!-- 상주용품 -->
                <tr class="row-group-header"><td colspan="4">상주용품</td></tr>
                <tr class="sub-item"><td>빈소용품</td><td>일체 제공</td><td>일체 제공</td><td>일체 제공</td></tr>
                <tr class="sub-item"><td>남자</td><td>검정양복 4벌 대여</td><td>검정양복 8벌 대여</td><td>검정양복 12벌 대여</td></tr>
                <tr class="sub-item"><td>여자</td><td>개량한복 4벌 대여</td><td>개량한복 무제한 대여</td><td>개량한복 무제한 대여</td></tr>

                <!-- 헌화 -->
                <tr class="row-group-header"><td colspan="4">헌화</td></tr>
                <tr class="sub-item"><td>헌화 꽃</td><td>30 송이</td><td class="highlight-red">60 송이</td><td class="highlight-red">60 송이</td></tr>

                <!-- 유골함 -->
                <tr class="row-group-header"><td colspan="4">유골함</td></tr>
                <tr class="sub-item"><td>화장 시 제공</td><td class="highlight-gold">MC - 2호 (황토함)</td><td class="highlight-gold">MC - 3호 (도자기함)</td><td class="highlight-gold">MC - 3호 (진공도자기함)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ② 무빈소 기본형 / 고급형 -->
        <div class="tab-panel" id="tab-mubinso">
          <div class="detail-table-wrap">
            <table class="detail-price-table">
              <thead>
                <tr>
                  <th class="col-category">구분</th>
                  <th class="col-mubinso-basic">🏠 무빈소 기본형<span class="price-sub">상품가 : 120만원</span></th>
                  <th class="col-mubinso-premium">✨ 무빈소 고급형<span class="price-sub">상품가 : 150만원</span></th>
                </tr>
              </thead>
              <tbody>
                <!-- 장례인력 -->
                <tr class="row-group-header"><td colspan="3">장례인력</td></tr>
                <tr class="sub-item"><td>장례지도사</td><td>2인[입관 및 보조]</td><td>2인[입관 및 보조]</td></tr>
                <tr class="sub-item"><td>발인지도사</td><td>—</td><td class="highlight-red">관내</td></tr>
                <tr class="sub-item"><td>의전관리사</td><td>—</td><td>—</td></tr>

                <!-- 장의차량 -->
                <tr class="row-group-header"><td colspan="3">장의차량</td></tr>
                <tr class="sub-item"><td>리무진 버스 · 고급 리무진</td><td>왕복 100km 제공 고인전용 앰뷸런스</td><td class="highlight-red">왕복 100km 제공 버스 or 리무진 택1</td></tr>
                <tr class="sub-item"><td>이송 앰뷸런스</td><td>관내 10km 제공</td><td class="highlight-red">관내 20km 제공</td></tr>

                <!-- 입관용품 -->
                <tr class="row-group-header"><td colspan="3">입관용품</td></tr>
                <tr class="sub-item"><td>관 (화장)</td><td>화장 : 1.7cm 오동[보통]</td><td>화장 : 1.7cm 오동[보통]</td></tr>
                <tr class="sub-item"><td>관 (매장)</td><td>매장 : 4.2cm 오동[보통]</td><td>매장 : 4.2cm 오동[보통]</td></tr>
                <tr class="sub-item"><td>수의</td><td>MC 2호 / 면</td><td>MC 2호 / 저마</td></tr>
                <tr class="sub-item"><td>고인용품</td><td>일체제공</td><td>일체제공</td></tr>

                <!-- 상주용품 -->
                <tr class="row-group-header"><td colspan="3">상주용품</td></tr>
                <tr class="sub-item"><td>빈소용품</td><td>선택</td><td class="highlight-red">오동나무 위패</td></tr>
                <tr class="sub-item"><td>남자</td><td>선택</td><td>선택</td></tr>
                <tr class="sub-item"><td>여자</td><td>선택</td><td>선택</td></tr>

                <!-- 헌화 -->
                <tr class="row-group-header"><td colspan="3">헌화</td></tr>
                <tr class="sub-item"><td>헌화 꽃</td><td>선택</td><td class="highlight-red">국화 10송이</td></tr>

                <!-- 유골함 -->
                <tr class="row-group-header"><td colspan="3">유골함</td></tr>
                <tr class="sub-item"><td>화장 시 제공</td><td class="highlight-gold">MC - 1호 (목함)</td><td class="highlight-gold">MC - 1호 (목함)</td></tr>
              </tbody>
            </table>
          </div>
          <p style="text-align:center; margin-top:16px; font-size:.85rem; color:#666;">
            ※ 무빈소 장례는 빈소 설치 없이 진행되는 합리적인 장례 방식입니다. 추가 구성은 상담 후 선택 가능합니다.
          </p>
        </div>

      </div><!-- /.detail-tab-panels -->

      <div style="text-align:center; margin-top:32px;">
        <a href="/contact" class="btn btn-primary"><i class="fas fa-comments"></i> 무료 상담으로 나에게 맞는 패키지 확인</a>
      </div>
    </div>
  </section>

  <script>
  function switchTab(id) {
    document.querySelectorAll('.detail-tab-panels .tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
  }
  </script>

  <!-- DIRECTORS -->
  <section class="directors-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">실명제 전문가</span>
        <h2 class="section-title">담당 장례지도사를 미리 만나보세요</h2>
        <p class="section-sub">익명 배정 없이, 사전에 담당자를 확인하고 신뢰를 쌓습니다</p>
      </div>
      <div class="directors-grid">
        <div class="director-card">
          <div class="director-avatar">🧑‍⚕️</div>
          <h4>김민준 장례지도사</h4>
          <span class="director-badge">수석 코디네이터</span>
          <p>장례 업계 15년 경력. 무빈소 장례 200건 이상 진행. 사회복지사 1급 보유.</p>
          <div class="director-stats">
            <span>진행 건수 <strong>243건</strong></span>
            <span>만족도 <strong>99.2%</strong></span>
          </div>
        </div>
        <div class="director-card">
          <div class="director-avatar">👩‍⚕️</div>
          <h4>이서연 장례지도사</h4>
          <span class="director-badge">가족 소통 전문</span>
          <p>12년 경력. 가족 갈등 중재 전문. 그리프케어 상담사 자격 보유.</p>
          <div class="director-stats">
            <span>진행 건수 <strong>187건</strong></span>
            <span>만족도 <strong>98.8%</strong></span>
          </div>
        </div>
        <div class="director-card">
          <div class="director-avatar">🧑‍💼</div>
          <h4>박현우 장례지도사</h4>
          <span class="director-badge">행정 처리 전문</span>
          <p>8년 경력. 사망신고·행정 대행 전문. 상속 1차 상담 연계 가능.</p>
          <div class="director-stats">
            <span>진행 건수 <strong>156건</strong></span>
            <span>만족도 <strong>98.5%</strong></span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="emergency-section">
    <div class="container">
      <div class="emergency-inner">
        <div class="emergency-left">
          <div class="emergency-icon-big"><i class="fas fa-phone-volume"></i></div>
          <div><h2>지금 임종하셨나요?</h2><p>당황하지 마세요. 위드엔딩이 즉시 출동합니다.</p></div>
        </div>
        <div class="emergency-right">
          <a href="tel:15889999" class="btn btn-emergency-big pulse-btn"><i class="fas fa-phone-alt"></i> 1588-9999</a>
          <p class="emergency-small">24시간 365일 · 주말·공휴일 포함</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
        <p class="footer-copy">⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료이며, 장례비를 선납하는 상조가 아닙니다.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="/static/main.js"></script>
  <script src="/static/calculator.js"></script>
</body>
</html>`)
})

// ─── MEMBERSHIP PAGE ─────────────────────────────────────────────────────────
app.get('/membership', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>위드 멤버십 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link active">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <section class="page-hero membership-hero">
    <div class="page-hero-content">
      <span class="section-tag">위드 멤버십</span>
      <h1>월 6,900원으로<br /><span class="accent">연 25만원 이상 혜택</span></h1>
      <p>웰다잉 설계부터 자산관리·상속·증여까지. 지금 당장 받는 실질적 가치.</p>
      <div class="hero-legal-note">
        ⚠️ 구독료는 현재 제공 서비스 이용료입니다. 장례비 선납 상조가 아닙니다.
      </div>
    </div>
  </section>

  <!-- LEGAL NOTICE -->
  <section class="legal-section">
    <div class="container">
      <div class="legal-box">
        <div class="legal-icon"><i class="fas fa-shield-alt"></i></div>
        <div class="legal-content">
          <h3>중요 법적 안내</h3>
          <p><strong>위드 멤버십은 장례비를 미리 내는 상조가 아닙니다.</strong><br />
          구독료는 웰다잉·자산관리·상속·증여 컨설팅 등 현재 제공되는 서비스 이용료입니다.<br />
          장례 발생 시 서비스는 별도 계약으로 후불 정산됩니다.<br />
          구독 해지 시에도 장례 서비스 이용에 제한이 없습니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- TIER COMPARISON -->
  <section class="section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">멤버십 비교</span>
        <h2 class="section-title">나에게 맞는 플랜 선택</h2>
      </div>
      <div class="membership-grid">
        <div class="mem-card">
          <div class="mem-header lite-header">
            <span class="mem-icon">🌱</span>
            <h3>라이트</h3>
            <div class="mem-price">6,900<span>원/월</span></div>
            <div class="mem-annual">연 82,800원</div>
          </div>
          <div class="mem-roi-badge">ROI 302%</div>
          <ul class="mem-features">
            <li class="yes"><i class="fas fa-check"></i> 엔딩노트 앱 이용권</li>
            <li class="yes"><i class="fas fa-check"></i> 자산 현황 관리 도구</li>
            <li class="yes"><i class="fas fa-check"></i> 상속세 간편 계산기</li>
            <li class="yes"><i class="fas fa-check"></i> 장례 5% 할인</li>
            <li class="yes"><i class="fas fa-check"></i> 월간 웰다잉 뉴스레터</li>
            <li class="no"><i class="fas fa-times"></i> 전문가 상담</li>
            <li class="no"><i class="fas fa-times"></i> 상속 설계 보고서</li>
            <li class="no"><i class="fas fa-times"></i> 증여 시뮬레이션</li>
          </ul>
          <div class="mem-value">연 혜택 가치 <strong>25만원</strong></div>
          <a href="/contact" class="btn btn-outline btn-full">라이트 가입</a>
        </div>

        <div class="mem-card featured-mem">
          <div class="mem-best-badge">가장 인기</div>
          <div class="mem-header standard-header">
            <span class="mem-icon">🌳</span>
            <h3>스탠다드</h3>
            <div class="mem-price">12,900<span>원/월</span></div>
            <div class="mem-annual">연 154,800원</div>
          </div>
          <div class="mem-roi-badge roi-gold">ROI 697%</div>
          <ul class="mem-features">
            <li class="yes"><i class="fas fa-check"></i> 라이트 전체 포함</li>
            <li class="yes"><i class="fas fa-check"></i> 전문가 상담 월 1회</li>
            <li class="yes"><i class="fas fa-check"></i> 상속 설계 보고서 연 1회</li>
            <li class="yes"><i class="fas fa-check"></i> 증여 10년 시뮬레이션</li>
            <li class="yes"><i class="fas fa-check"></i> 디지털 자산 관리</li>
            <li class="yes"><i class="fas fa-check"></i> 사회적 가치 설계 (기본)</li>
            <li class="yes"><i class="fas fa-check"></i> 장례 10% 할인</li>
            <li class="no"><i class="fas fa-times"></i> 가족 계정</li>
          </ul>
          <div class="mem-value">연 혜택 가치 <strong>108만원</strong></div>
          <a href="/contact" class="btn btn-primary btn-full">스탠다드 가입</a>
        </div>

        <div class="mem-card">
          <div class="mem-header family-header">
            <span class="mem-icon">🏡</span>
            <h3>패밀리</h3>
            <div class="mem-price">24,900<span>원/월</span></div>
            <div class="mem-annual">연 298,800원</div>
          </div>
          <div class="mem-roi-badge">ROI 736%</div>
          <ul class="mem-features">
            <li class="yes"><i class="fas fa-check"></i> 스탠다드 전체 포함</li>
            <li class="yes"><i class="fas fa-check"></i> 가족 계정 4인 포함</li>
            <li class="yes"><i class="fas fa-check"></i> 상속 설계 분기 1회</li>
            <li class="yes"><i class="fas fa-check"></i> 전문가 상담 분기 1회</li>
            <li class="yes"><i class="fas fa-check"></i> 사회적 가치 설계 VIP</li>
            <li class="yes"><i class="fas fa-check"></i> 안부 확인 전화 주 2회</li>
            <li class="yes"><i class="fas fa-check"></i> 장례 15% 할인</li>
            <li class="yes"><i class="fas fa-check"></i> 긴급 법률 상담 연 2회</li>
          </ul>
          <div class="mem-value">연 혜택 가치 <strong>220만원</strong></div>
          <a href="/contact" class="btn btn-outline btn-full">패밀리 가입</a>
        </div>
      </div>

      <!-- ROI TABLE -->
      <div class="roi-table-section">
        <h3>한눈에 보는 ROI 비교</h3>
        <table class="compare-table">
          <thead>
            <tr>
              <th>구분</th>
              <th>🌱 라이트</th>
              <th>🌳 스탠다드</th>
              <th>🏡 패밀리</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>월 구독료</td><td>6,900원</td><td>12,900원</td><td>24,900원</td></tr>
            <tr><td>연 구독료</td><td>82,800원</td><td>154,800원</td><td>298,800원</td></tr>
            <tr><td>연 혜택 가치</td><td class="good">250,000원</td><td class="good">1,080,000원</td><td class="good">2,200,000원</td></tr>
            <tr><td>장례 할인율</td><td>5%</td><td>10%</td><td>15%</td></tr>
            <tr><td>가족 계정</td><td class="bad">❌</td><td class="bad">❌</td><td class="good">4인 포함</td></tr>
            <tr><td>실질 ROI</td><td class="good"><strong>302%</strong></td><td class="good"><strong>697%</strong></td><td class="good"><strong>736%</strong></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="emergency-section">
    <div class="container">
      <div class="emergency-inner">
        <div class="emergency-left">
          <div class="emergency-icon-big"><i class="fas fa-phone-volume"></i></div>
          <div><h2>가입 상담이 필요하신가요?</h2><p>멤버십 전문 상담사가 최적 플랜을 추천해 드립니다.</p></div>
        </div>
        <div class="emergency-right">
          <a href="tel:15889999" class="btn btn-emergency-big pulse-btn"><i class="fas fa-phone-alt"></i> 1588-9999</a>
          <p class="emergency-small">24시간 365일 운영</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
        <p class="footer-copy">⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료이며, 장례비를 선납하는 상조가 아닙니다.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="/static/main.js"></script>
</body>
</html>`)
})

// ─── ASSET PAGE ──────────────────────────────────────────────────────────────
app.get('/asset', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>자산관리 서비스 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link active">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <section class="page-hero asset-hero">
    <div class="page-hero-content">
      <span class="section-tag">자산관리 서비스</span>
      <h1>삶의 마무리를<br /><span class="accent">가장 현명하게</span></h1>
      <p>상속·증여 절세 설계부터 사회적 가치 유산까지. 전문가가 함께 설계합니다.</p>
      <a href="/contact" class="btn btn-primary"><i class="fas fa-calculator"></i> 상속세 무료 계산</a>
    </div>
  </section>

  <!-- INHERITANCE SIMULATOR -->
  <section class="section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">절세 시뮬레이터</span>
        <h2 class="section-title">상속세 얼마나 아낄 수 있을까요?</h2>
        <p class="section-sub">간단한 입력으로 절세 가능 금액을 확인하세요</p>
      </div>
      <div class="simulator-wrapper">
        <div class="sim-form">
          <div class="sim-step">
            <label class="calc-label">총 자산 규모</label>
            <div class="asset-slider-wrap">
              <input type="range" id="assetSlider" min="100" max="5000" step="100" value="1000" class="slider" />
              <div class="slider-value"><span id="assetVal">10</span>억원</div>
            </div>
          </div>
          <div class="sim-step">
            <label class="calc-label">상속 예정 가족 구성</label>
            <div class="radio-group">
              <label class="radio-item"><input type="radio" name="family" value="spouse_2child" checked /> 배우자 + 자녀 2명</label>
              <label class="radio-item"><input type="radio" name="family" value="spouse_1child" /> 배우자 + 자녀 1명</label>
              <label class="radio-item"><input type="radio" name="family" value="2child" /> 자녀 2명 (배우자 사망)</label>
              <label class="radio-item"><input type="radio" name="family" value="1child" /> 자녀 1명</label>
            </div>
          </div>
          <div class="sim-step">
            <label class="calc-label">사전 증여 계획</label>
            <div class="checkbox-group">
              <label class="checkbox-item"><input type="checkbox" id="has10yr" /> 10년 단위 증여 계획 있음</label>
              <label class="checkbox-item"><input type="checkbox" id="hasCharity" /> 사회적 기부·레거시 설계 포함</label>
              <label class="checkbox-item"><input type="checkbox" id="hasInsurance" /> 상속 생명보험 활용</label>
            </div>
          </div>
        </div>
        <div class="sim-result">
          <div class="sim-result-header">예상 절세 효과 분석</div>
          <div class="sim-compare">
            <div class="sim-box before">
              <div class="sim-box-label">설계 전</div>
              <div class="sim-tax" id="taxBefore">약 2억 2,000만원</div>
              <div class="sim-sub">예상 상속세</div>
            </div>
            <div class="sim-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="sim-box after">
              <div class="sim-box-label">위드엔딩 설계 후</div>
              <div class="sim-tax" id="taxAfter" style="color:#2D6A4F">약 1억 4,000만원</div>
              <div class="sim-sub">예상 상속세</div>
            </div>
          </div>
          <div class="sim-saving">
            <i class="fas fa-piggy-bank"></i>
            절감 예상액 <strong id="taxSaving">약 8,000만원</strong>
          </div>
          <p class="sim-note">※ 본 계산은 참고용 추정치입니다. 정확한 절세액은 전문가 상담이 필요합니다.</p>
          <a href="/contact" class="btn btn-primary btn-full">전문가 상담 신청</a>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES -->
  <section class="section-padding bg-light">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">자산관리 서비스</span>
        <h2 class="section-title">3가지 핵심 서비스</h2>
      </div>
      <div class="asset-services-grid">
        <div class="asset-service-card">
          <div class="asset-svc-icon"><i class="fas fa-balance-scale"></i></div>
          <h3>상속 설계</h3>
          <p>10년 단위 장기 계획으로 법정 공제를 최대한 활용합니다. 배우자 공제, 일괄 공제, 금융 재산 공제 등 전략적 절세 방안을 설계합니다.</p>
          <ul class="asset-svc-list">
            <li><i class="fas fa-check"></i> 가족 구성별 맞춤 전략</li>
            <li><i class="fas fa-check"></i> 부동산·금융자산 포트폴리오 분석</li>
            <li><i class="fas fa-check"></i> 절세 시나리오 3가지 비교 제공</li>
          </ul>
          <a href="/contact" class="btn btn-outline">상담 신청</a>
        </div>
        <div class="asset-service-card featured-svc">
          <h3>증여 전략</h3>
          <div class="asset-svc-icon"><i class="fas fa-gift"></i></div>
          <p>10년 단위 증여 면제 한도를 최대 활용하는 장기 계획을 수립합니다. 자녀·손자 증여 타이밍 최적화로 세금 부담을 줄입니다.</p>
          <ul class="asset-svc-list">
            <li><i class="fas fa-check"></i> 10년 단위 증여 계획 수립</li>
            <li><i class="fas fa-check"></i> 세대별 증여 한도 최적화</li>
            <li><i class="fas fa-check"></i> 창업·교육 자금 증여 전략</li>
          </ul>
          <a href="/contact" class="btn btn-primary">상담 신청</a>
        </div>
        <div class="asset-service-card">
          <div class="asset-svc-icon"><i class="fas fa-heart"></i></div>
          <h3>위드 레거시</h3>
          <p>단순한 재산 분배를 넘어 삶의 가치를 후대에 전달하는 사회적 유산을 설계합니다. 기부·장학금·환경 프로젝트 연계.</p>
          <ul class="asset-svc-list">
            <li><i class="fas fa-check"></i> 교육 레거시 (장학금 기금)</li>
            <li><i class="fas fa-check"></i> 환경 레거시 (추모 나무 심기)</li>
            <li><i class="fas fa-check"></i> 커뮤니티 레거시 (사회적경제 기부)</li>
          </ul>
          <a href="/contact" class="btn btn-outline">상담 신청</a>
        </div>
      </div>
    </div>
  </section>

  <!-- LEGACY -->
  <section class="legacy-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">위드 레거시</span>
        <h2 class="section-title">삶의 가치를 세상에 남기세요</h2>
        <p class="section-sub">기부액의 15~30% 세액 공제. 실질 비용은 생각보다 적습니다.</p>
      </div>
      <div class="legacy-grid">
        <div class="legacy-card">
          <div class="legacy-icon">🎓</div>
          <h4>교육 레거시</h4>
          <p>지역 학생 장학금 기금 설정, 청년 창업 지원 펀드 조성</p>
          <div class="legacy-min">최소 500만원 · 세액공제 15~30%</div>
          <div class="legacy-calc">
            500만원 기부 시 실질 비용 <strong>350~425만원</strong>
          </div>
        </div>
        <div class="legacy-card">
          <div class="legacy-icon">🌱</div>
          <h4>환경 레거시</h4>
          <p>추모 나무 심기 (전국 지정 숲), 탄소중립 기여 인증서 발급</p>
          <div class="legacy-min">최소 100만원 · 세액공제 15~30%</div>
          <div class="legacy-calc">
            100만원 기부 시 실질 비용 <strong>70~85만원</strong>
          </div>
        </div>
        <div class="legacy-card">
          <div class="legacy-icon">🤝</div>
          <h4>커뮤니티 레거시</h4>
          <p>사회적 기업 지분 기부, 지역 공공 예술 후원</p>
          <div class="legacy-min">최소 300만원 · 세액공제 15~30%</div>
          <div class="legacy-calc">
            300만원 기부 시 실질 비용 <strong>210~255만원</strong>
          </div>
        </div>
      </div>
      <div class="legacy-formula">
        <span>실질 기부 비용 =</span>
        <span>기부액</span>
        <span>−</span>
        <span>(기부액 × 세액공제율)</span>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="/static/main.js"></script>
  <script src="/static/simulator.js"></script>
</body>
</html>`)
})

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
app.get('/contact', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>24시간 긴급상담 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn active">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <section class="contact-hero">
    <div class="container">
      <div class="contact-hero-inner">
        <div class="contact-emergency-box">
          <div class="emergency-pulse-ring"></div>
          <i class="fas fa-phone-volume contact-phone-icon"></i>
          <h1>지금 바로 연결됩니다</h1>
          <p>임종 직후, 당황하지 마세요.<br />위드엔딩 전담 코디네이터가 즉시 출동합니다.</p>
          <a href="tel:15889999" class="btn btn-emergency-big pulse-btn contact-call-btn">
            <i class="fas fa-phone-alt"></i> 1588-9999
          </a>
          <div class="contact-tags">
            <span>✅ 24시간 365일</span>
            <span>✅ 주말·공휴일 포함</span>
            <span>✅ 평균 응대 15초 이내</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-padding">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-form-wrap">
          <h2>온라인 상담 신청</h2>
          <p class="form-sub">영업일 기준 2시간 내 회신드립니다. 긴급하시면 전화 주세요.</p>
          <form class="contact-form" id="contactForm">
            <div class="form-row">
              <div class="form-group">
                <label>이름 *</label>
                <input type="text" id="field_name" name="from_name" placeholder="홍길동" required />
              </div>
              <div class="form-group">
                <label>연락처 *</label>
                <input type="tel" id="field_phone" name="from_phone" placeholder="010-0000-0000" required />
              </div>
            </div>
            <div class="form-group">
              <label>이메일 (선택)</label>
              <input type="email" id="field_email" name="from_email" placeholder="example@email.com" />
            </div>
            <div class="form-group">
              <label>상담 유형 *</label>
              <select id="field_type" name="consult_type" required>
                <option value="">선택해주세요</option>
                <option value="🚨 긴급 장례 (임종 직후)">🚨 긴급 장례 (임종 직후)</option>
                <option value="📋 장례 사전 계획">📋 장례 사전 계획</option>
                <option value="🌿 멤버십 가입 문의">🌿 멤버십 가입 문의</option>
                <option value="🏦 상속·증여 설계">🏦 상속·증여 설계</option>
                <option value="💬 기타 문의">💬 기타 문의</option>
              </select>
            </div>
            <div class="form-group">
              <label>문의 내용</label>
              <textarea id="field_message" name="message" rows="5" placeholder="궁금한 점이나 상황을 간략하게 적어주세요..."></textarea>
            </div>
            <div class="form-group agree-group">
              <label class="checkbox-item agree-inline">
                <input type="checkbox" id="field_agree" required />
                <span>개인정보 수집 및 이용에 동의합니다 <strong>(필수)</strong></span>
              </label>
              <a href="/privacy" class="agree-detail-link" target="_blank">내용 보기</a>
            </div>
            <button type="submit" class="btn btn-primary btn-full" id="submitBtn">
              <i class="fas fa-paper-plane"></i> 상담 신청하기
            </button>
            <div id="sendError" style="display:none" class="form-error">
              <i class="fas fa-exclamation-circle"></i>
              <span id="sendErrorMsg">전송 중 오류가 발생했습니다. 전화(1588-9999)로 연락해 주세요.</span>
            </div>
          </form>
          <div id="formSuccess" style="display:none" class="form-success">
            <i class="fas fa-check-circle"></i>
            <h3>상담 신청이 완료되었습니다!</h3>
            <p>2시간 내에 연락드리겠습니다. 긴급 상황이시면 1588-9999로 전화해 주세요.</p>
          </div>
        </div>
        <div class="contact-info">
          <h2>연락처 정보</h2>
          <div class="contact-info-items">
            <div class="contact-info-item">
              <i class="fas fa-phone"></i>
              <div>
                <strong>전화 상담</strong>
                <p>1588-9999</p>
                <small>24시간 365일 운영</small>
              </div>
            </div>
            <div class="contact-info-item">
              <i class="fas fa-comment"></i>
              <div>
                <strong>카카오톡 채널</strong>
                <p>@위드엔딩</p>
                <small>채팅 상담 가능</small>
              </div>
            </div>
            <div class="contact-info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <strong>이메일</strong>
                <p>memorialcastles@gmail.com</p>
                <small>24시간 접수</small>
              </div>
            </div>
            <div class="contact-info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <strong>사무소 위치</strong>
                <p>인천광역시 부평구 서달로298번길 50, 2층(청천동)</p>
                <small>방문 상담 가능 (예약 필수)</small>
              </div>
            </div>
          </div>
          <div class="kakao-btn-wrap">
            <a href="#" class="btn btn-kakao btn-full">
              <i class="fas fa-comment"></i> 카카오톡 채널 상담
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script src="/static/main.js"></script>
  <script src="/static/contact.js"></script>
</body>
</html>`)
})

// ─── GUIDE PAGE ──────────────────────────────────────────────────────────────
app.get('/guide', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>웰다잉 가이드 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link active">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <section class="page-hero guide-hero">
    <div class="page-hero-content">
      <span class="section-tag">웰다잉 가이드</span>
      <h1>잘 살기 위해<br /><span class="accent">잘 마무리하는 법</span></h1>
      <p>죽음을 미리 준비하는 것은 삶을 더 깊이 사랑하는 방법입니다.</p>
    </div>
  </section>

  <section class="section-padding">
    <div class="container">
      <div class="guide-grid">
        <div class="guide-card">
          <div class="guide-cat">엔딩노트</div>
          <h3>엔딩노트 작성법 완전 가이드</h3>
          <p>나의 마지막 메시지를 남기는 방법. 법적 효력이 없어도 가족에게 가장 소중한 선물이 됩니다.</p>
          <div class="guide-meta"><span>📖 10분 읽기</span><span>⭐ 인기</span></div>
          <a href="/guide/ending-note" class="guide-link">읽기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="guide-card">
          <div class="guide-cat">무빈소 장례</div>
          <h3>무빈소 장례, 불효가 아닙니다</h3>
          <p>무빈소 장례에 대한 오해와 진실. 합리적 선택이 고인에 대한 진심 어린 예의입니다.</p>
          <div class="guide-meta"><span>📖 8분 읽기</span><span>🔥 최신</span></div>
          <a href="/guide/no-funeral-hall" class="guide-link">읽기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="guide-card">
          <div class="guide-cat">상속·증여</div>
          <h3>상속세 절세의 황금 타이밍</h3>
          <p>10년 단위 증여 면제 한도를 최대한 활용하는 전략. 미리 알수록 더 많이 아낍니다.</p>
          <div class="guide-meta"><span>📖 15분 읽기</span><span>💡 전문가 추천</span></div>
          <a href="/guide/inheritance-tax" class="guide-link">읽기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="guide-card">
          <div class="guide-cat">사전 의료지시</div>
          <h3>사전 연명의료 의향서 작성 가이드</h3>
          <p>스스로의 의료 결정권을 지키는 방법. 작성 절차와 법적 효력을 안내합니다.</p>
          <div class="guide-meta"><span>📖 12분 읽기</span><span>📋 필수 정보</span></div>
          <a href="/guide/advance-directive" class="guide-link">읽기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="guide-card">
          <div class="guide-cat">그리프케어</div>
          <h3>사별 후 애도, 혼자 감당하지 마세요</h3>
          <p>상실의 슬픔을 건강하게 통과하는 방법. 전문 그리프케어 상담사의 안내.</p>
          <div class="guide-meta"><span>📖 10분 읽기</span><span>💚 정서 지원</span></div>
          <a href="/guide/grief-care" class="guide-link">읽기 <i class="fas fa-arrow-right"></i></a>
        </div>
        <div class="guide-card">
          <div class="guide-cat">디지털 유산</div>
          <h3>디지털 자산, 죽음 이후에는?</h3>
          <p>SNS 계정, 암호화폐, 구독 서비스... 디지털 유산을 정리하는 완전한 체크리스트.</p>
          <div class="guide-meta"><span>📖 7분 읽기</span><span>📱 현대인 필수</span></div>
          <a href="/guide/digital-legacy" class="guide-link">읽기 <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="/static/main.js"></script>
</body>
</html>`)
})

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
app.get('/about', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>회사소개 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link active">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>

  <section class="page-hero about-hero">
    <div class="page-hero-content">
      <span class="section-tag">회사소개</span>
      <h1>죽음을 바꿔<br /><span class="accent">삶을 완성합니다</span></h1>
      <p>위드엔딩은 장례업계의 불투명함에 맞서 투명하고 존엄한 마무리를 만들어갑니다.</p>
    </div>
  </section>

  <section class="section-padding">
    <div class="container">
      <div class="about-mission">
        <div class="about-mission-text">
          <span class="section-tag">미션</span>
          <h2>"모든 사람은 존엄하게<br />마무리할 권리가 있습니다"</h2>
          <p>수십 년간 장례업계는 슬픔에 빠진 가족을 대상으로 불투명한 가격과 추가 비용을 청구해 왔습니다. 위드엔딩은 이 구조를 바꿉니다.</p>
          <p>후불 정산, 투명한 가격, 실명제 전문가. 이 세 가지로 장례업계의 신뢰를 회복하겠습니다.</p>
        </div>
        <div class="about-values">
          <div class="value-item">
            <span class="value-icon">💚</span>
            <div>
              <h4>투명성</h4>
              <p>모든 비용을 사전에 공개합니다. 현장에서 추가 청구는 없습니다.</p>
            </div>
          </div>
          <div class="value-item">
            <span class="value-icon">🤝</span>
            <div>
              <h4>신뢰성</h4>
              <p>실명제 전문가가 끝까지 책임집니다.</p>
            </div>
          </div>
          <div class="value-item">
            <span class="value-icon">🌱</span>
            <div>
              <h4>사회적 가치</h4>
              <p>사회적경제 생태계와 연계하여 공동체 가치를 창출합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-padding bg-light">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">연혁</span>
        <h2 class="section-title">위드엔딩의 발자국</h2>
      </div>
      <div class="timeline">
        <div class="tl-item">
          <div class="tl-year">2023</div>
          <div class="tl-content">
            <h4>창업 및 서비스 기획</h4>
            <p>사회적경제센터와의 협업으로 후불장례 서비스 모델 개발 시작</p>
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-year">2024</div>
          <div class="tl-content">
            <h4>파일럿 서비스 론칭</h4>
            <p>수도권 50건 파일럿 서비스 완료. 고객 만족도 98% 달성</p>
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-year">2025</div>
          <div class="tl-content">
            <h4>위드 멤버십 론칭</h4>
            <p>자산관리 통합 구독 서비스 출시. 전문가 네트워크 127명 구축</p>
          </div>
        </div>
        <div class="tl-item active-tl">
          <div class="tl-year">2026</div>
          <div class="tl-content">
            <h4>전국 서비스 확대</h4>
            <p>누적 1,247건 달성. 전국 서비스망 구축 완료</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:15889999" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="/static/main.js"></script>
</body>
</html>`)
})

// ─── API ─────────────────────────────────────────────────────────────────────
app.post('/api/contact', async (c) => {
  const body = await c.req.json()
  return c.json({ success: true, message: '상담 신청이 접수되었습니다.', data: body })
})

app.get('/api/calculate', (c) => {
  const pkg = c.req.query('package') || 'basic'
  const membership = c.req.query('membership') || 'none'
  const months = parseInt(c.req.query('months') || '12')

  const basePrice: Record<string, number> = { basic: 3900000, standard: 4900000, premium: 5900000 }
  const discountRate: Record<string, number> = { none: 0, lite: 0.05, standard: 0.10, family: 0.15 }
  const monthlyBenefit: Record<string, number> = { none: 0, lite: 6900, standard: 19350, family: 49800 }

  const base = basePrice[pkg] || 3900000
  const discount = base * (discountRate[membership] || 0)
  const accum = monthlyBenefit[membership] * months
  const total = Math.max(base - discount - accum, base * 0.5)

  return c.json({ base, discount, accum, total: Math.round(total) })
})

export default app
