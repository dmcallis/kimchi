
var KiMain = React.createClass({
  render: function() {
    var infobarStyle = {display: "none"};

    return (
      <div>
        <KiNavbar />

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

        <KiFooter />
      </div>
    );
    
  }
});


function RenderMain() {
  var bodyElement = document.getElementById('body');
  bodyElement.style.paddingTop = "70px";
  bodyElement.style.paddingBottom= "60px";
  React.render(<KiMain />, document.getElementById('main'));

  React.render(
    <BoardList url="boards" pollInterval={2000} />,
    document.getElementById('content')
  );
}

RenderMain();
