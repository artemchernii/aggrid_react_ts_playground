import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ColDef, ModuleRegistry } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

type Row = {
  make: string;
  model: string;
  price: number;
  electric: boolean;
};

const rowData: Row[] = [
  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  { make: "Ford", model: "F-Series", price: 33850, electric: false },
  { make: "Toyota", model: "Corolla", price: 29600, electric: false }
];

export default function App() {
  const columnDefs = useMemo<ColDef<Row>[]>(
    () => [
      { field: "make", sortable: true, filter: true },
      { field: "model", sortable: true, filter: true },
      { field: "price", sortable: true, filter: "agNumberColumnFilter" },
      { field: "electric", sortable: true, filter: true }
    ],
    []
  );

  return (
    <div className="app-shell">
      <h1>AG Grid + React + TypeScript</h1>
      <div className="ag-theme-alpine table-wrap">
        <AgGridReact<Row> rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
}
