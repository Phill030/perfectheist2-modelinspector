const express = require("express");
const cors = require("cors");
const fs = require("fs");

const port = 5050;
const mapDir = `${process.env.HOME}\\AppData\\Local\\PerfectHeist2\\Saved\\LevelEditor\\`;

class Startup {
  static async start() {
    const app = express();
    app.use(express.json());
    app.use(
      cors({
        origin: "*",
        methods: "*",
      })
    );

    app.post("/api/setResourcePath", (req, res) => {
      const { resourceFolder, mapName } = req.body;

      const resourceJson = [];
      const packs = fs.readdirSync(resourceFolder);
      for (const pack of packs) {
        if (pack.includes(".")) continue;
        resourceJson.push({
          name: pack,
          models: fs
            .readdirSync(`${resourceFolder}\\${pack}\\Models`)
            .filter((model) => model.endsWith(".fbx")),
          textures: fs
            .readdirSync(`${resourceFolder}\\${pack}\\Textures`)
            .filter((model) => model.endsWith(".png")),
        });
      }

      const models = undefined;
      if (mapName)
        fs.readdirSync(mapDir + `${mapName}`).filter((file) =>
          file.endsWith(".fbx")
        );

      app.use(express.static(resourceFolder));

      res.send({
        resource: JSON.stringify(resourceJson),
        map: models ? JSON.stringify(models) : undefined,
      });
    });

    app.post("/api/validateResourcePath", (req, res) => {
      const { resourceFolder } = req.body;

      return res.send({ response: fs.existsSync(resourceFolder) });
    });

    app.get("/api/getMaps", (req, res) => {
      const Maps = [];

      const dir = fs.readdirSync(
        `${process.env.HOME}\\AppData\\Local\\PerfectHeist2\\Saved\\LevelEditor`
      );

      const maps = dir.filter((map) => !map.includes("."));

      for (const map of maps) {
        const mapDir = fs.readdirSync(
          `${process.env.HOME}\\AppData\\Local\\PerfectHeist2\\Saved\\LevelEditor\\${map}`
        );

        const img = mapDir.includes("preview.png")
          ? `${process.env.HOME}\\AppData\\Local\\PerfectHeist2\\Saved\\LevelEditor\\${map}\\preview.png`
          : "";

        Maps.push({
          name: map,
          image: img,
        });
      }

      res.send(Maps.length >= 1 ? JSON.stringify(Maps) : undefined);
    });

    app.post(`/api/createSymlink`, (req, res) => {});

    app.post(`/api/removeSymlink`, (req, res) => {});

    app.listen(port, () => {
      console.log(`[DEBUG] Server started, listening on port ${port}`);
    });
  }
}

setImmediate(Startup.start);
