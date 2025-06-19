import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoute from "./routes/adminRoute";
import feedbackRoute from "./routes/feedbackRoutes";
import adminPanelRoutes from "./routes/adminPanelRoutes";
import productRoutes from "./routes/productRoute"
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8081;

app.get("/", (req, res) => {
	console.log("Hello From the Server");
	res.status(200).json({ success: "This is message for the success" });
});
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/admin-panel", adminPanelRoutes);

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📍 Server URL: http://localhost:${PORT}`);
});
