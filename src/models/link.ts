import { Schema, model, type InferSchemaType } from "mongoose";

const linkSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    originalUrl: { type: String, required: true, trim: true },
    clickCount: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true }
);

linkSchema.index({ createdAt: -1 });

export type LinkDocument = InferSchemaType<typeof linkSchema> & { _id: unknown };
export const Link = model("Link", linkSchema);
