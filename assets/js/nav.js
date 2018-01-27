(function () {
    jqLoader.push(['ready', function () {
        $('.nav-trigger').on('click', function () {
            var el = $(this);
            el.toggleClass('active');
            $('#page-menu').toggleClass('d-block');
        });
    }]);
})();
