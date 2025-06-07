import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
} from "@heroui/react";
import { motion } from "framer-motion";

interface Column {
  uid: string;
  name: string;
  sortable?: boolean;
  className?: string;
}

interface TableData {
  id: string;
  [key: string]: string | React.ReactNode; 
}

interface TablaProps {
  columns: Column[];
  data: TableData[];
  initialVisibleColumns?: string[];
  responsiveColumns?: string[];
  renderCell?: (item: TableData, columnKey: string) => React.ReactNode;
  onRowClick?: (row: TableData) => void;
}

const statusOptions = [
  { name: "Activo", uid: "activo" },
  { name: "Pausado", uid: "pausado" },
  { name: "Cancelado", uid: "cancelado" },
];

export function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

const Tabla: React.FC<TablaProps> = ({
  columns,
  data,
  initialVisibleColumns,
  responsiveColumns = [],
  renderCell,
  onRowClick,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns || columns.map((c) => c.uid))
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const pages = Math.ceil(data.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, columns]);

  const mobileColumns = useMemo(() => {
    if (!responsiveColumns.length) return headerColumns;
    return headerColumns.filter((column) => responsiveColumns.includes(column.uid));
  }, [headerColumns, responsiveColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredData = filteredData.filter(
        (item) =>
          typeof item.status === "string" &&
          Array.from(statusFilter).includes(item.status)
      );
    }

    return filteredData;
  }, [data, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as string];
      const second = b[sortDescriptor.column as string];
      if (first == null || second == null) return 0;
      if (typeof first === "string" && typeof second === "string") {
        return first.localeCompare(second);
      }
      if (typeof first === "number" && typeof second === "number") {
        return first - second;
      }
      return 0;
    });
  }, [sortDescriptor, items]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(
    () => (
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <Input
            isClearable
            className="w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px] text-sm"
            placeholder="Buscar..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            classNames={{
              inputWrapper: "py-0.5 h-8 sm:h-9 lg:h-10 bg-gray-100",
              input: "text-sm",
            }}
          />
          <div className="flex flex-wrap gap-2">
            <select
              className="bg-transparent outline-none text-default-400 text-sm max-w-[120px] sm:hidden"
              value={statusFilter === "all" ? "all" : Array.from(statusFilter)[0]}
              onChange={(e) => {
                const value = e.target.value;
                setStatusFilter(value === "all" ? "all" : new Set([value]));
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              {statusOptions.map((status) => (
                <option key={status.uid} value={status.uid}>
                  {capitalize(status.name)}
                </option>
              ))}
            </select>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  size="sm"
                  variant="flat"
                  className="text-sm py-0.5 sm:py-1 bg-gray-100"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize(text-sm)">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  size="sm"
                  variant="flat"
                  className="text-sm py-0.5 sm:py-1 bg-gray-100"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize(text-sm)">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-default-400 text-sm">
            Total: {data.length} registros
          </span>
          <label className="flex items-center text-default-400 text-sm gap-2">
            Filas por página:
            <select
              className="bg-gray-100 border border-gray-300 rounded-md text-sm sm:text-sm lg:text-base max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] h-8 sm:h-9 lg:h-10 px-2"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </motion.div>
    ),
    [
      filterValue,
      statusFilter,
      visibleColumns,
      onSearchChange,
      onRowsPerPageChange,
      data.length,
      hasSearchFilter,
    ]
  );

  const bottomContent = useMemo(
    () => (
      <motion.div
        className="py-2 px-2 flex justify-center sm:justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Pagination
          showControls
          color="success"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            item: "text-sm px-2 py-1",
            prev: "text-sm py-1",
            next: "text-sm py-1",
          }}
        />
      </motion.div>
    ),
    [page, pages, hasSearchFilter]
  );

  const defaultRenderCell = useCallback((item: TableData, columnKey: string) => {
    const cellValue = item[columnKey];
    return (
      <span
        className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90vw] sm:max-w-[200px]"
        title={typeof cellValue === "string" ? cellValue : undefined}
      >
        {cellValue}
      </span>
    );
  }, []);
  const renderCellToUse = renderCell || defaultRenderCell;

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-md mt-4">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table
          aria-label="Tabla con selección, paginación y ordenamiento"
          topContent={topContent}
          bottomContent={bottomContent}
          onSortChange={setSortDescriptor}
          sortDescriptor={sortDescriptor}
          classNames={{
            wrapper: "bg-white text-sm",
            th: "bg-gray-100 text-gray-800 font-semibold text-sm",
            td: "text-gray-700 text-sm",
          }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
                align={column.uid === "acciones" ? "center" : "start"}
                className={column.className}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={sortedItems}>
            {(item) => (
              <TableRow key={item.id} onClick={() => onRowClick?.(item)}>
                {(columnKey) => (
                  <TableCell>{renderCellToUse(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {topContent}
        {sortedItems.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className="border rounded-lg p-2 bg-gray-50 shadow hover:bg-gray-100 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileColumns.map((col, index) => (
              <div
                key={col.uid}
                className="flex justify-between py-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[90vw]"
                title={
                  typeof item[col.uid] === "string" ? (item[col.uid] as string) : undefined
                }
              >
                <span
                  className={`${
                    index === 0 ? "font-semibold text-gray-700" : "text-gray-500"
                  } text-sm`}
                >
                  {index === 0 ? "" : `${col.name}: `}
                </span>
                <span className="text-gray-700 text-sm">
                  {renderCellToUse(item, col.uid)}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
        {bottomContent}
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.7em"
    role="presentation"
    viewBox="0 0 24 24"
    width="0.7em"
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const ChevronDownIcon = ({ strokeWidth = 1.5, ...props }: { strokeWidth?: number }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.7em"
    role="presentation"
    viewBox="0 0 24 24"
    width="0.7em"
    {...props}
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export default Tabla;