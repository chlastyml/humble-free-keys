import React from "react";
import { FaSteam, FaGamepad } from "react-icons/fa";
import { SiOrigin, SiUbisoft, SiEpicgames, SiGogdotcom } from "react-icons/si";

const getPlatformIcon = (platform) => {
  const iconStyle = { fontSize: "20px" };

  switch (platform?.toLowerCase()) {
    case "steam":
      return <FaSteam style={iconStyle} title="Steam" />;
    case "origin":
      return <SiOrigin style={iconStyle} title="Origin" />;
    case "uplay":
      return <SiUbisoft style={iconStyle} title="Ubisoft" />;
    case "epic":
      return <SiEpicgames style={iconStyle} title="Epic Games" />;
    case "gog":
      return <SiGogdotcom style={iconStyle} title="GOG" />;
    default:
      return <FaGamepad style={iconStyle} title={platform || "Other"} />;
  }
};

export function getGameColumns(columnHelper) {
  return [
    columnHelper.accessor("steamInfo.thumbnail", {
      header: "Image",
      cell: (info) => {
        const thumbnail = info.getValue();
        return thumbnail ? (
          <img
            src={thumbnail}
            alt="game thumbnail"
            style={{
              width: "120px",
              height: "45px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : null;
      },
      enableSorting: false,
    }),
    columnHelper.accessor("platform", {
      header: "Platform",
      cell: (info) => getPlatformIcon(info.getValue()),
      enableSorting: false,
    }),
    columnHelper.accessor("name", {
      header: "Title",
      enableSorting: true,
      cell: (info) => {
        const steamInfo = info.row.original.steamInfo;
        if (steamInfo?.link) {
          return (
            <a href={steamInfo.link} target="_target" rel="noreferrer">
              {info.getValue()}
            </a>
          );
        }
        return info.getValue();
      },
      sortingFn: "alphanumeric",
    }),
    columnHelper.accessor("steamInfo.rating.score", {
      header: "Rating",
      cell: (info) => info.getValue()?.toFixed(1) || "N/A",
      enableSorting: true,
    }),
    columnHelper.accessor("steamInfo.price.actual_value", {
      header: "Price",
      cell: (info) => {
        const price = info.getValue();
        return price ? `$${price.toFixed(2)}` : "N/A";
      },
      enableSorting: true,
    }),
  ];
}
