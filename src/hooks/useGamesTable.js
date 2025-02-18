import { useState, useMemo, useCallback } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getGameColumns } from "../utils/tableColumns";

export function useGamesTable(games) {
  const [nameFilter, setNameFilter] = useState("");

  const columnHelper = createColumnHelper();
  const columns = useMemo(() => getGameColumns(columnHelper), [columnHelper]);

  const filteredData = useMemo(
    () => games.filter((g) => g.platform === "Humble Choice"),
    [games]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: nameFilter,
    },
    onGlobalFilterChange: setNameFilter,
  });

  const handleSearch = useCallback((e) => {
    setNameFilter(e.target.value);
  }, []);

  return {
    table,
    nameFilter,
    handleSearch,
  };
}
