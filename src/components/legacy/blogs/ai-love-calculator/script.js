// Mobile Menu Toggle
        const menuButtonPost = document.querySelector('[aria-controls="mobile-menu-post"]');
        const mobileMenuPost = document.getElementById('mobile-menu-post');
        const mobileMenuIconPost = menuButtonPost ? menuButtonPost.querySelector('svg') : null;
        const menuIconPathPost = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />';
        const closeIconPathPost = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';

        if (menuButtonPost && mobileMenuPost && mobileMenuIconPost) {
            menuButtonPost.addEventListener('click', () => {
                const isExpanded = menuButtonPost.getAttribute('aria-expanded') === 'true';
                menuButtonPost.setAttribute('aria-expanded', !isExpanded);
                mobileMenuPost.classList.toggle('hidden');
                mobileMenuIconPost.innerHTML = isExpanded ? menuIconPathPost : closeIconPathPost;
            });
        }

        // Set Current Year in Footer
        const yearSpanPost = document.getElementById('currentYearPost');
        if (yearSpanPost) {
            yearSpanPost.textContent = new Date().getFullYear();
        }
