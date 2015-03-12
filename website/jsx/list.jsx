var NewListForm = React.createClass({
    render: function() {
        var boardId = this.props.BoardId;
        var newListApiUrl = "boards/" + boardId + "/lists"; // TODO: FBID
        var onNewListSubmit = this.props.onNewListSubmit;

        $("#newListTitle_" + boardId).editable({
            mode: "inline",
            validate: function(v) {
                if(!v) return 'Required field!';
            }
        });

        $("#newListSaveBtn_" + boardId).click(function() {
            $("#newListTitle_" + boardId).editable('submit', {
                url: newListApiUrl,
                success: function(data, config) {
                    // TODO: Check id returned from the API

                    $(this).removeClass("editable-unsaved");

                    var owner = "N/A"; // TODO: Value from current session
                    var title = $("#newListTitle_" + boardId).text();
                    if (!owner || !title) {
                        return;
                    }

                    // TODO: return all properties, sync with .../sampleJson/list.json
                    onNewListSubmit(
                    {
                        // TODO: Id, key
                        Owner: owner,
                        Title: title,
                        CreatedDate: new Date().toLocaleTimeString(),
                        ModifiedDate: new Date().toLocaleTimeString()
                    });

                    var title = $("#newListTitle_" + boardId).text("Enter new list name");
                },
                error: function(errors) {
                    // TODO: Display error status
                    console.log(errors);
                }
            });
        });

        return (
            <div className="newListForm">
                <a href="#" id={ "newListTitle_" + boardId } className="editable editable-click editable-empty" data-type="text" data-name="Title" ref="title" data-original-title="Enter new name for list">Enter new list name</a>
                <div>
                    <button id={ "newListSaveBtn_" + boardId } className="btn btn-primary">Add new list</button>
                </div>
            </div>
        );
  }
});

var List = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  loadItemsFromServer: function() {
    var apiUrl = "boards/" + this.props.BoardId + "/lists/" + this.props.Id + "/items";

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

  render: function() {
    var listUpdateApiUrl = "/boards/" + this.props.BoardId + "/lists/" + this.props.Id;
    $("#listTitle_edit_" + this.props.Id).editable({
        ajaxOptions: {
            type: "put"
        },
        placement: "right",
        validate: function(value) {
            if($.trim(value) == '') {
                return 'This field is required';
            }
        },
        params: function(params) {
            params.Title = params.value;
            return params;
        }
    });

    return (
      <div className="list col-sm-4">
        <div className="listTitle" id={ "listTitle_" + this.props.Id }>
            <h3>
                <a href="#" id={ "listTitle_edit_" + this.props.Id } data-type="text" data-pk={ this.props.Id } data-url={ listUpdateApiUrl } data-title="Enter new name for the list">
                    { this.props.Title }
                </a>
            </h3>
        </div>
		<Items data={ this.state.data } BoardId={ this.props.BoardId } />
        <NewItemForm onNewItemSubmit={ this.handleItemSubmit } />
      </div>
    );
  }
});

var Lists = React.createClass({
    render: function() {
		var listNodes = this.props.data.map(function (list) {
			return (
				<List key={ list.Id } Id={ list.Id } BoardId={ list.BoardId } Title={ list.Title } Owner={ list.Owner } />
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
