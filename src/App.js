import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

const dateComparator = (dateFromFilter, cellValue) => {
  if (cellValue === null) {
    return 0;
  }
  const dateParts = cellValue.split("/");
  const day = Number(dateParts[0]);
  const month = Number(dateParts[1] - 1);
  const year = Number(dateParts[2]);
  const cellDate = new Date(year, month, day);
  if (cellDate < dateFromFilter) {
    return -1;
  } else if (cellDate > dateFromFilter) {
    return 1;
  }
  return 0;
};

const MedalCellRenderer = (props) => (
  <span>{new Array(parseInt(props.value)).fill("#").join("")}</span>
);

const TotalCellRenderer = (props) => {
  const buttonClicked = () => {
    alert(`${props.value} medals won!`);
  };

  return (
    <span>
      <span>{props.value}</span>
      <button onClick={buttonClicked}>Push For Total</button>
    </span>
  );
};

function App() {
  const gridRef = useRef();

  const [rowData, setRowData] = useState();

  const gridOptions = useMemo(
    () => ({
      rowSelection: "multiple",
      animateRows: true,
      rowGroupPanelShow: "always",
      statusBar: {
        statusPanels: [
          { statusPanel: "agTotalRowCountComponent", align: "left" },
          { statusPanel: "agFilteredRowCountComponent", align: "center" },
          { statusPanel: "agSelectedRowCountComponent", align: "right" },
        ],
      },
    }),
    []
  );

  const [columnDefs] = useState([
    { field: "athlete", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", filter: "agMultiColumnFilter" },
    { field: "year" },
    // Demo of overriding the default coldefs
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (dateFromFilter, cellValue) =>
          dateComparator(dateFromFilter, cellValue),
      },
    },
    { field: "sport" },
    { field: "gold", cellRenderer: MedalCellRenderer },
    { field: "silver", cellRenderer: MedalCellRenderer },
    { field: "bronze", cellRenderer: MedalCellRenderer },
    { field: "total", cellRenderer: TotalCellRenderer },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      enableRowGroup: true,
      floatingFilter: true,
      filterParams: {
        buttons: ["apply", "clear"],
      },
    }),
    []
  );

  const savedFilterState = useRef();

  const onSave = useCallback(() => {
    const filterModel = gridRef.current.api.getFilterModel();
    savedFilterState.current = filterModel;
  }, []);

  const onApply = useCallback(() => {
    gridRef.current.api.setFilterModel(savedFilterState.current);
  }, []);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <div className="ag-theme-alpine-dark" style={{ height: "100vh" }}>
      <div>
        <button onClick={onSave}>Save</button>
        <button onClick={onApply}>Apply</button>
      </div>
      <AgGridReact
        ref={gridRef}
        gridOptions={gridOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default App;
