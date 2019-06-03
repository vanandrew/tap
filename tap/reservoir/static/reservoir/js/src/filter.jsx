"use strict";

// Create Options for filter
class Options extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h4>
        {this.props.value.map((o)=>(
          <span className="badge badge-secondary mx-1" key={o}>{o}</span>
        ))}
      </h4>
    );
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
      options: null
    }

    // bind methods
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  // Execute on creation of component
  componentDidMount() {
    // grab the available fields
    $.get(this.props.api_fields, (data) => {
      this.setState({
        fields: data.fields,
        selection: 'datatype'
      }, () => this.getOptions( () => this.setState({isLoaded: true}) ) );
    });
  }

  // load the uniques
  getOptions(callback) {
    console.log(this.state.selection)
    $.get(`${this.props.api_unique}/${this.state.selection}`, (data) => {
      this.setState({options: data[this.state.selection]}, callback);
    });
  }

  // handle field selection
  handleChange(event) {
    this.setState({selection: event.target.value}, () => this.getOptions() );
  }

  // render component
  render() {
    if (this.state.isLoaded) {
      return (
        <div className="offset-1 col-10 mt-4 mb-1">
          <div className="accordian">
            <div className="card">
              <div className="card-header">
                <button className="btn btn-link" data-toggle="collapse" data-target="#filtercard">Filters</button>
              </div>
              <div className="collapse" id='filtercard'>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="fieldselector">Field Select</label>
                      <select value={this.state.selection} onChange={this.handleChange} className="form-control" id="fieldselector">
                        {this.state.fields.map((f)=>(
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </form>
                  <Options value={this.state.options} />
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
