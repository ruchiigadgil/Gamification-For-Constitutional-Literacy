const { Kafka } = require('kafkajs');
const { MongoClient, ObjectId } = require('mongodb');

const kafkaBroker = process.env.KAFKA_BROKER || 'kafka:9092';
const topic = process.env.KAFKA_TOPIC || 'leaderboard-updates';
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/mydb';
const consumerGroup = process.env.KAFKA_CONSUMER_GROUP || 'leaderboard-consumer-group';

async function run() {
  console.log('Starting Kafka consumer...');
  const kafka = new Kafka({ brokers: [kafkaBroker] });
  const consumer = kafka.consumer({ groupId: consumerGroup });

  await consumer.connect();
  console.log('Kafka consumer connected');
  await consumer.subscribe({ topic, fromBeginning: false });

  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB for leaderboard updates');

  const db = client.db();
  const usersColl = db.collection('users');
  const leaderboardCache = db.collection('leaderboard_cache');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value.toString();
        console.log('Message received on', topic, value.length, 'bytes');
        const payload = JSON.parse(value);

        // If fullDocument exists in payload, extract user id and xp
        const full = payload.fullDocument;
        if (full && full._id) {
          const userId = full._id;
          const name = full.fullName || full.name || full.email || 'Unknown';
          const xp = full.xp || 0;

          // Upsert into leaderboard collection for quick lookups
          // Debug: log types to help diagnose ObjectId issues
          try {
            console.log('DEBUG ObjectId constructor type:', typeof ObjectId);
            console.log('DEBUG userId value:', userId);
          } catch (dlogErr) {
            console.log('DEBUG logging error', dlogErr);
          }
          // Ensure ObjectId is constructed correctly (use `new ObjectId(...)`)
          const oid = new ObjectId(userId);
          await db.collection('leaderboard').updateOne(
            { userId: oid },
            { $set: { userId: oid, name, xp, updatedAt: new Date() } },
            { upsert: true }
          );

          // Recompute top 5 from users collection to ensure accuracy
          const top5 = await usersColl.find({}, { projection: { fullName: 1, xp: 1, email: 1 } })
            .sort({ xp: -1 })
            .limit(5)
            .toArray();

          const entries = top5.map((u, idx) => ({ rank: idx + 1, id: u._id, name: u.fullName || u.email, xp: u.xp || 0 }));

          await leaderboardCache.updateOne(
            { _id: 'top5' },
            { $set: { entries, updatedAt: new Date() } },
            { upsert: true }
          );

          console.log('Leaderboard cache updated with top5');
        } else {
          console.log('No fullDocument in payload, ignoring');
        }
      } catch (err) {
        console.error('Error processing message', err);
      }
    }
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down consumer...');
    await consumer.disconnect();
    await client.close();
    process.exit(0);
  });
}

run().catch(err => {
  console.error('Fatal error in consumer', err);
  process.exit(1);
});
