import React from "react";
import { FaSteam, FaGamepad } from "react-icons/fa";
import { SiOrigin, SiUbisoft, SiEpicgames, SiGogdotcom } from "react-icons/si";

const getRatingColor = (score) => {
  if (score >= 90) return "#4CAF50"; // Green
  if (score >= 80) return "#8BC34A"; // Light Green
  if (score >= 70) return "#FFC107"; // Amber
  if (score >= 60) return "#FF9800"; // Orange
  return "#F44336"; // Red
};

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
      header: () => <div style={{ textAlign: "center" }}>Image</div>,
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
      header: () => <div style={{ textAlign: "center" }}>Platform</div>,
      cell: (info) => (
        <div style={{ textAlign: "center" }}>
          {getPlatformIcon(info.getValue())}
        </div>
      ),
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
      header: () => <div style={{ textAlign: "center" }}>Rating</div>,
      cell: (info) => {
        const score = info.getValue();
        const ratingLink = info.row.original.steamInfo?.rating?.link;

        if (!score) {
          return (
            <div
              style={{
                textAlign: "center",
                minWidth: "80px",
                padding: "4px",
              }}
            >
              N/A
            </div>
          );
        }

        return (
          <a
            href={ratingLink}
            target="_blank"
            rel="noreferrer"
            style={{
              color: getRatingColor(score),
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "1.2rem",
              display: "block",
              textAlign: "center",
              padding: "4px",
              borderRadius: "4px",
              backgroundColor: `${getRatingColor(score)}15`,
            }}
          >
            {score.toFixed(0)}
          </a>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("steamInfo.price.actual_value", {
      header: () => <div style={{ textAlign: "center" }}>Price</div>,
      cell: (info) => {
        const actual = info.getValue();
        const original = info.row.original.steamInfo?.price?.original_value;
        const discount = info.row.original.steamInfo?.price?.discount;

        if (!actual) {
          return (
            <div
              style={{
                textAlign: "center",
                minWidth: "120px",
                padding: "0 8px",
              }}
            >
              N/A
            </div>
          );
        }

        if (discount) {
          return (
            <div
              style={{
                textAlign: "center",
                minWidth: "120px", // Set minimum width
                padding: "0 8px", // Add some padding
              }}
            >
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#666",
                  fontSize: "0.9rem",
                }}
              >
                {original.toFixed(2)}€
              </span>
              <br />
              <span
                style={{
                  color: "#4CAF50",
                  fontWeight: "bold",
                }}
              >
                {actual.toFixed(2)}€
              </span>
              <span
                style={{
                  color: "#4CAF50",
                  fontSize: "0.8rem",
                  marginLeft: "4px",
                }}
              >
                (-{discount}%)
              </span>
            </div>
          );
        }

        return (
          <div
            style={{
              textAlign: "center",
              minWidth: "120px",
              padding: "0 8px",
            }}
          >
            {actual.toFixed(2)}€
          </div>
        );
      },
      enableSorting: true,
    }),
  ];
}
