function UTCgetHMS(uts) {
    var date = new Date(parseInt(uts));
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    minutes = minutes <= 9 ? "0" + minutes : minutes;
    seconds = seconds <= 9 ? "0" + seconds : seconds;
    return {hours: hours, minutes: minutes, seconds: seconds}
}

String.prototype.replaceAll = function (search, replace) {
    return this.split(search).join(replace);
};

function indexOf(obj, elem) {
    try {
        for (var i in obj) {
            if (obj[i] == elem) {
                return i;
            }
        }
    } catch (e) {
    }
    return -1;
}

function Js(a) {
    return JSON.stringify(a);
}

function Jp(a) {
    return JSON.parse(a);
}

function Jps(a) {
    return JSON.parse(JSON.stringify(a));
}

var wipe = function (obj) {
    if (typeof (obj) != "undefined") {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                try {
                    delete obj[p];
                } catch (e) {
                } //for strict
                //obj[p]=null;
            }
        }
    }
};


String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

String.prototype.toDDHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var days = Math.floor(sec_num / (3600 * 24));
    sec_num = sec_num - (days * 3600 * 24);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (days < 10) {
        days = "0" + days;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = days + ':' + hours + ':' + minutes + ':' + seconds;
    return time;
}

function UTS2TimeHM(uts) {

    var date = new Date(parseInt(uts));

    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    minutes = minutes <= 9 ? "0" + minutes : minutes;
    seconds = seconds <= 9 ? "0" + seconds : seconds;

    wipe(date);

    date = null;

    return hours + ':' + minutes;
}

