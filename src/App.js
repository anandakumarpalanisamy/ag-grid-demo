import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

const MedalCellRenderer = (props) => (
  <span>{new Array(parseInt(props.value)).fill("#").join("")}</span>
);

const AgeCellRenderer = (props) => {
  return (
    <span className="my-renderer">
      <img
        className="my-spinner"
        src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif"
        alt="age-loading"
      />
      {props.value}
    </span>
  );
};

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
    { field: "athlete" },
    { field: "age", cellRenderer: AgeCellRenderer },
    { field: "country" },
    { field: "year" },
    // Demo of overriding the default coldefs
    { field: "date" },
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
    }),
    []
  );

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  return (
    <div className="ag-theme-alpine-dark" style={{ height: "100vh" }}>
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
