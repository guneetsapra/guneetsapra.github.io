import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWhitelistedSiteSchema, insertAdBlockStatSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Whitelist routes
  app.get("/api/whitelist", async (req, res) => {
    try {
      const whitelistedSites = await storage.getAllWhitelistedSites();
      res.json(whitelistedSites);
    } catch (error) {
      res.status(500).json({ message: "Failed to get whitelisted sites" });
    }
  });

  app.post("/api/whitelist", async (req, res) => {
    try {
      const validatedData = insertWhitelistedSiteSchema.parse(req.body);
      const whitelistedSite = await storage.addWhitelistedSite(validatedData);
      res.status(201).json(whitelistedSite);
    } catch (error) {
      res.status(400).json({ message: "Invalid whitelist data" });
    }
  });

  app.delete("/api/whitelist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      await storage.removeWhitelistedSite(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove site from whitelist" });
    }
  });

  // Ad blocking statistics routes
  app.get("/api/adstats", async (req, res) => {
    try {
      const adStats = await storage.getAdBlockStats();
      res.json(adStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get ad blocking statistics" });
    }
  });

  app.post("/api/adstats", async (req, res) => {
    try {
      const validatedData = insertAdBlockStatSchema.parse(req.body);
      const adStat = await storage.addAdBlockStat(validatedData);
      res.status(201).json(adStat);
    } catch (error) {
      res.status(400).json({ message: "Invalid ad blocking stat data" });
    }
  });

  app.post("/api/adstats/reset", async (req, res) => {
    try {
      await storage.resetAdBlockStats();
      res.status(200).json({ message: "Ad blocking statistics reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset ad blocking statistics" });
    }
  });

  // URL check route
  app.post("/api/check-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const isWhitelisted = await storage.isDomainWhitelisted(domain);
        
        res.json({ isWhitelisted });
      } catch (error) {
        res.status(400).json({ message: "Invalid URL" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to check URL" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
