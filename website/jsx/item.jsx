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
    var divId = this.props.ListId + "_" + this.props.Id; // TODO: Unique id?
    return (
      <div id = {divId} className="item">
          <h3 className="itemContent">{ this.props.Content }</h3>
          <h5 className="itemOwner">Owner { this.props.Owner }</h5>
          <h5 className="itemCreatedDate">Created { this.props.CreatedDate }</h5>
          <h5 className="itemCreatedDate">Modified { this.props.ModifiedDate }</h5>
      </div>
    );
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
