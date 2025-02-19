import { useState, useMemo, useCallback } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getGameColumns } from "../utils/tableColumns";
import { MAIN_PLATFORMS } from "../utils/platformUtils";

export function useGamesTable(games) {
  const [nameFilter, setNameFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();
  const columns = useMemo(() => getGameColumns(columnHelper), [columnHelper]);

  const platforms = useMemo(() => {
    const uniquePlatforms = new Set(
      games.map((game) =>
        MAIN_PLATFORMS.includes(game.platform?.toLowerCase())
          ? game.platform
          : "other"
      )
    );
    return ["all", ...Array.from(uniquePlatforms)].sort();
  }, [games]);

  const filteredData = useMemo(() => {
    let filtered = games;
    if (platformFilter !== "all") {
      if (platformFilter === "other") {
        filtered = filtered.filter(
          (game) => !MAIN_PLATFORMS.includes(game.platform?.toLowerCase())
        );
      } else {
        filtered = filtered.filter(
          (game) =>
            game.platform?.toLowerCase() === platformFilter.toLowerCase()
        );
      }
    }
    return filtered;
  }, [games, platformFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter: nameFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setNameFilter,
  });

  const handleSearch = useCallback((e) => {
    setNameFilter(e.target.value);
  }, []);

  const handlePlatformChange = useCallback((e) => {
    setPlatformFilter(e.target.value);
  }, []);

  return {
    table,
    nameFilter,
    handleSearch,
    platforms,
    platformFilter,
    handlePlatformChange,
  };
}
