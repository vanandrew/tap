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

  // Execute on creation of component
  componentDidMount() {
    this.setState({isLoaded: true},() => {
      let filetable = $(`#${this.props.table_id}`).DataTable({
        'processing': true,
        'serverSide': true,
        'lengthMenu': [
          [10, 25, 50, -1],
          [10, 25, 50, "All"]
        ],
        'ajax': {
            'url': this.props.table_url,
            'data': (d)=>{
              d.tabletype = 'files';
            },
            'type': 'POST'
        },
        'columnDefs': [
          {
            'render': function(data,type,row) {
              return "<button type=button class='btn btn-primary' data-path='" + data + "' onclick=copyPath('" + data + "')>Copy Path</button>";
            },
            'targets': 1,
            'orderable': false
          }
        ],
        'select': true,
      });
      new $.fn.dataTable.Buttons(filetable, {'buttons': ['selectAll','selectNone']});
      filetable.buttons().container().appendTo('#buttons');
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
