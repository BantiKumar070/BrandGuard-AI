import { Router } from "express";
import { createReviewHandler } from "./reviewHandler.js";

export const reviewRouter = Router();
reviewRouter.post("/review", createReviewHandler());
