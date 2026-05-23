import fs from "fs/promises";
import path from "path";
 
async function ensureJsonFile(filePath, defaultValue) {
  try {
    await fs.access(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
  }
}
 
export async function readJsonFile(filePath, defaultValue = []) {
  await ensureJsonFile(filePath, defaultValue);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}
 
export async function writeJsonFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
 