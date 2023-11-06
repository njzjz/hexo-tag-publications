# hexo-tag-publications

[![NPM version](https://img.shields.io/npm/v/hexo-tag-publications?color=red&logo=npm&style=flat-square)](https://www.npmjs.com/package/hexo-tag-publications)
[![NPM Downloads](https://img.shields.io/npm/dy/hexo-tag-publications?logo=npm&style=flat-square)](https://www.npmjs.com/package/hexo-tag-publications)

`hexo-tag-publications` creates a publication list. See [Here](https://njzjz.win/cv/) for an example.

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
Zeng_ChemRxiv_2021,Zeng_EnergyFuels_2021_v35_p762,Zeng_NatCommun_2020_v11_p5713,Zhang_ComputPhysCommun_2020_v253_p107206,Zeng_PhysChemChemPhys_2020_v22_p683,Cao_ChemRxiv_2019,Tian_PhysChemChemPhys_2019_v21_p22103,Han_ACSAppliedMatInterface_2018_v10_p31725
{% endpublications %}
```

where `Zeng_NatCommun_2020_v11_p5713` is the entry key in the [`pub.bib`](https://github.com/njzjz/njzjz.github.io/blob/6dcd278affcf61ed982dc01e0c3e76a98a668974/source/_data/pub.bib).
