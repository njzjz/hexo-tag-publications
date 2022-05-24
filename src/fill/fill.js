const { fill_images } = require("./image");
const { fill_pdfs } = require("./pdf");

const fill = (pubs) => {
    fill_images(pubs);
    fill_pdfs(pubs);
}

module.exports = {
    fill,
}