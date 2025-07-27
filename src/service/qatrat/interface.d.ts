'use server';
import { ObjectId } from "mongodb";

export interface IQatarahComment { 
  _id: ObjectId;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  likedBy: ObjectId[];
  author: ObjectId ;
  authorReplies?: {
    _id: ObjectId; 
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    likedBy: ObjectId[];
  }[];
  replies?: {
    _id: ObjectId;
    author: ObjectId;
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    likedBy: ObjectId[];
  }[];
}

export interface IQatrat { 
  author: ObjectId;
  overview: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  openCount: number;
  readTimeS: number; // read time in Seconds
  likedBy: ObjectId[];
  comments:   IQatarahComment[]; 
  isPublic: boolean;
  isDraft: boolean;
  isArchived: boolean;
}