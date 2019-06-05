"use strict";

// create message
function createmessage(msg) {
  $('.alert').alert('close')
  $('#messagelog').append(
    '<div class="alert alert-info alert-dismissible fade show" role="alert">' +
      msg +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
        <span aria-hidden="true">&times;</span> \
      </button> \
    </div>'
  )
}

// function for copying path to clipboard
function copyPath(path) {
  const el = document.createElement('textarea');
  el.value = path;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  createmessage('File path copied to clipboard.');
}

// Create table
class Table extends React.Component{
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      isLoaded: false
    }

    // bind methods
    this.exportList = this.exportList.bind(this);
  }

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
              if (props.fields[0] == 'Filename') {
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
              if (props.fields[0] == 'Filename') {
                return "<button type=button class='btn btn-primary' data-path='" + data + "' onclick=copyPath('" + data + "')>Copy Path</button>";
              }
              else {
                return "<a href='subject/" + data + "' target='_blank'>" + data + "</a>";
              }
            },
            'targets': +(props.fields[0] == 'Filename'),
            'orderable': (props.fields[0] != 'Filename')
          }
        ],
        'select': props.select,
      });
      // Add buttons
      if (props.buttons) {
        new $.fn.dataTable.Buttons(table, {'buttons': ['selectAll','selectNone']});
        table.buttons().container().appendTo('#buttons');
      }
      // add table to state
      this.setState({table: table});
    });
  }

  // function for exporting file table as txt
  exportList() {
    let row_list = this.state.table.rows({'selected': true}).data()
    if (row_list.length != 0) {
      let txtContent = "data:text/plain;charset=utf-8,";
      for (let i=0; i<row_list.length; i++) {
        txtContent += row_list[i][1] + "\r\n";
      }
      var encodedUri = encodeURI(txtContent);
      const el = document.createElement('a');
      el.setAttribute("href", encodedUri);
      el.setAttribute("download", "list.txt");
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      createmessage('Exported list.');
    }
  }

  // render the table
  render() {
    if (this.state.isLoaded) {
      return (
        <div className="row">
          {this.props.filter &&
          <Filter api_fields={this.props.filter_urls[0]}
            api_unique={this.props.filter_urls[1]} />}
          {this.props.buttons &&
          <div className="offset-1 col-10 my-2" id="buttons">
            <div className="btn-group mr-2">
              <button className="btn btn-primary" onClick={this.exportList} type="button" id='export'><span>Export Selected</span></button>
            </div>
          </div>}
          <div className="offset-1 col-10 mt-2 mb-4" >
            <table id={this.props.table_id}
              className="table table-striped table-bordered" style={{width: "100%"}}>
              <thead>
                <tr>
                  {this.props.fields.map((f) => (
                    <th key={f}>{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
    else {
      return null;
    }
  }
}
