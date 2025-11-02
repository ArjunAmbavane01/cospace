import { Arena } from "./arena";
import { ChatGroup, Message } from "./chat";
import { ArenaUser } from "./arena";

export type ActionResponse<T = void> =
    | { type: "success"; message: string } & T
    | { type: "error"; message: string };

// arena actions
export type GetArenasResponse = ActionResponse<{ userArenas: Arena[] }>;
export type CreateArenaResponse = ActionResponse<{ arena: Arena }>;
export type DeleteArenaResponse = ActionResponse<{ arenaSlug: string }>;
export type LeaveArenaResponse = ActionResponse<{ arenaSlug: string }>;
export type JoinArenaResponse = ActionResponse<{ arenaSlug: string }>;
export type EditArenaResponse = ActionResponse<{ newArenaDetails: { name: string } }>;
export type GetArenaUsersResponse = ActionResponse<{ arenaUsers: ArenaUser[] }>;
export type ValidateArenaSlugResponse = ActionResponse;

// chat actions
export type GetChatMessagesResponse = ActionResponse<{ chatGroups: ChatGroup[] }>;
export type CreateChatGroupResponse = ActionResponse<{ newMessageGroup: { publicId: string; updatedAt: Date; createdAt: Date } }>;
export type GetChatGroupMessagesResponse = ActionResponse<{ groupMessages: { rows: Message[] } }>;
export type CreateMessageResponse = ActionResponse<{ createdMessage: Message }>;