CREATE TABLE "users_to_arenas" (
	"user_id" text NOT NULL,
	"arena_id" integer NOT NULL,
	CONSTRAINT "users_to_arenas_user_id_arena_id_pk" PRIMARY KEY("user_id","arena_id")
);
--> statement-breakpoint
CREATE TABLE "users_to_message_groups" (
	"user_id" text NOT NULL,
	"message_group_id" integer NOT NULL,
	CONSTRAINT "users_to_message_groups_user_id_message_group_id_pk" PRIMARY KEY("user_id","message_group_id")
);
--> statement-breakpoint
ALTER TABLE "users_to_arenas" ADD CONSTRAINT "users_to_arenas_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_arenas" ADD CONSTRAINT "users_to_arenas_arena_id_arenas_id_fk" FOREIGN KEY ("arena_id") REFERENCES "public"."arenas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_message_groups" ADD CONSTRAINT "users_to_message_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_message_groups" ADD CONSTRAINT "users_to_message_groups_message_group_id_message_groups_id_fk" FOREIGN KEY ("message_group_id") REFERENCES "public"."message_groups"("id") ON DELETE no action ON UPDATE no action;