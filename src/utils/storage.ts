import fs from "fs";
import path from "path";

const CASAIS_PATH = path.resolve(__dirname, "../data/casais.json");

export function loadCasais(): Record<string, string> {
  try {
    if (!fs.existsSync(CASAIS_PATH)) {
      fs.mkdirSync(path.dirname(CASAIS_PATH), { recursive: true });
      fs.writeFileSync(CASAIS_PATH, JSON.stringify({}, null, 2), "utf8");
    }

    const data = fs.readFileSync(CASAIS_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveCasais(casais: Record<string, string>): void {
  fs.writeFileSync(CASAIS_PATH, JSON.stringify(casais, null, 2), "utf8");
}
