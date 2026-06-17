import { Router } from "express";

import { notFound } from "../errors.js";
import { ClickEvent } from "../models/click-event.js";
import { Link } from "../models/link.js";
import { getDeviceFamily, getReferrer, hashIp } from "../services/analytics.js";

const router = Router();

router.get("/:code", async (request, response, next) => {
  try {
    const link = await Link.findOne({ code: request.params.code });
    if (!link) {
      throw notFound("Short link not found");
    }

    const userAgent = request.get("user-agent") ?? "Unknown";

    await Promise.all([
      ClickEvent.create({
        linkId: link._id,
        code: link.code,
        referrer: getReferrer(request),
        userAgent,
        deviceFamily: getDeviceFamily(userAgent),
        ipHash: hashIp(request.ip),
        clickedAt: new Date()
      }),
      Link.updateOne({ _id: link._id }, { $inc: { clickCount: 1 } })
    ]);

    response.redirect(302, link.originalUrl);
  } catch (error) {
    next(error);
  }
});

export { router as redirectRouter };
