import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ClientSideRowModelModule,
    ColDef,
    CustomFilterModule,
    DateFilterModule,
    IRowNode,
    ModuleRegistry,
    NumberFilterModule,
    NumberEditorModule,
    RowDragModule,
    RowDragEndEvent,
    TextFilterModule,
    ValidationModule,
} from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TreeDataModule,
    RowDragModule,
    ValidationModule,
    NumberEditorModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    CustomFilterModule,
]);

type Row = {
    id: string;
    path: string[];
    make: string;
    model: string;
    price: number;
    electric: boolean;
};

const rowData: Row[] = [
    {
        id: 'tesla-model-y',
        path: ['Electric', 'Tesla', 'Model Y'],
        make: 'Tesla',
        model: 'Model Y',
        price: 64950,
        electric: true,
    },
    {
        id: 'tesla-model-3',
        path: ['Electric', 'Tesla', 'Model 3'],
        make: 'Tesla',
        model: 'Model 3',
        price: 44990,
        electric: true,
    },
    {
        id: 'ford-f150',
        path: ['Gas / Hybrid', 'Ford', 'F-150'],
        make: 'Ford',
        model: 'F-150',
        price: 33850,
        electric: false,
    },
    {
        id: 'ford-mustang-mach-e',
        path: ['Electric', 'Ford', 'Mustang Mach-E'],
        make: 'Ford',
        model: 'Mustang Mach-E',
        price: 42995,
        electric: true,
    },
    {
        id: 'toyota-corolla',
        path: ['Gas / Hybrid', 'Toyota', 'Corolla'],
        make: 'Toyota',
        model: 'Corolla',
        price: 29600,
        electric: false,
    },
    {
        id: 'toyota-prius',
        path: ['Gas / Hybrid', 'Toyota', 'Prius'],
        make: 'Toyota',
        model: 'Prius',
        price: 32700,
        electric: false,
    },
    {
        id: 'bmw-i4',
        path: ['Electric', 'BMW', 'i4'],
        make: 'BMW',
        model: 'i4',
        price: 52400,
        electric: true,
    },
    {
        id: 'audi-q4-etron',
        path: ['Electric', 'Audi', 'Q4 e-tron'],
        make: 'Audi',
        model: 'Q4 e-tron',
        price: 49900,
        electric: true,
    },
    {
        id: 'hyundai-ioniq-5',
        path: ['Electric', 'Hyundai', 'Ioniq 5'],
        make: 'Hyundai',
        model: 'Ioniq 5',
        price: 43200,
        electric: true,
    },
    {
        id: 'kia-ev6',
        path: ['Electric', 'Kia', 'EV6'],
        make: 'Kia',
        model: 'EV6',
        price: 42800,
        electric: true,
    },
    {
        id: 'mercedes-c-class',
        path: ['Gas / Hybrid', 'Mercedes-Benz', 'C-Class'],
        make: 'Mercedes-Benz',
        model: 'C-Class',
        price: 46850,
        electric: false,
    },
    {
        id: 'vw-id4',
        path: ['Electric', 'Volkswagen', 'ID.4'],
        make: 'Volkswagen',
        model: 'ID.4',
        price: 40300,
        electric: true,
    },
    {
        id: 'honda-civic',
        path: ['Gas / Hybrid', 'Honda', 'Civic'],
        make: 'Honda',
        model: 'Civic',
        price: 26800,
        electric: false,
    },
    {
        id: 'nissan-leaf',
        path: ['Electric', 'Nissan', 'Leaf'],
        make: 'Nissan',
        model: 'Leaf',
        price: 28900,
        electric: true,
    },
    {
        id: 'chevy-bolt-ev',
        path: ['Electric', 'Chevrolet', 'Bolt EV'],
        make: 'Chevrolet',
        model: 'Bolt EV',
        price: 27995,
        electric: true,
    },
    {
        id: 'rivian-r1t',
        path: ['Electric', 'Rivian', 'R1T'],
        make: 'Rivian',
        model: 'R1T',
        price: 73900,
        electric: true,
    },
    {
        id: 'lucid-air-pure',
        path: ['Electric', 'Lucid', 'Air Pure'],
        make: 'Lucid',
        model: 'Air Pure',
        price: 77400,
        electric: true,
    },
    {
        id: 'porsche-taycan',
        path: ['Electric', 'Porsche', 'Taycan'],
        make: 'Porsche',
        model: 'Taycan',
        price: 101400,
        electric: true,
    },
];

