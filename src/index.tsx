import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { jwt, sign, verify } from 'hono/jwt'

// ─── Bindings 타입 ────────────────────────────────────────────────────────────
type Bindings = { DB: D1Database }
type Variables = { userId?: number; userRole?: string; userEmail?: string; userName?: string }

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// ─── 전역 CORS ────────────────────────────────────────────────────────────────
app.use('/api/*', cors())

// ─── 유틸: 간단 SHA-256 (Web Crypto API) ─────────────────────────────────────
async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

// ─── 유틸: JWT 시크릿 (환경변수 없으면 기본값 사용) ───────────────────────────
const JWT_SECRET = 'withendings-secret-2026-change-in-production'

// ─── 미들웨어: JWT 인증 (선택적) ──────────────────────────────────────────────
async function authMiddleware(c: any, next: any) {
  const auth = c.req.header('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : c.req.header('x-auth-token') || ''
  if (token) {
    try {
      const payload = await verify(token, JWT_SECRET) as any
      c.set('userId',    payload.userId)
      c.set('userRole',  payload.role)
      c.set('userEmail', payload.email)
      c.set('userName',  payload.name)
    } catch {}
  }
  await next()
}

// ─── 미들웨어: 로그인 필수 ────────────────────────────────────────────────────
async function requireAuth(c: any, next: any) {
  await authMiddleware(c, next)
  if (!c.get('userId')) {
    return c.json({ success: false, message: '로그인이 필요합니다.' }, 401)
  }
}

// ─── 미들웨어: 관리자 필수 ────────────────────────────────────────────────────
async function requireAdmin(c: any, next: any) {
  await authMiddleware(c, next)
  if (c.get('userRole') !== 'admin') {
    return c.json({ success: false, message: '관리자 권한이 필요합니다.' }, 403)
  }
}

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
        <strong>24시간 365일</strong>&nbsp;1877-5147
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
          <a href="tel:18775147" class="btn btn-emergency-big pulse-btn">
            <i class="fas fa-phone-alt"></i> 1877-5147
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
          <p><i class="fas fa-phone"></i> 1877-5147</p>
          <p><i class="fas fa-clock"></i> 24시간 365일</p>
          <p><i class="fas fa-envelope"></i> memorialcastles@gmail.com</p>
          <p><i class="fas fa-map-marker-alt"></i> 인천광역시 부평구 서달로298번길 50, 2층(청천동)</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
          <a href="/legal">법적 고지</a>
        </div>
        <p class="footer-copy">
          ⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료이며, 장례비를 선납하는 상조가 아닙니다.
        </p>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn" aria-label="긴급상담">
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
          <a href="tel:18775147" class="btn btn-emergency btn-full mt-8">
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

  <!-- 운구의전 HERO -->
  <section class="ungu-hero">
    <div class="container">
      <div class="ungu-hero-inner">
        <div class="ungu-hero-text">
          <span class="section-tag-white">메모리얼캐슬 운구의전</span>
          <h2>태어남이 축복이었듯,<br /><em>떠나는 길도 존귀해야 합니다</em></h2>
          <p class="ungu-sub">한 사람의 생이 완성되는 순간,<br />메모리얼캐슬은 그 존엄을 끝까지 지켜드립니다</p>
          <p class="ungu-body">발인에서 장지까지 이어지는 그 길은, 단순한 이동이 아니라 한 생이 살아온 무게를 마지막으로 배웅하는 시간입니다. 전문 장례지도사가 처음부터 끝까지 직접 동행하며, 고인의 걸음 하나하나에 예(禮)를 다합니다. 메모리얼캐슬은 고인과 유가족 모두를 위한 품격 있는 운구의전을 정성껏 약속드립니다.</p>
        </div>
        <div class="ungu-hero-icon">🎌</div>
      </div>
    </div>
  </section>

  <!-- 운구의전 POINT 4 -->
  <section class="ungu-point-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">운구의전 서비스</span>
        <h2 class="section-title">운구의전 Point 4</h2>
        <p class="section-sub">메모리얼캐슬이 제공하는 4가지 핵심 가치</p>
      </div>
      <div class="ungu-grid">
        <div class="ungu-card">
          <span class="ungu-num">01</span>
          <div class="ungu-icon-wrap">💰</div>
          <h4>합리적인 비용</h4>
          <div class="ungu-card-divider"></div>
          <p>품격 높은 운구의전 서비스를 메모리얼캐슬에서 직접 진행하여 합리적인 비용으로 제공합니다.</p>
        </div>
        <div class="ungu-card">
          <span class="ungu-num">02</span>
          <div class="ungu-icon-wrap">🚗</div>
          <h4>전문적인 운구의전</h4>
          <div class="ungu-card-divider"></div>
          <p>장례 전문 지식을 갖춘 장례지도사가 정성껏 예를 다하여 직접 운구의전을 진행합니다.</p>
        </div>
        <div class="ungu-card">
          <span class="ungu-num">03</span>
          <div class="ungu-icon-wrap">📋</div>
          <h4>고객 맞춤형</h4>
          <div class="ungu-card-divider"></div>
          <p>장례식장 검색부터 화장·매장 및 필요 인원까지 선택 가능한 고객 맞춤형 예약 시스템입니다.</p>
        </div>
        <div class="ungu-card">
          <span class="ungu-num">04</span>
          <div class="ungu-icon-wrap">📅</div>
          <h4>간편 예약 신청</h4>
          <div class="ungu-card-divider"></div>
          <p>발인 전날 간편 예약으로 진행, 가입 없이 누구나 쉽고 간편하게 예약 신청할 수 있습니다.</p>
        </div>
      </div>
      <div style="text-align:center; margin-top:36px;">
        <a href="/contact" class="btn btn-primary"><i class="fas fa-phone-alt"></i> 운구의전 상담 신청</a>
      </div>
    </div>
  </section>

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
          <a href="tel:18775147" class="btn btn-emergency-big pulse-btn"><i class="fas fa-phone-alt"></i> 1877-5147</a>
          <p class="emergency-small">24시간 365일 · 주말·공휴일 포함</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료이며, 장례비를 선납하는 상조가 아닙니다.</p>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
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
          <a href="tel:18775147" class="btn btn-emergency-big pulse-btn"><i class="fas fa-phone-alt"></i> 1877-5147</a>
          <p class="emergency-small">24시간 365일 운영</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료이며, 장례비를 선납하는 상조가 아닙니다.</p>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
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
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
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
          <a href="tel:18775147" class="btn btn-emergency-big pulse-btn contact-call-btn">
            <i class="fas fa-phone-alt"></i> 1877-5147
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
              <span id="sendErrorMsg">전송 중 오류가 발생했습니다. 전화(1877-5147)로 연락해 주세요.</span>
            </div>
          </form>
          <div id="formSuccess" style="display:none" class="form-success">
            <i class="fas fa-check-circle"></i>
            <h3>상담 신청이 완료되었습니다!</h3>
            <p>2시간 내에 연락드리겠습니다. 긴급 상황이시면 1877-5147로 전화해 주세요.</p>
          </div>
        </div>
        <div class="contact-info">
          <h2>연락처 정보</h2>
          <div class="contact-info-items">
            <div class="contact-info-item">
              <i class="fas fa-phone"></i>
              <div>
                <strong>전화 상담</strong>
                <p>1877-5147</p>
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
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
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
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
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

  <!-- ① 히어로 -->
  <section class="about-hero-new">
    <div class="container">
      <div class="about-hero-inner">
        <span class="section-tag-gold">회사소개</span>
        <h1 class="about-hero-title">삶이 존귀했듯,<br /><span class="about-hero-accent">마무리도 존귀해야 합니다</span></h1>
        <p class="about-hero-sub">모든 사람은 존엄하게 마무리할 권리가 있습니다.</p>
        <div class="about-hero-divider"></div>
        <p class="about-hero-desc">메모리얼캐슬은 후불 정산, 투명한 가격, 실명제 전문가 — 이 세 가지로 장례업계의 신뢰를 새로 씁니다.</p>
      </div>
    </div>
  </section>

  <!-- ② 배경 — 우리가 이 일을 시작한 이유 -->
  <section class="about-bg-section section-padding">
    <div class="container">
      <div class="about-bg-inner">
        <div class="about-bg-text">
          <span class="section-tag">우리가 이 일을 시작한 이유</span>
          <h2 class="about-bg-title">장례업계의 구조,<br />당연해서는 안 됩니다</h2>
          <p class="about-bg-body">수십 년간 장례업계는 슬픔에 빠진 가족을 대상으로 불투명한 가격과 예상치 못한 추가 비용을 청구해 왔습니다. 메모리얼캐슬은 이 구조가 당연해서는 안 된다고 생각했습니다.</p>
          <p class="about-bg-body">그래서 처음부터 다시 설계했습니다. 후불 정산, 투명한 가격, 실명제 전문가. 그리고 한 사람의 생이 완성되는 마지막 순간을, 인문학의 언어와 기술의 정교함으로 함께 지켜드립니다.</p>
        </div>
        <div class="about-bg-visual">
          <div class="about-bg-card">
            <div class="about-bg-card-icon">📞</div>
            <div class="about-bg-card-text">
              <strong>전화 한 통</strong>
              <span>365일 24시간, 전문 장례지도사가 달려갑니다</span>
            </div>
          </div>
          <div class="about-bg-card">
            <div class="about-bg-card-icon">💳</div>
            <div class="about-bg-card-text">
              <strong>후불 정산</strong>
              <span>이용하신 만큼만, 이후에 정산합니다</span>
            </div>
          </div>
          <div class="about-bg-card">
            <div class="about-bg-card-icon">🏷️</div>
            <div class="about-bg-card-text">
              <strong>투명한 가격</strong>
              <span>현장 추가 청구 없는 사전 공개 가격표</span>
            </div>
          </div>
          <div class="about-bg-card">
            <div class="about-bg-card-icon">🪪</div>
            <div class="about-bg-card-text">
              <strong>실명제 전문가</strong>
              <span>처음부터 끝까지, 한 명의 지도사가 책임집니다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ③ 핵심가치 4개 -->
  <section class="about-values-section section-padding">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">핵심가치</span>
        <h2 class="section-title">메모리얼캐슬이 지키는 네 가지 약속</h2>
        <p class="section-sub">말이 아닌 구조로, 서비스가 아닌 문화로 증명합니다.</p>
      </div>
      <div class="values-grid">
        <div class="value-card">
          <div class="value-card-icon">🤍</div>
          <h3 class="value-card-title">존엄 <span class="value-card-en">Dignity</span></h3>
          <p class="value-card-body">죽음은 끝이 아니라 한 사람의 생이 완성되는 순간입니다. 메모리얼캐슬은 그 순간을 가장 인간적인 방식으로 모십니다. 형식이 아닌 진심으로, 절차가 아닌 예(禮)로.</p>
        </div>
        <div class="value-card">
          <div class="value-card-icon">💚</div>
          <h3 class="value-card-title">투명성 <span class="value-card-en">Transparency</span></h3>
          <p class="value-card-body">모든 비용은 사전에 공개됩니다. 현장에서 추가 청구는 없습니다. 슬픔 앞에서 계산기를 꺼내야 하는 상황을 만들지 않겠습니다.</p>
        </div>
        <div class="value-card">
          <div class="value-card-icon">🧡</div>
          <h3 class="value-card-title">신뢰성 <span class="value-card-en">Accountability</span></h3>
          <p class="value-card-body">10년 이상 경력의 실명제 전문 장례지도사가 처음부터 끝까지 한 분이 책임집니다. 담당자가 바뀌지 않습니다. 연락이 끊기지 않습니다.</p>
        </div>
        <div class="value-card">
          <div class="value-card-icon">🌱</div>
          <h3 class="value-card-title">사회적 가치 <span class="value-card-en">Social Value</span></h3>
          <p class="value-card-body">메모리얼캐슬은 사회적경제 생태계와 연계하여 공동체적 가치를 창출합니다. 장례 서비스를 넘어, 생애 말기 돌봄 문화 전체를 바꾸는 것이 우리의 목표입니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ④ 기술 신뢰 섹션 -->
  <section class="about-tech-section section-padding">
    <div class="container">
      <div class="section-header" style="margin-bottom:48px;">
        <span class="section-tag-white">기술과 존엄</span>
        <h2 class="section-title" style="color:#fff;">메모리얼캐슬은 지금,<br />다음을 준비하고 있습니다</h2>
        <p class="section-sub" style="color:rgba(255,255,255,0.72);">우리는 장례 서비스를 잘 하는 것에서 멈추지 않습니다. 한 사람의 삶을 기록하고, 기억하고, 전달하는 방식 자체를 기술로 정교하게 다듬고 있습니다.</p>
      </div>
      <div class="about-tech-cards">
        <div class="about-tech-card">
          <div class="about-tech-card-icon">🤖</div>
          <h4 class="about-tech-card-title">AI 엔딩노트</h4>
          <p class="about-tech-card-body">나의 가치관과 마지막 메시지를 대화하듯 정리해주는 AI 엔딩노트. 기억이 글이 되고, 글이 유산이 됩니다.</p>
          <span class="about-tech-badge">준비 중</span>
        </div>
        <div class="about-tech-card">
          <div class="about-tech-card-icon">💻</div>
          <h4 class="about-tech-card-title">Death-Tech 플랫폼</h4>
          <p class="about-tech-card-body">상담부터 사후 관리까지 투명하게 연결하는 Death-Tech 플랫폼. 기술이 존엄을 지킬 수 있다고 믿습니다.</p>
          <span class="about-tech-badge">준비 중</span>
        </div>
      </div>
      <div class="about-promise-wrap">
        <h3 class="about-promise-title">메모리얼캐슬의 후불 정산 약속</h3>
        <div class="about-promise-grid">
          <div class="about-promise-card">
            <span class="about-promise-num">01</span>
            <p>가입 절차도,<br /><strong>선불 납입도 없습니다</strong></p>
          </div>
          <div class="about-promise-card">
            <span class="about-promise-num">02</span>
            <p>전화 한 통이면<br /><strong>365일 24시간 달려갑니다</strong></p>
          </div>
          <div class="about-promise-card">
            <span class="about-promise-num">03</span>
            <p>이용하신 만큼만<br /><strong>후불로 정산합니다</strong></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
  <script src="/static/main.js"></script>
</body>
</html>`)
})

// ════════════════════════════════════════════════════════════════
//  API — 상담신청 (DB 저장)
// ════════════════════════════════════════════════════════════════
app.post('/api/contact', authMiddleware, async (c) => {
  try {
    const body = await c.req.json()
    const { name, phone, email='', service_type='', message='' } = body
    if (!name || !phone) return c.json({ success: false, message: '이름과 연락처는 필수입니다.' }, 400)
    const userId = c.get('userId') || null
    await c.env.DB.prepare(
      `INSERT INTO consultations (name,phone,email,service_type,message,user_id) VALUES (?,?,?,?,?,?)`
    ).bind(name, phone, email, service_type, message, userId).run()
    return c.json({ success: true, message: '상담 신청이 접수되었습니다. 빠르게 연락드리겠습니다.' })
  } catch (e: any) {
    return c.json({ success: false, message: 'DB 오류: ' + e.message }, 500)
  }
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

// ════════════════════════════════════════════════════════════════
//  AUTH API — 회원가입 / 로그인 / 내 정보 / 로그아웃
// ════════════════════════════════════════════════════════════════

/** 회원가입 */
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name, phone='' } = await c.req.json()
    if (!email || !password || !name) return c.json({ success:false, message:'이메일·비밀번호·이름은 필수입니다.' }, 400)
    if (password.length < 6) return c.json({ success:false, message:'비밀번호는 6자 이상이어야 합니다.' }, 400)
    const exist = await c.env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first()
    if (exist) return c.json({ success:false, message:'이미 사용 중인 이메일입니다.' }, 409)
    const hashed = await hashPassword(password)
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email,password,name,phone) VALUES (?,?,?,?)'
    ).bind(email, hashed, name, phone).run()
    const token = await sign({ userId: result.meta.last_row_id, email, name, role:'user', exp: Math.floor(Date.now()/1000)+86400*30 }, JWT_SECRET)
    return c.json({ success:true, message:'회원가입이 완료되었습니다.', token, user:{ id:result.meta.last_row_id, email, name, role:'user' } })
  } catch(e:any) { return c.json({ success:false, message:'서버 오류: '+e.message }, 500) }
})

/** 로그인 */
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) return c.json({ success:false, message:'이메일과 비밀번호를 입력하세요.' }, 400)
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE email=? AND is_active=1').bind(email).first() as any
    if (!user) return c.json({ success:false, message:'이메일 또는 비밀번호가 올바르지 않습니다.' }, 401)
    const hashed = await hashPassword(password)
    if (user.password !== hashed) return c.json({ success:false, message:'이메일 또는 비밀번호가 올바르지 않습니다.' }, 401)
    const token = await sign({ userId: user.id, email: user.email, name: user.name, role: user.role, exp: Math.floor(Date.now()/1000)+86400*30 }, JWT_SECRET)
    return c.json({ success:true, message:'로그인 성공', token, user:{ id:user.id, email:user.email, name:user.name, role:user.role } })
  } catch(e:any) { return c.json({ success:false, message:'서버 오류: '+e.message }, 500) }
})

/** 내 정보 조회 */
app.get('/api/auth/me', authMiddleware, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json({ success:false, message:'로그인이 필요합니다.' }, 401)
  const user = await c.env.DB.prepare('SELECT id,email,name,phone,role,created_at FROM users WHERE id=?').bind(userId).first()
  return c.json({ success:true, user })
})

// ════════════════════════════════════════════════════════════════
//  BOARD API — 게시판
// ════════════════════════════════════════════════════════════════

/** 카테고리 목록 */
app.get('/api/board/categories', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM board_categories WHERE is_active=1 ORDER BY sort_order').all()
  return c.json({ success:true, categories: rows.results })
})

/** 게시글 목록 (페이지네이션) */
app.get('/api/board/posts', authMiddleware, async (c) => {
  const slug     = c.req.query('category') || ''
  const page     = Math.max(1, parseInt(c.req.query('page') || '1'))
  const pageSize = 15
  const offset   = (page - 1) * pageSize
  let categoryId: number | null = null
  if (slug) {
    const cat = await c.env.DB.prepare('SELECT id FROM board_categories WHERE slug=?').bind(slug).first() as any
    if (cat) categoryId = cat.id
  }
  const where = categoryId ? 'WHERE p.category_id=?' : 'WHERE 1=1'
  const params: any[] = categoryId ? [categoryId] : []
  const countRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM posts p ${where} AND (p.is_private=0 OR p.user_id=?)`
  ).bind(...params, c.get('userId') || 0).first() as any
  const total = countRow?.cnt || 0
  const posts = await c.env.DB.prepare(
    `SELECT p.id,p.title,p.is_notice,p.is_private,p.view_count,p.created_at,
            u.name as author_name, bc.name as category_name, bc.slug as category_slug,
            (SELECT COUNT(*) FROM comments WHERE post_id=p.id) as comment_count
     FROM posts p
     JOIN users u ON p.user_id=u.id
     JOIN board_categories bc ON p.category_id=bc.id
     ${where} AND (p.is_private=0 OR p.user_id=?)
     ORDER BY p.is_notice DESC, p.created_at DESC
     LIMIT ? OFFSET ?`
  ).bind(...params, c.get('userId') || 0, pageSize, offset).all()
  return c.json({ success:true, posts: posts.results, total, page, pageSize, totalPages: Math.ceil(total/pageSize) })
})

