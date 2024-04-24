import express from "express";
import 'dotenv/config'
import {connectToMongoDB} from "./db.js";
import bodyParser from "body-parser";
import {userRouter} from "./routes/user.routes.js";
import {blogRouter} from "./routes/blog.routes.js";
import { userBlogRouter } from "./routes/userblog.routes.js";
import { verifyToken } from "./middleware/middelwares.js";
import cors from 'cors'


 export const app = express();
const port = process.env.PORT || 3000;

connectToMongoDB();

app.use(cors())
app.use(express.json())
app.use('/user', userRouter);
app.use('/myblog', verifyToken, userBlogRouter);
app.use('/blog', blogRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(` App listening at http://localhost:${port}`);
});