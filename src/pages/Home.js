import React from "react";
import { flexRender } from "@tanstack/react-table";
import games from "../data/games.json";
import "../styles/Table.css";
import { useGamesTable } from "../hooks/useGamesTable";
import { getPlatformDisplay } from "../utils/platformUtils";

function Home() {
  const {
    table,
    nameFilter,
    handleSearch,
    platforms,
    platformFilter,
    handlePlatformChange,
  } = useGamesTable(games);

  console.log("render");

  return (
    <div>
      <div className="filters-container">
        <input
          type="text"
          value={nameFilter}
          onChange={handleSearch}
          placeholder="Search games..."
          className="search-input"
        />
        <h2 className="library-title">Games Library</h2>
        <select
          value={platformFilter}
          onChange={handlePlatformChange}
          className="platform-select"
        >
          {platforms.map((platform) => {
            const { icon, name } = getPlatformDisplay(platform);
            return (
              <option key={platform} value={platform}>
                {icon} {name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? "sortable" : ""}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
