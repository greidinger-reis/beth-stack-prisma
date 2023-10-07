import { PrismaClient } from "@prisma/client";
import { config } from "../config";

export const db = new PrismaClient({
    log: [config.env.LOG_LEVEL === "debug" ? "query" : config.env.LOG_LEVEL],
});
