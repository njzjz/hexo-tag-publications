const get_citation = (pub) => {
    /**
    * Nature Communications, 2020, 11, 5713.
    * journal, year, volume (issue), page.
    */
    const cit = [];
    // booktitle for a chapter
    const journal = pub.JOURNAL || pub.JOURNALTITLE || pub.BOOKTITLE;
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

module.exports = {
    get_citation,
}