/** 게시글 작성 */
app.post('/api/board/posts', authMiddleware, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json({ success:false, message:'로그인이 필요합니다.' }, 401)
  const { category_id, title, content, is_private=0 } = await c.req.json()
  if (!category_id || !title || !content) return c.json({ success:false, message:'카테고리·제목·내용은 필수입니다.' }, 400)
  const result = await c.env.DB.prepare(
    'INSERT INTO posts (category_id,user_id,title,content,is_private) VALUES (?,?,?,?,?)'
  ).bind(category_id, userId, title, content, is_private ? 1 : 0).run()
  return c.json({ success:true, id: result.meta.last_row_id })
})

/** 게시글 상세 */
app.get('/api/board/posts/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'))
  const post = await c.env.DB.prepare(
    `SELECT p.*,u.name as author_name,bc.name as category_name,bc.slug as category_slug
     FROM posts p JOIN users u ON p.user_id=u.id JOIN board_categories bc ON p.category_id=bc.id
     WHERE p.id=?`
  ).bind(id).first() as any
  if (!post) return c.json({ success:false, message:'게시글을 찾을 수 없습니다.' }, 404)
  if (post.is_private && post.user_id !== c.get('userId') && c.get('userRole') !== 'admin') {
    return c.json({ success:false, message:'비밀글입니다.' }, 403)
  }
  await c.env.DB.prepare('UPDATE posts SET view_count=view_count+1 WHERE id=?').bind(id).run()
  const comments = await c.env.DB.prepare(
    'SELECT cm.*,u.name as author_name FROM comments cm JOIN users u ON cm.user_id=u.id WHERE cm.post_id=? ORDER BY cm.created_at'
  ).bind(id).all()
  return c.json({ success:true, post, comments: comments.results })
})

