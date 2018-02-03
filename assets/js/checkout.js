(function () {
    $(document).ready(function () {
        $('#person-1,#person-2').on('change', function () {
            var radio = $(this);
            var personType = $('#person-1:checked,#person-2:checked', '#checkout-form').val();
            $('.form-group', '#checkout-form').each(function () {
                var el = $(this);
                if (el.data('person')) {
                    if (personType == el.data('person')) {
                        el.removeClass('d-none');
                    } else {
                        el.addClass('d-none');
                    }
                }
            });
        });
    });
})();