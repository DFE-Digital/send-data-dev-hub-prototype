/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
	window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function() {
	window.GOVUKFrontend.initAll()

	function controlLimit() {
		if ($('.inline-url-row').length >= 19) {
			$('#addAnotherURL').hide()
			$('#limitReached').show()
		} else {
			$('#addAnotherURL').show()
			$('#limitReached').hide()
		}
	}

	$('#addAnotherURL').on('click', function(e) {
		e.preventDefault()
		var oRedirectUrlInput = $('#redirectURL').clone()
		oRedirectUrlInput.attr(
			'id',
			'redirectURL' + $('#redirectURLWrapper input').length
		)
		oRedirectUrlInput.attr(
			'name',
			'redirectURL' + $('#redirectURLWrapper input').length
		)
		oRedirectUrlInput.addClass('govuk-!-margin-top-0')
		var newURLrow = $.parseHTML(
			'<div class="inline-url-row govuk-!-margin-top-2"><a class="removeLink" href="#">Remove</a></div>'
		)
		var newURLrow = $(newURLrow)
		newURLrow.prepend(oRedirectUrlInput)
		$('#redirectURLWrapper').append(newURLrow)
		controlLimit()
	})

	$(document).on('click', 'a.removeLink', function(e) {
		e.preventDefault()
		$(this)
			.closest('.inline-url-row')
			.remove()
		controlLimit()
	})

	$('.show-hide-content').on('click', '.show-key', function(e) {
		e.preventDefault()
		var oldMarkup = $('.show-hide-content').html()
		var that = $(this)
		$.get(that.attr('href'), function(data, status) {
			var newMarkup = data
			newMarkup +=
				'<a class="block govuk-!-font-size-16 govuk-!-font-weight-regular" href="#">Copy ' +
				that.attr('data-type') +
				'</a>'
			$('.show-hide-content').html(newMarkup)

			setTimeout(function() {
				$('.show-hide-content').html(oldMarkup)
			}, 5000)
		})
	})

	$('a.show-hide-content').on('click', function(e) {
		e.preventDefault()
		var oKey = $('<span">5f7f411234a44a68a2ea71062d271a59</span>').insertBefore(
			$(this)
		)
		$(this).hide()

		var that = $(this)
		setTimeout(function() {
			that.show()
			oKey.hide()
		}, 5000)
	})
})
