const http = require('http'),
    https = require('https'),
    child_process = require('child_process'),
	  readline = require('readline');
	
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//var listingsUrl = "http://api-v2.weedmaps.com/api/v2/listings?filter%5Bbounding_box%5D=33.67663992998262,-117.99367904663086,33.76930166033846,-117.71902084350585&filter%5Bplural_types%5D%5B%5D=dispensaries&filter%5Bplural_types%5D%5B%5D=deliveries&page_size=100&size=100"
var listingsUrl = "http://api-g.weedmaps.com/discovery/v1/listings?filter%5Bany_retailer_services%5D%5B%5D=doctor&filter%5Bany_retailer_services%5D%5B%5D=storefront&filter%5Bany_retailer_services%5D%5B%5D=delivery&filter%5Bregion_slug%5Bdeliveries%5D%5D=davis&filter%5Bregion_slug%5Bdispensaries%5D%5D=davis&filter%5Bregion_slug%5Bdoctors%5D%5D=sacramento&page_size=100&size=100"
var searchTerms = ['cbd', 'syringe'];

var getRegExps = function(terms){
  arr = [];
  terms.forEach(function(term){
    arr.push(new RegExp('('+term+')','i'));
  });
  return arr;
};

var getMenuUrl = function(slug, type){
  const max_page_size = 150;
  //return `https://weedmaps.com/api/web/v1/listings/${slug}/menu?type=${type}`;
  //return `https://api-g.weedmaps.com/discovery/v1/listings/dispensaries/the-kana-company/menu_items?page=1&page_size=20&limit=20&multi_sort_by[]=relevance&multi_sort_order[]=desc&filter[match]=cbd`;
  return `http://api-g.weedmaps.com/discovery/v1/listings/dispensaries/the-kana-company/menu_items?page=1&page_size=${max_page_size}`;
};

function searchListings(_searchTerms, dispensaries){
    console.log("found "+dispensaries.length+" dispenseries")
    var matchingDispensaries = []
    var index = 0
    var callback = function(res, currDispensary, matchingDispensaries){
      if(res.err){
        console.log(res.body);
      } else if(res.status === "complete"){
        if(res.found.length > 0){
          matchingDispensaries.push(currDispensary)
          console.log("  Matches found!                           <----")
          res.found.forEach(function(product){
            console.log("    "+product.category+": "+product.name+"\n      http://weedmaps.com"+product.url);
          });
        } else console.log("  No matches.")
      } else if(res.status === "done"){
        displayMatchDisp(matchingDispensaries);
      }
      searchMenuRecurs(_searchTerms, dispensaries, ++index, matchingDispensaries, callback);
    }
    searchMenuRecurs(_searchTerms, dispensaries, index, [], callback);
}

function searchMenuRecurs(_searchTerms, dispensaries, index, matchingDispensaries, callback){
  if(typeof callback === "function"){
    if(index >= dispensaries.length){
      callback({status: "done"}, null);
    } else {
      var dispensary = dispensaries[index]
      console.log("\nDispensary: "+dispensary.name)
      console.log("  City: "+dispensary.city)
      console.log("  Type: "+dispensary.type)
      console.log("  http://weedmaps.com/dispensaries/"+dispensary.slug)

      var slug = dispensary.slug
      var type = dispensary.type

      var menuSearchDone = false;
      var menuUrl = getMenuUrl(slug,type);

      console.log('menu url is '+menuUrl);

      http.get(menuUrl, (res) => {
        console.log('getting menu');
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { 
          console.log("received data chunk");
          rawData += chunk;
        });
        res.on('end', () => {
          console.log("end response");
          var cbRes = {
            status: "incomplete",
            err: false
          };
          try {
            console.log("end of response; try");
            const parsedData = JSON.parse(rawData);
            cbRes.found = scanMenuForTerm(_searchTerms, parsedData.categories);
            cbRes.status = "complete"
          } catch (e) {
            console.log("error http get");
            cbRes.err = true;
            cbRes.status = "error"
            cbRes.body = {
              error: e.message,
              urlRequested: menuUrl
            };
          }
          callback(cbRes, dispensary, matchingDispensaries);
        });
      });

      console.log("end of searchmenu")
    }
  } else {
    console.log("Callback not a function. It is "+typeof callback)
    return;
  }
}

function scanMenuForTerm(_searchTerms, menu){
  var found = [];
  menu.forEach(function(submenu){
    submenu.items.forEach(function(product){
      var matchedTerms = 0;
      var regexSearchTerms = getRegExps(_searchTerms);
      regexSearchTerms.forEach(function(regExp){
        if((product.body+product.name).match(regExp))
          matchedTerms++;
      });
      if(matchedTerms >= regexSearchTerms.length){
        found.push({
          name: product.name,
          category: product.category_name,
          url: product.url
        });
      }
    });
  });
  return found;
}

function displayMatchDisp(dispensaries){
  console.log('Dispensaries with '+searchTerms);
  dispensaries.forEach(function(disp){
    console.log("\n"+disp.name);
  });
}

function main(){
  rl.question('Search for: ', (inputSearch)=>{
    searchTerms = inputSearch.split(' ');
    console.log('Search terms: '+searchTerms.toString());
    http.get(listingsUrl, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          searchListings(searchTerms, parsedData.data.listings);
          rl.close();
        } catch (e) {
          console.error(e.message);
        }
      });
    });
  });
  
}

main();