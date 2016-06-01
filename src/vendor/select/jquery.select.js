/*
 * jQuery spacedSelect
 */

(function($) {
    $.fn.select = function(o) {
        $(this).each(function() {
            var select = $(this);
            if (select.prev('span.spacedSelect').length) // Проверяем, возможно стилизация уже сработала
            {
                select.prev('span.spacedSelect').remove();
            }

            function create_select() {
                var $option_list = select.find('option');
                var $optionSelected = $option_list.filter(':selected');
                var $optionText = $option_list.filter(':first').text();
                if ($optionSelected.length) $optionText = $optionSelected.text(); // текст по умолчанию - значение выбранной опции
                var $dd_list = $('<ul></ul>');
                $option_list.each(function(n, option) {
                    var selected = '';
                    var $option = $(option);

                    if ($option.is(':selected')) selected = ' class="selected sel"';
                    if ($option.is(':disabled')) selected = ' class="disabled"';
                    if ($option.attr('value')) {
                        selected += ' data-value="' + $option.attr('value') + '"';
                    }
                    if ($option.attr('data-id')) {
                        selected += ' data-id="' + $option.attr('data-id') + '"';
                    }

                    var $opt = $('<li' + selected + '>' + $option.text() + '</li>');

                    if ($option.parent().is('optgroup')) // Это вложенный элемент
                    {
                        var group_name = $option.parent().attr('label'); // название группы
                        var $group = $dd_list.find('li[data-group="' + group_name + '"] ul').eq(0);
                        if ($group.length < 1) // Группа еще не создана, создаем.
                        {
                            var $li = $('<li data-group="' + group_name + '"><span>' + group_name + '</span></li>');
                            $group = $('<ul></ul>');
                            $li.append($group);
                            $dd_list.append($li);
                        }
                        $group.append($opt);
                    } else {
                        $dd_list.append($opt);
                    }
                });
                var selectbox =
                    $('<span class="spacedSelect" style="display:inline-block;position:relative">' +
                        '<div class="select" style="float:left;position:relative;z-index:10000"><div class="text">' + $optionText + '</div>' +
                        '<b class="trigger"><i class="arrow"></i></b>' +
                        '</div>' +
                        '<div class="dropdown" style="position:absolute;z-index:9999;list-style:none"></div>' +
                        '</span>');
                select.before(selectbox).css({
                    position: 'absolute',
                    top: -9999,
                    left: -1000
                });
                selectbox.find('.dropdown').html($dd_list);
                var divSelect = selectbox.find('div.select');
                var divText = selectbox.find('div.text');
                var dropdown = selectbox.find('div.dropdown');
                var li = dropdown.find('li');
                var selectHeight = selectbox.outerHeight();

                var position_left = (o && o.left) ? o.left : 0;

                if (dropdown.css('left') == 'auto') dropdown.css({
                    left: position_left
                });
                if (dropdown.css('top') == 'auto') dropdown.css({
                    top: selectHeight
                });
                var liHeight = li.outerHeight();
                var position = dropdown.css('top');
                position = parseInt(position) + 1;

                if (o && o.top) {
                    position = o.top;
                }

                // опция принудительно показывает сверху
                if (o && o.bottom) {
                    var to_top = true;
                    position = o.bottom;
                }

                dropdown.hide();
                /* при клике на псевдоселекте */
                divSelect.click(function() {
                    /* умное позиционирование */
                    var topOffset = selectbox.offset().top;
                    var bottomOffset = $(window).height() - selectHeight - (topOffset - $(window).scrollTop());
                    if (to_top || bottomOffset < 0 || bottomOffset < liHeight * 6) {
                        dropdown.height('auto').css({
                            top: 'auto',
                            bottom: position
                        });
                        if (dropdown.outerHeight() > topOffset - $(window).scrollTop() - 20) {
                            dropdown.height(Math.floor((topOffset - $(window).scrollTop() - 20) / liHeight) * liHeight);
                        }
                    } else if (bottomOffset > liHeight * 6) {

                        dropdown.height('auto').css({
                            bottom: 'auto',
                            top: position
                        });
                        if (dropdown.outerHeight() > bottomOffset - 20) {
                            dropdown.height(Math.floor((bottomOffset - 20) / liHeight) * liHeight);
                        }
                    }
                    $('span.spacedSelect').css({
                        zIndex: 1
                    }).removeClass('focused');
                    selectbox.css({
                        zIndex: 2
                    });
                    if (dropdown.is(':hidden')) {
                        $('div.dropdown:visible').hide();
                        dropdown.show();
                    } else {
                        dropdown.hide();
                    }
                    return false;
                });
                /* при наведении курсора на пункт списка */
                li.off('mouseenter').on('mouseenter', function() {
                    $(this).siblings().removeClass('selected');
                });

                // Выполняем фунцию при наведении (hover событие), не выполняем если это группа элементов
                if (o && o.hover) {
                    $dd_list.on('mouseenter.spacedSelect mouseleave.spacedSelect', 'li:not([data-group])', o.hover);
                }

                var selectedText = li.filter('.selected').text();
                if (li.filter('.selected').is('[data-title]')) {
                    selectedText = li.filter('.selected').attr('data-title');
                }
                /* при клике на пункт списка */
                li.filter(':not(.disabled,[data-group])').click(function() {
                    var li_value = $(this).attr('data-value');
                    select.val(li_value);
                    var option = select.find('option[value="' + li_value + '"]'); //.prop('selected',true);
                    var liText = $(this).text();
                    if (option.is('[data-title]')) {
                        liText = option.attr('data-title');
                    }

                    if (selectedText != liText) {
                        $(this).closest('.dropdown').find('li').removeClass('selected sel');
                        $(this).addClass('selected sel');

                        //select.find('option[selected]').removeProp('selected');
                        //select.find('option[value="'+li_value+'"]').prop('selected',true);
                        selectedText = liText;
                        divText.text(liText);
                        select.change();
                    }
                    dropdown.hide();
                });
                dropdown.mouseout(function() {
                    dropdown.find('li.sel').addClass('selected');
                });
                /* фокус на селекте */
                select.focus(function() {
                        $('span.spacedSelect').removeClass('focused');
                        selectbox.addClass('focused');
                    })
                    /* меняем селект с клавиатуры */
                    .keyup(function() {
                        divText.text($option_list.filter(':selected').text());
                        li.removeClass('selected sel').eq($option_list.filter(':selected').index()).addClass('selected sel');
                    });
                /* прячем выпадающий список при клике за пределами селекта */
                $(document).on('click', function(e) {
                    if (!$(e.target).parents().hasClass('spacedSelect')) {
                        dropdown.hide().find('li.sel').addClass('selected');
                        selectbox.removeClass('focused');
                    }
                });
            }
            create_select();
            // обновление при динамическом изменении
            select.on('refresh', function() {
                select.prev().remove();
                create_select();
            });
        });
    };
})(jQuery);
