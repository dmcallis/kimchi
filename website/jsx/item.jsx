var NewItemForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = "yongjkim"; // TODO: Value from current session
        var content = this.refs.content.getDOMNode().value.trim();
        if (!owner || !content) {
            return;
        }

        // TODO: return all properties, sync with .../sampleJson/item.json
        this.props.onNewItemSubmit(
            {
                Owner: "N/A",
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
    return (
      <div className="item">
          <h3 className="itemContent">{ this.props.content }</h3>
          <h5 className="itemOwner">Owner { this.props.owner }</h5>
          <h5 className="itemCreatedDate">Created { this.props.createdDate }</h5>
          <h5 className="itemCreatedDate">Modified { this.props.modifiedDate }</h5>
      </div>
    );
  }
});

var ItemList = React.createClass({
  render: function() {
    var itemNodes = this.props.data.map(function (item) {
      return (
        <Item content={ item.Content } owner={ item.Owner } createdDate={ item.CreatedDate } modifiedDate={ item.ModifiedDate }>
        </Item>
      );
    });

    return (
      <div className="itemList">
        { itemNodes }
      </div>
    );
  }
});

var List = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  loadItemsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data){
        this.setState({ data: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
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

  render: function() {
    return (
      <div className="list">
        <h1>Sample List</h1>
        <ItemList data = { this.state.data } />
        <NewItemForm onNewItemSubmit={ this.handleItemSubmit } />
      </div>
    );
  }
});

React.render(
  <List url="sampleJson/item.json" pollInterval={2000} />,
  document.getElementById('content')
);
