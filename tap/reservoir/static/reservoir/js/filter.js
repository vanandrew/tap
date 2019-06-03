"use strict";

// Create Options for filter

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Options = function (_React$Component) {
  _inherits(Options, _React$Component);

  function Options(props) {
    _classCallCheck(this, Options);

    return _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).call(this, props));
  }

  _createClass(Options, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "h4",
        null,
        this.props.value.map(function (o) {
          return React.createElement(
            "span",
            { className: "badge badge-secondary mx-1", key: o },
            o
          );
        })
      );
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
    var _this2 = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

    _this2.state = {
      fields: null,
      isLoaded: false,
      selection: null,
      options: null

      // bind methods
    };_this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.getOptions = _this2.getOptions.bind(_this2);
    return _this2;
  }

  // Execute on creation of component


  _createClass(Filter, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      // grab the available fields
      $.get(this.props.api_fields, function (data) {
        _this3.setState({
          fields: data.fields,
          selection: 'datatype'
        }, function () {
          return _this3.getOptions(function () {
            return _this3.setState({ isLoaded: true });
          });
        });
      });
    }

    // load the uniques

  }, {
    key: "getOptions",
    value: function getOptions(callback) {
      var _this4 = this;

      console.log(this.state.selection);
      $.get(this.props.api_unique + "/" + this.state.selection, function (data) {
        _this4.setState({ options: data[_this4.state.selection] }, callback);
      });
    }

    // handle field selection

  }, {
    key: "handleChange",
    value: function handleChange(event) {
      var _this5 = this;

      this.setState({ selection: event.target.value }, function () {
        return _this5.getOptions();
      });
    }

    // render component

  }, {
    key: "render",
    value: function render() {
      if (this.state.isLoaded) {
        return React.createElement(
          "div",
          { className: "offset-1 col-10 mt-4 mb-1" },
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
                  { className: "btn btn-link", "data-toggle": "collapse", "data-target": "#filtercard" },
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
                        { value: this.state.selection, onChange: this.handleChange, className: "form-control", id: "fieldselector" },
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
                  React.createElement(Options, { value: this.state.options })
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