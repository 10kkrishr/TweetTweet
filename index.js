var express = require('express');
var app = express();
const DataHelper = require('./db/DbHelper.js');


app.get('/api/v1/feed', function(req, res) {
  var userId = req.param('userId');
  var token = req.param('token') || req.headers['x-access-token'];

  //DataHelper.insertData();

  //Get the username using the session token and then get the feeds for the user
   DataHelper.getUsername(token, (err, userName) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        DataHelper.getTweets(userName, (err, tweets) => {
           if (err) {
             res.status(500).json({ error: err.message });
           } else {
             res.json(tweets);
           }
         });
      }
    });

});


app.listen(8080, function() {
  console.log('App listening on port 8080!');
});
