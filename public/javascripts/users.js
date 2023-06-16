$(document).ready(function(){

    $('#create_user').click(function(e){
        $('#create_user_popup').show()
    })

    $('#create_user_popup_close').click(function(e){
        $('#create_user_popup').hide()
    })

    $('#cancel_create_user').click(function(e){
        $('#create_user_popup').hide()
    })

    $('#submit_create_user').click(function(e){
        e.preventDefault()
        let data = {
            fio: $('#inpFio').val(),
            login: $('#inpLogin').val(),
            password: $('#inpPass').val(),
            id_role: $('#inpRole').val(),
        }

        $.ajax({
            type: 'POST',
            data: data,
            url: '/users/add',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.msg === '') {
                alert('Пользователь добавлен')
                window.location.reload()
            }
            else {
                alert(response.msg)
            }
        });
    })

});

