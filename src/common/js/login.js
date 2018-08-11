/**
 * Created by pengt on 2017/10/12.
 */
$(function() {

    var TOKEN_KEY = "jwtTokenForVueRequire"

    var setJwtToken = function(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    var removeJwtToken = function() {
        localStorage.removeItem(TOKEN_KEY);
    }

    $('.btn')[0].addEventListener('click', function() {
        if(!$('#email').val()) {
            $('.alert-danger').css('display','block');
            $('.alert-danger').html("请输入用户名");
            return false;
        }

        if(!$('#password').val()) {
            $('.alert-danger').css('display','block');
            $('.alert-danger').html("请输入用密码");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/auth",
            data: JSON.stringify({
                userName: $('#email').val(),
                password: $('#password').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (!_.startsWith(result.code,'20')) {
                    console.log(JSON.stringify(result));
                    var errMsg = result.message;
                    $('.alert-danger').css('display','block');
                    $('.alert-danger').html(errMsg);
                    return false;
                } else {

                    if (result.content && result.content.token) {
                        setJwtToken(result.content.token);
                        location.href = './index_a.html';
                    } else {

                    }
                }
            },
            error: function (error) {
                alert(console.log(error));
            }
        });
    });

});
