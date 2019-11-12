$(document).ready(function(){
    $.get('/leaderboardpoints', function(data){
        for(var x in data.names)
        {
            $('#collection').append('<li class="collection-item">' + data.names[x].user_name + ':\t\t' + data.names[x].points +'</li>');
        }
    });
});

