
var bodyStyle;


var Splash = React.createClass({
  render: function() {
    var loginFormStyle = {
      background: "url('images/bgt.png') repeat scroll 0 0 rgba(0, 0, 0, 0)",
      width: "380px",
      margin: "15% auto",
      padding: "20px"
    };

    var titleStyle = {
      fontFamily: "Pacifico",
      textDecoration: "underline"
    };

    var logoStyle = {height: "50px", display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: "30px"};

    old = (
      <div className="container">
        <div className="login-form" style={loginFormStyle}>
          <h1 className="title text-center" style={titleStyle}>Welcome</h1>
          <button className="btn btn-block bt-login" type="submit">Sign In</button>
        </div>
      </div>
    );

    return (
      <div className="container">
        <div className="login-form" style={loginFormStyle}>
          <img style={logoStyle} src="images/kimchi-logo-black.svg" />
          <button className="btn btn-block btn-info" type="submit">Sign In</button>
        </div>
      </div>
    );
  }
});



function RenderSplash() {
  var bodyElement = document.getElementById('body');
  var bodyStyle = bodyElement.style;

  bodyElement.style.paddingTop = "0px";
  bodyElement.style.paddingBottom= "0px";
  bodyElement.style.background= "url(images/wallpaper.jpg) no-repeat center center fixed";
  bodyElement.style.backgroundSize= "cover";
  bodyElement.style.backgroundColor= "#fff";
  React.render(<Splash />, document.getElementById('main'));
}

//RenderSplash();

