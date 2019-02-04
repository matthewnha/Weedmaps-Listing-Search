const http = require('http');

const maxRequests = 5;

var matchedItems = [];

function createRegex(searchTerms){
    var nt = '';

    for(var i = 0; i < searchTerms.length; i++) {
        var term = searchTerms[i];
        if(i == searchTerms.length - 1) {
            nt += `(${term})`
        } else nt += `(${term})|`
        
    }

    return new RegExp(nt,'i');
}


module.exports = class MenuSearch {
    constructor(menuSlug){
        this.menuSlug = menuSlug;
    }

    searchFor(searchTerms, callback) {
        var menuUrl = `http://api-g.weedmaps.com/discovery/v1/listings/dispensaries/${this.menuSlug}/menu_items?page=1&page_size=150`;
        var data = '';
    
        http.get(menuUrl, (res)=>{
            res.on('data', (chunk)=>{
                data+=chunk;
            });
            res.on('end', ()=>{
                var parsedData = JSON.parse(data);
                var itemQueue = parsedData.data.menu_items;
    
                var searchDone = false;
    
                var next = () => {
                    if(itemQueue.length > 0 && !searchDone){
                        this.findSearchTerms(itemQueue.shift(), searchTerms, next);
                    } else {
                        //TODO implement functionality when done with search
                        if(!searchDone){
                            searchDone = true;
                            console.log("Done");
                            callback(matchedItems);
                        }
                    }
                }
                for (var i = 0; i < maxRequests; i++) {
                    next();
                }
            });
        });
    };

    findSearchTerms(item, searchTerms, callback) {
        if(item != undefined){
            var itemSlug = item.slug;
            var itemUrl = `http://api-g.weedmaps.com/discovery/v1/listings/dispensaries/${this.menuSlug}/menu_items/${itemSlug}?include[]=listing`;
            http.get(itemUrl, (res)=>{
                var data = '';
    
                res.on('data', (chunk)=>{
                    data += chunk;
                });
    
                res.on('end', ()=>{
    
                    var itemObj = JSON.parse(data).data.menu_item;
                    var textToSearch = itemObj.name + itemObj.category.name + itemObj.body;
                    var regex = createRegex(searchTerms);
                    
                    if(textToSearch.match(regex)){
                        matchedItems.push(itemObj);
                    }
    
                    callback();
                });
            });
            
        } else {
            console.log("Undefined?")
        }
        
    }
}