import { Arena } from "./arena";

export type ActionResponse<T = void> =
    | { type: "success"; message: string } & T
    | { type: "error"; message: string };

export type GetArenasResponse = ActionResponse<{ userArenas: Arena[] }>;
export type CreateArenaResponse = ActionResponse<{ userArenas: Arena[] }>;
export type DeleteArenaResponse = ActionResponse<{ arenaSlug: string }>;
export type LeaveArenaResponse = ActionResponse<{ arenaSlug: string }>;
export type JoinArenaResponse = ActionResponse<{ arenaSlug: string }>;
export type EditArenaResponse = ActionResponse<{ newArenaDetails: { name: string } }>;
export type ValidateArenaSlugResponse = ActionResponse;