let currentFavorites = [];

function loadFavorites(){
    $.get('/getmyfavorites', function(data){
        for(var x in data){
            currentFavorites.push(data[x].ring_name)
        }
    });
}

$.when(loadFavorites()).done(function(){
    $(document).ready(function () {
        var anchor = document.getElementById('portfolio').childNodes[1].childNodes[1];
        
        $.get('/getrikishi', function (data) {
            //The check against current favorites only changes the class and image of the icon, which in turn changes the click event it is bound to at load
            //The click event will toggle (along with the icon) between favorite/remove when clicked afterwards
            for (var x in data.yokozuna) {
                var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/' + data.yokozuna[x].ring_name.toLowerCase() + '.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>' + data.yokozuna[x].ring_name + '</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>' + data.yokozuna[x].ring_name + '</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>' + data.yokozuna[x].stable + ' </td> </tr> <tr> <th>Name</th> <td>' + data.yokozuna[x].name + '</td> </tr> <tr> <th>Rank</th> <td> ' + data.yokozuna[x].rank + ' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>' + data.yokozuna[x].birth_date + '</td> </tr> <tr> <th>Place of Birth</th> <td>' + data.yokozuna[x].birth_place + '</td> </tr> <tr class="line1"><th>Height</th> <td>' + data.yokozuna[x].height + '.0cm</td> </tr> <tr> <th>Weight</th> <td>' + data.yokozuna[x].weight + '.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>' + data.yokozuna[x].favorite_tech + '</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data.yokozuna[x].ring_name + '"></canvas> </p> </div></div> </div> </div>';
                var newDiv = document.createElement("div");
                newDiv.className = 'd hx hf gu gallery-item gallery-expand ce yokozuna';
                newDiv.innerHTML = html;
                anchor.appendChild(newDiv);
            }
            for (var x in data.sanyaku) {
                if(currentFavorites.includes(data.sanyaku[x].ring_name)){
                    var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/' + data.sanyaku[x].ring_name.toLowerCase() + '.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>' + data.sanyaku[x].ring_name + '</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>' + data.sanyaku[x].ring_name + '</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>' + data.sanyaku[x].stable + ' </td> </tr> <tr> <th>Name</th> <td>' + data.sanyaku[x].name + '</td> </tr> <tr> <th>Rank</th> <td> ' + data.sanyaku[x].rank + ' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>' + data.sanyaku[x].birth_date + '</td> </tr> <tr> <th>Place of Birth</th> <td>' + data.sanyaku[x].birth_place + '</td> </tr> <tr class="line1"><th>Height</th> <td>' + data.sanyaku[x].height + '.0cm</td> </tr> <tr> <th>Weight</th> <td>' + data.sanyaku[x].weight + '.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>' + data.sanyaku[x].favorite_tech + '</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data.sanyaku[x].ring_name + '"></canvas> </p> </div> <div class="gallery-action gallery-remove" id="'+data.sanyaku[x].ring_name+'"><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">delete</i></a></div></div> </div> </div>';
                }
                else{
                    var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/' + data.sanyaku[x].ring_name.toLowerCase() + '.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>' + data.sanyaku[x].ring_name + '</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>' + data.sanyaku[x].ring_name + '</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>' + data.sanyaku[x].stable + ' </td> </tr> <tr> <th>Name</th> <td>' + data.sanyaku[x].name + '</td> </tr> <tr> <th>Rank</th> <td> ' + data.sanyaku[x].rank + ' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>' + data.sanyaku[x].birth_date + '</td> </tr> <tr> <th>Place of Birth</th> <td>' + data.sanyaku[x].birth_place + '</td> </tr> <tr class="line1"><th>Height</th> <td>' + data.sanyaku[x].height + '.0cm</td> </tr> <tr> <th>Weight</th> <td>' + data.sanyaku[x].weight + '.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>' + data.sanyaku[x].favorite_tech + '</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data.sanyaku[x].ring_name + '"></canvas> </p> </div> <div class="gallery-action gallery-add" id="'+data.sanyaku[x].ring_name+'"><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">add</i></a></div></div> </div> </div>';
                }
                var newDiv = document.createElement("div");
                newDiv.className = 'd hx hf gu gallery-item gallery-expand ce sanyaku';
                newDiv.innerHTML = html;
                anchor.appendChild(newDiv);
            }
            for (var x in data.maegashira) {
                if(currentFavorites.includes(data.maegashira[x].ring_name)){
                    var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/' + data.maegashira[x].ring_name.toLowerCase() + '.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>' + data.maegashira[x].ring_name + '</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>' + data.maegashira[x].ring_name + '</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>' + data.maegashira[x].stable + ' </td> </tr> <tr> <th>Name</th> <td>' + data.maegashira[x].name + '</td> </tr> <tr> <th>Rank</th> <td> ' + data.maegashira[x].rank + ' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>' + data.maegashira[x].birth_date + '</td> </tr> <tr> <th>Place of Birth</th> <td>' + data.maegashira[x].birth_place + '</td> </tr> <tr class="line1"><th>Height</th> <td>' + data.maegashira[x].height + '.0cm</td> </tr> <tr> <th>Weight</th> <td>' + data.maegashira[x].weight + '.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>' + data.maegashira[x].favorite_tech + '</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data.maegashira[x].ring_name + '"></canvas> </p> </div> <div class="gallery-action gallery-remove" id="'+data.maegashira[x].ring_name+'" ><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">delete</i></a></div></div> </div> </div>';
                }
                else{
                    var html = '<div class="placeholder"><div class="gallery-curve-wrapper"> <a class="gallery-cover gray"><img class="responsive-img" src="/views/sumoImages/' + data.maegashira[x].ring_name.toLowerCase() + '.jpg" alt="placeholder" crossOrigin="anonymous"> </a> <div class="gallery-header"> <span>' + data.maegashira[x].ring_name + '</span></div> <div class="gallery-body"> <div class="title-wrapper"> <h3>' + data.maegashira[x].ring_name + '</h3> </div> <p class="fi"> <br> </p> <table class="mdTable2"> <tbody> <tr class="line1"> <th>Heya (Stable)</th> <td>' + data.maegashira[x].stable + ' </td> </tr> <tr> <th>Name</th> <td>' + data.maegashira[x].name + '</td> </tr> <tr> <th>Rank</th> <td> ' + data.maegashira[x].rank + ' </td> </tr> <tr class="line1"> <th>Date of Birth</th> <td>' + data.maegashira[x].birth_date + '</td> </tr> <tr> <th>Place of Birth</th> <td>' + data.maegashira[x].birth_place + '</td> </tr> <tr class="line1"><th>Height</th> <td>' + data.maegashira[x].height + '.0cm</td> </tr> <tr> <th>Weight</th> <td>' + data.maegashira[x].weight + '.0kg</td> </tr> <tr class="line1"> <th>Favorite Grip/Techniques</th> <td>' + data.maegashira[x].favorite_tech + '</td> </tr> </tbody></table> <p class="fi"> <canvas class="chart" id="chart_' + data.maegashira[x].ring_name + '"></canvas> </p> </div> <div class="gallery-action gallery-add" id="'+data.maegashira[x].ring_name+'" ><a class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">add</i></a></div></div> </div> </div>';
                }
                var newDiv = document.createElement("div");
                newDiv.className = 'd hx hf gu gallery-item gallery-expand ce maegashira';
                newDiv.innerHTML = html;
                anchor.appendChild(newDiv);
            }
    
        }).then(function () {
    
            $.getScript("//cdn.shopify.com/s/files/1/1775/8583/t/1/assets/gallery.min.opt.js?0");
            $('.gallery-add').click(function () {
                addFavorite(this);
            });

            $('.gallery-remove').click(function () {
                removeFavorite(this);
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
    });
    
    });
});



function replaceIconWithRemove(element){
    let removeIcon = document.getElementById('removeIcon').childNodes[1].cloneNode(true);
    element.childNodes[0].childNodes[0].replaceWith(removeIcon);
    $(element).off("click");
    $(element).click(function(){
        removeFavorite(this);
    });
};

function replaceIconWithAdd(element){
    let addIcon = document.getElementById('addIcon').childNodes[1].cloneNode(true);
    element.childNodes[0].childNodes[0].replaceWith(addIcon);
    $(element).off("click");
    $(element).click(function(){
        addFavorite(this);
    });
}

function removeFavorite(element){
    $.post('/remove', {sumo:element.id}).done(function(data){
        if(data)
        {
            replaceIconWithAdd(element);
            Swal.fire({
                title: 'Removed',
                text: 'Successfully removed ' + element.id + ' from your stable.',
                icon: 'success',
                confirmButtonText: 'Confirm'
              });
        }
        else{
            Swal.fire({
                title: 'Error!',
                text: 'There has been an issue removing ' + element.id + ' from your stable. The most likely reason is that rosters are currently locked, if this is not the case please contact support@wpcts.com',
                icon: 'error',
                confirmButtonText: 'Darn it'
              });
        }
    });
}

function addFavorite(element){
    $.post('/favorite', { sumoFavorite: element.id }).done(function (data) {
        if(data.success)
        {
            replaceIconWithRemove(element);
            Swal.fire({
                title: 'Success!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'Confirm'
              })
        }
        else
        {
            Swal.fire({
                title: 'Error!',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'Confirm'
              })
        }
        
    });
}