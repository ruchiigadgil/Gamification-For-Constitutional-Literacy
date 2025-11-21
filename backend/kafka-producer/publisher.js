const { MongoClient } = require('mongodb');
const { Kafka } = require('kafkajs');

const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/mydb';
const kafkaBroker = process.env.KAFKA_BROKER || 'kafka:9092';
const topic = process.env.KAFKA_TOPIC || 'leaderboard-updates';

async function run() {
  console.log('Starting Kafka publisher...');
  const kafka = new Kafka({ brokers: [kafkaBroker] });
  const producer = kafka.producer();
  await producer.connect();
  console.log('Kafka producer connected');

  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB for change stream');

  const db = client.db();
  const coll = db.collection('users');

  const changeStream = coll.watch([], { fullDocument: 'updateLookup' });
  console.log('Listening to change stream on users collection...');

  changeStream.on('change', async (change) => {
    try {
      console.log('Change detected:', change.operationType);
      const payload = {
        operationType: change.operationType,
        documentKey: change.documentKey,
        fullDocument: change.fullDocument
      };

      await producer.send({ topic, messages: [{ value: JSON.stringify(payload) }] });
      console.log('Published change to Kafka topic', topic);
    } catch (err) {
      console.error('Error publishing change to Kafka', err);
    }
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await changeStream.close();
    await producer.disconnect();
    await client.close();
    process.exit(0);
  });
}

run().catch(err => {
  console.error('Fatal error in publisher', err);
  process.exit(1);
});
