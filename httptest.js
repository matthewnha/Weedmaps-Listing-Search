const http = require('http');

var listingsUrl = "http://api-g.weedmaps.com/discovery/v1/listings?filter%5Bany_retailer_services%5D%5B%5D=doctor&filter%5Bany_retailer_services%5D%5B%5D=storefront&filter%5Bany_retailer_services%5D%5B%5D=delivery&filter%5Bregion_slug%5Bdeliveries%5D%5D=davis&filter%5Bregion_slug%5Bdispensaries%5D%5D=davis&filter%5Bregion_slug%5Bdoctors%5D%5D=sacramento&page_size=100&size=100";

function main(){
  searchTerms = ['cbd'];
  http.get(listingsUrl, (res) => {
    console.log('inner get begin');
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        //searchListings(searchTerms, parsedData.data.listings);
        console.log('outer get end');
        http.get('http://google.com/', (res)=>{
          console.log('inner get initiated');
          rawData = '';
          res.on('data', (chunk)=>{
            console.log('chunk');
            rawData += chunk;
          });
          res.on('end', ()=>{
            console.log('resposne end');
          });
        });
      } catch (e) {
        console.error(e.message);
      }
    });
  });
}

main();