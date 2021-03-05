(() => {
    const $$ = (className) => document.querySelectorAll(className);
    const htmlTag = (number, label, url) => {
        return `<span class="pub-count"><a href="${url}" target="_blank">${number}</a> <span class="pub-count-label">${label}</span></span>`;
    };

    const dimesions_count = (element, doi) => {
        /**
         * The API document can be found at https://doi.org/10.6084/m9.figshare.5783694.v4
         * 
         * Example:
         * API: https://metrics-api.dimensions.ai/doi/10.1038/s41467-020-19497-z
         * Details: https://badge.dimensions.ai/details/doi/10.1038/s41467-020-19497-z
         */
        const url = "https://metrics-api.dimensions.ai/doi/" + doi;
        const badge_url = "https://badge.dimensions.ai/details/doi/" + doi;
        fetch(url).catch((err) => Promise.reject(err)).then(data => data.json()).then(jdata => {
            const { times_cited } = jdata;
            if (times_cited > 0) {
                element.innerHTML = htmlTag(times_cited, "Citations", badge_url);
            }
        });
    };

    const altmetric_count = (element, doi) => {
        /** https://api.altmetric.com/ */
        const url = "https://api.altmetric.com/v1/doi/" + doi;
        fetch(url).catch((err) => Promise.reject(err)).then(data => data.json()).then(jdata => {
            const { score, details_url } = jdata;
            const round_score = Math.ceil(score);
            if (round_score > 0) {
                element.innerHTML = htmlTag(round_score, "Altmetric", details_url);
            }
        });
    };

    const show_number = () => {
        $$(".pub_dimesions_conut").forEach(element => {
            dimesions_count(element, element.dataset.doi);
        });
        $$(".pub_altmetric_conut").forEach(element => {
            altmetric_count(element, element.dataset.doi);
        });
    };
    show_number();
})();
