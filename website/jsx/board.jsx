var boardInterval = null;

var NewBoardForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "N/A"; // TODO: Value from current session
        var title = this.refs.title.getDOMNode().value.trim();
        if (!owner || !title) {
            return;
        }

        // TODO: return all properties, sync with .../sampleJson/board.json
        this.props.onNewBoardSubmit(
            {
                Owner: owner,
                Title: title,
                CreatedDate: new Date().toLocaleTimeString(),
                ModifiedDate: new Date().toLocaleTimeString()
            }
        );

        this.refs.title.getDOMNode().value = "";
        return;
    },

    render: function() {
        return (
            <form className="newBoardForm" onSubmit={ this.handleSubmit }>
                <input type="text" class="newBoardFormTitle" placeholder="Add a board..." ref="title" />
                <input type="submit" value="Add" />
            </form>
        );
  }
});

var Board = React.createClass({
	getInitialState: function() {
        return { data: [] };
    },

    componentDidMount: function() {
        this.loadListsFromServer();
    },

    loadListsFromServer: function() {
		var apiUrl = "boards/" + this.props.Id + "/lists"

		$.ajax({
		    url: apiUrl,
		    dataType: 'json',
		    success: function(data){
				this.setState({ data: data });
		    }.bind(this),
		    error: function(xhr, status, err) {
		        console.error(apiUrl, status, err.toString());
		    }.bind(this)
		});
	},

    handleListSubmit: function(list) {
        var lists = this.state.data;
        var newLists = lists.concat([list]);
        this.setState({data: newLists});

        // TODO: Send data to server
        $("#alertNewDataForm").show("slow");
    },

	render: function() {
		return (
			<div className="board">
				<div>
					<h1><strong>{ this.props.Title }</strong></h1>
				</div>
				<div>
					<Lists data={ this.state.data } />
					<NewListForm onNewListSubmit={ this.handleListSubmit } />
				</div>
			</div>
		);
	}
});

var BoardSummary = React.createClass({
	render: function() {
		return (
			<div className="boardSummary col-sm-4" onClick={this.viewBoard.bind(this, this.props)}>
				<h3 className="boardTitle">{ this.props.Title }</h3>
			</div>
		);
	},

	viewBoard: function (board,event)
	{
		if (boardInterval != null) 
 		{ 
 			clearInterval(boardInterval); 
 		} 

		React.render(
			<Board Id={ this.props.Id } Title={ this.props.Title } />,
			document.getElementById('content')
		);
	}
});

var Boards = React.createClass({
	render: function() {
		var boardNodes = this.props.data.map(function (board) {
			return (
				<BoardSummary key={ board.Id } Id={ board.Id } Title={ board.Title } />
			);
		});

		return (
			<div className="row">
				{ boardNodes }
			</div>
		);
	},	
});

var BoardList = React.createClass({
	getInitialState: function() {
		return { data: [] };
	},

	loadBoards: function() {
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
		//boardInterval = setInterval(this.loadBoards, this.props.pollInterval);
	},

	render: function ()
	{
		return (
			<div className="container">
				<Boards data = { this.state.data } />
				<NewBoardForm onNewBoardSubmit={ this.handleBoardSubmit } />
			</div>
		);
	},
	
	handleBoardSubmit: function(board) {
      var boards = this.state.data;
      var newBoards = boards.concat([board]);
      this.setState({data: newBoards});

      // TODO: Send data to server
      $("#alertNewDataForm").show("slow");
	}
});

React.render(
  <BoardList url="boards" pollInterval={2000} />,
  document.getElementById('content')
);
