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
         $('body,html').animate({scrollTop: scrollToPoll}, 200);
      } else {                                                       // Portrait
         poll_positions = p_poll_positions;
         scrollToPoll = poll_positions[dex];
      $('body,html').animate({scrollTop: scrollToPoll}, 200);
      }
   }

   var obj = document;

   obj.addEventListener('touchmove', function(event) {
      $('.js-poll-select').removeClass('on');
   });

   obj.addEventListener('touchend', function(event) {
      listenForPageY(window.pageYOffset, 'touchend', null);
   }, false);

   var listenForPageY = function(start_y, action, index) {
      var refresh = setInterval(function() {
         var prev_y = start_y;
         start_y = window.pageYOffset;
         if (prev_y == start_y) {
            if (action == 'touchend') {
               var m_end = Math.abs(start_y);
               poll_positions.push(m_end);
               poll_positions.sort(function(a,b){return a-b;});
               var dex = poll_positions.indexOf(m_end), val=0;
               if ( (poll_positions[dex] - poll_positions[dex+1]) > (poll_positions[dex-1] - poll_positions[dex])) {
                  val = poll_positions[dex+1];
               } else {
                  val = poll_positions[dex-1];
               }
               poll_positions.splice(poll_positions.indexOf(m_end),1);
               dex = poll_positions.indexOf(val);
               if (dex<0) { dex = 0; }
               $('.js-poll-select').eq(dex).addClass('on');
               var scrollToPoll = poll_positions[dex];
               $('body,html').animate({scrollTop: scrollToPoll}, 200, 'easeInQuad');
               clearInterval(refresh);
            } else {
               var scrollToPoll = poll_positions[index];`
               // $('body,html').animate({scrollTop: scrollToPoll}, 400, 'easeInQuad');
               $('body,html').scrollTop(scrollToPoll);
               clearInterval(refresh);
            }
         }
      }, 50);
   };

   $('.js-poll-select').live('click', (function() {
      listenForPageY(window.pageYOffset, 'click', $(this).index());
      return false;
   }));

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