const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const shortid = require('shortid');
const saltRounds = 10;
const fs = require('fs');
var pgp = require('pg-promise')();
var db = pgp(process.env.DBURL);



/*
THINGS TO UPDATE DURING/BETWEEN TOURNAMENTS:

Roster lock: Comment out functional code in Remove/Favorite to prevent using those functions during lock

Rikishi updates: Update makuuchi ranks and active sanyaku when Banzuke is released

Make sure points are grabbed from correct basho for the export

*/

//this is the list of bashos for which we have data, not used for anything yet but to remind me
const basho_list = ['Nagoya20','Haru20', 'Hatsu20', 'Kyushu19', 'Aki19'];

//Current high ranked rikishi
const sanyaku = ['Takakeisho', 'Daieisho', 'Asanoyama', 'Mitakeumi', 'Okinoumi','Shodai'];
const yokozuna = ['Hakuho', 'Kakuryu'];

//Make sure to export results to fantasy_results table before changing current basho (will break leaderboard otherwise)
const current_basho = 'Nagoya20';

module.exports = function(){
    this.current_basho = current_basho;
    this.basho_list = basho_list;
    this.sanyaku = sanyaku;
    this.yokozuna = yokozuna;
    this.saltRounds = saltRounds;
    this.db = db;
};
require('./imports/utils')();
var pages = require('./imports/pages');


//Set up for express
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
app.use('/', pages);


/**
 * All of the site API is here
 */

 //Login validation
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

//Submit roster for current basho
app.post('/submitroster', function(req,res){
    // res.send('Rosters have been locked for the Nagoya Basho 2020. If you would still like to participate please contact the site administrator or e-mail GYOJI@WPCTS.COM');
    // return;
    var active = req.body.active;
    var sub = req.body.sub;
    let index = active.indexOf(sub);
    if(index > -1){
        active.splice(index, 1);
    }
    db.oneOrNone('insert into roster(user_name, active, substitute, basho) SELECT $1, $2, $3, $4 WHERE not exists (select * from roster where user_name = $1 AND basho = $4) RETURNING user_name', [req.session['userName'], active, sub, current_basho]).then(function(data){
        if(typeof data == 'undefined' || data == null)
        {
            res.send('Your roster has already been finalized. To see your finalized roster go to the My Roster page.');
        }
        else
        {
            res.send('Successfully finalized your roster.');
        }
    });

});


app.post('/winners', async function(req,res){
    var winners = req.body.winners;
    var day = req.body.day;
    var basho = req.body.basho;

    for(var x in winners)
    {
        console.log(x);
        await db.none('insert into basho_points (ring_name, basho, day, points) VALUES ($1, $2, $3, $4)', [winners[x], basho, day, 1]);
    }

    res.send('COMPLETE');
})

//Create new account
app.post('/create', function(req,res){
    var user = {
        "name": req.body.username,
        "password": req.body.password,
        "email": (req.body.email).toLowerCase()
    }

    db.any('SELECT * FROM user_info WHERE user_name = $1 OR email = $2', [user.name,user.email]).then(function(data){
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
    }).catch(function(err){
        console.log("Could not create user account: " + err);
        user.success = false;
        res.send(user);
    });
});

//Get specific user's points
app.get('/getpoints', async function(req,res){
    let result = await getPoints(req.session['userName']);
    res.send(result);
});

