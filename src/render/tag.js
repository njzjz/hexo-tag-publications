const { htmlTag } = require("hexo-util");

const htmlIcon = (cls) => htmlTag("i", { class: cls }, '');
const htmlLink = (url, text) => htmlTag("a", { href: url }, text, false);
const htmlNewline = (text) => htmlTag("p", {}, text, false)
const htmlBold = (text) => htmlTag("b", {}, text);
const htmlBadge = (cls, doi) => htmlTag("span", {
    class: `badge badge-split ${cls}`,
    "data-doi": doi,
}, '', false)

module.exports = {
    htmlIcon,
    htmlLink,
    htmlNewline,
    htmlBold,
    htmlBadge,
}