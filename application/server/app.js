//everything that the server has to do is right here

let express  = require('express');
let bodyParser = require('body-parser');

const cors = require('cors');   
const bcrypt = require('bcrypt');  //npm password hashing module
const path = require("path");


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


app.get("/", (req, res) =>{
	res.send("hello test!!!");
})



const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
})
