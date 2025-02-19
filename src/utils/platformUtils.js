import React from "react";
import { FaSteam, FaGamepad } from "react-icons/fa";
import { SiOrigin, SiUbisoft, SiEpicgames, SiGogdotcom } from "react-icons/si";

export const MAIN_PLATFORMS = ["steam", "origin", "uplay", "epic", "gog"];

export const getPlatformDisplay = (platform, isTable = false) => {
  const iconStyle = isTable
    ? { fontSize: "24px" } // Bigger icons for table
    : { fontSize: "16px", marginRight: "8px", verticalAlign: "middle" }; // Original size for dropdown

  switch (platform?.toLowerCase()) {
    case "steam":
      return {
        icon: <FaSteam style={iconStyle} />,
        name: "Steam",
      };
    case "origin":
      return {
        icon: <SiOrigin style={iconStyle} />,
        name: "Origin",
      };
    case "uplay":
      return {
        icon: <SiUbisoft style={iconStyle} />,
        name: "Ubisoft",
      };
    case "epic":
      return {
        icon: <SiEpicgames style={iconStyle} />,
        name: "Epic Games",
      };
    case "gog":
      return {
        icon: <SiGogdotcom style={iconStyle} />,
        name: "GOG",
      };
    case "other":
      return {
        icon: <FaGamepad style={iconStyle} />,
        name: "Other",
      };
    case "all":
      return {
        icon: null,
        name: "All Platforms",
      };
    default:
      return {
        icon: <FaGamepad style={iconStyle} />,
        name: platform || "Other",
      };
  }
};
