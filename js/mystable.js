
$(document).ready(function() {
    var anchor = document.getElementById('sumoAnchor');
    $.get('/getmyfavorites', function(data){
        console.log(data);
        // for(var sumo in data)
        // {
        //     var html = '<div class="d hx hf gu gallery-item gallery-expand ce '+ sumo.rank.toLowerCase()+'"> <div class="gallery-curve-wrapper"> <a class="gallery-cover gray"> <img class="responsive-img" src="/views/sumoImages/'+ sumo.ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ sumo.ring_name +'</span> </div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+sumo.ring_name+'</h3> </div> <p class="fi"> <br> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ sumo.stable+' </td> </tr> <tr> <th>Name</th> <td>'+sumo.name+'</td> </tr> <tr> <th>Rank</th> <td> '+sumo.rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data.birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data.birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data.height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data.weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+sumo.favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+sumo.ring_name.toLowerCase()+'stats.png"> </div> </div> </div>';
        //     var newDiv = document.createElement("div");
        //     newDiv.className = 'generateSumo';
        //     newDiv.innerHTML = html;
        //     anchor.appendChild(newDiv);
        // }
    });
});