/** 게시글 수정 */
app.put('/api/board/posts/:id', authMiddleware, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json({ success:false, message:'로그인이 필요합니다.' }, 401)
  const id = parseInt(c.req.param('id'))
  const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id=?').bind(id).first() as any
  if (!post) return c.json({ success:false, message:'게시글 없음' }, 404)
  if (post.user_id !== userId && c.get('userRole') !== 'admin') return c.json({ success:false, message:'권한 없음' }, 403)
  const { title, content, is_private } = await c.req.json()
  await c.env.DB.prepare('UPDATE posts SET title=?,content=?,is_private=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(title, content, is_private ? 1 : 0, id).run()
  return c.json({ success:true })
})

/** 게시글 삭제 */
app.delete('/api/board/posts/:id', authMiddleware, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json({ success:false, message:'로그인이 필요합니다.' }, 401)
  const id = parseInt(c.req.param('id'))
  const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id=?').bind(id).first() as any
  if (!post) return c.json({ success:false, message:'게시글 없음' }, 404)
  if (post.user_id !== userId && c.get('userRole') !== 'admin') return c.json({ success:false, message:'권한 없음' }, 403)
  await c.env.DB.prepare('DELETE FROM posts WHERE id=?').bind(id).run()
  return c.json({ success:true })
})

