(function () {
    $(document).ready(function () {
        $('.js-sp-form').on('click', '.js-sp-add', function () {
            var addBtn = $(this);
            addBtn.prop('disabled', true);
            var form = addBtn.closest('.js-sp-form');
            var params = form.find('input.js-sp-param');
            var query = {};
            params.each(function () {
                var el = $(this);
                if (el.attr('type') === 'radio') {
                    if (el.prop('checked')) {
                        query[el.attr('name')] = el.val();
                    }
                } else {
                    query[el.attr('name')] = el.val();
                }
            });

            var qs = [];

            for (var prop in query) {
                qs.push(prop + '=' + encodeURIComponent(query[prop]));
            }


            fetch('/actions/cart/add?' + qs.join('&'), { method: 'POST', credentials: 'same-origin' })
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    if (result.errors) {
                        var message = result.errors[0];
                        var alertEl = form.find('.js-sp-alert');
                        alertEl.html(message);
                        alertEl.removeClass('d-none');
                    } else {
                        form.find('.js-sp-purchase').removeClass('d-none');
                        $('.js-cart-quantity').html(result.data.quantity);
                    }
                })
                .catch(function (error) {
                    console.log("error", error);
                })
                .then(function () {
                    addBtn.prop('disabled', false);
                });
        });
    });
})();