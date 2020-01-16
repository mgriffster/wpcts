const cool = require('cool-ascii-faces');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var pgp = require('pg-promise')();
var db = pgp('postgres://daipfwmuzapzlw:17fff977a27e0a3ca5757456d71b955fe4f25929aed9dd98d39a33a73e10efcf@ec2-54-227-251-33.compute-1.amazonaws.com:5432/d5ngkb7e3s2l2s?ssl=true')
var jsonParser = bodyParser.json();

/*
THINGS TO UPDATE DURING/BETWEEN TOURNAMENTS:

Roster lock: Comment out functional code in Remove/Favorite to prevent using those functions during lock

Rikishi updates: Update makuuchi ranks and active sanyaku when Banzuke is released

Make sure points are grabbed from correct basho (remove points for current system, change current basho variable under new)

*/



var sanyaku = ['Goeido', 'Takakeisho', 'Takayasu', 'Asanoyama', 'Abi', 'Daiesho'];

var yokozuna = ['Hakuho', 'Kakuryu'];

const current_basho = 'Hatsu20';

var app = express();
app.use(express.static(__dirname));
app.use('js', express.static('views/js'));
app.use(cookieParser('sumoSecret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'sumoSecret',
    name: 'sumoCookie',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.set('stylesheets', express.static('views/stylesheets'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/home');
    }
    else{
        res.render('pages/login');
    }
});

app.get('/home', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/home');
    }
    else{
        res.redirect('/');
        res.send();
    }
    
});

app.post('/login', function(req,res){
        var login = {
            "name":req.body.username,
            "password":req.body.password
        }
        db.any('SELECT * FROM user_info WHERE user_name = $1', login.name).then(function(data){
            if(data.length == 0)
            {
                login.success = false;
                res.send(login);
                return;
            }
            bcrypt.compare(login.password, data[0].password, function(err, verified) {
            if(verified === true)
            {
                login.success = true;
                req.session['userName'] = login.name;
            }
            else
            {
                login.success = false;
            }
            res.send(login);
            });
        });
        
});

app.post('/submitroster', function(req,res){
    res.send('Rosters are currently locked for the January Basho! If you would still like to submit a roster give $5 and/or a McChicken to McMichael.');
    return;
    var active = req.body.active;
    var sub = req.body.sub;

    db.oneOrNone('insert into roster(user_name, active, substitute, basho) SELECT $1, $2, $3, $4 WHERE not exists (select * from roster where user_name = $1 AND basho = $4) RETURNING user_name', [req.session['userName'], active, sub, current_basho]).then(function(data){
        if(typeof data == 'undefined' || data == null)
        {
            res.send('Your roster has already been finalized. To see your finalized roster go to the My Roster page and select Hatsu Basho 2020 in the dropdown.');
        }
        else
        {
            res.send('Successfully finalized your roster. You will now be eligible to win Fantasy Hatsu Basho 2020.');
        }
    });

});

app.post('/winners', async function(req,res){
    var winners = req.body.winners;
    var day = req.body.day;
    var basho = req.body.basho;
    for(var x in winners)
    {
        let updated = await db.none('insert into basho_points (ring_name, basho, day, points) VALUES ($1, $2, $3, $4)', [winners[x], basho, day, 1]);
    }

    res.send('COMPLETE');
})

app.post('/create', function(req,res){
    var user = {
        "name": req.body.username,
        "password": req.body.password,
        "email": req.body.email
    }
    db.any('SELECT * FROM user_info WHERE user_name = $1', user.name).then(function(data){
        if(data.length > 0)
        {
            user.success = false;
            res.send(user);
        }
        else
        {
            addUser(user);
            user.success = true;
            req.session['userName'] = user.name;
            res.send(user);
        }
    });
});

app.get('/getpoints', async function(req,res){
    let result = await db.oneOrNone('select * from roster where user_name = $1', [req.session['userName']]).catch(err => console.log(err));
    
    if(result.substitute_day != null)
    {
        let before_injury = await db.one('select SUM(points) as points from basho_points bp inner join roster r on (bp.ring_name = ANY ($1) AND bp.basho=$2 AND bp.day < $3) WHERE r.user_name = $4', [result.active, current_basho, result.substitute_day, result.user_name]);
        result.active = result.active.filter(sumo => sumo != result.injured);
        console.log(result.active);
        result.active.push(result.substitute);
        let after_injury = await db.one('select SUM(points) as points from basho_points bp inner join roster r on (bp.ring_name = ANY ($1) AND bp.basho=$2 AND bp.day >= $3) WHERE r.user_name = $4', [result.active, current_basho, result.substitute_day, result.user_name]);
        let totalpoints = before_injury + after_injury;
        res.send(totalpoints);
    }
    else
    {
        let totalpoints = await db.one('select SUM(points) as points from basho_points bp inner join roster r on (bp.ring_name = ANY ($1) AND bp.basho=$2) WHERE r.user_name = $3', [result.active, current_basho, result.user_name]);
        res.send(totalpoints);
    }
});

