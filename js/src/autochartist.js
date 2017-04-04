/**
 * Created by dkh on 17.03.17.
 */
var Autochartist = function (options) {


    this.instruments = {
        'EURUSD': 1,
        'GBPUSD': 2
    };
    this.history = {};
    this.brokerId = options['brokerId'];
    this.user = options['user'];
    this.loginToken = options['loginToken'];
    this.requestUrl = options['url'];
    this.updateTime = options['updateTime'];
    this.graphicsUrl = options['graphicsUrl'];
    this.timersInterval = null;
    this.tools = options['tools'];
    this.signals = {};
    this.options = options; //other options
    this.renewInterval = null;
    this.timeZone = (parseInt(new Date().getTimezoneOffset()) / 60) * -1;
    this.timeZone = this.timeZone > 0 ? this.timeZone = "%2B" + this.timeZone : "-" + this.timeZone;
    var that = this;


    /***
     * Get element from DOM
     * @param widget - console(console-{id}) or main template (null)
     * @param name - dom class
     * @param type - container|control
     * @returns {*|jQuery|HTMLElement}
     */
    this.getElement = function (widget, name, type) {
        widget = widget != null ? "." + widget : "";
        var element = widget + " ." + name + "-" + type;
        return $(element);
    };
    this.container = this.getElement(null, 'autochartist', 'container');
    this.container.delegate('.signal_container', 'click', function () {
        $(this).find('.signal_chart').toggleClass('hidden');
    });
    this.itemTpl = $('#autochartist-item').html();
    /***
     * Get data url
     * @returns {*}
     */
    this.getRequestUrl = function () {
        var url = this.requestUrl;
        url += "?b=" + this.brokerId;
        url += '&u=' + this.user;
        url += '&logintoken=' + this.loginToken;
        url += '&symbol=' + this.tools.join(',');
        var browserTz = new Date().getTimezoneOffset();
        url += '&tz=GMT' + (browserTz > 0 ? "-" : "%2B") + (Math.abs(browserTz) / 60);
        return url;
    };

    /***
     * Get news Data
     * @param url
     */
    this.getCharts = function () {

        $.ajax({
            dataType: 'jsonp',
            url: this.getRequestUrl(),
            success: function (data) {
                that.loadSignals(data);
            }
        });
    };

    this.loadSignals = function (data) {
        var date = new Date();
        this.container.html('');
        for (var key in data.items) {
            var item = data.items[key];
            // that.loadSignal(key, item);
            item.eta = date.getTime() + item.interval * 60 * 1000;
            item.graphics_url = this.graphicsUrl;
            item.login_token = this.loginToken;

            this.signals[item.symbolDisplayName + "_" + item.interval] = item;

            this.renderItem(item);
        }

        $('#signals_choise .scroll').addClass('on_btm');
        $('#signals_choise .scroll').addClass('shaded');
        l100n.localize_page("binary",language);
    };

    this.renderItem = function (item) {
        var time = new Date();
        item.direction = item.direction == '1' ? 'call' : 'put';
        var ttl = Math.floor((item.eta - time.getTime()) / 1000);
        var ttlObj = this.humanFormatTime(ttl);
        item.ttl_value = ttlObj.value;
        item.ttl_units =  ttlObj.units;
        var decimals = (item.forecast + "").split('.');
        if (typeof (decimals[1]) != "undefined") {
            if (decimals[1].length > 5) {
                item.forecast = item.forecast.toFixed(5);
            }
        }
        item.time_zone = this.timeZone;
        var autochartistItem = Mustache.render(this.itemTpl, item);
        this.container.append(autochartistItem);
    };

    this.updateTimers = function () {
        var time = new Date();
        for (var itemId in this.signals) {
            var item = this.signals[itemId];
            var ttl = Math.floor((item.eta - time.getTime()) / 1000);
            var ttlObj = this.humanFormatTime(ttl);
            if (ttl < 1) {
                this.getElement(null, 'signal_' + itemId, 'container').remove();
                continue;
            }
            var itemEl = this.getElement(null, 'signal_' + itemId, 'container');
            itemEl.find('#signal_ttl_value').html(ttlObj.value);
            itemEl.find('#signal_ttl_units').attr('class',ttlObj.units);
            l100n.localize_page("binary",language);
        }

    };

    /***
     * Start main news instance on trade start
     */
    this.start = function () {
        setTimeout(function () {
            that.getCharts();
        }, 1000);
        if(typeof that.timersInterval == 'udefined') {
            that.timersInterval = setInterval(function () {
                that.updateTimers();
            }, 1000);
        }
        if(typeof that.renewIntervall == 'udefined') {
            that.renewInterval = setInterval(function () {
                that.getCharts();
            }, 2 * 60 * 1000);
        }
    };

    this.stop = function () {
        clearInterval(that.renewInterval);
        clearInterval(that.timersInterval);
    };

    this.humanFormatTime = function (time) {
        var resultTime = 0;
        var units = 'seconds-title';
        if (time > 90) {
            var minutesTotal = Math.floor(time / 60);

            var hours = Math.floor(minutesTotal / 60);
            var days = Math.floor(hours / 24);

            resultTime = minutesTotal;
            units = 'minute-title';

            if (minutesTotal > 99) {
                resultTime = hours;
                units = 'hours-title';
            }
            if (days > 2) {
                resultTime = days;
                units = 'days-title';
            }

        } else {
            resultTime = time;

        }
        return {
            value: resultTime,
            units: units
        };
    };


};
