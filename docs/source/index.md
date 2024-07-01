---
title: hexo-tag-publications
sticky: 100
date: 2022-05-24
mathjax: true
---

`hexo-tag-publications` creates a publication list. 

`hexo-tag-publications` needs Font Awesome >=6.5.0 to show icons.

## Installation

```sh
yarn add hexo-tag-publications
```

## Usage

Firstly, you need to create a ${\mathrm{B{\scriptstyle{IB}} T_{\displaystyle E} X}}$ file at `source/_data/pub.bib`:

{% include_code pub.bib lang:bib pub.bib %}

You can use [wenxian](https://wenxian.njzjz.win) to generate ${\mathrm{B{\scriptstyle{IB}} T_{\displaystyle E} X}}$ files from given identifiers (DOI, PMID, or arXiv ID).

Then, you are able to add a publication list to any page or post, such as

```
{% publications %}
Zeng_NatCommun_2020_v11_p5713
{% endpublications %}
```

where `Zeng_NatCommun_2020_v11_p5713` is the entry key in the `pub.bib`.

It will be shown as 

{% publications %}
Zeng_NatCommun_2020_v11_p5713
{% endpublications %}

You can also show all publications:

```
{% publications_from_bib pub.bib %}
```

{% publications_from_bib pub.bib %}
