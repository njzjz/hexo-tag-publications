const fill_pdfs = (pubs) => {
    Object.values(pubs).forEach(pub => {
        // fill pdf with pmcid
        if (!pub.PDF && pub.PMCID) pub.PDF = `https://www.ncbi.nlm.nih.gov/pmc/articles/${pub.PMCID}/pdf/`;
    });
}

module.exports = {
    fill_pdfs,
}
