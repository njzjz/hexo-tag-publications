---
title: hexo-tag-publications
sticky: 100
---

`hexo-tag-publications` creates a publication list. 

`hexo-tag-publications` needs Font Awesome to show icons.

## Installation

```sh
yarn add hexo-tag-publications
```

## Usage

Firstly, you need to create a bib file at `source/_data/pub.bib`. See [here](https://github.com/njzjz/njzjz.github.io/blob/6dcd278affcf61ed982dc01e0c3e76a98a668974/source/_data/pub.bib) for an example.

Then, you are able to add a publication list to any page or post, such as

```
{% publications %}
Zeng_NatCommun_2020_v11_p5713
{% endpublications %}
```

where `Zeng_NatCommun_2020_v11_p5713` is the entry key in the [`pub.bib`](https://github.com/njzjz/njzjz.github.io/blob/6dcd278affcf61ed982dc01e0c3e76a98a668974/source/_data/pub.bib).

It will be shown as 

{% publications %}
Zeng_NatCommun_2020_v11_p5713
{% endpublications %}
