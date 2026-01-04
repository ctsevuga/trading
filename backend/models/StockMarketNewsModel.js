import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

const StockMarketNewsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    url: String,
    published_at: {
  type: Date,
  required: true,
},
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

StockMarketNewsSchema.plugin(mongoosePaginate);

export default mongoose.model('StockMarketNews', StockMarketNewsSchema);

