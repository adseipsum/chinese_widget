// simpleTip

(function ($) {

    $.fn.simpleTip = function (options) {
        var defaults = {
            window_padding: 5,
            maxWidth: 200,
            ease: 300,
            margin: 20,
            padding: '10px 15px',
            radius: '4px',
            bg: '#fffee8',
            color: '#333',
            font: '13px',
            border: '1px solid #c0c0c0',
            start_scale: 1,
            opacity: .95
        }
        var options = $.extend(defaults, options);
        var tip;
        var timeout;

        function createTip(e) {
            $('body').append('<div class="masterTip"><span></span></div>');

            $('.masterTip:last').css({
                left: e.clientX,
                top: e.clientY,
                'max-width': options.maxWidth,
                position: 'fixed',
                display: 'table',
                'z-index': 999999,
                'pointer-events': 'none',
                '-webkit-transition': 'opacity ' + options.ease + 'ms ease, visibility ' + options.ease + 'ms ease, transform ' + options.ease + 'ms ease',
                '-moz-transition': 'opacity ' + options.ease + 'ms ease, visibility ' + options.ease + 'ms ease, transform ' + options.ease + 'ms ease',
                '-ms-transition': 'opacity ' + options.ease + 'ms ease, visibility ' + options.ease + 'ms ease, transform ' + options.ease + 'ms ease',
                '-o-transition': 'opacity ' + options.ease + 'ms ease, visibility ' + options.ease + 'ms ease, transform ' + options.ease + 'ms ease',
                'transition': 'opacity ' + options.ease + 'ms ease, visibility ' + options.ease + 'ms ease, transform ' + options.ease + 'ms ease',
                opacity: 0,
                visibility: 'hidden',
                '-webkit-transform': 'scale(' + options.start_scale + ')',
                '-moz-transform': 'scale(' + options.start_scale + ')',
                '-ms-transform': 'scale(' + options.start_scale + ')',
                '-o-transform': 'scale(' + options.start_scale + ')',
                'transform': 'scale(' + options.start_scale + ')'
            }).siblings('.masterTip').remove();

            $('.masterTip:last')
                .find('span')
                .css({
                    fontFamily: 'Arial',
                    display: 'table-cell',
                    background: options.bg,
                    color: options.color,
                    border: options.border,
                    'box-shadow': '0 2px 5px rgba(0,0,0,.3)',
                    'border-radius': options.radius,
                    width: '100%',
                    padding: options.padding,
                    'font-size': options.font,
                    'line-height': '1.4',
                    opacity: options.opacity
                });

            tip = $('.masterTip');
            tip_c = $('.masterTip span');
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                $('.masterTip:last')
                    .css({
                        opacity: 1,
                        visibility: 'visible',
                        '-webkit-transform': 'scale(1)',
                        '-moz-transform': 'scale(1)',
                        '-ms-transform': 'scale(1)',
                        '-o-transform': 'scale(1)',
                        'transform': 'scale(1)'
                    });
            }, 5);
        }

        function removeTip() {
            if (typeof(tip) == 'undefined') {
                return;
            }
            tip.css({
                opacity: 0,
                visibility: 'hidden',
                '-webkit-transform': 'scale(' + options.start_scale + ')',
                '-moz-transform': 'scale(' + options.start_scale + ')',
                '-ms-transform': 'scale(' + options.start_scale + ')',
                '-o-transform': 'scale(' + options.start_scale + ')',
                'transform': 'scale(' + options.start_scale + ')'
            });
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                tip.remove();
            }, options.ease);
        };

        return this.each(function () {
            var elem = $(this);
            var tip_txt;

            function moveTip(e) {
                if (typeof(tip) == 'undefined') {
                    return;
                }
                var tip_w = tip.innerWidth();
                var tip_h = tip.innerHeight();

                if (e.clientX - tip_w - options.window_padding <= 0) {
                    tip.css({left: e.clientX + options.margin});
                } else {
                    tip.css({left: e.clientX - tip_w - options.margin});
                }
                if (e.clientY - tip_h - options.window_padding <= 0) {
                    tip.css({top: e.clientY + options.margin});
                } else {
                    tip.css({top: e.clientY - tip_h - options.margin});
                }

            }

            elem
                .on('mouseenter', function (e) {
                    createTip(e);
                    tip_txt = elem.find(".data-title").text().trim();

                    tip.find('span').html(tip_txt).find('img').css({width: '100%'});
                    if (tip.find('span').is(':empty')) {
                        removeTip();
                    } else {
                        moveTip(e);
                    }
                })
                .on('click', function (e) {

                    //tip_txt = elem.find(".data-title").text().trim();
                    //tip.find('span').html(tip_txt).find('img').css({width: '100%'});
                    removeTip();

                })
                .mousemove(function (e) {
                    moveTip(e);
                })
                .mouseleave(function (e) {
                    removeTip();
                })

        });


    }

})(jQuery);
