
const { htmlTag } = require("hexo-util");
const { injector1, injector2 } = require("./inject");
const { htmlBadge, htmlBold, htmlIcon, htmlLink, htmlNewline } = require("./tag");
const { doi_prefix } = require("./doi");
const { pub_icons } = require("./icons");
const { get_author } = require("./author");
const { get_citation } = require("./citation");


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

module.exports = {
    pubs2html,
}

