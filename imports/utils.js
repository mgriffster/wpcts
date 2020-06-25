require('../index')();

module.exports = function() { 
    

this.deleteResetRequest = function(resetId){
    db.none("delete from reset_requests where reset_id = $1", resetId)
    .catch(err => console.log("Could not delete reset id " + resetId + " error: " +err));
}

this.deleteResetRequestsByEmail=function(email){
    db.none("delete from reset_requests where email = $1", email)
.catch(err => console.log("Could not delete reset request for email " + email + " error: " +err));
}

this.changePassword = function(username, password){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
            console.log("Issue hashing password for user: " + username + " Error:" + err);
        }
        else{
            db.none("UPDATE user_info set password=$1 WHERE user_name=$2", [hash, username]).then(function(){
            }).catch(function(err){
                console.log("Error while updating password: " + err);
            });
        }
    });
}

this.validateResetRequest = function(resetRequest){
    if(resetRequest.time_created === undefined){
        return false;
    }

    let resetRequestedTime = new Date(resetRequest.time_created);
    let currentTime = new Date();
    if(currentTime.getTime() - resetRequestedTime.getTime() < 3600000 ){
       return true;
    }
    else{
        return false;
    }
}


this.addUser = function(userInfo){
    bcrypt.hash(userInfo.password, saltRounds, function(err, hash) {
        if(err)
        {
            console.log(err);
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

this.getPoints = async function(userName)
{
    if(!userName)
    {
        return 'ERROR';
    }
    let result = await db.one('select * from roster where user_name = $1 AND basho = $2', [userName, current_basho]).catch(err => console.log('Error D1: '+err));
    if(!result)
    {
        result = {failure:true};
        return result;
    }
    if(result.substitute_day != null)
    {
        let before_injury = await db.one('select SUM(points) as points from basho_points bp WHERE bp.ring_name = ANY ($1) AND bp.basho=$2 AND bp.day < $3', [result.active, current_basho, result.substitute_day]);
        if(before_injury.points == null)
        {
            before_injury.points = 0;
        }
        let subroster = result.active.filter(sumo => sumo != result.injured);
        
        subroster.push(result.substitute);
        let after_injury = await db.one('select SUM(points) as points from basho_points bp WHERE bp.ring_name = ANY ($1) AND bp.basho=$2 AND bp.day >= $3', [subroster, current_basho, result.substitute_day]);
        if(after_injury.points == null)
        {
            after_injury.points = 0;
        }
        result.totalpoints = {points:(parseInt(before_injury.points) + parseInt(after_injury.points))};
        return result;
    }
    else
    {
        result.totalpoints = await db.one('select SUM(points) as points from basho_points bp WHERE bp.ring_name = ANY ($1) AND bp.basho=$2', [result.active, current_basho]);
        
        return result;
    }
}
}