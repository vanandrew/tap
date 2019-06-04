"use strict";

// Create table
class Table extends React.Component{
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      isLoaded: false
    }
  }

  //TODO This is bad code... Refactor
  // Execute on creation of component
  componentDidMount() {
    // pass down props
    var props = this.props;
    this.setState({isLoaded: true},() => {
      var table = $(`#${props.table_id}`).DataTable({
        'processing': true,
        'serverSide': true,
        'lengthMenu': [
          [10, 25, 50, -1],
          [10, 25, 50, "All"]
        ],
        'ajax': {
            'url': props.table_url,
            'data': (d) => {
              if (props.tabletype == 'files') {
                d.tabletype = 'files';
                if (props.subject) {
                  d.search.value = props.subject;
                }
              }
              else {
                d.tabletype = 'subjects';
              }
              return d;
            },
            'type': 'POST'
        },
        'columnDefs': [
          {
            'render': function(data,type,row) {
              if (props.tabletype == 'files') {
                return "<button type=button class='btn btn-primary' data-path='" + data + "' onclick=copyPath('" + data + "')>Copy Path</button>";
              }
              else {
                return "<a href='subject/" + data + "' target='_blank'>" + data + "</a>";
              }
            },
            'targets': +(props.tabletype == 'files'),
            'orderable': (props.tabletype != 'files')
          }
        ],
        'select': (props.tabletype == 'files'),
      });
      if (props.tabletype == 'files') {
        new $.fn.dataTable.Buttons(table, {'buttons': ['selectAll','selectNone']});
        table.buttons().container().appendTo('#buttons');
      }
    });
  }

  // render the table
  render() {
    if (this.state.isLoaded) {
      return (
        <table id={this.props.table_id} className="table table-striped table-bordered" style={{width: "100%"}}>
          <thead>
            <tr>
              {this.props.col1 != 'null' &&
                <th>{this.props.col1}</th>
              }
              {this.props.col2 != 'null' &&
                <th>{this.props.col2}</th>
              }
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      )
    }
    else {
      return null;
    }
  }
}
