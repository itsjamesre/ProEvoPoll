/* === Polling App === */

$(function(){
   
   /* === Button Click === */

   $('.ratingStep fieldset a.radio').live('click', function() {
      // apply "on" class
      $(this).siblings().removeClass('on');
      $(this).toggleClass('on');

      // set hidden input
      if ($(this).hasClass('on')) {
         $(this).parent().children('input').val($(this).text());
      }

      return false;
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

   $('input[type=submit]').live('click', function() {
      return false;
   });

   $('.js-poll-select').live('click', function() {
      $('.js-poll-select').removeClass('on');
      $(this).addClass('on');
      if ($(this).attr('id') == 'poll1') {
         $.scrollTo($('div.poll:eq(0)'), 500, {offset: -20});
      }
      if ($(this).attr('id') == 'poll2') {
         $.scrollTo($('div.poll:eq(1)'), 500, {offset: -20});
      }
      if ($(this).attr('id') == 'poll3') {
         $.scrollTo($('div.poll:eq(2)'), 500, {offset: -20});
      }
   });
});