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
        <Items data = { this.state.data } />
        <NewItemForm onNewItemSubmit={ this.handleItemSubmit } />
      </div>
    );
  }
});
