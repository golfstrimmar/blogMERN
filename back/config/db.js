// /config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  // try {
  //   const conn = await mongoose.connect(process.env.MONGO_URI, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   console.log(`MongoDB Connected: ${conn.connection.host}`);
  // } catch (error) {
  //   console.error(`Error: ${error.message}`);
  //   process.exit(1); // Завершаем процесс при ошибке
  // }
  try {
    await mongoose.connect('mongodb+srv://yushinbox:golfstrimmar1966@blog.vejfx.mongodb.net/blog');
    console.log('MongoDB connected');
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
    process.exit(1);
  }
};
