"use server";

import db, { CName } from "@/service/mongodb";
import { PublicText } from "@/service/publicText/interface";
import { ObjectId } from "mongodb";
import { IUserText } from "./useUserText";
import { getUser } from "@/service/auth/auth";

export async function getUserText(
  limit: number,
  page: number
): Promise<{
  data: IUserText[];
  total: number;
  page: number;
  limit: number;
}> {
  const user = await getUser();
  if (!user)
    return {
      data: [],
      total: 0,
      page: 0,
      limit: 0,
    };

  const userObjectId = new ObjectId(user._id);
  const collection = db.collection<PublicText>(CName.PublicText);

  const total = await collection.countDocuments({ userId: userObjectId });
  const texts = await collection
    .find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const data: IUserText[] = texts.map((t) => ({
    id: t.id,
    text: t.text,
    language: t.language,
    createdAt:
      t.createdAt instanceof Date
        ? t.createdAt.toISOString()
        : String(t.createdAt),
    userId: t.userId?.toString() || "",
    isPublic: t.isPublic,
    expiresAt: null, // or t.expiresAt if you want to pass the real value
  }));

  return { data, total, page, limit };
}

export async function importText(textId: number) {
  const user = await getUser();
  if (!user) return 0;
  const userObjectId = new ObjectId(user._id);
  const collection = db.collection<PublicText>(CName.PublicText);
  // Find the text by id
  const text = await collection.findOne({ id: textId });
  if (!text) return false;
  if (text.userId) return false; // Already assigned
  // Assign userId
  const result = await collection.updateOne(
    { id: textId },
    { $set: { userId: userObjectId, expiresAt: null } }
  );
  return result.modifiedCount > 0;
}

export async function togglePrivet(textId: number) {
  const user = await getUser();
  if (!user) return false;
  const userObjectId = new ObjectId(user._id);
  const collection = db.collection<PublicText>(CName.PublicText);

  // Find the text owned by the user
  const text = await collection.findOne({ id: textId, userId: userObjectId });
  if (!text) return false;

  const newIsPublic = !text.isPublic;
  const result = await collection.updateOne(
    { id: textId, userId: userObjectId },
    { $set: { isPublic: newIsPublic } }
  );

  return result.modifiedCount > 0 ? newIsPublic : false;
}

export async function deleteText(textId: number) {
  const user = await getUser();
  if (!user) return false;
  const userObjectId = new ObjectId(user._id);
  const collection = db.collection<PublicText>(CName.PublicText);
  const result = await collection.deleteOne({ id: textId, userId: userObjectId });
  return result.deletedCount > 0;
}