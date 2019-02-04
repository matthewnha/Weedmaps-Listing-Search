const http = require('http');


function main(){
    var storeSlug = ;
    var menuLink = "http://api-g.weedmaps.com/discovery/v1/listings/dispensaries/the-kana-company/menu_items?page=1&page_size=150";
    var data = '';

    http.get(menuLink, (res)=>{
        res.on('data', (chunk)=>{
            data+=chunk;
        });
        res.on('end', ()=>{
            var parsedData = JSON.parse(data);
            var menuItems = parsedData.data.menu_items;
        });
    });
};

main();