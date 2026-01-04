import express, { Router } from "express";
import { join } from "path";

interface Options {
  port: number;
  public_path?: string;
  routes: Router;
}
export class Server {
  public readonly app = express();

  private readonly port: number;
  private serverListener: any;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor({ port, routes, public_path = "public" }: Options) {
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  public start() {
    // parsing middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // app routes
    this.app.use(this.routes);

    //expose a public folder and its contents
    this.app.use(express.static(this.publicPath)); //handles css, js and any request for static files

    // catch all requests
    this.app.use((req, res) => {
      // server file in /${this.publicPath}/index.html for any unknown URL
      const indexFilePath = join(
        __dirname,
        `../../${this.publicPath}/index.html`
      );
      res.sendFile(indexFilePath);
    });

    // start server
    this.serverListener = this.app.listen(this.port, () => {
      console.log("Server running on port " + this.port);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
