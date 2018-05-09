/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    console, alert, confirm, algoliasearch, CustomEvent
*/

// TRANSLATIONS

// var langEntries = {
//     searchClose: '[js_searchClose]',
//     filterShow: '[js_filterShow]',
//     filterHide: '[js_filterHide]',
//     filterClose: '[js_filterClose]',
//     filterShowExtended: '[js_filterShowExtended]',
//     filterHideExtended: '[js_filterHideExtended]',
//     carrouselPrev: '[js_carrouselPrev]',
//     carrouselNext: '[js_carrouselNext]',
//     showAll: '[js_showAll]',
//     faqDelete: '[js_faqDelete]'
// };

var langEntries = {
    searchClose: '[js_searchClose]',
    filterShow: '[js_filterShow]',
    filterHide: '[js_filterHide]',
    filterClose: '[js_filterClose]',
    filterShowExtended: 'Toon meer',
    filterHideExtended: 'Toon minder',
    carrouselPrev: '[js_carrouselPrev]',
    carrouselNext: '[js_carrouselNext]',
    showAll: '[js_showAll]',
    faqDelete: '[js_faqDelete]'
};

// SWIPE

(function () {
    "use strict";
    var sd = 20,
        ce = function (e, n) {
            var a = document.createEvent('CustomEvent');
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



// Nieuwe opzet, op basis van templates

(function () {
    "use strict";

    // Helper functions
    function QS(el) {
        return document.querySelector(el);
    }

    function QSA(el) {
        return document.querySelectorAll(el);
    }

    function ISINT(n) {
        return Number(n) === n && n % 1 === 0;
    }

    function AJAX(url, success, fail) {
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                if (typeof success === 'function') {
                    success.call(request);
                }
            } else {
                if (typeof success === 'function') {
                    fail();
                }
            }
        };

        request.send();
    }

    function MQL(breakpoint, listenerfunction) {
        var mql = window.matchMedia(breakpoint);

        mql.addListener(listenerfunction);

        listenerfunction(mql);
    }

    // Template functions (terminology ;) )
    var eventHandlers = {},
        article = {
            init: function () {
                article.lightbox();
                article.myrietveld();
                article.stockalert();
                article.tabs();

                MQL('(min-width: 768px)', article.setrelated);
            },

            lightbox: function () {
                var aItems = [],
                    lbContent = '',
                    lbTravel = 0,
                    lbItemsCount = document.getElementsByClassName('caroussel-item').length,
                    lbWidth = (lbItemsCount - 1) * 100;

                function prev() {
                    if (lbTravel > 0) {
                        lbTravel -= 100;

                        QS('.lb-container').style.marginLeft = '-' + lbTravel + '%';

                        if (lbTravel === 0) {
                            document.getElementsByClassName('lb-prev')[0].style.display = 'none';
                        } else {
                            document.getElementsByClassName('lb-prev')[0].style.display = 'block';
                            document.getElementsByClassName('lb-next')[0].style.display = 'block';
                        }
                    }
                }

                function next() {
                    if (lbTravel < lbWidth) {
                        lbTravel += 100;

                        QS('.lb-container').style.marginLeft = '-' + lbTravel + '%';

                        if (lbTravel === lbWidth) {
                            document.getElementsByClassName('lb-next')[0].style.display = 'none';
                        } else {
                            document.getElementsByClassName('lb-prev')[0].style.display = 'block';
                            document.getElementsByClassName('lb-next')[0].style.display = 'block';
                        }
                    }
                }

                aItems = QSA('.caroussel-item a');
                [].forEach.call(aItems, function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();

                        var lbItemsCurrent = i;

                        lbTravel = lbItemsCurrent * 100;

                        if (lbItemsCount > 0) {
                            if (QS('.lb-overlay').innerHTML === '') {
                                QS('.lb-overlay').insertAdjacentHTML('afterbegin', '<button class="lb-close"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#ffffff" d="M8 4L4 8 12 16l-8 8 4 4 8-8 8 8 4-4-8-8 8-8-4-4L16 12z"/></svg></button><button class="lb-prev"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="96" viewBox="0 0 32 96"><path fill="#ffffff" d="M8 48l12-32.774 4 2.048L12 48l12 30.726-4 2.048z"/></svg></button><button class="lb-next"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="96" viewBox="0 0 32 96"><path fill="#ffffff" d="M24 48L12 16l-4 2 12 30L8 78l4 2z"/></svg></button><ul class="lb-container"></ul>');
                            }

                            QS('.lb-container').removeAttribute('style');
                            QS('.lb-container').classList.remove('has-transition');
                            QS('.lb-overlay').classList.add('lb-overlay-visible');

                            document.getElementsByClassName('lb-prev')[0].style.display = 'block';
                            document.getElementsByClassName('lb-next')[0].style.display = 'block';

                            if (lbItemsCurrent === 0) {
                                document.getElementsByClassName('lb-prev')[0].style.display = 'none';
                            }

                            if (lbItemsCurrent + 1 === lbItemsCount) {
                                document.getElementsByClassName('lb-next')[0].style.display = 'none';
                            }

                            [].forEach.call(aItems, function (anchor, i) {
                                lbContent += '<li><img src="' + aItems[i].getAttribute('href') + '" alt=""></li>';
                            });

                            if (lbItemsCurrent > 0) {
                                QS('.lb-container').style.marginLeft = '-' + lbTravel + '%';
                            }

                            QS('.lb-container').innerHTML = lbContent;
                        }
                    });
                });

                document.documentElement.addEventListener('click', function (e) {
                    if (e.target.closest('.lb-prev')) {
                        e.stopPropagation();
                        QS('.lb-container').classList.add('has-transition');
                        prev();
                        return;
                    }

                    if (e.target.closest('.lb-next')) {
                        QS('.lb-container').classList.add('has-transition');
                        e.stopPropagation();
                        next();
                        return;
                    }

                    if (e.target.closest('img')) {
                        e.stopPropagation();
                        return;
                    }

                    if (e.target.closest('.lb-overlay, .lb-close')) {
                        e.stopPropagation();
                        QS('.lb-overlay').classList.remove('lb-overlay-visible', 'has-transition');
                    }
                });

                document.documentElement.addEventListener('swipeleft', function (e) {
                    if (e.target.closest('.lb-overlay')) {
                        QS('.lb-container').classList.add('has-transition');
                        e.preventDefault();
                        next();
                    }
                });

                document.documentElement.addEventListener('swiperight', function (e) {
                    if (e.target.closest('.lb-overlay')) {
                        QS('.lb-container').classList.add('has-transition');
                        e.preventDefault();
                        prev();
                    }
                });
            },

            myrietveld: function () {
                var jx_url,
                    myDataset;

                [].forEach.call(QSA('.button-my-rietveld'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();

                        jx_url = '[HTTP_HOST]/jx_rietveld?action=' + this.dataset.action + '&type=' + this.dataset.eventtype + '&art=' + this.dataset.art;

                        myDataset = this.dataset;

                        AJAX(jx_url,
                            function () {
                                QS('li.' + myDataset.eventtype + ' span.amount').textContent = this.response;

                                if (document.getElementById('button-' + myDataset.eventtype).getAttribute('data-action') === 'add') {
                                    QS('li.' + myDataset.eventtype + '-article').classList.add('is-added');
                                    document.getElementById('button-' + myDataset.eventtype).setAttribute('data-action', 'del');
                                } else {
                                    QS('li.' + myDataset.eventtype + '-article').classList.remove('is-added');
                                    document.getElementById('button-' + myDataset.eventtype).setAttribute('data-action', 'add');
                                }
                            },

                            function () {
                                console.log('SERVER FAIL');
                            });
                    });
                });
            },

            // RELATED MOET HIER NOG TUSSEN (aparte functies?)
            setrelated: function (evt) {
                if (evt.matches) {
                    [].forEach.call(QSA('.related-articles'), function (anchor, i) {
                        article.unsetcaroussel(anchor);
                        article.setexpandinglist(anchor);
                    });
                } else {
                    [].forEach.call(QSA('.related-articles'), function (anchor, i) {
                        article.unsetexpandinglist(anchor);
                        article.setcaroussel(anchor);
                    });
                }
            },

            prev: function (evt) {
                evt.stopPropagation();
                if (this.cPosLeft < 0) {
                    this.cPosLeft += 100;
                    this.querySelector('ul').style.marginLeft = this.cPosLeft + '%';
                    this.querySelector('.next').classList.remove('is-disabled');
                }

                if (this.cPosLeft === 0) {
                    this.querySelector('.prev').classList.add('is-disabled');
                }
            },

            next: function (evt) {
                evt.stopPropagation();
                if (this.cPosLeft > this.cTravel) {
                    this.cPosLeft -= 100;
                    this.querySelector('ul').style.marginLeft = this.cPosLeft + '%';
                    this.querySelector('.prev').classList.remove('is-disabled');
                }

                if (this.cPosLeft === this.cTravel) {
                    this.querySelector('.next').classList.add('is-disabled');
                }
            },

            setcaroussel: function (el) {
                var relatedPrev = article.prev.bind(el),
                    relatedNext = article.next.bind(el);

                el.cItems = el.querySelectorAll('.articles-list li').length;
                el.cShownItems = 1;
                el.cWidth = 0;
                el.cTravel = 0;
                el.cPosLeft = 0;
                el.elCols = 0;
                el.cItems = el.querySelectorAll('.articles-list li').length;

                eventHandlers[el.id] = {
                    relatedPrev: relatedPrev,
                    relatedNext: relatedNext
                };

                // Set number of caroussel items shown
                MQL('(min-width: 480px)', function (evt) {
                    if (evt.matches) {
                        el.cShownItems = 2;
                    } else {
                        el.cShownItems = 1;
                    }

                    el.cWidth = el.cItems * (100 / el.cShownItems);
                    el.cTravel = ((el.cItems - el.cShownItems) * (100 / el.cShownItems)) * -1;
                    el.querySelector('.articles-list ul').style.width = el.cWidth + '%';
                });

                if (el.cItems > 1 && el.querySelectorAll('.prev, .next').length === 0) {
                    el.querySelector('.articles-list').insertAdjacentHTML('afterbegin', '<button class="prev is-disabled"><span class="arrow"></span><span class="sr-only">' + langEntries.carrouselPrev + '</span></button>');
                    el.querySelector('.articles-list').insertAdjacentHTML('beforeend', '<button class="next"><span class="arrow"></span><span class="sr-only">' + langEntries.carrouselNext + '</span></button>');
                }

                el.classList.add('is-caroussel');
                el.querySelector('.articles-list ul').classList.remove('has-grid');
                el.querySelector('.articles-list ul').classList.add('has-flex');

                [].forEach.call(el.querySelectorAll('.articles-list li'), function (anchor, i) {
                    anchor.style.flexBasis = (100 / el.cItems) + '%';
                });

                el.querySelector('.prev').addEventListener('click', relatedPrev);
                el.querySelector('.next').addEventListener('click', relatedNext);
                el.addEventListener('swipeleft', relatedNext);
                el.addEventListener('swiperight', relatedPrev);

            },

            unsetcaroussel: function (el) {
                if (el.classList.contains('is-caroussel')) {
                    var relatedPrev = eventHandlers[el.id].relatedPrev,
                        relatedNext = eventHandlers[el.id].relatedNext;

                    el.classList.remove('is-caroussel');

                    el.querySelector('.articles-list ul').removeAttribute('style');
                    el.querySelector('.articles-list ul').classList.remove('has-flex');
                    el.querySelector('.articles-list ul').classList.add('has-grid');

                    el.removeEventListener('swipeleft', relatedNext);
                    el.removeEventListener('swiperight', relatedPrev);

                    [].forEach.call(el.querySelectorAll('.articles-list li'), function (anchor, i) {
                        anchor.removeAttribute('style');
                    });

                    [].forEach.call(el.querySelectorAll('.prev, .next'), function (anchor, i) {
                        anchor.parentNode.removeChild(anchor);
                    });
                }
            },

            setexpandinglist: function (el) {
                el.elCols = Math.ceil(el.querySelector('ul').offsetWidth / el.querySelector('.article-card').offsetWidth);

                if (el.querySelectorAll('.articles-list li').length > el.elCols && el.querySelector('.articles-list').classList.contains('showing-all-items') === false && (el.elCols === 3 || el.elCols === 4)) {
                    el.querySelector('.articles-list').classList.remove('show-3-items', 'show-4-items');
                    el.querySelector('.articles-list').classList.add('show-' + el.elCols + '-items');

                    if (el.querySelector('.button') === null) {
                        el.querySelector('.articles-list').insertAdjacentHTML('beforeend', '<a href="#show-all-items" class="button">' + langEntries.showAll + '</a>');
                    }

                    el.classList.add('is-expanding-list');

                    // Click event
                    if (el.querySelectorAll('.button').length > 0) {
                        el.querySelector('.button').addEventListener('click', function (e) {
                            e.preventDefault();
                            el.querySelector('.articles-list').classList.add('showing-all-items');
                            el.querySelector('.articles-list').classList.remove('show-3-items', 'show-4-items');
                            this.style.display = 'none';
                        });
                    }
                }
            },

            unsetexpandinglist: function (el) {
                el.querySelector('.articles-list').classList.remove('show-3-items', 'show-4-items', 'showing-all-items');
                el.classList.remove('is-expanding-list');

                if (el.querySelector('.button') !== null) {
                    el.querySelector('.button').parentNode.removeChild(el.querySelector('.button'));
                }
            },

            stockalert: function () {
                var vars;
                if (document.getElementById('frm_in_stock_alert') !== null) {
                    document.getElementById('frm_in_stock_alert').addEventListener('submit', function (e) {
                        e.preventDefault();

                        vars = document.getElementById('frm_in_stock_alert').serialize();

                        AJAX('[HTTP_HOST]/jx_article?' + vars,
                            function () {
                                document.getElementById('frm_in_stock_alert').innerHTML = this.response;
                            },

                            function () {
                                console.log('SERVER FAIL');
                            });
                    });
                }
            },

            tabs: function () {
                [].forEach.call(QSA('#tab-description > a, #tab-specifications > a'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        this.classList.toggle('tab-active');
                    });
                });
            }

        },

        cart = {
            init: function () {
                var item;
                [].forEach.call(QSA('.cart-item-delete'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();

                        item = anchor.getAttribute('id').split('-');

                        AJAX('[HTTP_HOST]/jx_cart?jx=1&aAction[]=del&art=' + item[1],
                            function () {
                                location.reload();
                            },
                            function () {
                                console.log('SERVER FAIL');
                            });
                    });
                });

                [].forEach.call(QSA('.cart-select-amount'), function (anchor, i) {
                    anchor.addEventListener('change', function (e) {
                        e.preventDefault();

                        item = anchor.getAttribute('id').split('-');

                        AJAX('[HTTP_HOST]/jx_cart?jx=1&aAction[]=add&art=' + item[1] + '&amount=' + anchor.value,
                            function () {
                                location.reload();
                            },
                            function () {
                                console.log('SERVER FAIL');
                            });
                    });
                });
            }
        },

        catalogue = {
            init: function () {
                catalogue.filters();
                catalogue.loadarticles();
                catalogue.scrollintoview();
            },

            filters: function () {
                [].forEach.call(QSA('.toggle-filters-panel > a, .filters-panel-close'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        QS('.filters-panel').classList.toggle('filters-panel-visible');
                        QS('.overlay').classList.toggle('overlay-visible');
                    });
                });

                document.documentElement.addEventListener('click', function (e) {
                    if (e.target.closest('.overlay')) {
                        e.preventDefault();
                        QS('.filters-panel').classList.remove('filters-panel-visible');
                        e.target.closest('.overlay').classList.toggle('overlay-visible');
                    }
                });

                [].forEach.call(QSA('.filter-group > a'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        this.classList.toggle('filter-group-visible');
                    });
                });

                [].forEach.call(QSA('.filter-list ul'), function (anchor, i) {
                    if (anchor.childNodes.length > 6 && !anchor.classList.contains('showall')) {
                        anchor.classList.add('filters-list-closed');
                        anchor.insertAdjacentHTML('afterend', '<a href="#' + anchor.getAttribute('id') + '" class="filters-list-toggle button">' + langEntries.filterShowExtended  + '</a>');
                    }
                });

                [].forEach.call(QSA('.filters-list-toggle'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();

                        QS(anchor.getAttribute('href')).classList.toggle('filters-list-closed');

                        if (anchor.textContent === langEntries.filterShowExtended) {
                            anchor.textContent = langEntries.filterHideExtended;
                        } else {
                            anchor.textContent = langEntries.filterShowExtended;
                        }
                    });
                });
            },

            loadarticles: function () {
                document.documentElement.addEventListener('click', function (e) {
                    if (e.target.closest('#show_more_results a')) {
                        e.preventDefault();

                        if (e.target.closest('#show_more_results a').getAttribute('href') !== '') {
                            document.getElementById('loading').style.display = 'block';
                            QS('#show_more_results a').style.display = 'none';

                            AJAX(e.target.closest('#show_more_results a').getAttribute('href') + '&jx=1',
                                function () {
                                    document.getElementById('show_more_results').outerHTML = this.response;
                                },

                                function () {
                                    console.log('SERVER FAIL');
                                });
                        }
                    }
                });
            },

            scrollintoview: function () {
                var art = QS('.articles-list').dataset.scrollintoview;

                if (ISINT(art) === true) {
                    QS('.view' + art).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        },

        compare = {
            init: function () {
                [].forEach.call(QSA('.compare-delete-button'), function (anchor, i) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();

                        AJAX('[HTTP_HOST]/jx_rietveld?action=del&type=compare&art=' + anchor.dataset.art,
                            function () {
                                window.location.href = '[HTTP_HOST]/compare';
                            },

                            function () {
                                console.log('SERVER FAIL');
                            });
                    });
                });
            }
        },

        faq = {
            init: function () {
                document.getElementById('frm-faqfilter').addEventListener('submit', function (e) {
                    e.preventDefault();
                    return false;
                });

                document.getElementById('faqfilter').addEventListener('keyup', function () {
                    var filter = this.value,
                        hasfilter = 0,
                        count = 0,
                        clearbutton = QS('.clear-faqsearch');

                    if (filter.length > 0) {
                        [].forEach.call(QSA('.faq-list-category-toggle'), function (anchor, i) {
                            anchor.checked = true;
                        });

                        if (clearbutton === null) {
                            this.parentNode.insertAdjacentHTML('afterend', '<button class="button clear-faqsearch">' + langEntries.faqDelete + '</button>');
                        }

                        [].forEach.call(QSA('.faq-list-category li'), function (item, i) {
                            [].forEach.call(item.querySelectorAll('label span, .faq-answer p'), function (textnodes, i) {
                                hasfilter = 0;
                                if (textnodes.textContent.search(new RegExp(filter, 'i')) < 0) {
                                    item.style.display = 'none';
                                    item.classList.add('hidden-answer');
                                } else {
                                    item.style.display = 'block';
                                    item.classList.remove('hidden-answer');
                                    hasfilter += 1;
                                }
                            });

                            if (hasfilter > 0) {
                                count += 1;
                            }
                        });
                    } else {
                        clearbutton.parentNode.removeChild(clearbutton);
                        [].forEach.call(QSA('.faq-list-category-toggle'), function (anchor, i) {
                            anchor.checked = false;
                        });
                    }

                    document.getElementById('totalcount').textContent = count;

                    [].forEach.call(QSA('.faq-list-category'), function (anchor, i) {
                        if (anchor.querySelectorAll('.hidden-answer').length === anchor.querySelectorAll('li').length) {
                            anchor.style.display = 'none';
                        } else {
                            anchor.style.display = 'block';
                        }
                    });
                });

                document.documentElement.addEventListener('click', function (e) {
                    if (e.target.closest('.clear-faqsearch')) {
                        document.getElementById('faqfilter').value = '';

                        [].forEach.call(QSA('.faq-list-category-toggle'), function (anchor, i) {
                            anchor.checked = false;
                        });

                        [].forEach.call(QSA('.faq-list-category, .faq-list-category li'), function (anchor, i) {
                            anchor.style.display = 'block';
                        });

                        [].forEach.call(QSA('.hidden-answer'), function (anchor, i) {
                            anchor.classList.remove('hidden-answer');
                        });

                        document.getElementById('totalcount').textContent = QSA('.faq-list-category li').length;
                    }
                });
            }
        },

        form = {
            init: function () {
                form.autocomplete();
                form.billingaddress();
                form.validation();
            },

            autocomplete: function (postcode, streetnumber) {
                function escapeHtml(unsafe) {
                    // Some characters that are received from the webservice should be escaped when used in HTML
                    return unsafe
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;');
                }

                //var pro6pp_auth_key = "WHnKf9dym89t1UUW"; //DEMO
                var pro6pp_auth_key = 'eYLECZgfEgt55GuF', //PAYED
                    NL_SIXPP_REGEX = /[0-9]{4,4}\s?[a-zA-Z]{2,2}/,
                    url,
                    result;

                if (NL_SIXPP_REGEX.test(postcode)) {
                    url = 'https://api.pro6pp.nl/v1/autocomplete'
                        + '?auth_key=' + pro6pp_auth_key
                        + '&nl_sixpp=' + postcode
                        + '&streetnumber=' + streetnumber;

                    url = encodeURI(url);

                    AJAX(url,
                        function () {
                            result = JSON.parse(this.response);
                            document.getElementById('orderform-street').value = escapeHtml(result.results[0].street);
                            document.getElementById('orderform-city').value = escapeHtml(result.results[0].city);
                        },
                        function () {
                            console.log('FAIL');
                        });
                }
            },

            billingaddress: function () {
                document.getElementById('toggle-billingaddress').addEventListener('click', function (e) {
                    e.preventDefault();

                    if (document.getElementById('fieldsetbillingaddress').style.display === 'block') {
                        document.getElementById('fieldsetbillingaddress').style.display = 'none';
                        document.getElementById('billing_address').value = 0;
                    } else {
                        document.getElementById('fieldsetbillingaddress').style.display = 'block';
                        document.getElementById('billing_address').value = 1;
                    }
                });
            },

            validation: function () {
                var handle;

                handle = setInterval(function () {
                    if (QS('.orderform .street').value !== '' && QS('.orderform .city').value !== '') {
                        QS('.orderform .street').closest('.has-grid').classList.add('has-validation');
                        QS('.orderform .city').closest('.has-grid').classList.add('has-validation');
                        clearInterval(handle);
                    }
                }, 100);

                [].forEach.call(QSA('.orderform-userdata input[type="text"], .orderform-userdata input[type="email"], .orderform-userdata input[type="tel"], .orderform-deliveryaddress input[type="text"], .orderform-deliveryaddress input[type="email"], .terms-conditions input[type="checkbox"]'), function (anchor, i) {
                    if (anchor.getAttribute('required') === 'required' && anchor.value.length > 0) {
                        anchor.parentNode.classList.add('has-validation');
                    }
                });

                [].forEach.call(QSA('.orderform-userdata input[type="text"], .orderform-userdata input[type="email"], .orderform-userdata input[type="tel"], .orderform-deliveryaddress input[type="text"], .orderform-deliveryaddress input[type="email"], .terms-conditions input[type="checkbox"]'), function (anchor, i) {
                    anchor.addEventListener('blur', function () {
                        if (this.getAttribute('required') === 'required') {
                            this.closest('.has-grid').classList.add('has-validation');
                        }
                    });
                });

                // Autocomplete
                [].forEach.call(QSA('.postcode, .streetnumber'), function (anchor, i) {
                    anchor.addEventListener('keyup', function () {
                        var postcode = QS('.postcode').value,
                            streetnumber = QS('.streetnumber').value;
                        form.autocomplete(postcode, streetnumber);
                    });
                });

                // E-mail compare
                QS('input[name="aOrder_form[email2]"]').addEventListener('blur', function () {
                    if (QS('input[name="aOrder_form[email]"]').value !== QS('input[name="aOrder_form[email2]"]').value) {
                        QS('input[name="aOrder_form[email2]"]').setCustomValidity(" ");
                    } else {
                        QS('input[name="aOrder_form[email2]"]').setCustomValidity("");
                    }
                });

                // Prevent default validation pop up
                [].forEach.call(QSA('input, select, textarea'), function (anchor, i) {
                    anchor.addEventListener('invalid', function (e) {
                        e.preventDefault();
                    });
                });

                QS('.orderform-cta input[type="submit"]').addEventListener('click', function (e) {
                    e.preventDefault();

                    var error_count = 0;

                    [].forEach.call(QSA('.orderform-userdata input[required="required"], .orderform-deliveryaddress input[required="required"]'), function (anchor, i) {
                        if (anchor.validity.valid === false) {
                            anchor.parentNode.classList.add('has-validation');
                            error_count += 1;
                        }
                    });

                    [].forEach.call(QSA('.terms-conditions input[required="required"]'), function (anchor, i) {
                        if (anchor.validity.valid === false) {
                            QS('.terms-conditions').classList.add('has-validation');
                            error_count += 1;
                        }
                    });

                    if (error_count > 0) {
                        QS('body').scrollIntoView();
                        if (QS('.notification-error') === null) {
                            QS('h1').insertAdjacentHTML('afterend', '<div class="notification-error"><p>[ERROR_MISSING_FIELDS]</p></div>');
                        }
                    } else {
                        if (QS('.notification-error') !== null) {
                            QS('.notification-error').parentNode.removeChild(QS('.notification-error'));
                        }
                        document.getElementById('frm_order').submit();
                    }
                });
            }
        },

        overview = {
            init: function () {
                document.getElementById('frm_store').addEventListener('submit', function (e) {
                    if (document.getElementById('select_bank').value === '') {
                        e.preventDefault();
                        alert('Kies uw bank');
                    } else {
                        this.submit();
                    }
                });
            }
        },

        search = {
            init: function () {
                search.events();
            },

            events: function () {
                if (document.getElementById('needle_onload').value.length > 0) {
                    document.getElementById('needle').value = document.getElementById('needle_onload').value;
                    search.getresults(0);
                }

                QS('.algolia-search input[type="submit"]').addEventListener('click', function (e) {
                    e.preventDefault();
                    search.getresults(0);
                    return false;
                });

                document.documentElement.addEventListener('click', function (e) {
                    var pagelink;
                    if (e.target.closest('.algolia-pages a')) {
                        e.preventDefault();

                        pagelink = e.target.closest('.algolia-pages a').getAttribute('href');
                        search.getresults(parseInt(pagelink.substring(1, pagelink.length), 0));
                        return false;
                    }
                });
            },

            getresults: function (pageID) {
                var client = algoliasearch('[ALGOLIA_ID]', '[ALGOLIA_KEY]'),
                    needle = document.getElementById('needle').value,
                    queries = '',
                    pages = '',
                    result = '',
                    answer = '',
                    question = '',
                    art = '',
                    uri = '',
                    title = '',
                    text = '';

                if (needle !== '') {
                    queries = [{
                        indexName: '[ALGOLIA_PREFIX]_FAQ',
                        query: needle,
                        params: {
                            hitsPerPage: 100,
                            attributesToRetrieve: ['question', 'answer'],
                            page: pageID
                        }
                    },
                        {
                            indexName: '[ALGOLIA_PREFIX]_INFO',
                            query: needle,
                            params: {
                                hitsPerPage: 100,
                                attributesToRetrieve: ['title', 'uri', 'text'],
                                page: pageID
                            }
                        },
                        {
                            indexName: '[ALGOLIA_PREFIX]_URI',
                            query: needle,
                            params: {
                                hitsPerPage: 100,
                                attributesToRetrieve: ['uri', 'title'],
                                page: pageID
                            }
                        },
                        {
                            indexName: '[ALGOLIA_PREFIX]_CATALOGUE',
                            query: needle,
                            params: {
                                hitsPerPage: 100,
                                attributesToRetrieve: ['art', 'category', 'tags', 'description'],
                                page: pageID
                            }
                        }];

                    client.search(queries, function (err, content) {
                        var hits, h, x, y, page_active_class;
                        if (err) { console.error(err); return; }

                        if ((content.results[0].nbHits + content.results[1].nbHits + content.results[2].nbHits + content.results[3].nbHits) === 0) {
                            result = 'Geen resultaten gevonden.'; // Vertaling van maken
                            QS('.algolia-result').innerHTML = result;
                            return;
                        }

                        hits = content.results[0].hits;
                        for (h = 0; h < hits.length; h += 1) {
                            question = hits[h].question;
                            answer = hits[h]._highlightResult.answer.value;

                            result += '<li class="has-flex result-faq">' +
                                '<figure><span class="article-thumbnail"><img src="[DOMAIN_ROOT]/v3/images/algolia_faq.svg" alt=""></span></figure>' +
                                '<div>' +
                                '<h4>' + question + '</h4>' +
                                '<p class="description">' + answer + '</p>' +
                                '</div>' +
                                '</li>';
                        }

                        hits = content.results[1].hits;
                        for (h = 0; h < hits.length; h += 1) {
                            uri = hits[h].uri;
                            title = hits[h].title;
                            text = hits[h]._highlightResult.text.value;

                            result += '<li class="has-flex result-info">' +
                                '<figure><a class="article-thumbnail" href="[DOMAIN_ROOT]/' + uri + '"><img src="[DOMAIN_ROOT]/v3/images/algolia_info.svg" alt=""></a></figure>' +
                                '<div>' +
                                '<h4><a href="[DOMAIN_ROOT]/' + uri + '">' + title + '</a></h4>' +
                                '<p class="description">' + text.replace(/^(.{200}[^\s]*).*/, "$1") + '&hellip;</p>' +
                                '</div>' +
                                '</li>';
                        }

                        hits = content.results[2].hits;
                        for (h = 0; h < hits.length; h += 1) {
                            uri = hits[h].uri;
                            title = hits[h]._highlightResult.title.value;

                            result += '<li class="has-flex result-category">' +
                                '<figure><a class="article-thumbnail" href="[DOMAIN_ROOT]/' + uri + '"><img src="[DOMAIN_ROOT]/v3/images/algolia_lamp.svg" alt=""></a></figure>' +
                                '<div>' +
                                '<h4><a href="[DOMAIN_ROOT]/' + uri + '">' + uri + '</a></h4>' +
                                '<p class="description">' + title + '</p>' +
                                '</div>' +
                                '</li>';
                        }

                        hits = content.results[3].hits;
                        for (h = 0; h < hits.length; h += 1) {
                            art = hits[h].art;
                            text = hits[h]._highlightResult.description.value;

                            result += '<li class="has-flex">' +
                                '<figure><a class="article-thumbnail" href="[DOMAIN_ROOT]/artikel/-' + art + '"><img src="https://www.rietveldlicht.nl/fotos/middel/' + art + '.jpg" alt=""></a></figure>' +
                                '<div>' +
                                '<h4><a href="[DOMAIN_ROOT]/artikel/-' + art + '">Artikel ' + art + '</a></h4>' +
                                '<p class="description">' + text.replace(/^(.{200}[^\s]*).*/, "$1") + '&hellip;</p>' +
                                '</div>' +
                                '</li>';
                        }

                        if (QS('.algolia-pages') === null) {
                            QS('.algolia-search').insertAdjacentHTML('afterend', '<div class="algolia-pages has-flex has-wrap"></div>');
                        }

                        if (content.results[3].nbPages > 1) {
                            for (x = 0; x < content.results[3].nbPages; x += 1) {

                                y = x + 1;
                                page_active_class = '';
                                if (x === pageID) {
                                    page_active_class = ' class="algolia-page-active"';
                                }

                                pages += '<a href="#' + x + '"' + page_active_class + '>' + y + '</a>';
                            }
                            QS('.algolia-pages').innerHTML = pages;
                        }

                        QS('.algolia-result').innerHTML = result;
                    });
                }
            }
        },

        split = {
            init: function () {
                [].forEach.call(QSA('.split-option label'), function (anchor, i) {
                    anchor.addEventListener('click', function () {
                        [].forEach.call(QSA('.split-option'), function (anchor, i) {
                            anchor.classList.remove('split-option-selected');
                        });

                        anchor.parentNode.classList.toggle('split-option-selected');
                    });
                });
            }
        },

        page = {
            init: function () {
                if (/Mobi/.test(navigator.userAgent)) {
                    document.getElementsByTagName('html')[0].classList.add('is-mobile');
                }

                //Cookie notification: Remove notification on button click
                if (QS('.cookie-info') !== null) {
                    QS('.cookie-info button').addEventListener('click', function () {
                        QS('.cookie-info').classList.remove('cookie-info-visible');
                    });
                }

                // Mobile
                if (QS('html').classList.contains('is-mobile')) {
                    // Menu button
                    QS('.primary-nav > a').addEventListener('click', function (e) {
                        e.preventDefault();
                        this.parentNode.classList.toggle('primary-nav-visible');
                    });

                    // Toggle submenus
                    MQL('(min-width: 768px)', page.togglesubmenu);
                }

                // Toggle visibility search container
                MQL('(min-width: 768px)', page.togglesearch);


                // Load template functions

                // ARTICLE TEMPLATE
                if (document.getElementsByClassName('article-photos').length > 0) {
                    article.init();
                }

                // CART TEMPLATE
                if (document.getElementById('body_cart') !== null) {
                    cart.init();
                }

                // CATALOGUE TEMPLATE
                if (QSA('.articles-list').length > 0) {
                    catalogue.init();
                }

                // COMPARE TEMPLATE
                if (document.getElementById('body_compare') !== null) {
                    compare.init();
                }

                // FAQ TEMPLATE
                if (document.getElementById('body_faq') !== null) {
                    faq.init();
                }

                // FORM TEMPLATE
                if (document.getElementById('body_form') !== null) {
                    form.init();
                }

                // OVERVIEW TEMPLATE
                if (document.getElementById('body_overview') !== null) {
                    overview.init();
                }

                // SEARCH TEMPLATE
                if (document.getElementById('body_find') !== null) {
                    search.init();
                }

                // SPLIT TEMPLATE
                if (document.getElementById('body_split') !== null) {
                    split.init();
                }
            },

            togglesubmenuevent: function (e) {
                e.preventDefault();
                this.parentNode.classList.toggle('show-submenu');
            },

            togglesubmenu: function (evt) {
                var aNavItems = QSA('.primary-nav .has-children > a');

                if (!evt.matches) {
                    [].forEach.call(aNavItems, function (anchor, i) {
                        anchor.addEventListener('click', page.togglesubmenuevent);
                    });
                } else {
                    [].forEach.call(aNavItems, function (anchor, i) {
                        document.querySelector('.primary-nav').classList.remove('primary-nav-visible');
                        anchor.parentNode.classList.remove('show-submenu');
                        anchor.removeEventListener('click', page.togglesubmenuevent);
                    });
                }
            },

            togglesearch: function (evt) {
                if (evt.matches) {
                    QS('.search-container').classList.add('search-container-visible');
                } else {
                    QS('.search-container').classList.remove('search-container-visible');

                    // Search: Show searchfield
                    QS('.search > a').addEventListener('click', function (e) {
                        e.preventDefault();
                        QS('.search-container').classList.add('search-container-visible');
                    });

                    // Search: Hide searchfield via close button
                    QS('.search-close').addEventListener('click', function (e) {
                        e.preventDefault();
                        QS('.search-container').classList.remove('search-container-visible');
                    });
                }
            }
        };

    // Generic page functions
    page.init();
}());
