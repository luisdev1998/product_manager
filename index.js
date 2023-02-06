import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

connectDB();

const domin = [process.env.LOCAL];
const corsOptions = {
    origin: function(origin,callback){
        if(domin.indexOf(origin) !== -1){
            callback(null,true);
        }else{
            callback(new Error('No permitido por cors'));
        }
    }
};
app.use(cors(corsOptions));

app.use('/api/user',cors(), userRoutes);
app.use('/api/category',cors(), categoryRoutes);
app.use('/api/product',cors(), productRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("servidor funcionando en el puerto 4000")
});