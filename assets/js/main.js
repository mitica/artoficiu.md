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

        $('.sp-media_main-image').on('click', function(){
            event.preventDefault();
            event.stopPropagation();
    
            var el = $(this);
    
            var items = [];
            el.parent().find('.sp-media_image')
                .each(function () { items.push({ src: $(this).attr('data-url') }) });
                console.log(items);
    
            $.fancybox.open(items);
    
            return false;
        });
    }

    initSetProductSelectedImage();
})();
