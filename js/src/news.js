/**
 * Created by dkh on 30.04.17.
 */

var News = function (lang) {
    this.options = {
        rss_url: (lang=='en')?'http://investing.com/rss/news_1.rss':'http://'+lang+'.investing.com/rss/forex_Opinion.rss',
        news_update_time: '300',
    };
    this.itemTpl = $('#template-news-item').html();
    this.renewInterval = null;
    var that = this; //piece of JS shit!
    this.container = null;

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


    /***
     * Get news Data
     * @param url
     */
    this.getNews = function (url) {
        $.ajax({
            dataType: 'json',
            type:'GET',
            url: "https://api.rss2json.com/v1/api.json",
            data: {rss_url: url},
            success: function (data) {
                // data = that.xml2json(data);
                if (data.hasOwnProperty('items')) {
                    that.container.html('');
                    $.each(data.items, function (i, item) {
                        var newsItem = Mustache.render(that.itemTpl, item);
                        that.container.append(newsItem);
                    });
                }
            }
        });

    };

    /***
     * Start main news instance
     */
    this.startNewsRoll = function () {
        this.container = this.getElement(null, 'news', 'container');
        setTimeout(function () {
            that.getNews(that.options.rss_url);
        }, 1000);
        this.renewInterval = setInterval(function () {
            that.getNews(that.options.rss_url);
        }, this.options['news_update_time'] * 1000);
    };
    this.startNewsRoll();
};
