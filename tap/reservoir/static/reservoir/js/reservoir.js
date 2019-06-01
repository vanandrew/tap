/*
  Miscellaneous JS for reservoir
*/

// declare global varaibles
var filetable;

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

// function for exporting file table as txt
function exportList() {
  let row_list = filetable.rows({'selected': true}).data()
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
