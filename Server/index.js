import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB  from "./Database/database.js";
import userRoute from "./Routes/userRoute.js";
import courseRoute from "./Routes/courseRoute.js"

dotenv.config();

// call database connection
connectDB({});

const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
