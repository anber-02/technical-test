import { AppRoutes } from "./routes";
import { Server } from "./server";

(() => {
  main();
})();

async function main() {
  new Server({ port: 3000, routes: AppRoutes.routes }).start();
}
