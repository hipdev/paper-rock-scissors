/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as cronFunctions from "../cronFunctions.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as lib_utils from "../lib/utils.js";
import type * as notifications from "../notifications.js";
import type * as tournaments from "../tournaments.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  cronFunctions: typeof cronFunctions;
  crons: typeof crons;
  http: typeof http;
  "lib/utils": typeof lib_utils;
  notifications: typeof notifications;
  tournaments: typeof tournaments;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
