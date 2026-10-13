/**
 * AquaShield Pro - Main JavaScript Engine
 * Theme switching, RTL toggle, navigation dropdowns, modals, and micro-interactions
 */

function initApp() {
  initTheme();
  initRTL();
  initNavigation();
  initAuthNav();
  initFaqAccordion();
  initEmergencyModal();
  initHeroDispatchForm();
  initCounters();
  initPasswordToggles();
  initCostEstimator();
  initCountdownTimer();
  initHeaderScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ----------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   ---------------------------------------------------- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('aquashield_theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('aquashield_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  });
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
    } else {
      icon.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    }
  });
}

/* ----------------------------------------------------
   2. RTL Management (Right-to-Left Layout)
   ---------------------------------------------------- */
function updateRTLLabels(dir) {
  const isRtl = dir === 'rtl';
  const targetText = isRtl ? 'LTR' : 'RTL';
  const labelSpans = document.querySelectorAll('.rtl-toggle-btn .label-text');
  labelSpans.forEach(span => {
    span.textContent = targetText;
  });
  const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
  rtlButtons.forEach(btn => {
    btn.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
    btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
  });
}

function initRTL() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('aquashield_dir') || 'ltr';

  document.documentElement.setAttribute('dir', savedDir);
  updateRTLLabels(savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';

      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('aquashield_dir', newDir);
      updateRTLLabels(newDir);
    });
  });
}

/* ----------------------------------------------------
   3. Navigation, Dropdowns & Mobile Drawer
   ---------------------------------------------------- */
