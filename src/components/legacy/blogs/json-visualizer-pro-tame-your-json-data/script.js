// Mobile Menu Toggle
    const menuButtonJsonPost = document.querySelector('[aria-controls="mobile-menu-json-post"]');
    const mobileMenuJsonPost = document.getElementById('mobile-menu-json-post');
    const mobileMenuIconJsonPost = menuButtonJsonPost ? menuButtonJsonPost.querySelector('svg') : null;
    const menuIconPathJsonPost = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />';
    const closeIconPathJsonPost = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';

    if (menuButtonJsonPost && mobileMenuJsonPost && mobileMenuIconJsonPost) {
      menuButtonJsonPost.addEventListener('click', () => {
        const isExpanded = menuButtonJsonPost.getAttribute('aria-expanded') === 'true';
        menuButtonJsonPost.setAttribute('aria-expanded', !isExpanded);
        mobileMenuJsonPost.classList.toggle('hidden');
        mobileMenuIconJsonPost.innerHTML = isExpanded ? menuIconPathJsonPost : closeIconPathJsonPost;
      });
    }

    // Set Current Year in Footer
    const yearSpanJsonPost = document.getElementById('currentYearJsonPost');
    if (yearSpanJsonPost) {
        yearSpanJsonPost.textContent = new Date().getFullYear();
    }
