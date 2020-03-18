var window_width = $(window).width() - $('#collage2').width();

var document_height = $(document).height() - $(window).height();
var x = 1500;

$(function () {
    $(window).scroll(function () {
      var scroll_position = $(window).scrollTop();
      var bpTop = $('#parallax').offset().top;
      var bpBottom = bpTop + $('#parallax').height() - 100;
      var dist =  bpTop - scroll_position;
      //appearance
      if (scroll_position < 100){
        $('#oscarCircle').css({
            'top':scroll_position,
            'opacity':1
        });
      }
      if (scroll_position > 100 && scroll_position < 300) {
        var object_position_left = window_width * (scroll_position / document_height)+10;
        $('#bradpitt').css({
            'left': object_position_left,
            'opacity':1
        });
        $('#joker').css({
            'left': object_position_left,
            'opacity':1
        });

        $('#jojo').css({
            'right': 80+object_position_left,
            'opacity':1
        });

        $('#collage3').css({
            'left': 80+object_position_left,
            'opacity':1
        });


      }

      if (scroll_position > 100 && scroll_position < 1000) {
        var object_position_left = window_width * (scroll_position / document_height)+200;
        $('#collage2').css({
            'left': object_position_left,
            'opacity':1
        });
        $('#collage1').css({
            'left': object_position_left-200,
            'opacity':1
        });

      }
      if (scroll_position > 1300) {
        $('#collage2').css({
            //'position':'absolute',
            'animation' : 'fade',
            'animation-duration': '1s',
            'opacity': 0
        });
        $('#titleContent').css({
            //'position':'absolute',
            'animation' : 'fade',
            'animation-duration': '1s',
            'opacity': 0
        });
        $('#collage1').css({
            //'position':'absolute',
            'animation' : 'fade',
            'animation-duration': '1s',
            'opacity': 0
        });
        $('#bradpitt').css({
            //'position':'absolute',
            'animation' : 'fade',
            'animation-duration': '1s'
        });
        $('#joker').css({
            //'position':'absolute',
            'animation' : 'fade',
            'animation-duration': '1s',
            'opacity': 0
        });
        $('#bradpitt').css({
            //'position':'absolute',
            'animation' : 'fade',
            'animation-duration': '1s',
            'opacity': 0
        });

        $('#jojo').css({
          'animation' : 'fade',
          'animation-duration': '1s',
          'opacity': 0
        });

        $('#oscarCircle').css({
          'animation' : 'fade',
          'animation-duration': '1s',
          'opacity': 0
        });

        $('#collage3').css({
          'animation' : 'fade',
          'animation-duration': '1s',
          'opacity': 0
        });
      }
  });
});
