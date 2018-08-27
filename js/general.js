var slider;

// JavaScript Document
$(function(){
	$('ul').each(function() {
		$(this).children().first().addClass('first');
		$(this).children().last().addClass('last');
	})

	$('.checkbox_hover').change(function() {
		$(this).toggleClass("change"); //you can list several class names 
		var chckedVal = $(this).find('input').attr('name');
		//alert(chckedVal);
	});
});
$(document).ready(function(){
  slider = $('.bxslider').bxSlider();

    if (document.documentElement.clientWidth > 550) {
        showService($('.service').first());

        $('.service').on('click',function(){
            $('.service-description').remove();
            showService($(this));
        });
    }
});

function showService(service) {
    var serviceInfo = service.find('p').html();
    var serviceDescription = $('<div class="service-description">' + serviceInfo + '</div>');
    $('.services').after(serviceDescription);
}
