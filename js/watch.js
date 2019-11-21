var current_video = '';
var current_day = 0;
var video_list = {};

$(document).ready(function(){
    $.post('/getbashovideos', {tournament:'kyushu'}, function(data){
        //store list of video IDs and order
        video_list = data;
        //set default video to the most recent day
        var suggestions_anchor = document.getElementById('suggestions_anchor');
        $('#main_video').attr('src','https://www.youtube.com/embed/'+data[0].youtube_id);
        current_video = data[0].youtube_id;
        current_day = data.length;
        //Store thumbnails as buttons on side for previous days in desc order
        for(var x = 1; x < data.length; x++)
        {
            var newButton = document.createElement('button');
            newButton.className = "swap";
            newButton.style.background = 'url(https://img.youtube.com/vi/'+ data[x].youtube_id +'/0.jpg)';
            newButton.style.backgroundSize = 'cover';
            newButton.value = data[x].youtube_id;
            newButton.day = data.length - x;
            suggestions_anchor.appendChild(newButton);
        }
    }).then(function(){
        $('.swap').click(swapVideos);
    });
});

function swapVideos()
{
    var old_video = current_video;
    current_video = this.value;
    var old_day = current_day;
    current_day = this.day;
    
    //Create new button element w/ thumbnail
    var newButton = document.createElement('button');
    newButton.className = "swap";
    newButton.style.background = 'url(https://img.youtube.com/vi/'+ old_video +'/0.jpg)';
    newButton.style.backgroundSize = 'cover';
    newButton.value = old_video;
    newButton.day = old_day;
    newButton.onclick = swapVideos;
    
    //find correct position in the list by day
    var buttonList = $('#suggestions_anchor').children();

    console.log(buttonList);
    var inserted = false;
    for(var x in buttonList)
    {
        if(buttonList[x].day == old_day-1)
        {
            suggestions_anchor.insertBefore(newButton, buttonList[x]);
            inserted = true;
        }
    }
    if(!inserted)
    {
        suggestions_anchor.appendChild(newButton);
    }
    
    //swap the clicked day to main video
    
    $('#main_video').attr('src', 'https://www.youtube.com/embed/'+current_video);
            
    //remove thumbnail of the day clicked
    $(this).remove();

    
    
}