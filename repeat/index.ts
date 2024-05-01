import http, { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { iProps } from "./interface";

const port: number = 4400;
const server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
> = http.createServer((req: any, res: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PATCH, PUT, POST,",
  };

  res.writeHead(200, headers);

  let body: string = "";

  req.on("data", (chunk: Buffer) => {
    body += chunk;
  });

  req.on("end", () => {
    const db = path.join(__dirname, "data", "db.json");
    const read = fs.createReadStream(db, { encoding: "utf8" });

    //

    if (req.url === "/api/post-task" && req.method === "POST") {
      const { task, desc } = JSON.parse(body);

      let data: iProps = {
        task,
        id: uuid(),
        desc,
        date: moment(Date.now()).format("lll"),
        started: false,
        done: false,
      };

      read.on("data", (chunk: Buffer) => {
        const main = JSON.parse(chunk.toString());
        const { task, started, done } = main;

        let writeData = fs.createWriteStream(db);
        task.push(data);

        writeData.write(JSON.stringify(main), () => {
          res.end(JSON.stringify(main));
        });
      });
    } else if (req.url === "/api/get-task" && req.method === "GET") {
      read.on("data", (chunk: Buffer) => {
        const main = JSON.parse(chunk.toString());

        const { task } = main;

        res.write(JSON.stringify(task));
        res.end();
      });
    } else if (req.url === "/api/get" && req.method === "GET") {
      read.on("data", (chunk: Buffer) => {
        const main = JSON.parse(chunk.toString());

        const { task } = main;

        res.write(JSON.stringify(main));
        res.end();
      });
    } else if (req.method === "PATCH") {
      try {
        const id = req.url?.split("/api/started/")[1];
        const read = fs.createReadStream(db);

        read.on("data", (chunk: Buffer) => {
          const main = JSON.parse(chunk.toString());
          const { task, started, done } = main;

          const obj = task.find((el: iProps) => {
            return el.id === id;
          });

          obj.started = true;

          const value = task.filter((el: iProps) => {
            return el.id !== id;
          });

          let writeData = fs.createWriteStream(db);
          started.push(obj);

          writeData.write(
            JSON.stringify({ task: value, started, done }),
            () => {
              res.end(JSON.stringify(main));
            }
          );
        });
      } catch (error) {
        res.end("Error Found");
      }
    } else if (req.url === "/api/get-started" && req.method === "GET") {
      const read = fs.createReadStream(db);

      read.on("data", (chunk: Buffer) => {
        try {
          const main = JSON.parse(chunk.toString());
          const { task, started, done } = main;
          console.log("first");
          //   res.end("ended");
          res.end(JSON.stringify(started));
        } catch (error) {
          res.end("error found");
        }
      });
    } else {
      res.end("No EndPoint was Targeted");
    }
  });
});

server.listen(port, () => {
  const db = path.join(__dirname, "data");

  if (!fs.existsSync(db)) {
    fs.mkdir(path.join(__dirname, "data"), () => {
      console.log("created");
    });

    const db = path.join(__dirname, "data", "db.json");
    const data = {
      task: [],
      started: [],
      done: [],
    };

    fs.writeFile(db, JSON.stringify(data), () => {
      console.log(` 🚀🚀🚀❤️`);
    });
  }
  console.log(`listening on port: ${port} 🚀🚀🚀❤️`);
});
