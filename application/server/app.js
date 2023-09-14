//Author: Cleveland Plonsey
//Description: Node server that connects to port 8080
//uses express Router to route requests from the client/frontend to the endpoint's controller functions 

let express  = require('express');
const session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const userRouter = require("./routes/userRouter");
const cors = require('cors');   
const path = require("path");
let app = express();

const router = express.Router();

app.use(bodyParser.json({limit: '1mb'})); //more data than we ever need to send over http
app.use(cors({
	origin: true,
	credentials: true  //for express session
}));

//setup express session 
const sessionStore = new MySQLStore({}, require("./config/database/dbConnection.js"));

app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

//routes: 

app.use("/user", userRouter);


//Serve static files from the React build directory
//uncomment when we need to serve the static frontend files
app.use(express.static(path.join(__dirname, '../tutor-app/build')));

// Handle requests that don't match any routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});





//test route. If after executing node app.js from ./server folder,
// // when visiting http://localhost:8080 should see hello test! displayed in the browser and the session object printed in the terminal.
// app.get("/", (req, res) =>{
//    req.session.isLoggedIn = true;
//     console.log(req.session);
// 	res.send("hello test!!!");
// })



//application listens on port 8080 which means to visit the server, go to http://localhost:8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
});


//path to github: 
//https://github.com/CSC-648-SFSU/csc648-03-fa23-team03/
