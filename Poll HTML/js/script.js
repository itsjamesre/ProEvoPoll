/* === Polling App === */

$(function(){
   
   /* === Button Click === */
   
   $('button.js-poll-select, fieldset a.radio').live('click', function(){
      
      // play sound
      $('embed').remove();
      $('body').append('<embed src="../audio/Click03.wav" autostart="true" hidden="true" loop="false">');
      
      // apply "on" class
      $(this).siblings().removeClass('on');
      $(this).addClass('on');
      return false;
   });
   
});