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
			  <BoardDropdown url="boards"/>
	        </div>
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
	$(document).on("set-status-message", this.onSetStatusMessage);
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
  	this.setState ({statusMessage : e.message});
  }
});

function SetStatusMessage (messageText)
{
	var event = $.Event('set-status-message');
	event.message = messageText;
	$.event.trigger(event);
}

React.render(<KiNavbar />, document.getElementById('navbar')); 
React.render(<KiFooter />, document.getElementById('footer'));     


