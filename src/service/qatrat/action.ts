"use server";
import { ObjectId } from "mongodb";
import db, { CName } from "../mongodb";
import { IQatarahComment, IQatrat } from "./interface";
import { getUser } from "../auth/auth";
import { User } from "../auth/interface";

// Types
export interface CreateQatratData {
  authorId: string; // Changed from ObjectId to string
  overview: string;
  body: string;
  isPublic?: boolean;
  isDraft?: boolean;
}

// Client-safe Qatarāt interface (no ObjectId)
export interface QatratWithId {
  _id: string;
  overview: string;
  body: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  openCount: number;
  readTimeS: number;
  likedBy: string[];
  comments: unknown[];
  isPublic: boolean;
  isDraft: boolean;
  isArchived: boolean;
}

// Create new Qatarāh
export const newQatrat = async (
  data: CreateQatratData
): Promise<QatratWithId> => {
  const now = new Date();
  const qatrat: IQatrat = {
    author: new ObjectId(data.authorId), // Convert string to ObjectId
    overview: data.overview,
    body: data.body,
    createdAt: now,
    updatedAt: now,
    openCount: 0,
    readTimeS: 0,
    likedBy: [],
    comments: [],
    isPublic: data.isPublic ?? false,
    isDraft: data.isDraft ?? true,
    isArchived: false,
  };
  console.log(qatrat);
  const result = await db.collection<IQatrat>(CName.Qatrat).insertOne(qatrat);

  // Convert to client-safe format
  return {
    _id: result.insertedId.toString(),
    overview: qatrat.overview,
    body: qatrat.body,
    author: data.authorId, // Keep original string
    createdAt: qatrat.createdAt,
    updatedAt: qatrat.updatedAt,
    openCount: qatrat.openCount,
    readTimeS: qatrat.readTimeS,
    likedBy: [], // Empty array as strings
    comments: [],
    isPublic: qatrat.isPublic,
    isDraft: qatrat.isDraft,
    isArchived: qatrat.isArchived,
  };
};

// Get my Qatarāt (all including private and draft) with pagination
export const getMyQatrat = async (
  page: number = 1,
  limit: number = 50,
  archived: boolean = false
): Promise<{ qatrat: QatratWithId[]; total: number; hasMore: boolean }> => {
  const user = await getUser();
  if (!user) return { qatrat: [], total: 0, hasMore: false };
  const skip = (page - 1) * limit;

  const [qatrat, total] = await Promise.all([
    db
      .collection<IQatrat>(CName.Qatrat)
      .find({ author: new ObjectId(user._id), isArchived: archived }) // Convert string to ObjectId
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db
      .collection<IQatrat>(CName.Qatrat)
      .countDocuments({ author: new ObjectId(user._id), isArchived: archived }),
  ]);

  // Convert ObjectIds to strings for client compatibility
  const clientQatrat: QatratWithId[] = qatrat.map((q) => ({
    ...q,
    _id: q._id.toString(),
    author: q.author.toString(),
    likedBy: q.likedBy.map((id) => id.toString()),
  })) as QatratWithId[];

  return {
    qatrat: clientQatrat,
    total,
    hasMore: skip + limit < total,
  };
};

// Get single Qatarāh by ID
export const getQatrat = async (id: string): Promise<QatratWithId | null> => {
  const qatrat = await db
    .collection<IQatrat>(CName.Qatrat)
    .findOne({ _id: new ObjectId(id) });
  if (!qatrat) return null;

  return JSON.parse(JSON.stringify({
    ...qatrat,
    _id: qatrat._id.toString(),
    author: qatrat.author.toString(),
    likedBy: qatrat.likedBy.map((id) => id.toString()),
  })) as QatratWithId;
};

// Search Qatarāt by text with pagination
export const searchQatrat = async (
  searchText: string,
  page: number = 1,
  limit: number = 10
): Promise<{ qatrat: QatratWithId[]; total: number; hasMore: boolean }> => {
  const skip = (page - 1) * limit;

  const [qatrat, total] = await Promise.all([
    db
      .collection<IQatrat>(CName.Qatrat)
      .find({
        $text: { $search: searchText },
        isPublic: true,
        isDraft: false,
        isArchived: false,
      })
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<IQatrat>(CName.Qatrat).countDocuments({
      $text: { $search: searchText },
      isPublic: true,
      isDraft: false,
      isArchived: false,
    }),
  ]);

  // Convert ObjectIds to strings for client compatibility
  const clientQatrat: QatratWithId[] = qatrat.map((q) => ({
    ...q,
    _id: q._id.toString(),
    author: q.author.toString(),
    likedBy: q.likedBy.map((id) => id.toString()),
  })) as QatratWithId[];

  return {
    qatrat: clientQatrat,
    total,
    hasMore: skip + limit < total,
  };
};

