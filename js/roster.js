$(document).ready(function(){
    $.get('/getpoints', function(data){
        if(!data.failure && data.totalpoints.points != null)
        {
            document.getElementById('points').innerText = 'Your current points: ' + data.totalpoints.points;
        }
   });

   var anchor = document.getElementById('portfolio').childNodes[1].childNodes[1];
   $.get('/getroster', function(data){
    let subhtml;
    for(var x in data)
    {
        if(data[x].ring_name == data[x].injured)
        {
            var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous" style="border:red;border-style:solid"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +' (Injured)</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> </div> </div> </div>';
            var newDiv = document.createElement("div");
            newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
            newDiv.innerHTML = html;
            anchor.appendChild(newDiv);
        }
        else if(data[x].ring_name == data[x].substitute)
        {
            if(data[x].substitute_day != null)
            {
                subhtml = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous" style="border:green;border-style:solid"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +' (Active Substitute)</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> </div> </div> </div>';
            }
            else
            {
                subhtml = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous" style="border:red;border-style:solid"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +' (Inactive Substitute)</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> </div> </div> </div>';
            }
            
        }
        else{
            var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +'</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <img src="/views/sumoImages/'+data[x].ring_name.toLowerCase()+'stats.png"> </p> </div> </div> </div> </div>';
            var newDiv = document.createElement("div");
            newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
            newDiv.innerHTML = html;
            anchor.appendChild(newDiv);
        }
    }
    var newDiv = document.createElement("div");
    newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
    newDiv.innerHTML = subhtml;
    anchor.appendChild(newDiv);
    
   }).then(function(){
    $.getScript("//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/gallery.min.opt.js?0");

    $.get('/charts', function(data){
            
        let ringNames = Object.keys(data);
        
        for(var x in ringNames)
        {
            let orderedBashoList = ['Aki19', 'Kyushu19', 'Hatsu20', 'Haru20', 'Nagoya20'];
            let ctx = document.getElementById('chart_'+ringNames[x]);
            if(!ctx)
            {
                continue;
            }
            let dataSet = [];
            for(var i in orderedBashoList)
            {
                dataSet.push(data[ringNames[x]][orderedBashoList[i]]);
                orderedBashoList[i] = orderedBashoList[i].slice(0, orderedBashoList[i].length-2) + ' 20' + orderedBashoList[i].slice(orderedBashoList[i].length-2);
            }
            var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
            // The data for our dataset
            data: {
                labels: orderedBashoList,
                datasets: [{
                    data: dataSet,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            // Configuration options go here
            options: {
                legend:{
                    display: false
                },
                title: {
                    display: true,
                    text: "Points By Tournament",
                    fontSize: 20
                },
                scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 25,
                    }
                }],
            },
        }
        });
    }
});

   });
   
   
});