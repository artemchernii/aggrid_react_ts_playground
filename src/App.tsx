import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    ColDef,
    CustomFilterModule,
    DateFilterModule,
    // GroupFilterModule,
    ModuleRegistry,
    // MultiFilterModule,
    NumberFilterModule,
    NumberEditorModule,
    RowDragModule,
    // SetFilterModule,
    TextFilterModule,
    ValidationModule,
} from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    RowDragModule,
    ValidationModule,
    NumberEditorModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    // SetFilterModule,
    // MultiFilterModule,
    // GroupFilterModule,
    CustomFilterModule,
]);

type Row = {
    make: string;
    model: string;
    price: number;
    electric: boolean;
};

const rowData: Row[] = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { make: 'BMW', model: 'i4', price: 52400, electric: true },
    { make: 'Audi', model: 'Q4 e-tron', price: 49900, electric: true },
    { make: 'Hyundai', model: 'Ioniq 5', price: 43200, electric: true },
    { make: 'Kia', model: 'EV6', price: 42800, electric: true },
    { make: 'Mercedes-Benz', model: 'C-Class', price: 46850, electric: false },
    { make: 'Volkswagen', model: 'ID.4', price: 40300, electric: true },
    { make: 'Honda', model: 'Civic', price: 26800, electric: false },
    { make: 'Nissan', model: 'Leaf', price: 28900, electric: true },
    { make: 'Chevrolet', model: 'Bolt EV', price: 27995, electric: true },
    { make: 'Rivian', model: 'R1T', price: 73900, electric: true },
    { make: 'Lucid', model: 'Air Pure', price: 77400, electric: true },
    { make: 'Porsche', model: 'Taycan', price: 101400, electric: true },
    { make: 'Volvo', model: 'XC40', price: 39800, electric: false },
    { make: 'Subaru', model: 'Outback', price: 31900, electric: false },
    { make: 'Mazda', model: 'CX-5', price: 30800, electric: false },
];

export default function App() {
    const columnDefs = useMemo<ColDef<Row>[]>(
        () => [
            { field: 'make', sortable: true, filter: true, rowDrag: true },
            { field: 'model', sortable: true, filter: true },
            { field: 'price', sortable: true, filter: 'agNumberColumnFilter' },
            { field: 'electric', sortable: true, filter: true },
        ],
        [],
    );

    return (
        <div className="app-shell">
            <h1>AG Grid + React + TypeScript</h1>
            <div className="ag-theme-alpine table-wrap">
                <AgGridReact<Row>
                    rowData={rowData}
                    columnDefs={columnDefs}
                    theme="legacy"
                    rowDragManaged
                    animateRows
                />
            </div>
        </div>
    );
}
