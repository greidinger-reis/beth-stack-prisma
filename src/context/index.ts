import { logger } from "@bogeychan/elysia-logger";
import { HoltLogger } from "@tlscipher/holt";
import { bethStack } from "beth-stack/elysia";
import { Elysia } from "elysia";
import pretty from "pino-pretty";
import { auth } from "../auth";
import { config } from "../config";
import { db } from "../db";

const stream = pretty({
    colorize: true,
});

const loggerConfig =
    config.env.NODE_ENV === "development"
        ? {
              level: config.env.LOG_LEVEL,
              stream,
          }
        : { level: config.env.LOG_LEVEL };

export const ctx = new Elysia({
    name: "@app/ctx",
})
    .decorate("db", db)
    .decorate("config", config)
    .decorate("auth", auth)
    .use(bethStack())
    .use(logger(loggerConfig))
    .use(
        // @ts-expect-error
        config.env.NODE_ENV === "development"
            ? new HoltLogger().getLogger()
            : (a) => a,
    );
