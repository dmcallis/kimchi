var NewItemForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "N/A"; // TODO: Value from current session
        var content = this.refs.content.getDOMNode().value.trim();
        if (!owner || !content) {
            return;
        }

        // TODO: return all properties, sync with .../sampleJson/item.json
        this.props.onNewItemSubmit(
            {
                Owner: owner,
                Content: content,
                CreatedDate: new Date().toLocaleTimeString(),
                ModifiedDate: new Date().toLocaleTimeString()
            }
        );

        this.refs.content.getDOMNode().value = "";
        return;
    },

    render: function() {
        return (
            <form className="newItemForm" onSubmit={ this.handleSubmit }>
                <input type="text" class="newItemFormContent" placeholder="Type something..." ref="content" />
                <input type="submit" value="Add" />
            </form>
        );
  }
});

var Item = React.createClass({
    render: function() {
        // var displayBox = $("#itemContent_Display_" + this.props.ListId + "_" + this.props.Id);
        // var editBox = $("#itemContent_Edit_" + this.props.ListId + "_" + this.props.Id);
        // var editCancelButton = $("#itemContent_Edit_Cancel_" + this.props.ListId + "_" + this.props.Id);
        //
        // editBox.hide();
        //
        // displayBox.click(function() {
        //     displayBox.hide("slow");
        //     editBox.show("slow");
        // });
        //
        // editCancelButton.click(function () {
        //     editBox.hide("slow");
        //     displayBox.show("slow");
        // });

        var divId = this.getDivId();
        return (
          <div id = {divId} className="item">
			<button className="btn btn-default btn-sm editable-cancel removebutton" onClick={this.deleteItem.bind()} type="button">
				<i className="glyphicon glyphicon-remove"></i>
			</button>
            <div id={ "itemContent_" + this.props.ListId + "_" + this.props.Id }>
                <div id={ "itemContent_Display_" + this.props.ListId + "_" + this.props.Id }>
                    <h3 className="itemContent">{ this.props.Content }</h3>
                </div>
            </div>			
            <h5 className="itemOwner">Owner { this.props.Owner }</h5>
            <h5 className="itemCreatedDate">Created { this.props.CreatedDate }</h5>
            <h5 className="itemCreatedDate">Modified { this.props.ModifiedDate }</h5>
          </div>
        );
    },
	
	getDivId: function() {
		return "item_" + this.props.ListId + "_" + this.props.Id; // TODO: Unique id?
	},
	
	deleteItem: function (divId, itemId, listId)
	{
		$itemElement = document.getElementById(this.getDivId());
		$itemElement.parentNode.removeChild($itemElement);
		//todo: sync with server
	}
});

var Items = React.createClass({
  render: function() {
    var itemNodes = this.props.data.map(function (item) {
      return (
        <Item key={ item.Id } Id={ item.Id } ListId={ item.ListId } Content={ item.Content } Owner={ item.Owner } CreatedDate={ item.CreatedDate } ModifiedDate={ item.ModifiedDate } />
      );
    });

    return (
      <div className="itemCollection sortable connectedSortable">
        { itemNodes }
      </div>
    );
  },

  componentDidMount: function() {
	$( ".sortable" ).sortable({
		connectWith: ".connectedSortable"
	}).disableSelection();
  }
});
