'use strict';

(function () {
    var forms = document.querySelectorAll('.form-email .js-form2');

    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function (e) {
            e.preventDefault();

            var form = this;
            var actionUrl = form.dataset.actionAjax;
            var email = form.querySelector('input.email').value;
            var postData = {
                email: email
            };

            var xhr = new XMLHttpRequest();
            xhr.open('POST', actionUrl, true);
            xhr.responseType = 'json';

            xhr.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // TODO: check {"success":true}
                    // var data = JSON.parse(request.responseText);

                    form.classList.add('inactive');
                    form.closest('.form-email').querySelector('.notification.ok').classList.add('active');
                } else {
                    form.classList.add('inactive');
                    form.closest('.form-email').querySelector('.notification.error').classList.add('active');
                }
            };

            xhr.onerror = function() {
                form.classList.add('inactive');
                form.closest('.form-email').querySelector('.notification.error').classList.add('active');
            };


            xhr.send(postData);

            alert(email);
        });
    }
})();
