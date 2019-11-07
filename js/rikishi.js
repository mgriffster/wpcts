$(document).ready(function() {
    $('.gallery-action').click(function() {
        var sumoFavorite = $(this).parent().find('span')[0].innerText;
        $.post('/favorite', {sumoFavorite:sumoFavorite}).done(function(data){
            console.log(data);
            if(data.success !== undefined && !data.success)
            {
                alert('This sumo is already in your favorites.');
            }
            else if(data.success !== undefined && data.success == true)
            {
                alert('Sumo added to favorites');
            }
        });
    });
});
