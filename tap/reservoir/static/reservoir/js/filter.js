"use strict";

// Helper Functions

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getObjectKey(obj) {
  return Object.keys(obj)[0];
}
function addtoArray(array, value) {
  array.push(value);return array;
}
function removefromArray(array, value) {
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

var Options = function (_React$Component) {
  _inherits(Options, _React$Component);

  function Options(props) {
    _classCallCheck(this, Options);

    // bind methods
    var _this = _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).call(this, props));

    _this.selectClass = _this.selectClass.bind(_this);
    _this.updateFilters = _this.updateFilters.bind(_this);
    return _this;
  }

  // choose class based on selected option


  _createClass(Options, [{
    key: "selectClass",
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
    key: "updateFilters",
    value: function updateFilters(event) {
      this.props.updateFilters(_defineProperty({}, this.props.field, event.target.getAttribute('value')));
    }

    // Render Options

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      try {
        return React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "jumbotron my-1 px-2 py-4" },
            React.createElement(
              "h6",
              { className: "mx-1" },
              "Available Values:"
            ),
            React.createElement(
              "p",
              null,
              this.props.value.map(function (o) {
                return React.createElement(
                  "span",
                  { onClick: _this2.updateFilters,
                    style: {
                      cursor: "pointer",
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                      userSelect: "none" },
                    className: "badge " + _this2.selectClass(_defineProperty({}, _this2.props.field, o)) + " mx-1",
                    value: o, key: o },
                  o
                );
              })
            )
          ),
          React.createElement(
            "div",
            { className: "jumbotron my-1 px-2 py-4" },
            React.createElement(
              "h6",
              { className: "mx-1" },
              "Include:"
            ),
            React.createElement(
              "p",
              null,
              this.props.filters.include.map(function (i) {
                return React.createElement(
                  "span",
                  { className: "badge badge-success mx-1",
                    key: "include_" + i[getObjectKey(i)] },
                  getObjectKey(i),
                  " | ",
                  i[getObjectKey(i)]
                );
              })
            )
          ),
          React.createElement(
            "div",
            { className: "jumbotron my-1 px-2 py-4" },
            React.createElement(
              "h6",
              { className: "mx-1" },
              "Exclude:"
            ),
            React.createElement(
              "p",
              null,
              this.props.filters.exclude.map(function (e) {
                return React.createElement(
                  "span",
                  { className: "badge badge-danger mx-1",
                    key: "exclude_" + e[getObjectKey(e)] },
                  getObjectKey(e),
                  " | ",
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


var Filter = function (_React$Component2) {
  _inherits(Filter, _React$Component2);

  function Filter(props) {
    _classCallCheck(this, Filter);

    // initialize state
    var _this3 = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

    _this3.state = {
      fields: null,
      isLoaded: false,
      selection: null,
      options: null,
      include: [],
      exclude: []

      // bind methods
    };_this3.handleChange = _this3.handleChange.bind(_this3);
    _this3.getOptions = _this3.getOptions.bind(_this3);
    _this3.updateFilters = _this3.updateFilters.bind(_this3);
    return _this3;
  }

  // Execute on creation of component


  _createClass(Filter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      // grab the available fields
      $.get(this.props.api_fields, function (data) {
        _this4.setState({
          fields: data.fields,
          selection: 'datatype'
        }, function () {
          return _this4.getOptions(function () {
            return _this4.setState({ isLoaded: true });
          });
        });
      });
    }

    // load the uniques

  }, {
    key: "getOptions",
    value: function getOptions(callback) {
      var _this5 = this;

      $.get(this.props.api_unique + "/" + this.state.selection, function (data) {
        _this5.setState({ options: data[_this5.state.selection] }, callback);
      });
    }

    // handle field selection

  }, {
    key: "handleChange",
    value: function handleChange(event) {
      var _this6 = this;

      this.setState({ selection: event.target.value }, function () {
        return _this6.getOptions();
      });
    }

    // update filters

  }, {
    key: "updateFilters",
    value: function updateFilters(option) {
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
      this.setState(cycleOptions(this.state, option));
    }

    // render component

  }, {
    key: "render",
    value: function render() {
      if (this.state.isLoaded) {
        return React.createElement(
          "div",
          { className: "offset-1 col-10 mt-4 mb-2" },
          React.createElement(
            "div",
            { className: "accordian" },
            React.createElement(
              "div",
              { className: "card" },
              React.createElement(
                "div",
                { className: "card-header" },
                React.createElement(
                  "button",
                  { className: "btn btn-link", "data-toggle": "collapse",
                    "data-target": "#filtercard" },
                  "Filters"
                )
              ),
              React.createElement(
                "div",
                { className: "collapse", id: "filtercard" },
                React.createElement(
                  "div",
                  { className: "card-body" },
                  React.createElement(
                    "form",
                    null,
                    React.createElement(
                      "div",
                      { className: "form-group" },
                      React.createElement(
                        "label",
                        { htmlFor: "fieldselector" },
                        "Field Select"
                      ),
                      React.createElement(
                        "select",
                        { value: this.state.selection, onChange: this.handleChange,
                          className: "form-control", id: "fieldselector" },
                        this.state.fields.map(function (f) {
                          return React.createElement(
                            "option",
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