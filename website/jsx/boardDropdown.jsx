function viewBoard(board)
{
	document.getElementById('content').innerHTML = "";
	
	React.render(
		<Board Id={ board._key } Title={ board.Title } />,
		document.getElementById('content')
	);
}

function viewAllBoards()
{
	React.render(
		<BoardList url="boards" pollInterval={2000} />,
		document.getElementById('content')
	);
}

var BoardDropdown = React.createClass({

	getInitialState: function() {
		return { data: [] };
	},
	
	render: function () {
		var boards = this.state.data;
		return (
			<ul className="nav navbar-nav">	
				<li className="dropdown">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Boards <span className="caret"></span></a>
					<ul className="dropdown-menu" role="menu">
						<li><a href="#" onClick={viewAllBoards.bind(this)}>All boards</a></li>
						<li className="divider"></li>
						{boards.map(function(board) {
							return <li><a href="#" onClick={viewBoard.bind(this, board)}>{board.Title}</a></li>;
						})}						
					</ul>
				</li>
			</ul>
		);
	},	
	
	loadBoards: function() {
		if (!BoardsData)
		{
			$.ajax({
				url: this.props.url,
				dataType: 'json',
				success: function(data){
					BoardsData = data;
					this.setState({ data: BoardsData });
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
		}
		else
		{
			this.setState({ data: BoardsData });
		}
	},
	
	componentDidMount: function() {
		this.loadBoards();
		$(document).on("newBoardEvent", this.onNewBoard);
	},
	
	onNewBoard: function(event)
	{
		this.setState({ data: event.message });
	}
});