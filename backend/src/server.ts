import express, { Router, json } from "express";
import cors from "cors";
import path from "path";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port || 3000;
    this.routes = options.routes;
  }

  async start() {
    this.app.disable("x-powered-by");
    this.app.use(json());
    this.app.use(cors());
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(this.routes);
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