/** 댓글 작성 */
app.post('/api/board/posts/:id/comments', authMiddleware, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json({ success:false, message:'로그인이 필요합니다.' }, 401)
  const postId = parseInt(c.req.param('id'))
  const { content } = await c.req.json()
  if (!content) return c.json({ success:false, message:'내용을 입력하세요.' }, 400)
  const result = await c.env.DB.prepare('INSERT INTO comments (post_id,user_id,content) VALUES (?,?,?)').bind(postId, userId, content).run()
  return c.json({ success:true, id: result.meta.last_row_id })
})

/** 댓글 삭제 */
app.delete('/api/board/comments/:id', authMiddleware, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json({ success:false, message:'로그인이 필요합니다.' }, 401)
  const id = parseInt(c.req.param('id'))
  const cm = await c.env.DB.prepare('SELECT * FROM comments WHERE id=?').bind(id).first() as any
  if (!cm) return c.json({ success:false, message:'댓글 없음' }, 404)
  if (cm.user_id !== userId && c.get('userRole') !== 'admin') return c.json({ success:false, message:'권한 없음' }, 403)
  await c.env.DB.prepare('DELETE FROM comments WHERE id=?').bind(id).run()
  return c.json({ success:true })
})

// ════════════════════════════════════════════════════════════════
//  ADMIN API — 관리자 전용
// ════════════════════════════════════════════════════════════════

/** 상담신청 목록 */
app.get('/api/admin/consultations', requireAdmin, async (c) => {
  const status = c.req.query('status') || ''
  const where = status ? 'WHERE status=?' : ''
  const rows = await c.env.DB.prepare(
    `SELECT * FROM consultations ${where} ORDER BY created_at DESC LIMIT 100`
  ).bind(...(status ? [status] : [])).all()
  return c.json({ success:true, consultations: rows.results })
})

/** 상담 상태 변경 */
app.put('/api/admin/consultations/:id', requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  const { status } = await c.req.json()
  await c.env.DB.prepare('UPDATE consultations SET status=? WHERE id=?').bind(status, id).run()
  return c.json({ success:true })
})

/** 회원 목록 */
app.get('/api/admin/users', requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT id,email,name,phone,role,is_active,created_at FROM users ORDER BY created_at DESC LIMIT 200'
  ).all()
  return c.json({ success:true, users: rows.results })
})

/** 회원 활성/비활성 */
app.put('/api/admin/users/:id', requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  const { is_active } = await c.req.json()
  await c.env.DB.prepare('UPDATE users SET is_active=? WHERE id=?').bind(is_active, id).run()
  return c.json({ success:true })
})

/** 전체 게시글 목록 (관리자) */
app.get('/api/admin/posts', requireAdmin, async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT p.id,p.title,p.is_notice,p.is_private,p.view_count,p.created_at,
            u.name as author_name, bc.name as category_name
     FROM posts p JOIN users u ON p.user_id=u.id JOIN board_categories bc ON p.category_id=bc.id
     ORDER BY p.created_at DESC LIMIT 200`
  ).all()
  return c.json({ success:true, posts: rows.results })
})

/** 대시보드 통계 */
app.get('/api/admin/stats', requireAdmin, async (c) => {
  const [users, posts, consultNew, consultAll] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as cnt FROM users WHERE role="user"').first() as Promise<any>,
    c.env.DB.prepare('SELECT COUNT(*) as cnt FROM posts').first() as Promise<any>,
    c.env.DB.prepare('SELECT COUNT(*) as cnt FROM consultations WHERE status="new"').first() as Promise<any>,
    c.env.DB.prepare('SELECT COUNT(*) as cnt FROM consultations').first() as Promise<any>,
  ])
  return c.json({ success:true, stats: {
    totalUsers: users?.cnt || 0,
    totalPosts: posts?.cnt || 0,
    newConsultations: consultNew?.cnt || 0,
    totalConsultations: consultAll?.cnt || 0,
  }})
})

// ════════════════════════════════════════════════════════════════
//  PAGES — 회원가입 / 로그인
// ════════════════════════════════════════════════════════════════

const authNavHTML = `
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩 Memorial Castle" class="nav-logo-img" /></a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="/funeral" class="nav-link">무빈소 후불장례</a></li>
        <li><a href="/membership" class="nav-link">위드 멤버십</a></li>
        <li><a href="/asset" class="nav-link">자산관리</a></li>
        <li><a href="/guide" class="nav-link">웰다잉 가이드</a></li>
        <li><a href="/about" class="nav-link">회사소개</a></li>
        <li><a href="/contact" class="nav-link emergency-nav-btn">📞 24시간 상담</a></li>
      </ul>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
    </div>
  </nav>`

const authFooterHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da580a08f30d94d502ce6d1" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          <a href="https://titanium-neptune-11f.notion.site/3a907b799da5807a88d8c88d5751e5f1" target="_blank" rel="noopener noreferrer">이용약관</a>
        </div>
        <p class="footer-copy">© 2026. 주식회사 메모리얼캐슬. All rights reserved.</p>
      </div>
    </div>
  </footer>`

// 회원가입 페이지
app.get('/register', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>회원가입 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
${authNavHTML}
<main style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:100px 16px 60px;">
  <div class="auth-card">
    <div class="auth-logo"><img src="/static/logo.png" alt="위드엔딩" style="height:48px;" /></div>
    <h2 class="auth-title">회원가입</h2>
    <p class="auth-sub">위드엔딩 커뮤니티 회원이 되어주세요</p>
    <div id="authMsg" class="auth-msg" style="display:none;"></div>
    <form id="registerForm" class="auth-form">
      <div class="auth-field">
        <label>이름 <span class="req">*</span></label>
        <input type="text" id="regName" placeholder="홍길동" required />
      </div>
      <div class="auth-field">
        <label>이메일 <span class="req">*</span></label>
        <input type="email" id="regEmail" placeholder="example@email.com" required />
      </div>
      <div class="auth-field">
        <label>비밀번호 <span class="req">*</span> <small>(6자 이상)</small></label>
        <input type="password" id="regPw" placeholder="••••••••" required />
      </div>
      <div class="auth-field">
        <label>비밀번호 확인 <span class="req">*</span></label>
        <input type="password" id="regPw2" placeholder="••••••••" required />
      </div>
      <div class="auth-field">
        <label>연락처</label>
        <input type="tel" id="regPhone" placeholder="010-0000-0000" />
      </div>
      <button type="submit" class="btn btn-primary auth-submit" id="regBtn">
        <i class="fas fa-user-plus"></i> 회원가입
      </button>
    </form>
    <p class="auth-switch">이미 계정이 있으신가요? <a href="/login">로그인</a></p>
  </div>
</main>
${authFooterHTML}
<script src="/static/main.js"></script>
<script>
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('regBtn');
  const msg = document.getElementById('authMsg');
  const pw = document.getElementById('regPw').value;
  const pw2 = document.getElementById('regPw2').value;
  if (pw !== pw2) { showMsg('비밀번호가 일치하지 않습니다.', 'error'); return; }
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: pw,
        phone: document.getElementById('regPhone').value
      })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('we_token', data.token);
      localStorage.setItem('we_user', JSON.stringify(data.user));
      showMsg('🎉 회원가입 완료! 잠시 후 커뮤니티로 이동합니다.', 'success');
      setTimeout(() => location.href = '/board', 1500);
    } else {
      showMsg(data.message, 'error');
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus"></i> 회원가입';
    }
  } catch(e) { showMsg('네트워크 오류가 발생했습니다.', 'error'); btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus"></i> 회원가입'; }
});
function showMsg(text, type) {
  const el = document.getElementById('authMsg');
  el.textContent = text; el.className = 'auth-msg auth-msg-' + type; el.style.display = 'block';
}
</script>
</body></html>`)
})

// 로그인 페이지
app.get('/login', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>로그인 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
${authNavHTML}
<main style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:100px 16px 60px;">
  <div class="auth-card">
    <div class="auth-logo"><img src="/static/logo.png" alt="위드엔딩" style="height:48px;" /></div>
    <h2 class="auth-title">로그인</h2>
    <p class="auth-sub">위드엔딩 커뮤니티에 오신 것을 환영합니다</p>
    <div id="authMsg" class="auth-msg" style="display:none;"></div>
    <form id="loginForm" class="auth-form">
      <div class="auth-field">
        <label>이메일 <span class="req">*</span></label>
        <input type="email" id="loginEmail" placeholder="example@email.com" required />
      </div>
      <div class="auth-field">
        <label>비밀번호 <span class="req">*</span></label>
        <input type="password" id="loginPw" placeholder="••••••••" required />
      </div>
      <button type="submit" class="btn btn-primary auth-submit" id="loginBtn">
        <i class="fas fa-sign-in-alt"></i> 로그인
      </button>
    </form>
    <p class="auth-switch">계정이 없으신가요? <a href="/register">회원가입</a></p>
  </div>
</main>
${authFooterHTML}
<script src="/static/main.js"></script>
<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPw').value })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('we_token', data.token);
      localStorage.setItem('we_user', JSON.stringify(data.user));
      const dest = new URLSearchParams(location.search).get('redirect') || (data.user.role==='admin' ? '/admin' : '/board');
      location.href = dest;
    } else {
      showMsg(data.message, 'error');
      btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
    }
  } catch(e) { showMsg('네트워크 오류', 'error'); btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인'; }
});
function showMsg(text, type) {
  const el = document.getElementById('authMsg');
  el.textContent = text; el.className = 'auth-msg auth-msg-' + type; el.style.display = 'block';
}
</script>
</body></html>`)
})

