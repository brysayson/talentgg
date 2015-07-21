var Team = require('../models/team.model');
var User = require('../models/user.model');
var passport = require('passport');

module.exports = {

  register: function( req, res, next ) {
    var user, team;
    User.findOne({where: {id: req.session.passport.user}})
    .then(function(userData){
      user = userData;
    })
    .then(function(){
      Team.create({
        teamName: req.body.teamName,
        data: {times: req.body.times, about: req.body.about},
        members: {id: user.id, name: user.displayName, isAdmin: true}
      })
      .then(function(teamData){
        team = teamData;
        user.teams.push({id: team.id, teamName: team.teamName});
      })
      .then(function(){
        User.update({teams: user.teams}, {where: {id: req.session.passport.user}});
      })
      .then(function(){
        res.redirect('/#/user-profile');
      })
    })
  },

  getProfile: function( req, res, next ){
    Team.findOne({where: {teamName: req.url.split('/')[3]}})
       .then(function (teamProfile) {
         res.json(teamProfile);
     });
   },

   getAllProfiles: function( req, res, next ){
    Team.findAll()
       .then(function (teamProfiles) {
         res.json(teamProfiles);
     });
   },

  updateProfile: function( req, res, next ){
    // change this to loop over keys
    Team.update( {
        activationKey: req.body.password
      }, {
        where: {
          username: req.body.username
        }
      });
  }

};
