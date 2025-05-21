import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const API = 'http://localhost:3000';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(API + '/api/videos').then(res => setVideos(res.data));
    axios.get(API + '/api/me', { withCredentials: true }).then(res => setUser(res.data));
  }, []);

  const login = () => {
    axios.post(API + '/api/login', form, { withCredentials: true })
      .then(res => setUser({ username: form.username, role: res.data.role }))
      .catch(() => alert('Login failed'));
  };

  const upload = () => {
    const data = new FormData();
    data.append('video', file);
    axios.post(API + '/api/upload', data, { withCredentials: true })
      .then(() => window.location.reload())
      .catch(() => alert('Upload failed'));
  };

  const filteredVideos = videos.filter(v => v.endsWith('.mp4'));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mini YouTube Clone</h1>

      {!user?.username && (
        <div className="space-y-2">
          <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} className="input" />
          <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} className="input" />
          <button onClick={login} className="btn">Login</button>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="my-4 space-y-2">
          <input type="file" onChange={e => setFile(e.target.files[0])} className="input" />
          <button onClick={upload} className="btn">Upload Video</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {filteredVideos.map(name => (
          <video key={name} controls className="w-full rounded shadow">
            <source src={`${API}/uploads/${name}`} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
}
