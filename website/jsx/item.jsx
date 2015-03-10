var Item = React.createClass({
  render: function() {
    return (
      <div className="item">
          <h2 className="itemContent">{ this.props.content }</h2>
          <h5 className="itemCreatedDate">{ this.props.createdDate }</h5>
      </div>
    );
  }
});

var ItemList = React.createClass({
  render: function() {
    var itemNodes = this.props.data.map(function (item) {
      return (
        <Item content={ item.Content } createdDate={ item.CreatedDate }>
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
    setInterval(this.loadItemsFromServer, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="list">
        <h1>Sample List</h1>
        <ItemList data = { this.state.data } />
      </div>
    );
  }
});

React.render(
  <List url="../sampleJson/item.json" pollInterval={2000} />,
  document.getElementById('content')
);
