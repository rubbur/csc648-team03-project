//middleware that checks if user is actually logged in.
const isLoggedIn = (req, res, next) => {
    if(req.session.isLoggedIn){
      next();
    }
    else{
      //TODO: if they are not logged in, should we reroute them to login page?
      //res.sendFile(path.join(__dirname, '../tutor-app/build', 'index.html'));
      console.log("not authenticated " + JSON.stringify(req.session));
      res.send('Log in first to access this page.');
    }
  }

//middleware that checks if user is the admin
  const isAdmin = (req, res, next) => {
    if(req.session.isAdmin){
      next();
    }
    else{
      //res.sendFile(path.join(__dirname, '../tutor-app/build', 'index.html'));
      console.log("not authenticated " + JSON.stringify(req.session));
      res.send('Must be logged in as admin.');
    }
  }

  module.exports = {isLoggedIn, isAdmin }