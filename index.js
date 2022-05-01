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

function get_image(doi) {
    /** get image from DOI */
    if (!doi) return null;
    const doi_s = doi.split("/");
    switch (doi_s[0]) {
        case '10.1039':
            // RCS
            return `https://pubs.rsc.org/en/Image/Get?imageInfo.ImageIdentifier.ManuscriptID=${doi_s[1]}`;
        case '10.1103':
            // APS
            return `https://journals.aps.org/prx/article/${doi}/figures/1/thumbnail`;
        case '10.1038':
            // Nature
            // new style: s41467-020-19497-z
            nature_idxs = doi_s[1].split("-");
            if (nature_idxs.length == 4 && parseInt(nature_idxs[1]) >= 18) {
                return `https://media.springernature.com/lw200/springer-static/image/art%3A10.1038%2F${doi_s[1]}/MediaObjects/${nature_idxs[0].slice(1)}_2${nature_idxs[1]}_${parseInt(nature_idxs[2])}_Fig1_HTML.png`;
            }
            return null
        default:
            return null;
    }
}

var me = hexo.config.pub_author || hexo.config.author;
if (typeof (me) == 'string') {
    me = [me];
}
var keypubs = {};

const add_images = (bibpubs_list) => {
    bibpubs_list.forEach(pub => {
        if (!pub.IMAGE) pub.IMAGE = get_image(pub.DOI);
        keypubs[pub.key] = pub;
    });
}

add_images(bibpubs);

const htmlIcon = (cls) => htmlTag("i", { class: cls }, '');
const htmlLink = (url, text) => htmlTag("a", { href: url }, text, false);
const htmlNewline = (text) => htmlTag("p", {}, text, false)
const htmlBold = (text) => htmlTag("b", {}, text);
const htmlBadge = (cls, doi) => htmlTag("span", {
    class: `badge badge-split ${cls}`,
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
    const cit = [];
    const journal = pub.JOURNAL || pub.JOURNALTITLE;
    if (journal) {
        cit.push(journal);
    }
    const year = pub.YEAR || (pub.DATE && pub.DATE.slice(0, 4));
    if (year) {
        if (journal) {
            cit.push(`, `);
        }
        cit.push(`${year}`);
    }
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
    if (cit) {
        cit.push('.');
    }
    return cit.join('');
}

function get_author(authors) {
    /**
     * **Jinzhe Zeng**, Tong Zhu[email];
     */
    return authors && authors.split(' and ').map(author => {
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

const pubs2html = (pubs) => injector1.mark(injector2.mark(htmlTag(
    "div",
    { class: "pub" },
    pubs.map((pub) => {
        /** container */
        return pub ? htmlTag(
            "div",
            { class: "pub-container" },
            [
                pub.IMAGE ? htmlTag(
                    "img",
                    { class: "pub-image", src: pub.IMAGE },
                    "",
                ) : '', // image
                htmlNewline(pub.TITLE), // first line: title
                htmlNewline([// second line
                    get_author(pub.AUTHOR), // author
                    get_citation(pub), // citation
                    pub.DOI ? htmlBold("DOI: ") + htmlLink(doi_prefix + pub.DOI, pub.DOI) : null, //doi
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
        ) : ''
    }).join(''),
    false,
)));

hexo.extend.tag.register('publications', function (args, content) {
    const pubs = get_pubs(content.split(',').map(pub => pub.trim()).filter(Boolean));
    return pubs2html(pubs);
}, { ends: true });

hexo.extend.tag.register('publications_from_bib', function (args, content) {
    const bibfn = args[0];
    const bibtex_local = fs.readFileSync(pathFn.join(hexo.source_dir, '_data', bibfn));
    const bibpubs_local = bibtexParse.entries(bibtex_local);
    add_images(bibpubs_local);
    const pubs = Object.values(bibpubs_local);
    return pubs2html(pubs);
}, { ends: false });

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
