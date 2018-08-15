var express = require('express');
var app = express();
const DataHelper = require('./db/DbHelper.js');

app.set('port', (process.env.PORT || 8080));

app.get('/api/v1/feed', function(req, res) {
  var userId = req.param('userId');
  var token = req.headers.authorization;

  /* Can be used to insert test data into Sqlite database.
  */
  //DataHelper.insertData();

  //Get the username using the session token and then get the feeds for the user
   DataHelper.getUsername(token).then(
     function fulfilled(data) {
       return  DataHelper.getTweets(data);
     }
   ).then(
     function resolved(response) {
      res.json(response);
     }
   ).catch(function(error) {
     res.status(500).json({ error: err.message });
   });



});


app.listen(app.get('port'), function() {
  console.log('App listening on port 8080!');
});
