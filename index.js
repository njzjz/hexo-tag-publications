const bibtexParse = require('bibtex-parse');
const fs = require('hexo-fs');
const pathFn = require('path');
const js = hexo.extend.helper.get('js').bind(hexo);
const css = hexo.extend.helper.get('css').bind(hexo);
const { name, version } = require('./package.json');
const Injector = require("hexo-tag-injector");
const { npm_url } = require("jsdelivr_url");
const { htmlTag } = require("hexo-util");

const bibtex = fs.readFileSync(pathFn.join(hexo.source_dir, '_data/pub.bib'));
const bibpubs = bibtexParse.entries(bibtex);
const injector1 = new Injector(hexo, id = name + "css");
const injector2 = new Injector(hexo, id = name + "js");

var me = hexo.config.pub_author || hexo.config.author;
if (typeof (me) == 'string') {
    me = [me];
}
var keypubs = {};
bibpubs.forEach(pub => {
    keypubs[pub.key] = pub;
})

const htmlIcon = (cls) => htmlTag("i", { class: cls }, '');
const htmlLink = (url, text) => htmlTag("a", { href: url }, text, false);
const htmlNewline = (text) => htmlTag("p", {}, text, false)
const htmlBold = (text) => htmlTag("b", {}, text);
const dimensionsBadge = (doi) => htmlTag("span", {
    class: "__dimensions_badge_embed__",
    "data-doi": doi,
    "data-style": "small_rectangle",
    "data-hide-zero-citations": "true",
    "data-legend": "never",
}, '')
const altmetricBadge = (doi) => htmlTag("span", {
    class: "altmetric-embed",
    "data-doi": doi,
    "data-hide-no-mentions": "true",
}, '')
const htmlBadge = (text) => htmlTag("span", {
    class: "badge",
}, text, false)

const doi_prefix = 'https://doi.org/';
const pub_icons = [
    // {key, prefix, icon}
    { key: 'DOI', prefix: doi_prefix, icon: 'fas fa-search' },
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
    if (pub.NUMBER) {
        cit.push(` (${pub.NUMBER})`);
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
        new_authors = new_authors.replace(mm, htmlBold(mm));
    })
    new_authors = new_authors.replace(/\*/g, htmlIcon("fa fa-envelope fa-fw"));
    return new_authors;
}

hexo.extend.tag.register('publications', function (args, content) {
    var pubs = get_pubs(content.split(','));
    return injector1.mark(injector2.mark(htmlTag(
        "div",
        { class: "link-grid pub" },
        pubs.map((pub) => {
            /** container */
            return htmlTag(
                "div",
                { class: "link-grid-container" },
                [
                    pub.IMAGE ? htmlTag(
                        "div",
                        { class: "link-grid-image", style: `background-image: url(${pub.IMAGE});` },
                        "",
                    ) : '', // image
                    htmlNewline(pub.TITLE), // first line: title
                    htmlNewline([// second line
                        get_author(pub.AUTHOR), // author
                        get_citation(pub), // citation
                        htmlBold("DOI: ") + htmlLink(doi_prefix + pub.DOI, pub.DOI), //doi
                        [dimensionsBadge(pub.DOI), altmetricBadge(pub.DOI)].map(htmlBadge).join("") + // badges
                        htmlTag('span', { class: "pub-icon" }, pub_icons.map(item => {
                            /** icons */
                            if (pub[item.key]) {
                                return htmlLink(item.prefix + pub[item.key], htmlIcon(item.icon));
                            }
                        }).filter(Boolean).join(''), false)
                    ].filter(Boolean).join('<br/>')), // remove empty
                ].join(''),
                false,
            )
        }).join(''),
        false,
    )));
}, { ends: true });

injector1.register('head_end', css({
    href: npm_url(name, version, 'css/pub.min.css'),
    class: 'pjax',
}));

injector2.register('body_end', js({
    src: "https://badge.dimensions.ai/badge.js",
    async: true,
    class: 'pjax',
}) + js({
    src: "https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js",
    async: true,
    class: 'pjax',
}));
