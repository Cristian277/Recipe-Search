var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt = require('bcrypt');
var app = express();
const request = require('request');
var methodOverride = require('method-override');

app.use(methodOverride('_method'));
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

/////////////////////////////////////////////////
//VIEWS

app.get("/homeSignedIn", async function(req,res){
    
    res.render("homeSignedIn"); //sends array of parsedData to the home.ejs view

});

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
    
    res.render("searchSignedIn",{foodInfo:parsedData});

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
               
        var stmt = 'select recipeId, name, calories, ingredients,numberOfServings,healthLabel,image ' +
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

//DELETE A RECIPE FROM USER ACCOUNT 
app.get('/myRecipes/:aid/delete', function(req, res){
    var stmt = 'DELETE from recipes WHERE recipes.recipeId='+ req.params.aid + ';';
    connection.query(stmt, function(error, result){
        if(error) throw error;
        res.redirect('/');
    });
});


app.get('/myRecipes/:aid/edit', function(req, res){
    var stmt = 'SELECT * FROM recipes WHERE recipeId=' + req.params.aid + ';';
    connection.query(stmt, function(error, results){
       if(error) throw error;
       if(results.length){
           var recipe = results[0];
          
           res.render('editRecipe', {recipe:recipe});
       }
    });
});

app.put('/myRecipes/:aid', function(req, res){
    
    console.log(req.body);
    
    var stmt = 'UPDATE recipes SET ' +
                'name="'+ req.body.recipeName + '",' +
                'calories="'+ req.body.calories + '",' +
                'ingredients="'+ req.body.ingredients + '",' +
                'numberOfServings="'+ req.body.numberOfServings + '",' +
                'healthLabel="'+ req.body.healthLabel + '",' +
                'image="'+ req.body.image + '"' +
                ' where recipes.recipeId=\'' 
                + req.params.aid + '\';'
                
    console.log(stmt);
    connection.query(stmt, function(error, result){
        if(error) throw error;
        res.redirect('/');
    });
});


//ERROR PAGE
app.get('*', function(req, res){
   res.render('error'); 
});

//LISTENER
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Running Express Server...");
});


//////////////////////////////////////////////////
//FUNCTIONS

function isAuthenticatedHome(req, res, next){
    if(!req.session.authenticated) res.render('home');
    else next();
}

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