// ════════════════════════════════════════════════════════════════
//  PAGE — 게시판 목록
// ════════════════════════════════════════════════════════════════
app.get('/board', (c) => {
  const category = c.req.query('category') || 'free'
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>커뮤니티 게시판 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
${authNavHTML}
<section class="page-hero" style="background:linear-gradient(135deg,#0d1b35 0%,#1a2f5a 100%);padding:80px 0 60px;">
  <div class="page-hero-content">
    <span class="section-tag-white">커뮤니티</span>
    <h1 style="color:#fff;font-size:2.2rem;margin-bottom:12px;">위드엔딩 커뮤니티</h1>
    <p style="color:rgba(255,255,255,.7);">후기·정보·이야기를 자유롭게 나눠주세요</p>
  </div>
</section>
<main class="section-padding">
  <div class="container">
    <!-- 상단: 로그인 상태 + 글쓰기 버튼 -->
    <div class="board-topbar">
      <div id="userStatus" class="board-user-status"></div>
      <button id="writeBtn" class="btn btn-primary" onclick="goWrite()" style="display:none;">
        <i class="fas fa-pen"></i> 글쓰기
      </button>
    </div>
    <!-- 카테고리 탭 -->
    <div class="board-tabs" id="boardTabs"></div>
    <!-- 게시글 목록 -->
    <div id="boardList" class="board-list-wrap">
      <div class="board-loading"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>
    </div>
    <!-- 페이지네이션 -->
    <div id="boardPaging" class="board-paging"></div>
  </div>
</main>
${authFooterHTML}
<a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
<script src="/static/main.js"></script>
<script>
const token = localStorage.getItem('we_token');
const user  = JSON.parse(localStorage.getItem('we_user') || 'null');
let currentCategory = '${category}';
let currentPage = 1;

// 사용자 상태 표시
const statusEl = document.getElementById('userStatus');
const writeBtn = document.getElementById('writeBtn');
if (user) {
  statusEl.innerHTML = '<i class="fas fa-user-circle"></i> ' + user.name + '님 환영합니다 &nbsp;<button class="btn-text-sm" onclick="logout()">로그아웃</button>' + (user.role==='admin' ? ' &nbsp;<a href="/admin" class="btn-text-sm admin-badge"><i class="fas fa-cog"></i> 관리자</a>' : '');
  writeBtn.style.display = 'inline-flex';
} else {
  statusEl.innerHTML = '<a href="/login?redirect=/board" class="btn btn-sm btn-outline"><i class="fas fa-sign-in-alt"></i> 로그인</a> &nbsp;<a href="/register" class="btn btn-sm btn-primary"><i class="fas fa-user-plus"></i> 회원가입</a>';
}

function logout() { localStorage.removeItem('we_token'); localStorage.removeItem('we_user'); location.reload(); }
function goWrite() {
  if (!user) { location.href='/login?redirect=/board/write'; return; }
  location.href='/board/write?category='+currentCategory;
}

// 카테고리 탭 로드
fetch('/api/board/categories').then(r=>r.json()).then(data=>{
  const tabs = document.getElementById('boardTabs');
  tabs.innerHTML = data.categories.map(cat=>
    '<button class="board-tab'+(cat.slug===currentCategory?' active':'')+'" onclick="switchCat(\''+cat.slug+'\')">'+cat.name+'</button>'
  ).join('');
  loadPosts();
});

function switchCat(slug) {
  currentCategory = slug; currentPage = 1;
  document.querySelectorAll('.board-tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  loadPosts();
}

function loadPosts() {
  const listEl = document.getElementById('boardList');
  listEl.innerHTML = '<div class="board-loading"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div>';
  const headers = token ? {'Authorization':'Bearer '+token} : {};
  fetch('/api/board/posts?category='+currentCategory+'&page='+currentPage, {headers})
    .then(r=>r.json()).then(data=>{
      if (!data.posts || !data.posts.length) {
        listEl.innerHTML = '<div class="board-empty"><i class="fas fa-inbox"></i><p>아직 게시글이 없습니다.<br/>첫 번째 글을 남겨보세요!</p></div>';
        document.getElementById('boardPaging').innerHTML = '';
        return;
      }
      listEl.innerHTML = '<table class="board-table"><thead><tr><th style="width:60px">번호</th><th>제목</th><th style="width:90px">작성자</th><th style="width:90px">날짜</th><th style="width:60px">조회</th></tr></thead><tbody>'
        + data.posts.map((p,i)=>{
            const num = p.is_notice ? '<span class="badge-notice">공지</span>' : (data.total - (currentPage-1)*data.pageSize - i);
            const lock = p.is_private ? ' 🔒' : '';
            const cmts = p.comment_count > 0 ? ' <span class="badge-cmt">['+p.comment_count+']</span>' : '';
            const date = p.created_at ? p.created_at.substring(0,10) : '';
            return '<tr class="'+(p.is_notice?'notice-row':'')+'"><td class="td-num">'+num+'</td><td class="td-title"><a href="/board/'+p.id+'">'+p.title+lock+cmts+'</a></td><td class="td-author">'+p.author_name+'</td><td class="td-date">'+date+'</td><td class="td-view">'+p.view_count+'</td></tr>';
          }).join('')
        + '</tbody></table>';
      // 페이지네이션
      const pagingEl = document.getElementById('boardPaging');
      if (data.totalPages > 1) {
        let html = '';
        for (let i=1; i<=data.totalPages; i++) {
          html += '<button class="paging-btn'+(i===currentPage?' active':'')+'" onclick="gotoPage('+i+')">'+i+'</button>';
        }
        pagingEl.innerHTML = html;
      } else { pagingEl.innerHTML = ''; }
    }).catch(()=>{ listEl.innerHTML = '<div class="board-empty"><i class="fas fa-exclamation-circle"></i><p>불러오기 실패. 새로고침 해주세요.</p></div>'; });
}

function gotoPage(p) { currentPage = p; loadPosts(); window.scrollTo(0,0); }
</script>
</body></html>`)
})

// ════════════════════════════════════════════════════════════════
//  PAGE — 게시글 작성
// ════════════════════════════════════════════════════════════════
app.get('/board/write', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>글쓰기 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
${authNavHTML}
<main style="padding:100px 16px 60px;">
  <div class="container" style="max-width:800px;">
    <div class="write-header">
      <h2 class="write-title"><i class="fas fa-pen"></i> 새 글 쓰기</h2>
      <a href="/board" class="btn btn-outline btn-sm"><i class="fas fa-arrow-left"></i> 목록으로</a>
    </div>
    <div id="writeMsg" class="auth-msg" style="display:none;"></div>
    <div id="writeAuth">
      <p style="text-align:center;padding:40px;color:#888;">로그인 후 글을 작성할 수 있습니다. <a href="/login?redirect=/board/write">로그인하기</a></p>
    </div>
    <form id="writeForm" class="write-form" style="display:none;">
      <div class="auth-field">
        <label>카테고리 <span class="req">*</span></label>
        <select id="wCat" class="write-select" required></select>
      </div>
      <div class="auth-field">
        <label>제목 <span class="req">*</span></label>
        <input type="text" id="wTitle" placeholder="제목을 입력하세요" required />
      </div>
      <div class="auth-field">
        <label>내용 <span class="req">*</span></label>
        <textarea id="wContent" class="write-textarea" placeholder="내용을 자유롭게 작성해주세요." required></textarea>
      </div>
      <div class="write-options">
        <label class="checkbox-label">
          <input type="checkbox" id="wPrivate" /> 비밀글로 작성
        </label>
      </div>
      <div class="write-btns">
        <a href="/board" class="btn btn-outline">취소</a>
        <button type="submit" class="btn btn-primary" id="wSubmitBtn"><i class="fas fa-save"></i> 등록하기</button>
      </div>
    </form>
  </div>
</main>
${authFooterHTML}
<script src="/static/main.js"></script>
<script>
const token = localStorage.getItem('we_token');
const user  = JSON.parse(localStorage.getItem('we_user') || 'null');
const defaultCat = new URLSearchParams(location.search).get('category') || 'free';

if (!user || !token) {
  document.getElementById('writeAuth').style.display = 'block';
} else {
  document.getElementById('writeAuth').style.display = 'none';
  document.getElementById('writeForm').style.display = 'block';
  fetch('/api/board/categories').then(r=>r.json()).then(data=>{
    const sel = document.getElementById('wCat');
    sel.innerHTML = data.categories.filter(c=>c.slug!=='notice'||user.role==='admin').map(c=>
      '<option value="'+c.id+'"'+(c.slug===defaultCat?' selected':'')+'>'+c.name+'</option>'
    ).join('');
  });
}

document.getElementById('writeForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('wSubmitBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 등록 중...';
  try {
    const res = await fetch('/api/board/posts', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: JSON.stringify({
        category_id: parseInt(document.getElementById('wCat').value),
        title: document.getElementById('wTitle').value,
        content: document.getElementById('wContent').value,
        is_private: document.getElementById('wPrivate').checked ? 1 : 0
      })
    });
    const data = await res.json();
    if (data.success) { location.href = '/board/' + data.id; }
    else { showMsg(data.message, 'error'); btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> 등록하기'; }
  } catch(e) { showMsg('오류 발생', 'error'); btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> 등록하기'; }
});
function showMsg(t,type){ const el=document.getElementById('writeMsg'); el.textContent=t; el.className='auth-msg auth-msg-'+type; el.style.display='block'; }
</script>
</body></html>`)
})

