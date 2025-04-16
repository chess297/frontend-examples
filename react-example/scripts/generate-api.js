import path from "node:path";
import { generateApi } from "swagger-typescript-api";
const ROOT_PATH = process.cwd();
function main() {
  generateApi({
    url: "http://localhost:3000/swagger-json",
    // input:"http://localhost:3000/swagger-json",
    output: path.join(ROOT_PATH, "src/services/api"),
    fileName: "api.ts",
    httpClientType: "axios",
    cleanOutput: true,
    moduleNameIndex: true,
    singleHttpClient: true,
  });
  console.log("Generating API...");
}

main();
