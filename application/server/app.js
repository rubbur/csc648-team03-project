//Author: Cleveland Plonsey
//Description: Node server that connects to port 8080
//uses express Router to route requests from the client/frontend to the endpoint's controller functions

let express = require("express");
let app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
app.set("io", io);

//file stuff
const fileUpload = require("express-fileupload");

//session modules
const session = require("express-session");
let MySQLStore = require("express-mysql-session")(session);

//http  stuff
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path"); //used for generating static frontend file paths so we can serve them to clients.

//routes
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const tutorRouter = require("./routes/tutorRouter");

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", ({ content, to }) => {
    socket.to(to).emit("message", {
      content,
      from: socket.id,
    });
  });

  socket.on("connected", ({ id }) => {
    socket.join(id);
    console.log("user connected with id: " + id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(fileUpload()); //middleware that allows all routes access to file upload functions.
app.use(bodyParser.json({ limit: "1mb" })); //more data than we ever need to send over http
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //for express session
  }),
);

//setup express session
const sessionStore = new MySQLStore(
  {},
  require("./config/database/dbConnection.js"),
);

app.use(
  session({
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: process.env.PRODUCTION === "true" ? false : true,
      //TODO: figure out this issue. Right now our work around is that we are not using secure cookies.
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      name: "sfsuCookies",
    },
  }),
);

//routes:

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/tutor", tutorRouter);

//Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "../tutor-app/build")));

//Handle requests that don't match any routes by serving the index.html file (the App.js component AKA the landing page)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../tutor-app/build", "index.html"));
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
server.listen(PORT, function () {
  console.log(`Server started on port: ${PORT}`);
});

//path to github:
//https://github.com/CSC-648-SFSU/csc648-03-fa23-team03/
