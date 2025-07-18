import db, { CName } from "../mongodb";

export async function totalUsers() {
    const total = await db.collection(CName.User).countDocuments()
    return total;
}