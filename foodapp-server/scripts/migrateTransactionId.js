require("dotenv").config();
const mongoose = require("mongoose");

const run = async () => {
  if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error("Missing DB_USER or DB_PASSWORD");
  }

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xfnxnsj.mongodb.net/?appName=Cluster0`;
  await mongoose.connect(uri);

  const collection = mongoose.connection.collection("payments");

  const result = await collection.updateMany(
    {
      transactionId: { $exists: false },
      transitionId: { $exists: true, $type: "string", $ne: "" },
    },
    [
      {
        $set: {
          transactionId: "$transitionId",
        },
      },
    ]
  );

  const cleanup = await collection.updateMany(
    { transitionId: { $exists: true } },
    { $unset: { transitionId: "" } }
  );

  console.log(
    `Migration complete. updated=${result.modifiedCount}, cleaned=${cleanup.modifiedCount}`
  );
};

run()
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
