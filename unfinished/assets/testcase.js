function initialize() {
    var latlng = new google.maps.LatLng(52.226117,6.895981);
    var myOptions = {
        zoom: 10,
        center: latlng,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    var map = new google.maps.Map(document.getElementById("map"),
        myOptions);
    var image = 'assets/marker.png';

    var latlng1 = new google.maps.LatLng(52.271256,6.797018);
	var marker1 = new google.maps.Marker({
		position: latlng1, 
		map: map, 
		icon: image
	});

    var boxText1 = document.createElement("div");
    boxText1.className = 'infobox';
    boxText1.innerHTML = '<strong>Isaac Sweersstraat</strong> &euro;450 per maand <a href="http://www.frmwrk.nl"><img src="assets/btn_infowindow.png"></a>';

    var myOptions = {
        content: boxText1
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-4, -32)
        ,zIndex: 100
        ,closeBoxURL: ""
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,isHidden: false
        ,pane: "mapPane"
        ,enableEventPropagation: false
    };

    var ib1 = new InfoBox(myOptions);
    google.maps.event.addListener(marker1, "click", function(e) {
        ib1.open(map, marker1);
    });

    var latlng2 = new google.maps.LatLng(52.226117,6.895981);
	var marker2 = new google.maps.Marker({
		position: latlng2, 
		map: map, 
		icon: image
	});

    var boxText2 = document.createElement("div");
    boxText2.className = 'infobox';
    boxText2.innerHTML = '<strong>Van Galenstraat</strong> &euro;750 per maand <a href="http://www.frmwrk.nl"><img src="assets/btn_infowindow.png"></a>';

    var myOptions = {
        content: boxText2
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-4, -32)
        ,zIndex: 100
        ,closeBoxURL: ""
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,isHidden: false
        ,pane: "mapPane"
        ,enableEventPropagation: false
    };

    var ib2 = new InfoBox(myOptions);
    google.maps.event.addListener(marker2, "click", function(e) {
        ib2.open(map, marker2);
    });
}

$(document).ready(function(){
    initialize();
});