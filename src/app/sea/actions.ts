"use server";

import { getCurrentUser } from '@/service/auth/auth';
import db, { CName } from '@/service/mongodb';
import { User } from '@/service/auth/interface';

export async function searchUsers(query: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    if (!query || query.trim().length < 2) {
      return { success: true, users: [] };
    }

    // Search users by firstName or lastName (case-insensitive)
    const users = await db
      .collection<User>(CName.User)
      .find(
        { 
          $or: [
            { firstName: { $regex: query.trim(), $options: 'i' } },
            { lastName: { $regex: query.trim(), $options: 'i' } }
          ]
        },
        { projection: { email: 0, password: 0 } }
      )
      .limit(10)
      .toArray();
    
    // Filter out the current user and sensitive data
    const filteredUsers = users
      .filter(user => user._id.toString() !== currentUser._id)
      .map(user => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName || ''}`.trim(),
        persona: user.persona,
        picture: user.picture
      }));

    return { success: true, users: filteredUsers };
  } catch (error) {
    console.error('Search users error:', error);
    return { success: false, error: 'Failed to search users' };
  }
}

export async function getRecentUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    // Get recent users (last 10 users)
    const recentUsers = await db
      .collection<User>(CName.User)
      .find({}, { projection: { email: 0, password: 0 } })
      .limit(10)
      .toArray();
    
    // Filter out the current user and sensitive data
    const filteredUsers = recentUsers
      .filter(user => user._id.toString() !== currentUser._id)
      .map(user => ({
        _id: user._id.toString(),
        name: `${user.firstName} ${user.lastName || ''}`.trim(),
        persona: user.persona,
        picture: user.picture
      }));

    return { success: true, users: filteredUsers };
  } catch (error) {
    console.error('Get recent users error:', error);
    return { success: false, error: 'Failed to get recent users' };
  }
} 