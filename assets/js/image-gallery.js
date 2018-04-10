(function () {

    $('.c-gallery-item', 'body').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var el = $(this);
        el.parent().find('.c-gallery-item').removeClass('active');
        var item = { href: el.attr('href'), title: el.attr('title') };
        var main = el.parent().parent().find('.c-gallery-main');
        var mainA = main.find('.c-gallery-main-item');
        mainA.css('background-image', "url('" + item.href + "')");
        mainA.attr('title', item.title);
        el.addClass('active');
        return false;
    });
    $('.c-gallery-main-item', 'body').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var el = $(this);

        var items = [];
        el.parent().parent().find('.c-gallery-item')
            .each(function () { items.push({ src: $(this).attr('href') }) });

        console.log('items', items);

        $.fancybox.open(items);

        return false;
    });

})();