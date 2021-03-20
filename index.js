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
const htmlBadge = (cls, doi) => htmlTag("span", {
    class: `badge ${cls}`,
    "data-doi": doi,
}, '', false)

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
        // replace -- to –
        var pages = pub.PAGES.toString().replace("--", "–");
        cit.push(`, ${pages}`);
    }
    cit.push('.')
    return cit.join('');
}

function get_author(authors) {
    /**
     * **Jinzhe Zeng**, Tong Zhu[email];
     */
    return authors.split(' and ').map(author => {
        author = author.trim()
        // Corresponding author
        corresponding_author = author.indexOf("*") > -1
        if (corresponding_author) {
            author = author.replace("*", "");
        }
        // FIRST, LAST => LAST FIRST
        if (author.indexOf(",") > -1) {
            author = author.split(",").map(a => a.trim()).reverse().join(" ");
        }
        // it's you?
        if (me.map(mm => mm == author).some(Boolean)) {
            author = htmlBold(author);
        }
        if (corresponding_author) {
            author += htmlIcon("fa fa-envelope fa-fw");
        }
        return author;
    }).join(', ');
}

hexo.extend.tag.register('publications', function (args, content) {
    var pubs = get_pubs(content.split(',').map(pub => pub.trim()));
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
                        htmlTag('span', { class: "pub-badges" },
                            [htmlBadge("pub_dimesions_conut", pub.DOI), htmlBadge("pub_altmetric_conut", pub.DOI)].join(""),
                            false) + // badges
                        htmlTag('span', { class: "pub-icons" }, pub_icons.map(item => {
                            /** icons */
                            if (pub[item.key]) {
                                return htmlTag('span', { class: "pub-icon" },
                                    htmlLink(item.prefix + pub[item.key], htmlIcon(item.icon)),
                                    false);
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
}) + htmlTag("link", { rel: "dns-prefetch", href: "https://metrics-api.dimensions.ai/" }) +
    htmlTag("link", { rel: "dns-prefetch", href: "https://api.altmetric.com/" }));

injector2.register('body_end', js({
    src: npm_url(name, version, "js/count.min.js"),
    async: true,
    class: 'pjax',
}));
