$(document).ready(function() {
    $('.gallery-action').click(function() {
        var sumoFavorite = $(this).parent().find('span')[0].innerText;
        $.post('/favorite', {sumoFavorite:sumoFavorite}).done(function(data){
            console.log(data);
            alert(data.message);
        });
    });
    
});
