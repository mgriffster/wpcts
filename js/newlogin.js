
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).addClass('active');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).removeClass('active');
            showPass = 0;
        }
        
    });


})(jQuery);


window.onload = function() {
    document.getElementById("createAccount").onclick = toggleCreate;
    document.getElementById("signin").onclick = toggleSignin;
    document.getElementById("resetpassword").onclick = toggleReset;
    document.getElementById("backtosignin").onclick = toggleSignin;
    document.getElementById("login").onclick = login;
    document.getElementById("create").onclick = create;
    document.getElementById("reset").onclick = reset;
    document.getElementById("password").oninput = hideError;
};

function toggleReset() {
    document.getElementById("register-form").style.display = 'none';
    document.getElementById("login-form").style.display = 'none';
    document.getElementById("reset-form").style.display = 'block';
}

function toggleCreate() {
    document.getElementById("register-form").style.display = 'block';
    document.getElementById("login-form").style.display = 'none';
    document.getElementById("reset-form").style.display = 'none';

}

function toggleSignin() {
    document.getElementById("register-form").style.display = 'none';
    document.getElementById("login-form").style.display = 'block';
    document.getElementById("reset-form").style.display = 'none';

}

function login(event){
    event.preventDefault();
    var name = document.getElementById("username").value;
    var pw = document.getElementById("password").value;
    $.post('/login', { username: name, password : pw}).done(function(data){
        if(data.success !== undefined && !data.success)
        {
            var p = document.getElementById("password");
            p.value = '';
            p.style.color = 'red';
            document.getElementById('wrongEntry').style.display = 'block';
            setTimeout(function(){
                p.style.color = 'black';
            }, 1000);
        }
        else if(data.success !== undefined && data.success == true)
        {
            window.location.href = '/home';
        }
    });
    return false;
}

function create(event){
    event.preventDefault();
    var name = document.getElementById("newusername").value;
    var pw = document.getElementById("newpassword").value;
    var email = document.getElementById("newemail").value;
    if(email.length > 0 && validateEmail(email) === false){
        Swal.fire({
            title: 'Error!',
            text: 'Your e-mail must be valid or empty (You will not be able to reset your password without an e-mail).',
            customClass: 'swal-size',
            icon: 'error',
            confirmButtonText: "I'll fix it"
          });
    }
    else{
        if(email.length === 0){
            Swal.fire({
                title: 'Warning!',
                text: 'Creating an account without an e-mail means that you will not be able to recover a forgotten password! Your e-mail will' +
                ' only be used for this purpose and will never be shared with any third-party.',
                icon: 'warning',
                customClass: 'swal-size',
                showCancelButton: true,
                confirmButtonText: 'Create Without E-mail',
                cancelButtonColor: '#d33'
              }).then((result) => {
                  if(result.value){
                    postToCreateAccount(name, pw, email);   
                  }
              });
        }
        else{
            postToCreateAccount(name, pw, email);
        }
        
    }
    return false;
}

function reset(event){
    event.preventDefault();
    let email = document.getElementById('resetemail').value;
    if(validateEmail(email)){
        $.post('/emailresetrequest', {email:email}).done(function(data){
            console.log(data);
            if(data !== undefined && !data)
            {
                Swal.fire({
                    title: 'Error!',
                    text: 'Your request to reset your password has failed. If you continue to get this error please contact support@wpcts.com',
                    customClass: 'swal-size',
                    icon: 'error',
                    confirmButtonText: 'Cool'
                  });
            }
            else if(data !== undefined && data == true)
            {
                Swal.fire({
                    title: 'Success!',
                    text: 'If an account is attached to this e-mail you will receive an e-mail with further instructions. If you do not receive the e-mail please contact support@wpcts.com',
                    customClass: 'swal-size',
                    icon: 'success',
                    confirmButtonText: 'Cool'
                  });
            }
        });
    }
    else{
        Swal.fire({
            title: 'Error!',
            text: 'You must enter a valid e-mail address, please double check that your e-mail address is correct. If you are adamant that your e-mail is correct please e-mail support@wpcts.com',
            customClass: 'swal-size',
            icon: 'error',
            confirmButtonText: 'Cool'
          });
    }
    
}

function validateEmail(email){      
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email); 
  } 

function hideError()
{
    document.getElementById('wrongEntry').style.display = 'none';
}

function postToCreateAccount(name, pw, email){
    $.post('/create', {username:name, password:pw, email:email}).done(function(data){
        if(data.success !== undefined && !data.success)
        {
            Swal.fire({
                title: 'Error!',
                text: 'Unsuccessful account creation. Username or e-mail may already be in use. If you continue to get this error please contact support@wpcts.com',
                customClass: 'swal-size',
                icon: 'error',
                confirmButtonText: 'Cool'
              });
        }
        else if(data.success !== undefined && data.success == true)
        {
            window.location.href = '/home';
        }
    });
}