function toDDHHMMSS(miliseconds) {
    seconds = miliseconds / 1000;

    var sec_num = parseInt(seconds);

    var days = Math.floor(sec_num / (3600 * 24));
    sec_num -= days * 3600 * 24;
    var hours = Math.floor(sec_num / 3600);
    sec_num -= hours * 3600;
    var minutes = Math.floor(sec_num / 60);
    sec_num -= minutes * 60;
    var seconds = sec_num;

    if (days < 10) {
        days = "0" + days;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var d = ":";
    var h = ":";
    var min = ":";
    var sec = "";

    //if (days > 0) {
    var time = days + d + hours + h + minutes + min + seconds + sec;
    /*} else {
     if (hours > 0) {
     var time = hours + h + minutes + min + seconds + sec;
     } else {
     if (minutes > 0) {
     var time = minutes + min + seconds + sec;
     } else {
     var time = "00:" + seconds + sec;
     }
     }
     }*/
    return time;
}

function toDDHHMMSS2(miliseconds) {
    seconds = miliseconds / 1000;

    var sec_num = parseInt(seconds);

    var days = Math.floor(sec_num / (3600 * 24));
    sec_num -= days * 3600 * 24;
    var hours = Math.floor(sec_num / 3600);
    sec_num -= hours * 3600;
    var minutes = Math.floor(sec_num / 60);
    sec_num -= minutes * 60;
    var seconds = sec_num;

    if (days < 10) {
        days = "0" + days;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var h = ":",
        min = ":",
        sec = "";

    if (days > 0) {
        var dayMessage = view.messages.find(".days");
        if (dayMessage[0] != null && dayMessage != "") {
            var d = " " + dayMessage.text() + " ";
        } else {
            var d = ":";
        }

        var time = days + d + hours + h + minutes + min + seconds + sec;
    } else {
        if (hours > 0) {
            var time = hours + h + minutes + min + seconds + sec;
        } else {
            if (minutes > 0) {
                var time = minutes + min + seconds + sec;
            } else {
                var time = seconds + sec;
            }
        }
    }

    d = null;
    h = null;
    min = null;
    sec = null;

    return time;
}

function toDDHHMMSSD(miliseconds) {
    seconds = miliseconds / 1000;

    var sec_num = parseInt(seconds);

    var days = Math.floor(sec_num / (3600 * 24));
    sec_num -= days * 3600 * 24;
    var hours = Math.floor(sec_num / 3600);
    sec_num -= hours * 3600;
    var minutes = Math.floor(sec_num / 60);
    sec_num -= minutes * 60;
    var seconds = sec_num;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var h = ":";
    var min = ":";
    var sec = "";

    if (days > 0) {
        var time = days + " d " + hours + h + minutes + min + seconds + sec;
    } else {
        var time = hours + h + minutes + min + seconds + sec;
    }

    return time;
}

function UTS2DateAndTime(uts) {

    var date = new Date(uts);
    var year = date.getUTCFullYear();

    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1;
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    wipe(date);
    date = null;
    return day + '.' + month + '.' + year + " " + hours + ':' + minutes + ':' + seconds;
}

function toHHMMSS(miliseconds) {
    seconds = miliseconds / 1000;
    var sec_num = parseInt(seconds, 10);

    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

function log(a) {

}

function microtime(get_as_float) {
    var now = new Date().getTime() / 1000, s = parseInt(now, 10);
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function rand(min, max) {
    if (min >= max) {
        return min;
    } else {
        return (Math.random() * (max - min) + min).toFixed();
    }
}

function filterNaN(str) {
    if (str == "NaN" || isNaN(str)) {
        return "-";
    } else {
        return str;
    }
}

function animateNumberFromXtoY(params) {
    var elem = params.elem,
        start = params.start || parseFloat($(elem).val().replace("$", "")),
        finish = params.finish,
        time = params.time || 500;

    $(elem).stop();
    var start = start || $(elem).val();
    $(elem).prop('number', start).animateNumber(
        {
            number: finish,
            numberStep: function (now, tween) {
                var target = $(tween.elem);
                target.prop('number', now).val("$" + now.toFixed(2));
            }
        }, time);
};

function intellectRound(number, money) {
    if (typeof(number) == "undefined") {
        return 0;
    }
    var number = parseFloat(parseFloat(number.toString()).toFixed(2));
    var money = money || false;
    if (number % 1 != 0 || money) {
        return number.formatMoney(globalParameters.decimalCount, globalParameters.decimalSeparator, globalParameters.thousandsSeparator);
    } else {
        return number.formatMoney(0, globalParameters.decimalSeparator, globalParameters.thousandsSeparator);
    }
}

function hideLoading() {
    $("#loading").hide();
}

$.fn.setImageFromBase64 = function (url) {
    this.css({"background-image": "url('data:image/png;base64," + url.replace(/(\r\n|\n|\r)/gm, "") + "')"});
};


Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


function nodeBySelector(sel) {
    return common.elemsCache[sel] ? common.elemsCache[sel] : common.elemsCache[sel] = $(sel);
}

function isLocalstorageAvailable() {
    try {
        localStorage.setItem("t", 1);
        localStorage.getItem("t");
        localStorage.removeItem("t");
        return true;
    } catch (e) {
        return false;
    }
}

setBonus = function (v) {
    if (typeof(v) == "undefined" || parseFloat(v) < 0) {
        v = 0;
    }


    if ($(".al_bonus_block")[0] != null) {
        $(".al_bonus_block").each(function (key, elem) {
            if (v > 0) {
                $(elem).hide();
            } else {
                $(elem).hide();
            }
        });
    }

    if ($(".user-bonus-value")[0] != null) {
        $(".user-bonus-value").each(function (key, elem) {
            $(elem).text(intellectRound(v));
        });
    }
};


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}


var ieVersion = (function () {

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );

    return v > 4 ? v : undef;

}());

function in_array(needle, haystack, strict) {

    var key, strict = !!strict;

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            return true;
        }
    }

    return false;
}

var fixDropdownHeight = function () {
    var itemsToShow;
    $('#bsw').find('.dropdown').each(function () {
        var dropdown = $(this).find('.container');
        var item = dropdown.find('.option:visible');
        var itemsLength = item.length;
        var itemHeight = item.innerHeight();

        if (dropdown.parents().hasClass('chooseBet')) {
            itemsToShow = 3;
        } else {
            itemsToShow = 6;
        }

        item.filter(':last').css({
            borderBottom: 0
        });

        if (itemsLength > itemsToShow) {
            dropdown
                .height(itemsToShow * itemHeight + itemsToShow - 1);
        } else {
            dropdown
                .height(itemsLength * itemHeight + itemsLength - 1);
        }
    })
};

