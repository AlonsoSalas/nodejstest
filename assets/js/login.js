(function() {

    const uid = (function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    })();

    const username = $("#username");
    const loginForm = $("#loginForm");

    loginForm.on("submit", function(e) {
        e.preventDefault();

        if (!username.val()) {
            username.addClass('emptyError')
        } else {
            const user = {
                uid : uid,
                username : username.val(),
                connectedTime: new Date()
            }
            // console.log(user);
            sessionStorage.setItem('user', JSON.stringify(user))
            $("#principal").load("/main.html");
        }
    });

    username.on('blur', function() {
        $(this).removeClass('emptyError');
    })
})();
