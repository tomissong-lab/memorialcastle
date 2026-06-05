/* ═══════════════════════════════════════════════════════════════
   위드엔딩 — 상속세 절세 시뮬레이터
   © 2026 위드엔딩. All rights reserved.
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // 상속세 간이 계산 (참고용)
  function estimateInheritanceTax(assetOk, familyType) {
    // 기본 공제 계산
    let basicDeduction = 200000000; // 기본 공제 2억
    let spouseDeduction = 0;
    let childDeduction = 0;

    if (familyType.includes('spouse')) {
      spouseDeduction = Math.min(assetOk * 0.5, 3000000000); // 배우자 공제 최대 30억
    }
    if (familyType.includes('2child')) {
      childDeduction = 2 * 50000000; // 자녀 공제 1인당 5천만
    } else if (familyType.includes('1child')) {
      childDeduction = 50000000;
    }

    const unifiedDeduction = Math.max(500000000, basicDeduction + childDeduction); // 일괄공제 5억 또는 항목공제 중 큰 것
    const totalDeduction = Math.max(unifiedDeduction, spouseDeduction) + unifiedDeduction;
    const taxableBase = Math.max(0, assetOk - Math.min(totalDeduction, assetOk * 0.8));

    return calculateProgressiveTax(taxableBase);
  }

  function calculateProgressiveTax(base) {
    if (base <= 0) return 0;
    const brackets = [
      { limit: 100000000,  rate: 0.10, deduction: 0 },
      { limit: 500000000,  rate: 0.20, deduction: 10000000 },
      { limit: 1000000000, rate: 0.30, deduction: 60000000 },
      { limit: 3000000000, rate: 0.40, deduction: 160000000 },
      { limit: Infinity,   rate: 0.50, deduction: 460000000 },
    ];
    for (const b of brackets) {
      if (base <= b.limit) {
        return base * b.rate - b.deduction;
      }
    }
  }

  function applyOptimization(before, has10yr, hasCharity, hasInsurance) {
    let after = before;
    if (has10yr)     after *= 0.75; // 사전 증여로 약 25% 절감
    if (hasCharity)  after *= 0.88; // 기부 공제로 약 12% 절감
    if (hasInsurance) after *= 0.92; // 보험 활용으로 약 8% 절감
    return after;
  }

  function fmtWon(n) {
    const round = Math.round(n / 100000) * 100000;
    if (round >= 100000000) {
      const oke = Math.round(round / 100000000);
      const man = Math.round((round % 100000000) / 10000);
      if (man === 0) return `약 ${oke}억원`;
      return `약 ${oke}억 ${man.toLocaleString('ko-KR')}만원`;
    }
    return `약 ${Math.round(round / 10000).toLocaleString('ko-KR')}만원`;
  }

  function update() {
    const slider = document.getElementById('assetSlider');
    const assetValEl = document.getElementById('assetVal');
    const taxBeforeEl = document.getElementById('taxBefore');
    const taxAfterEl  = document.getElementById('taxAfter');
    const taxSavingEl = document.getElementById('taxSaving');

    if (!slider) return;

    const assetMan = parseInt(slider.value);          // 단위: 백만원
    const assetWon = assetMan * 1000000;
    if (assetValEl) assetValEl.textContent = (assetMan / 100).toFixed(0);

    const familyType = document.querySelector('input[name="family"]:checked')?.value || 'spouse_2child';
    const has10yr    = document.getElementById('has10yr')?.checked || false;
    const hasCharity = document.getElementById('hasCharity')?.checked || false;
    const hasInsurance = document.getElementById('hasInsurance')?.checked || false;

    const before = estimateInheritanceTax(assetWon, familyType);
    const after  = applyOptimization(before, has10yr, hasCharity, hasInsurance);
    const saving = before - after;

    if (taxBeforeEl) taxBeforeEl.textContent = fmtWon(before);
    if (taxAfterEl)  taxAfterEl.textContent  = fmtWon(after);
    if (taxSavingEl) taxSavingEl.textContent  = fmtWon(saving);
  }

  // Event listeners
  const slider = document.getElementById('assetSlider');
  if (slider) {
    slider.addEventListener('input', update);
  }

  document.querySelectorAll('input[name="family"]').forEach(el => {
    el.addEventListener('change', update);
  });

  ['has10yr', 'hasCharity', 'hasInsurance'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', update);
  });

  // Initial
  update();
});
