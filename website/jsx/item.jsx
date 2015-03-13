var NewItemForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "N/A"; // TODO: Value from current session
        var content = this.refs.content.getDOMNode().value.trim();
        if (!owner || !content) {
            return;
        }

        var onNewItemSubmit = this.props.onNewItemSubmit;
		var newItemApiUrl = "boards/" + this.props.BoardId + "/lists/" + this.props.ListId + "/items" + getUserIdQueryParam();

        $.ajax({
			type: "POST",
		    url: newItemApiUrl,
		    dataType: "text",// "json", // TODO: extract id from json response
			data: JSON.stringify({ Content: content }),
		    success: function(data){
				// TODO: return all properties, sync with .../sampleJson/item.json
                onNewItemSubmit(
                {
                    Owner: owner,
                    Content: content,
                    CreatedDate: new Date().toLocaleTimeString(),
                    ModifiedDate: new Date().toLocaleTimeString()
                });
		    },
		    error: function(xhr, status, err) {
		        console.error(newBoardApiUrl, status, err.toString());
		    }
		});

        this.refs.content.getDOMNode().value = "";
        return;
    },

    render: function() {
        return (
            <form className="newListForm navbar-form navbar-left" onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Type something..." ref="content" />
                </div>
                <input type="submit" className="btn btn-default" value="Add" />
            </form>
        );
  }
});

var Item = React.createClass({
    render: function() {
        var itemUpdateApiUrl = "/boards/" + this.props.BoardId + "/lists/" + this.props.ListId + "/items/" + this.props.Id + getUserIdQueryParam();
        $("#itemContent_edit_" + this.getUniqueId()).editable({
            ajaxOptions: {
                type: "put"
            },
            mode: "popup",
            placement: "right",
            validate: function(value) {
			    if($.trim(value) == '') {
			        return 'This field is required';
			    }
			},
            params: function(params) {
                params.Content = params.value;
                return params;
            }
        });

        var divId = this.getDivId();

        return (
          <div id = {divId} className = "well">
			<button className="btn btn-default btn-sm editable-cancel removebutton" onClick={this.deleteItem.bind()} type="button">
				<i className="glyphicon glyphicon-remove"></i>
			</button>
            <div id={ "itemContent_" + this.getUniqueId() }>
            <h4 className="itemContent">
                <a href="#" id={ "itemContent_edit_" + this.getUniqueId() } data-type="textarea" data-pk={ this.props.Id } data-url={ itemUpdateApiUrl } data-title="Enter new text">
                    { this.props.Content }
                </a>
            </h4>
            </div>
            <h5 className="itemOwner">Owner { this.props.Owner }</h5>
            <h5 className="itemCreatedDate">Created { this.props.CreatedDate }</h5>
            <h5 className="itemCreatedDate">Modified { this.props.ModifiedDate }</h5>
          </div>
        );
    },

	getUniqueId: function() {
		return this.props.BoardId + "_" + this.props.ListId + "_" + this.props.Id;
	},

	getDivId: function(){
		return "item_" + this.getUniqueId();
	},

	deleteItem: function ()
	{
		var itemDeleteApiUrl = "/lists/" + this.props.ListId + "/items/" + this.props.Id + getUserIdQueryParam();
		var divId = this.getDivId();
		$.ajax({
			url: itemDeleteApiUrl,
			type: "DELETE",
			success: function(result){
				$itemElement = document.getElementById(divId);
				$itemElement.parentNode.removeChild($itemElement);
			}
		});
	}
});

var Items = React.createClass({
  render: function() {
    var boardId = this.props.BoardId;

    var itemNodes = this.props.data.map(function (item) {
      return (
        <Item key={ item.Id } Id={ item.Id } BoardId={ boardId } ListId={ item.ListId } Content={ item.Content } Owner={ item.Owner } CreatedDate={ item.CreatedDate } ModifiedDate={ item.ModifiedDate } />
      );
    });

    return (
      <div data-listid={this.props.ListId} className="itemCollection sortable connectedSortable">
        { itemNodes }
      </div>
    );
  },

  componentDidMount: function() {
	$( ".sortable" ).sortable({
		connectWith: ".connectedSortable",
		update: function( event, ui ) {
			var listid = $(this)[0].attributes["data-listid"];
			var newOrderedElements = $(this).sortable('toArray');
		}
	}).disableSelection();
  }
});
