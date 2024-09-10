import {
  bigint,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export type TranslatableText = {
  [key in 'de' | 'pt' | 'en' | 'it' | 'fr' | 'es' | 'nl']?: string
}

export const mediaFile = pgTable('media_file', {
  id: uuid('id').primaryKey().defaultRandom(),
  largeObjectId: integer('large_object_id').notNull(),

  title: jsonb('title').$type<TranslatableText>(),
  credits: text('credits'),
  license: text('license'),
  mimeType: text('mime_type'),
  srcUri: text('src_uri'),
  size_bytes: bigint('size_bytes', { mode: 'number' }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
})
