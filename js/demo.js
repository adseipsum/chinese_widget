var randomNum = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

$(function() {	
	
	var timeout;
	
	$('#bsw')
	
	//	option type switch

	
	.on('click', '.closeReqoute', function() {
		$('.requote').removeClass('show');
	});
	
	
	
	$('#test')
	
	//	success msg
	.on('click', '#n2', function() {
		var msg = $('.successMsg');
		clearTimeout(timeout);
		msg.addClass('show');
		timeout = setTimeout(function() {
			msg.removeClass('show');
		}, 3000);
	})
	
	.on('click', '#n1', function() {
		$('.requote').toggleClass('show');
	})
	
	.on('click', '#n3', function() {
		$('.infoWindow').toggleClass('show');
	})
	
	.on('click', '#n4', function() {
		$('.noTrades').toggleClass('show');
	})
	
});