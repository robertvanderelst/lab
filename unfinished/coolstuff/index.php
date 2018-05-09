<!DOCTYPE html>
<html>
    <head>
        <title>Geolocation with custom markers</title>
        <meta http-equiv='Content-Type' content='Type=text/html; charset=utf-8'>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <style type="text/css">
            html,
            body {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
            }
            
            body {
                position: relative;
                font-family: Arial;
                font-size: 100%;
                background: url(background.png) #202020;
            }
            
            nav {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                overflow: hidden;
                background: #555;
                padding: .5em;
                z-index: 2;
				/*display: none;*/
            }
            
            fieldset {
                border: 0;
                padding: 0;
                margin: 0;
            }
            
            #search {
                float: left;
            }
            
            #filter {
                float: right;
            }
            
            form legend {
                display: none;
            }
            
            #help {
                position: absolute;
                right: .5em;
                bottom: .5em;
                display: block;
                width: 1.333em;
                height: 1.333em;
                font-size: 150%;
                font-weight: bold;
                line-height: 1.333em;
                text-align: center;
                background: rgba(0,0,0,.5);
                border-radius: .666em;
                color: #000;
                text-decoration: none;
                z-index: 2;
            }
            
            #map {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .popup {
				position: absolute;
				top: 5em;
                left: 50%;
                width: 50%;
                margin-left: -25%;
                background: rgba(255,255,255,.8);
                z-index: 2;
                color: #fff;
			}
            
            #popup_help {
                display: none;
            }
        </style>
    </head>
    <body>
        <nav>
            <form id="search">
                <fieldset>
                    <legend>Search</legend>
                    <input type="text">
                    <input type="submit">
                </fieldset>
            </form>
            <form id="filter">
                <fieldset>
                    <legend>Filter</legend> 
                    <select>
                        <option>All</option>
                        <option>Restaurants</option>
                        <option>Fashion</option>
                        <option>Gadgets</option>
                        <option>Gifts</option>
                        <option>Interior</option>
                    </select>
                    <input type="submit">
            </form>
        </nav>
        
        <!-- MAP -->
        <div id="map"><span>Finding current position</span></div>
        
        
        <!-- POPUP FOR PERMISSION GEOLOCATION -->
        <div id="popup_initial" class="popup">
          Can we check to see where we are?
          <button id="btnInit" >Sure!</button>
        </div>
        
        <!-- HELP -->
        <a id="help" href="#help" title="Need help?">
            <span>?</span>
        </a>
        <div id="popup_help" class="popup">
            - About<br>
            - Blog<br>
            - Language?<br>
        </div>
            
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
        <script>
            /* TODO
            - Zoekfunctie werkend maken
            - Help functie werkend maken
            - Filters werkend maken
			https://developers.google.com/maps/location-based-apps
			- Styling
			- Process flow
			
			- Markers
				- http://stackoverflow.com/questions/2943474/google-maps-v3-only-show-markers-in-viewport-clear-markers-issue
                - https://developers.google.com/maps/documentation/javascript/training/customizing/custom-markers
				- https://developers.google.com/maps/articles/toomanymarkers
				- http://www.svennerberg.com/2009/07/google-maps-api-3-markers/
                
            - Infobox
                - http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.5/docs/reference.html
                - http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.5/docs/examples.html
			
			
            - Aan het einde: Minify! + refactoring/optimalisatie JS
            
            */
            
            // Variables and Arrays
            var imgbase = 'https://maps.google.com/mapfiles/kml/shapes/';
            var markericons = {
              parking: imgbase + 'parking_lot_maps.png',
              library: imgbase + 'library_maps.png',
              info: imgbase + 'info-i_maps.png'
            };
            
			window.onload = function() {
                // GENERIC 
            	function t(id) {
					return document.getElementById(id); 
				}
                
                // UI
                t('help').addEventListener("click", show_help, false);
                
                function show_help() {
                    t('popup_help').style.display = 'block';
                }
                
                // MAPS
				var markers = {
					'test': {
						'lat': 51.92283,
						'lng': 4.47845,
						'title': 'Test marker 1',
                        'type': 'restaurant'
					},
					'test2': {
						'lat': 51.93283,
						'lng': 4.47845,
						'title': 'Test marker 2',
                        'type': 'museum'						
					}
				};

				t('btnInit').addEventListener("click",initiate_geolocation, false);

				function initiate_geolocation() {
					t("popup_initial").parentNode.removeChild(t("popup_initial"));
					navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
				}

				function handle_errors(error) {
					switch(error.code) {
						case error.PERMISSION_DENIED: alert("user did not share geolocation data");
						break;
						case error.POSITION_UNAVAILABLE: alert("could not detect current position");
						break;
						case error.TIMEOUT: alert("retrieving position timed out");
						break;
						default: alert("unknown error");
						break;
					}
				}

				function handle_geolocation_query(position) {
					var pos_lat = position.coords.latitude;
					var pos_log = position.coords.longitude;

					var latlng = new google.maps.LatLng(pos_lat,pos_log);
					var myOptions = {
						zoom: 17,
						center: latlng,
						panControl: false,
						zoomControl: true,
						mapTypeControl: false,
						scaleControl: false,
						streetViewControl: false,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

					var map = new google.maps.Map(document.getElementById("map"),
					myOptions);
					
					
					setMarkers(map, markers);
				}
				
				function setMarkers(map, markers) {
					var marker_pos, marker;
					
					for (var i in oMarkers) {
						marker_pos = new google.maps.LatLng(markers[i].lat, markers[i].lng);
						
						marker = new google.maps.Marker({
							position: marker_pos,
							map: map,
							title: markers[i].title,
                            icon: markericons[markers[i].type]
						});
					}
				}
			}
        </script>
    </body>
</html>