//Get results for specific basho
app.post('/results', async function(req,res){
    let basho = req.body.tournament;
    if(basho != current_basho)
    {
        db.any('select user_name,finish_position,points,roster from fantasy_results where basho = $1 order by finish_position;', basho).then(function(data){
            res.send(data);
        }).catch(err => console.log("Issue fetching tournament results" + error));
    }
    else
    {
        let user_rosters = await db.any('select * from roster where basho = $1', current_basho);
        let data = [];
        for(var x in user_rosters)
        {
            let next_user = await getPoints(user_rosters[x].user_name);
            if(next_user.failure)
            {
                console.log("Failure in /results: " + user_rosters[x].user_name);
                res.send('Fetching points has failed.');
                return;
            }
            data.push({});
            data[x].points = next_user.totalpoints.points;
            data[x].user_name = next_user.user_name;
            data[x].roster = next_user.active;
            if(next_user.substitute_day != null)
            {
                var i = data[x].roster.indexOf(next_user.injured);
                data[x].roster[i] = data[x].roster[i] + ' (Injured)';
                var j = data[x].roster.push(next_user.substitute + ' (Active Sub)');
            }
            else
            {
                var j = data[x].roster.push(next_user.substitute + ' (Sub)');
            }
        }
        data.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
        res.send(data);
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
            }).catch(err => console.log("Issue fetching rankings: " + err));
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



//Export results code for end of basho
// app.get('/exportHaru20', async function(req,res)
// {
//     let user_rosters = await db.any('select * from roster where basho = $1', current_basho);
//     let data = [];
//     for(var x in user_rosters)
//     {
//         let next_user = await getPoints(user_rosters[x].user_name);
//         data.push({});
//         data[x].points = next_user.totalpoints.points;
//         data[x].user_name = next_user.user_name;
//         data[x].roster = next_user.active;
//         if(next_user.substitute_day != null)
//         {
//             var i = data[x].roster.indexOf(next_user.injured);
//             data[x].roster[i] = data[x].roster[i] + ' (Inactive)';
//             data[x].roster.push(next_user.substitute + ' (Active Substitute)')
//         }
//         else
//         {
//             data[x].roster.push(next_user.substitute + ' (Substitute)');
//         }

//     }
//     data.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
    
//     for(var x in data)
//     {
//         await db.none('insert into fantasy_results (user_name, finish_position, basho, points, roster) VALUES($1, $2, $3, $4, $5)', [data[x].user_name, parseInt(x)+1, current_basho, parseInt(data[x].points), data[x].roster]);
//     }

//     res.send(data);
// });



//Remove rikishi from favorites
app.post('/remove', function(req,res){
    // Use to lock\
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
            console.log("Issue removing sanyaku sumo from favorites: " + err);
            res.send(false);
        });
    }
    else
    {
        db.none('update favorited set sumo = array_remove(sumo, $1) where user_name = $2', [sumo,name]).then(function(data){
            res.send(true);
        }).catch(err=>
            {
                console.log("Issue removing sumo from favorites: "+err);
                res.send(false);
            });
    }
});

//Get roster for specific user
app.get('/getroster', async function(req,res){
    let data = await db.any('select * from rikishi r inner join roster ro on ro.basho = $2 AND (r.ring_name = ANY (ro.active) OR r.ring_name = ro.substitute) where ro.user_name = $1', [req.session['userName'], current_basho])
    .catch(err => console.log("No roster found"));
    res.send(data);
});

//Get all rikishi organized by rank tier
app.get('/getrikishi', function(req,res){
    let data = {};
    db.any("select * from rikishi where rank like 'Maegashira%' AND active = true order by rank asc").then(function(response){
        data.maegashira = response;
        db.any("select * from rikishi where (rank like 'Ozeki' OR rank like 'Komusubi' OR rank like 'Sekiwake') AND active = true").then(function(response){
            data.sanyaku = response;
            db.any("select * from rikishi where rank like 'Yokozuna' AND active = true").then(function(response){
                data.yokozuna = response;
                res.send(data);
            }).catch(err => res.send("Issue fetching Yokozuna: " +err));
        }).catch(err => res.send("Issue fetching Sanyaku: "+err));
    }).catch(err => res.send("Issue fetching Maegashira: "+err));
});

//Get videos for specific basho
app.post('/getbashovideos', function(req,res){
    var basho = req.body.tournament;
    db.any('select * from basho_video where basho = $1 order by day desc', basho).then(function(data){
        res.send(data);
    }).catch(err => console.log("Issue fetching videos: "+err));
});


//Add sumo to your favorites
app.post('/favorite', function(req,res){
    
    var favorite = {};
    // Uncomment to lock favorites
    // favorite.message = "Rosters are currently locked for the ongoing tournament.";
    // favorite.success = false;
    // res.send(favorite);
    //Commented out after roster locks to prevent adding rikishi
    var currentSumo = [];
    
    var newSumo = req.body.sumoFavorite;
    if(yokozuna.includes(newSumo)){
        favorite.success = false;
        favorite.message = 'You can not add a Yokozuna to your stable because they have swords and that is not fair.';
        res.send(favorite);
        return;
    }
    else{
        db.oneOrNone('SELECT sumo,sanyaku FROM favorited WHERE user_name = $1', [req.session['userName']]).then(function(data)
        {
        currentSumo = data;
        if(currentSumo.sumo.length >= 6)
        {
            favorite.success = false;
            favorite.message = 'You already have 6 sumo wrestlers favorited, please remove them from the My Favorites page';
            res.send(favorite);
            return;
        }
        else if(currentSumo.sumo.includes(newSumo))
        {
            favorite.success = false;
            favorite.message = 'This sumo wrestler is already in your favorites, to remove them go to your My Favorites page.';
            res.send(favorite);
            return;
        }
        else if(currentSumo.sanyaku && sanyaku.includes(newSumo))
        {
            favorite.success = false;
            favorite.message = 'You already have one Sanyaku in your stable. You must remove them first.';
            res.send(favorite);
            return;
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
                    console.log("Issue updating favorited sumo list with sanyaku:" +err);   
                });
                res.send(favorite);
            }
            else
            {
                db.one('UPDATE favorited SET sumo = $1 WHERE user_name = $2 RETURNING sumo', [currentSumo.sumo, req.session['userName']]).then(function(data)
                {
                    
                }).catch(err => {
                    console.log("Issue updating favorited sumo list:"+err);   
                });
                res.send(favorite);
            }
        }
        
    }).catch(err => {
        console.log(err);   
    });
    }
    
});

