/*jslint
    browser: true
    regexp: true
    nomen: true
    unparam: true
*/

/*global
    console, alert, algoliasearch, CustomEvent, Element, google, Intl
*/

function QS(el) {
    return document.querySelector(el);
}

function QSA(el) {
    return document.querySelectorAll(el);
}

function MQL(breakpoint, listenerfunction) {
    var mql = window.matchMedia(breakpoint);

    mql.addListener(listenerfunction);

    listenerfunction(mql);
}

var components = {
    algolia: function () {
        var client = algoliasearch('EXFIFX0M68', 'b5a559fd2ac468d2d3933ca53f77930e');

        var ac = autocomplete('#topneedle', { hint: false, },
            [
            {
                source: autocomplete.sources.hits(client.initIndex('NL_URI'), { hitsPerPage: 3 }),
                templates: {
                    header: '<h4>Categorie&euml;n</h4>',
                    footer: null,
                    suggestion: function(suggestion) {
                        return '<a href="' + suggestion.uri.value + '">' + suggestion._highlightResult.title.value + '</a>';
                    }
                }
            },
            {
              source: autocomplete.sources.hits(client.initIndex('NL_CATALOGUE'), { hitsPerPage: 5 }),
              templates: {
                header: '<h4>Producten</h4>',
                footer: null,
                suggestion: function(suggestion) {
                    var desc = suggestion._highlightResult.description.value,
                        l = 0;

                    // Description cut to one sentence.
                    l = desc.indexOf('.');

                    if (l > 0) {
                        desc = desc.substring(0, l + 1);
                    }

                    return '<div class="has-flex"><picture style="width: 6rem;"><img src="https://www.rietveldlicht.nl/fotos/klein/' + suggestion._highlightResult.art.value + '.jpg" alt=""></picture><div style="flex: 1 1 100%; padding-left: 1rem;"><h5>' + suggestion._highlightResult.art.value + '</h5><p>' + desc + '</p><p style="text-align:right;color:#ed1c23;font-weight: bold;">&euro; 99,00</p></div></div>';
                }
              }
            }
        ]).on('autocomplete:selected', function(event, suggestion, dataset, context) {
            console.log('GEKLIKT');
        });

    //     function getResults (pageID) {
    //         var client = algoliasearch('EXFIFX0M68', 'b5a559fd2ac468d2d3933ca53f77930e'),
    //             needle = document.getElementById('needle').value,
    //             queries = '',
    //             pages = '',
    //             result = '',
    //             answer = '',
    //             question = '',
    //             art = '',
    //             uri = '',
    //             title = '',
    //             text = '';
    //
    //         if (needle !== '') {
    //             queries = [{
    //                 indexName: 'NL_CATALOGUE',
    //                 query: needle,
    //                 params: {
    //                     hitsPerPage: 32,
    //                     attributesToRetrieve: ['art', 'category', 'tags', 'description'],
    //                     page: pageID
    //                 },
    //             }];
    //
    //             client.search(queries, function (err, content) {
    //                 var hits, h, x, y, page_active_class, categorymatch;
    //                 if (err) { console.error(err); return; }
    //
    //                 if (content.results.nbHits === 0) {
    //                     result = 'Geen resultaten gevonden.'; // Vertaling van maken
    //                     QS('.o-algoliaresults').innerHTML = result;
    //                     return;
    //                 } else {
    //
    //                     hits = content.results[0].hits;
    //
    //                     QS('.a-algoliaresults-count').innerHTML = '<strong>' + content.results[0].nbHits + '</strong> resultaten'; // vertaling van maken
    //
    //                     for (h = 0; h < hits.length; h += 1) {
    //                         art = hits[h].art;
    //                         text = hits[h]._highlightResult.description.value;
    //                         text = text.replace('<b>', '');
    //                         text = text.replace('</b>', '');
    //
    //                         result += '<li class="has-flex">' +
    //                         '    <div class="m-algoliaresult-photo">' +
    //                         '        <picture class="has-ratio-4-3">' +
    //                         '            <img src="https://www.rietveldlicht.nl/fotos/middel/' + art + '.jpg" alt="">' +
    //                         '        </picture>' +
    //                         '    </div>' +
    //                         '    <div class="m-algoliaresult-content">' +
    //                         '        <div class="has-flex">' +
    //                         '            <div class="m-algoliaresult-data">' +
    //                         '                <h2>Artikel ' + art + '</h2>' +
    //                         '                <ul class="a-algoliaresult-tags has-flex">' +
    //                         '                    <li>Hanglamp</li>' +
    //                         '                    <li>Antraciet</li>' +
    //                         '                    <li>Modern</li>' +
    //                         '                </ul>' +
    //                         '            </div>' +
    //                         '            <div class="a-algoliaresult-price">' +
    //                         '               <p><strong>&euro; 99,00</strong></p>' +
    //                         '            </div>' +
    //                         '        </div>' +
    //                         '        <p class="m-algoliaresult-description">' +
    //                         '           ' + text.replace(/^(.{200}[^\s]*).*/, "$1") + '&hellip;' +
    //                         '        </p>' +
    //                         '    </div>' +
    //                         '    <a href="#" class="a-algoliaresult-link"><span class="sr-only">Meer informatie over artikel 1391</span></a>' +
    //                         '</li>';
    //                     }
    //
    //                     if (QS('.m-algolia-pages') === null) {
    //                         QS('.o-algoliaresults').insertAdjacentHTML('beforebegin', '<div class="m-algolia-pages has-flex has-wrap"></div>');
    //                         QS('.o-algoliaresults').insertAdjacentHTML('afterend', '<div class="m-algolia-pages has-flex has-wrap"></div>');
    //                     } else {
    //                         [].forEach.call(QSA('.m-algolia-pages'), function (anchor) {
    //                             anchor.innerHTML = '';
    //                         });
    //                     }
    //
    //                     if (content.results[0].nbPages > 1) {
    //                         for (x = 0; x < content.results[0].nbPages; x += 1) {
    //
    //                             y = x + 1;
    //                             page_active_class = '';
    //                             if (x === pageID) {
    //                                 page_active_class = ' class="algolia-page-active"';
    //                             }
    //
    //                             pages += '<a href="#' + x + '"' + page_active_class + '>' + y + '</a>';
    //                         }
    //
    //                         [].forEach.call(QSA('.m-algolia-pages'), function (anchor) {
    //                             anchor.innerHTML = pages;
    //                         });
    //                     }
    //
    //                     QS('.o-algoliaresults').innerHTML = result;
    //                 }
    //             });
    //         }
    //     }
    //
    //     if (document.getElementById('needle_onload').value.length > 0) {
    //         document.getElementById('needle').value = document.getElementById('needle_onload').value;
    //         getResults(0);
    //     }
    //
    //     QS('.algolia-search input[type="submit"]').addEventListener('click', function (e) {
    //         e.preventDefault();
    //         getResults(0);
    //         return false;
    //     });
    //
    //     document.documentElement.addEventListener('click', function (e) {
    //         var pagelink;
    //         if (e.target.closest('.m-algolia-pages a')) {
    //             e.preventDefault();
    //
    //             pagelink = e.target.closest('.m-algolia-pages a').getAttribute('href');
    //             getResults(parseInt(pagelink.substring(1, pagelink.length), 0));
    //             return false;
    //         }
    //     });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Check for components
    var componentList = QSA('[data-component]');

    // Run functions/methods
    [].forEach.call(componentList, function (component) {
        if(component.dataset.component) {
            components[component.dataset.component]();
        } else {
            console.log(components.dataset.component + ' does not exist');
        }
    });
});