function initNavigation() {
  const mobileToggle = document.querySelector('.btn-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdownParents = document.querySelectorAll('.nav-item-dropdown');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      const isOpen = navMenu.classList.contains('mobile-active');
      mobileToggle.setAttribute('aria-expanded', isOpen);

      // On mobile menu open, ensure active dropdown (like Home) is expanded by default
      if (isOpen) {
        dropdownParents.forEach(parent => {
          if (parent.classList.contains('active') && !parent.classList.contains('dropdown-collapsed')) {
            parent.classList.add('dropdown-open');
            const trig = parent.querySelector('.dropdown-trigger');
            if (trig) trig.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  // Handle Dropdown touch / click interactions on mobile, tablet & desktop
  dropdownParents.forEach(parent => {
    const trigger = parent.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.innerWidth <= 991) {
          const isCurrentlyOpen = parent.classList.contains('dropdown-open') || 
            (parent.classList.contains('active') && !parent.classList.contains('dropdown-collapsed'));

          if (isCurrentlyOpen) {
            parent.classList.remove('dropdown-open');
            parent.classList.add('dropdown-collapsed');
            trigger.setAttribute('aria-expanded', 'false');
          } else {
            // Close other open dropdowns in mobile menu
            dropdownParents.forEach(other => {
              if (other !== parent) {
                other.classList.remove('dropdown-open');
                other.classList.add('dropdown-collapsed');
                const otherTrig = other.querySelector('.dropdown-trigger');
                if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
              }
            });
            parent.classList.add('dropdown-open');
            parent.classList.remove('dropdown-collapsed');
            trigger.setAttribute('aria-expanded', 'true');
          }
        } else {
          // Desktop / Laptop click interaction: toggle open/close
          const isCurrentlyOpen = parent.classList.contains('dropdown-open');
          if (isCurrentlyOpen) {
            parent.classList.remove('dropdown-open');
            parent.classList.add('dropdown-collapsed');
            trigger.setAttribute('aria-expanded', 'false');
          } else {
            dropdownParents.forEach(other => {
              other.classList.remove('dropdown-open');
              other.classList.add('dropdown-collapsed');
              const otherTrig = other.querySelector('.dropdown-trigger');
              if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
            });
            parent.classList.add('dropdown-open');
            parent.classList.remove('dropdown-collapsed');
            trigger.setAttribute('aria-expanded', 'true');
          }
        }
      });

      // On desktop, reset dropdown-collapsed on mouse enter and close on mouse leave
      parent.addEventListener('mouseenter', () => {
        if (window.innerWidth > 991) {
          parent.classList.remove('dropdown-collapsed');
        }
      });

      parent.addEventListener('mouseleave', () => {
        if (window.innerWidth > 991) {
          parent.classList.remove('dropdown-open');
          parent.classList.remove('dropdown-collapsed');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Close dropdown on desktop when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-dropdown')) {
      dropdownParents.forEach(p => {
        p.classList.remove('dropdown-open');
        p.classList.remove('dropdown-collapsed');
        const trig = p.querySelector('.dropdown-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdown on desktop when Escape key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownParents.forEach(p => {
        p.classList.remove('dropdown-open');
        p.classList.remove('dropdown-collapsed');
        const trig = p.querySelector('.dropdown-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Dynamic active navbar link highlighting
  highlightCurrentNavLink();

  // Instant active highlight on click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const parentItem = link.closest('.nav-item');
      const href = (link.getAttribute('href') || '').toLowerCase();
      // Do not highlight Dashboard or dropdown triggers
      if (parentItem && !link.classList.contains('dropdown-trigger') && !href.includes('dashboard')) {
        navMenu.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        navMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        parentItem.classList.add('active');
        link.classList.add('active');
      }
    });
  });

  // Close mobile menu on click outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('mobile-active')) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-active');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function highlightCurrentNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  if (!navItems.length) return;

  let targetKey = '';
  if (currentFile === '' || currentFile === 'index.html' || currentFile === 'index-2.html') {
    targetKey = 'home';
  } else if (currentFile.includes('about')) {
    targetKey = 'about';
  } else if (currentFile.includes('service')) {
    targetKey = 'services';
  } else if (currentFile.includes('blog')) {
    targetKey = 'blog';
  } else if (currentFile.includes('pricing')) {
    targetKey = 'pricing';
  } else if (currentFile.includes('contact')) {
    targetKey = 'contact';
  }
  // Exclude dashboard: Dashboard is intentionally not highlighted

  if (!targetKey) {
    // Clear active highlights if on excluded pages
    navItems.forEach(item => {
      item.classList.remove('active');
      const link = item.querySelector('.nav-link');
      if (link) link.classList.remove('active');
    });
    return;
  }

  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const href = (link ? link.getAttribute('href') || '' : '').toLowerCase();
    const isDropdown = item.classList.contains('nav-item-dropdown');

    // Ensure Dashboard is never highlighted
    if (href.includes('dashboard')) {
      item.classList.remove('active');
      if (link) link.classList.remove('active');
      return;
    }

    let isMatch = false;
    if (targetKey === 'home' && (isDropdown || href.includes('index'))) {
      isMatch = true;
    } else if (targetKey === 'about' && href.includes('about')) {
      isMatch = true;
    } else if (targetKey === 'services' && href.includes('services')) {
      isMatch = true;
    } else if (targetKey === 'blog' && href.includes('blog')) {
      isMatch = true;
    } else if (targetKey === 'pricing' && href.includes('pricing')) {
      isMatch = true;
    } else if (targetKey === 'contact' && href.includes('contact')) {
      isMatch = true;
    }

    if (isMatch) {
      item.classList.add('active');
      if (link) link.classList.add('active');

      // Sync active state on individual dropdown links inside Home
      if (isDropdown) {
        const dropdownLinks = item.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(dl => {
          const dlHref = (dl.getAttribute('href') || '').toLowerCase();
          if ((currentFile === '' || currentFile === 'index.html') && dlHref.includes('index.html') && !dlHref.includes('index-2')) {
            dl.classList.add('active');
          } else if (currentFile === 'index-2.html' && dlHref.includes('index-2.html')) {
            dl.classList.add('active');
          } else {
            dl.classList.remove('active');
          }
        });
      }
    } else {
      item.classList.remove('active');
      if (link) link.classList.remove('active');
    }
  });
}

/* ----------------------------------------------------
   3b. Auth Navigation Management
   ---------------------------------------------------- */
function initAuthNav() {
  // Retain pure Login & Sign Up buttons in website header
}

/* ----------------------------------------------------
   4. Header Sticky Shadow
   ---------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ----------------------------------------------------
   5. FAQ Accordion
   ---------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle clicked item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ----------------------------------------------------
   6. Emergency Dispatch Modal & Toast Notifications
   ---------------------------------------------------- */
function initEmergencyModal() {
  const modalBackdrop = document.getElementById('emergencyModal');
  const openButtons = document.querySelectorAll('.open-emergency-modal');
  const closeButtons = document.querySelectorAll('.close-modal-btn');
  const emergencyForm = document.getElementById('emergencyModalForm');

  if (!modalBackdrop) return;

  const modalBody = modalBackdrop.querySelector('.modal-body');
  const initialModalBodyHtml = modalBody ? modalBody.innerHTML : '';
  const modalHeaderTitle = modalBackdrop.querySelector('.modal-header h3');
  const initialModalTitle = modalHeaderTitle ? modalHeaderTitle.textContent : '';

  function openModal() {
    // If modal body was previously replaced with a confirmation card, restore original form
    if (modalBody && initialModalBodyHtml && !modalBody.querySelector('form')) {
      modalBody.innerHTML = initialModalBodyHtml;
      if (modalHeaderTitle && initialModalTitle) {
        modalHeaderTitle.textContent = initialModalTitle;
      }
      bindFormEvents();
    }
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const triggerText = btn.textContent.toLowerCase();
      const isAssessmentTrigger = triggerText.includes('inspection') || triggerText.includes('estimate') || triggerText.includes('assessment') || triggerText.includes('scope');
      openModal();

      if (isAssessmentTrigger) {
        if (modalHeaderTitle) {
          modalHeaderTitle.textContent = 'Request Property Damage Assessment';
        }
        const activeForm = document.getElementById('emergencyModalForm');
        if (activeForm) {
          const sBtn = activeForm.querySelector('button[type="submit"]') || activeForm.querySelector('.btn-emergency, .btn-primary');
          if (sBtn) {
            sBtn.className = 'btn btn-emergency';
            sBtn.style.width = '100%';
            sBtn.style.marginTop = '10px';
            sBtn.innerHTML = `
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>Book On-Site Assessment</span>
            `;
          }
        }
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  function bindFormEvents() {
    const activeForm = document.getElementById('emergencyModalForm');
    if (!activeForm) return;

    // Attach submit listener
    activeForm.onsubmit = function(e) {
      if (e) e.preventDefault();
      handleFormSubmission(activeForm);
      return false;
    };

    // Attach click listener to submit button for guaranteed execution
    const submitBtn = activeForm.querySelector('button[type="submit"]') || activeForm.querySelector('.btn-emergency, .btn-primary');
    if (submitBtn) {
      if (!submitBtn.classList.contains('btn-emergency')) {
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-emergency');
      }
      submitBtn.onclick = function(e) {
        if (activeForm.checkValidity && !activeForm.checkValidity()) {
          activeForm.reportValidity();
          return;
        }
        if (e) e.preventDefault();
        handleFormSubmission(activeForm);
      };
    }
  }

  function handleFormSubmission(form) {
    const phoneInput = form.querySelector('input[type="tel"]');
    const addressInput = form.querySelector('input[name="address"]');
    const nameInput = form.querySelector('input[name="name"]');
    const carrierSelect = form.querySelector('select[name="carrier"]') || form.querySelector('select[name="insurance_carrier"]');
    const damageSelect = form.querySelector('select[name="damage_type"]');
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-emergency, .btn-primary');

    const phone = (phoneInput && phoneInput.value.trim()) ? phoneInput.value.trim() : '';
    const address = (addressInput && addressInput.value.trim()) ? addressInput.value.trim() : '';
    const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Property Owner';
    const carrier = (carrierSelect && carrierSelect.value) ? carrierSelect.value : 'State Farm';
    const damageType = (damageSelect && damageSelect.value) ? damageSelect.value : 'Emergency Water Extraction';

    if (!phone || !address) {
      showToast('Please fill in your contact number and property address.', 'warning');
      return;
    }

    const submitBtnText = submitBtn ? submitBtn.textContent.trim().toLowerCase() : '';
    const currentModalTitle = modalHeaderTitle ? modalHeaderTitle.textContent.trim().toLowerCase() : '';
    const isAssessment = carrierSelect !== null || submitBtnText.includes('assessment') || submitBtnText.includes('inspection') || currentModalTitle.includes('inspection') || currentModalTitle.includes('estimate');

    const randomJobNumber = Math.floor(1000 + Math.random() * 9000);

    if (isAssessment) {
      const estId = `EST-${randomJobNumber}`;
      const bookingData = {
        name: name,
        phone: phone,
        address: address,
        carrier: carrier,
        jobId: estId,
        type: 'On-Site Assessment & Inspection',
        status: 'Confirmed & Scheduled',
        window: 'Today • Priority 2-Hour Arrival Window',
        inspector: 'David Vance (IICRC Master Inspector #4192)',
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      localStorage.setItem('aquashield_user', JSON.stringify(bookingData));
      localStorage.setItem('aquashield_active_booking', JSON.stringify(bookingData));
      sessionStorage.setItem('aquashield_booking_success', `✓ Free On-Site Assessment booked for ${address}! Inspector scheduled (Ref: #${estId}).`);

      showToast(`✓ Free On-Site Assessment booked! Senior Inspector assigned for ${address}.`, 'success');

      if (modalHeaderTitle) {
        modalHeaderTitle.textContent = 'Free On-Site Assessment Confirmed';
      }

      if (modalBody) {
        modalBody.innerHTML = `
          <div style="text-align: center; padding: 10px 0 15px;">
            <div style="width: 58px; height: 58px; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="28" height="28" fill="none" stroke="#10b981" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-bottom: 10px;">
              <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></span>
              ASSESSMENT BOOKED &amp; CONFIRMED
            </span>
            <h3 style="margin: 0 0 6px; font-size: 1.35rem; color: var(--text-heading, #1e293b);">On-Site Inspection Scheduled</h3>
            <p style="margin: 0 0 18px; color: var(--text-muted, #64748b); font-size: 0.88rem;">Inspection Reference: <strong style="color: var(--primary, #0284c7); font-family: monospace; font-size: 1rem;">#${estId}</strong></p>
            
            <div style="text-align: left; background: rgba(2, 132, 199, 0.06); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 8px; padding: 14px; margin-bottom: 18px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Client Name:</span>
                <strong style="color: var(--text-heading, #1e293b);">${name}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Arrival Window:</span>
                <strong style="color: #f59e0b;">⏱️ Today &bull; Priority 2-Hour Window</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Assigned Inspector:</span>
                <strong style="color: var(--text-heading, #1e293b);">David Vance (IICRC Master Inspector #4192)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Insurance Carrier:</span>
                <strong style="color: var(--text-heading, #1e293b);">${carrier}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Property Location:</span>
                <strong style="color: var(--text-heading, #1e293b); text-align: right; max-width: 60%;">${address}</strong>
              </div>
            </div>

            <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 10px 12px; text-align: left; margin-bottom: 18px; border-radius: 4px;">
              <p style="margin: 0; font-size: 0.8rem; color: #065f46; line-height: 1.45;">
                ✓ <strong>100% Free Assessment:</strong> Thermal moisture scans &amp; insurance-ready estimates are zero out-of-pocket. Inspector will call <strong>${phone}</strong> before arrival.
              </p>
            </div>

            <div style="display: flex; gap: 10px;">
              <a href="tel:8005550199" class="btn btn-emergency" style="flex: 1; text-align: center; text-decoration: none; justify-content: center; display: inline-flex; align-items: center; gap: 6px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                Call Hotline
              </a>
              <button type="button" class="btn btn-outline close-modal-btn" style="flex: 1;">Close</button>
            </div>
          </div>
        `;

        modalBody.querySelector('.close-modal-btn')?.addEventListener('click', closeModal);
      }
    } else {
      // Emergency Rapid Dispatch Confirmation
      const jobId = `AQ-${randomJobNumber}`;
      const dispatchData = {
        name: name,
        phone: phone,
        address: address,
        damageType: damageType,
        jobId: jobId,
        status: 'En Route (Priority 1)',
        eta: '24-28 Minutes',
        technician: 'David Vance (Master Restorer)',
        mobileUnit: 'AQ-42 High-Capacity Extraction Unit',
        dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      localStorage.setItem('aquashield_user', JSON.stringify(dispatchData));
      localStorage.setItem('aquashield_active_dispatch', JSON.stringify(dispatchData));
      sessionStorage.setItem('aquashield_dispatch_success', `✓ Emergency Crew Dispatched to ${address} for ${damageType}! Mobile Unit AQ-42 is en route (ETA: 28 min).`);

      showToast(`🚨 Priority Crew Dispatched! Mobile Unit AQ-42 is en route to ${address}.`, 'success');

      if (modalHeaderTitle) {
        modalHeaderTitle.textContent = 'Emergency Crew Dispatched';
      }

      if (modalBody) {
        modalBody.innerHTML = `
          <div style="text-align: center; padding: 10px 0 15px;">
            <div style="width: 58px; height: 58px; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="28" height="28" fill="none" stroke="#10b981" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-bottom: 10px;">
              <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></span>
              UNIT DISPATCHED &amp; EN ROUTE
            </span>
            <h3 style="margin: 0 0 6px; font-size: 1.35rem; color: var(--text-heading, #1e293b);">Crew En Route to Property</h3>
            <p style="margin: 0 0 18px; color: var(--text-muted, #64748b); font-size: 0.88rem;">Emergency Incident Ticket: <strong style="color: var(--primary, #0284c7); font-family: monospace;">#${jobId}</strong></p>
            
            <div style="text-align: left; background: rgba(2, 132, 199, 0.06); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 8px; padding: 14px; margin-bottom: 18px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Estimated Arrival:</span>
                <strong style="color: #f59e0b;">⏱️ 24 - 28 Minutes</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Assigned Fleet:</span>
                <strong style="color: var(--text-heading, #1e293b);">AQ-42 Rapid Extraction Unit</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Lead Specialist:</span>
                <strong style="color: var(--text-heading, #1e293b);">David Vance (Master Restorer)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span style="color: var(--text-muted, #64748b);">Location:</span>
                <strong style="color: var(--text-heading, #1e293b); text-align: right; max-width: 60%;">${address}</strong>
              </div>
            </div>

            <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 10px 12px; text-align: left; margin-bottom: 18px; border-radius: 4px;">
              <p style="margin: 0; font-size: 0.8rem; color: #b91c1c; line-height: 1.4;">
                ⚠️ <strong>Safety Warning:</strong> Turn off main water valve if accessible. Technician will call <strong>${phone}</strong> upon arrival.
              </p>
            </div>

            <div style="display: flex; gap: 10px;">
              <a href="tel:8005550199" class="btn btn-emergency" style="flex: 1; text-align: center; text-decoration: none; justify-content: center; display: inline-flex; align-items: center; gap: 6px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                Call Hotline
              </a>
              <button type="button" class="btn btn-outline close-modal-btn" style="flex: 1;">Close</button>
            </div>
          </div>
        `;

        modalBody.querySelector('.close-modal-btn')?.addEventListener('click', closeModal);
      }
    }
  }

  bindFormEvents();
}

/* ----------------------------------------------------
   6b. Hero Rapid Dispatch Form Submission & Inline Confirmation
   ---------------------------------------------------- */
function initHeroDispatchForm() {
  const dispatchForm = document.getElementById('heroDispatchForm');
  if (!dispatchForm) return;

  dispatchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('dispatchName');
    const phoneInput = document.getElementById('dispatchPhone');
    const addressInput = document.getElementById('dispatchAddress');
    const damageSelect = document.getElementById('dispatchDamageType');
    const submitBtn = document.getElementById('heroDispatchSubmitBtn') || dispatchForm.querySelector('button[type="submit"]');
    const btnText = document.getElementById('heroDispatchBtnText');

    const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Emergency Dispatch';
    const phone = (phoneInput && phoneInput.value.trim()) ? phoneInput.value.trim() : '(800) 555-0199';
    const address = (addressInput && addressInput.value.trim()) ? addressInput.value.trim() : 'Property on File';
    const damageType = (damageSelect && damageSelect.value) ? damageSelect.value : 'Burst Pipe / Plumbing Leak';

    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) {
        btnText.textContent = 'Alerting Nearest Mobile Unit...';
      }
    }

    const randomJobNumber = Math.floor(1000 + Math.random() * 9000);
    const jobId = `AQ-${randomJobNumber}`;

    const dispatchData = {
      name: name,
      phone: phone,
      address: address,
      damageType: damageType,
      jobId: jobId,
      status: 'En Route (Priority 1)',
      eta: '24-28 Minutes',
      technician: 'David Vance (Master Restorer)',
      mobileUnit: 'AQ-42 High-Capacity Extraction Unit',
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    localStorage.setItem('aquashield_user', JSON.stringify(dispatchData));
    localStorage.setItem('aquashield_active_dispatch', JSON.stringify(dispatchData));
    sessionStorage.setItem('aquashield_dispatch_success', `✓ Emergency Crew Dispatched to ${address} for ${damageType}! Mobile Unit AQ-42 is en route (ETA: 28 min).`);

    showToast(`🚨 Priority Dispatch Alerted! Unit AQ-42 is en route to ${address}.`, 'success');

    // Display in-place confirmation within the Hero Rapid Dispatch Card (No redirect to dashboard)
    const heroCard = dispatchForm.closest('.hero-dispatch-card');
    if (heroCard) {
      const originalHeader = heroCard.querySelector('.dispatch-header');
      if (originalHeader) {
        originalHeader.innerHTML = `
          <span class="dispatch-status-indicator" style="background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.5); color: #34d399;">
            <span class="pulse-green"></span>
            Priority 1 Crew En Route
          </span>
          <h3 style="color: #34d399; margin-top: 8px;">Dispatch Confirmed</h3>
          <p style="color: #cbd5e1;">Rapid Extraction Unit AQ-42 has been deployed to your location.</p>
        `;
      }

      dispatchForm.style.display = 'none';

      let confirmationView = heroCard.querySelector('.dispatch-inline-confirmed');
      if (!confirmationView) {
        confirmationView = document.createElement('div');
        confirmationView.className = 'dispatch-inline-confirmed';
        heroCard.appendChild(confirmationView);
      }

      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      confirmationView.innerHTML = `
        <div style="background: rgba(10, 25, 47, 0.85); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--radius-sm, 8px); padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px; margin-bottom: 10px;">
            <span style="color: #94a3b8; font-size: 0.82rem;">Dispatch Ticket ID</span>
            <span style="color: #38bdf8; font-family: monospace; font-weight: 700; font-size: 0.95rem;">#${jobId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px; margin-bottom: 10px;">
            <span style="color: #94a3b8; font-size: 0.82rem;">Estimated ETA</span>
            <span style="color: #f59e0b; font-weight: 700; font-size: 0.9rem;">⏱️ 24 - 28 Minutes</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px; margin-bottom: 10px;">
            <span style="color: #94a3b8; font-size: 0.82rem;">Assigned Unit</span>
            <span style="color: #ffffff; font-size: 0.85rem; font-weight: 600;">AQ-42 Extraction Unit</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px; margin-bottom: 10px;">
            <span style="color: #94a3b8; font-size: 0.82rem;">Lead Specialist</span>
            <span style="color: #ffffff; font-size: 0.85rem; font-weight: 600;">David Vance (Master)</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="color: #94a3b8; font-size: 0.82rem;">Destination</span>
            <span style="color: #ffffff; font-size: 0.85rem; text-align: right; max-width: 60%; word-break: break-word;">${escapeHtml(address)}</span>
          </div>
        </div>

        <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-sm, 8px); padding: 12px 14px; margin-bottom: 16px;">
          <p style="margin: 0; color: #fca5a5; font-size: 0.78rem; line-height: 1.45;">
            ⚠️ <strong>Immediate Action:</strong> Shut off main water intake valve if safe to access. Driver will call <strong>${escapeHtml(phone)}</strong> upon arrival.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="tel:8005550199" class="btn btn-emergency" style="width: 100%; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span>Call Live Dispatch: (800) 555-0199</span>
          </a>
          <button type="button" class="btn btn-outline" id="resetHeroDispatchFormBtn" style="width: 100%; font-size: 0.85rem; border-color: rgba(255, 255, 255, 0.25); color: #cbd5e1;">
            Submit Another Incident
          </button>
        </div>
      `;

      confirmationView.style.display = 'block';

      const resetBtn = document.getElementById('resetHeroDispatchFormBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          confirmationView.style.display = 'none';
          dispatchForm.style.display = 'block';
          dispatchForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            if (btnText) {
              btnText.textContent = 'Dispatch Emergency Crew Now';
            }
          }
          if (originalHeader) {
            originalHeader.innerHTML = `
              <span class="dispatch-status-indicator">
                <span class="pulse-green"></span>
                Dispatch Units Available Now
              </span>
              <h3>Emergency Rapid Dispatch</h3>
              <p>Submit immediate incident details for priority fleet assignment.</p>
            `;
          }
        });
      }
    }
  });
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'warning') toast.style.borderLeftColor = 'var(--warning)';
  if (type === 'error') toast.style.borderLeftColor = 'var(--emergency)';

  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ----------------------------------------------------
   7. Animated Live Stats Counter
   ---------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';

        if (!isNaN(countTo)) {
          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = countTo / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= countTo) {
              target.textContent = `${prefix}${countTo.toLocaleString()}${suffix}`;
              clearInterval(timer);
            } else {
              target.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
            }
          }, stepTime);
        }
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

