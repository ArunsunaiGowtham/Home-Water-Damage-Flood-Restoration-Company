/**
 * AquaShield Pro - Client Portal & Restoration Job Tracking Engine
 * Manages 10-stage restoration pipeline, active job switching, document downloads, and emergency request intake
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initJobPipelineTracker();
  initDashboardEmergencyForm();
  initDocumentDownloads();
});

/* ----------------------------------------------------
   1. Dashboard Navigation Tabs
   ---------------------------------------------------- */
function initDashboardTabs() {
  const navButtons = document.querySelectorAll('.dash-nav-btn, .sidebar-nav-btn, .tab-pill-btn, .bottom-nav-item[data-target]');
  const sections = document.querySelectorAll('.dash-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      navButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-target') === targetId);
      });
      sections.forEach(s => {
        s.classList.toggle('active', s.id === targetId);
      });

      // Close mobile drawer if present
      const sidebar = document.getElementById('appSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
    });
  });
}

/* ----------------------------------------------------
   2. 10-Stage Job Pipeline Tracker
   Stages:
   1. Emergency Request
   2. Request Received
   3. Crew Assigned
   4. Crew Dispatched
   5. On Site
   6. Inspection
   7. Water Extraction
   8. Drying
   9. Restoration
   10. Completed
   ---------------------------------------------------- */
const jobData = {
  'AQ-9421': {
    id: 'AQ-9421',
    address: '742 Evergreen Terrace, Springfield',
    damageType: 'Burst Pipe - Basment & 1st Floor Living Area',
    currentStage: 8, // Drying
    crewLead: 'David Vance (IICRC Master Restorer #4192)',
    crewPhone: '(800) 555-0199 ext. 104',
    crewEta: 'On Site - Day 2 of Structural Dehumidification',
    carrier: 'State Farm Insurance',
    policyNumber: 'POL-992140',
    claimNumber: 'SF-2026-894102',
    adjuster: 'Sarah Jenkins (Tel: 555-014-9922)',
    preApprovalCode: 'AUTH-SF-99214',
    scopeTotal: '$8,495.00',
    carrierApproved: '$8,495.00',
    deductible: '$1,000.00',
    balanceDue: '$0.00'
  },
  'AQ-8830': {
    id: 'AQ-8830',
    address: '1048 Ocean Avenue, Coastal Heights',
    damageType: 'Flash Flood Storm Intrusion',
    currentStage: 10, // Completed
    crewLead: 'Marcus Miller (Senior Disaster Specialist)',
    crewPhone: '(800) 555-0199 ext. 108',
    crewEta: 'Work Completed & Final Insurance Sign-off Delivered',
    carrier: 'Allstate Insurance',
    policyNumber: 'POL-771890',
    claimNumber: 'AL-902-3341',
    adjuster: 'Robert Gomez (Tel: 555-019-3388)',
    preApprovalCode: 'AUTH-AL-88301',
    scopeTotal: '$14,850.00',
    carrierApproved: '$14,850.00',
    deductible: '$1,500.00',
    balanceDue: '$0.00'
  }
};

function initJobPipelineTracker() {
  const jobSelector = document.getElementById('activeJobSelector');
  const jobSelectorDrawer = document.getElementById('activeJobSelectorDrawer');
  const nextStageBtn = document.getElementById('btnSimulateNextStage');
  const resetStageBtn = document.getElementById('btnResetStage');

  function syncAndRender(val) {
    if (jobSelector && jobSelector.value !== val) jobSelector.value = val;
    if (jobSelectorDrawer && jobSelectorDrawer.value !== val) jobSelectorDrawer.value = val;
    renderJobState(val);
  }

  if (jobSelector) {
    jobSelector.addEventListener('change', () => {
      syncAndRender(jobSelector.value);
    });
  }

  if (jobSelectorDrawer) {
    jobSelectorDrawer.addEventListener('change', () => {
      syncAndRender(jobSelectorDrawer.value);
    });
  }

  if (nextStageBtn) {
    nextStageBtn.addEventListener('click', () => {
      const activeJobId = jobSelector ? jobSelector.value : 'AQ-9421';
      if (jobData[activeJobId] && jobData[activeJobId].currentStage < 10) {
        jobData[activeJobId].currentStage++;
        renderJobState(activeJobId);
        showToast(`Job ${activeJobId} advanced to Stage ${jobData[activeJobId].currentStage}`);
      } else {
        showToast(`Job ${activeJobId} has already reached completion!`);
      }
    });
  }

  if (resetStageBtn) {
    resetStageBtn.addEventListener('click', () => {
      const activeJobId = jobSelector ? jobSelector.value : 'AQ-9421';
      if (jobData[activeJobId]) {
        jobData[activeJobId].currentStage = 1;
        renderJobState(activeJobId);
        showToast(`Job ${activeJobId} reset to Stage 1 (Emergency Request)`);
      }
    });
  }

  // Initial render
  renderJobState('AQ-9421');
}