var checkExpandedDeals = function () {
    var deal = $('.openDeals').find('.deal');
    var dealsMin = deal.not('.open').length;
    var dealsMax = deal.filter('.open').length;
    var dealsExpander = $('.summary').find('.expander');

    if (dealsMax >= dealsMin) {
        dealsExpander.addClass('open');
    } else {
        dealsExpander.removeClass('open');
    }
};

$(function () {


    $('.scroll').slimScroll({
        width: '100%',
        height: '100%',
        size: '4px',
        position: 'right',
        color: '#000',
        opacity: 0.2,
        railColor: '#233847',
        railOpacity: 0.2,
        alwaysVisible: false,
        distance: '0px',
        start: 'top',
        railVisible: false,
        wheelStep: 10,
        allowPageScroll: false,
        disableFadeOut: false
    });

    $('#bsw')

    //	filter switch
        .on('click', '.filter .filter_item', function () {
            var item = $(this);

            if (item.hasClass('active')) {
                return false;
            } else {
                item.addClass('active').siblings(item.selector).removeClass('active');
                /* YOUR CODE HERE */
            }
        })

        //	toggle active
        .on('click', '.toggleActive', function () {
            $(this).toggleClass('active');
        })

        //	dropdown
        .on('mouseenter', '.value', function () {
            $(this).find('.dropdown').addClass('show');
        })
        .on('mouseleave', '.value', function () {
            $(this).find('.dropdown').removeClass('show');
        })
        .on('click', '.value', function (e) {
            var dropdown = $(this).find('.dropdown');

            if (dropdown.hasClass('show') && !$(e.target).hasClass('noCloseDropdown')) {
                dropdown.removeClass('show');
            } else {
                dropdown.addClass('show');
            }
        })

        //	dropdown select
        .on('click', '.option', function () {
            var option = $(this);

            if (option.hasClass('active')) {
                return false;
            } else {
                var newVal = option.find('.val').text();

                if ($(this).parents('.chooseBet').length != 1) {
                    option.addClass('active').siblings().removeClass('active');
                }
                if (option.parents('.value').find('.input .field').length) {


                } else {
                    option.parents('.value').find('.input input').val(newVal);
                }


            }
            option.parents('.value').find('.input input').trigger('keyup');
        })

        //	dropdown select
        .on('click', '.option .favorite', function () {
            $(this).parents('.option').toggleClass('inFavorites');
            return false;
        })

        //	deals expand
        .on('click', '.deal .expander', function () {
            $(this).parents('.deal').toggleClass('open');
            checkExpandedDeals();
        })
        .on('click', '.summary .expander', function () {
            var openDeal = $('.openDeals').find('.deal');

            if ($(this).hasClass('open')) {
                openDeal.removeClass('open');
            } else {
                openDeal.addClass('open');
            }
            checkExpandedDeals();
        });

//User menue
    $('#user_menu .item.profile').on('click', function (e) {
        window.location.replace("https://izoption.com/account");
    });
    $('#user_menu .item.add_funds').on('click', function (e) {
        window.location.replace("https://izoption.com/deposit");
    });
    $('#user_menu .item.get_funds').on('click', function (e) {
        window.location.replace("https://izoption.com/withdrawl");
    });
    $('#user_menu .item.help').on('click', function (e) {
        window.location.replace("https://izoption.com/help");
    });
    $('#user_menu .item.support').on('click', function (e) {
        window.location.replace("https://izoption.com/support");
    });
    $('#user_menu .item.logout').on('click', function (e) {
        window.location.replace("https://izoption.com/logout");
    });
});

// Platform switch
$(function () {
    var at_sw = $('#user_menu .item.account_type_switch');
    var url;
    $('#platform_type').addClass(window.platform_type + '_account_label');
    if(window.platform_type=='real'){
        at_sw.find('span').addClass('demo_account_label');
        var url = window.location.href.split("#")[0] + '#demo';
    }else if(window.platform_type=='demo'){
        at_sw.find('span').addClass('real_account_label');
        var url = window.location.href.split("#")[0] + '#real';
    }
    at_sw.on('click', function (e) {
        window.location.replace(url);
        window.location.reload(true);
    });
});