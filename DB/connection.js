import mongoose from "mongoose";

export const connectDB = async (req, res, next) => {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/Chatting")
    .then(() => {
      console.log("db connected!");
    })
    .catch((err) => {
      console.log("db failed to connect!", err);
    });
};
