var NewListForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "N/A"; // TODO: Value from current session
        var title = this.refs.title.getDOMNode().value.trim();
        if (!owner || !title) {
            return;
        }

        // TODO: return all properties, sync with .../sampleJson/list.json
        this.props.onNewListSubmit(
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
            <form className="newListForm" onSubmit={ this.handleSubmit }>
                <input type="text" class="newListFormTitle" placeholder="Add a list..." ref="title" />
                <input type="submit" value="Add" />
            </form>
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
    var displayBox = $("#listTitle_Display_" + this.props.Id);
    var editBox = $("#listTitle_Edit_" + this.props.Id);
    var editCancelButton = $("#listTitle_Edit_Cancel_" + this.props.Id);

    displayBox.show();
    editBox.hide();

    displayBox.click(function() {
        displayBox.hide("");
        editBox.show("slow");
    });

    editCancelButton.click(function () {
        editBox.hide("");
        displayBox.show("slow");
    });

    return (
      <div className="list col-sm-4">
        <div className="listTitle" id={ "listTitle_" + this.props.Id }>
            <div id={ "listTitle_Display_" + this.props.Id }>
                <h1>{ this.props.Title }</h1>
            </div>
            <div id={ "listTitle_Edit_" + this.props.Id }>
                <input type="text" value={ this.props.Title }></input>
                <input type="button" id={ "listTitle_Edit_Cancel_" + this.props.Id } value="X" />
                <input type="submit" value="Save" />
            </div>
        </div>
		<Items data = { this.state.data } />
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
