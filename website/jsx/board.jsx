var boardInterval = null;

var Board = React.createClass({
	render: function() {
		return (
			<div className="board col-sm-4" onClick={this.viewBoard.bind(this, this.props)}>
				<h3 className="boardTitle">{ this.props.Title }</h3>
			</div>
		);
	},

	viewBoard: function (board,event)
	{
		console.log('viewBoard clicked');
		if (boardInterval != null)
		{
			clearInterval(boardInterval);
		}

		React.render(
			<Lists BoardId={ this.props.Id } />,
			document.getElementById('content')			
		);		
	}
});

var Boards = React.createClass({
	render: function() {
		var boardNodes = this.props.data.map(function (board) {
			return (
				<Board Title={ board.Title } >
				</Board>
			);
		});

		return (
			<div className="row">
				{ boardNodes }
			</div>
		);
	}
});

var BoardList = React.createClass({
	getInitialState: function() {
		return { data: [] };
	},

	loadBoardsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data){
				this.setState({ data: data });
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function() {
		this.loadBoardsFromServer();
		boardInterval = setInterval(this.loadBoardsFromServer, this.props.pollInterval);
	},

	render: function ()
	{
		return (
			<div className="container">
				<Boards data = { this.state.data } />
			</div>
		);
	}
});

React.render(
  <BoardList url="boards" pollInterval={2000} />,
  document.getElementById('content')
);
