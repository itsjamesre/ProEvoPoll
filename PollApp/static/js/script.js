/* === Polling App === */

$(document).ready(function(){
   document.body.addEventListener('touchmove', function(e) {
     // This prevents native scrolling from happening.
     e.preventDefault();
   }, false);

   var t_startX = 0,
      t_startY = 0,
      t_endX = 0,
      t_endY = 0,
      m_start = 0,
      increment = 0,
      l_increment = 731,
      p_increment = 885,
      index = 0,
      inputFocused = false;

   var polls_element = $("section#polls").get(0);
   polls_element.style.webkitTransitionDuration = '0.4s';

   function scrollToIndex(index) {
      var scrollToPoll = index;
      polls_element.style.webkitTransform = 'translate3d(0, ' + scrollToPoll*-1 + 'px, 0)';
   }

   window.onload = orientationchange;
   window.onorientationchange = orientationchange;
   function orientationchange() {
      if (window.orientation == 90 || window.orientation == -90) {
         increment = l_increment;
      } else {
         increment = p_increment;
      }
      scrollToIndex(index * increment);
   }

   $('a.radio').live('touchstart', (function() { return false; }));

   $('.resultsStep input').live('focus', function() { inputFocused = true; });
   $('.resultsStep input').live('blur', function() { // Fixes the Keyboard layout alterations on keyboard hide
      inputFocused = false;
      setTimeout(function() {
         if (!inputFocused) {
            $('body').animate({'scrollTop': 0},200);
         }
      }, 200);
   });

   $('button.nextStep').live('touchstart', function() {  // touchstart avoids the 300ms delay introduced by mobile webkit
      scrollToIndex((index+1) * increment);
      index++;
      return false;
   });

   Zepto('#polls').swipeUp(function() {
      if ((index+1) < 6) {
         scrollToIndex((index+1) * increment);
         index++;
      }
   });

   Zepto('#polls').swipeDown(function() {
      if (index > 0) {
         scrollToIndex((index-1) * increment);
         index--;
      }
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