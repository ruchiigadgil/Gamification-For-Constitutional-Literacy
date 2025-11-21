/**
 * Seed script: compute top-5 users by xp and upsert into leaderboard_cache._id='top5'
 * Usage: run inside the kafka-consumer container (it already has mongodb installed)
 */
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Prefer container env var; fallback to reading ../auth-server/.env if present
let uri = process.env.MONGODB_URI;
if (!uri) {
  try {
    const data = fs.readFileSync('../auth-server/.env', 'utf8');
    const match = data.split(/\r?\n/).find(l => l.trim().startsWith('MONGODB_URI='));
    if (match) uri = match.split('=')[1].trim();
  } catch (e) {
    // ignore
  }
}
uri = uri || 'mongodb://mongo:27017/mydb';

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB for seeding leaderboard_cache');
    const db = client.db();
    const usersColl = db.collection('users');

    const top5 = await usersColl.find({}, { projection: { fullName: 1, xp: 1, email: 1 } })
      .sort({ xp: -1 })
      .limit(5)
      .toArray();

    const entries = top5.map((u, idx) => ({ rank: idx + 1, id: u._id, name: u.fullName || u.email, xp: u.xp || 0 }));

    await db.collection('leaderboard_cache').updateOne(
      { _id: 'top5' },
      { $set: { entries, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log('Seeded leaderboard_cache.top5 with entries:', JSON.stringify(entries, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed leaderboard cache', err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch (e) {}
  }
})();
