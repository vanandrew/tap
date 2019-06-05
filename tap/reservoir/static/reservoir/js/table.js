"use strict";

// create message

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createmessage(msg) {
  $('.alert').alert('close');
  $('#messagelog').append('<div class="alert alert-info alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
        <span aria-hidden="true">&times;</span> \
      </button> \
    </div>');
}

// function for copying path to clipboard
function copyPath(path) {
  var el = document.createElement('textarea');
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
function getObjectKey(obj) {
  return Object.keys(obj)[0];
} /* Grab first object key from array */
function addtoArray(array, value) {
  array.push(value);return array;
} /* Add object to array */
function removefromArray(array, value) {
  /* Remove object from array */
  return array.filter(function (el) {
    var el_key = getObjectKey(el);
    var value_key = getObjectKey(value);
    if (el_key === value_key) {
      if (el[el_key] === value[value_key]) {
        return false;
      }
    }
    return true;
  });
}
function inArray(array, value) {
  /* Check if object in array */
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

var Table = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    _classCallCheck(this, Table);

    // initialize state
    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.state = {
      isLoaded: false,
      include: [],
      exclude: []

      // bind methods
    };_this.exportList = _this.exportList.bind(_this);
    _this.updateFilters = _this.updateFilters.bind(_this);
    _this.getState = _this.getState.bind(_this);
    return _this;
  }

  // Execute on creation of component


  _createClass(Table, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // pass down props and getState
      var props = this.props;
      var getState = this.getState;
      this.setState({ isLoaded: true }, function () {
        var table = $('#' + props.table_id).DataTable({
          'processing': true,
          'serverSide': true,
          'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
          'ajax': {
            'url': props.table_url,
            'data': function data(d) {
              // add fields to request
              d.fields = props.fields;

              // add filters to request
              d.include = Array.from(getState().include);
              d.exclude = Array.from(getState().exclude);

              // add subject to include if defined
              if (props.subject) {
                d.include.push({ 'subject__subject': props.subject });
              }
              return d;
            },
            'type': 'POST'
          },
          'columnDefs': [{
            'render': function render(data) {
              if (props.fields[0] == 'Filename') {
                return "<button type=button class='btn btn-primary' data-path='" + data + "' onclick=copyPath('" + data + "')>Copy Path</button>";
              } else {
                return "<a href='subject/" + data + "' target='_blank'>" + data + "</a>";
              }
            },
            'targets': +(props.fields[0] == 'Filename'),
            'orderable': props.fields[0] != 'Filename'
          }],
          'select': props.select
        });
        // Add buttons
        if (props.buttons) {
          new $.fn.dataTable.Buttons(table, { 'buttons': ['selectAll', 'selectNone'] });
          table.buttons().container().appendTo('#buttons');
        }
        // add table to state
        _this2.setState({ table: table });
      });
    }

    // returns the state

  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }

    // function for exporting file table as txt

  }, {
    key: 'exportList',
    value: function exportList() {
      var row_list = this.state.table.rows({ 'selected': true }).data();
      if (row_list.length != 0) {
        var txtContent = "data:text/plain;charset=utf-8,";
        for (var i = 0; i < row_list.length; i++) {
          txtContent += row_list[i][1] + "\r\n";
        }
        var encodedUri = encodeURI(txtContent);
        var el = document.createElement('a');
        el.setAttribute("href", encodedUri);
        el.setAttribute("download", "list.txt");
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
        createmessage('Exported list.');
      }
    }

    // shared state for filters

  }, {
    key: 'updateFilters',
    value: function updateFilters(lists) {
      var _this3 = this;

      this.setState(lists, function () {
        _this3.state.table.ajax.reload();
      });
    }

    // render the table

  }, {
    key: 'render',
    value: function render() {
      if (this.state.isLoaded) {
        return React.createElement(
          'div',
          { className: 'row' },
          this.props.filter && React.createElement(Filter, { api_fields: this.props.filter_urls[0],
            api_unique: this.props.filter_urls[1], updateFilters: this.updateFilters }),
          this.props.buttons && React.createElement(
            'div',
            { className: 'offset-1 col-10 my-2', id: 'buttons' },
            React.createElement(
              'div',
              { className: 'btn-group mr-2' },
              React.createElement(
                'button',
                { className: 'btn btn-primary', onClick: this.exportList, type: 'button', id: 'export' },
                React.createElement(
                  'span',
                  null,
                  'Export Selected'
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'offset-1 col-10 mt-2 mb-4' },
            React.createElement(
              'table',
              { id: this.props.table_id,
                className: 'table table-striped table-bordered', style: { width: "100%" } },
              React.createElement(
                'thead',
                null,
                React.createElement(
                  'tr',
                  null,
                  this.props.fields.map(function (f) {
                    return React.createElement(
                      'th',
                      { key: f },
                      f
                    );
                  })
                )
              ),
              React.createElement('tbody', null)
            )
          )
        );
      } else {
        return null;
      }
    }
  }]);

  return Table;
}(React.Component);