// ════════════════════════════════════════════════════════════════
//  PAGE — 게시글 상세
// ════════════════════════════════════════════════════════════════
app.get('/board/:id', (c) => {
  const id = c.req.param('id')
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>게시글 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
${authNavHTML}
<main style="padding:100px 16px 60px;">
  <div class="container" style="max-width:800px;">
    <div id="postContent"><div class="board-loading"><i class="fas fa-spinner fa-spin"></i> 불러오는 중...</div></div>
    <div id="commentSection" style="display:none;margin-top:40px;">
      <h4 class="comment-title"><i class="fas fa-comments"></i> 댓글 <span id="cmtCount">0</span>개</h4>
      <div id="commentList"></div>
      <div id="commentForm" style="display:none;margin-top:16px;">
        <textarea id="cmtContent" class="write-textarea" style="height:90px;" placeholder="댓글을 입력하세요..."></textarea>
        <div style="text-align:right;margin-top:8px;">
          <button class="btn btn-primary btn-sm" onclick="submitComment()"><i class="fas fa-paper-plane"></i> 댓글 등록</button>
        </div>
      </div>
      <div id="cmtLoginNote" style="display:none;padding:16px;text-align:center;color:#888;font-size:.9rem;">
        <a href="/login?redirect=/board/${id}">로그인</a> 후 댓글을 남길 수 있습니다.
      </div>
    </div>
  </div>
</main>
${authFooterHTML}
<a href="tel:18775147" class="floating-btn pulse-btn"><i class="fas fa-phone-alt"></i><span>긴급상담</span></a>
<script src="/static/main.js"></script>
<script>
const token = localStorage.getItem('we_token');
const user  = JSON.parse(localStorage.getItem('we_user') || 'null');
const postId = ${id};
let postData = null;

const headers = token ? {'Authorization':'Bearer '+token} : {};
fetch('/api/board/posts/'+postId, {headers}).then(r=>r.json()).then(data=>{
  if (!data.success) {
    document.getElementById('postContent').innerHTML = '<div class="board-empty"><i class="fas fa-lock"></i><p>'+data.message+'</p><a href="/board" class="btn btn-outline" style="margin-top:16px;">목록으로</a></div>';
    return;
  }
  postData = data.post;
  const p = data.post;
  const isMine = user && (user.id === p.user_id || user.role === 'admin');
  const date = p.created_at ? p.created_at.substring(0,10) : '';
  document.getElementById('postContent').innerHTML =
    '<div class="post-breadcrumb"><a href="/board">커뮤니티</a> &gt; <a href="/board?category='+p.category_slug+'">'+p.category_name+'</a></div>'
    +'<div class="post-header">'
      +(p.is_notice?'<span class="badge-notice" style="margin-bottom:8px;display:inline-block;">공지</span>':'')
      +'<h2 class="post-title">'+p.title+'</h2>'
      +'<div class="post-meta"><span><i class="fas fa-user"></i> '+p.author_name+'</span><span><i class="fas fa-calendar"></i> '+date+'</span><span><i class="fas fa-eye"></i> '+p.view_count+'</span></div>'
    +'</div>'
    +'<div class="post-body">'+p.content.replace(/\\n/g,'<br/>')+'</div>'
    +'<div class="post-actions">'
      +'<a href="/board?category='+p.category_slug+'" class="btn btn-outline btn-sm"><i class="fas fa-list"></i> 목록</a>'
      +(isMine ? '<button class="btn btn-outline btn-sm" onclick="editPost()"><i class="fas fa-edit"></i> 수정</button><button class="btn btn-sm" style="background:#e74c3c;color:#fff;" onclick="deletePost()"><i class="fas fa-trash"></i> 삭제</button>' : '')
    +'</div>';

  // 댓글
  document.getElementById('commentSection').style.display = 'block';
  renderComments(data.comments);
  document.getElementById('cmtCount').textContent = data.comments.length;
  if (user) { document.getElementById('commentForm').style.display = 'block'; }
  else { document.getElementById('cmtLoginNote').style.display = 'block'; }
});

function renderComments(comments) {
  const el = document.getElementById('commentList');
  if (!comments || !comments.length) { el.innerHTML = '<p style="color:#aaa;font-size:.9rem;padding:12px 0;">아직 댓글이 없습니다.</p>'; return; }
  el.innerHTML = comments.map(cm => {
    const isMine = user && (user.id === cm.user_id || user.role === 'admin');
    const date = cm.created_at ? cm.created_at.substring(0,10) : '';
    return '<div class="comment-item"><div class="comment-header"><span class="comment-author"><i class="fas fa-user-circle"></i> '+cm.author_name+'</span><span class="comment-date">'+date+'</span>'+(isMine?'<button class="btn-del-cmt" onclick="deleteComment('+cm.id+')"><i class="fas fa-times"></i></button>':'')+'</div><p class="comment-body">'+cm.content.replace(/\\n/g,'<br/>')+'</p></div>';
  }).join('');
}

async function submitComment() {
  const content = document.getElementById('cmtContent').value.trim();
  if (!content) return alert('댓글을 입력해주세요.');
  const res = await fetch('/api/board/posts/'+postId+'/comments', {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
    body: JSON.stringify({content})
  });
  const data = await res.json();
  if (data.success) { document.getElementById('cmtContent').value=''; location.reload(); }
  else alert(data.message);
}

async function deleteComment(id) {
  if (!confirm('댓글을 삭제하시겠습니까?')) return;
  const res = await fetch('/api/board/comments/'+id, {method:'DELETE', headers:{'Authorization':'Bearer '+token}});
  const data = await res.json();
  if (data.success) location.reload();
  else alert(data.message);
}

function editPost() { location.href = '/board/edit/'+postId; }
async function deletePost() {
  if (!confirm('게시글을 삭제하시겠습니까?')) return;
  const res = await fetch('/api/board/posts/'+postId, {method:'DELETE', headers:{'Authorization':'Bearer '+token}});
  const data = await res.json();
  if (data.success) { alert('삭제되었습니다.'); location.href = '/board?category='+(postData?.category_slug||'free'); }
  else alert(data.message);
}
</script>
</body></html>`)
})

// ════════════════════════════════════════════════════════════════
//  PAGE — 게시글 수정
// ════════════════════════════════════════════════════════════════
app.get('/board/edit/:id', (c) => {
  const id = c.req.param('id')
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>게시글 수정 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body>
${authNavHTML}
<main style="padding:100px 16px 60px;">
  <div class="container" style="max-width:800px;">
    <div class="write-header">
      <h2 class="write-title"><i class="fas fa-edit"></i> 게시글 수정</h2>
      <a href="/board/${id}" class="btn btn-outline btn-sm"><i class="fas fa-arrow-left"></i> 돌아가기</a>
    </div>
    <div id="editMsg" class="auth-msg" style="display:none;"></div>
    <form id="editForm" class="write-form">
      <div class="auth-field">
        <label>제목 <span class="req">*</span></label>
        <input type="text" id="eTitle" required />
      </div>
      <div class="auth-field">
        <label>내용 <span class="req">*</span></label>
        <textarea id="eContent" class="write-textarea" required></textarea>
      </div>
      <div class="write-options">
        <label class="checkbox-label"><input type="checkbox" id="ePrivate" /> 비밀글</label>
      </div>
      <div class="write-btns">
        <a href="/board/${id}" class="btn btn-outline">취소</a>
        <button type="submit" class="btn btn-primary" id="eSubmitBtn"><i class="fas fa-save"></i> 저장하기</button>
      </div>
    </form>
  </div>
</main>
${authFooterHTML}
<script src="/static/main.js"></script>
<script>
const token = localStorage.getItem('we_token');
const postId = ${id};
const headers = token ? {'Authorization':'Bearer '+token} : {};
fetch('/api/board/posts/'+postId, {headers}).then(r=>r.json()).then(data=>{
  if (!data.success) { alert(data.message); location.href='/board'; return; }
  document.getElementById('eTitle').value   = data.post.title;
  document.getElementById('eContent').value = data.post.content;
  document.getElementById('ePrivate').checked = data.post.is_private === 1;
});
document.getElementById('editForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const btn = document.getElementById('eSubmitBtn');
  btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> 저장 중...';
  const res = await fetch('/api/board/posts/'+postId, {
    method:'PUT', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
    body: JSON.stringify({
      title: document.getElementById('eTitle').value,
      content: document.getElementById('eContent').value,
      is_private: document.getElementById('ePrivate').checked ? 1 : 0
    })
  });
  const data = await res.json();
  if (data.success) { location.href='/board/'+postId; }
  else { document.getElementById('editMsg').textContent=data.message; document.getElementById('editMsg').style.display='block'; btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> 저장하기'; }
});
</script>
</body></html>`)
})

