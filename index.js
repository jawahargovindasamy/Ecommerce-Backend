import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Database/dbConfig.js';
import authRoute from './Routers/authRoute.js';
import productRoute from './Routers/productRoute.js';
import cartRoute from './Routers/cartRoute.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API!');
});

app.use('/api/auth',authRoute);
app.use('/api/products',productRoute);
app.use('/api/cart',cartRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

