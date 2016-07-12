var createClickHandler =
    function(row) {
        return function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            var cell = row.getElementsByTagName("input")[0];

            var hasClass = row.classList.contains('done');
            if (!target.classList.contains("fa-trash")) {
                (hasClass) ? row.className = "": row.className += "done";
            }

            if (target.type !== "checkbox" && !target.classList.contains("fa-trash")) {
                (cell.checked) ? cell.checked = false: cell.checked = true;
            }

            if (target.classList.contains("fa-trash")) {
                document.getElementById("to-do-list").deleteRow(row.rowIndex);
            }
        };
    };

function addRowHandlers() {
    var table = document.getElementById("to-do-list");
    var rows = table.getElementsByTagName("tr");

    for (i = 1; i < rows.length - 1; i++) {
        var currentRow = table.rows[i];

        if (currentRow.getElementsByTagName("input")[0].checked) {
            currentRow.className += "done";
        }

        currentRow.onclick = createClickHandler(currentRow);
    }
}

function createRow() {
    var table = document.getElementById("to-do-list");
    var rows = table.getElementsByTagName("tr");
    var value = document.getElementById("input-item").value;

    var newRow = table.insertRow(rows.length - 1);

    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);

    newCell1.innerHTML = '<input type="checkbox" name="position" value="2">';
    newCell1.className += "column-a";

    newCell2.innerHTML = "";
    newCell2.className += "column-b";

    newCell3.innerHTML = value;
    newCell3.className += "column-c";

    newCell4.innerHTML = '<i class="fa fa-trash" aria-hidden="true" >';
    newCell4.className += "column-d";
    newRow.onclick = createClickHandler(newRow);
}


window.onload = addRowHandlers();