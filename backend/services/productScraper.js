const puppeteer = require('puppeteer');

class ProductScraper {
    constructor() {
        this.browser = null;
    }

    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1920x1080'
                ]
            });
        }
        return this.browser;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async scrapeShopee(url) {
        const browser = await this.init();
        const page = await browser.newPage();
        
        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for product content to load
            await page.waitForSelector('[data-testid="pdp-product-title"], .product-title, h1', { timeout: 10000 });

            const productData = await page.evaluate(() => {
                // Helper function to get text content
                const getText = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.textContent.trim() : '';
                };

                // Helper function to get attribute
                const getAttr = (selector, attr) => {
                    const el = document.querySelector(selector);
                    return el ? el.getAttribute(attr) : '';
                };

                // Extract product name
                const name = getText('[data-testid="pdp-product-title"]') || 
                            getText('.product-title') || 
                            getText('h1');

                // Extract price
                const priceText = getText('[data-testid="pdp-product-price"]') || 
                                 getText('.product-price') ||
                                 getText('[class*="price"]');
                const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                // Extract original price (if discounted)
                const originalPriceText = getText('[data-testid="pdp-product-original-price"]') ||
                                         getText('.original-price') ||
                                         getText('[class*="original"]');
                const originalPrice = originalPriceText ? parseInt(originalPriceText.replace(/[^0-9]/g, '')) : price;

                // Calculate discount
                const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                // Extract rating
                const ratingText = getText('[data-testid="pdp-review-summary"]') ||
                                  getText('.rating-score') ||
                                  getText('[class*="rating"]');
                const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '4.5');

                // Extract sold count
                const soldText = getText('[data-testid="pdp-product-sold"]') ||
                                getText('.sold-count') ||
                                getText('[class*="sold"]');
                const soldCount = soldText.replace(/[^0-9.kK]/g, '') || '0';

                // Extract images
                const images = [];
                document.querySelectorAll('[data-testid="pdp-product-image"], .product-image img, [class*="product-image"] img').forEach(img => {
                    const src = img.src || img.getAttribute('data-src');
                    if (src && !src.includes('placeholder')) {
                        images.push(src);
                    }
                });

                // Extract description
                const description = getText('[data-testid="pdp-product-description"]') ||
                                   getText('.product-description') ||
                                   getText('[class*="description"]') ||
                                   name;

                return {
                    name,
                    description: description.substring(0, 200),
                    price,
                    originalPrice,
                    discount,
                    rating,
                    soldCount,
                    images: images.slice(0, 5),
                    platform: 'shopee'
                };
            });

            return productData;
        } catch (error) {
            console.error('Shopee scraping error:', error.message);
            throw error;
        } finally {
            await page.close();
        }
    }

    async scrapeTokopedia(url) {
        const browser = await this.init();
        const page = await browser.newPage();
        
        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            await page.waitForSelector('h1, [data-testid="lblPDPDetailProductName"]', { timeout: 10000 });

            const productData = await page.evaluate(() => {
                const getText = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.textContent.trim() : '';
                };

                const name = getText('[data-testid="lblPDPDetailProductName"]') || getText('h1');
                
                const priceText = getText('[data-testid="lblPDPDetailProductPrice"]') || 
                                 getText('[class*="price"]');
                const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                const ratingText = getText('[data-testid="lblPDPDetailProductRatingNumber"]') ||
                                  getText('[class*="rating"]');
                const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '4.5');

                const soldText = getText('[data-testid="lblPDPDetailProductSoldCounter"]') ||
                                getText('[class*="sold"]');
                const soldCount = soldText.replace(/[^0-9.kKrb]/g, '') || '0';

                const images = [];
                document.querySelectorAll('[data-testid="PDPImageMain"] img, .product-media img').forEach(img => {
                    const src = img.src || img.getAttribute('data-src');
                    if (src && !src.includes('placeholder')) {
                        images.push(src);
                    }
                });

                const description = getText('[data-testid="lblPDPDescriptionProduk"]') || name;

                return {
                    name,
                    description: description.substring(0, 200),
                    price,
                    originalPrice: price,
                    discount: 0,
                    rating,
                    soldCount,
                    images: images.slice(0, 5),
                    platform: 'tokopedia'
                };
            });

            return productData;
        } catch (error) {
            console.error('Tokopedia scraping error:', error.message);
            throw error;
        } finally {
            await page.close();
        }
    }

    async scrapeTikTok(url) {
        const browser = await this.init();
        const page = await browser.newPage();
        
        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            await page.waitForSelector('h1, [class*="title"]', { timeout: 10000 });

            const productData = await page.evaluate(() => {
                const getText = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.textContent.trim() : '';
                };

                const name = getText('h1') || getText('[class*="ProductTitle"]');
                
                const priceText = getText('[class*="ProductPrice"]') || 
                                 getText('[class*="price"]');
                const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                const ratingText = getText('[class*="rating"]');
                const rating = parseFloat(ratingText.match(/[\d.]+/)?.[0] || '4.5');

                const soldText = getText('[class*="sold"]');
                const soldCount = soldText.replace(/[^0-9.kK]/g, '') || '0';

                const images = [];
                document.querySelectorAll('[class*="ProductImage"] img, img[alt*="product"]').forEach(img => {
                    const src = img.src || img.getAttribute('data-src');
                    if (src && !src.includes('placeholder')) {
                        images.push(src);
                    }
                });

                return {
                    name,
                    description: name,
                    price,
                    originalPrice: price,
                    discount: 0,
                    rating,
                    soldCount,
                    images: images.slice(0, 5),
                    platform: 'tiktok'
                };
            });

            return productData;
        } catch (error) {
            console.error('TikTok scraping error:', error.message);
            throw error;
        } finally {
            await page.close();
        }
    }

    async scrapeProduct(url) {
        try {
            let productData;

            if (url.includes('shopee')) {
                productData = await this.scrapeShopee(url);
            } else if (url.includes('tokopedia')) {
                productData = await this.scrapeTokopedia(url);
            } else if (url.includes('tiktok')) {
                productData = await this.scrapeTikTok(url);
            } else {
                throw new Error('Unsupported platform');
            }

            // Ensure we have at least one image
            if (!productData.images || productData.images.length === 0) {
                productData.images = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];
            }

            return productData;
        } catch (error) {
            console.error('Scraping error:', error.message);
            throw error;
        }
    }
}

module.exports = new ProductScraper();
