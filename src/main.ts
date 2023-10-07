import { staticPlugin } from "@elysiajs/static";
// import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { config } from "./config";
import { api } from "./controllers/*";
import { pages } from "./pages/*";

if (config.env.NODE_ENV === "development") {
    void fetch("http://localhost:3001/restart");
    console.log("🦊 Triggering Live Reload");
}

const app = new Elysia()
    // .use(swagger())
    // @ts-expect-error
    .use(staticPlugin())
    .use(api)
    .use(pages)
    .get("/health-check", () => {
        return {
            status: "ok",
            uptime: process.uptime(),
        };
    })
    .listen(3000);

export type App = typeof app;

console.log(
    `app is listening on http://${app.server?.hostname}:${app.server?.port}`,
);
