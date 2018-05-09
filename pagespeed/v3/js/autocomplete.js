/* This key only works from the Pro6PP domains, for demo purposes.
   Replace this auth_key with your own.
 */
//var pro6pp_auth_key = "WHnKf9dym89t1UUW"; //DEMO
var pro6pp_auth_key = "eYLECZgfEgt55GuF"; //PAYED

/* Enable the use of the feedback call to improve the postcode database
 * by switching this setting to true. For more information:
 * http://d-centralize.nl/pro6pp/examples/feedback
 */
var pro6pp_provide_feedback = false;

// Create closure to keep namespace clean and hide implementation.
(function($) {
	// Trigger on '5408xb' and on '5408 XB'
	NL_SIXPP_REGEX = /[0-9]{4,4}\s?[a-zA-Z]{2,2}/;

	$.fn.applyAutocomplete = function(options) {
		var instance = this;
		if (options)
		{
			// Developer chose to specify each form field manually.
			instance.postcode = $(options['postcode']);
			instance.streetnumber = $(options['streetnumber']);
			instance.street = $(options['street']);
			instance.streets = $(options['streets']);
			instance.city = $(options['city']);
			instance.municipality = $(options['municipality']);
			instance.province = $(options['province']);
			instance.lat = $(options['lat']);
			instance.lng = $(options['lng']);
			instance.areacode = $(options['areacode']);
			instance.message = $(options['message']);
			instance.spinner = $(options['spinner']);
		} else {
			// Developer chose to only specify the container class.
			// Input fields within should follow the following class
			// naming convention.
			instance.postcode = this.find('.postcode');
			instance.streetnumber = this.find('.streetnumber');
			instance.street = this.find('.street');
			instance.streets = this.find('.streets');
			instance.city = this.find('.city');
			instance.municipality = this.find('.municipality');
			instance.province = this.find('.province');
			instance.lat = this.find('.lat');
			instance.lng = this.find('.lng');
			instance.areacode = this.find('.areacode');
			instance.message = this.find('.message');
			instance.spinner = this.find('.spinner');
		}

		// Turn off browser autocompletion for the postcode field.
		// Because javascript is unable to catch an event when a user clicks a
		// previously filled-in value that the browser may suggest.
		// The autocomplete attribute became official in HTML5, but used to work long before that.
		instance.postcode.attr('autocomplete', 'off');
		instance.postcode.keyup(function() {
			autocomplete(instance);
		});
		instance.streetnumber.attr('autocomplete', 'off');
		instance.streetnumber.keyup(function() {
			autocomplete(instance);
		});
        // Gather new data through the feedback API call
		instance.street.blur(function() {
			feedback(instance);
		});
		// Bind event handler to street selectbox.
		if (instance.streets != undefined)
		{
			// When pressing tab, make a selection.
			instance.streets.blur(function() {
				show_street(instance);
			});
		}
	};

	var pro6pp_cache = {};
	function pro6pp_cached_get(obj, url, callback) {
		if (pro6pp_cache.hasOwnProperty(url)) {
			if (callback != undefined) { callback(obj, pro6pp_cache[url]); }
		} else {
			$.getJSON(url + "&callback=?", function(data) {
				pro6pp_cache[url] = data;
				if (callback != undefined) { callback(obj, data); }
			});
		}
	}

	// Request geo-data from nl_sixpp
	function autocomplete(obj) {
		obj.message.empty();
		var postcode = obj.postcode.val();
		var streetnumber = obj.streetnumber.val();

        if (NL_SIXPP_REGEX.test(postcode)) {

            $(obj.streetnumber).parents('td').find('.autocomplete_loading').css('display','inline');

			show_street(obj);
			obj.spinner.show();
			var url = "https://api.pro6pp.nl/v1/autocomplete"
					+ "?auth_key=" + pro6pp_auth_key
					+ "&nl_sixpp=" + postcode
					+ "&streetnumber=" + streetnumber;
			url = encodeURI(url);
			pro6pp_cached_get(obj, url, fillin);
		} else {
			obj.street.empty();
			obj.street.empty();
		}
	}

	function show_street(obj) {
		obj.street.show();
		obj.streets.hide();
		// Copy over the selected value (if any)
		obj.street.val(obj.streets.val());
	}
	function show_streets(obj) {
		obj.street.hide();
		obj.streets.show();
	}

	function escapeHtml(unsafe) {
		// Some characters that are received from the webservice should be escaped when used in HTML
		return unsafe
		  .replace(/&/g, "&amp;")
		  .replace(/</g, "&lt;")
		  .replace(/>/g, "&gt;")
		  .replace(/"/g, "&quot;")
		  .replace(/'/g, "&#039;");
	}

	function fillin(obj, json) {
		obj.spinner.hide();
		if (json.status == 'ok') {
			if (json.results.length == 1) {
				obj.street.val(json.results[0].street);
			} else {
				var streets = obj.streets;
				streets.empty();
				$.each(json.results, function(i, street) {
					// Some characters like the quote in "'s-Gravenweg" need to be escaped before it can be
					// put in the value field.
					var escapedStreet = escapeHtml(street.street);
					var newOption = $("<option value='" + escapedStreet + "'>" + street.street + "</option>");
					streets.append(newOption);
					// IE doesn't react well on having the click handler attached to the
					// selectbox itself. It needs to be attached to the individual options.
					newOption.click(function() {
						show_street(obj);
					});
				});
				show_streets(obj);
			}
			obj.city.val(json.results[0].city);
			obj.lat.val(json.results[0].lat);
			obj.lng.val(json.results[0].lng);
			obj.areacode.val(json.results[0].areacode);
			// You might also want to add these extra fields
			obj.municipality.val(json.results[0].municipality);
			obj.province.val(json.results[0].province);
		} else {
			var translated_message = json.error.message;
			if (json.error.message == 'nl_sixpp not found') {

				translated_message = 'Onbekende postcode';
                                // Make input fields writable.
                                obj.street.removeAttr('readonly');
                                obj.city.removeAttr('readonly');

			} else if (json.error.message == 'invalid postcode format') {

				translated_message = 'Ongeldig postcode formaat';

			} else if (json.error.message == 'Streetnumber not found') {

				translated_message = 'Huisnummer onbekend';

			}

			obj.message.html(translated_message);
		}

        $(obj.streetnumber).parents('td').find('.autocomplete_loading').css('display','none');
	}

	// Feed new data into the system.
	function feedback(obj) {
		var postcode = obj.postcode.val();
		var street = obj.street.val();
		var streetnumber = obj.streetnumber.val();

		// Only provide feedback when developer explicitly opts-in.
		if (!pro6pp_provide_feedback) { return; }

		// Provide feedback when user enters at least a valid postcode and custom street.
		if (NL_SIXPP_REGEX.test(postcode) &&
				!obj.street.attr('readonly') && street) {
			var url = "https://api.pro6pp.nl/v1/feedback"
					+ "?auth_key=" + pro6pp_auth_key
					+ "&nl_sixpp=" + postcode
					+ "&street=" + street
					+ "&streetnumber=" + streetnumber;
			url = encodeURI(url);
			pro6pp_cached_get(obj, url, null);
		}
	}
//
// end of closure
//
})(jQuery);
