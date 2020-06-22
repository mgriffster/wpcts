
window.onload = function(){
    document.getElementById("reset").onclick = validateReset;
};

function validateReset(e){
    e.preventDefault();
    
    let pw1 = document.getElementById('password1');
    let pw2 = document.getElementById('password2');

    if(pw1.value.length < 6){
        alert('empty');
    }
    else if(pw1.value === pw2.value){
        //Need to find a better way to communicate resetId so it is not in URL
        const urlParams = new URLSearchParams(window.location.search);
        const resetId = urlParams.get('resetId');
        $.post('/changepassword', { password: pw1.value, resetId: resetId}).done(function(data){
            if(data !== undefined && !data)
            {
                alert('error');
            }
            else if(data !== undefined && data)
            {
                alert('success');
            }
        });
    }
    else{
        alert('match')
        pw1.value = '';
        pw2.value = '';
    }
}

function alert(reason){
    switch(reason){
        case 'match':{
            Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match.',
                icon: 'error',
                customClass: 'swal-size',
                confirmButtonText: "I'll fix it"
              });
              break;
        }
        case 'empty':{
            Swal.fire({
                title: 'Error!',
                text: 'Password can not be less than 6 characters.',
                icon: 'error',
                customClass: 'swal-size',
                confirmButtonText: 'Okey Dokey'
              });
              break;
        }
        case 'error':{
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue resetting your password, please try again or contact support@wpcts.com for assistance.',
                icon: 'error',
                customClass: 'swal-size',
                confirmButtonText: 'Confirm'
              });
              break;
        }
        case 'success':{
            Swal.fire({
                title: 'Success!',
                text: 'Your password has been updated.',
                icon: 'success',
                customClass: 'swal-size',
                confirmButtonText: 'Return to Login'
              }).then(function(){
                  window.location.href = '/';
              });
            break;
        }
       
        default: break;
    }

}