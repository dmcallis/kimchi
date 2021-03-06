var NewListForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "N/A"; // TODO: Value from current session
        var title = this.refs.title.getDOMNode().value.trim();
        if (!owner || !title) {
            return;
        }

		var onNewListSubmit = this.props.onNewListSubmit;
        var boardId = this.props.BoardId;
		var newListApiUrl = "boards/" + boardId + "/lists" + getUserIdQueryParam();

        $.ajax({
			type: "POST",
		    url: newListApiUrl,
		    dataType: "json",
			contentType:"application/json; charset=utf-8",
			data: JSON.stringify(
            {
                Title: title,
                BoardId: boardId
            }),
		    success: function(data){
                console.log(data);
                var newId = data.Key;

				// TODO: return all properties, sync with .../sampleJson/list.json
                onNewListSubmit(
                {
                    _key: newId, // TODO: Server GET returns '_key',
                    BoardId: boardId,
                    Owner: owner,
                    Title: title,
                    CreatedDate: new Date().toLocaleTimeString(),
                    ModifiedDate: new Date().toLocaleTimeString()
                });
		    },
		    error: function(xhr, status, err) {
		        console.error(newBoardApiUrl, status, err.toString());
		    }
		});

        this.refs.title.getDOMNode().value = "";
        return;
    },

    render: function() {
        return (
            <form className="newListForm navbar-form navbar-left" onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Add a list..." ref="title" />
                </div>
                <input type="submit" className="btn btn-primary" value="Add" />
            </form>
        )
    }
});

var List = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  loadItemsFromServer: function() {
    var apiUrl = "boards/" + this.props.BoardId + "/lists/" + this.props.Id + "/items" + getUserIdQueryParam();

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
      $("#alertNewDataForm").show("slow");
  },

  deleteList: function()
  {
	var listDeleteApiUrl = "/lists/" + this.props.Id + getUserIdQueryParam();
	var divId = "list_" + this.props.Id;
	$.ajax({
		url: listDeleteApiUrl,
		type: "DELETE",
		success: function(result){
			$itemElement = document.getElementById(divId);
			$itemElement.parentNode.removeChild($itemElement);
		}
	});
  },

  render: function() {
    var boardId = this.props.BoardId;
    var listUpdateApiUrl = "/boards/" + boardId + "/lists/" + this.props.Id + getUserIdQueryParam();
    $("#listTitle_edit_" + this.props.Id).editable({
        ajaxOptions: {
            type: "put",
            dataType: "json",
            contentType:"application/json; charset=utf-8"
        },
        placement: "bottom",
        validate: function(value) {
            if($.trim(value) == '') {
                return 'This field is required';
            }
        },
        params: function(params) {
            return JSON.stringify({
                Title: params.value,
                BoardId: boardId
            });
        }
    });

    var old = (
      <div className="list col-sm-4" id= { "list_" + this.props.Id}>
        <div className="listTitle" id={ "listTitle_" + this.props.Id }>
			<button className="btn btn-default btn-sm editable-cancel removelistbutton" onClick={this.deleteList.bind()} type="button">
				<i className="glyphicon glyphicon-remove"></i>
			</button>
            <h3>
                <a href="#" id={ "listTitle_edit_" + this.props.Id } data-type="text" data-pk={ this.props.Id } data-url={ listUpdateApiUrl } data-title="Enter new name for the list">
                    { this.props.Title }
                </a>
            </h3>
        </div>
		<Items data={ this.state.data } BoardId={ this.props.BoardId } />
        <NewItemForm onNewItemSubmit={ this.handleItemSubmit } BoardId={ this.props.BoardId } ListId={ this.props.Id } />
      </div>
    );

    return (
      <div className="list col-sm-4">
      <div className="panel panel-default" id={ "list_" + this.props.Id}>
        <div className="panel-heading" id={ "listTitle_" + this.props.Id }>
          <button className="btn btn-default btn-sm editable-cancel removelistbutton" onClick={this.deleteList.bind()} type="button">
            <i className="glyphicon glyphicon-remove"></i>
          </button>
          <h3 className="panel-title" id={ "listTitle_edit_" + this.props.Id } data-type="text" data-pk={ this.props.Id } data-url={ listUpdateApiUrl } data-title="Enter new name for the list">
            { this.props.Title }
          </h3>
        </div>
        <div className="panel-body">
          <Items data={ this.state.data } BoardId={ this.props.BoardId } ListId={ this.props.Id }/>
          <NewItemForm onNewItemSubmit={ this.handleItemSubmit } BoardId={ this.props.BoardId } ListId={ this.props.Id } />
        </div>
      </div>
      </div>
    );
  }
});

var Lists = React.createClass({
    render: function() {
        var boardId = this.props.BoardId
		var listNodes = this.props.data.map(function (list) {
			return (
				<List key={ list._key } Id={ list._key } BoardId={ boardId } Title={ list.Title } Owner={ list.Owner } />
			);
		});

		return (
			<div className="col row sortableLists connectedSortableLists">
				{ listNodes }
			</div>
		);
	},

	componentDidMount: function() {
		$( ".sortableLists" ).sortable({
			connectWith: ".connectedSortableLists"
		}).disableSelection();
	}
});
