const bibtexParse = require('bibtex-parse');
const fs = require('hexo-fs');
const pathFn = require('path');

const list2obj = (list) => {
    const obj = {};
    list.forEach(pub => {
        obj[pub.key] = pub;
    });
    return obj;
}

const get_bib = () => {
    /** returns list of object */
    const bibtex = fs.readFileSync(pathFn.join(hexo.source_dir, '_data/pub.bib'));
    const bibpubs = bibtexParse.entries(bibtex);
    return list2obj(bibpubs);
}

const get_local_bib = (bibfn) => {
    const bibtex_local = fs.readFileSync(pathFn.join(hexo.source_dir, '_data', bibfn));
    const bibpubs = bibtexParse.entries(bibtex_local);
    return list2obj(bibpubs)
}


module.exports = {
    get_bib,
    get_local_bib,
}
