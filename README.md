# GTMA prototype

De go-to-market-demo: de oude en nieuwe situatie naast elkaar, voor twee
voorbeeldorganisaties. Per moment zes schermen (overview, scores, thema's, focus,
rapporten, acties), 24 pagina's in totaal.

**Live:** https://effectory-ux.github.io/gtma/

| Organisatie | Q2 (voor) | Q3 (na) |
|---|---|---|
| Novanta | [overview](https://effectory-ux.github.io/gtma/novanta-before-overview.html) | [overview](https://effectory-ux.github.io/gtma/novanta-after-overview.html) |
| Team IT | [overview](https://effectory-ux.github.io/gtma/team-it-before-overview.html) | [overview](https://effectory-ux.github.io/gtma/team-it-after-overview.html) |

## AI Adoption Scan

Vier losse schermen rond de **AI Adoption Scan**-template, elk met een eigen URL. Ze staan los van
de before/after-demo hierboven en gebruiken de referentie-prototypes uit de
[design-system skill](https://effectory-ux.github.io/Engage-Design-system-/) als basis.

| Scherm | Wat het is |
|---|---|
| [Template kiezen](https://effectory-ux.github.io/gtma/ai-adoption-scan-template-dialog.html) | De "Choose a survey template"-dialog, met AI Adoption Scan vooraan. Preview toont de hele vragenlijst; de flow loopt door naar de vragenlijst-pagina. |
| [Vragenlijst](https://effectory-ux.github.io/gtma/ai-adoption-scan-questionnaire.html) | De CYOS Questions-stap: 24 vragen in zeven secties, read-only. |
| [Thema's](https://effectory-ux.github.io/gtma/ai-adoption-scan-themes.html) | Het Themes-tabblad: de zes stages vergeleken, plus een kaart per thema met de definitie uit de template. |
| [Scores](https://effectory-ux.github.io/gtma/ai-adoption-scan-scores.html) | Het Scores-tabblad: de 18 schaalvragen per thema, met Effectory Index en vorige meting. |

De inhoud komt uit *AI survey template 1.0.xlsx*: de vragen en antwoordtypes uit `English_FINAL`, de
thema-omschrijvingen uit `Theme descriptions_FINAL`, en de template-teksten uit `Template details_FINAL`.
`#ORGANISATIE#` is Novanta B.V. geworden, zodat het bij de rest van deze repo past.

**De scores zijn verzonnen**, maar niet willekeurig: elk thema-cijfer is het gemiddelde van zijn eigen
vragen, en het verhaal loopt door de funnel — Clarity 74, Capability 68, Environment 79, Usage 71,
Impact 76, Wellbeing 65. Alles staat boven de vorige meting; Capability en Wellbeing zitten net onder
de benchmark. Zo is er iets te vieren én iets te bespreken.

Drie dingen om te weten voor je hierop verder bouwt:

- **Er is geen AI-illustratie in het design system.** Deze schermen leunen op `esg-template.svg` als
  tijdelijke stand-in, dus de template-kaart deelt zijn plaatje met de ESG Scan.
- **Het scale-chip-vocabulaire kent geen "Single choice".** Twee vragen (frequentie en
  productiviteitswinst) zijn single choice; die krijgen hier een chip die het `single-answer`-icoon en
  de groene accenttokens hergebruikt. Prototype-lokaal, nog niet in de referentie.
- **De intro-tekst van de template staat niet in deze schermen.** `English_FINAL` opent met een
  ongenummerde regel die uitlegt wat "AI" in deze survey betekent. Dat is tekst voor de deelnemer,
  geen vraag, en het questionnaire-overzicht heeft er geen plek voor — dus is die er bewust uit
  gelaten. Hij hoort in de GTMA-kant van deze repo, niet in de Questions-stap. De tekst zelf:

  > For this survey, Artificial Intelligence (AI) refers to ways of working where AI supports or
  > shapes how work gets done, such as: generating or refining content (for example writing,
  > summarizing, brainstorming); automating or assisting tasks and workflows; analyzing data to
  > identify patterns, trends, risks, or opportunities that support decisions.

## Hoe het in elkaar zit

Elke pagina is een shell van ruim twintig regels die `renderOverview('<groep>-<moment>', '<scherm>')`
aanroept. De opbouw, de data en de grafieken zitten in `effectiveness.js`, met
`effectiveness.css` voor de opmaak en `i18n.js` voor de teksten. Chart.js komt van een CDN.

De bestandsnamen doen ertoe: de navigatie bouwt links op als
`${groep}-${moment}-${scherm}.html`, dus hernoemen breekt het wisselen tussen
organisatie en periode.

De motor en de opmaak komen rechtstreeks van het
[Engage design system](https://effectory-ux.github.io/Engage-Design-system-/):
`effectiveness.js`, `effectiveness.css`, `i18n.js`, de tokens, componenten, `icons.js` en
de assets worden daar geladen. Deze repo bevat alleen de 24 schermen en de landingspagina.
Een wijziging in het design system is hier meteen zichtbaar; verhuist die site, dan moeten
deze links mee.
