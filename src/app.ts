import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import storeRouter from "./routes/store";
import reviewRouter from "./routes/review";
import procuctRouter from "./routes/product";
import sellerRouter from "./routes/purchase";
import categoryRouter from "./routes/category";
import cartRouter from "./routes/cart";

const app = express();

app.use(
  cors({
    origin: "venda-facil-front.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/stores", storeRouter);
app.use("/api/products", procuctRouter);
app.use("/api/purchases", sellerRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cart", cartRouter);

export default app;
