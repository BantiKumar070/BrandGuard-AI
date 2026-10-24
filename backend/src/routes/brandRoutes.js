import { Router } from "express";
import sampleProfile from "../data/sampleBrandProfile.json" with { type: "json" };

export const brandRouter = Router();

// Gives the frontend a ready-made profile to start from.
brandRouter.get("/brand/sample", (req, res) => res.json(sampleProfile));
