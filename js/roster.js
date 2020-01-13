$(document).ready(function(){
    $.get('/getpoints', function(data){
        document.getElementById('points').innerText = 'Your current points: ' + data.totalpoints;
   });
});