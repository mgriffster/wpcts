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
var db = pgp('postgres://ujrqwyhfbscbgs:87516f23130cec74bd5acb014b58c5528b072a5507d705c140bccd254e6f7d8e@ec2-54-197-238-238.compute-1.amazonaws.com:5432/dos8rg55607fp?ssl=true');

var jsonParser = bodyParser.json();

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
    if(req.session !== undefined && req.session.sumoName !== undefined)
    {
        res.render('pages/home');
    }
    else{
        res.render('pages/login');
    }
    
});

app.get('/home', function(req,res){
    if(req.session !== undefined && req.session.sumoName !== undefined)
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
                req.session['sumoName'] = login.name;
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
            req.session['sumoName'] = user.name;
            res.send(user);
        }
    });
});

app.get('/rikishi', function(req,res){
    if(req.session !== undefined && req.session.sumoName !== undefined)
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

app.post('/favorite', function(req,res){

    console.log(req.session['sumoName']);
    console.log(req.body.sumoFavorite);

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
            db.one('INSERT INTO user_info(user_name, password, email) VALUES($1, $2, $3) RETURNING user_name', [userInfo.name, hash, userInfo.email]).then(function(data){
                console.log('New User Added' + data.user_name);
            }).catch(err => {
                console.log(err);   
            });
        }
      });
    
}