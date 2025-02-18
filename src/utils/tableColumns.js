export function getGameColumns(columnHelper) {
  return [
    columnHelper.accessor("name", {
      header: "Title",
      cell: (info) => {
        const link = info.row.original.link;

        if (link) {
          return (
            <a href={link} target="_blank" rel="noreferrer">
              {info.getValue()}
            </a>
          );
        }

        return info.getValue();
      },
    }),
    columnHelper.accessor("platform", {
      header: "Platform",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("release_date", {
      header: "Release Date",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("genre", {
      header: "Genre",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("publisher", {
      header: "Publisher",
      cell: (info) => info.getValue(),
    }),
  ];
}
