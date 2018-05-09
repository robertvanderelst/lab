/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    $, jQuery, google, FontFaceObserver, algoliasearch, console, alert
*/

var langEntries = {
    searchClose: '[SEARCHCLOSE]',
    filterShow: '[FILTERSHOW]',
    filterHide: '[FILTERHIDE]',
    filterClose: '[FILTERCLOSE]',
    filterShowExtended: '[FILTERSHOWEXTENDED]',
    filterHideExtended: '[FILTERHIDEEXTENDED]',
    carrouselPrev: '[CARROUSELPREV]',
    carrouselNext: '[CARROUSELNEXT]'
};

var Base = (function () {
    // Module based structure

    "use strict";
    var Rietveld = {
        config: {
            windowWidth: $(document).width(),
            headerHeight: $('header').outerHeight(),
            rem: $('body').css('font-size').replace('px', ''),
            mqSmall: 480,
            mqMedium: 768,
            mqLarge: 1024,
            minValue: 0,
            maxValue: 1500
        },

        init: function () {
            // Set class for mobile devices
            if (/Mobi/.test(navigator.userAgent)) {
                $('body').addClass('is-mobile');
            }

            // Font loader
            var observer = new FontFaceObserver('Lato');
            observer.check().then(function () {
                $('html').addClass('font-loaded');
            });

            $(document).ready(function () {
                Rietveld.loadArticles();
                Rietveld.setAlgoliaEvents();
                Rietveld.setArticleEvents();
                Rietveld.setCartEvents();
                Rietveld.setCatalogue();
                Rietveld.setCompare();
                Rietveld.setFAQ();
                Rietveld.setFilters();
                Rietveld.setForm();
                Rietveld.setGooglemap();
                Rietveld.setHeaderEvents();
                Rietveld.setLightbox();
                Rietveld.setOrderEvents();
                Rietveld.setOverviewEvents();
                Rietveld.setSlider();
                Rietveld.setTabs();
            });
        },

        setAlgoliaEvents: function () {
            if ($('#body_find').length > 0) {
                if ($("#needle_onload").length > 0) {
                    var needle_onload = $("#needle_onload").val();
                    if (needle_onload !== '') {
                        $("#needle").val(needle_onload);
                        Rietveld.getAlgoliaResults(0);
                    }
                }

                $('.algolia-search input[type="submit"]').on('click', function (e) {
                    e.preventDefault();
                    Rietveld.getAlgoliaResults(0);
                    return false;
                });

                $(document).on('click', '.algolia-pages a', function (e) {
                    e.preventDefault();
                    Rietveld.getAlgoliaResults(parseInt($(this).attr('href').substring(1, $(this).attr('href').length), 0));
                    return false;
                });
            }
        },

        getAlgoliaResults: function (pageID) {
            if ($('#body_find').length > 0) {
                var client = algoliasearch('EXFIFX0M68', 'b5a559fd2ac468d2d3933ca53f77930e'),
                    needle = $("#needle").val(),
                    queries = '',
                    result = '',
                    answer = '',
                    question = '',
                    art = '',
                    uri = '',
                    title = '',
                    text = '';

                if (needle !== '') {
                    queries = [{
                        indexName: 'NL_FAQ',
                        query: needle,
                        params: {
                            hitsPerPage: 100,
                            attributesToRetrieve: ['question', 'answer'],
                            page: pageID
                        }
                    },
                        {
                            indexName: 'NL_INFO',
                            query: needle,
                            params: {
                                hitsPerPage: 100,
                                attributesToRetrieve: ['title', 'uri', 'text'],
                                page: pageID
                            }
                        },
                        {
                            indexName: 'NL_URI',
                            query: needle,
                            params: {
                                hitsPerPage: 100,
                                attributesToRetrieve: ['uri', 'title'],
                                page: pageID
                            }
                        },
                        {
                            indexName: 'NL_CATALOGUE',
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

                            result = 'Geen resultaten gevonden.';
                            $(".algolia-result").html(result);
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

                        $('.algolia-pages').html('');
                        if ($('.algolia-pages').length === 0) {
                            $('.algolia-search').after('<div class="algolia-pages has-flex has-wrap"></div>');
                        }
                        if (content.results[3].nbPages > 1) {
                            for (x = 0; x < content.results[3].nbPages; x += 1) {

                                y = x + 1;
                                page_active_class = '';
                                if (x === pageID) {
                                    page_active_class = ' class="algolia-page-active"';
                                }
                                $(".algolia-pages").html($(".algolia-pages").html() + ' <a href="#' + x + '"' + page_active_class + '>' + y + '</a>');
                            }
                        }

                        $(".algolia-result").html(result);
                    });
                }
            }
        },

        setCarrousel: function (el) {
            var Carrousel = {
                initCarrouselNav: function (el) {
                    el.CarrouselList = el.find('ul');
                    el.CarrouselItems = el.CarrouselList.find('li').length;
                    el.CarrouselShownItems = 0;
                    el.CarrouselTravel = 0;
                    el.CarrouselWidth = 0;
                    el.CarrouselPosLeft = 0;

                    el.find('.carrousel-container')
                        .prepend('<button class="prev is-disabled"><span class="arrow"></span><span class="sr-only">' + langEntries.carrouselPrev + '</span></button>')
                        .append('<button class="next"><span class="arrow"></span><span class="sr-only">' + langEntries.carrouselNext + '</span></button>');

                    Carrousel.setCarrouselEvents(el);
                },

                setCarrouselNav: function (el) {
                    if (el.CarrouselList.width() <= el.width()) {
                        el.find('.prev, .next').hide();
                    } else {
                        el.find('.prev, .next').show();
                    }
                },

                setCarrouselShownItems: function (el) {
                    if (Rietveld.config.windowWidth >= Rietveld.config.mqLarge) {
                        el.CarrouselShownItems = 4;
                    } else if (Rietveld.config.windowWidth >= Rietveld.config.mqMedium && Rietveld.config.windowWidth < Rietveld.config.mqLarge) {
                        el.CarrouselShownItems = 3;
                    } else if (Rietveld.config.windowWidth >= Rietveld.config.mqSmall && Rietveld.config.windowWidth < Rietveld.config.mqMedium) {
                        el.CarrouselShownItems = 2;
                    } else {
                        el.CarrouselShownItems = 1;
                    }
                },

                setCarrouselWidth: function (el) {
                    el.CarrouselWidth = el.CarrouselItems * (100 / el.CarrouselShownItems);
                    el.CarrouselTravel = (el.CarrouselItems - el.CarrouselShownItems) * (100 / el.CarrouselShownItems);
                    el.CarrouselList.css({'width': el.CarrouselWidth + '%', 'margin-left': 0});
                    el.find('.prev').addClass('is-disabled');
                    el.find('.next').removeClass('is-disabled');
                },

                animateCarrouselLeft: function (el) {
                    if (el.CarrouselPosLeft > 0) {
                        el.CarrouselPosLeft -= (100 / el.CarrouselShownItems);

                        if (el.CarrouselPosLeft < 0) {
                            el.CarrouselPosLeft = 0;
                        }

                        el.find('ul').animate({'margin-left': '-' + el.CarrouselPosLeft + '%'}, 400, 'swing');
                        el.find('.next').removeClass('is-disabled');
                    }

                    if (el.CarrouselPosLeft === 0) {
                        el.find('.prev').addClass('is-disabled');
                    }
                },

                animateCarrouselRight: function (el) {
                    if (el.CarrouselPosLeft < el.CarrouselTravel) {
                        el.CarrouselPosLeft += (100 / el.CarrouselShownItems);

                        el.find('ul').animate({'margin-left': '-' + el.CarrouselPosLeft + '%'}, 400, 'swing');
                        el.find('.prev').removeClass('is-disabled');
                    }

                    if (el.CarrouselPosLeft >= el.CarrouselTravel) {
                        el.find('.next').addClass('is-disabled');
                    }
                },

                setCarrouselEvents: function (el) {
                    el
                        .on('click touchstart', '.prev', function (e) {
                            e.stopPropagation();
                            Carrousel.animateCarrouselLeft(el);

                            return false;
                        })
                        .on('click touchstart', '.next', function (e) {
                            e.stopPropagation();
                            Carrousel.animateCarrouselRight(el);

                            return false;
                        })
                        .on('swipeleft', function (e) {
                            e.stopPropagation();
                            Carrousel.animateCarrouselRight(el);
                        })
                        .on('swiperight', function (e) {
                            e.stopPropagation();
                            Carrousel.animateCarrouselLeft(el);
                        });

                    return false;
                }
            };

            el.find('.articles-list').wrap('<div class="carrousel-container"><div><div class="viewport"></div></div></div>');

            // Show carrousel
            Carrousel.initCarrouselNav(el);
            Carrousel.setCarrouselShownItems(el);
            Carrousel.setCarrouselWidth(el);
            Carrousel.setCarrouselNav(el);

            $(window).on('resize orientationchange', function () {
                Rietveld.config.windowWidth = $(window).width();

                if (Rietveld.config.windowWidth < Rietveld.config.mqMedium) {
                    setTimeout(function () {
                        Carrousel.setCarrouselShownItems(el);
                        Carrousel.setCarrouselWidth(el);
                        Carrousel.setCarrouselNav(el);
                    }, 250);
                } else {
                    el.find('ul').removeAttr('style');
                }
            });
        },

        unsetCarrousel: function (el) {
            // Unset carrousel
            el.removeClass('is-carrousel');
            el.find('.prev').remove();
            el.find('.next').remove();

            var list = el.find('.articles-list');
            el.find('.carrousel-container').remove();
            el.append(list);
        },

        setCartEvents: function () {
            if ($('#body_cart').length > 0) {
                // Remove article from cart
                $('.cart-item-delete').on('click', function (e) {
                    e.preventDefault();
                    var aId = $(this).attr('id').split('-');

                    $.get('[HTTP_HOST]/jx_cart?jx=1&aAction[]=del&art=' + aId[1], function () {
                        location.reload();
                    });
                });

                // Change amounts in cart
                $('.cart-select-amount').on('change', function () {
                    var aId = $(this).attr('id').split('-');

                    $.get('[HTTP_HOST]/jx_cart?jx=1&aAction[]=add&art=' + aId[1] + '&amount=' + $(this).val(), function () {
                        location.reload();
                    });
                });
            }
        },

        setCompare: function () {
            if ($('#body_compare').length > 0) {
                // Sync height table headers with table cells (and vice versa)
                $('.compare table th[scope="row"]').each(function () {
                    if ($(this).height() < $(this).next().height()) {
                        $(this).css({'height': ($(this).next().height() + parseInt(Rietveld.config.rem, 10)) + 'px'});
                    } else if ($(this).height() > $(this).next().height()) {
                        $(this).nextAll('td').css({'height': ($(this).height() + parseInt(Rietveld.config.rem, 10)) + 'px'});
                    }
                });

                // Events
                $(".compare-delete-button").on('click', function (e) {
                    e.preventDefault();
                    var jx_url = '[HTTP_HOST]/jx_rietveld?action=del&type=compare&art=' + this.dataset.art;
                    $.get(jx_url, function () {
                        window.location.href = '[HTTP_HOST]/compare';
                    });
                });
            }
        },

        setOverviewEvents: function () {
            if ($('#body_overview').length > 0 && $("#select_bank").length) {
                $("#frm_store").on("submit", function () {
                    if ($("#select_bank").val() === '') {
                        alert('Kies uw bank');
                        return false;
                    }
                });
            }
        },

        setFAQ: function () {
            if ($("#body_faq").length > 0) {
                $("#frm-faqfilter").on('submit', function () {
                    return false;
                });

                $("#faqfilter").on('keyup', function () {
                    var filter = $(this).val(), count = 0;

                    if ($(this).val().length > 0) {
                        $('.faq-list-category-toggle').prop('checked', true);

                        if ($('.clear-faqsearch').length === 0) {
                            $(this).parent().after('<button class="button clear-faqsearch">Wis</button>');
                        }
                    } else {
                        $('.faq-list-category-toggle').prop('checked', false);
                        $(this).next().remove();
                    }

                    $('.faq-list-category li').each(function () {
                        if ($(this).find('label span').text().search(new RegExp(filter, "i")) < 0 && $(this).find('.faq-answer p').text().search(new RegExp(filter, "i")) < 0) {
                            $(this).fadeOut();
                            $(this).addClass('hidden-answer');
                        } else {
                            $(this).fadeIn();
                            $(this).removeClass('hidden-answer');
                            count += 1;
                        }

                        $("#totalcount").text(count);
                    });

                    $('.faq-list-category').each(function () {
                        if ($(this).find('.hidden-answer').length === $(this).find('li').length) {
                            $(this).fadeOut();
                        } else {
                            $(this).fadeIn();
                        }
                    });

                    $('.clear-faqsearch').on('click', function () {
                        $('#frm-faqfilter')[0].reset();
                        $('.faq-list-category-toggle').prop('checked', false);
                        $('.faq-list-category, .faq-list-category li').fadeIn();
                        $("#totalcount").text($('.faq-list-category li').length);
                    });
                });
            }
        },

        setFilters: function () {
            if ($('.filters-panel').length > 0) {
                $('[href="#toggle-filters-panel"]').on('click', function (e) {
                    e.preventDefault();
                    $('.filters-panel').toggleClass('filters-panel-visible');
                    $('.overlay').fadeToggle();
                });

                $('.overlay').on('click', function () {
                    $('.filters-panel').removeClass('filters-panel-visible');
                    $(this).fadeOut();
                });

                $('.filter-group > a').on('click', function (e) {
                    e.preventDefault();
                    $(this).toggleClass('filter-group-visible');
                });

                $('.filter-list ul').each(function () {
                    if ($(this).find('li').length > 6 && !$(this).hasClass('showall')) {
                        $(this).addClass('filters-list-closed');
                        $(this).after('<a href="' + $(this).attr('id') + '" class="filters-list-toggle button">' + langEntries.filterShowExtended  + '</a>');
                    }
                });

                $('.filters-list-toggle').on('click', function (e) {
                    e.preventDefault();
                    $('#' + $(this).attr('href')).toggleClass('filters-list-closed');

                    if ($('#' + $(this).attr('href')).hasClass('filters-list-closed')) {
                        $(this).text(langEntries.filterShowExtended);
                        $('html, body').scrollTop($('#' + $(this).attr('href')).offset().top -  $(this).parents('.filter-group').find('.filter-group-toggle').outerHeight() - $('header').outerHeight() - (2 * Rietveld.config.rem));
                    } else {
                        $(this).text(langEntries.filterHideExtended);
                    }
                });

                $(".filter-group-more-options").on('click', function () {
                    var $this = $(this)[0],
                        jx_url = '[HTTP_HOST]/jx_filter?parent_id=' + $this.dataset.parent_id + '&tags=' + $this.dataset.tags;

                    if (jx_url) {
                        $.get(jx_url, function (data) {
                            $('#filter-group-' + $this.dataset.parent_id).append(data);
                            $('a[data-parent_id="' + $this.dataset.parent_id + '"]').remove();
                        });
                    }
                });
            }
        },

        setCatalogue: function () {
            if ($("#view-catalogue").length > 0) {
                var art = document.querySelector('.articles-list').dataset.scrollintoview;
                if ($.isNumeric(art)) {
                    document.querySelector('.view' + art).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        },

        setExpandingArticlesList: function (el) {
            if (el.find('.articles-list li').length > 0) {
                var cols = 1;
                cols = Math.ceil(el.find('ul').outerWidth() / el.find('.article-card').outerWidth());

                if (cols === 1) {
                    cols = 3;
                }

                if (cols === 2) {
                    cols = 4;
                }

                if (el.find('li').length > cols) {
                    if (el.find('.articles-list').hasClass('showing-all-items') === false) {
                        el.find('.articles-list')
                            .removeClass('show-2-items show-3-items show-4-items show-5-items')
                            .addClass('show-' + cols + '-items');
                    }

                    if (el.find('[href="#show-all-items"]').length === 0) {
                        el.find('.articles-list').after('<a href="#show-all-items" class="button">Toon alle</a>');
                    }
                }

                // Click event
                $('[href="#show-all-items"]').on('click', function (e) {
                    e.preventDefault();
                    $(this).prev()
                        .addClass('showing-all-items')
                        .removeClass('show-2-items show-3-items show-4-items show-5-items');
                    $(this).hide();
                });
            }
        },

        unsetExpandingArticlesList: function (el) {
            el.each(function () {
                $(this).find('.articles-list').removeClass('show-2-items show-3-items show-4-items show-5-items showing-all-items');
                $(this).find($('[href="#show-all-items"]')).remove();
            });

        },

        setForm: function () {
            function toggle_choose_date_box() {
                var payment = $("[name='aOrder_form[payment]']:checked");
                if (payment.val() === 'bank') {
                    $(".choose-date").css('display', 'none');
                } else {
                    $(".choose-date").css('display', 'block');
                }
            }

            if ($('#body_form').length > 0) {
                var streetvalue = '', handlestreet, cityvalue = '', handlecity;

                handlestreet = setInterval(function () {
                    if ($('.orderform .street').val() !== streetvalue) {
                        $('.orderform .street').parent().parent().addClass('has-validation');
                        clearInterval(handlestreet);
                    }
                }, 100);

                handlecity = setInterval(function () {
                    if ($('.orderform .city').val() !== cityvalue) {
                        $('.orderform .city').parent().parent().addClass('has-validation');
                        clearInterval(handlecity);
                    }
                }, 100);

                $('input.street, input.city').each(function () {
                    $(this).attr('placeholder', 'Wordt automatisch gevuld');
                });

                $('.orderform-userdata input[type="text"], .orderform-userdata input[type="email"], .orderform-userdata input[type="tel"], .orderform-deliveryaddress input[type="text"], .orderform-deliveryaddress input[type="email"], .terms-conditions input[type="checkbox"]').on('blur', function () {
                    if ($(this).attr('required')) {
                        $(this).parent().parent().addClass('has-validation');
                    }
                });

                // E-mail compare
                $('input[name="aOrder_form[email2]"]').on('blur', function () {
                    if ($('input[name="aOrder_form[email]"]').val() !== $('input[name="aOrder_form[email2]"]').val()) {
                        $('input[name="aOrder_form[email2]"]')[0].setCustomValidity(" ");
                    } else {
                        $('input[name="aOrder_form[email2]"]')[0].setCustomValidity("");
                    }
                });

                // Prevent default validation pop up
                $('input, select, textarea').on('invalid', function (e) {
                    e.preventDefault();
                });

                $('.orderform-cta input[type="submit"]').on('click', function (e) {
                    e.preventDefault();

                    var error_count = 0;

                    $('.orderform-userdata input[required="required"], .orderform-deliveryaddress input[required="required"]').each(function () {
                        if ($(this).is(':invalid') === true) {
                            $(this).parent().addClass('has-validation');
                            error_count += 1;
                        }
                    });

                    $('.terms-conditions input[required="required"]').each(function () {
                        if ($(this).is(':invalid') === true) {
                            $('.terms-conditions').addClass('has-validation');
                            error_count += 1;
                        }
                    });

                    if (error_count > 0) {
                        $('html, body').scrollTop(0);
                        if ($('.notification-error').length === 0) {
                            $('h1').after('<div class="notification-error"><p>Niet alle verplichte velden zijn correct ingevuld</p></div>');
                        }
                    } else {
                        $('.notification-error').remove();
                        $('form#frm_order').submit();
                    }
                });

                // Billing Address toggle
                $('#toggle-billingaddress').on('click', function (e) {
                    e.preventDefault();
                    $('#fieldsetbillingaddress').slideToggle('fast', function () {
                        $('#billing_address').val('');
                        if ($('#fieldsetbillingaddress').css('display') === 'block') {
                            $('#billing_address').val(1);
                        }
                    });
                });

                if ($('#billing_address').val() === "1") {
                    $('#toggle-billingaddress').trigger('click');
                }

                //ADDRESS AUTOCOMPLETE
                if ($.fn.applyAutocomplete && $('.address_autocomplete').length) {
                    $('.address_autocomplete').applyAutocomplete();
                    $('.address_autocomplete2').applyAutocomplete();
                }

                $('[name="aOrder_form[payment]"]').change(function () { toggle_choose_date_box(); });
                toggle_choose_date_box();

            }
        },

        setGooglemap: function () {
            if ($('#google-map').length > 0) {
                // 51.8311151,4.7627239
                //var lelystraat = new google.maps.LatLng(51.831328, 4.762129),
                var lelystraat = new google.maps.LatLng(51.8311151, 4.7623484),
                    mapCanvas = document.getElementById('google-map'),
                    mapOptions = {
                        center: lelystraat,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    map = new google.maps.Map(mapCanvas, mapOptions),
                    marker = new google.maps.Marker({
                        position: lelystraat,
                        map: map,
                        title: 'Rietveld licht & wonen'
                    });

                google.maps.event.addListener(marker, 'click', function () {
                    var lely_url = 'https://www.google.nl/maps/place/Rietveld+Licht+%26+Wonen/@51.831331,4.762129,17z/data=!3m1!4b1!4m2!3m1!1s0x47c429faa1e8b0bd:0xf3c2bc2a43e1ede9';
                    window.open(lely_url, '_blank');
                });
            }
        },

        setHeaderEvents: function () {
            $('.primary-nav .has-children > a').on('click', function (e) {
                e.preventDefault();
            });

            $('.primary-nav > a').on('click', function (e) {
                e.preventDefault();
                $(this).parent().toggleClass('primary-nav-visible');
            });

            $('.is-mobile .primary-nav .has-children > a').on('click', function () {
                if (Rietveld.config.windowWidth < Rietveld.config.mqMedium) {
                    $(this).parent().toggleClass('show-submenu');
                }
            });

            $('[href="#country-list"], [href="#my-rietveld-list"]').on('click', function (e) {
                e.preventDefault();
            });

            $('[href="#search-container"]').on('click', function (e) {
                e.preventDefault();
                $($(this).attr('href')).addClass('search-container-visible');

                $("input[name='search']").focus();
            });

            $('.search-close').on('click', function (e) {
                e.preventDefault();
                $('.search-container').removeClass('search-container-visible');
            });
        },

        setLightbox: function () {
            if (jQuery.fn.swipebox && $('.swipebox').length > 0) {
                $('.swipebox').swipebox({
                    removeBarsOnMobile: false,
                    hideBarsDelay: 0
                });
            }
        },

        setLightsourceitems: function () {
            if ($('.article-lightsources li').length > 0) {
                var lightsourcecols = 1;
                lightsourcecols = Math.ceil($('.article-lightsources ul').outerWidth() / $('.article-lightsources .article-card').outerWidth());

                if (lightsourcecols === 1) {
                    lightsourcecols = 3;
                }

                if (lightsourcecols === 2) {
                    lightsourcecols = 4;
                }

                if ($('.article-lightsources .lightsource-item').length > lightsourcecols) {
                    if ($('.article-lightsources .articles-list').hasClass('showing-all-items') === false) {
                        $('.article-lightsources .articles-list')
                            .removeClass('show-2-items show-3-items show-4-items show-5-items')
                            .addClass('show-' + lightsourcecols + '-items');
                    }

                    if ($('[href="#show-all-items"]').length === 0) {
                        $('.article-lightsources .articles-list').after('<a href="#show-all-items">Toon alle geschikte lichtbronnen</a>');
                    }
                }

                // Click event
                $('[href="#show-all-items"]').on('click', function (e) {
                    e.preventDefault();
                    $(this).prev()
                        .addClass('showing-all-items')
                        .removeClass('show-2-items show-3-items show-4-items show-5-items');
                    $(this).hide();
                });
            }
        },

        setOrderEvents: function () {
            // Give selected sending option a class for styling
            $('.split-option label').on('click', function () {
                $('.split-option').removeClass('split-option-selected');
                $(this).parent().toggleClass('split-option-selected');
            });
        },

        setRelatedArticles: function (el) {
            el.each(function () {
                if (Rietveld.config.windowWidth >= Rietveld.config.mqMedium) {
                    if ($(this).hasClass('is-carrousel') === true) {
                        $(this).removeClass('is-carrousel');
                        Rietveld.unsetCarrousel($(this));
                    }

                    if ($(this).hasClass('is-expanding') === false) {
                        $(this).addClass('is-expanding');
                        Rietveld.setExpandingArticlesList($(this));
                    }
                } else {
                    if ($(this).hasClass('is-expanding') === true) {
                        $(this).removeClass('is-expanding');
                        Rietveld.unsetExpandingArticlesList($(this));
                    }

                    if ($(this).hasClass('is-carrousel') === false) {
                        $(this).addClass('is-carrousel');
                        Rietveld.setCarrousel($(this));
                    }
                }
            });
        },

        setSlider: function () {
            if ($(".filter-range").length > 0) {
                $(".filter-range").each(function () {
                    if ($.fn.slider) {

                        var instance = this,
                            min_range = parseInt(instance.dataset.min_range, 10),
                            max_range = parseInt(instance.dataset.max_range, 10),
                            start_range = parseInt(instance.dataset.start_range, 10),
                            end_range = parseInt(instance.dataset.end_range,  10);

                        if (start_range < min_range) { start_range = min_range; }
                        if (end_range > max_range) { end_range = max_range; }

                        $(instance).parent().addClass('has-slider');
                        $(instance).parent().append('<div id="' + instance.dataset.sliderid + '-slider" class="slider-range"></div>');

                        $('#' + instance.dataset.sliderid + '-slider').slider({
                            range: true,
                            min: min_range,
                            max: max_range,
                            values: [start_range, end_range],
                            slide: function (event, ui) {
                                $('#' + instance.dataset.sliderid + '-min').val(ui.values[0]);
                                $('#' + instance.dataset.sliderid + '-max').val(ui.values[1]);
                            },
                            change: function () {
                                var start = $('#' + instance.dataset.sliderid + '-min').val(),
                                    end =   $('#' + instance.dataset.sliderid + '-max').val(),
                                    new_range = instance.dataset.sliderid + '=' + min_range + '-' + max_range + '-' + start + '-' + end,
                                    url = instance.dataset.url,
                                    cnt = url.split('?'),
                                    glue = '?';

                                if (cnt.length > 1) { glue = '&'; }

                                window.location.href = url + glue + new_range;
                            }
                        });

                        //ENTER
                        $(instance).find("input").each(function () {

                            $(this).on('keypress', function (event) {

                                var keycode = (event.keyCode || event.which);
                                if (keycode === '13') {

                                    $('#' + instance.dataset.sliderid + '-slider').slider("value", 1);
                                }
                            });
                        });

                        //CHECKBOX CLICK
                        $(this).find('.filter-list-link').each(function () {
                            $(this).on('click', function (e) {
                                $('#' + instance.dataset.sliderid + '-slider').slider("value", 1);
                                e.preventDefault();
                            });
                        });
                    }
                });
            }
        },

        setTabs: function () {
            if ($('.article-tab').length > 0) {
                $('.article-data .article-tab:first-child').show();

                $('[href^="#tab-"]').on('click', function (e) {
                    e.preventDefault();
                    $(this).toggleClass('tab-active');

                    if ($(this).parent('.article-tab').length > 0) {
                        $('html, body').scrollTop($(this.hash).offset().top - $('header').outerHeight() - Rietveld.config.rem);
                    }
                });

                $('.article-shortlist [href^="#tab-"], .article-shortlist [href^="#article-"]').on('click', function (e) {
                    e.preventDefault();

                    $($(this.hash)).find('[href^="#tab-"]').addClass('tab-active');
                    $('html, body').scrollTop($($(this.hash)).offset().top - $('header').outerHeight() - Rietveld.config.rem);
                });
            }
        },

        setArticleEvents: function () {
            if ($('.article').length > 0) {
                $(".button-my-rietveld").on('click', function (e) {
                    e.preventDefault();
                    var jx_url = '[HTTP_HOST]/jx_rietveld?action=' + this.dataset.action + '&type=' + this.dataset.eventtype + '&art=' + this.dataset.art;
                    $.get(jx_url, function (data) {
                        $("li." + this.dataset.eventtype + " span.amount").text(data);
                        if ($("#button-" + this.dataset.eventtype).attr('data-action') === 'add') {
                            $("li." + this.dataset.eventtype + "-article").addClass('is-added');
                            $("#button-" + this.dataset.eventtype).attr('data-action', 'del');
                        } else {
                            $("li." + this.dataset.eventtype + "-article").removeClass('is-added');
                            $("#button-" + this.dataset.eventtype).attr('data-action', 'add');
                        }
                    }.bind(this));
                });

                $("#frm_in_stock_alert").on('submit', function (e) {
                    e.preventDefault();

                    var vars, jx_url;

                    vars = $("#frm_in_stock_alert").serialize();
                    jx_url = '[HTTP_HOST]/jx_article?' + vars;

                    $.get(jx_url, function (data) {
                        $("#frm_in_stock_alert").html(data);
                    });
                });

                $(window).on('load', function () {
                    Rietveld.config.windowWidth = $(window).width();

                    if ($('.article-lightsources').length > 0) {
                        Rietveld.setExpandingArticlesList($('.article-lightsources'));
                    }

                    if ($('.related-articles').length > 0) {
                        Rietveld.setRelatedArticles($('.related-articles'));
                    }
                });

                $(window).on('resize orientationchange', function () {
                    Rietveld.config.windowWidth = $(window).width();

                    setTimeout(function () {
                        if ($('.article-lightsources').length > 0) {
                            Rietveld.setExpandingArticlesList($('.article-lightsources'));
                        }

                        if ($('.related-articles').length > 0) {
                            Rietveld.setRelatedArticles($('.related-articles'));
                        }
                    }, 250);
                });
            }
        },

        loadArticles: function () {
            $('body').on('click', '#show_more_results a', function (e) {
                e.preventDefault();

                if ($(this).attr('href')) {
                    $("#loading").show();
                    $('#show_more_results a').hide();
                    $.get($(this).attr('href') + '&jx=1', function (data) {
                        $('#show_more_results').replaceWith(data);
                    });
                }
            });
        }
    };

    Rietveld.init();
}());
