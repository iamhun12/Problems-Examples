import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const RETRY_DELAY = [2, 5, 10, 20, 30, 60];
connectDB();
const message = getModel();
await generateQueue();

async function generateQueue() {
  // Generate a new transaction every second
  setInterval(() => {
    const trx = generateRandomTransaction();
    message.create(trx);
    console.log("New transaction added:", trx);
  }, 1000);

  // Process new message every segond
  setInterval(processMessage, 1000);
}

async function processMessage() {
  // Find message that match conditions
  const messageObj = await message
    .findOne({
      status: { $in: ["pending", "rejected"] },
      nextAttemptAt: { $lte: new Date() },
    })
    .sort({ createdAt: 1 });
  if (!messageObj) return;

  // Random trxId
  const randomID = Math.floor(Math.random() * 1000);

  if (randomID === messageObj.trxId) {
    messageObj.status = "success";
    netfeeCustomerRecharge();
  } else {
    messageObj.status = "rejected";
    messageObj.nextAttemptAt = getNextAttempt(messageObj.attemptCount);
    messageObj.attemptCount += 1;
    console.log("Failed to deliver message");
  }
  await messageObj.save();
}
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB Connected");
}

function getModel() {
  const messageSchema = new mongoose.Schema({
    trxId: Number,
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "success", "rejected"],
      default: "pending",
    },
    attemptCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    nextAttemptAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Message", messageSchema);
}

function generateRandomTransaction() {
  const amount = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

  const trxId = Math.floor(Math.random() * 1000);
  return {
    trxId,
    amount,
  };
}
function netfeeCustomerRecharge() {
  console.log("Your message was sent!");
}

function getNextAttempt(attemptCount) {
  let millisecondsRetry;
  if (attemptCount >= 5) {
    millisecondsRetry = 60 * 60 * 1000;
  } else {
    millisecondsRetry = RETRY_DELAY[attemptCount] * 60 * 1000;
  }
  return new Date(Date.now() + millisecondsRetry);
}
