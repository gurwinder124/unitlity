import express, { Request, Response } from 'express';
import router_v1 from './payment/routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config'



const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON

app.use(cors())
app.use(express.json());

// Example route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript with Node.js!');
// });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router_v1);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