app.get('/roster', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/roster');
    }
    else{
        res.render('pages/login');
    }
    
})
app.get('/theprophecy', function(req,res){
    res.render('pages/wide');
});

app.post('/results', function(req,res){
    let basho = req.body.tournament;
    if(basho != current_basho)
    {
        db.any('select user_name,finish_position,points,roster from fantasy_results where basho = $1 order by finish_position;', basho).then(function(data){
            res.send(data);
        }).catch(err => console.log(error));
    }
    
});

//Gets up to date points for all users in current basho

app.get('/currentbashorankings', function(req,res){
    db.task(async (t) => {
        let names = await t.any('SELECT user_name FROM user_info');
        for(var x in names)
        {
            names[x].data = await t.any('select r.points, r.ring_name, f.substitute, sub_penalty from rikishi r inner join favorited f on r.ring_name = ANY (f.sumo) where f.user_name = $1', names[x].user_name)
            .then(function(data){
                var points = 0;
                var sumo = [];
                for(var x in data)
                {
                    sumo.push(data[x].ring_name);
                    if(data[x].ring_name == data[x].substitute)
                    {
                        sumo[x] += ' (sub';
                        if(data[x].sub_penalty != null)
                        {
                            points+=data[x].points;
                            points -= data[x].sub_penalty;
                            sumo[x] += '-active';
                        }
                        sumo[x] += ')';
                    }
                    else
                    {
                        points += data[x].points;
                    }
                }
                return {points, sumo};
            }).catch(err => console.log(err));
        }
        names.sort((a, b) => parseFloat(b.data.points) - parseFloat(a.data.points));
        return {names};
    })
       .then(data => {
               res.send(data);
               //Export results code goes here to update tournament results
       })
        .catch(error => {
            console.log(error)
        });

});



//Export results code to save for later
/*
db.task(async (t) => {
                for(var x in data.names)
                {
                    if(data.names[x].data.points > 0)
                    {
                        let result = await t.none('INSERT INTO fantasy_results(user_name, finish_position,basho, points, roster) VALUES($1,$2,$3,$4,$5)', [data.names[x].user_name, parseInt(x, 10) +1, 'hatsu20',data.names[x].data.points, data.names[x].data.sumo]);
                    }
                }
                res.send(data);
               });

*/



app.post('/remove', function(req,res){
    // Use to lock after Jan 12
    // var open = false;
    // res.send(open);
    //Commented out after roster locks to prevent removing rikishi
    var sumo = req.body.sumo;
    var name = req.session['userName'];

    if(sanyaku.includes(sumo))
    {
        db.none('update favorited set sumo = array_remove(sumo, $1), sanyaku = false where user_name = $2', [sumo,name]).then(function(data){
            res.send(true);
        }).catch(err=>{
            console.log(err);
            res.send(false);
        });
    }
    else
    {
        db.none('update favorited set sumo = array_remove(sumo, $1) where user_name = $2', [sumo,name]).then(function(data){
            res.send(true);
        }).catch(err=>
            {
                console.log(err);
                res.send(false);
            });
    }
});
app.get('/getroster', async function(req,res){
    let data = await db.any('select * from rikishi r inner join roster ro on ro.basho = $2 AND (r.ring_name = ANY (ro.active) OR r.ring_name = ro.substitute) where ro.user_name = $1', [req.session['userName'], current_basho]);
    res.send(data);
});
app.get('/getrikishi', function(req,res){
    let data = {};
    db.any("select * from rikishi where rank like 'Maegashira%' AND active = true order by rank asc").then(function(response){
        data.maegashira = response;
        db.any("select * from rikishi where rank like 'Ozeki' OR rank like 'Komusubi' OR rank like 'Sekiwake' AND active = true").then(function(response){
            data.sanyaku = response;
            db.any("select * from rikishi where rank like 'Yokozuna' AND active = true").then(function(response){
                data.yokozuna = response;
                res.send(data);
            }).catch(err => res.send(err));
        }).catch(err => res.send(err));
    }).catch(err => res.send(err));
});

