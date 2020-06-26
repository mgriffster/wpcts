let active = [];

$(document).ready(function() {
    var anchor = document.getElementById('portfolio').childNodes[1].childNodes[1];
    var submit = document.getElementById('team').childNodes[3];
    $.get('/getmyfavorites', function(data){
        if(data.length > 5)
        {
            for(var x in data)
            {
            var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +'</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data[x].ring_name + '"></canvas> </p> </div> <div class="gallery-action gallery-add" id="'+data[x].ring_name.toLowerCase()+'"><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">delete</i></a></div></div> </div> </div>';
            var newDiv = document.createElement("div");
            newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
            newDiv.innerHTML = html;
            anchor.appendChild(newDiv);
            
            var newForm = document.createElement("p");
            newForm.innerHTML = '<label><input class="with-gap" name="group1" type="radio" value="'+ data[x].ring_name +'"/><span>'+ data[x].ring_name +'</span></label>'
            submit.appendChild(newForm);

            active.push(data[x].ring_name);
            }
        }
        else
        {
            for(var x in data)
            {
            var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/'+ data[x].ring_name.toLowerCase() +'.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>'+ data[x].ring_name +'</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>'+data[x].ring_name+'</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>'+ data[x].stable+' </td> </tr> <tr> <th>Name</th> <td>'+data[x].name+'</td> </tr> <tr> <th>Rank</th> <td> '+data[x].rank+' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>'+data[x].birth_date+'</td> </tr> <tr> <th>Place of Birth</th> <td>'+data[x].birth_place+'</td> </tr> <tr class="line1"><th>Height</th> <td>'+data[x].height+'.0cm</td> </tr> <tr> <th>Weight</th> <td>'+data[x].weight+'.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>'+data[x].favorite_tech+'</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data[x].ring_name + '"></canvas> </p> </div> <div class="gallery-action gallery-add" id="'+data[x].ring_name.toLowerCase()+'"><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">delete</i></a></div></div> </div> </div>';
            var newDiv = document.createElement("div");
            newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
            newDiv.innerHTML = html;
            anchor.appendChild(newDiv);

            active.push(data[x].ring_name);
            }

            var newForm = document.querySelector("#alertSub");
            newForm.innerText = 'Are you sure you wish to submit with less than 6 fighters? You will not be able to select a substitute without 6 Rikishi favorited.';
        }
        
    }).then(function(){

        $.getScript("//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/gallery.min.opt.js?0");

        $('.gallery-action').click(function() {
            var sumoRemove = $(this).parent().find('span').text();
            var deadDiv = $(this).parent().parent().parent()[0];

            $.post('/remove', {sumo:sumoRemove}).done(function(data){
                if(data)
                {
                    $('#placeholder-overlay').click();
                    deadDiv.style.display = 'none';
                    Swal.fire({
                        title: 'Removed',
                        text: 'Successfully removed ' + sumoRemove + ' from your stable. You can add them again through the Rikishi Info page.',
                        icon: 'success',
                        confirmButtonText: 'Confirm'
                      });
                }
                else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'There has been an issue removing ' + sumoRemove + ' from your stable. If you do not see them in your favorites page or have issues with adding new wrestlers please contact support@wpcts.com',
                        icon: 'error',
                        confirmButtonText: 'Darn it'
                      });
                }
            });
        });
        
        $('#submitTeam').click(function(){

            let names = $("input[type='radio'][name='group1']:not(:checked)");
            let substitute = $("input[type='radio'][name='group1']:checked").val();
            let roster = active;
            if(names.length > 5 && (substitute == undefined || substitute == null))
            {
                Swal.fire({
                    title: 'Error!',
                    text: 'You must select a substitute if you have 6 Rikishi in your favorites.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                  });
                return;
            }

            $.post('/submitroster', {active:roster, sub:substitute}, function(data){
                Swal.fire({
                    title: 'Submission Result',
                    text: data,
                    icon: 'info',
                    confirmButtonText: 'Cool'
                  }).then(() =>{
                    $("#team").css("display", "none");
                    $("#teamOverlay").css("display", "none");
                  });
            });
        });

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

        $('#submitShow').click(function(){
            $("#team").css("display", "block");
            $("#teamOverlay").css("display", "block");
        });

        $('#cancelTeam').click(function(){
            $("#team").css("display", "none");
            $("#teamOverlay").css("display", "none");
        });
        
    });
});