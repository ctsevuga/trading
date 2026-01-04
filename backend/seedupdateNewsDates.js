import dotenv from "dotenv";
import mongoose from "mongoose";
import StockMarketNews from "./models/StockMarketNews.js"; // adjust path to your model
import connectDB from "./config/db.js"; // your DB connection helper

dotenv.config();

// -------------------------------
// Seeder function: Update news dates
// -------------------------------
const updateNewsDates = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    // Find all news documents
    const newsDocs = await StockMarketNews.find({});
    console.log(`Found ${newsDocs.length} news records.`);

    let updatedCount = 0;

    for (const doc of newsDocs) {
      const originalDate = doc.date; // e.g., 2026-01-03T17:43:19.104Z

      // Only update if date is 2026-01-03
      const year = originalDate.getUTCFullYear();
      const month = originalDate.getUTCMonth(); // 0 = January
      const day = originalDate.getUTCDate();

      if (year === 2026 && month === 0 && day === 3) {
        const newDate = new Date(originalDate);
        newDate.setUTCDate(2); // change day to 2
        doc.date = newDate;
        await doc.save();
        updatedCount++;
        console.log(`Updated ${doc._id}: ${originalDate.toISOString()} → ${newDate.toISOString()}`);
      }
    }

    console.log(`✅ Updated ${updatedCount} news records successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to update news dates:", error);
    process.exit(1);
  }
};

// Run the seeder
updateNewsDates();
