/* ═══════════════════════════════════════════════════════════════
   위드엔딩 — 실시간 견적 계산기
   © 2026 위드엔딩. All rights reserved.
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const basePrice = { basic: 2490000, standard: 3490000, premium: 4990000 };
  const discountRate = { none: 0, lite: 0.05, standard: 0.10, family: 0.15 };
  const monthlyBenefit = { none: 0, lite: 6900, standard: 19350, family: 49800 };
  const pkgLabels = { basic: '🌱 베이직 (무빈소 직장형)', standard: '🌳 스탠다드 (소규모 가족장)', premium: '🏆 프리미엄 (맞춤형 존엄장례)' };

  function fmt(n) {
    return Math.round(n).toLocaleString('ko-KR') + '원';
  }

  function calculate() {
    const pkg  = document.querySelector('input[name="package"]:checked')?.value || 'basic';
    const mem  = document.querySelector('input[name="membership"]:checked')?.value || 'none';
    const months = parseInt(document.getElementById('monthsSlider')?.value || '12');

    const base     = basePrice[pkg];
    const discount = base * discountRate[mem];
    const accum    = monthlyBenefit[mem] * months;
    const optionEls = document.querySelectorAll('input[name="options"]:checked');
    let optTotal = 0;
    optionEls.forEach(el => { optTotal += parseInt(el.dataset.price || '0'); });

    const rawTotal = base - discount - accum + optTotal;
    const total    = Math.max(rawTotal, base * 0.5);

    // Update DOM
    const rBase = document.getElementById('r-base');
    const rDiscount = document.getElementById('r-discount');
    const rDiscountRow = document.getElementById('r-discount-row');
    const rAccum = document.getElementById('r-accum');
    const rAccumRow = document.getElementById('r-accum-row');
    const rOptions = document.getElementById('r-options');
    const rOptionsRow = document.getElementById('r-options-row');
    const rTotal = document.getElementById('r-total');

    if (rBase)    rBase.textContent = fmt(base);
    if (rTotal)   rTotal.textContent = fmt(total);

    if (rDiscountRow) {
      rDiscountRow.style.display = discount > 0 ? 'flex' : 'none';
      if (rDiscount) rDiscount.textContent = '-' + fmt(discount);
    }
    if (rAccumRow) {
      rAccumRow.style.display = accum > 0 ? 'flex' : 'none';
      if (rAccum) rAccum.textContent = '-' + fmt(accum);
    }
    if (rOptionsRow) {
      rOptionsRow.style.display = optTotal > 0 ? 'flex' : 'none';
      if (rOptions) rOptions.textContent = fmt(optTotal);
    }
  }

  // Listen for changes
  document.querySelectorAll('input[name="package"]').forEach(el =>
    el.addEventListener('change', calculate)
  );

  document.querySelectorAll('input[name="membership"]').forEach(el => {
    el.addEventListener('change', () => {
      const val = el.value;
      const monthsStep = document.getElementById('monthsStep');
      if (monthsStep) {
        monthsStep.style.display = val === 'none' ? 'none' : 'block';
      }
      calculate();
    });
  });

  const monthsSlider = document.getElementById('monthsSlider');
  const monthsVal    = document.getElementById('monthsVal');
  if (monthsSlider && monthsVal) {
    monthsSlider.addEventListener('input', () => {
      monthsVal.textContent = monthsSlider.value;
      calculate();
    });
  }

  document.querySelectorAll('input[name="options"]').forEach(el =>
    el.addEventListener('change', calculate)
  );

  // Initial calculation
  calculate();
});
