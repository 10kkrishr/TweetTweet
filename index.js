var express = require('express');
var app = express();
const DataHelper = require('./db/DbHelper.js');

app.set('port', (process.env.PORT || 8080));

app.get('/api/v1/feed', function(req, res) {
  var userId = req.param('userId');
  var token = req.headers.authorization;
  console.log('token is '+token);
  // var token = req.param('token') || req.headers['x-access-token'];

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


app.listen(app.get('port'), function() {
  console.log('App listening on port 8080!');
});
