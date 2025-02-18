import React from "react";
import { flexRender } from "@tanstack/react-table";
import games from "../data/games.json";
import "../styles/Table.css";
import { useGamesTable } from "../hooks/useGamesTable";

function Home() {
  const { table, nameFilter, handleSearch } = useGamesTable(games);

  console.log("render");

  return (
    <div>
      <h2>Games Library</h2>
      <div className="search-container">
        <input
          type="text"
          value={nameFilter}
          onChange={handleSearch}
          placeholder="Search games..."
          className="search-input"
        />
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
