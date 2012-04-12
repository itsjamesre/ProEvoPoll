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
   
});