//Get favorites for specific user
app.get('/getmyfavorites', function(req,res){

    db.any('select * from rikishi r inner join favorited f on r.ring_name = ANY (f.sumo) where f.user_name = $1', req.session['userName'])
    .then(function(data){
        res.send(data);
    }).catch(err=>{
        console.log("Issue fetching favorites for user:" +req.session['userName']+" Error:"+ err);
    });

});

//Get ChodesTeam rikishi
app.get('/getchodes', function(req,res){
    db.any('select distinct on (r.ring_name) r.*, SUM(bp.points) as points from rikishi r left join basho_points bp on (bp.ring_name = r.ring_name AND bp.basho = $1) where r.weight >= r.height and r.active = true GROUP BY r.ring_name, r.name', current_basho)
    .then(data => res.send(data))
    .catch(err => console.log("Issue fetching Chode data: "+err));
});

//Get data required for building points charts on rikishi page for all rikishi
app.get('/charts', function(req,res){
    db.any('select SUM(points) as points, basho, ring_name from basho_points group by ring_name, basho order by basho, points desc')
    .then(function(data){
        let formattedMap = {};
        for(var x in data)
        {
            if(formattedMap.hasOwnProperty(data[x].ring_name))
            {
                formattedMap[data[x].ring_name][data[x].basho] = data[x].points;
            }
            else
            {
                formattedMap[data[x].ring_name] = {};
                formattedMap[data[x].ring_name][data[x].basho] = data[x].points;
            }
        }
        res.send(formattedMap);

    }).catch(err => console.log("Issue fetching charts:" +err));
});

//Update user password by matching given resetId to userId
app.post('/changepassword', function(req,res){
    if(req.body.password.length < 6){
        res.send(false);
    }
    db.one('select * from reset_requests where reset_id = $1', req.body.resetId)
    .then(function(data){
        //Validate reset request
        let resetValid = validateResetRequest(data);
        if(resetValid){
            //Use valid reset request email to get username
            db.one("select * from user_info where email = $1", data.email)
            .then(function(data){
                changePassword(data.user_name, req.body.password);
                deleteResetRequest(req.body.resetId);
                res.send(true);
            }).catch(function(err){
                console.log("Issue while retrieving user info for reset request: " + err);
                res.send(false);
            });
        }
        else{
            res.send(false);
        }
    })
    .catch(function(err){
        console.log("Issue while changing password :" + err);
        res.send(false);
    });
    
});

//Send reset password e-mail to given e-mail address if the e-mail is attached to a user account
app.post('/emailresetrequest', function(req,res){

        let email = (req.body.email).toLowerCase();

        db.one('select count(*) from user_info where email = $1', [email]).then(function(data){
            if(data.count == 1){
                //remove old reset requests so there aren't multiple valid at the same time
                deleteResetRequestsByEmail(email);

                var transporter = nodemailer.createTransport({
                    host:'mail.privateemail.com',
                    port:587,
                    secure:false,
                    auth:{
                        type:'login',
                        user:'gyoji@wpcts.com',
                        pass: process.env.EMAIL_PASS
                    }
                });
                fs.readFile('views/partials/resetpasswordemail.html', 'utf8', function (err,data) {
                    if (err) {
                      return console.log(err);
                    }
                    var resetId = shortid.generate();
                    let emailHtml = data.replace(/REPLACEWITHRESETID/g, resetId);
                    var mailOptions = {
                    from:'noreply@wpcts.com',
                    to: email,
                    subject:'WPCTSumo: Request to reset your password.',
                    html: emailHtml
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log("Issue while sending password reset email: "+ error);
                            res.send(false);
                          } else {
                            db.none('insert into reset_requests(email,reset_id) VALUES ($1, $2);', [email, resetId])
                            .catch(function(err){
                                console.log("Issue while insert reset request: " + err); 
                                res.send(false);
                            });
                            console.log('Email sent: ' + info.response);
                            res.send(true);
                          }
                    });
                });
            }
            else{
                if(data.count > 1){
                    console.log("DUPLICATE EMAIL DETECTED: " + email);
                }
                console.log("Unsuccessful reset e-mail attempt for: " + email);
                res.send(true);
            }
        }).catch(function(err){
            console.log(err);
            res.send(false);
        });

        
});

app.listen(PORT, () => console.log('Listening on ' + PORT));