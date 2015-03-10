var React;


var KimchiNavbar = React.createClass({
  render: function() {
    return (
	    <nav className="navbar navbar-default">
	      <div className="container-fluid">
	        <div className="navbar-header">
	          <a className="navbar-brand" href="#">Kimchi</a>
	        </div>
	        <div>
	          <ul className="nav navbar-nav">
	            <li className="active"><a href="#">Boards</a></li>
	          </ul>
	        </div>
	      </div>
	    </nav>
    );
  }
});


React.render(<KimchiNavbar />, document.getElementById('kimchi-navbar')); 
