import { authorizeController } from './controllers';
import express from 'express';

const app = express();
const port = 3000;

app.use('/', authorizeController.getRoutes());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
