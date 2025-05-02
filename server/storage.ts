import { 
  users, 
  whitelistedSites, 
  adBlockStats, 
  type User, 
  type InsertUser, 
  type WhitelistedSite,
  type InsertWhitelistedSite,
  type AdBlockStat,
  type InsertAdBlockStat,
  type BrowserSettings,
  type AdBlockingStatistics
} from "@shared/schema";
import { db } from './db';
import { eq, desc, sql, and } from 'drizzle-orm';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Whitelist methods
  getAllWhitelistedSites(): Promise<WhitelistedSite[]>;
  getWhitelistedSite(id: number): Promise<WhitelistedSite | undefined>;
  addWhitelistedSite(site: InsertWhitelistedSite): Promise<WhitelistedSite>;
  removeWhitelistedSite(id: number): Promise<void>;
  updateWhitelistedSite(id: number, site: Partial<InsertWhitelistedSite>): Promise<WhitelistedSite>;
  isDomainWhitelisted(domain: string): Promise<boolean>;
  
  // Ad blocking statistics methods
  getAdBlockStats(): Promise<AdBlockingStatistics>;
  addAdBlockStat(stat: InsertAdBlockStat): Promise<AdBlockStat>;
  resetAdBlockStats(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize default whitelisted sites if none exist
    this.initializeDefaultSites();
  }

  private async initializeDefaultSites() {
    const existingSites = await db.select().from(whitelistedSites);
    
    if (existingSites.length === 0) {
      const defaultSites = [
        { domain: "example.com", enabled: true },
        { domain: "google.com", enabled: true },
        { domain: "github.com", enabled: true },
        { domain: "stackoverflow.com", enabled: true },
        { domain: "wikipedia.org", enabled: true }
      ];
      
      for (const site of defaultSites) {
        await this.addWhitelistedSite(site);
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Whitelist methods
  async getAllWhitelistedSites(): Promise<WhitelistedSite[]> {
    return db.select().from(whitelistedSites);
  }

  async getWhitelistedSite(id: number): Promise<WhitelistedSite | undefined> {
    const [site] = await db.select().from(whitelistedSites).where(eq(whitelistedSites.id, id));
    return site;
  }

  async addWhitelistedSite(insertSite: InsertWhitelistedSite): Promise<WhitelistedSite> {
    // Check if domain already exists
    const [existingSite] = await db
      .select()
      .from(whitelistedSites)
      .where(eq(whitelistedSites.domain, insertSite.domain));
    
    if (existingSite) {
      return existingSite;
    }
    
    const [site] = await db.insert(whitelistedSites).values(insertSite).returning();
    return site;
  }

  async removeWhitelistedSite(id: number): Promise<void> {
    await db.delete(whitelistedSites).where(eq(whitelistedSites.id, id));
  }

  async updateWhitelistedSite(id: number, updates: Partial<InsertWhitelistedSite>): Promise<WhitelistedSite> {
    const [updatedSite] = await db
      .update(whitelistedSites)
      .set(updates)
      .where(eq(whitelistedSites.id, id))
      .returning();
    
    if (!updatedSite) {
      throw new Error(`Whitelisted site with ID ${id} not found`);
    }
    
    return updatedSite;
  }

  async isDomainWhitelisted(domain: string): Promise<boolean> {
    // Check exact match first
    const [exactMatch] = await db
      .select()
      .from(whitelistedSites)
      .where(and(eq(whitelistedSites.domain, domain), eq(whitelistedSites.enabled, true)));
    
    if (exactMatch) {
      return true;
    }
    
    // Check if any parent domain is whitelisted (e.g., example.com would match sub.example.com)
    const domainParts = domain.split('.');
    for (let i = 1; i < domainParts.length - 1; i++) {
      const parentDomain = domainParts.slice(i).join('.');
      const [parentMatch] = await db
        .select()
        .from(whitelistedSites)
        .where(and(eq(whitelistedSites.domain, parentDomain), eq(whitelistedSites.enabled, true)));
      
      if (parentMatch) {
        return true;
      }
    }
    
    return false;
  }

  // Ad blocking statistics methods
  async getAdBlockStats(): Promise<AdBlockingStatistics> {
    try {
      const stats = await db.select().from(adBlockStats);
      
      // Calculate totals
      const adsBlocked = stats.reduce((sum, stat) => sum + stat.adsBlocked, 0);
      const trackersBlocked = stats.reduce((sum, stat) => sum + stat.trackersBlocked, 0);
      const totalBlocked = adsBlocked + trackersBlocked;
      
      // Get top blocked domains using SQL aggregation
      const topBlockedDomainsResult = await db
        .select({
          domain: adBlockStats.domain,
          count: sql<number>`sum(${adBlockStats.adsBlocked} + ${adBlockStats.trackersBlocked})`,
        })
        .from(adBlockStats)
        .groupBy(adBlockStats.domain)
        .orderBy(desc(sql`count`))
        .limit(10);
      
      const topBlockedDomains = topBlockedDomainsResult.map(result => ({
        domain: result.domain,
        count: result.count || 0, // Ensure count is never null
      }));
      
      return {
        adsBlocked,
        trackersBlocked,
        totalBlocked,
        topBlockedDomains
      };
    } catch (error) {
      console.error("Error fetching ad block stats:", error);
      
      // Return default empty stats if there's an error
      return {
        adsBlocked: 0,
        trackersBlocked: 0,
        totalBlocked: 0,
        topBlockedDomains: []
      };
    }
  }

  async addAdBlockStat(insertStat: InsertAdBlockStat): Promise<AdBlockStat> {
    const [stat] = await db.insert(adBlockStats).values(insertStat).returning();
    return stat;
  }

  async resetAdBlockStats(): Promise<void> {
    await db.delete(adBlockStats);
  }
}

export const storage = new DatabaseStorage();
