function viewBoard(board)
{
	React.render(
		<Board Id={ board.Id } Title={ board.Title } />,
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
		console.log("rendering boards dropdown");
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
		console.log("load boards");
		if (!BoardsData)
		{
			$.ajax({
				url: this.props.url,
				dataType: 'json',
				success: function(data){
					this.setState({ data: data });
					BoardsData = data;
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
	}
});