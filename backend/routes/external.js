/**
 * external.js
 * Routes that communicate with external APIs.
 * In this file we integrate the Open Food Facts public API
 * to search for food products by name.
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/external/openfoodfacts/search?q=product
 *
 * This endpoint searches the Open Food Facts database
 * using a search term provided by the client.
 *
 * Query params:
 * - q: text to search for (required)
 *
 * Returns:
 * - a simplified list of products (name, brand, categories, image)
 */
router.get('/openfoodfacts/search', async (req, res) => {
  try {
    // Read and validate search query
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    // Build Open Food Facts API URL
    const url =
      'https://world.openfoodfacts.org/cgi/search.pl' +
      `?search_terms=${encodeURIComponent(q)}` +
      '&search_simple=1' +
      '&action=process' +
      '&json=1' +
      '&page_size=10' +
      '&fields=product_name,brands,categories,labels,image_small_url,code';

    // Call external API
    const resp = await fetch(url);

    // Handle external API failure
    if (!resp.ok) {
      return res.status(502).json({ error: 'External service error' });
    }

    // Parse JSON response
    const data = await resp.json();
    const products = Array.isArray(data.products) ? data.products : [];

    // Map only useful fields for our application
    const mapped = products
      .map((p) => {
        const name = (p.product_name || '').trim();
        const categories = (p.categories || '').trim();
        const brand = (p.brands || '').trim();

        // Ignore products without a name
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

    // Send simplified result to frontend
    res.json(mapped);
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
