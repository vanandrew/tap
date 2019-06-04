"use strict";

// Create table

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    _classCallCheck(this, Table);

    // initialize state
    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.state = {
      isLoaded: false
    };
    return _this;
  }

  //TODO This is bad code... Refactor
  // Execute on creation of component


  _createClass(Table, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // pass down props
      var props = this.props;
      this.setState({ isLoaded: true }, function () {
        var table = $('#' + props.table_id).DataTable({
          'processing': true,
          'serverSide': true,
          'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
          'ajax': {
            'url': props.table_url,
            'data': function data(d) {
              if (props.tabletype == 'files') {
                d.tabletype = 'files';
                if (props.subject) {
                  d.search.value = props.subject;
                }
              } else {
                d.tabletype = 'subjects';
              }
              return d;
            },
            'type': 'POST'
          },
          'columnDefs': [{
            'render': function render(data, type, row) {
              if (props.tabletype == 'files') {
                return "<button type=button class='btn btn-primary' data-path='" + data + "' onclick=copyPath('" + data + "')>Copy Path</button>";
              } else {
                return "<a href='subject/" + data + "' target='_blank'>" + data + "</a>";
              }
            },
            'targets': +(props.tabletype == 'files'),
            'orderable': props.tabletype != 'files'
          }],
          'select': props.tabletype == 'files'
        });
        if (props.tabletype == 'files') {
          new $.fn.dataTable.Buttons(table, { 'buttons': ['selectAll', 'selectNone'] });
          table.buttons().container().appendTo('#buttons');
        }
      });
    }

    // render the table

  }, {
    key: 'render',
    value: function render() {
      if (this.state.isLoaded) {
        return React.createElement(
          'table',
          { id: this.props.table_id, className: 'table table-striped table-bordered', style: { width: "100%" } },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              this.props.col1 != 'null' && React.createElement(
                'th',
                null,
                this.props.col1
              ),
              this.props.col2 != 'null' && React.createElement(
                'th',
                null,
                this.props.col2
              )
            )
          ),
          React.createElement('tbody', null)
        );
      } else {
        return null;
      }
    }
  }]);

  return Table;
}(React.Component);