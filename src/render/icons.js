const { doi_prefix } = require("./doi");

const pub_icons = [
    // {key, prefix, icon}
    { key: 'DOI', prefix: doi_prefix, icon: 'fas fa-search' },
    { key: 'PDF', prefix: '', icon: 'fas fa-file-pdf',
        fallback: { key: 'DOI', prefix: 'https://unpaywall.org/', icon: 'fas fa-file-pdf'},
    },
    { key: 'RESEARCHGATE', prefix: 'https://www.researchgate.net/publication/', icon: 'fab fa-researchgate' },
    { key: 'GOOGLESCHOLAR', prefix: 'https://scholar.google.com/scholar?cluster=', icon: 'fab fa-google', 
        fallback: { key: 'DOI', prefix: 'https://scholar.google.com/scholar?q=', icon: 'fab fa-google' },
    },
    { key: 'GITHUB', prefix: 'https://github.com/', icon: 'fab fa-github' },
]

module.exports = {
    pub_icons,
}
