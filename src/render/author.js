const { htmlBold, htmlIcon } = require("./tag.js"); 

const get_myself = (hexo) => {
    var me = hexo.config.pub_author || hexo.config.author;
    if (typeof (me) == 'string') {
        me = [me];
    }
    return me;
}

const get_author = (hexo, authors) => {
    /**
     * **Jinzhe Zeng**, Tong Zhu[email];
     */
    return authors && authors.replace(/\s\s+/g, ' ').split(' and ').map(author => {
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
        if (get_myself(hexo).map(mm => mm == author).some(Boolean)) {
            author = htmlBold(author);
        }
        if (corresponding_author) {
            author += htmlIcon("fa fa-envelope fa-fw");
        }
        return author;
    }).join(', ');
}

module.exports = {
    get_author,
}
