/*global localStorage*/
/*global $*/
/*exported load()*/
/*jshint unused:false*/
$(document).ready(function(){
    $('#login_form').on('submit', function(e){
        e.preventDefault();
        var uname = $("#login_form :input[name=username]")[0].value;
        var pass = $("#login_form :input[name=password]")[0].value;
        checkLogin_ajax(uname, pass);
    });
 });

function checkLogin_ajax(uname, pass){
    
    var loginCheckParameters = {
        "username": uname,
        "password":pass
    };
    
    $.ajax({
        type: 'post',
        url: 'route.php',
        data: {
            'url':'pireadingslogger/checkLogin/',
            'payload':JSON.stringify(loginCheckParameters)
        },
        cache:false,
        async:false,
        success: function(response) {
            var response_msg = JSON.parse(response);
            if(response_msg["status"]== "ok"){
                localStorage.setItem("username",uname);
                localStorage.setItem("login_success","true");
                localStorage.setItem("secure_key",response_msg["message"]);
                window.location.replace("welcome.html");
            }
            else{
                alert("Invalid login info");
            }
        }
    });
    
}

 