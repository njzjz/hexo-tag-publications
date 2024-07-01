const { get_bib, get_local_bib } = require("./read/bib");
const { fill } = require("./fill/fill");
const { pubs2html } = require("./render/html");

const fill_html = (pubs) => {
    // fill pubs
    fill(pubs);
    return pubs2html(hexo, pubs);
}

// global pubs
global_pubs = get_bib(hexo);

// get pubs from global bib
const get_pubs = (keys) => {
    return keys.map(key => {
        pub = global_pubs[key];
        if (!pub) throw new Error(`BibTeX entry ${key} not found`);                                                            
        return pub;
    })
}


hexo.extend.tag.register('publications', function (args, content) {
    const pubs = get_pubs(content.split(',').map(pub => pub.trim()).filter(Boolean));
    return fill_html(pubs);
}, { ends: true });

hexo.extend.tag.register('publications_from_bib', function (args, content) {
    const local_pubs = get_local_bib(hexo, args[0]);
    return fill_html(local_pubs);
}, { ends: false });
