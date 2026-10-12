/**
 * AquaShield Pro - Blog Filter & Search Controller
 * Live category filtering, multi-field instant search, URL parameter syncing, and category badges
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.blog-filter-btn');
  const searchInput = document.getElementById('blogSearchInput');
  const searchClearBtn = document.getElementById('clearSearchBtn');
  const blogCards = document.querySelectorAll('.blog-card');
  const noResultsEl = document.getElementById('blogNoResults');
  const resultsCounter = document.getElementById('blogResultsCount');
  const categoryBadges = document.querySelectorAll('.blog-category-badge, .blog-cat-badge');

  if (!blogCards.length) return;

  function normalize(str) {
    return (str || '').toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Pre-calculate and display article counts for each category button
  const counts = { all: blogCards.length };
  blogCards.forEach(card => {
    const cat = normalize(card.getAttribute('data-category'));
    counts[cat] = (counts[cat] || 0) + 1;
  });

  filterButtons.forEach(btn => {
    const cat = normalize(btn.getAttribute('data-category'));
    const count = counts[cat] || (cat === 'all' ? blogCards.length : 0);
    const countBadge = btn.querySelector('.filter-count');
    if (countBadge) {
      countBadge.textContent = count;
    }
  });

  let currentCategory = 'all';
  let searchQuery = '';

  // Check URL query parameters for pre-selected category (e.g. blog.html?category=mold-prevention)
  const urlParams = new URLSearchParams(window.location.search);
  const paramCat = urlParams.get('category');
  if (paramCat) {
    const normalizedParam = normalize(paramCat);
    filterButtons.forEach(btn => {
      if (normalize(btn.getAttribute('data-category')) === normalizedParam) {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = normalizedParam;
      }
    });
  }

  // Category Filter Button Click
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = normalize(btn.getAttribute('data-category'));
      applyFilters();
    });
  });

  // Card Category Badge Click to Filter
  categoryBadges.forEach(badge => {
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = badge.closest('.blog-card');
      if (card) {
        const cat = normalize(card.getAttribute('data-category'));
        filterButtons.forEach(btn => {
          if (normalize(btn.getAttribute('data-category')) === cat) {
            btn.click();
            document.querySelector('.blog-controls-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });
  });

  // Search Input Trigger
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = normalize(e.target.value);
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  // Search Clear Button
  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClearBtn.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }

  function applyFilters() {
    let visibleCount = 0;

    blogCards.forEach(card => {
      const cardCategory = normalize(card.getAttribute('data-category'));
      const titleEl = card.querySelector('h3, .blog-title');
      const excerptEl = card.querySelector('p, .blog-excerpt');
      const authorEl = card.querySelector('.blog-meta');

      const cardTitle = titleEl ? titleEl.textContent.toLowerCase() : '';
      const cardExcerpt = excerptEl ? excerptEl.textContent.toLowerCase() : '';
      const cardAuthor = authorEl ? authorEl.textContent.toLowerCase() : '';

      // Check Category match
      const matchesCategory = currentCategory === 'all' ||
                              cardCategory === currentCategory ||
                              cardCategory.includes(currentCategory) ||
                              currentCategory.includes(cardCategory);

      // Check Search Query in Title, Category, Excerpt, or Author
      const matchesSearch = searchQuery === '' ||
                            cardTitle.includes(searchQuery) ||
                            cardCategory.includes(searchQuery) ||
                            cardExcerpt.includes(searchQuery) ||
                            cardAuthor.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update Counter
    if (resultsCounter) {
      if (currentCategory === 'all' && !searchQuery) {
        resultsCounter.textContent = `Showing all ${visibleCount} articles`;
      } else if (searchQuery) {
        resultsCounter.textContent = `Found ${visibleCount} article${visibleCount === 1 ? '' : 's'} matching "${searchQuery}"`;
      } else {
        const activeBtn = document.querySelector('.blog-filter-btn.active');
        const catName = activeBtn ? activeBtn.getAttribute('data-name') || activeBtn.textContent.replace(/\(\d+\)/, '').trim() : currentCategory;
        resultsCounter.textContent = `Showing ${visibleCount} article${visibleCount === 1 ? '' : 's'} in ${catName}`;
      }
    }

    // Toggle Empty State Message
    if (noResultsEl) {
      if (visibleCount === 0) {
        noResultsEl.style.display = 'block';
      } else {
        noResultsEl.style.display = 'none';
      }
    }
  }

  // Initial Filter Application on load
  applyFilters();
});
