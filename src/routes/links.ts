import { Router } from "express";
import mongoose from "mongoose";

import { ApiError, notFound } from "../errors.js";
import { ClickEvent } from "../models/click-event.js";
import { Link } from "../models/link.js";
import { config } from "../config.js";
import { generateCode } from "../services/code.js";
import { normalizeUrl, validateAlias } from "../services/url.js";

const router = Router();
const maxCodeAttempts = 5;

router.post("/", async (request, response, next) => {
  try {
    const originalUrl = normalizeUrl(String(request.body?.url ?? ""));
    const alias = validateAlias(request.body?.alias);

    for (let attempt = 0; attempt < maxCodeAttempts; attempt += 1) {
      const code = alias ?? generateCode();

      try {
        const link = await Link.create({ code, originalUrl });
        return response.status(201).json(formatLink(link));
      } catch (error) {
        if (isDuplicateKey(error)) {
          if (alias) {
            throw new ApiError(409, "ALIAS_TAKEN", "That alias is already taken");
          }

          continue;
        }

        throw error;
      }
    }

    throw new ApiError(503, "CODE_GENERATION_FAILED", "Could not generate a unique short code");
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_request, response, next) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).limit(100).lean();
    response.json({
      links: links.map(formatLink)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:code/analytics", async (request, response, next) => {
  try {
    const link = await Link.findOne({ code: request.params.code }).lean();
    if (!link) {
      throw notFound("Short link not found");
    }

    const linkId = link._id;
    const [daily, referrers, devices] = await Promise.all([
      ClickEvent.aggregate([
        { $match: { linkId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" } },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      ClickEvent.aggregate([
        { $match: { linkId } },
        { $group: { _id: "$referrer", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1, _id: 1 } },
        { $limit: 8 }
      ]),
      ClickEvent.aggregate([
        { $match: { linkId } },
        { $group: { _id: "$deviceFamily", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1, _id: 1 } }
      ])
    ]);

    response.json({
      link: formatLink(link),
      analytics: {
        totalClicks: link.clickCount,
        daily: daily.map((item) => ({ date: item._id, clicks: item.clicks })),
        referrers: referrers.map((item) => ({ name: item._id, clicks: item.clicks })),
        devices: devices.map((item) => ({ name: item._id, clicks: item.clicks }))
      }
    });
  } catch (error) {
    next(error);
  }
});

function formatLink(link: {
  code: string;
  originalUrl: string;
  clickCount: number;
  createdAt: Date;
}) {
  return {
    code: link.code,
    originalUrl: link.originalUrl,
    shortUrl: `${config.publicBaseUrl}/${link.code}`,
    clickCount: link.clickCount,
    createdAt: link.createdAt
  };
}

function isDuplicateKey(error: unknown) {
  return error instanceof mongoose.mongo.MongoServerError && error.code === 11000;
}

export { router as linksRouter };
