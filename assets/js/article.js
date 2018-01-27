(function () {
    jqLoader.push(['ready', function () {
        // show subscribe us
        $('.c-share_us').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var el = $(this);
            el.toggleClass('active');
            $('.article_subscribe').toggleClass('d-none');
        });

        $('.c-share_fb').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            Share.fb({});
        });
        $('.c-share_twitter').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            Share.tw({});
        });

        var Share = {
            vk: function (data) {
                data = this.getData(data);
                url = 'https://vk.com/share.php?';
                url += 'url=' + encodeURIComponent(data.url);
                url += '&title=' + encodeURIComponent(data.title);
                url += '&description=' + encodeURIComponent(data.description);
                url += '&image=' + encodeURIComponent(data.image);
                url += '&noparse=true';
                this.popup(url);
            },
            od: function (data) {
                data = this.getData(data);
                url = 'https://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
                url += '&st.comments=' + encodeURIComponent(data.description);
                url += '&st._surl=' + encodeURIComponent(data.url);
                this.popup(url);
            },
            pin: function (data) {
                data = this.getData(data);
                url = 'https://www.pinterest.com/pin/create/button/';
                url += '?url=' + encodeURIComponent(data.url);
                url += '&media=' + encodeURIComponent(data.image);
                url += '&description=' + encodeURIComponent(data.title);
                this.popup(url);
            },
            fb: function (data) {
                data = this.getData(data);
                if ($('body').hasClass('mobile')) {
                    FB.ui({
                        method: 'share',
                        href: data.url
                    }, function (response) { });
                } else {
                    url = 'https://www.facebook.com/sharer/sharer.php?s=100';
                    url += '&p[title]=' + encodeURIComponent(data.title);
                    url += '&p[summary]=' + encodeURIComponent(data.description);
                    url += '&p[url]=' + encodeURIComponent(data.url);
                    url += '&p[images][0]=' + encodeURIComponent(data.image);
                    this.popup(url);
                }
            },
            tw: function (data) {
                data = this.getData(data);
                url = 'https://twitter.com/share?';
                url += 'text=' + encodeURIComponent(data.twitterTitle ? data.twitterTitle : data.title);
                url += '&url=' + encodeURIComponent(data.url);
                // url += '&via=' + AdMeCommon.Config.get('twitterAccount');
                url += '&counturl=' + encodeURIComponent(data.url);
                this.popup(url);
            },
            ml: function (data) {
                data = this.getData(data);
                url = 'https://connect.mail.ru/share?';
                url += 'url=' + encodeURIComponent(data.url);
                url += '&title=' + encodeURIComponent(data.title);
                url += '&description=' + encodeURIComponent(data.description);
                url += '&imageurl=' + encodeURIComponent(data.image);
                this.popup(url);
            },
            gl: function (data) {
                data = this.getData(data);
                url = 'https://plus.google.com/share';
                url += '?url=' + encodeURIComponent(data.url);
                this.popup(url);
            },

            getData: function (data) {
                return $.extend({
                    url: $('link[rel="canonical"]').attr('href') || location.href,
                    title: $('meta[property="og:title"]').attr('content') || document.title || '',
                    image: $('meta[property="og:image"]').attr('content') || '',
                    description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
                }, data);
            },
            popup: function (url) {
                window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
            }
        };

    }]);
})();
