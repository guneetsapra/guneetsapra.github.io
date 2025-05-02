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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sites: Map<number, WhitelistedSite>;
  private stats: Map<number, AdBlockStat>;
  private userCurrentId: number;
  private siteCurrentId: number;
  private statCurrentId: number;

  constructor() {
    this.users = new Map();
    this.sites = new Map();
    this.stats = new Map();
    this.userCurrentId = 1;
    this.siteCurrentId = 1;
    this.statCurrentId = 1;
    
    // Initialize with some default whitelisted sites
    const defaultSites = [
      { domain: "example.com", enabled: true },
      { domain: "google.com", enabled: true },
      { domain: "github.com", enabled: true },
      { domain: "stackoverflow.com", enabled: true },
      { domain: "wikipedia.org", enabled: true }
    ];
    
    defaultSites.forEach(site => {
      this.addWhitelistedSite(site);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Whitelist methods
  async getAllWhitelistedSites(): Promise<WhitelistedSite[]> {
    return Array.from(this.sites.values());
  }

  async getWhitelistedSite(id: number): Promise<WhitelistedSite | undefined> {
    return this.sites.get(id);
  }

  async addWhitelistedSite(insertSite: InsertWhitelistedSite): Promise<WhitelistedSite> {
    // Check if domain already exists
    const existingSite = Array.from(this.sites.values()).find(
      site => site.domain === insertSite.domain
    );
    
    if (existingSite) {
      return existingSite;
    }
    
    const id = this.siteCurrentId++;
    const site: WhitelistedSite = { ...insertSite, id };
    this.sites.set(id, site);
    return site;
  }

  async removeWhitelistedSite(id: number): Promise<void> {
    this.sites.delete(id);
  }

  async updateWhitelistedSite(id: number, updates: Partial<InsertWhitelistedSite>): Promise<WhitelistedSite> {
    const site = this.sites.get(id);
    if (!site) {
      throw new Error(`Whitelisted site with ID ${id} not found`);
    }
    
    const updatedSite = { ...site, ...updates };
    this.sites.set(id, updatedSite);
    return updatedSite;
  }

  async isDomainWhitelisted(domain: string): Promise<boolean> {
    const sites = Array.from(this.sites.values());
    
    // Check exact match first
    if (sites.some(site => site.domain === domain && site.enabled)) {
      return true;
    }
    
    // Check if any parent domain is whitelisted (e.g., example.com would match sub.example.com)
    const domainParts = domain.split('.');
    for (let i = 1; i < domainParts.length - 1; i++) {
      const parentDomain = domainParts.slice(i).join('.');
      if (sites.some(site => site.domain === parentDomain && site.enabled)) {
        return true;
      }
    }
    
    return false;
  }

  // Ad blocking statistics methods
  async getAdBlockStats(): Promise<AdBlockingStatistics> {
    const stats = Array.from(this.stats.values());
    
    // Calculate totals
    const adsBlocked = stats.reduce((sum, stat) => sum + stat.adsBlocked, 0);
    const trackersBlocked = stats.reduce((sum, stat) => sum + stat.trackersBlocked, 0);
    const totalBlocked = adsBlocked + trackersBlocked;
    
    // Aggregate by domain
    const domainCounts = new Map<string, number>();
    stats.forEach(stat => {
      const count = (domainCounts.get(stat.domain) || 0) + stat.adsBlocked + stat.trackersBlocked;
      domainCounts.set(stat.domain, count);
    });
    
    // Convert to array and sort by count
    const topBlockedDomains = Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
    
    return {
      adsBlocked,
      trackersBlocked,
      totalBlocked,
      topBlockedDomains
    };
  }

  async addAdBlockStat(insertStat: InsertAdBlockStat): Promise<AdBlockStat> {
    const id = this.statCurrentId++;
    const stat: AdBlockStat = { ...insertStat, id };
    this.stats.set(id, stat);
    return stat;
  }

  async resetAdBlockStats(): Promise<void> {
    this.stats.clear();
  }
}

export const storage = new MemStorage();