// ════════════════════════════════════════════════════════════════
//  PAGE — 관리자 대시보드
// ════════════════════════════════════════════════════════════════
app.get('/admin', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>관리자 대시보드 — 위드엔딩</title>
  <link rel="stylesheet" href="/static/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
</head>
<body style="background:#f0f2f5;">
<nav class="navbar" id="navbar" style="background:#0d1b35;">
  <div class="nav-container">
    <a href="/" class="nav-logo"><img src="/static/logo.png" alt="위드엔딩" class="nav-logo-img" /></a>
    <div style="color:#d4af37;font-weight:700;font-size:.95rem;"><i class="fas fa-shield-alt"></i> 관리자 대시보드</div>
    <button onclick="adminLogout()" class="btn btn-sm" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);">
      <i class="fas fa-sign-out-alt"></i> 로그아웃
    </button>
  </div>
</nav>
<main style="padding:80px 16px 60px;">
  <div class="container">
    <div id="adminCheck" style="text-align:center;padding:60px;"><div class="board-loading"><i class="fas fa-spinner fa-spin"></i> 권한 확인 중...</div></div>
    <div id="adminContent" style="display:none;">
      <!-- 통계 카드 -->
      <div class="admin-stats-grid" id="statsGrid"></div>
      <!-- 탭 -->
      <div class="admin-tabs">
        <button class="admin-tab active" onclick="switchAdminTab('consult',this)"><i class="fas fa-headset"></i> 상담신청</button>
        <button class="admin-tab" onclick="switchAdminTab('users',this)"><i class="fas fa-users"></i> 회원관리</button>
        <button class="admin-tab" onclick="switchAdminTab('posts',this)"><i class="fas fa-file-alt"></i> 게시글관리</button>
      </div>
      <!-- 상담신청 -->
      <div id="tab-consult" class="admin-panel">
        <div class="admin-panel-header">
          <h3>상담신청 목록</h3>
          <select id="consultFilter" onchange="loadConsultations()" class="write-select" style="width:140px;">
            <option value="">전체</option>
            <option value="new">신규</option>
            <option value="contacted">연락완료</option>
            <option value="done">처리완료</option>
          </select>
        </div>
        <div id="consultList" class="admin-table-wrap"><div class="board-loading"><i class="fas fa-spinner fa-spin"></i></div></div>
      </div>
      <!-- 회원관리 -->
      <div id="tab-users" class="admin-panel" style="display:none;">
        <div class="admin-panel-header"><h3>회원 목록</h3></div>
        <div id="userList" class="admin-table-wrap"><div class="board-loading"><i class="fas fa-spinner fa-spin"></i></div></div>
      </div>
      <!-- 게시글관리 -->
      <div id="tab-posts" class="admin-panel" style="display:none;">
        <div class="admin-panel-header"><h3>전체 게시글</h3></div>
        <div id="postList" class="admin-table-wrap"><div class="board-loading"><i class="fas fa-spinner fa-spin"></i></div></div>
      </div>
    </div>
  </div>
