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
         $('#polls').animate({'margin-top': -scrollToPoll}, 200, 'easeOutQuad');
      } else {                                                       // Portrait
         poll_positions = p_poll_positions;
         scrollToPoll = poll_positions[dex];
         $('#polls').animate({'margin-top': -scrollToPoll}, 200, 'easeOutQuad');
      }
   }

   var obj = document.getElementById('polls');
   obj.addEventListener('touchstart', function(event) {
      t_startX = (event.touches[0].clientX);
      t_startY = (event.touches[0].clientY);
      m_start = $('#polls').cssNumber('margin-top');
      event.preventDefault();
   }, false);

   obj.addEventListener('touchmove', function(event) {
      t_endX = (event.touches[0].clientX);
      t_endY = (event.touches[0].clientY);
      var new_margin = -((t_startY-t_endY) - m_start);
      if (new_margin<=0 && Math.abs(new_margin)<=poll_positions[poll_positions.length-1]) {
         $('#polls').css('margin-top', new_margin+'px');
      }
      event.preventDefault();
   }, false);
   
   obj.addEventListener('touchend', function(event) {
      var m_end = Math.abs($('#polls').cssNumber('margin-top'));
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
      $('.js-poll-select').removeClass('on');
      $('.js-poll-select').eq(dex).addClass('on');
      var scrollToPoll = poll_positions[dex];
      $('#polls').animate({'margin-top': -scrollToPoll}, 500, 'easeOutQuad');

      event.preventDefault();
   }, false);

   /* === Button Click === */

   $('.ratingStep fieldset a.radio').live('touchend', function() {
      // apply "on" class
      $(this).siblings().removeClass('on');
      $(this).toggleClass('on');

      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().children('input').val($(this).text());
      }

      return false;
   });

   $('.multiStep fieldset a.radio').live('touchend', function() {
      // apply "on" class
      $(this).parent().parent().find('a.radio').removeClass('on');
      $(this).toggleClass('on');

      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().parent().find('input.multi_choice').val($(this).next('strong').text());
      }

      return false;
   });

   $('input[type=submit]').live('touchend',function() {
      $(this).click();
      return false;
   });

   $('.js-poll-select').live('touchend',(function() {
      $('.js-poll-select').removeClass('on');
      $(this).addClass('on');
      var scrollToPoll = poll_positions[$(this).index()];
      console.log(scrollToPoll);
      $('#polls').animate({'top': -scrollToPoll}, 1000, 'easeOutQuad');
      event.preventDefault();
   }));

   $('textarea, input[type=text], input[type=email]').live('touchstart', function() {
      $(this).focus();
   });

   $('.opt_in, input[type=checkbox]').live('touchstart', function() {
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