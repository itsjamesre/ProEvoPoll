/* === Polling App === */

$(document).ready(function(){
   // Reset Cookies for user
   $.cookie('full_name', null);
   $.cookie('work_email', null);
   $.cookie('user_val', 'false');

   var t_startX = 0,
      t_startY = 0,
      t_endX = 0,
      t_endY = 0,
      m_start = 0,
      poll_positions = [],                                           // Current
      l_poll_positions = [0,736,1472],                               // Landscape
      p_poll_positions = [0, 881, 1762];                             // Portrait

   window.onload = orientationchange;
   window.onorientationchange = orientationchange;
   function orientationchange() {
      var dex = $('nav .js-poll-select.on').index();
      if (window.orientation == 90 || window.orientation == -90) {   // Landscape
         poll_positions = l_poll_positions;
         scrollToPoll = poll_positions[dex];
         $('#wrapper').animate({scrollTop: scrollToPoll}, 200);
      } else {                                                       // Portrait
         poll_positions = p_poll_positions;
         scrollToPoll = poll_positions[dex];
      $('#wrapper').animate({scrollTop: scrollToPoll}, 200);
      }
   }

   function scrollToIndex(index) {
      var scrollToPoll = poll_positions[index];
      //$('#status').html(scrollToPoll);
      $("#wrapper").animate({scrollTop: scrollToPoll}, 400, 'easeOutQuad', function() {
         $('.js-poll-select').removeClass('on');
         $('.js-poll-select').eq(index).addClass('on');
      });
   }

   $('.js-poll-select').click(function() {
      $('.js-poll-select').removeClass('on');
      $(this).addClass('on');
      //var scrollToPoll = poll_positions[$(this).index()];
      
      scrollToIndex($(this).index());
      //$("#wrapper").animate({scrollTop: scrollToPoll}, 400, 'easeOutQuad');
   });


   $(function(){
      $('#polls')
         .swipeEvents()
         .bind("swipeLeft",  function(){ $('#status').html("Swipe Left"); })
         .bind("swipeRight", function(){ $('#status').html("Swipe Right"); })
         .bind("swipeDown",  function(){
            $('#status').html("Swipe Down");
            var index = $('.js-poll-select.on').index();
            if (index > 0) {
               scrollToIndex(index-1);
               // var scrollToPoll = poll_positions[index-1];
               // $('#wrapper').animate({scrollTop: scrollToPoll}, 400, 'easeInQuad', function() {
               //    $('.js-poll-select').removeClass('on');
               //    $('.js-poll-select').eq(index-1).addClass('on');
               // });
            }
         })
         .bind("swipeUp", function(){
            $('#status').html("Swipe Up");
            var index = $('.js-poll-select.on').index();
            if ((index+1) < poll_positions.length) {
               scrollToIndex(index+1);
               // var scrollToPoll = poll_positions[index+1];
               // $('#wrapper').animate({scrollTop: scrollToPoll}, 400, 'easeInQuad', function() {
               //    $('.js-poll-select').removeClass('on');
               //    $('.js-poll-select').eq(index+1).addClass('on');
               // });
            }
         });
      });

   /* === Button Click === */

   $('.ratingStep fieldset a.radio').live('click', function(e) {
      // apply "on" class
      $(this).siblings().removeClass('on');
      $(this).toggleClass('on');
      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().children('input').val($(this).text());
      }
      $('#status').html('all click');
      e.preventDefault();
   });

   $('.multiStep fieldset a.radio').live('click', function() {
      // apply "on" class
      $(this).parent().parent().find('a.radio').removeClass('on');
      $(this).toggleClass('on');

      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().parent().find('input.multi_choice').val($(this).next('strong').text());
      }

      return false;
   });

   $('input[type=submit]').live('click',function() {
      $(this).click();
      return false;
   });

   $('textarea, input[type=text], input[type=email]').live('click', function() {
      $(this).focus();
   });

   $('.opt_in, input[type=checkbox]').live('click', function() {
      $(this).find('input[type=checkbox]').click();
      var opt_value = $(this).find('.user_opt').attr('value');
      if (opt_value === 'false') { $(this).find('.user_opt').attr('value', 'true'); }
      else { $(this).find('.user_opt').attr('value', 'false'); }
   });
});

jQuery.fn.cssNumber = function(prop){
    var v = parseInt(this.css(prop),10);
    return isNaN(v) ? 0 : v;
};