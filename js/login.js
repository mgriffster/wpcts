

window.onload = function() {
    document.getElementById("createAccount").onclick = toggleCreate;
    document.getElementById("signin").onclick = toggleSignin;
    document.getElementById("login").onclick = login;
    this.document.getElementById("create").onclick = create;
};


function toggleCreate() {
    document.getElementById("register-form").style.display = 'block';
    document.getElementById("login-form").style.display = 'none';
}

function toggleSignin() {
    document.getElementById("register-form").style.display = 'none';
    document.getElementById("login-form").style.display = 'block';
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
            p.background = 'red';
            setTimeout(function(){
                p.background = '#f2f2f2';
            }, 400);
            
            
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
    var em = document.getElementById("newemail").value;

    $.post('/create', {username:name, password:pw, email:em}).done(function(data){
        if(data.success !== undefined && !data.success)
        {
            alert('Unsuccessful account creation. Ask McMichael or just give up.');
        }
        else if(data.success !== undefined && data.success == true)
        {
            window.location.href = '/home';
        }
    });
    return false;
}