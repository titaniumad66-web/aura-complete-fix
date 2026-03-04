CREATE TABLE "templates" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "image_url" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
