//middleware that checks if user is actually logged in.
const isLoggedIn = (req, res, next) => {
    if(req.session.isLoggedIn){
      next();
    }
    else{
      //res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      console.log("not authenticated " + JSON.stringify(req.session));
      res.send('Log in first to access this page.');
    }
  }

  const isAdmin = (req, res, next) => {
    if(req.session.isAdmin){
      next();
    }
    else{
      //res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
      console.log("not authenticated " + JSON.stringify(req.session));
      res.send('Must be logged in as admin.');
    }
  }

  module.exports = {isLoggedIn, isAdmin }