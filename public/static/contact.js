/* ═══════════════════════════════════════════════════════════════
   위드엔딩 — 상담 신청 폼
   © 2026 위드엔딩. All rights reserved.
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form && successMsg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
      submitBtn.disabled = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        form.style.display = 'none';
        successMsg.style.display = 'block';

        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

      } catch (err) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('오류가 발생했습니다. 전화(1588-9999)로 연락해 주세요.');
      }
    });
  }

  // Phone number auto-formatting
  const telInput = document.querySelector('input[type="tel"]');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length >= 7) {
        val = val.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
      } else if (val.length >= 4) {
        val = val.replace(/(\d{3})(\d{0,4})/, '$1-$2').replace(/-$/, '');
      }
      e.target.value = val;
    });
  }
});
