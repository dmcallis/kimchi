var NewItemForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "N/A"; // TODO: Value from current session
        var content = this.refs.content.getDOMNode().value.trim();
        if (!owner || !content) {
            return;
        }

        var onNewItemSubmit = this.props.onNewItemSubmit;
        var listId = this.props.ListId;
		var newItemApiUrl = "boards/" + this.props.BoardId + "/lists/" + listId + "/items" + getUserIdQueryParam();

        $.ajax({
			type: "POST",
		    url: newItemApiUrl,
		    dataType: "json",
			contentType:"application/json; charset=utf-8",
			data: JSON.stringify(
            {
                Content: content,
                ListId: listId
            }),
		    success: function(data){
                console.log(data);
                var newId = data.Key;

				// TODO: return all properties, sync with .../sampleJson/item.json
                onNewItemSubmit(
                {
                    _key: newId, // TODO: Server GET returns '_key'
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
        var boardId = this.props.BoardId;
        var listId = this.props.ListId;
        var itemUpdateApiUrl = "/boards/" + boardId + "/lists/" + listId + "/items/" + this.props.Id + getUserIdQueryParam();
        $("#itemContent_edit_" + this.getUniqueId()).editable({
            ajaxOptions: {
                type: "put",
                dataType: "json",
                contentType:"application/json; charset=utf-8"
            },
            mode: "popup",
            placement: "right",
            validate: function(value) {
			    if($.trim(value) == '') {
			        return 'This field is required';
			    }
			},
            params: function(params) {
                return JSON.stringify({
                    Content: params.value,
                    BoardId: boardId,
                    ListId: listId
                });
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
    var listId = this.props.ListId;

    var itemNodes = this.props.data.map(function (item) {
      return (
        <Item key={ item._key } Id={ item._key } BoardId={ boardId } ListId={ listId } Content={ item.Content } Owner={ item.Owner } CreatedDate={ item.CreatedDate } ModifiedDate={ item.ModifiedDate } />
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
			var listId = $(this)[0].attributes["data-listid"];
			var newOrderedElements = $(this).sortable('toArray');
			var itemOrderUpdateUrl = "/lists/" + listId.value + "/order/";
			$.ajax({
				url: itemOrderUpdateUrl,
				type: "PUT",
				dataType: "json",
				contentType:"application/json; charset=utf-8",
				data: JSON.stringify({ orderedItems: newOrderedElements }),
				success: function(result){
				},
				error: function (result){
					console.log('error updating item order');
				}
			});
		}
	}).disableSelection();
  }
});
