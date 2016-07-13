/**
 * Connect socket to server
 */
var socket = io.connect('http://localhost:3000');

/**
 * This function adds click handler to rows.
 * Switching between done/undone, and deleting rows
 */
var createClickHandler =
    function(row) {
        return function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            var cell = row.getElementsByTagName("input")[0];

            var hasClass = row.classList.contains('done');
            if (!target.classList.contains("fa-trash")) {
                if (hasClass) {
                    row.className = "";
                    socket.emit('update', { id: cell.value, checked: 0});
                } else {
                    row.className += "done";
                    socket.emit('update', { id: cell.value, checked: 1});
                }
            }

            if (target.type !== "checkbox" && !target.classList.contains("fa-trash")) {
                (cell.checked) ? cell.checked = false: cell.checked = true;
            }

            if (target.classList.contains("fa-trash")) {
                socket.emit('delete', {id: cell.value});
                document.getElementById("to-do-list").deleteRow(row.rowIndex);
            }
        };
    };

/**
 * This function create new row
 */

function createRow() {
    var table = document.getElementById("to-do-list");
    var rows = table.getElementsByTagName("tr");
    var value = document.getElementById("input-item").value;

    /* Simple validation */
    if (value.length < 1 ) {
        document.getElementById("error").style.display = "initial";
    } else {
        socket.emit('save', {value: value});
        document.getElementById("error").style.display = "none";
    }
}

/**
 * Trigger a button click (add new row) on the Enter key
 */
document.getElementById("input-item")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("addRow").click();
    }
});

/**
 * This function recive data from DB add task to table.
 */

socket.on('add', function(data) {

    var table = document.getElementById("to-do-list");
    var rows = table.getElementsByTagName("tr");
    var value = document.getElementById("input-item").value;

    var newRow = table.insertRow(rows.length - 1);

    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);

    newCell1.innerHTML = '<input type="checkbox" name="position" value="'+ data.value.id +'">';
    newCell1.className += "column-a";

    newCell2.innerHTML = "";
    newCell2.className += "column-b";

    newCell3.innerHTML = data.value.value;
    newCell3.className += "column-c";

    newCell4.innerHTML = '<i class="fa fa-trash" aria-hidden="true" >';
    newCell4.className += "column-d";

    newRow.onclick = createClickHandler(newRow);
});

/**
 * This function load list of tasks on start
 */

socket.on('reciveList', function(data) {
    for (let i in data) {
        var table = document.getElementById("to-do-list");
        var rows = table.getElementsByTagName("tr");
        var value = document.getElementById("input-item").value;

        var newRow = table.insertRow(rows.length - 1);

        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);

        newCell1.innerHTML = '<input type="checkbox" name="position" value="'+ data[i].id +'">';
        newCell1.className += "column-a";

        newCell2.innerHTML = "";
        newCell2.className += "column-b";

        newCell3.innerHTML = data[i].value;
        newCell3.className += "column-c";

        newCell4.innerHTML = '<i class="fa fa-trash" aria-hidden="true" >';
        newCell4.className += "column-d";

        if (data[i].checked === 1) {
            newRow.className = "done";
            newRow.getElementsByTagName("input")[0].checked = true;
        }
        newRow.onclick = createClickHandler(newRow);
    }
});