</main>
<script src="/static/main.js"></script>
<script>
const token = localStorage.getItem('we_token');
const user  = JSON.parse(localStorage.getItem('we_user') || 'null');

if (!user || user.role !== 'admin') {
  document.getElementById('adminCheck').innerHTML = '<div class="board-empty"><i class="fas fa-lock" style="font-size:3rem;color:#e74c3c;"></i><p style="margin-top:16px;">관리자 권한이 필요합니다.<br/><a href="/login?redirect=/admin">관리자로 로그인</a></p></div>';
} else {
  document.getElementById('adminCheck').style.display = 'none';
  document.getElementById('adminContent').style.display = 'block';
  loadStats(); loadConsultations(); loadUsers(); loadAdminPosts();
}

function adminLogout() { localStorage.removeItem('we_token'); localStorage.removeItem('we_user'); location.href='/login'; }
function authH() { return {'Authorization':'Bearer '+token,'Content-Type':'application/json'}; }

async function loadStats() {
  const data = await fetch('/api/admin/stats',{headers:authH()}).then(r=>r.json());
  const s = data.stats || {};
  document.getElementById('statsGrid').innerHTML = [
    {icon:'fa-users',      label:'전체 회원',    val:s.totalUsers,        color:'#3498db'},
    {icon:'fa-headset',    label:'신규 상담',    val:s.newConsultations,  color:'#e74c3c'},
    {icon:'fa-file-alt',   label:'전체 게시글',  val:s.totalPosts,        color:'#27ae60'},
    {icon:'fa-clipboard',  label:'총 상담건',    val:s.totalConsultations,color:'#f39c12'},
  ].map(c=>'<div class="admin-stat-card" style="border-top:4px solid '+c.color+'"><i class="fas '+c.icon+'" style="color:'+c.color+';font-size:2rem;margin-bottom:8px;"></i><div class="admin-stat-val">'+c.val+'</div><div class="admin-stat-label">'+c.label+'</div></div>').join('');
}

async function loadConsultations() {
  const status = document.getElementById('consultFilter')?.value || '';
  const data = await fetch('/api/admin/consultations?status='+status,{headers:authH()}).then(r=>r.json());
  const list = document.getElementById('consultList');
  if (!data.consultations?.length) { list.innerHTML='<p class="empty-msg">상담 신청이 없습니다.</p>'; return; }
  list.innerHTML='<table class="board-table"><thead><tr><th>이름</th><th>연락처</th><th>서비스</th><th>상태</th><th>신청일</th><th>처리</th></tr></thead><tbody>'
    +data.consultations.map(c=>'<tr><td>'+c.name+'</td><td>'+c.phone+'</td><td>'+(c.service_type||'-')+'</td><td><span class="badge-status status-'+c.status+'">'+{new:'신규',contacted:'연락완료',done:'처리완료'}[c.status]+'</span></td><td>'+(c.created_at?c.created_at.substring(0,10):'')+'</td><td><select onchange="updateConsult('+c.id+',this.value)" class="write-select" style="width:110px;padding:4px 8px;font-size:.8rem;"><option value="new"'+(c.status==='new'?' selected':'')+'>신규</option><option value="contacted"'+(c.status==='contacted'?' selected':'')+'>연락완료</option><option value="done"'+(c.status==='done'?' selected':'')+'>처리완료</option></select></td></tr>').join('')
    +'</tbody></table>';
}

async function updateConsult(id, status) {
  await fetch('/api/admin/consultations/'+id,{method:'PUT',headers:authH(),body:JSON.stringify({status})});
  loadStats();
}

async function loadUsers() {
  const data = await fetch('/api/admin/users',{headers:authH()}).then(r=>r.json());
  const list = document.getElementById('userList');
  if (!data.users?.length) { list.innerHTML='<p class="empty-msg">회원이 없습니다.</p>'; return; }
  list.innerHTML='<table class="board-table"><thead><tr><th>이름</th><th>이메일</th><th>연락처</th><th>권한</th><th>가입일</th><th>상태</th></tr></thead><tbody>'
    +data.users.map(u=>'<tr><td>'+u.name+'</td><td>'+u.email+'</td><td>'+(u.phone||'-')+'</td><td><span class="badge-role role-'+u.role+'">'+{admin:'관리자',user:'일반'}[u.role]+'</span></td><td>'+(u.created_at?u.created_at.substring(0,10):'')+'</td><td><button class="btn btn-sm '+(u.is_active?'btn-outline':'btn-primary')+'" onclick="toggleUser('+u.id+','+(u.is_active?0:1)+')">'+(u.is_active?'비활성화':'활성화')+'</button></td></tr>').join('')
    +'</tbody></table>';
}

async function toggleUser(id, active) {
  await fetch('/api/admin/users/'+id,{method:'PUT',headers:authH(),body:JSON.stringify({is_active:active})});
  loadUsers(); loadStats();
}

async function loadAdminPosts() {
  const data = await fetch('/api/admin/posts',{headers:authH()}).then(r=>r.json());
  const list = document.getElementById('postList');
  if (!data.posts?.length) { list.innerHTML='<p class="empty-msg">게시글이 없습니다.</p>'; return; }
  list.innerHTML='<table class="board-table"><thead><tr><th>제목</th><th>카테고리</th><th>작성자</th><th>조회</th><th>작성일</th><th>관리</th></tr></thead><tbody>'
    +data.posts.map(p=>'<tr><td><a href="/board/'+p.id+'" target="_blank" style="color:var(--navy);">'+p.title+'</a></td><td>'+p.category_name+'</td><td>'+p.author_name+'</td><td>'+p.view_count+'</td><td>'+(p.created_at?p.created_at.substring(0,10):'')+'</td><td><button class="btn btn-sm" style="background:#e74c3c;color:#fff;" onclick="adminDelPost('+p.id+')"><i class="fas fa-trash"></i></button></td></tr>').join('')
    +'</tbody></table>';
}

async function adminDelPost(id) {
  if (!confirm('게시글을 삭제하시겠습니까?')) return;
  await fetch('/api/board/posts/'+id,{method:'DELETE',headers:authH()});
  loadAdminPosts(); loadStats();
}

function switchAdminTab(name, btn) {
  document.querySelectorAll('.admin-panel').forEach(p=>p.style.display='none');
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+name).style.display='block';
  btn.classList.add('active');
}
</script>
</body></html>`)
})

export default app
