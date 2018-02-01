(function () {
    function initSetProductSelectedImage() {
        $('.sp-media_image').on('click', function () {
            var el = $(this);
            el.parent().find('.sp-media_image').removeClass('selected');
            var img = el.parent().parent().find('.sp-media_main-pic');
            var url = el.data('url');
            img.attr('src', url);
            el.addClass('selected');
        });
    }

    initSetProductSelectedImage();
})();
