/* jshint esnext: true, esversion: 6 */

'use strict';

(function($){
    $(function(){

        // --------------------------------------------------------------------- Кнопка меню
        var $burger_menu = $('.burger-menu');
        var $side_menu = $('.side-menu');

        $burger_menu.on('click', function(e){
            e.preventDefault();
            if ($side_menu.hasClass('show')) return;

            $('body').addClass('blur');
            $side_menu.addClass('show');

            setTimeout(function(){
                $('body.blur').off('click.blur').on('click.blur', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if ($(e.currentTarget).hasClass('blur')) {

                        $side_menu.removeClass('show');
                        $('body').removeClass('blur').off('click.blur');
                    }
                });
            }, 50);
        });

        // --------------------------------------------------------------------- Слайдер
        var $slider = $('#mainpage-slider');
        if ($slider.length) {
            $slider.lightSlider({
                loop: true,
                pager: true,
                controls: false,
                mode: 'fade',
                speed: 600,
                pause: 10000,
                auto: true,
                item: 1
            });
        }

        $('.form-field select').select();


        // --------------------------------------------------------------------- Макси полей
        // Сотовые номера
        $('.mask-phone, input[type=tel]').inputmask({"mask": "+7 (999) 99-99-999"});

        // prevent incorrect input for input type=number
        $('input[type="number"], input.number').on('keydown', function(e){
            // enter, bask, del, comma, dot, 0-9
            var correct = [8, 13, 46, 188, 190, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
            if ($.inArray(e.keyCode, correct) === -1) {
              e.preventDefault();
              e.stopPropagation();
            }
        });


        // --------------------------------------------------------------------- Модалки
        var $overlay = $('.modal-overlay');
        $('[data-modal]').on('click', function(e) {
            e.preventDefault();

            var modal = $(e.currentTarget).attr('data-modal');
            var $modal = $overlay.find('.modal#' + modal);

            $overlay.find('.modal').removeClass('show');
            if ($modal.length) {
                $overlay.addClass('show');
                $modal.addClass('show');
            }
        });

        $overlay.on('click', '.modal a.close', function(e) {
            var $modal = $(e.currentTarget).closest('.modal');

            $overlay.removeClass('show');
            $modal.removeClass('show');
        });


    });
})(jQuery);