/* ----------------------------------------------------
   8. Password Visibility Toggles
   ---------------------------------------------------- */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.btn-toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-input-wrap').querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>`;
      } else {
        input.type = 'password';
        btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
      }
    });
  });
}

/* ----------------------------------------------------
   9. Interactive Cost Estimator (Pricing & Home 2)
   ---------------------------------------------------- */
function initCostEstimator() {
  const sqftInput = document.getElementById('calcSqft');
  const waterType = document.getElementById('calcWaterType');
  const standingWater = document.getElementById('calcStandingWater');
  const priceDisplay = document.getElementById('calcEstimatedTotal');

  if (!sqftInput || !priceDisplay) return;

  function calculate() {
    const sqft = parseFloat(sqftInput.value) || 500;
    const catMultiplier = waterType ? parseFloat(waterType.value) : 1.0;
    const waterDepthMultiplier = standingWater ? parseFloat(standingWater.value) : 1.0;

    // Base restoration rate per sqft ~$3.75 - $5.50
    const baseRate = 4.20;
    const estimatedCost = Math.round(sqft * baseRate * catMultiplier * waterDepthMultiplier);
    
    // Formatting currency
    priceDisplay.textContent = `$${estimatedCost.toLocaleString()} - $${Math.round(estimatedCost * 1.35).toLocaleString()}`;
  }

  sqftInput.addEventListener('input', calculate);
  if (waterType) waterType.addEventListener('change', calculate);
  if (standingWater) standingWater.addEventListener('change', calculate);

  calculate();
}

