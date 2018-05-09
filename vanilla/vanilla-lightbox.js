/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    console, FontFaceObserver
*/

(function () {
    "use strict";
    // Add swipe support
    var sd = 20,
        ce = function (e, n) {
            var a = document.createEvent("CustomEvent");
            a.initCustomEvent(n, true, true, e.target);
            e.target.dispatchEvent(a);
            a = null;
            return false;
        },
        nm = true,
        sp = {x: 0, y: 0},
        ep = {x: 0, y: 0},
        a = 0,
        touch = {
            touchstart: function (e) {
                sp = {x: e.touches[0].pageX, y: e.touches[0].pageY};
            },
            touchmove: function (e) {
                nm = false;
                ep = {x: e.touches[0].pageX, y: e.touches[0].pageY};
            },
            touchend: function (e) {
                if (nm) {
                    ce(e, 'fc');
                } else {
                    var x = ep.x - sp.x,
                        xr = Math.abs(x),
                        y = ep.y - sp.y,
                        yr = Math.abs(y);

                    if (Math.max(xr, yr) > sd) {
                        ce(e, (xr > yr ? (x < 0 ? 'swipeleft' : 'swiperight') : (y < 0 ? 'swipeup' : 'swipedown')));
                    }
                }
                nm = true;
            },
            touchcancel: function (e) {
                nm = false;
            }
        };

    for (a in touch) {
        if (touch.hasOwnProperty(a)) {
            document.addEventListener(a, touch[a], false);
        }
    }
}());

(function () {
    "use strict";

    var Rietveld = {
        config: {
            windowWidth: document.getElementsByTagName("html")[0].clientWidth,
            headerHeight: document.getElementsByTagName("header")[0].clientHeight,
            rem: window.getComputedStyle(document.getElementsByTagName("body")[0], null).getPropertyValue("font-size").replace("px", ""),
            mqSmall: 480,
            mqMedium: 768,
            mqLarge: 1024,
            minValue: 0,
            maxValue: 1500
        },

        init: function () {
            if (/Mobi/.test(navigator.userAgent)) {
                document.getElementsByTagName("html")[0].classList.add('is-mobile');
            }

            // Font loader
            /*var observer = new FontFaceObserver('Lato');
            observer.check().then(function () {
                document.getElementsByTagName("html")[0].classList.add('font-loaded');
            });*/

            // Lightbox

            if (document.getElementsByClassName("caroussel-item").length > 0) {
                Rietveld.lightbox();
            }
        },

        lightbox: function () {
            var aItems = [],
                lbContent = "",
                lbTravel = 0,
                lbItemsCount = document.getElementsByClassName("caroussel-item").length,
                lbWidth = (lbItemsCount - 1) * 100;

            function prev() {
                if (lbTravel > 0) {
                    lbTravel -= 100;

                    document.querySelector(".lb-container").style.marginLeft = "-" + lbTravel + "%";

                    if (lbTravel === 0) {
                        document.getElementsByClassName("lb-prev")[0].style.display = "none";
                    } else {
                        document.getElementsByClassName("lb-prev")[0].style.display = "block";
                        document.getElementsByClassName("lb-next")[0].style.display = "block";
                    }
                }
            }

            function next() {
                if (lbTravel < lbWidth) {
                    lbTravel += 100;

                    document.querySelector(".lb-container").style.marginLeft = "-" + lbTravel + "%";

                    if (lbTravel === lbWidth) {
                        document.getElementsByClassName("lb-next")[0].style.display = "none";
                    } else {
                        document.getElementsByClassName("lb-prev")[0].style.display = "block";
                        document.getElementsByClassName("lb-next")[0].style.display = "block";
                    }
                }
            }

            aItems = document.querySelectorAll('.caroussel-item a');

            Array.prototype.forEach.call(aItems, function (anchor, i) {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();

                    var lbItemsCurrent = i;

                    lbTravel = lbItemsCurrent * 100;

                    if (lbItemsCount > 0) {
                        if (document.querySelector(".lb-container") === null) {
                            document.querySelector(".article-photos-list").insertAdjacentHTML('afterend', '<div class="lb-overlay"><button class="lb-close"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#ffffff" d="M8 4L4 8 12 16l-8 8 4 4 8-8 8 8 4-4-8-8 8-8-4-4L16 12z"/></svg></button><button class="lb-prev"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="96" viewBox="0 0 32 96"><path fill="#ffffff" d="M8 48l12-32.774 4 2.048L12 48l12 30.726-4 2.048z"/></svg></button><button class="lb-next"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="96" viewBox="0 0 32 96"><path fill="#ffffff" d="M24 48L12 16l-4 2 12 30L8 78l4 2z"/></svg></button><ul class="lb-container"></ul></div>');
                        }

                        document.getElementsByClassName("lb-prev")[0].style.display = "block";
                        document.getElementsByClassName("lb-next")[0].style.display = "block";

                        if (lbItemsCurrent === 0) {
                            document.getElementsByClassName("lb-prev")[0].style.display = "none";
                        }

                        if (lbItemsCurrent + 1 === lbItemsCount) {
                            document.getElementsByClassName("lb-next")[0].style.display = "none";
                        }

                        Array.prototype.forEach.call(aItems, function (anchor, i) {
                            lbContent += '<li><img src="' + aItems[i].getAttribute("href") + '" alt=""></li>';
                        });

                        if (lbItemsCurrent > 0) {
                            document.querySelector(".lb-container").style.marginLeft = "-" + lbTravel + "%";
                        }

                        document.querySelector(".lb-container").innerHTML = lbContent;
                        document.querySelector(".lb-container").classList.add("has-transition");

                        //$('.lb-overlay').fadeIn();
                    }

                });
            });

            document.documentElement.addEventListener('click', function (e) {
                if (e.target.closest('.lb-prev')) {
                    e.stopPropagation();
                    prev();
                    return;
                }

                if (e.target.closest('.lb-next')) {
                    e.stopPropagation();
                    next();
                    return;
                }

                if (e.target.closest('.lb-overlay, .lb-close')) {
                    document.querySelector('.lb-overlay').parentNode.removeChild(document.querySelector('.lb-overlay'));

                    // FADEOUT
                }
            });

            document.addEventListener('swipeleft', function (e) {
                next();
            });

            document.addEventListener('swiperight', function (e) {
                prev();
            });
        }
    };

    Rietveld.init();

}());
