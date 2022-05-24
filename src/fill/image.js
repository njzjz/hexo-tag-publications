const get_image = (doi) => {
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

const fill_images = (pubs) => {
    Object.values(pubs).forEach(pub => {
        if (!pub.IMAGE) pub.IMAGE = get_image(pub.DOI);
    });
}

module.exports = {
    fill_images,
}
