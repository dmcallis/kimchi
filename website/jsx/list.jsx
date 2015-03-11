var List = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  loadItemsFromServer: function() {
    // TODO: Call API with listId and boardId
    var apiUrl = "sampleJson/item.json";

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

  componentDidMount: function() {
    this.loadItemsFromServer();
    //setInterval(this.loadItemsFromServer, this.props.pollInterval);
  },

  handleItemSubmit: function(item) {
      var items = this.state.data;
      var newItems = items.concat([item]);
      this.setState({data: newItems});

      // TODO: Send data to server
      $("#alertNewItemForm").show("slow");
  },

  allowDrop: function(ev) {
     ev.preventDefault();
  },

  drop: function(ev) {
     ev.preventDefault();
     var data = ev.dataTransfer.getData("text");
     ev.target.appendChild(document.getElementById(data));
  },

  render: function() {
    return (
      <div className="list col-sm-4" onDrop={this.drop} onDragover={this.allowDrop}>
        <h1>{ this.props.Title }</h1>
		<Items data = { this.state.data } />
        <NewItemForm onNewItemSubmit={ this.handleItemSubmit } />
      </div>
    );
  }
});

var Lists = React.createClass({
    getInitialState: function() {
        return { data: [] };
    },

    componentDidMount: function() {
        this.loadListsFromServer();
    },

    loadListsFromServer: function() {
		// TODO: Call API with listId
		var apiUrl = "sampleJson/list.json";

		$.ajax({
		    url: apiUrl,
		    dataType: 'json',
		    success: function(data){
				this.setState({ data: data});
		    }.bind(this),
		    error: function(xhr, status, err) {
		        console.error(apiUrl, status, err.toString());
		    }.bind(this)
		});
	},

    render: function() {
		var listNodes = this.state.data.map(function (list) {
			return (
				<List Id={ list.Id } BoardId={ list.BoardId } Title={ list.Title } Owner={ list.Owner } />
			);
		});

		return (
			<div className="col row">
				{ listNodes }
			</div>
		);
	}
});
