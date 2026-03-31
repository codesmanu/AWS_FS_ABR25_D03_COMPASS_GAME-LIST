import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookie_parser from 'cookie-parser';

import routes from '@/routes/hub';
import error from '@/shared/error';

const app = express();

app.use(express.json());
app.use(cookie_parser());
app.use(morgan('dev'));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.use('/api', routes);
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        code: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});
app.use(error);

export default app;