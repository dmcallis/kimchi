var React;
var logoStyle = {height: "20px", marginTop: "0px"};

	        // <FbLogin />

var KiNavbar = React.createClass({
  render: function() {
    return (
    <div className="container">
	    <nav className="navbar navbar-default navbar-fixed-top">
	      <div className="container-fluid">
	        <div className="navbar-header">
	          <a className="navbar-brand" href="#">
	          	<img style={logoStyle} src="images/kimchi-logo-white.svg" />
			  </a>
	        </div>
	        <button type="button" className="btn btn-default navbar-btn" aria-label="Boards">
  				Boards
			</button>
			<FbLogin />
	      </div>
	    </nav>
	</div>
    );
  }
});

var footerStyle = {minHeight: "40px"};
var KiFooter = React.createClass({
  getInitialState: function() {
    return {statusMessage: ""};
  },

  componentDidMount: function() {
	   document.addEventListener('set-status-message', this.onSetStatusMessage);
  },

  render: function() {
    return (
	  <nav className="navbar navbar-default navbar-fixed-bottom">

      <div className="container-fluid">
        <p className="navbar-text">{this.state.statusMessage}</p>
      </div>
      </nav>
    );
  },

  onSetStatusMessage: function(e) {
  	this.setState ({statusMessage : e.detail.message});
  }
});

function SetStatusMessage (messageText)
{
	var event = new CustomEvent(
		"set-status-message",
		{
			detail: {
				message: messageText				
			}
		});
	document.dispatchEvent(event)
}

React.render(<KiNavbar />, document.getElementById('navbar')); 
React.render(<KiFooter />, document.getElementById('footer'));     