/** Get path array from any row node (leaf has data.path, group has key + parent) */
function getPathFromNode(node: IRowNode<Row> | null | undefined): string[] {
    if (!node) return [];
    const data = node.data as Row | undefined;
    if (data?.path?.length) return data.path;
    const parentPath = getPathFromNode(node.parent ?? null);
    const key = node.key ?? null;
    if (key == null) return parentPath;
    return [...parentPath, String(key)];
}

function buildNewPath(
    targetPath: string[],
    position: 'above' | 'below' | 'child',
    movedPath: string[],
): string[] {
    if (position === 'child') {
        const base = targetPath.length === 0 ? [] : [...targetPath];
        const lastSegment = movedPath[movedPath.length - 1] ?? 'item';
        return [...base, lastSegment];
    }
    if (position === 'above' || position === 'below') {
        const parentPath = targetPath.slice(0, -1);
        const lastSegment = movedPath[movedPath.length - 1] ?? 'item';
        return [...parentPath, lastSegment];
    }
    return movedPath;
}

/** Reorder data so that the group `draggedKey` at `level` moves above or below `targetKey`. */
function reorderGroupsAtLevel(
    data: Row[],
    level: number,
    draggedKey: string,
    targetKey: string,
    position: 'above' | 'below',
): Row[] {
    const byKey = new Map<string, Row[]>();
    const keyOrder: string[] = [];
    for (const row of data) {
        const key = row.path[level];
        if (key == null) continue;
        if (!byKey.has(key)) {
            keyOrder.push(key);
            byKey.set(key, []);
        }
        byKey.get(key)!.push(row);
    }
    const dragIdx = keyOrder.indexOf(draggedKey);
    const targetIdx = keyOrder.indexOf(targetKey);
    if (dragIdx === -1 || targetIdx === -1) return data;
    const newOrder = keyOrder.filter((k) => k !== draggedKey);
    const insertAt = position === 'above' ? targetIdx : targetIdx + 1;
    const adjusted = insertAt > dragIdx ? insertAt - 1 : insertAt;
    newOrder.splice(adjusted, 0, draggedKey);
    return newOrder.flatMap((k) => byKey.get(k) ?? []);
}

export default function App() {
    const [data, setData] = useState<Row[]>(rowData);

    const columnDefs = useMemo<ColDef<Row>[]>(
        () => [
            { field: 'make', sortable: true, filter: true },
            { field: 'model', sortable: true, filter: true },
            { field: 'price', sortable: true, filter: 'agNumberColumnFilter' },
            { field: 'electric', sortable: true, filter: true },
        ],
        [],
    );

    const onRowDragEnd = useMemo(() => {
        return (event: RowDragEndEvent<Row>) => {
            const node = event.node;
            const overNode = event.overNode;
            if (!node || !overNode) return;

            const targetPath = getPathFromNode(overNode);
            if (targetPath.length === 0) return;

            const rowTop = overNode.rowTop ?? 0;
            const rowHeight = overNode.rowHeight ?? 24;
            const position: 'above' | 'below' | 'child' =
                event.y < rowTop + rowHeight / 2 ? 'above' : 'below';

            // Dragging a group row (e.g. "Electric", "Gas / Hybrid") – reorder whole branch
            if (node.group && !node.data) {
                const draggedPath = getPathFromNode(node);
                if (draggedPath.length === 0) return;
                const level = draggedPath.length - 1;
                const draggedKey = draggedPath[level];
                const targetKey = targetPath[level];
                if (draggedKey === targetKey) return;

                setData((prev) =>
                    reorderGroupsAtLevel(
                        prev,
                        level,
                        draggedKey,
                        targetKey,
                        position,
                    ),
                );
                return;
            }

            // Dragging a leaf row – move single row
            const moved = node.data;
            if (!moved) return;

            const newPath = buildNewPath(targetPath, position, moved.path);
            if (newPath.join('/') === moved.path.join('/')) return;

            setData((prev) =>
                prev.map((row) =>
                    row.id === moved.id ? { ...row, path: newPath } : row,
                ),
            );
        };
    }, []);

    return (
        <div className="app-shell">
            <h1>AG Grid + React + TypeScript</h1>
            <div className="ag-theme-alpine table-wrap">
                <AgGridReact<Row>
                    rowData={data}
                    columnDefs={columnDefs}
                    autoGroupColumnDef={{
                        headerName: 'Hierarchy',
                        minWidth: 280,
                        rowDrag: true,
                        cellRendererParams: {
                            suppressCount: false,
                        },
                    }}
                    getDataPath={(data) => data.path}
                    getRowId={(params) => params.data.id}
                    treeData
                    groupDefaultExpanded={-1}
                    suppressMoveWhenRowDragging
                    theme="legacy"
                    animateRows
                    onRowDragEnd={onRowDragEnd}
                />
            </div>
        </div>
    );
}
