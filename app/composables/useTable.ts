// app/composables/useTable.ts
export type TableRow = Record<string, unknown>;
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export const useTable = () => {
  const columns = useState<Column[]>("shared_table_columns", () => []);
  const rows = useState<TableRow[]>("shared_table_rows", () => []);
  const isLoading = useState<boolean>("shared_table_loading", () => false);
  const sortBy = useState<string>("shared_table_sort_by", () => "");
  const sortOrder = useState<string>("shared_table_sort_order", () => "ASC");

  const setTableConfig = (
    cols: Column[],
    rowData: TableRow[],
    loading = false,
  ) => {
    columns.value = cols;
    rows.value = rowData;
    isLoading.value = loading;
  };

  const handleSort = (key: string) => {
    if (sortBy.value === key) {
      sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
    } else {
      sortBy.value = key;
      sortOrder.value = "ASC";
    }
  };

  const handleRowClick = (row: TableRow) => {
    // يمكنك تخصيص هذا الحدث أو تركه عاماً
    console.log(row);
  };

  return {
    columns,
    rows,
    isLoading,
    sortBy,
    sortOrder,
    setTableConfig,
    handleSort,
    handleRowClick,
  };
};
