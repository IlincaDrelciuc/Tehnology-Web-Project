import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('a@test.com');
  const [password, setPassword] = useState('pass123');

  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [newName, setNewName] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newShareable, setNewShareable] = useState(false);

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
      const msg = data.message || data.error || 'Could not load items';
      setMessage(msg);

      if (msg.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        setToken('');
        setItems([]);
      }
    }
  }

  async function addItem() {
    setMessage('');

    if (!newName || !newExpiry) {
      setMessage('Please enter name and expiry date');
      return;
    }

    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName,
        expiry_date: newExpiry,
        is_shareable: newShareable
      })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Item added!');
      setNewName('');
      setNewExpiry('');
      setNewShareable(false);
      await loadItems();
    } else {
      setMessage(data.message || data.error || 'Could not add item');
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
        <div style={{ maxWidth: 320 }}>
          <div>
            <label>Email</label><br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Password</label><br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />
          </div>

          <button onClick={handleLogin} style={{ marginTop: 15 }}>Login</button>

          {message && <p><b>{message}</b></p>}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 10 }}>
            <button onClick={loadItems}>Load my items</button>{' '}
            <button onClick={logout}>Logout</button>
          </div>

          {message && <p><b>{message}</b></p>}

          <h2>Add item</h2>
          <div style={{ maxWidth: 420 }}>
            <div>
              <label>Name</label><br />
              <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div style={{ marginTop: 10 }}>
              <label>Expiry date</label><br />
              <input type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} />
            </div>

            <div style={{ marginTop: 10 }}>
              <label>
                <input
                  type="checkbox"
                  checked={newShareable}
                  onChange={(e) => setNewShareable(e.target.checked)}
                />{' '}
                Shareable
              </label>
            </div>

            <button onClick={addItem} style={{ marginTop: 10 }}>Add</button>
          </div>

          <h2 style={{ marginTop: 25 }}>My items</h2>

          {items.length === 0 ? (
            <p>No items yet. Add one above, then click “Load my items”.</p>
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
