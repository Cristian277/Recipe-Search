var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt = require('bcrypt');
var app = express();
const request = require('request');

app.set("view engine","ejs");
app.use(express.static("public")); //specify folder for images,css,js
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'top secret code!',
    resave: true,
    saveUninitialized: true
}));

//PERMISSIONS FOR DATABASE ADMIN ACCOUNT
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'cristian',
    password: 'cristian',
    database: 'food_db'
});

connection.connect();

//FUNCTION TO CHECK USERNAME AT LOGIN
function checkUsername(username){
    let stmt = 'SELECT * FROM users WHERE userName=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [username], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
}

//FUNCTION TO CHECK PASSWORD AT LOGIN
function checkPassword(password, hash){
    return new Promise(function(resolve, reject){
       bcrypt.compare(password, hash, function(error, result){
          if(error) throw error;
          resolve(result);
       }); 
    });
}

app.get("/homeSignedIn", async function(req,res){
    
    res.render("homeSignedIn"); //sends array of parsedData to the home.ejs view

});

function isAuthenticatedHome(req, res, next){
    if(!req.session.authenticated) res.render('home');
    else next();
}

//AUTHENTICATION FOR HOME
app.get('/home', isAuthenticatedHome, function(req, res){
   res.redirect('/');
});

//DEFAULT HOME
app.get('/', isAuthenticatedHome, function(req, res){
   res.render('homeSignedIn', {user: req.session.user}); 
});

//route for register
app.get('/register', function(req, res){
  res.render('register');
});
//route for create recipe
app.get('/createRecipe', function(req, res){
  res.render('createRecipe');
});

app.get('/login', function(req, res){
    res.render('login');
});

/* Logout Route */
app.get('/logout', function(req, res){
   req.session.destroy();
   res.redirect('/');
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

//GET RESULTS FROM SEARCH FOR RECIPES
app.get("/searchSignedIn", isAuthenticatedHome, async function(req,res){
    
    let keyword = req.query.keyword;
    
    var i = 0, strLength = keyword.length;
        for(i; i < strLength; i++) {
        keyword = keyword.replace(" ","%20");
    }
    
    let parsedData = await getFood(keyword); //pass in the keyword to the function could add more search keys
    
    parsedData.hits = shuffle(parsedData.hits);
    
    var myJSON = JSON.stringify(parsedData);
    
    res.render("searchSignedIn",{foodInfo:parsedData,stringInfo:myJSON});

});

//ROUTE TO SHOW USERS RECIPES
app.get('/myRecipes', isAuthenticatedHome, function(req,res){
    
    var username = req.session.user;
    
    var statement = 'select userId ' +
               'from users ' +
               'where users.userName=\'' 
                + username + '\';'
    
    connection.query(statement,function(error, results){
        
        if(error) throw error;
        
        var usersId = results[0].userId;
               
        var stmt = 'select name, calories, ingredients,numberOfServings,healthLabel,image ' +
               'from recipes ' +
               'where recipes.userId=\'' 
                + usersId + '\';'
               
    connection.query(stmt, function(error, results){
        
        if(error) throw error;
        
        res.render('myRecipes', {recipeInfo : results});  //both name and quotes are passed to quotes view     
    });
});
});

//RETRIEVE RECIPE LIST FOR SIGNED IN USER
app.get('/recipeList', isAuthenticatedHome, function(req,res){
    
    var username = req.session.user;
    
    var statement = 'select userId ' +
               'from users ' +
               'where users.userName=\'' 
                + username + '\';'
    
    connection.query(statement,function(error, results){
        
        if(error) throw error;
        
        var usersId = results[0].userId;
               
        var stmt = 'select * from recipes where recipes.userId=\'' 
                + 0 + '\';'
            
    connection.query(stmt, function(error, results){
        
        if(error) throw error;
        
        res.render('recipeList',{recipeInfo : results});  //both name and quotes are passed to quotes view     
    });
});
});

//ADDING RECIPES TO DATABASE
app.post('/createRecipe', function(req,res){
    
    var username = req.session.user;
    
    var statement = 'select userId ' +
               'from users ' +
               'where users.userName=\'' 
                + username + '\';'
    
    connection.query(statement,function(error, results){
        
        if(error) throw error;
        
        var usersId = results[0].userId;
        
        connection.query('SELECT COUNT(*) FROM recipes', function(error,results){
        
        if(error) throw error;
        
        if(results.length){
            
            console.log(results);
            
            var recipeId = results[0]['COUNT(*)'] + 1;
            
            var stmt = 'INSERT INTO recipes ' + 
            '(userId,recipeId,name,calories,ingredients,numberOfServings,healthLabel,image) ' +
            'VALUES ' +
            '(' +
            usersId + ',' +
            recipeId + ',"' +
            req.body.recipeName + '",' +
            req.body.calories + ',"' +
            req.body.ingredients + '",' +
            req.body.numberOfServings + ',"' +
            req.body.healthLabel + '","' +
            req.body.portrait + '"' +
            ');';
            
            console.log(stmt);
            connection.query(stmt, function(error, result) {
                if(error) throw error;
                res.redirect('/');
            });
        }
    });
        
    });
});
    
//INSERTING INTO THE TABLE FOR USER

app.post('/register', function(req, res){
    
    let salt = 10;
    bcrypt.hash(req.body.password, salt, function(error, hash){
        if(error) throw error;
        let stmt = 'INSERT INTO users (userName, password) VALUES (?, ?)';
        let data = [req.body.username, hash];
        connection.query(stmt, data, function(error, result){
           if(error) throw error;
           console.log(stmt);
           res.redirect('/login');
        });
    });
});

app.post('/login', async function(req, res){
    
    let isUserExist   = await checkUsername(req.body.username);
    let hashedPasswd  = isUserExist.length > 0 ? isUserExist[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPasswd);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.user = isUserExist[0].userName;
        res.redirect('/home');
    }
    else{
        res.render('login', {error: true});
    }
});

//ERROR PAGE
app.get('*', function(req, res){
   res.render('error'); 
});

//LISTENER
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running Express Server...");
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
        
    } else{
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