const http = require('http');

http.get('http://api-g.weedmaps.com/discovery/v1/listings?filter%5Bany_retailer_services%5D%5B%5D=doctor&filter%5Bany_retailer_services%5D%5B%5D=storefront&filter%5Bany_retailer_services%5D%5B%5D=delivery&filter%5Bregion_slug%5Bdeliveries%5D%5D=davis&filter%5Bregion_slug%5Bdispensaries%5D%5D=davis&filter%5Bregion_slug%5Bdoctors%5D%5D=sacramento&page_size=100&size=100', (res) => {
  console.log('1');
});

http.get('http://api-g.weedmaps.com/discovery/v1/listings/dispensaries/the-kana-company/menu_items?page=1&page_size=150', (reply) => {
  console.log('2');
});