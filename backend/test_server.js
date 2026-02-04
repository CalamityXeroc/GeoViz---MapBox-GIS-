const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => res.send('Back-end is working on Port 5000!'));
app.get('/api/blog', (req, res) => res.json({ success: true, message: 'Test API works' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on http://0.0.0.0:${PORT}`);
});
