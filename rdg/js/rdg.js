(function () {
    "use strict";

    function QS(el) {
        return document.querySelector(el);
    }

    function QSA(el) {
        return document.querySelectorAll(el);
    }

    var components = {
        myrietveld: function (el) {
            [].forEach.call(el.querySelectorAll('.u-button-myrietveld'), function (anchor) {
                anchor.addEventListener('click', function (e) {
                    if (!this.classList.contains('u-button-myrietveld-added')) {
                        this.classList.add('u-button-myrietveld-added');
                    } else {
                        this.classList.remove('u-button-myrietveld-added');
                    }
                });
            });
        },

        navigation: function(el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                el.parentNode.classList.toggle('u-nav-visible');
            });

            [].forEach.call(el.parentNode.querySelectorAll('a'), function (anchor) {
                anchor.addEventListener('click', function (e) {
                    anchor.closest('header').classList.remove('u-nav-visible');
                });
            });
        },

        formvalidation: function(el){

            [].forEach.call(el.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]'), function (anchor, i) {
                // Prefilled
                if (anchor.getAttribute('required') === 'required' && anchor.value.length > 0) {
                    anchor.parentNode.classList.add('u-has-validation');
                }

                // After input
                anchor.addEventListener('blur', function () {
                    if (this.getAttribute('required') === 'required') {
                        this.parentNode.classList.add('u-has-validation');
                    }
                });
            });

            // On submit
            // [].forEach.call(el.querySelectorAll('input[type="checkbox"]'), function (anchor, i) {
            //     if (anchor.getAttribute('required') === 'required' && anchor.getAttribute('checked') === false) {
            //         anchor.parentNode.classList.add('u-has-validation');
            //     }
            // });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Check for components
        var componentList = QSA('[data-component]');

        // Run functions/methods
        [].forEach.call(componentList, function (component) {
            if(component.dataset.component) {
                components[component.dataset.component](component);
            } else {
                console.log(components.dataset.component + ' does not exist');
            }
        });
    });
})();
