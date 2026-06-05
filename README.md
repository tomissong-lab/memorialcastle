# 🌿 위드엔딩 (withendings.co.kr)

대한민국 최초 무빈소 특화 후불 장례 + 자산관리 통합 서비스

## 프로젝트 개요

- **서비스명**: 위드엔딩
- **도메인**: withendings.co.kr
- **목표**: 장례업계 투명성 혁신 + 자산관리 통합 플랫폼
- **핵심 차별화**: 후불 정산 / 무빈소 전문 / 자산관리 통합

## 구현된 페이지 (7개)

| 경로 | 페이지 | 주요 기능 |
|------|--------|----------|
| `/` | 홈 | 히어로, 신뢰지표 카운터, 차별화 3단, 비교표, ROI 프리뷰, 고객 후기 |
| `/funeral` | 무빈소 후불장례 | 실시간 견적 계산기, 3단계 패키지, 실명제 장례지도사 |
| `/membership` | 위드 멤버십 | 라이트/스탠다드/패밀리 비교, ROI 테이블, 법적 안내 |
| `/asset` | 자산관리 | 상속세 시뮬레이터, 증여 전략, 위드 레거시(교육/환경/커뮤니티) |
| `/contact` | 24시간 상담 | 긴급 연결 UI, 온라인 상담 신청 폼, 카카오 채널 |
| `/guide` | 웰다잉 가이드 | SEO 콘텐츠 6개 카테고리 |
| `/about` | 회사소개 | 미션·가치관, 연혁 타임라인 |

## API 엔드포인트

- `GET /api/calculate?package=basic&membership=standard&months=12` — 장례 비용 계산
- `POST /api/contact` — 상담 신청

## 기술 스택

- **Framework**: Hono v4 (Cloudflare Workers)
- **Build**: Vite + @hono/vite-build
- **Deploy**: Cloudflare Pages
- **CSS**: Custom CSS (디자인 시스템 변수 기반)
- **JS**: Vanilla JS (카운터 애니메이션, 계산기, 시뮬레이터)

## 디자인 시스템

```css
--primary:   #2D6A4F  /* 포레스트 그린 */
--emergency: #E63946  /* 긴급 레드 */
--accent:    #D4A853  /* 골드 */
--text:      #1A1A2E  /* 딥 네이비 */
--bg:        #FAFAF7  /* 크림 화이트 */
```

## 개발 명령어

```bash
npm run build          # Vite 빌드
pm2 start ecosystem.config.cjs  # 개발 서버 시작 (포트 3000)
pm2 logs withendings --nostream # 로그 확인
```

## 멤버십 패키지

| 티어 | 월 구독료 | 연 혜택 가치 | ROI |
|------|---------|------------|-----|
| 🌱 라이트 | 6,900원 | 25만원 | 302% |
| 🌳 스탠다드 | 12,900원 | 108만원 | 697% |
| 🏡 패밀리 | 24,900원 | 220만원 | 736% |

## 법적 고지 (중요)

> ⚠️ 위드 멤버십은 현재 제공되는 서비스의 구독료입니다.  
> 장례비를 미리 납입하는 상조가 아닙니다.

## 배포 상태

- **플랫폼**: Cloudflare Pages
- **저작권**: © 2026 위드엔딩 (withendings.co.kr)
- **업데이트**: 2026-06-05