// Create Options for filter


var Options = function (_React$Component2) {
  _inherits(Options, _React$Component2);

  function Options(props) {
    _classCallCheck(this, Options);

    // bind methods
    var _this4 = _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).call(this, props));

    _this4.selectClass = _this4.selectClass.bind(_this4);
    _this4.updateFilters = _this4.updateFilters.bind(_this4);
    return _this4;
  }

  // choose class based on selected option


  _createClass(Options, [{
    key: 'selectClass',
    value: function selectClass(option) {
      // Declare constants
      var inactive = "badge-secondary";
      var include = "badge-success";
      var exclude = "badge-danger";

      // Choose class to display
      if (inArray(this.props.filters.include, option)) {
        return include;
      } else if (inArray(this.props.filters.exclude, option)) {
        return exclude;
      } else {
        return inactive;
      }
    }

    // update the filter selection

  }, {
    key: 'updateFilters',
    value: function updateFilters(value) {
      this.props.updateFilters(_defineProperty({}, this.props.field, value));
    }

    // Render Options

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      try {
        return React.createElement(
          'div',
          { className: 'container' },
          React.createElement(
            'div',
            { className: 'jumbotron my-1 px-2 py-4' },
            React.createElement(
              'h6',
              { className: 'mx-1' },
              'Available Values:'
            ),
            React.createElement(
              'p',
              null,
              this.props.value.map(function (o) {
                return React.createElement(
                  'span',
                  { onClick: function onClick() {
                      return _this5.updateFilters(o);
                    },
                    style: {
                      cursor: "pointer",
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                      userSelect: "none" },
                    className: 'badge ' + _this5.selectClass(_defineProperty({}, _this5.props.field, o)) + ' mx-1 my-1',
                    value: o, key: o },
                  o
                );
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'jumbotron my-1 px-2 py-4' },
            React.createElement(
              'h6',
              { className: 'mx-1' },
              'Include:'
            ),
            React.createElement(
              'p',
              null,
              this.props.filters.include.map(function (i) {
                return React.createElement(
                  'span',
                  { className: 'badge badge-success mx-1',
                    key: 'include_' + i[getObjectKey(i)] },
                  getObjectKey(i),
                  ' | ',
                  i[getObjectKey(i)]
                );
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'jumbotron my-1 px-2 py-4' },
            React.createElement(
              'h6',
              { className: 'mx-1' },
              'Exclude:'
            ),
            React.createElement(
              'p',
              null,
              this.props.filters.exclude.map(function (e) {
                return React.createElement(
                  'span',
                  { className: 'badge badge-danger mx-1',
                    key: 'exclude_' + e[getObjectKey(e)] },
                  getObjectKey(e),
                  ' | ',
                  e[getObjectKey(e)]
                );
              })
            )
          )
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  }]);

  return Options;
}(React.Component);

// Create a filter for the table


var Filter = function (_React$Component3) {
  _inherits(Filter, _React$Component3);

  function Filter(props) {
    _classCallCheck(this, Filter);

    // initialize state
    var _this6 = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

    _this6.state = {
      fields: null,
      isLoaded: false,
      selection: null,
      options: null,
      include: [],
      exclude: []

      // bind methods
    };_this6.handleChange = _this6.handleChange.bind(_this6);
    _this6.getOptions = _this6.getOptions.bind(_this6);
    _this6.updateFilters = _this6.updateFilters.bind(_this6);
    return _this6;
  }

  // Execute on creation of component


  _createClass(Filter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this7 = this;

      // grab the available fields
      $.get(this.props.api_fields, function (data) {
        _this7.setState({
          fields: data.fields,
          selection: 'datatype'
        }, function () {
          return _this7.getOptions(function () {
            return _this7.setState({ isLoaded: true });
          });
        });
      });
    }

    // load the uniques

  }, {
    key: 'getOptions',
    value: function getOptions(callback) {
      var _this8 = this;

      $.get(this.props.api_unique + '/' + this.state.selection, function (data) {
        _this8.setState({ options: data[_this8.state.selection] }, callback);
      });
    }

    // handle field selection

  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var _this9 = this;

      this.setState({ selection: event.target.value }, function () {
        return _this9.getOptions();
      });
    }

    // update filters

  }, {
    key: 'updateFilters',
    value: function updateFilters(option) {
      var _this10 = this;

      // cycle through inactive/include/exclude
      function cycleOptions(state, value) {
        if (!inArray(state.include, value) && !inArray(state.exclude, value)) {
          return {
            include: addtoArray(Array.from(state.include), value),
            exclude: state.exclude
          };
        } else if (inArray(state.include, value) && !inArray(state.exclude, value)) {
          return {
            include: removefromArray(Array.from(state.include), value),
            exclude: addtoArray(Array.from(state.exclude), value)
          };
        } else if (!inArray(state.include, value) && inArray(state.exclude, value)) {
          return {
            include: state.include,
            exclude: removefromArray(Array.from(state.exclude), value)
          };
        } else {
          console.log('We\'re not suppose to be here!');
        }
      }

      // Set state for filters
      this.setState(cycleOptions(this.state, option), function () {
        _this10.props.updateFilters({
          include: _this10.state.include,
          exclude: _this10.state.exclude
        });
      });
    }

    // render component

  }, {
    key: 'render',
    value: function render() {
      if (this.state.isLoaded) {
        return React.createElement(
          'div',
          { className: 'offset-1 col-10 my-2' },
          React.createElement(
            'div',
            { className: 'accordian' },
            React.createElement(
              'div',
              { className: 'card' },
              React.createElement(
                'div',
                { className: 'card-header' },
                React.createElement(
                  'button',
                  { className: 'btn btn-link', 'data-toggle': 'collapse',
                    'data-target': '#filtercard' },
                  'Filters'
                )
              ),
              React.createElement(
                'div',
                { className: 'collapse', id: 'filtercard' },
                React.createElement(
                  'div',
                  { className: 'card-body' },
                  React.createElement(
                    'form',
                    null,
                    React.createElement(
                      'div',
                      { className: 'form-group' },
                      React.createElement(
                        'label',
                        { htmlFor: 'fieldselector' },
                        'Field Select'
                      ),
                      React.createElement(
                        'select',
                        { value: this.state.selection, onChange: this.handleChange,
                          className: 'form-control', id: 'fieldselector' },
                        this.state.fields.map(function (f) {
                          return React.createElement(
                            'option',
                            { key: f, value: f },
                            f
                          );
                        })
                      )
                    )
                  ),
                  React.createElement(Options, { field: this.state.selection, value: this.state.options,
                    filters: { include: this.state.include, exclude: this.state.exclude },
                    updateFilters: this.updateFilters })
                )
              )
            )
          )
        );
      } else {
        return null;
      }
    }
  }]);

  return Filter;
}(React.Component);