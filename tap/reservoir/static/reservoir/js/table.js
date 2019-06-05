"use strict";

// create message

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

// Create table

var Table = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    _classCallCheck(this, Table);

    // initialize state
    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.state = {
      isLoaded: false

      // bind methods
    };_this.exportList = _this.exportList.bind(_this);
    return _this;
  }

  // Execute on creation of component


  _createClass(Table, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

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
              if (props.fields[0] == 'Filename') {
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

    // render the table

  }, {
    key: 'render',
    value: function render() {
      if (this.state.isLoaded) {
        return React.createElement(
          'div',
          { className: 'row' },
          this.props.filter && React.createElement(Filter, { api_fields: this.props.filter_urls[0],
            api_unique: this.props.filter_urls[1] }),
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