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

// Helper Functions
function getObjectKey(obj) { return Object.keys(obj)[0] } /* Grab first object key from array */
function addtoArray(array,value) { array.push(value); return array; } /* Add object to array */
function removefromArray(array,value) { /* Remove object from array */
  return array.filter((el) => {
      var el_key = getObjectKey(el);
      var value_key = getObjectKey(value);
      if (el_key === value_key) {
        if (el[el_key] === value[value_key]) {
          return false;
        }
      }
      return true;
    }
  );
}
function inArray(array,value) { /* Check if object in array */
  for (var i = 0; i < array.length; i++) {
    var array_key = getObjectKey(array[i]);
    var value_key = getObjectKey(value);
    if (array_key === value_key) {
      if (array[i][array_key] === value[value_key]) {
        return true;
      }
    }
  }
  return false;
}

// Create table
class Table extends React.Component{
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      isLoaded: false,
      include: [],
      exclude: []
    }

    // bind methods
    this.exportList = this.exportList.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.getState = this.getState.bind(this);
  }

  // Execute on creation of component
  componentDidMount() {
    // pass down props and getState
    var props = this.props;
    var getState = this.getState;
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
              // add fields to request
              d.fields = props.fields;

              // add filters to request
              d.include = Array.from(getState().include);
              d.exclude = Array.from(getState().exclude);

              // add subject to include if defined
              if (props.subject) {
                d.include.push({'subject__subject': props.subject});
              }
              return d;
            },
            'type': 'POST'
        },
        'columnDefs': [
          {
            'render': (data) => {
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

  // returns the state
  getState() {
    return this.state;
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

  // shared state for filters
  updateFilters(lists) {
    this.setState(lists, () => { this.state.table.ajax.reload(); });
  }

  // render the table
  render() {
    if (this.state.isLoaded) {
      return (
        <div className="row">
          {this.props.filter &&
          <Filter api_fields={this.props.filter_urls[0]}
            api_unique={this.props.filter_urls[1]} updateFilters={this.updateFilters} />}
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

// Create Options for filter
class Options extends React.Component{
  constructor(props) {
    super(props);

    // bind methods
    this.selectClass = this.selectClass.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
  }

  // choose class based on selected option
  selectClass(option) {
    // Declare constants
    const inactive = "badge-secondary";
    const include = "badge-success";
    const exclude = "badge-danger";

    // Choose class to display
    if ( inArray(this.props.filters.include,option) ) {
      return include;
    }
    else if ( inArray(this.props.filters.exclude,option) ) {
      return exclude;
    }
    else {
      return inactive;
    }
  }

  // update the filter selection
  updateFilters(value) {
    this.props.updateFilters({[this.props.field]: value});
  }

  // Render Options
  render() {
    try {
      return (
        <div className="container">
          <div className="jumbotron my-1 px-2 py-4">
            <h6 className="mx-1">Available Values:</h6>
            <p>
              {this.props.value.map((o)=>(
                <span onClick={() => this.updateFilters(o)}
                  style={{
                    cursor: "pointer",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none"}}
                  className={`badge ${this.selectClass({[this.props.field]: o})} mx-1 my-1`}
                  value={o} key={o}>{o}</span>
              ))}
            </p>
          </div>
          <div className="jumbotron my-1 px-2 py-4">
            <h6 className="mx-1">Include:</h6>
            <p>
              {this.props.filters.include.map((i)=>(
                <span className="badge badge-success mx-1"
                  key={`include_${i[getObjectKey(i)]}`}>{getObjectKey(i)} | {i[getObjectKey(i)]}</span>
              ))}
            </p>
          </div>
          <div className="jumbotron my-1 px-2 py-4">
            <h6 className="mx-1">Exclude:</h6>
            <p>
              {this.props.filters.exclude.map((e)=>(
                <span className="badge badge-danger mx-1"
                  key={`exclude_${e[getObjectKey(e)]}`}>{getObjectKey(e)} | {e[getObjectKey(e)]}</span>
              ))}
            </p>
          </div>
        </div>
      );
    }
    catch (error) {
      console.log(error);
      return null;
    }
  }
}

// Create a filter for the table
class Filter extends React.Component{
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      fields: null,
      isLoaded: false,
      selection: null,
      options: null,
      include: [],
      exclude: []
    }

    // bind methods
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
  }

  // Execute on creation of component
  componentDidMount() {
    // grab the available fields
    $.get(this.props.api_fields, (data) => {
      this.setState({
        fields: data.fields,
        selection: 'datatype',
      }, () => this.getOptions( () => this.setState({isLoaded: true}) ) );
    });
  }

  // load the uniques
  getOptions(callback) {
    $.get(`${this.props.api_unique}/${this.state.selection}`, (data) => {
      this.setState({options: data[this.state.selection]}, callback);
    });
  }

  // handle field selection
  handleChange(event) {
    this.setState({selection: event.target.value}, () => this.getOptions() );
  }

  // update filters
  updateFilters(option) {
    // cycle through inactive/include/exclude
    function cycleOptions(state,value) {
      if ( !inArray(state.include,value) && !inArray(state.exclude,value) ) {
        return {
          include: addtoArray(Array.from(state.include),value),
          exclude: state.exclude
        }
      }
      else if ( inArray(state.include,value) && !inArray(state.exclude,value) ) {
        return {
          include: removefromArray(Array.from(state.include),value),
          exclude: addtoArray(Array.from(state.exclude),value)
        }
      }
      else if ( !inArray(state.include,value) && inArray(state.exclude,value) )  {
        return {
          include: state.include,
          exclude: removefromArray(Array.from(state.exclude),value)
        }
      }
      else {
        console.log('We\'re not suppose to be here!')
      }
    }

    // Set state for filters
    this.setState(cycleOptions(this.state,option), () => {
      this.props.updateFilters({
        include: this.state.include,
        exclude: this.state.exclude
      });
    });
  }

  // render component
  render() {
    if (this.state.isLoaded) {
      return (
        <div className="offset-1 col-10 my-2">
          <div className="accordian">
            <div className="card">
              <div className="card-header">
                <button className="btn btn-link" data-toggle="collapse"
                  data-target="#filtercard">Filters</button>
              </div>
              <div className="collapse" id='filtercard'>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="fieldselector">Field Select</label>
                      <select value={this.state.selection} onChange={this.handleChange}
                        className="form-control" id="fieldselector">
                        {this.state.fields.map((f)=>(
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </form>
                  <Options field={this.state.selection} value={this.state.options}
                    filters={{include: this.state.include, exclude: this.state.exclude}}
                    updateFilters={this.updateFilters} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}
