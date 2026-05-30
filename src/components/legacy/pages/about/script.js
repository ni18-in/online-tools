// Mobile Menu Toggle
    const menuButtonAbout = document.querySelector('[aria-controls="mobile-menu-about"]');
    const mobileMenuAbout = document.getElementById('mobile-menu-about');
    const mobileMenuIconAbout = menuButtonAbout ? menuButtonAbout.querySelector('svg') : null;
    const menuIconPathAbout = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />';
    const closeIconPathAbout = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';

    if (menuButtonAbout && mobileMenuAbout && mobileMenuIconAbout) {
      menuButtonAbout.addEventListener('click', () => {
        const isExpanded = menuButtonAbout.getAttribute('aria-expanded') === 'true';
        menuButtonAbout.setAttribute('aria-expanded', !isExpanded);
        mobileMenuAbout.classList.toggle('hidden');
        mobileMenuIconAbout.innerHTML = isExpanded ? menuIconPathAbout : closeIconPathAbout;
      });
    }

    // Set Current Year in Footer
    const yearSpanAbout = document.getElementById('currentYearAbout');
    if (yearSpanAbout) {
        yearSpanAbout.textContent = new Date().getFullYear();
    }
