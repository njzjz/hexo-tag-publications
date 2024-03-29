const Injector = require("hexo-tag-injector");
const { name, version } = require('../../package.json');
const { npm_url } = require("unpkg_url");
const { htmlTag } = require("hexo-util");

const inject = (hexo, html) => {
    const js = hexo.extend.helper.get('js').bind(hexo);
    const css = hexo.extend.helper.get('css').bind(hexo);

    const injector1 = new Injector(hexo, id = name + "css");
    const injector2 = new Injector(hexo, id = name + "js");
    
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

    return injector1.mark(injector2.mark(html));
}

module.exports = {
    inject,
}
