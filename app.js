const express = require("express");
const app = express();
const request = require('request');
var mysql = require('mysql');

var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var async = require('async');

app.set("view engine","ejs");
app.use(express.static("public")); //specify folder for images,css,js
app.use(bodyParser.urlencoded({extended: false}));

//PERMISSIONS FOR DATABASE ADMIN ACCOUNT
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'cristian',
    password: 'cristian',
    database: 'food_db'
});

connection.connect();

//ROUTES
app.get("/", async function(req,res){
    
    res.render("home"); //sends array of parsedData to the home.ejs view

});

//route for register
app.get('/register', function(req, res){
  res.render('register');
});

app.get('/login', function(req, res){
    var loginError = false;
    res.render('login', {loginError: loginError});
});

//INSERTING INTO THE TABLE FOR USER
app.post('/register', function(req, res){

  console.log(req.body);
  
  connection.query('SELECT COUNT(*) FROM users;', function(error, result){
      if(error) throw error;
      if(result.length){
            var userId = result[0]['COUNT(*)'] + 1;
            var stmt = 'INSERT INTO users' +
                      '(userId, userName, password) '+
                      'VALUES ' +
                      '(' + 
                      userId + ',"' +
                      req.body.username + '","' +
                      req.body.password + '"' +
                      ');';
            console.log(stmt);
            connection.query(stmt, function(error, result){
                if(error) throw error;
                res.redirect('/login');
            })
      }
  });
});


//GET RESULTS FROM SEARCH FOR RECIPES
app.get("/searchResult", async function(req,res){
    
    let keyword = req.query.keyword;
    
    var i = 0, strLength = keyword.length;
        for(i; i < strLength; i++) {
        keyword = keyword.replace(" ","%20");
    }
    
    let parsedData = await getFood(keyword); //pass in the keyword to the function could add more search keys
    
    parsedData.hits = shuffle(parsedData.hits);
    
    res.render("searchResult",{foodInfo:parsedData});

});

//LISTENER
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running Express Server...");
});

//ERROR PAGE
app.get('*', function(req, res){
   res.render('error'); 
});

//FUNCTION TO RETRIEVE RECIPES FROM API
function getFood(keyword){
    
    return new Promise(function(resolve,reject){
        
    request('https://api.edamam.com/search?q='+keyword+'&app_id=49be3aa8&app_key=bffe4ab90020bab4b2a4dff42d430e47', 
    function (error, response,body){
    
    if(!error && response.statusCode==200){
        
        let parsedData = JSON.parse(body);
        
        console.log(parsedData);
        
        resolve(parsedData); 
        
    }else{
        reject(error); //rejects the promise
        console.log(response.statusCode);
        console.log(error);
    }
});
        
});

}

//SHUFFLE THE RESULTS
function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}


function check_authorized(req, res, next) {
  if(!req.session.login) {
    res.redirect("/login");
    return; 
  }
  next();
}




//function to perform ajax call passes in ingr(keyword),app_id,and app_key as a request
/*
function search(){
    
        $.ajax({
            
        method: "GET",
        url: 'https://api.edamam.com/search',
        dataType: "json",
        data: { "q":"red%20apple",
                          "app_id":"af3e5f3d",
                          "app_key":"2e76f5f797189c1c1d68d4b7416dabd9",
            },
                 
            success: function(result,status) {
                
                var foodLabel = result.hints.food.label;
            
            }
        });
}
*/
