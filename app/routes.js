var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

// app/routes.js
module.exports = function(app, passport) {
    var pollHandler = new PollHandler();

//------------------------------------------------------------------------------
// Authentication
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // HOME PAGE (with login links)
    //--------------------------------------------------------------------------
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/views/index.html');
        });

    //--------------------------------------------------------------------------
    // LOGIN
    //--------------------------------------------------------------------------
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //--------------------------------------------------------------------------
    // SIGNUP
    //--------------------------------------------------------------------------
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //--------------------------------------------------------------------------
    // LOGOUT
    //--------------------------------------------------------------------------
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //--------------------------------------------------------------------------
    // TWITTER
    //--------------------------------------------------------------------------
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
      }));

    //--------------------------------------------------------------------------
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
    //--------------------------------------------------------------------------

    // locally
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/connect/local', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // twitter --------------------------------
    // send to twitter to do the authentication
    app.get('/connect/twitter',
            passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


//------------------------------------------------------------------------------
// API Calls
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // Get user information, including all polls
    //--------------------------------------------------------------------------
    // used in: /app/controllers/pollController.client.js
    app.route('/api/:id/poll')
        .get(isLoggedIn, pollHandler.getUser); //Add isLoggedIn

    //--------------------------------------------------------------------------
    // Get some meta user data, e.g., max poll id
    //--------------------------------------------------------------------------
    // used in: /app/controllers/pollCreateController.client.js
    app.route('/api/:id/userData')
        .get(isLoggedIn, pollHandler.getUserMeta); //Add isLoggedIn

    //--------------------------------------------------------------------------
    // Get or Delete the current poll
    //--------------------------------------------------------------------------
    // used in: /app/controllers/pollViewController.client.js
    //          /app/controllers/pollVoteController.client.js
    app.route('/api/:id/poll/:pollId')
      .get(pollHandler.getCurrPolls)
      .delete(isLoggedIn, pollHandler.deletePoll);


//------------------------------------------------------------------------------
// Routes
//------------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // Profile: main landing page
    //--------------------------------------------------------------------------
    app.route('/profile')
        .get(isLoggedIn, function (req, res) {
            res.sendFile(process.cwd() + '/views/profile.html');
        });

    //--------------------------------------------------------------------------
    // Create: create a new poll
    //--------------------------------------------------------------------------
    // Show the boilerplate form to create a new poll
    app.route('/poll/create')
      .get(isLoggedIn, function(req, res) {
        res.sendFile(process.cwd() + '/views/pollCreate.html');
      });

    // Once submitted, redirect to a created poll page
    // < can I combine this route?
    app.post('/poll/createPoll/:optionCount',
      isLoggedIn, pollHandler.createPoll
    );

    //--------------------------------------------------------------------------
    // made: Interact/vote using the poll
    //--------------------------------------------------------------------------
    // show the poll options
    app.route('/poll/:userId/made/:pollId/master')
      .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/pollMade.html');
      })
      .post(pollHandler.submitVote);

    // no isLoggedIn b/c we need to share with external users
    app.route('/poll/:userId/made/:pollId')
      .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/pollMade.html');
      })
      .post(pollHandler.submitVote);


    //--------------------------------------------------------------------------
    // View: show the results of the poll
    //--------------------------------------------------------------------------
    // show results
    app.route('/poll/:userId/view/:pollId')
      .get(isLoggedIn, function(req, res) {
        res.sendFile(process.cwd() + '/views/pollView.html');
      });

    app.route('/poll/submitted')
      .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/externalSubmit.html');
      });
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
