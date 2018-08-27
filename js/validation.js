var local_ip = '';
var options = new Array();
var suppress_page_click = false;

function SetLocalIP ( ip )
    {
    local_ip = ip;
    }

function smothScrollTo(el) {
	//var el 	= el || 'document';
	$('body, html').animate({ scrollTop: $(el).offset().top }, 1000);
}

$(document).ready(function() {
     CallAutopopulate();
    options.push ( {option_id:'check_all',option_label:'Select All',image_class:'img6',map_to:''} );
    options.push ( {option_id:'check_solar',option_label:'Solar Energy',image_class:'img1',map_to:'interest_solar'} );
    options.push ( {option_id:'check_security',option_label:'Home Security',image_class:'img2',map_to:'interest_security'} );
    options.push ( {option_id:'check_phone',option_label:'Phone &amp; Internet',image_class:'img3',map_to:'interest_phone'} );
    options.push ( {option_id:'check_tv',option_label:'Satellite &amp; Cable TV',image_class:'img4',map_to:'interest_tv'} );
    options.push ( {option_id:'check_insurance',option_label:'Home Insurance',image_class:'img5',map_to:'interest_insurance'} );

    $('#select_options').hide();
    
    IPToGeo ( local_ip, true, 'geo_city', 'html', '%%city_name%%, %%region_code%%', 'Your city' );
    
	$(".second,.third,.only-bg").hide();
	$('.only-bg').click(function(e){
		$(".second,.third,.only-bg").fadeOut(500);
	});

    PrepopulateStaticData();

    SetPrepopMap ( home_security_qs_id_map );
    PrepopulateFields();
    
   
    $('#edit_address_pre').val($('#edit_address').val());
    $('#edit_city_pre').val($('#edit_city').val());
    $('#edit_state_pre').val($('#edit_state').val());
    $('#edit_zip_pre').val($('#edit_zip').val());
    $('#edit_homeowner_pre').val($('#edit_homeowner').val());
    
//    $('#txt-pincode').val($('#edit_zip').val());

    // Persist qs lead data
    LeadSaveData();

    $("#home-form").submit(function()
        {
        var valid;

        valid = ValidateControls('home');
        if ( valid )
            {

            $('#edit_address').val($('#edit_address_pre').val());
            $('#edit_city').val($('#edit_city_pre').val());
            $('#edit_state').val($('#edit_state_pre').val());
            $('#edit_zip').val($('#edit_zip_pre').val());
            $('#edit_homeowner').val($('#edit_homeowner_pre').val());
            // $('#edit_current_provider').val($('#edit_current_provider_pre').val());
            // $('#edit_monthly_bill').val($('#edit_monthly_bill_pre').val());
            // $('#edit_roof_shade').val($('#edit_roof_shade_pre').val());

            // Transition
            $(".second").fadeOut(500);

             var top = ($(window).height() - $('.third').height()) / 2;
             var left = ($(window).width() - $('.third > div').width()) / 2;
             $(".third").fadeIn(500);
             $(".third").css('left',left);
             $(".third").css('top',top);
				/* Add Lex */
			 smothScrollTo(".third");
            document.getElementById("home-form").reset();
            }

        // Don't allow actual form submit in any case
        return ( false );
	});

    $("#registration-form").submit(function()
        {
        var valid;

        var fullname = $('#edit_firstname').val() + ' ' + $('#edit_lastname').val();
        $('#edit_fullname').val(fullname);

        valid = ValidateControls('registration');

        return ( valid );
	    });

    $("#pincode-form").submit(function()
        {
        $('#txt-pincode').removeClass('error');
        field_valid = /^[0-9]{5}$/.test($('#txt-pincode').val());
        if ( !field_valid )
            {
            $('#txt-pincode').addClass('error');
            return ( false );
            }
        else
            {
            $("#edit_zip").val($('#txt-pincode').val());

             var top = ($(window).height() - $('.second').next('div').height()) / 2;
             var left = ($(window).width() - $('.second > div').width()) / 2;

             $(".second").fadeIn(500);
             $(".second").css('left',left);
             $(".second").css('top',top);

			 smothScrollTo(".second");
             $(".only-bg").show();
             $(".only-bg").css('height',$(document).height());
            
            
            $.each(options, function( index, option ) {
                var checked = $('#' + option.option_id).is(':checked');
                if ( checked )
                    checked = 1;
                else
                    checked = 0;
                    
                if ( option.map_to != '' )
                    $('#' + option.map_to ).val(checked);
                });

            return false;
            }
	    });

    $("#check_all").click(function() 
        {
        var checked = $('#check_all').is(':checked');
            
        $.each(options, function( index, option ) {
            $('#' + option.option_id).prop('checked', checked);
            });

        SuppressClick();    
        });
        
    $("#page_body").click(function() 
        {
        if ( !suppress_page_click )
            HideOptions();
        });

    $("#select_options").click(function() 
        {
        SuppressClick();    
        });
        
    $("#select_drop").click(function() 
        {
        if ( $('#select_options').is(':visible' ) )
            HideOptions();
        else
            ShowOptions();
        
        SuppressClick();    
        });

    SetLabel();
    
    $('#zipcode_div').show();
    });

function SuppressClick()
    {
    suppress_page_click = true;
    setTimeout(function(){
      suppress_page_click = false;
      }, 250);
    }
    
function ShowOptions() {
    if ( !$('#select_options').is(':visible' ) )
        {
        $('#select_options').show();
        $('#select_drop').addClass('opened');
        }
}

function HideOptions() {
    if ( $('#select_options').is(':visible' ) )
        {
        $('#select_options').hide();
        $('#select_drop').removeClass('opened');
        SetLabel();
        }
}

function SetLabel() {
    var value = '';
    var count = 0;
    var image_class = '';

    $("[vslide]").attr('id',function(index,id)
        {
        $('#' + id).remove();
        });
    
    var slide_template = '<li class="%%image_class%%" id="slide_%%image_class%%" vslide="1">&nbsp;</li>';
    var slide;
    
    $.each(options, function( index, option ) {
        if ( $('#' + option.option_id).is(':checked') )
            {
            count ++;
            value = option.option_label;
            slide = slide_template.replace(/%%image_class%%/g, option.image_class );
            $('.bxslider').append(slide);
            }
            
    });
    
    if ( count === 0 )
        {
        slide = slide_template.replace(/%%image_class%%/g, 'img6' );
        $('.bxslider').append(slide);
        }
    
    if ( count > 1 )
        value = 'Multiple';
        
    $('#select_drop').html(value);
    slider.reloadSlider();
}    