"use strict";

// Helper Functions
function getObjectKey(obj) { return Object.keys(obj)[0] }
function addtoArray(array,value) { array.push(value); return array; }
function removefromArray(array,value) {
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
function inArray(array,value) {
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
  updateFilters(event) {
    this.props.updateFilters({[this.props.field]: event.target.getAttribute('value')});
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
                <span onClick={this.updateFilters}
                  style={{
                    cursor: "pointer",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none"}}
                  className={`badge ${this.selectClass({[this.props.field]: o})} mx-1`}
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
    this.setState(cycleOptions(this.state,option))
  }

  // render component
  render() {
    if (this.state.isLoaded) {
      return (
        <div className="offset-1 col-10 mt-4 mb-2">
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
