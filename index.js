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
//var db = pgp('postgres://ujrqwyhfbscbgs:87516f23130cec74bd5acb014b58c5528b072a5507d705c140bccd254e6f7d8e@ec2-54-197-238-238.compute-1.amazonaws.com:5432/dos8rg55607fp?ssl=true');
var jsonParser = bodyParser.json();



var sanyaku = ['Goeido', 'Takakeisho', 'Mitakeumi', 'Tochinoshin', 'Takayasu', 'Hokutofuji', 'Asanoyama', 'Abi', 'Endo'];


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

app.get('/getpoints', function(req,res){
    db.any('select points, ring_name, substitute, sub_penalty from rikishi r inner join favorited f on r.ring_name = ANY (f.sumo) where f.user_name = $1', req.session['userName']).then(function(data)
    {
        var resp = {}
        resp.totalpoints = 0;
        resp.name = req.session['userName'];
        for(var x in data)
            {
                if(data[x].ring_name == data[x].substitute)
                {
                    if(data[x].sub_penalty !== null)
                    {
                        resp.totalpoints+=data[x].points;
                        resp.totalpoints -= data[x].sub_penalty;
                    }
                }
                else
                {
                   resp.totalpoints += data[x].points;
                }
            }
        res.send(resp);
    }).catch(err => console.log(err));

});

app.get('/leaderboardpoints', function(req,res){
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
       })
        .catch(error => {
            console.log(error)
        });

});

app.post('/remove', function(req,res){
    var open = false;
    res.send(open);
    // var sumo = req.body.sumo;
    // var name = req.session['userName'];
    // var success = true;
    // if(sanyaku.includes(sumo))
    // {
    //     db.none('update favorited set sumo = array_remove(sumo, $1), sanyaku = false where user_name = $2', [sumo,name]).catch(err=>{
    //         console.log(err);
    //         success=false;
    //     });
    // }
    // else
    // {
    //     db.none('update favorited set sumo = array_remove(sumo, $1) where user_name = $2', [sumo,name]).catch(err=>
    //         {
    //             console.log(err);
    //             success = false;
    //         });
    // }
    // res.send(success);
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
    favorite.message = "Rosters are currently locked for the November Basho.";
    favorite.success = false;
    res.send(favorite);
    // var currentSumo = [];
    
    // var newSumo = req.body.sumoFavorite;
    // db.oneOrNone('SELECT sumo,sanyaku FROM favorited WHERE user_name = $1', [req.session['userName']]).then(function(data)
    // {
    //     currentSumo = data;
    //     if(currentSumo.sumo.length >= 6)
    //     {
    //         favorite.success = false;
    //         favorite.message = 'You already have 6 sumo wrestlers favorited, please remove them from the My Stable page';
    //         res.send(favorite);
    //     }
    //     else if(currentSumo.sumo.includes(newSumo))
    //     {
    //         favorite.success = false;
    //         favorite.message = 'This sumo wrestler is already in your favorites, to remove them go to your My Stable page.';
    //         res.send(favorite);
    //     }
    //     else if(currentSumo.sanyaku && sanyaku.includes(newSumo))
    //     {
    //         favorite.success = false;
    //         favorite.message = 'You already have one Sanyaku in your stable. You must remove them first.';
    //         res.send(favorite);
    //     }
    //     else
    //     {
    //         favorite.success = true;
    //         favorite.message = newSumo + ' has been added to your stable.';
    //         currentSumo.sumo.push(newSumo);
    //         if(sanyaku.includes(newSumo))
    //         {
    //             db.one('UPDATE favorited SET sumo = $1, sanyaku = true WHERE user_name = $2 RETURNING sumo', [currentSumo.sumo, req.session['userName']]).then(function(data)
    //             {
                    
    //             }).catch(err => {
    //                 console.log(err);   
    //             });
    //             res.send(favorite);
    //         }
    //         else
    //         {
    //             db.one('UPDATE favorited SET sumo = $1 WHERE user_name = $2 RETURNING sumo', [currentSumo.sumo, req.session['userName']]).then(function(data)
    //             {
                    
    //             }).catch(err => {
    //                 console.log(err);   
    //             });
    //             res.send(favorite);
    //         }
    //     }
        
    // }).catch(err => {
    //     console.log(err);   
    // });
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
    db.any('SELECT * FROM rikishi where weight > height').then(function(data){
        res.send(data);
    }).catch(err=>{
        console.log(err);
    });
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