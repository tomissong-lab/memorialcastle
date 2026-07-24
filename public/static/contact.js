/* ═══════════════════════════════════════════════════════════════
   위드엔딩 — 상담 신청 폼 (EmailJS 연동)
   수신 이메일: memorialcastles@gmail.com
   © 2026 위드엔딩. All rights reserved.

   ▶ EmailJS 설정 방법 (최초 1회):
   1. https://www.emailjs.com 가입 (무료 월 200건)
   2. Email Services → Gmail 연결 → memorialcastles@gmail.com
   3. Email Templates → 새 템플릿 생성 (아래 변수 사용)
   4. Account → Public Key 복사
   5. 아래 CONFIG 값 3개를 채워넣으면 완료
═══════════════════════════════════════════════════════════════ */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ▼ EmailJS 설정값 입력 (관리자 전용)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EMAILJS_CONFIG = {
  publicKey:   'ZJKegSpUK1WF__KKR',   // EmailJS 계정 Public Key
  serviceId:   'service_5yhtm3q',      // Gmail 연결 후 발급된 Service ID
  templateId:  'template_ijr3gml',     // 이메일 템플릿 ID
};
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {

  /* ── EmailJS 초기화 ─────────────────────────── */
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const errorBox   = document.getElementById('sendError');
  const errorMsg   = document.getElementById('sendErrorMsg');
  const submitBtn  = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 버튼 로딩 상태
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    submitBtn.disabled  = true;
    if (errorBox) errorBox.style.display = 'none';

    // 폼 데이터 수집
    const name    = document.getElementById('field_name')?.value   || '';
    const phone   = document.getElementById('field_phone')?.value  || '';
    const email   = document.getElementById('field_email')?.value  || '미입력';
    const type    = document.getElementById('field_type')?.value   || '';
    const message = document.getElementById('field_message')?.value|| '';
    const now     = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    // EmailJS로 전송할 템플릿 변수
    const templateParams = {
      to_email:     'memorialcastles@gmail.com',
      from_name:    name,
      from_phone:   phone,
      from_email:   email,
      consult_type: type,
      message:      message || '(내용 없음)',
      sent_at:      now,
      reply_to:     email !== '미입력' ? email : 'memorialcastles@gmail.com',
    };

    try {
      // EmailJS 설정 완료 여부 확인
      const isConfigured = (
        typeof emailjs !== 'undefined' &&
        EMAILJS_CONFIG.publicKey  !== 'YOUR_PUBLIC_KEY' &&
        EMAILJS_CONFIG.serviceId  !== 'YOUR_SERVICE_ID' &&
        EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID'
      );

      if (isConfigured) {
        // ── 실제 이메일 전송 ──
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams
        );
      } else {
        // ── 설정 전 테스트 모드: 콘솔 출력 후 성공 처리 ──
        console.log('📧 [위드엔딩 상담 신청 테스트 데이터]');
        console.table(templateParams);
        console.warn('⚠️ EmailJS 설정값을 contact.js에 입력하면 실제 메일이 전송됩니다.');
        await new Promise(r => setTimeout(r, 800)); // 전송 시뮬레이션
      }

      // ── 성공 처리 ──
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

    } catch (err) {
      // ── 오류 처리 ──
      console.error('EmailJS 전송 오류:', err);
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
      if (errorBox && errorMsg) {
        errorMsg.textContent = '전송 중 오류가 발생했습니다. 전화(1588-9999)로 연락해 주세요.';
        errorBox.style.display = 'flex';
      }
    }
  });

  /* ── 전화번호 자동 포맷 ─────────────────────── */
  const telInput = document.getElementById('field_phone');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (val.length >= 7) {
        val = val.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
      } else if (val.length >= 4) {
        val = val.replace(/(\d{3})(\d{0,4})/, '$1-$2').replace(/-$/, '');
      }
      e.target.value = val;
    });
  }
});
