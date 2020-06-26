//This file is for all the generic page loads and mappings
var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/home');
    }
    else{
        res.render('pages/login');
    }
});

router.get('/chodes', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/chodes');
    }
    else{
        res.render('pages/login');
    }
});

router.get('/home', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/home');
    }
    else{
        res.redirect('/');
        res.send();
    }
    
});

router.get('/rikishi', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/rikishi');
    }
    else{
        res.redirect('/');
        res.send();
    }
});

router.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/');
    res.send();
});

router.get('/leaderboard', function(req,res)
{
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/leaderboard');
    }
    else{
        res.render('pages/login');
    }
});

router.get('/myfavorites', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/favorites');
    }
    else{
        res.redirect('/');
        res.send();
    }
});

router.get('/watch', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/watch');
    }
    else{
        res.render('pages/login');
    }
});

router.get('/rules', function(req,res)
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


router.get('/roster', function(req,res){
    if(req.session !== undefined && req.session.userName !== undefined)
    {
        res.render('pages/roster');
    }
    else{
        res.render('pages/login');
    }
});

router.get('/resetpassword', async function(req,res){
    let resetValid = false;
    db.one('select * from reset_requests where reset_id = $1', req.query.resetId)
    .then(function(data){
        let resetValid = validateResetRequest(data);
        if(resetValid){
            res.render('pages/reset');
        }
        else{
            res.render('pages/invalidreset');
        }
    })
    .catch(function(err){
        res.render('pages/invalidreset');
        return;
    });
});

//Removed for now
// app.get('/videogame', function(req,res){
//     if(req.session !== undefined && req.session.userName !== undefined)
//     {
//         res.render('pages/videogame');
//     }
//     else{
//         res.render('pages/login');
//     }
// });

router.get('/theprophecy', function(req,res){
    res.render('pages/wide');
});

module.exports = router;