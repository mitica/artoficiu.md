# Artoficiu.md

Codul sursă al proiectului [Artoficiu.md](http://artoficiu.md)


## Conținut

Conținutul siteului este ținut pe platforma Contentful.com.

Elementele de conținut suportă traducerea. Ceea ce înseamnă că un element poate
avea câmpuri care pot fi traduse în mai multe limbi. De exemplu, un articol, va
avea două titluri: unul în rusă și altul în română.

Conținutul este structurat în felul următor:


### Article

Acest tip de date reprezontă un articol.

Proprietăți:

- **title** (_obligatoriu_) - titlul unui element;
- **slug** (_obligatoriu_) - este un nume unic, care va apărea în adresa URL;
- **text** (_obligatoriu_) - textul articolului în format [markdown](https://en.wikipedia.org/wiki/Markdown);
- **summary** (_obligatoriu_) - o parte din text folosită ca descriere;
- **image** (_opțional_) - o imagine reprezentativă;
- **createdAt** (_opțional_) - data creării articoluli, folosit doar pentru articolele vechi importate din alt sistem;


### Page

O pagină: Despre noi, Garanției, etc.

Proprietăți:

- **title** (_obligatoriu_) - titlul unui element;
- **slug** (_obligatoriu_) - este un nume unic, care va apărea în adresa URL;
- **text** (_obligatoriu_) - textul articolului în format _markdown_;
- **summary** (_opțional_) - o parte din text folosită ca descriere;
- **image** (_opțional_) - o imagine reprezentativă;
- **shortTitle** (_opțional_) - titlu scurt - folosit în meniuri;


### Shop Category

O categorie cu produse din magazinul online.

Proprietăți:

- **name** (_obligatoriu_) - numele unei categorii;
- **slug** (_obligatoriu_) - este un nume unic, care va apărea în adresa URL;
- **title** (_opțional_) - titlul unui element, va atărea la paginile individuale;
- **order** (_opțional_) - numărul de ordine în meniuri;
- **isPromoted** (_opțional_) - este o categorie promovată sau nu: Produse populare, etc.;
- **icon** (_opțional_) - o imagine folosită ca icon;
- **metaTitle** (_opțional_) - titlul folosit în titlul paginii;
- **metaDescription** (_opțional_) - descriere categorie;


### Shop Product

Un produs din magazin ce poate fi vândut.

Proprietăți:

- **name** (_obligatoriu_) - numele unui produs;
- **slug** (_obligatoriu_) - este un nume unic, care va apărea în adresa URL;
- **price** (_obligatoriu_) - prețul unui produs;
- **oldPrice** (_opțional_) - prețul vechi al unui produs;
- **isInStock** (_obligatoriu_) - este în stoc sau nu;
- **title** (_opțional_) - titlul unui element (mai lung ca numele), va atărea la paginile individuale;
- **description** (_opțional_) - descrierea în format _markdown_;
- **variants** (_opțional_) - o listă de variante ale produsului: **Shop Product Variant**;
- **categories** (_opțional_) - o listă de categorii din care face parte produsul;
- **images** (_opțional_) - o listă de imagini;
- **properties** (_opțional_) - o listă de proprietăți;
- **metaTitle** (_opțional_) - titlul folosit în titlul paginii HTML;
- **metaDescription** (_opțional_) - descriere folosită în pagina HTML;


### Shop Product Variant

O variantă a unui produs. Exemplu: Scaun Roșu.

Proprietăți:

- **name** (_opțional_) - nume, dacă nu este indicat, se va forma din proprietățile variantei;
- **price** (_opțional_) - prețul - nefolosit;
- **oldPrice** (_opțional_) - prețul vechi - nefolosit;
- **isInStock** (_obligatoriu_) - este în stoc sau nu;
- **properties** (_opțional_) - o listă de proprietăți: culoare, etc.;


### Slider

Un slider cu imagini. Folosit în special pentru destop pe prima pagină.

Proprietăți:

- **name** (_obligatoriu_) - numele unui slider;
- **items** (_obligatoriu_) - o listă de elemente (**SliderItem**) care fac parte din slider;


### SliderItem

Un element al unui slider.

Proprietăți:

- **title** (_obligatoriu_) - titlul care va apărea pe slider;
- **image** (_obligatoriu_) - o imagine;
- **link** (_opțional_) - un link spre o pagină web;


### Web App Settings

Setările aplicației web. De obicei va fi creat un singur element de acest tip.
Sau va fi folosit ultimul creat.

Proprietăți:

- **title** (_obligatoriu_) - titlul unui element;
- **homepageSlider** (_obligatoriu_) - un element _Slider_ pentru pagina de start;
