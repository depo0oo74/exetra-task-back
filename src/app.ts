import express from "express";
const app = express();

// ** Import and config dot env
import dotenv from "dotenv";
dotenv.config();

// ** Import and enable CORS
import cors from "cors";
const clientURL: string | any = process.env.CLIENT_URL
app.use(cors({
  origin: clientURL,
  credentials: true,
}));

// ** Import Database
import "./database";

// ** Import Routes
import authRoutes from "./routes/auth"

// ** Using Routes
app.use('/api/v1/auth', [authRoutes]);
app.use('*', (_, res) => {
  res.status(404).send({
    status: 'Error',
    message: '404 - Not found Api.'
  })
})


// ** PORT to run
const PORT = process.env.PORT || 5000;

// ** Listening the Server on specific PORT
app.listen(PORT, () => {
  console.log(`Server is running now on port ${PORT}`); 
});
