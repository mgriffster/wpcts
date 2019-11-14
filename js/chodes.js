$(document).ready(function() {
    var chodepoints = 0;
    var anchor = document.getElementById('portfolio').childNodes[1].childNodes[1];
    $.get('/getchodes', function(data){
        for(var x in data)
        {
            chodepoints += data[x].points;
            var html = '<div class="placeholder"><div class="gallery-curve-wrapper"><a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +'</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> </div> </div> </div>';
            var newDiv = document.createElement("div");
            var rank = data[x].rank;
            newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
            newDiv.innerHTML = html;
            anchor.appendChild(newDiv);
        }
    }).then(function(){
        $('#chodePoints').text('Chode Points: ' + chodepoints);
        $.getScript("//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/gallery.min.opt.js?0");
    });
});