const express = require('express');
const router = express.Router();

router.get('/openfoodfacts/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    const url =
      'https://world.openfoodfacts.org/cgi/search.pl' +
      `?search_terms=${encodeURIComponent(q)}` +
      '&search_simple=1' +
      '&action=process' +
      '&json=1' +
      '&page_size=10' +
      '&fields=product_name,brands,categories,labels,image_small_url,code';

    const resp = await fetch(url);
    if (!resp.ok) {
      return res.status(502).json({ error: 'External service error' });
    }

    const data = await resp.json();

    const products = Array.isArray(data.products) ? data.products : [];

    const mapped = products
      .map((p) => {
        const name = (p.product_name || '').trim();
        const categories = (p.categories || '').trim();
        const brand = (p.brands || '').trim();

        if (!name) return null;

        return {
          code: p.code || null,
          name,
          brand: brand || null,
          categories,
          image: p.image_small_url || null
        };
      })
      .filter(Boolean);

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
