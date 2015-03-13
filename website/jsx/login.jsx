var CurrentUser = null;

function getUserIdQueryParam()
{
	if (CurrentUser)
	{
		return "?userid=" + CurrentUser.id;
	}
	else
	{
		return "";
	}
}

var FbLogin = React.createClass({
  getInitialState: function() {
    return {name: "", picture: "", id: ""};
  },

  render: function() {
    var userDisplay;
    if (null == this.state.name || "" == this.state.name) {
      userDisplay = (<div><span className="glyphicon glyphicon-user" aria-hidden="true"></span> Sign-in</div>);
    }
    else {
      userDisplay = (<div><img src={this.state.picture} width="30px" height="30px"> </img> {this.state.name}</div>);      
    };

    var btnStyle = {marginRight: "20", paddingTop: "5", paddingBottom: "5", paddingLeft: "10", paddingRight: "10"};
    return (
        <button type="button" onClick={this.handleClick} className="btn btn-default navbar-btn" aria-label="Sign-in" style={btnStyle}>
        {userDisplay}
        </button>
    );
  },


  componentDidMount: function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '654988191296033',
        xfbml      : true,
        version    : 'v2.2'
      });

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      FB.Event.subscribe('auth.statusChange', function(response) {
          // {
          //   status: "",         /* Current status of the session */
          //   authResponse: {          /* Information about the current session */
          //      userID: ""          /* String representing the current user's ID */
          //      signedRequest: "",  /* String with the current signedRequest */
          //      expiresIn: "",      /* UNIX time when the session expires */
          //      accessToken: "",    /* Access token of the user */
          //   }
          // }
          
          // alert('event status: ' + response.status);
          console.log(response);
          this.statusChangeCallback(response);
      }.bind(this));


      //FB.getLoginStatus(function(response) {
      //  this.statusChangeCallback(response);
      //}.bind(this));

    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  fetchCurrentUser: function() {
    this.updateUserStatus (null);
    console.log('Welcome!  Fetching your information.... ');
    FB.api('me?fields=name,picture', this.fbApiMeCallback);
  },

  fbApiMeCallback: function(response) {
      console.log ('Successful login for: ' + response.id + ' ' + response.name);
      this.updateUserStatus (response);
      SetStatusMessage('User ID: ' + response.id);
  },

  updateUserStatus: function(user) {
    CurrentUser = user;
    if (null == user)
        this.setState ({name: "", picture: "", id: ""});
    else
        this.setState ({name: user.name, picture: user.picture.data.url, id: user.id});
  },

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback: function(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.fetchCurrentUser();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      this.updateUserStatus (null);
      SetStatusMessage ('Please sign into this app.');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      this.updateUserStatus (null);
      SetStatusMessage ('Please sign into Facebook.');
    }

  },

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState: function(response) {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  },

  handleClick: function() {
    if (null == CurrentUser)
      FB.login(function (response) {
        // body...
      });
    else
      FB.logout(function (response) {
        // body...
      });
  }


});

