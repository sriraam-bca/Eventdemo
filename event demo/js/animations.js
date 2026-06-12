/* ============================================================
   EventVerse — Accordion & Misc Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initTicketTierSelection();
  initParticles();
});

/* ── Accordion ── */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isActive = item.classList.contains('active');

      // Close all siblings
      item.parentElement.querySelectorAll('.accordion-item').forEach(sibling => {
        sibling.classList.remove('active');
      });

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ── Ticket Tier Selection (Event Detail) ── */
function initTicketTierSelection() {
  const tiers = document.querySelectorAll('.ticket-tier');
  const totalPriceEl = document.querySelector('.ticket-total-price');

  if (!tiers.length) return;

  tiers.forEach(tier => {
    tier.addEventListener('click', () => {
      tiers.forEach(t => t.classList.remove('selected'));
      tier.classList.add('selected');

      if (totalPriceEl) {
        const price = tier.getAttribute('data-price');
        totalPriceEl.textContent = `$${price}`;
      }
    });
  });
}

/* ── Hero Particles ── */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    const colors = ['#7C3AED', '#A855F7', '#818CF8', '#FFFFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;

    container.appendChild(particle);
  }
}
