$(document).ready(function(){
    $("#tournaments").change(function(){
        loadRankings();
    });

    loadRankings();
    
});


function loadRankings()
{
    $.post('/results', {tournament:$("#tournaments").val()}).done(function(data){
        for(var x in data)
        {
            //Add header line of 
            $('#collection').append('<div class="user-entry" id="user-entry'+x+'"><li class="collection-item">' + data[x].user_name + ':\t\t' + data[x].points +'</li>');
            $('#user-entry'+x).append('<table class="mdTable2 white-text" id="sumoTable'+x+'" style="display:none"><tbody>')
            for(var y in data[x].roster)
            {
                $('#sumoTable'+x).append('<tr><td>'+ data[x].roster[y] +'</td></tr>');
            }
            $('#user-entry'+x).append('</tbody></table>')
        }
    }).then(function(){
        $('.user-entry').click(function(){
            var current = $(this).children()[1].style.display;
            if(current == 'block')
            {
                $(this).children()[1].style.display = 'none';
            }
            else
            {
                $(this).children()[1].style.display = 'block';
            }
        });
    });
}