function renderJobState(jobId) {
  const job = jobData[jobId];
  if (!job) return;

  const currentStage = job.currentStage;
  const pipelineSteps = document.querySelectorAll('.pipeline-step');

  pipelineSteps.forEach((step, idx) => {
    const stepNumber = idx + 1;
    step.classList.remove('completed', 'active');

    if (stepNumber < currentStage) {
      step.classList.add('completed');
    } else if (stepNumber === currentStage) {
      step.classList.add('active');
    }
  });

  // Update Metadata Text
  const jobBadge = document.getElementById('currentJobIdBadge');
  const jobAddress = document.getElementById('currentJobAddress');
  const jobCrewLead = document.getElementById('currentCrewLead');
  const jobStatusBadge = document.getElementById('currentJobStatusBadge');
  const jobClaimNum = document.getElementById('currentClaimNum');

  if (jobBadge) jobBadge.textContent = `Job #${job.id}`;
  if (jobAddress) jobAddress.textContent = job.address;
  if (jobCrewLead) jobCrewLead.textContent = job.crewLead;
  if (jobClaimNum) jobClaimNum.textContent = job.claimNumber;

  // Update Claim Estimates KPIs & Carrier Banner
  const estScopeTotal = document.getElementById('estScopeTotal');
  const estCarrierApproved = document.getElementById('estCarrierApproved');
  const estDeductible = document.getElementById('estDeductible');
  const estBalanceDue = document.getElementById('estBalanceDue');
  const estCarrierBannerTitle = document.getElementById('estCarrierBannerTitle');
  const estCarrierClaimNum = document.getElementById('estCarrierClaimNum');
  const estCarrierAdjuster = document.getElementById('estCarrierAdjuster');
  const estCarrierAuthCode = document.getElementById('estCarrierAuthCode');

  if (estScopeTotal && job.scopeTotal) estScopeTotal.textContent = job.scopeTotal;
  if (estCarrierApproved && job.carrierApproved) estCarrierApproved.textContent = job.carrierApproved;
  if (estDeductible && job.deductible) estDeductible.textContent = job.deductible;
  if (estBalanceDue && job.balanceDue) estBalanceDue.textContent = job.balanceDue;
  if (estCarrierBannerTitle && job.carrier && job.policyNumber) {
    estCarrierBannerTitle.textContent = `Direct Insurance Carrier Billing Approved • ${job.carrier} Policy #${job.policyNumber}`;
  }
  if (estCarrierClaimNum && job.claimNumber) estCarrierClaimNum.textContent = job.claimNumber;
  if (estCarrierAdjuster && job.adjuster) estCarrierAdjuster.textContent = job.adjuster;
  if (estCarrierAuthCode && job.preApprovalCode) estCarrierAuthCode.textContent = job.preApprovalCode;

  const stageNames = [
    'Emergency Request', 'Request Received', 'Crew Assigned', 'Crew Dispatched',
    'On Site', 'Inspection', 'Water Extraction', 'Drying', 'Restoration', 'Completed'
  ];

  if (jobStatusBadge) {
    jobStatusBadge.textContent = `Current Stage: ${stageNames[currentStage - 1]}`;
    if (currentStage === 10) {
      jobStatusBadge.className = 'badge-status success';
    } else {
      jobStatusBadge.className = 'badge-status primary';
    }
  }
}

/* ----------------------------------------------------
   3. Document Download Simulation
   ---------------------------------------------------- */
function initDocumentDownloads() {
  const downloadBtns = document.querySelectorAll('.btn-download-doc');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docName = btn.getAttribute('data-doc') || 'Document';
      showToast(`Downloading: ${docName}.pdf (Insurance Certified Copy)`, 'info');
    });
  });
}

/* ----------------------------------------------------
   4. Submit Emergency Request from Client Dashboard
   ---------------------------------------------------- */
function initDashboardEmergencyForm() {
  const form = document.getElementById('dashNewRequestForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = form.querySelector('[name="dash_address"]').value;
    const damage = form.querySelector('[name="dash_damage"]').value;

    if (!address.trim()) {
      showToast('Please specify the damaged property address.', 'warning');
      return;
    }

    // Create a new simulated job
    const newId = 'AQ-' + Math.floor(1000 + Math.random() * 9000);
    jobData[newId] = {
      id: newId,
      address: address,
      damageType: damage,
      currentStage: 2, // Request Received
      crewLead: 'Dispatched to On-Call Response Unit #3',
      crewPhone: '(800) 555-0199',
      crewEta: 'Unit En Route (~35 min)',
      carrier: 'Pending Insurance Intake',
      claimNumber: 'Pending Carrier Assignment',
      adjuster: 'Assigned upon claim filing'
    };

    // Add to selector
    const jobSelector = document.getElementById('activeJobSelector');
    const jobSelectorDrawer = document.getElementById('activeJobSelectorDrawer');
    if (jobSelector) {
      const opt = document.createElement('option');
      opt.value = newId;
      opt.textContent = `Job #${newId} - ${address.substring(0, 25)}...`;
      jobSelector.appendChild(opt);
      jobSelector.value = newId;
    }
    if (jobSelectorDrawer) {
      const opt2 = document.createElement('option');
      opt2.value = newId;
      opt2.textContent = `Job #${newId} - ${address.substring(0, 25)}...`;
      jobSelectorDrawer.appendChild(opt2);
      jobSelectorDrawer.value = newId;
    }

    form.reset();
    showToast(`Emergency Job #${newId} opened! Response crew alerted.`, 'success');

    // Switch back to overview tab
    const overviewBtn = document.querySelector('[data-target="dashOverview"]');
    if (overviewBtn) overviewBtn.click();
    renderJobState(newId);
  });
}
