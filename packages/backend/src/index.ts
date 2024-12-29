import { authorizeController } from './controllers';
import express from 'express';
import { internalController } from './controllers/internal';

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, _, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});
app.use('/', authorizeController.getRoutes(), internalController.getRoutes());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
