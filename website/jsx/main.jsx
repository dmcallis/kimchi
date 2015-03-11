
var infobarStyle = {display: "none"};

var KiMain = React.createClass({
  render: function() {
    return (
      <div className="container">
	      <div className="infobar">
	        <div className="alert alert-info" id="alertNewItemForm" style={infobarStyle}>
	            <a href="#" className="close" data-dismiss="alert">&times;</a>
	            <strong>TODO</strong> Store new item data into the database store.
	        </div>
	      </div>

        <div id="content">
        </div>
      </div>    	
    );
  }
});

React.render(<KiMain />, document.getElementById('main')); 