import fs from "fs";
import morgan from "morgan";

import { NODE_ENV } from "../constants/env-vars";

export const logger = (() => {
  switch (NODE_ENV) {
    case "production":
      return morgan("common", {
        stream: fs.createWriteStream("./access.log", {
          flags: "a",
        }),
      });
    case "development":
    default:
      return morgan("dev");
  }
})();
