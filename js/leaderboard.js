$(document).ready(function(){
    $.get('/leaderboardpoints', function(data){
        console.log(data.names);
        for(var x in data.names)
        {
            //Add header line of 
            $('#collection').append('<div class="user-entry" id="user-entry'+x+'"><li class="collection-item">' + data.names[x].user_name + ':\t\t' + data.names[x].data.points +'</li>');
            $('#user-entry'+x).append('<table class="mdTable2" id="sumoTable'+x+'" style="display:none"><tbody>')
            for(var y in data.names[x].data.sumo)
            {
                $('#sumoTable'+x).append('<tr><td>'+ data.names[x].data.sumo[y] +'</td></tr>');
            }
            $('#user-entry'+x).append('</tbody></table>')
        }
    }).then(function(){
        $('.user-entry').click(function(){
            var current = $(this).children()[1].style.display;
            if(current == 'block')
            {
                current = 'none';
            }
            else
            {
                current = 'block';
            }
        });
    });
});

