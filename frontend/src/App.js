import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('a@test.com');
  const [password, setPassword] = useState('pass123');

  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);
  const [shareableItems, setShareableItems] = useState([]);
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
        setShareableItems([]);
      }
    }
  }

  async function loadShareableItems() {
    setMessage('');

    const response = await fetch('/api/items/shareable', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      setShareableItems(data);
      setMessage('Shareable items loaded!');
    } else {
      const msg = data.message || data.error || 'Could not load shareable items';
      setMessage(msg);

      if (msg.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        setToken('');
        setItems([]);
        setShareableItems([]);
      }
    }
  }

  async function claimItem(itemId) {
    setMessage('');

    const response = await fetch(`/api/items/${itemId}/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Item claimed!');
      await loadShareableItems();
    } else {
      const msg = data.error || data.message || 'Could not claim item';
      setMessage(msg);

      if (msg.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        setToken('');
        setItems([]);
        setShareableItems([]);
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
    setShareableItems([]);
    setMessage('Logged out');
  }

  function getExpiryStatus(expiryDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'EXPIRED', color: 'crimson' };
    if (diffDays <= 2) return { label: 'EXPIRING SOON', color: 'darkorange' };
    return null;
  }

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>Anti Food Waste App</h1>

      {!token ? (
        <div style={{ maxWidth: 320 }}>
          <div>
            <label>Email</label>
            <br />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Password</label>
            <br />
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

          {message && (
            <p>
              <b>{message}</b>
            </p>
          )}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 10 }}>
            <button onClick={loadItems}>Load my items</button>{' '}
            <button onClick={loadShareableItems}>Load shareable items</button>{' '}
            <button onClick={logout}>Logout</button>
          </div>

          {message && (
            <p>
              <b>{message}</b>
            </p>
          )}

          <h2>Add item</h2>
          <div style={{ maxWidth: 420 }}>
            <div>
              <label>Name</label>
              <br />
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <label>Expiry date</label>
              <br />
              <input
                type="date"
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
              />
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

            <button onClick={addItem} style={{ marginTop: 10 }}>
              Add
            </button>
          </div>

          <h2 style={{ marginTop: 25 }}>My items</h2>

          {items.length === 0 ? (
            <p>No items yet. Add one above, then click “Load my items”.</p>
          ) : (
            <ul>
              {items.map((item) => {
                const status = getExpiryStatus(item.expiry_date);

                return (
                  <li key={item.id}>
                    <b>{item.name}</b> — expires {item.expiry_date} — shareable:{' '}
                    {String(item.is_shareable)}
                    {status ? (
                      <span
                        style={{
                          marginLeft: 10,
                          fontWeight: 'bold',
                          color: status.color
                        }}
                      >
                        ⚠️ {status.label}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          <h2 style={{ marginTop: 25 }}>Available to claim</h2>

          {shareableItems.length === 0 ? (
            <p>No shareable items from other users right now.</p>
          ) : (
            <ul>
              {shareableItems.map((item) => (
                <li key={item.id}>
                  <b>{item.name}</b> — expires {item.expiry_date}{' '}
                  <button onClick={() => claimItem(item.id)}>Claim</button>
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
