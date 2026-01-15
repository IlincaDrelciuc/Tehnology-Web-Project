import { useEffect, useMemo, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || '').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE}${path}`;

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
  btnDark: {
    border: '1px solid #111',
    background: '#111',
    color: '#fff'
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
    outline: 'none',
    boxSizing: 'border-box'
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

  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #d6d6e6',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box'
  },

  divider: {
    height: 1,
    background: '#e7e7ef',
    margin: '14px 0'
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
  },

  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12
  },

  grid2Inner: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },

  rightAlign: {
    display: 'flex',
    justifyContent: 'flex-end'
  },

  authShell: {
    minHeight: 'calc(100vh - 48px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  authCard: {
    width: '100%',
    maxWidth: 420,
    padding: 18
  },

  authHeader: {
    textAlign: 'center',
    marginBottom: 14
  },

  logoDot: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: '#3b82f6',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 900,
    boxShadow: '0 10px 30px rgba(59,130,246,0.25)'
  },

  authTitle: {
    margin: '10px 0 0',
    fontSize: 22
  },

  authSub: {
    margin: '6px 0 0',
    color: '#6b7280',
    fontSize: 13
  },

  authGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 12
  },

  fullBtn: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #3b82f6',
    background: '#3b82f6',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 800
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
  const [newCategory, setNewCategory] = useState('');
  const [newShareable, setNewShareable] = useState(false);
  const [shareTarget, setShareTarget] = useState('public');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const [groupsOwned, setGroupsOwned] = useState([]);
  const [groupsMemberOf, setGroupsMemberOf] = useState([]);
  const [invites, setInvites] = useState([]);

  const [groupName, setGroupName] = useState('');
  const [inviteGroupId, setInviteGroupId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePreference, setInvitePreference] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const isNarrow = typeof window !== 'undefined' ? window.innerWidth < 980 : false;

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

  function computeNotificationSummary(currentItems) {
    let expired = 0;
    let soon = 0;

    for (const it of currentItems) {
      const status = getExpiryStatus(it.expiry_date);
      if (!status) continue;
      if (status.label === 'EXPIRED') expired += 1;
      if (status.label === 'EXPIRING SOON') soon += 1;
    }

    if (expired === 0 && soon === 0) return '';
    if (expired > 0 && soon > 0) return `⚠️ You have ${expired} expired item(s) and ${soon} expiring soon.`;
    if (expired > 0) return `⚠️ You have ${expired} expired item(s).`;
    return `⚠️ You have ${soon} item(s) expiring soon.`;
  }

  async function loadItems(tkn = token) {
    const response = await fetch(apiUrl('/api/items'), {
      headers: { Authorization: `Bearer ${tkn}` }
    });

    const data = await response.json();

    if (response.ok) {
      setItems(data);
      const summary = computeNotificationSummary(data);
      setMessage(summary ? `My items loaded. ${summary}` : 'My items loaded.');
    } else {
      const msg = data.message || data.error || 'Could not load items';
      setMessage(msg);
      if (msg.includes('Invalid or expired token')) logout();
    }
  }

  async function loadShareableItems(tkn = token) {
    const response = await fetch(apiUrl('/api/items/shareable'), {
      headers: { Authorization: `Bearer ${tkn}` }
    });

    const data = await response.json();

    if (response.ok) {
      setShareableItems(data);
    } else {
      const msg = data.message || data.error || 'Could not load shareable items';
      setMessage(msg);
      if (msg.includes('Invalid or expired token')) logout();
    }
  }

  async function loadGroups(tkn = token) {
    const response = await fetch(apiUrl('/api/groups'), {
      headers: { Authorization: `Bearer ${tkn}` }
    });

    const data = await response.json();

    if (response.ok) {
      setGroupsOwned(Array.isArray(data.owned) ? data.owned : []);
      setGroupsMemberOf(Array.isArray(data.memberOf) ? data.memberOf : []);
    } else {
      setMessage(data.error || data.message || 'Could not load groups');
    }
  }

  async function loadInvites(tkn = token) {
    const response = await fetch(apiUrl('/api/groups/invites'), {
      headers: { Authorization: `Bearer ${tkn}` }
    });

    const data = await response.json();

    if (response.ok) {
      setInvites(Array.isArray(data) ? data : []);
    } else {
      setMessage(data.error || data.message || 'Could not load invites');
    }
  }

  async function handleLogin() {
    setMessage('');

    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setMessage('Logged in.');
      await loadItems(data.token);
      await loadShareableItems(data.token);
      await loadGroups(data.token);
      await loadInvites(data.token);
    } else {
      setMessage(data.error || 'Login failed');
    }
  }

  async function handleRegister() {
    setMessage('');

    const response = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Registered! Now click Login.');
    } else {
      setMessage(data.error || 'Register failed');
    }
  }

  async function createGroup() {
    setMessage('');

    if (!groupName.trim()) {
      setMessage('Please enter a group name.');
      return;
    }

    const response = await fetch(apiUrl('/api/groups'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: groupName.trim() })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Group created.');
      setGroupName('');
      await loadGroups();
    } else {
      setMessage(data.error || data.message || 'Could not create group');
    }
  }

  async function inviteToGroup() {
    setMessage('');

    if (!inviteGroupId) {
      setMessage('Please select a group.');
      return;
    }
    if (!inviteEmail.trim()) {
      setMessage('Please enter an email to invite.');
      return;
    }

    const response = await fetch(apiUrl(`/api/groups/${inviteGroupId}/invite`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email: inviteEmail.trim(),
        preference_label: invitePreference.trim() || null
      })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Invite sent.');
      setInviteEmail('');
      setInvitePreference('');
      await loadGroups();
    } else {
      setMessage(data.error || data.message || 'Could not invite');
    }
  }

  async function acceptInvite(inviteId) {
    setMessage('');

    const response = await fetch(apiUrl(`/api/groups/invites/${inviteId}/accept`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Invite accepted.');
      await loadInvites();
      await loadGroups();
    } else {
      setMessage(data.error || data.message || 'Could not accept invite');
    }
  }

  async function declineInvite(inviteId) {
    setMessage('');

    const response = await fetch(apiUrl(`/api/groups/invites/${inviteId}/decline`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Invite declined.');
      await loadInvites();
    } else {
      setMessage(data.error || data.message || 'Could not decline invite');
    }
  }

  async function searchOpenFoodFacts() {
    setMessage('');

    const q = searchQuery.trim();
    if (!q) {
      setMessage('Type something to search (example: milk).');
      return;
    }

    setSearchLoading(true);
    setSearchResults([]);

    try {
      const response = await fetch(apiUrl(`/api/external/openfoodfacts/search?q=${encodeURIComponent(q)}`));
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Search failed');
        return;
      }

      setSearchResults(Array.isArray(data) ? data : []);
      setMessage(`Found ${Array.isArray(data) ? data.length : 0} result(s). Click one to autofill.`);
    } catch (e) {
      setMessage('Could not contact external API. Is backend running?');
    } finally {
      setSearchLoading(false);
    }
  }

  function applySearchResult(p) {
    setNewName(p.name || '');
    if (p.categories) {
      const first = p.categories.split(',')[0].trim();
      setNewCategory(first);
    }
    setMessage('Autofilled from OpenFoodFacts. Now choose expiry date and add item.');
  }

  async function addItem() {
    setMessage('');

    if (!newName || !newExpiry) {
      setMessage('Please enter name and expiry date.');
      return;
    }

    let shared_group_id = null;
    if (newShareable && shareTarget === 'group') {
      if (!selectedGroupId) {
        setMessage('Please choose a group for sharing.');
        return;
      }
      shared_group_id = Number(selectedGroupId);
    }

    const response = await fetch(apiUrl('/api/items'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName,
        category: newCategory.trim() || null,
        expiry_date: newExpiry,
        is_shareable: newShareable,
        shared_group_id
      })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Item added.');
      setNewName('');
      setNewExpiry('');
      setNewCategory('');
      setNewShareable(false);
      setShareTarget('public');
      setSelectedGroupId('');
      await loadItems();
      await loadShareableItems();
    } else {
      setMessage(data.message || data.error || 'Could not add item');
    }
  }

  async function claimItem(itemId) {
    setMessage('');

    const response = await fetch(apiUrl(`/api/items/${itemId}/claim`), {
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

  async function shareItem(item) {
    const text = `I have ${item.name} available to share (expires ${item.expiry_date}) on Anti Food Waste App.`;
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Anti Food Waste App', text, url });
        setMessage('Shared successfully.');
        return;
      }
    } catch (e) {}

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setMessage('Share text copied to clipboard.');
    } catch (e) {
      setMessage('Could not share. Your browser blocked clipboard access.');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setItems([]);
    setShareableItems([]);
    setGroupsOwned([]);
    setGroupsMemberOf([]);
    setInvites([]);
    setMessage('');
  }

  const groupedItems = useMemo(() => {
    const map = new Map();
    for (const it of items) {
      const key = it.category && it.category.trim() ? it.category.trim() : 'Uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    const entries = Array.from(map.entries());
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    return entries;
  }, [items]);

  useEffect(() => {
    if (!token) return;
    loadGroups();
    loadInvites();
  }, [token]);

  const addRowStyle = isNarrow ? { ...styles.grid3, gridTemplateColumns: '1fr' } : styles.grid3;
  const shareRowStyle = isNarrow
    ? { ...styles.grid3, gridTemplateColumns: '1fr' }
    : { ...styles.grid3, gridTemplateColumns: '1fr 1fr 1fr' };
  const groupsGridStyle = isNarrow ? { ...styles.grid2Inner, gridTemplateColumns: '1fr' } : styles.grid2Inner;
  const mainGridStyle = isNarrow ? { ...styles.grid2, gridTemplateColumns: '1fr' } : styles.grid2;

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.authShell}>
          <div style={{ ...styles.card, ...styles.authCard }}>
            <div style={styles.authHeader}>
              <div style={styles.logoDot}>AF</div>
              <div style={styles.authTitle}>Welcome</div>
              <div style={styles.authSub}>Login or create an account to use the app.</div>
            </div>

            <div style={styles.authGrid}>
              <div>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                />
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                <button onClick={handleLogin} style={styles.fullBtn}>
                  Login
                </button>

                <button onClick={handleRegister} style={{ ...styles.fullBtn, ...styles.btnDark }}>
                  Register
                </button>
              </div>

              {message ? <div style={styles.message}>{message}</div> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleWrap}>
            <h1 style={styles.title}>Anti Food Waste App</h1>
            <p style={styles.subtitle}>Track items, share surplus, and claim food from others.</p>
          </div>
          <button onClick={logout} style={{ ...styles.btn, ...styles.btnDanger }}>
            Logout
          </button>
        </div>

        <div style={styles.topActions}>
          <button onClick={() => loadItems()} style={{ ...styles.btn, ...styles.btnPrimary }}>
            Load my items
          </button>
          <button onClick={() => loadShareableItems()} style={{ ...styles.btn, ...styles.btnGhost }}>
            Load shareable items
          </button>
          <button onClick={() => loadGroups()} style={{ ...styles.btn, ...styles.btnGhost }}>
            Load groups
          </button>
          <button onClick={() => loadInvites()} style={{ ...styles.btn, ...styles.btnGhost }}>
            Load invites
          </button>
        </div>

        {message ? <div style={styles.message}>{message}</div> : null}

        <div style={{ ...styles.card, marginTop: 14 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Add item</h2>

          <div style={{ ...styles.card, boxShadow: 'none', marginBottom: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>Search product (External API)</h3>

            <div
              style={
                isNarrow
                  ? { display: 'grid', gap: 10 }
                  : { display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }
              }
            >
              <input
                style={styles.input}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search: milk, yogurt, bread..."
              />
              <button
                onClick={searchOpenFoodFacts}
                style={{ ...styles.btn, ...styles.btnPrimary, width: isNarrow ? '100%' : 'auto' }}
                disabled={searchLoading}
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 ? (
              <ul style={{ ...styles.list, marginTop: 10 }}>
                {searchResults.map((p) => (
                  <li key={p.code || p.name} style={styles.listItem}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      {p.image ? (
                        <img
                          src={p.image}
                          alt=""
                          style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover' }}
                        />
                      ) : null}
                      <div style={{ flex: '1 1 auto' }}>
                        <b>{p.name}</b>
                        {p.brand ? <span style={{ color: '#666' }}> — {p.brand}</span> : null}
                        {p.categories ? <div style={{ color: '#666', fontSize: 12 }}>{p.categories}</div> : null}
                      </div>
                      <button onClick={() => applySearchResult(p)} style={{ ...styles.btnSmall, ...styles.btnPrimary }}>
                        Use
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div style={addRowStyle}>
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
              <label style={styles.label}>Category</label>
              <input
                style={styles.input}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Dairy, Vegetables..."
              />
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div style={shareRowStyle}>
            <div>
              <label style={styles.label}>Shareable</label>
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
              <label style={styles.label}>Share with</label>
              <select
                style={styles.select}
                value={shareTarget}
                onChange={(e) => setShareTarget(e.target.value)}
                disabled={!newShareable}
              >
                <option value="public">Public (anyone can see)</option>
                <option value="group">A group</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Group</label>
              <select
                style={styles.select}
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={!newShareable || shareTarget !== 'group'}
              >
                <option value="">Select group</option>
                {groupsOwned.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div style={styles.rightAlign}>
            <button onClick={addItem} style={{ ...styles.btn, ...styles.btnPrimary }}>
              Add item
            </button>
          </div>
        </div>

        <div style={{ ...styles.card, marginTop: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Friends & Groups</h2>

          <div style={groupsGridStyle}>
            <div style={{ ...styles.card, boxShadow: 'none' }}>
              <h3 style={{ marginTop: 0, marginBottom: 10 }}>My invites</h3>

              {invites.length === 0 ? (
                <p style={{ color: '#555', marginTop: 0, marginBottom: 0 }}>No pending invites.</p>
              ) : (
                <ul style={styles.list}>
                  {invites.map((inv) => (
                    <li key={inv.id} style={styles.listItem}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 auto' }}>
                          <b>Invite to group:</b> {inv.group?.name || 'Group'}{' '}
                          <span style={{ color: '#666' }}>
                            {inv.preference_label ? `— pref: ${inv.preference_label}` : ''}
                          </span>
                        </div>
                        <button
                          onClick={() => acceptInvite(inv.id)}
                          style={{ ...styles.btnSmall, ...styles.btnPrimary }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineInvite(inv.id)}
                          style={{ ...styles.btnSmall, ...styles.btnGhost }}
                        >
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ ...styles.card, boxShadow: 'none' }}>
              <h3 style={{ marginTop: 0, marginBottom: 10 }}>Create group</h3>
              <label style={styles.label}>Group name</label>
              <input
                style={styles.input}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Gym friends"
              />
              <div style={{ marginTop: 10 }}>
                <button onClick={createGroup} style={{ ...styles.btn, ...styles.btnPrimary }}>
                  Create
                </button>
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={groupsGridStyle}>
            <div style={{ ...styles.card, boxShadow: 'none' }}>
              <h3 style={{ marginTop: 0, marginBottom: 10 }}>Invite friend</h3>

              <label style={styles.label}>Group (you own)</label>
              <select
                style={styles.select}
                value={inviteGroupId}
                onChange={(e) => setInviteGroupId(e.target.value)}
              >
                <option value="">Select group</option>
                {groupsOwned.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <div style={{ height: 10 }} />

              <label style={styles.label}>Friend email</label>
              <input
                style={styles.input}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@test.com"
              />

              <div style={{ height: 10 }} />

              <label style={styles.label}>Preference label</label>
              <input
                style={styles.input}
                value={invitePreference}
                onChange={(e) => setInvitePreference(e.target.value)}
                placeholder="e.g. no meat, lactose-free"
              />

              <div style={{ marginTop: 10 }}>
                <button onClick={inviteToGroup} style={{ ...styles.btn, ...styles.btnPrimary }}>
                  Invite
                </button>
              </div>
            </div>

            <div style={{ ...styles.card, boxShadow: 'none' }}>
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>Groups overview</h3>

              <div style={styles.grid2Inner}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>Groups I own</div>
                  {groupsOwned.length === 0 ? (
                    <p style={{ color: '#555', margin: 0 }}>No groups yet.</p>
                  ) : (
                    <ul style={styles.list}>
                      {groupsOwned.map((g) => (
                        <li key={g.id} style={styles.listItem}>
                          <b>{g.name}</b> (id: {g.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>Groups I’m in</div>
                  {groupsMemberOf.length === 0 ? (
                    <p style={{ color: '#555', margin: 0 }}>You are not in any group.</p>
                  ) : (
                    <ul style={styles.list}>
                      {groupsMemberOf.map((g) => (
                        <li key={g.id} style={styles.listItem}>
                          <b>{g.name}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={mainGridStyle}>
          <div style={styles.card}>
            <h2 style={{ ...styles.sectionTitle, marginTop: 0, marginBottom: 12 }}>My items</h2>

            {groupedItems.length === 0 ? (
              <p style={{ color: '#555', margin: 0 }}>
                No items yet. Add one above, then click “Load my items”.
              </p>
            ) : (
              <div>
                {groupedItems.map(([cat, catItems]) => (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>{cat}</div>
                    <ul style={styles.list}>
                      {catItems.map((item) => {
                        const status = getExpiryStatus(item.expiry_date);
                        return (
                          <li key={item.id} style={styles.listItem}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <div style={{ flex: '1 1 auto' }}>
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
                              {item.is_shareable ? (
                                <button
                                  onClick={() => shareItem(item)}
                                  style={{ ...styles.btnSmall, ...styles.btnGhost }}
                                >
                                  Share
                                </button>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
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
                        <b>{item.name}</b> — expires {item.expiry_date}{' '}
                        <span style={{ color: '#666' }}>
                          {item.category ? `— ${item.category}` : ''}
                        </span>
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
      </div>
    </div>
  );
}

export default App;
