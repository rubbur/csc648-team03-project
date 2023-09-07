//Author: Cleveland Plonsey
//Description: Node server that connects to port 8080
//uses express Router to route requests from the client/frontend to the endpoint's controller functions 

let express  = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');   
const bcrypt = require('bcrypt');  //npm password hashing module
const path = require("path");
const db = require("./config/database/dbConnection"); //mysql connection object
const userRouter = require("./routes/userRouter");



let app = express();
const router = express.Router();

app.use(bodyParser.json({limit: '1mb'})); //more data than we ever need to send over http
app.use(cors({
	origin: true,
	credentials: true  //for express session
}));


// Serve static files from the React build directory
//uncomment when we need to serve the static frontend files
// app.use(express.static(path.join(__dirname, '../client/build')));

// // Handle requests that don't match any routes by serving the index.html file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });


//test route. If after executing node app.js from ./server folder,
// when visiting http://localhost:8080 should see hello test! displayed in the browser



app.get("/", (req, res) =>{
	res.send("hello test!!!");
})

//app.use("/user", userRouter);

//application listens on port 8080 which means to visit the server, go to http://localhost:8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
});


//path to github: 
//https://github.com/CSC-648-SFSU/csc648-03-fa23-team03/
