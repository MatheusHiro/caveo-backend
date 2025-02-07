import app from './app/app';

// Process.env will always be comprised of strings, so we typecast the port to a
// number.
const PORT: number = 3006;

app.listen(PORT, function () {
    console.log('Server running on http://127.0.0.1:3006')
});