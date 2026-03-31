import 'dotenv/config'
import app from '@/app';

const PORT = process.env.PORT || 3001;

(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('Failed to start server:', e);
        process.exit(1);
    }
})()