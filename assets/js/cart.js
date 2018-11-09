(function () {
    $(document).ready(function () {

        function setPriceValue(value) {
            var el = $('.js-sp-form .js-sp-price');
            value = value || el.data('value');

            el.text(value);
        }
        function setPriceTva(value) {
            var el = $('.js-sp-form .js-sp-tva');
            value = value || el.data('value');

            el.text(value);
        }

        function selectProductVariant(el) {
            var varEl = $(el);
            if (varEl.prop('disabled')) {
                console.log('not in stock');
                return;
            }

            var price = varEl.data('price');
            var tva = varEl.data('tva');

            if (!price) {
                console.log('variant without price, set default value');
                setPriceValue();
                setPriceTva();
                return;
            }
            setPriceValue(price);
            setPriceTva(tva);

        }

        $('.js-sp-form').on('click', '.js-sp-variant', function () {
            selectProductVariant(this);
        });

        var checkedVariant = $('.js-sp-form .js-sp-variant:checked')[0];
        if (checkedVariant) {
            selectProductVariant(checkedVariant);
        }


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