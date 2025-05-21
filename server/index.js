const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({ secret: 'gitpod-secret', resave: false, saveUninitialized: true }));

const upload = multer({ dest: 'uploads/' });

// Dummy users
const USERS = {
  admin: { password: 'admin123', role: 'admin' },
  user: { password: 'user123', role: 'user' }
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (user && user.password === password) {
    req.session.user = { username, role: user.role };
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get('/api/me', (req, res) => {
  res.json(req.session.user || {});
});

app.post('/api/upload', upload.single('video'), (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ filename: req.file.filename });
});

app.get('/api/videos', (req, res) => {
  const files = fs.readdirSync('uploads').filter(f => f !== '.gitkeep');
  res.json(files);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
