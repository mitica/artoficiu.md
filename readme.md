# Artoficiu.md

Codul sursă al proiectului [Artoficiu.md](http://artoficiu.md)


## Data models

Conținutul siteului este ținut pe platforma Contentful.com.

Elementele de conținut suportă traducerea. Ceea ce înseamnă că un element poate
avea câmpuri care pot fi traduse în mai multe limbi. De exemplu, un articol, va
avea două titluri: unul în rusă și altul în română.

Conținutul este structurat în felul următor:

### WebAppSettings

Setările aplicației web. De obicei va fi creat un singur element de acest tip.
Sau va fi folosit ultimul creat.

### Article

Reprezintă un articol.

### Page

Reprezintă o pagină de pe site.

### ShopCategory

O categorie cu produse din magazinul online.

### ShopProduct

Un produs din magazin ce poate fi vândut.

### Slider

Un slider cu imagini. Folosit în special pentru destop pe prima pagină.