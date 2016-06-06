(function () {
    /**
     * Config
     */
    var config = {
        menu: {
            el: undefined,
            top: undefined,
            height: undefined,
            isFixed: undefined
        },
        queue: {
            scroll: false
        },
        body: {
            el: undefined
        }
    };

    /**
     * Control sticky header's config
     */
    var initHeaderConfig = function updateHeader() {
        config.menu.el = document.querySelector('.site-menu');
        config.menu.height = window.getComputedStyle(config.menu.el).getPropertyValue('height');
        config.menu.top = document.querySelector('.site-header').offsetHeight;
        config.body.el = document.querySelector('body');
    };

    /**
     * Update sticky header's position
     */
    var updateHeaderPosition = function updateHeader() {
        var scrollYPos = document.body.scrollTop || document.documentElement.scrollTop;

        if (config.menu.top <= scrollYPos) {
            if (config.menu.isFixed !== true) {
                config.menu.el.classList.add('is-fixed');
                config.body.el.style.paddingTop = config.menu.height;
                config.menu.isFixed = true;
            }
        } else {
            if (config.menu.isFixed !== false) {
                config.menu.el.classList.remove('is-fixed');
                config.body.el.style.paddingTop = 0;
                config.menu.isFixed = false;
            }
        }
    };

    /**
     * Window on scroll - update header
     */
    window.addEventListener('scroll', function (e) {
        // If no scroll event in queue
        if (!config.queue.scroll) {
            config.queue.scroll = true;

            window.requestAnimationFrame(function () {
                updateHeaderPosition();
                config.queue.scroll = false;
            });
        }
    });

    /**
     * Window on load - config as all images are now loaded
     */
    window.addEventListener('load', function (e) {
        updateHeaderPosition();
    });

    /**
     * Init
     */
    initHeaderConfig();
    updateHeaderPosition();
    
})();
