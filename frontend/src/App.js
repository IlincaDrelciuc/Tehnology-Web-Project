import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('a@test.com');
  const [password, setPassword] = useState('pass123');
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  async function handleLogin() {
    setMessage('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setMessage('Login successful!');
    } else {
      setMessage(data.error || 'Login failed');
    }
  }

  async function loadItems() {
    setMessage('');

    const response = await fetch('/api/items', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      setItems(data);
      setMessage('Items loaded!');
    } else {
      setMessage(data.message || data.error || 'Could not load items');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setItems([]);
    setMessage('Logged out');
  }

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>Anti Food Waste App</h1>

      {!token ? (
        <div style={{ maxWidth: 300 }}>
          <div>
            <label>Email</label><br />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Password</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <button onClick={handleLogin} style={{ marginTop: 15 }}>
            Login
          </button>

          {message && <p>{message}</p>}
        </div>
      ) : (
        <div>
          <button onClick={loadItems}>Load my items</button>{' '}
          <button onClick={logout}>Logout</button>
          {message && <p>{message}</p>}

          <h2>My items</h2>

          {items.length === 0 ? (
            <p>No items yet. Add some using Postman for now.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <b>{item.name}</b> — expires {item.expiry_date} — shareable: {String(item.is_shareable)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