// Get user's public Qatarāt with pagination
export const getUserQatrat = async (
  userId: string, // Changed from ObjectId to string
  page: number = 1,
  limit: number = 50
): Promise<{ qatrat: QatratWithId[]; total: number; hasMore: boolean }> => {
  const skip = (page - 1) * limit;

  const [qatrat, total] = await Promise.all([
    db
      .collection<IQatrat>(CName.Qatrat)
      .find({
        author: new ObjectId(userId), // Convert string to ObjectId
        isPublic: true,
        isDraft: false,
        isArchived: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<IQatrat>(CName.Qatrat).countDocuments({
      author: new ObjectId(userId),
      isPublic: true,
      isDraft: false,
      isArchived: false,
    }),
  ]);

  // Convert ObjectIds to strings for client compatibility
  const clientQatrat: QatratWithId[] = qatrat.map((q) => ({
    ...q,
    _id: q._id.toString(),
    author: q.author.toString(),
    likedBy: q.likedBy.map((id) => id.toString()),
  })) as QatratWithId[];

  return {
    qatrat: clientQatrat,
    total,
    hasMore: skip + limit < total,
  };
};

// Make Qatarāh private
export const makePrivate = async (
  id: string,
  authorId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { _id: new ObjectId(id), author: new ObjectId(authorId) },
      {
        $set: {
          isPublic: false,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error making Qatarāh private:", error);
    return false;
  }
};

// Save Qatarāh as draft
export const saveAsDraft = async (
  id: string,
  authorId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { id, author: new ObjectId(authorId) },
      {
        $set: {
          isDraft: true,
          isPublic: false,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error saving Qatarāh as draft:", error);
    return false;
  }
};

// Move Qatarāh to archive
export const moveToArchive = async (
  id: string,
  authorId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { id, author: new ObjectId(authorId) },
      {
        $set: {
          isArchived: true,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error moving Qatarāh to archive:", error);
    return false;
  }
};

// Pull Qatarāh from archive
export const pullFromArchive = async (
  id: string,
  authorId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { _id: new ObjectId(id), author: new ObjectId(authorId) },
      {
        $set: {
          isArchived: false,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error pulling Qatarāh from archive:", error);
    return false;
  }
};

// Publish Qatarāh
export const publishQatrat = async (
  id: string,
  authorId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { _id: new ObjectId(id), author: new ObjectId(authorId) },
      {
        $set: {
          isPublic: true,
          isDraft: false,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error publishing Qatarāh:", error);
    return false;
  }
};

// Update Qatarāh content
export const updateQatrat = async (
  id: string,
  authorId: string,
  updates: Partial<Pick<IQatrat, "overview" | "body">>
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { _id: new ObjectId(id), author: new ObjectId(authorId) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating Qatarāh:", error);
    return false;
  }
};

// Increment open count
export const incrementOpenCount = async (id: string): Promise<void> => {
  try {
    await db
      .collection<IQatrat>(CName.Qatrat)
      .updateOne({ _id: new ObjectId(id) }, { $inc: { openCount: 1 } });
  } catch (error) {
    console.error("Error incrementing open count:", error);
  }
};

// Get public Qatarāt feed
export const getPublicQatratFeed = async (
  page: number = 1,
  limit: number = 20
): Promise<{ qatrat: QatratWithId[]; total: number; hasMore: boolean }> => {
  const skip = (page - 1) * limit;

  const [qatrat, total] = await Promise.all([
    db
      .collection<IQatrat>(CName.Qatrat)
      .find({
        isPublic: true,
        isDraft: false,
        isArchived: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<IQatrat>(CName.Qatrat).countDocuments({
      isPublic: true,
      isDraft: false,
      isArchived: false,
    }),
  ]);

  // Convert ObjectIds to strings for client compatibility
  const clientQatrat: QatratWithId[] = qatrat.map((q) => ({
    ...q,
    _id: q._id.toString(),
    author: q.author.toString(),
    likedBy: q.likedBy.map((id) => id.toString()),
  })) as unknown as QatratWithId[];

  return {
    qatrat: JSON.parse(JSON.stringify(clientQatrat)),
    total,
    hasMore: skip + limit < total,
  };
};

// Like a Qatarāh
export const likeQatrat = async (
  id: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await db
      .collection<IQatrat>(CName.Qatrat)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $addToSet: { likedBy: new ObjectId(userId) },
          $set: { updatedAt: new Date() },
        }
      );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error liking Qatarāh:", error);
    return false;
  }
};

// Unlike a Qatarāh
export const unlikeQatrat = async (
  id: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await db
      .collection<IQatrat>(CName.Qatrat)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $pull: { likedBy: new ObjectId(userId) },
          $set: { updatedAt: new Date() },
        }
      );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error unliking Qatarāh:", error);
    return false;
  }
};

// Add a comment to a Qatarāh
export const addQatratComment = async (
  id: string,
  userId: string,
  content: string
): Promise<boolean> => {
  try {
    const comment: IQatarahComment = {
      _id: new ObjectId(),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likedBy: [],
      author: new ObjectId(userId),
      authorReplies: [],
      replies: [],
    };
    const result = await db
      .collection<IQatrat>(CName.Qatrat)
      .updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: comment }, $set: { updatedAt: new Date() } }
      );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error adding comment:", error);
    return false;
  }
};

