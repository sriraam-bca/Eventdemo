/* ============================================================
   EventVerse — Multi-Step Form Wizard
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFormWizard();
  initTicketBuilder();
  initImageUpload();
});

function initFormWizard() {
  const wizard = document.querySelector('.form-wizard');
  if (!wizard) return;

  const steps = wizard.querySelectorAll('.wizard-step');
  const progressCircles = document.querySelectorAll('.step-circle');
  const progressLines = document.querySelectorAll('.step-line');
  const nextBtns = wizard.querySelectorAll('[data-wizard="next"]');
  const prevBtns = wizard.querySelectorAll('[data-wizard="prev"]');
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });

    progressCircles.forEach((circle, i) => {
      circle.classList.remove('active', 'completed');
      if (i < index) circle.classList.add('completed');
      if (i === index) circle.classList.add('active');
    });

    progressLines.forEach((line, i) => {
      line.classList.toggle('active', i < index);
    });

    // Populate review on last step
    if (index === steps.length - 1) {
      populateReview();
    }
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  showStep(0);
}

function populateReview() {
  const fields = {
    'review-name': '#event-name',
    'review-category': '#event-category',
    'review-date': '#event-date',
    'review-time': '#event-time',
    'review-venue': '#event-venue',
    'review-location': '#event-location',
  };

  for (const [reviewId, inputSelector] of Object.entries(fields)) {
    const reviewEl = document.getElementById(reviewId);
    const inputEl = document.querySelector(inputSelector);
    if (reviewEl && inputEl) {
      const value = inputEl.tagName === 'SELECT'
        ? inputEl.options[inputEl.selectedIndex]?.text
        : inputEl.value;
      reviewEl.textContent = value || '—';
    }
  }
}

/* ── Ticket Builder ── */
function initTicketBuilder() {
  const builder = document.querySelector('.ticket-builder');
  if (!builder) return;

  const addBtn = builder.querySelector('.add-ticket-btn');
  if (!addBtn) return;

  addBtn.addEventListener('click', () => {
    const ticketCount = builder.querySelectorAll('.ticket-row').length + 1;
    const row = document.createElement('div');
    row.className = 'ticket-row';
    row.innerHTML = `
      <div class="form-group">
        <label class="form-label">Tier Name</label>
        <input type="text" class="form-control" placeholder="e.g., Premium" />
      </div>
      <div class="form-group">
        <label class="form-label">Price ($)</label>
        <input type="number" class="form-control" placeholder="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Quantity</label>
        <input type="number" class="form-control" placeholder="100" />
      </div>
      <button class="ticket-remove-btn" aria-label="Remove ticket tier">✕</button>
    `;
    builder.insertBefore(row, addBtn);

    row.querySelector('.ticket-remove-btn').addEventListener('click', () => {
      row.remove();
    });
  });

  // Attach remove handlers to existing rows
  builder.querySelectorAll('.ticket-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.ticket-row').remove();
    });
  });
}

/* ── Image Upload Preview ── */
function initImageUpload() {
  const uploadArea = document.querySelector('.image-upload');
  if (!uploadArea) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  uploadArea.appendChild(input);

  uploadArea.addEventListener('click', () => input.click());

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadArea.innerHTML = `
        <img src="${ev.target.result}" alt="Event image preview" style="max-height:200px;border-radius:var(--radius-md);margin:0 auto;" />
        <p style="margin-top:var(--space-md);font-size:var(--fs-sm);color:var(--color-text-muted)">Click to change image</p>
      `;
      uploadArea.appendChild(input);
    };
    reader.readAsDataURL(file);
  });

  // Drag & Drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--color-accent-purple)';
    uploadArea.style.background = 'rgba(108, 92, 231, 0.08)';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change'));
    }
  });
}
