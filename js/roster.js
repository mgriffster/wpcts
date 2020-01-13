$(document).ready(function(){
    $.get('/getpoints', function(data){
        document.getElementById('points').innerText = 'Your current points: ' + data.points;
   });
   $.get('/getroster', function(data){
    for(var x in data)
    {
        var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +'</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> <div class="gallery-action"><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">delete</i></a></div></div> </div> </div>';
        var newDiv = document.createElement("div");
        newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
        newDiv.innerHTML = html;
        anchor.appendChild(newDiv);
    }
   });
   
});