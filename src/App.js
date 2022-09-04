import { useCallback, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

function App() {
  const gridRef = useRef();

  const [rowData, setRowData] = useState([]);

  const gridOptions = {
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
  };

  const columnDefs = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    // Demo of overriding the default coldefs
    { field: "date", filter: false },
    { field: "sport", enableRowGroup: false },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    enableRowGroup: true,
  };

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const cellClicked = useCallback((e) => {
    console.log(e);
  }, []);

  const buttonClicked = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div className="ag-theme-alpine-dark" style={{ height: "100vh" }}>
      <button onClick={buttonClicked}>Click Me!!!</button>
      <AgGridReact
        ref={gridRef}
        onCellClicked={cellClicked}
        gridOptions={gridOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}

export default App;
