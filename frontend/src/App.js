import { useState } from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f6f7fb',
    padding: 24,
    fontFamily: 'Arial, sans-serif'
  },
  container: {
    maxWidth: 1080,
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 14
  },
  titleWrap: { lineHeight: 1.1 },
  title: { margin: 0, fontSize: 30, letterSpacing: -0.4 },
  subtitle: { margin: '6px 0 0', color: '#555' },

  card: {
    background: '#fff',
    border: '1px solid #e7e7ef',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 1px 10px rgba(0,0,0,0.05)'
  },

  topActions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 8
  },

  btn: {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #d6d6e6',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap'
  },
  btnPrimary: {
    border: '1px solid #3b82f6',
    background: '#3b82f6',
    color: '#fff'
  },
  btnDanger: {
    border: '1px solid #ef4444',
    background: '#ef4444',
    color: '#fff'
  },
  btnGhost: {
    background: '#fff'
  },
  btnSmall: {
    padding: '8px 10px',
    borderRadius: 12,
    border: '1px solid #d6d6e6',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    whiteSpace: 'nowrap'
  },

  message: {
    marginTop: 12,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #e7e7ef',
    background: '#f9fafb',
    color: '#111'
  },

  label: { display: 'block', fontSize: 13, color: '#333', marginBottom: 6 },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #d6d6e6',
    outline: 'none'
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginTop: 16
  },

  sectionTitle: { margin: 0, fontSize: 20 },

  list: { margin: 0, paddingLeft: 18 },
  listItem: { marginBottom: 10 },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    marginLeft: 10
  },

  addGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr auto auto',
    gap: 12,
    alignItems: 'end'
  },
  addGridMobileHint: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8
  },

  checkboxWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #d6d6e6',
    background: '#fff',
    height: 42,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap'
  }
};

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

  function getExpiryStatus(expiryDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'EXPIRED', color: 'crimson', bg: '#ffe4e6' };
    if (diffDays <= 2) return { label: 'EXPIRING SOON', color: 'darkorange', bg: '#ffedd5' };
    return null;
  }

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
      setMessage('My items loaded.');
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
      setMessage('Shareable items loaded.');
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

  async function addItem() {
    setMessage('');

    if (!newName || !newExpiry) {
      setMessage('Please enter name and expiry date.');
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
      setMessage('Item added.');
      setNewName('');
      setNewExpiry('');
      setNewShareable(false);
      await loadItems();
    } else {
      setMessage(data.message || data.error || 'Could not add item');
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
      await loadItems();
    } else {
      setMessage(data.error || data.message || 'Could not claim item');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setItems([]);
    setShareableItems([]);
    setMessage('Logged out.');
  }

  const isNarrow = typeof window !== 'undefined' ? window.innerWidth < 820 : false;
  const addGridStyle = isNarrow
    ? { ...styles.addGrid, gridTemplateColumns: '1fr', alignItems: 'stretch' }
    : styles.addGrid;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleWrap}>
            <h1 style={styles.title}>Anti Food Waste App</h1>
            <p style={styles.subtitle}>Track items, share surplus, and claim food from others.</p>
          </div>
          {token ? (
            <button onClick={logout} style={{ ...styles.btn, ...styles.btnDanger }}>
              Logout
            </button>
          ) : null}
        </div>

        {!token ? (
          <div style={{ ...styles.card, maxWidth: 440 }}>
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>Login</h2>

            <div style={{ marginBottom: 12 }}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>

            <button onClick={handleLogin} style={{ ...styles.btn, ...styles.btnPrimary }}>
              Login
            </button>

            {message ? <div style={styles.message}>{message}</div> : null}
          </div>
        ) : (
          <>
            <div style={styles.topActions}>
              <button onClick={loadItems} style={{ ...styles.btn, ...styles.btnPrimary }}>
                Load my items
              </button>
              <button onClick={loadShareableItems} style={{ ...styles.btn, ...styles.btnGhost }}>
                Load shareable items
              </button>
            </div>

            {message ? <div style={styles.message}>{message}</div> : null}

            <div style={{ ...styles.card, marginTop: 14 }}>
              <h2 style={{ marginTop: 0, marginBottom: 12 }}>Add item</h2>

              <div style={addGridStyle}>
                <div>
                  <label style={styles.label}>Name</label>
                  <input
                    style={styles.input}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Milk, Bread, Apples..."
                  />
                </div>

                <div>
                  <label style={styles.label}>Expiry date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                  />
                </div>

                <div>
                  <label style={styles.label}>&nbsp;</label>
                  <label style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={newShareable}
                      onChange={(e) => setNewShareable(e.target.checked)}
                    />
                    Shareable
                  </label>
                </div>

                <div>
                  <label style={styles.label}>&nbsp;</label>
                  <button onClick={addItem} style={{ ...styles.btn, ...styles.btnPrimary, width: '100%' }}>
                    Add
                  </button>
                </div>
              </div>

              {isNarrow ? (
                <div style={styles.addGridMobileHint}>
                  Tip: on smaller screens the inputs stack so nothing overlaps.
                </div>
              ) : null}
            </div>

            <div style={styles.grid2}>
              <div style={styles.card}>
                <h2 style={{ ...styles.sectionTitle, marginTop: 0, marginBottom: 12 }}>My items</h2>

                {items.length === 0 ? (
                  <p style={{ color: '#555', margin: 0 }}>
                    No items yet. Add one above, then click “Load my items”.
                  </p>
                ) : (
                  <ul style={styles.list}>
                    {items.map((item) => {
                      const status = getExpiryStatus(item.expiry_date);
                      return (
                        <li key={item.id} style={styles.listItem}>
                          <div>
                            <b>{item.name}</b> — expires {item.expiry_date}{' '}
                            <span style={{ color: '#666' }}>
                              — shareable: {String(item.is_shareable)}
                            </span>
                            {status ? (
                              <span
                                style={{
                                  ...styles.badge,
                                  color: status.color,
                                  background: status.bg,
                                  border: `1px solid ${status.color}`
                                }}
                              >
                                ⚠️ {status.label}
                              </span>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div style={styles.card}>
                <h2 style={{ ...styles.sectionTitle, marginTop: 0, marginBottom: 12 }}>
                  Available to claim
                </h2>

                {shareableItems.length === 0 ? (
                  <p style={{ color: '#555', margin: 0 }}>
                    No shareable items from other users right now.
                  </p>
                ) : (
                  <ul style={styles.list}>
                    {shareableItems.map((item) => (
                      <li key={item.id} style={styles.listItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 auto' }}>
                            <b>{item.name}</b> — expires {item.expiry_date}
                          </div>
                          <button
                            onClick={() => claimItem(item.id)}
                            style={{ ...styles.btnSmall, ...styles.btnPrimary }}
                          >
                            Claim
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
