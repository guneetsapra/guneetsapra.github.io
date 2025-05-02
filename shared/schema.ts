import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const whitelistedSites = pgTable("whitelisted_sites", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  enabled: boolean("enabled").notNull().default(true),
});

export const adBlockStats = pgTable("ad_block_stats", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(),
  adsBlocked: integer("ads_blocked").notNull().default(0),
  trackersBlocked: integer("trackers_blocked").notNull().default(0),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWhitelistedSiteSchema = createInsertSchema(whitelistedSites).pick({
  domain: true,
  enabled: true,
});

export const insertAdBlockStatSchema = createInsertSchema(adBlockStats).pick({
  domain: true,
  adsBlocked: true,
  trackersBlocked: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWhitelistedSite = z.infer<typeof insertWhitelistedSiteSchema>;
export type WhitelistedSite = typeof whitelistedSites.$inferSelect;

export type InsertAdBlockStat = z.infer<typeof insertAdBlockStatSchema>;
export type AdBlockStat = typeof adBlockStats.$inferSelect;

export const urlSchema = z.object({
  url: z.string().url().or(z.string().min(1)),
});

export type Tab = {
  id: string;
  title: string;
  url: string;
  active: boolean;
  favIcon?: string;
};

export type BrowserSettings = {
  adBlockingEnabled: boolean;
  blockingLevel: 1 | 2 | 3;
  clearDataOnExit: boolean;
  blockPopups: boolean;
  doNotTrack: boolean;
};

export type AdBlockingStatistics = {
  adsBlocked: number;
  trackersBlocked: number;
  totalBlocked: number;
  topBlockedDomains: { domain: string; count: number }[];
};
