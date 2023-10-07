import { prisma } from "@lucia-auth/adapter-prisma";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { elysia } from "lucia/middleware";
import { config } from "../config";
import { db } from "../db";

const envAliasMap = {
    production: "PROD",
    development: "DEV",
} as const;

const envAlias = envAliasMap[config.env.NODE_ENV];

export const auth = lucia({
    env: envAlias,
    middleware: elysia(),
    adapter: prisma(db, {
        user: "user",
        key: "key",
        session: "session",
    }),
    getUserAttributes: (data) => {
        return {
            handle: data.handle,
        };
    },
});

export type Auth = typeof auth;

export const githubAuth = github(auth, {
    clientId: config.env.GITHUB_CLIENT_ID,
    clientSecret: config.env.GITHUB_CLIENT_SECRET,
});
