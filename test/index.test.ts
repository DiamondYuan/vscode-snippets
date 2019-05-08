import assert = require("assert");
import { getContributes } from "../src/config";
import * as fs from "fs";
import * as path from "path";

describe("test contributes", () => {
  it("should contributes equal", async () => {
    const packageJsonPath = path.join(__dirname, "../package.json");
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, { encoding: "utf-8" })
    );
    const contributes = await getContributes();
    assert.deepEqual(packageJson.contributes, contributes);
  });
});
