import { Schema, model, Types, type InferSchemaType } from "mongoose";

const clickEventSchema = new Schema(
  {
    linkId: { type: Types.ObjectId, ref: "Link", required: true },
    code: { type: String, required: true },
    referrer: { type: String, required: true, default: "Direct" },
    userAgent: { type: String, required: true, default: "Unknown" },
    deviceFamily: { type: String, required: true, default: "Other" },
    ipHash: { type: String, required: true },
    clickedAt: { type: Date, required: true, default: Date.now }
  },
  { versionKey: false }
);

clickEventSchema.index({ linkId: 1, clickedAt: -1 });
clickEventSchema.index({ linkId: 1, referrer: 1 });

export type ClickEventDocument = InferSchemaType<typeof clickEventSchema>;
export const ClickEvent = model("ClickEvent", clickEventSchema);