app.post('/getbashovideos', function(req,res){
    var basho = req.body.tournament;
    db.any('select * from basho_video where basho = $1 order by day desc', basho).then(function(data){
        res.send(data);
    }).catch(err => console.log(err));
});

app.get('/rikishi', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/rikishi');
    }
    else{
        res.redirect('/');
        res.send();
    }
});

app.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/');
    res.send();
});

app.get('/leaderboard', function(req,res)
{
    res.render('pages/leaderboard');
});

app.get('/mystable', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/mystable');
    }
    else{
        res.redirect('/');
        res.send();
    }
});

app.get('/watch', function(req,res){
    res.render('pages/watch');
});

app.get('/rules', function(req,res)
{
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/rules');
    }
    else{
        res.redirect('/');
        res.send();
    }
});

app.post('/favorite', function(req,res){
    
    var favorite = {};
    // Use to lock after Jan 12
    // favorite.message = "Rosters are currently locked for the January Basho.";
    // favorite.success = false;
    // res.send(favorite);
    //Commented out after roster locks to prevent adding rikishi
    var currentSumo = [];
    
    var newSumo = req.body.sumoFavorite;
    if(yokozuna.includes(newSumo)){
        favorite.success = false;
        favorite.message = 'You can not add a Yokozuna to your stable because they have swords and that is not fair.';
        res.send(favorite);
    }
    else{
        db.oneOrNone('SELECT sumo,sanyaku FROM favorited WHERE user_name = $1', [req.session['userName']]).then(function(data)
    {
        currentSumo = data;
        if(currentSumo.sumo.length >= 6)
        {
            favorite.success = false;
            favorite.message = 'You already have 6 sumo wrestlers favorited, please remove them from the My Stable page';
            res.send(favorite);
        }
        else if(currentSumo.sumo.includes(newSumo))
        {
            favorite.success = false;
            favorite.message = 'This sumo wrestler is already in your favorites, to remove them go to your My Stable page.';
            res.send(favorite);
        }
        else if(currentSumo.sanyaku && sanyaku.includes(newSumo))
        {
            favorite.success = false;
            favorite.message = 'You already have one Sanyaku in your stable. You must remove them first.';
            res.send(favorite);
        }
        else
        {
            favorite.success = true;
            favorite.message = newSumo + ' has been added to your stable.';
            currentSumo.sumo.push(newSumo);
            if(sanyaku.includes(newSumo))
            {
                db.one('UPDATE favorited SET sumo = $1, sanyaku = true WHERE user_name = $2 RETURNING sumo', [currentSumo.sumo, req.session['userName']]).then(function(data)
                {
                    
                }).catch(err => {
                    console.log(err);   
                });
                res.send(favorite);
            }
            else
            {
                db.one('UPDATE favorited SET sumo = $1 WHERE user_name = $2 RETURNING sumo', [currentSumo.sumo, req.session['userName']]).then(function(data)
                {
                    
                }).catch(err => {
                    console.log(err);   
                });
                res.send(favorite);
            }
        }
        
    }).catch(err => {
        console.log(err);   
    });
    }
    
});

app.get('/getmyfavorites', function(req,res){

    db.any('select * from rikishi r inner join favorited f on r.ring_name = ANY (f.sumo) where f.user_name = $1', req.session['userName'])
    .then(function(data){
        res.send(data);
    }).catch(err=>{
        console.log(err);
    });

});

app.get('/getchodes', function(req,res){
    db.any('select distinct on (r.ring_name) r.*, SUM(bp.points) as points from rikishi r left join basho_points bp on bp.ring_name = r.ring_name where r.weight >= r.height and r.active = true GROUP BY r.ring_name, r.name').then(data => res.send(data));
});

app.get('/chodes', function(req,res){
    res.render('pages/chodes');
});

app.listen(PORT, () => console.log('Listening on ' + PORT));


function addUser(userInfo){
    bcrypt.hash(userInfo.password, saltRounds, function(err, hash) {
        if(err)
        {
            console.log(err);
            alert('ERROR WHILE CREATING ACCOUNT. CONTACT THE MOTHERSHIP.');
        }
        else
        {
            db.none('INSERT INTO user_info(user_name, password, email) VALUES($1, $2, $3)', [userInfo.name, hash, userInfo.email]).then(function(data){
                
            }).catch(err => {
                console.log(err); 
            });
            db.none('INSERT INTO favorited(user_name) VALUES($1)', [userInfo.name]).then(function(data){
                
            }).catch(err => {
                console.log(err);
            });
        }
      });
    
}