import app from './app/app';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = 3000

app.listen(PORT, function () {
    console.log(`Server running`)
});