(function (root) {

    // var initDefaultProductPhotoSwipe = function (element) {
    //     $(element).find('.js-pswp-item').each(function () {
    //         var el = $(this);
    //         if (!el.data('pswp-inited')) {
    //             el.data('pswp-inited', true);
    //             el.on('click', function () { root.openProductPhotoSwipe(element) });
    //         }
    //     });
    // }

    root.openProductPhotoSwipe = function (selector) {
        var pswpElement = document.querySelectorAll('.pswp')[0];
        var element = selector;
        if (typeof selector === 'string') {
            element = $(selector)[0];
        }

        console.log(selector, element)

        var items = [];
        var ids = {};
        $(element).find('.js-pswp-item').each(function () {
            var el = $(this);
            if (!el.data('pswp-inited')) {
                el.data('pswp-inited', true);
                el.on('click', function () { root.openProductPhotoSwipe(selector) });
            }
            var imageInfo = el.data('image');
            if (!imageInfo) {
                return;
            }
            if (!ids[imageInfo.id]) {
                ids[imageInfo.id] = true;
                items.push({
                    src: imageInfo.url,
                    w: imageInfo.width,
                    h: imageInfo.height,
                });
            }

        });

        var gallery = new PhotoSwipe(pswpElement, false, items, { modal: true });
        gallery.init();
    }

    // var defRoots = document.querySelectorAll('.js-def-pswp');
    // for (var i = 0; i < defRoots.length; i++) {
    //     initDefaultProductPhotoSwipe(defRoots[i]);
    // }

    function initSetProductSelectedImage() {
        $('.js-pswp-item').on('click', function () {
            var el = $(this);
            el.parent().find('.js-pswp-item').removeClass('selected');
            var img = el.parent().parent().find('.js-pswp-big-item img');
            var image = el.data('image');
            img.attr('src', image.url);
            el.addClass('selected');
        });
    }

    initSetProductSelectedImage();
})(window);
