CREATE TABLE IF NOT EXISTS "media_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"large_object_id" integer NOT NULL,
	"title" jsonb,
	"credits" text,
	"license" text,
	"mime_type" text,
	"src_uri" text,
	"size_bytes" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now()
);