/* ----------------------------------------------------
   10. Countdown Timer (Coming Soon page)
   ---------------------------------------------------- */
function initCountdownTimer() {
  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minsEl = document.getElementById('timerMins');
  const secsEl = document.getElementById('timerSecs');

  if (!daysEl) return;

  // Set target date 30 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = d < 10 ? '0' + d : d;
    if (hoursEl) hoursEl.textContent = h < 10 ? '0' + h : h;
    if (minsEl) minsEl.textContent = m < 10 ? '0' + m : m;
    if (secsEl) secsEl.textContent = s < 10 ? '0' + s : s;
  }

  setInterval(update, 1000);
  update();
}

/* ==========================================================================
   Mobile Brand Logo Subtitle Enforcer
   Guarantees 'EMERGENCY RESTORATION' is always displayed on mobile phones
   ========================================================================== */
function enforceMobileLogoSubtitle() {
  const subtitles = document.querySelectorAll('.logo-text p, .mobile-topbar-logo .logo-text p, .site-logo .logo-text p');
  subtitles.forEach(function(el) {
    el.style.setProperty('display', 'block', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.style.setProperty('opacity', '1', 'important');
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enforceMobileLogoSubtitle);
} else {
  enforceMobileLogoSubtitle();
}
window.addEventListener('load', enforceMobileLogoSubtitle);
window.addEventListener('resize', enforceMobileLogoSubtitle);

