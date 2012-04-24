/* === Polling App === */

$(document).ready(function(){
   document.body.addEventListener('touchmove', function(e) {
  // This prevents native scrolling from happening.
  e.preventDefault();
}, false);

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

   var polls_element = $("section#polls").get(0);
   polls_element.style.webkitTransitionDuration = '0.4s';

   function scrollToIndex(index) {
      $('button.js-poll-select').removeClass('on').eq(index).addClass('on');
      var scrollToPoll = poll_positions[index];
      polls_element.style.webkitTransform = 'translate3d(0, ' + scrollToPoll*-1 + 'px, 0)';
   }

   window.onload = orientationchange;
   window.onorientationchange = orientationchange;
   function orientationchange() {
      var dex = $('nav .js-poll-select.on').index();
      if (window.orientation == 90 || window.orientation == -90) {   // Landscape
         poll_positions = l_poll_positions;
      } else {                                                       // Portrait
         poll_positions = p_poll_positions;
      }
      scrollToIndex(dex);
   }

   $('button.js-poll-select').bind('touchstart', function() {  // touchstart avoids the 300ms delay introduced by mobile webkit
      scrollToIndex($(this).index());
      return false;
   });

   Zepto('#polls').swipeUp(function() {
      var index = $('.js-poll-select.on').index();
      if ((index+1) < poll_positions.length) {
         scrollToIndex(index+1);
      }
   });
   Zepto('#polls').swipeDown(function() {
            var index = $('.js-poll-select.on').index();
            if (index > 0) {
               scrollToIndex(index-1);
            }
   });

   $('a.radio').live('touchstart', (function() { return false; }));

   $('input, textarea').live('blur', function() { // Fixes the Keyboard layout alterations on keyboard hide
      $('body').animate({'scrollTop': 0},200);
   });

   Zepto('#polls .ratingStep a.radio').live('tap', (function(e) {
      // apply "on" class
      $(this).siblings().removeClass('on');
      $(this).toggleClass('on');
      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().children('input').val($(this).text());
      }
   }));

   Zepto('#polls .multiStep a.radio').live('tap', (function() {
      // apply "on" class
      $(this).parent().parent().find('a.radio').removeClass('on');
      $(this).toggleClass('on');

      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().parent().find('input.multi_choice').val($(this).next('strong').text());
      }
   }));

   Zepto('.opt_in, input[type=checkbox]').live('tap', function() {
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