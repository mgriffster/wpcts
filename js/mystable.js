
$(document).ready(function() {
    var anchor = document.getElementById('portfolio').childNodes[1].childNodes[1];
    $.get('/getmyfavorites', function(data){
        for(var x in data)
        {
            var html = '<div class="placeholder"><div class="gallery-curve-wrapper"><a class="btn-small waves-effect" style="width:100%;"><div class="locked" style="color:red;">LOCKED <i class="material-icons" style="float:right">lock</i></div></a> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +'</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> <div class="gallery-action"><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">delete</i></a></div></div> </div> </div>';
            var newDiv = document.createElement("div");
            var rank = data[x].rank;
            newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
            newDiv.innerHTML = html;
            anchor.appendChild(newDiv);
        }
    }).then(function(){

        $.getScript("//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/gallery.min.opt.js?0");

        $('.gallery-action').click(function() {
            
            var sumoRemove = $(this).parent().parent().find('span')[0].innerText;

            var deadDiv = $(this).parent().parent().parent()[0];
            
            $.post('/remove', {sumo:sumoRemove}).done(function(data){
                if(data)
                {
                    $('#placeholder-overlay').click();
                    deadDiv.style.display = 'none';
                    alert('Successfully removed ' + sumoRemove + ' from your stable. You can add them again through the Rikishi Info page.');
                }
                else{
                    alert('There has been an issue removing ' + sumoRemove + ' from your stable. If you do not see them in your stable page or have issues with adding new wrestlers please contact McMichael');
                }
            });
        });
        
        $.get('/getpoints', function(data){
            document.getElementById('points').innerText = 'Your current points: ' + data.totalpoints;
        });
        
    });
});