const MenuSearch = require('../MenuSearch');

var search = new MenuSearch("the-kana-company")
var done = (results) => {
    results.forEach( (item)=> {
        console.log(`Match:\n\tProduct Name: ${item.name}\n\tCategory: ${item.category.name}\n\tLink: ${item.web_url}`);
    });
}
search.searchFor(['cbd', 'pod'], done);
