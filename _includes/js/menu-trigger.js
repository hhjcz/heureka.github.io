(function () {
    /**
     * Config
     */
    var config = {
        trigger: {
            el: undefined
        },
        icon: {
            el: undefined,
            isExpanded: undefined
        }
    };

    /**
     * Init config on load
     */
    var initConfig = function initConfig() {
        config.trigger.el = document.querySelector('.js-site-nav__trigger');
        config.icon.el = document.querySelector('.js-site-nav-icon');
        config.icon.isExpanded = !!config.trigger.el.getAttribute('aria-expanded');
    };

    /**
     * Add event listeners
     */
    var setupEventListeners = function setHooks() {
        config.icon.el.addEventListener('click', function (e) {
            // Update UI
            if (config.icon.isExpanded) {
                config.trigger.el.setAttribute('aria-expanded', 'false');
                config.trigger.el.classList.remove('is-active');
                config.icon.el.classList.remove('is-active');
            } else {
                config.trigger.el.setAttribute('aria-expanded', 'true');
                config.trigger.el.classList.add('is-active');
                config.icon.el.classList.add('is-active');
            }

            // Invert state
            config.icon.isExpanded = !config.icon.isExpanded;
        });
    };

    /**
     * Window on load - config as all images are now loaded
     */
    window.addEventListener('load', function (e) {
        initConfig();
        setupEventListeners();
    });

})();
