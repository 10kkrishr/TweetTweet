/* jshint node: true, esnext: true */
"use strict";

const sqlite3 = require('sqlite3').verbose();
const BbPromise = require('bluebird');

//Insert test data
function insertData() {
  let db = new sqlite3.Database('./TweetDB.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }

  });
  db.serialize(() => {
    var userNumber = 10000;
    var i, j, k;
    for (i = 1; i <= userNumber; i++) {
      // var randomNumber = Math.floor(Math.random() * 10000) + 1 ;

      db.run("INSERT INTO Employee (Username,Firstname,Lastname)VALUES(?, ?, ?);", "Testuser" + i, "First" + i, "Last" + i);

      var randomNumber = Math.floor(Math.random() * 15) + 1;
      var timeLimit = 3*60*60*24;

      //Random number of tweets for each user
      for (j = 1; j <= randomNumber; ++j) {

        var randomTime = Math.floor(Math.random() * timeLimit) + 1 ;
        var date = new Date() - randomTime;
        db.run("INSERT INTO Tweets (Username,Content,Timestamp)VALUES(?, ?, ?);", "Testuser"+i, "This is tweet no "+j, date);
      }

    }
    for (i = 1; i <= userNumber; i++) {
    //Each user will follow 50 users. The user they are following is random
      for(k=0; k<50; ++k) {
        var randomUserNumber = Math.floor(Math.random() * 10000) + 1 ;
        if(randomUserNumber!=i) {
          db.run("INSERT INTO Followers (Username,Follower)VALUES(?, ?);", "Testuser"+randomUserNumber, "Testuser"+i);
        }
      }
    }
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

}

function getTweets(userId, callback) {
  return new Promise((resolve, reject) => {
      let db = new sqlite3.Database('./TweetDB.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
      }
      db.serialize(() => {
         db.all('SELECT * FROM Tweets WHERE Username IN (SELECT Username FROM Followers WHERE Follower = ?) ORDER BY timestamp DESC LIMIT 100', userId, (err, tweets) => {
          if (err) {
            reject(err);
          }
          resolve(tweets);
        });
      });
      //Close database Connection
      closeDatabaseConnection(db);
    });
  });
}

function getUsername(token) {
  return new Promise((resolve, reject) => {

    let db = new sqlite3.Database('./TweetDB.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }

    });

    db.serialize(() => {
      db.get('SELECT Username FROM Session WHERE SessionToken = ?', token, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user.Username);

      });
    });
    //Close database Connection
    closeDatabaseConnection(db);
  });

}

function closeDatabaseConnection(db) {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}
module.exports = {
  getUsername: getUsername,
  getTweets : getTweets,
  insertData: insertData
};