// Like a comment on a Qatarāh
export const likeComment = async (
  qatarahId: string,
  commentId: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { _id: new ObjectId(qatarahId), "comments._id": new ObjectId(commentId) },
      {
        $addToSet: { "comments.$.likedBy": new ObjectId(userId) },
        $set: { updatedAt: new Date() },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error liking comment:", error);
    return false;
  }
};

// Unlike a comment on a Qatarāh
export const unlikeComment = async (
  qatarahId: string,
  commentId: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await db.collection<IQatrat>(CName.Qatrat).updateOne(
      { _id: new ObjectId(qatarahId), "comments._id": new ObjectId(commentId) },
      {
        $pull: { "comments.$.likedBy": new ObjectId(userId) },
        $set: { updatedAt: new Date() },
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error unliking comment:", error);
    return false;
  }
};

export interface IClientComment {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  totalLiked: number;
  likedByMe: boolean;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  authorReplies?: {
    _id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    totalLiked: number;
    likedByMe: boolean;
  }[];
  replies?: {
    _id: string;
    author: {
      _id: string;
      name: string;
      picture: string;
    };
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    totalLiked: number;
    likedByMe: boolean;
  }[];
}
// Get comments for a Qatarāh
export const getQatratComments = async (
  id: string,
  userId?: string
): Promise<IClientComment[]> => {
  const qatrat = await db
    .collection<IQatrat>(CName.Qatrat)
    .findOne({ _id: new ObjectId(id) });
  if (!qatrat) return [];
  const comments: IClientComment[] = [];
  for (const comment of qatrat.comments) {
    const commentAuthor = await db
      .collection<User>(CName.User)
      .findOne({ _id: comment.author });
    const c = await {
      _id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt.toString(),
      updatedAt: comment.updatedAt.toString(),
      totalLiked: comment.likedBy.length,
      likedByMe: userId
        ? comment.likedBy.includes(new ObjectId(userId))
        : false,
      author: {
        _id: comment.author.toString(),
        name: commentAuthor?.firstName ?? "",
        picture: commentAuthor?.picture ?? "",
      },
      authorReplies: comment.authorReplies?.map((reply) => ({
        _id: reply._id.toString(),
        content: reply.content,
        createdAt: reply.createdAt.toString(),
        updatedAt: reply.updatedAt.toString(),
        totalLiked: reply.likedBy.length,
        likedByMe: userId
          ? reply.likedBy.includes(new ObjectId(userId))
          : false,
      })),
      _replies: comment.replies?.map(async (reply) => {
        const cau = await db
          .collection<User>(CName.User)
          .findOne({ _id: reply.author });
        return {
          _id: reply._id.toString(),
          author: {
            _id: reply.author.toString(),
            name: cau?.firstName ?? "",
            picture: cau?.picture ?? "",
          },
          content: reply.content,
          createdAt: reply.createdAt.toString(),
          updatedAt: reply.updatedAt.toString(),
          totalLiked: reply.likedBy.length,
          likedByMe: userId
            ? reply.likedBy.includes(new ObjectId(userId))
            : false,
        };
      }),
      replies: {},
    };

    const cx = await Promise.all(c._replies ?? []);
    c.replies = cx;
    comments.push({
      ...c,
      replies: cx,
    });
  }
  return comments;
};
