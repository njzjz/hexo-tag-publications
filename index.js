const bibtexParse = require('bibtex-parse');
const fs = require('fs');
const bibtex = fs.readFileSync('source/_data/pub.bib', 'utf8');
const bibpubs = bibtexParse.entries(bibtex);
const css = hexo.extend.helper.get('css').bind(hexo);
const { name, version } = require('./package.json');

var me = hexo.config.pub_author || hexo.config.author;
if (typeof (me) == 'string') {
    me = [me];
}
var keypubs = {};
bibpubs.forEach(pub => {
    keypubs[pub.key] = pub;
})

const pub_icons = [
    // {key, prefix, icon}
    { key: 'DOI', prefix: 'https://doi.org/', icon: 'fas fa-search' },
    { key: 'PDF', prefix: '', icon: 'fas fa-file-pdf' },
    { key: 'RESEARCHGATE', prefix: 'https://www.researchgate.net/publication/', icon: 'fab fa-researchgate' },
    { key: 'GOOGLESCHOLAR', prefix: 'https://scholar.google.com/scholar?cluster=', icon: 'fab fa-google' },
    { key: 'GITHUB', prefix: 'https://github.com/', icon: 'fab fa-github' },
]

function get_pubs(keys) {
    return keys.map(key => {
        return keypubs[key];
    })
}

function cdn_url(path){
    return `https://cdn.jsdelivr.net/npm/${name}@${version}/${path}`;
}

function get_citation(pub) {
    /**
    * Nature Communications, 2020, 11, 5713.
    * journal, year, volume (issue), page.
    */
    cit = [];
    cit.push(`${pub.JOURNAL}, ${pub.YEAR}`);
    if (pub.VOLUME) {
        cit.push(`, ${pub.VOLUME}`);
    }
    if (pub.ISSUE) {
        cit.push(` (${pub.ISSUE})`);
    }
    if (pub.PAGES) {
        cit.push(`, ${pub.PAGES}`);
    }
    cit.push('.')
    return cit.join('');
}

function get_author(authors) {
    /**
     * **Jinzhe Zeng**, Tong Zhu[email];
     */
    var new_authors = authors.split(' and ').join(', ');
    me.forEach(mm => {
        new_authors = new_authors.replace(mm, `<b>${mm}</b>`);
    })
    new_authors = new_authors.replace(/\*/g, '<i class="fa fa-envelope fa-fw"></i>');
    return new_authors;
}

hexo.extend.tag.register('publications', function (args, content) {
    var pubs = get_pubs(content.split(','));
    var html = [];
    html.push('<pubtag><div class="link-grid pub">');
    pubs.forEach(function (pub) {
        html.push('<div class="link-grid-container">')
        if (pub.IMAGE) {
            html.push(`<div class="link-grid-image" style="background-image: url(${pub.IMAGE});"></div>`);
        }
        html.push('<p>' + pub.TITLE + '</p>');
        html.push('<p>');
        html.push(get_author(pub.AUTHOR))
        html.push('<br/>' + get_citation(pub));
        if (pub.DOI) {
            html.push(`<br/><b>DOI:</b> <a href="https://doi.org/${pub.DOI}">${pub.DOI}</a>`);
        }
        html.push('<span class="pub-icon">');
        pub_icons.forEach(item => {
            if (pub[item.key]) {
                html.push(` <a href="${item.prefix}${pub[item.key]}"><i class="${item.icon}"></i></a>`);
            }
        });
        html.push('</span></p>');
        html.push('</div>')
    })
    html.push('</div></pubtag>');
    return html.join('');
}, { ends: true });

hexo.extend.filter.register('after_render:html', function (str, data) {
    var re = /<pubtag>(([\s\S])*?)<\/pubtag>/g;
    if (str.match(re)) {
        // only add scripts for pages that have the tag
        str = str.replace(re, "$1");
        // css(cdn_url('css/pub.min.css'))
        str = str.replace('</head>', css(cdn_url('css/pub.min.css')) + '</head>');
    }
    return str;
});