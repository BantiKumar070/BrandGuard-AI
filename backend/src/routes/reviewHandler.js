import { config } from "../config/env.js";
import { validateReviewRequest } from "../validators/requestSchema.js";
import { reviewContent } from "../services/reviewService.js";

// Kept free of Express so it can be unit-tested without starting a server.
export function createReviewHandler({ review = reviewContent, maxTextLength = config.maxTextLength } = {}) {
  return async function handleReview(req, res) {
    const validation = validateReviewRequest(req.body, maxTextLength);
    if (!validation.ok) {
      return res.status(400).json({
        error: { code: "INVALID_REQUEST", message: validation.errors[0], details: validation.errors },
      });
    }
    try {
      const result = await review(validation.value);
      return res.json(result);
    } catch (error) {
      console.error("Review failed:", error.message); // log the message only, never return internals
      return res.status(500).json({
        error: { code: "REVIEW_FAILED", message: "Something went wrong while reviewing. Please try again." },
      });
    }
  };
}
