# GTMA prototype

De go-to-market-demo: de oude en nieuwe situatie naast elkaar, voor twee
voorbeeldorganisaties. Per moment zes schermen (overview, scores, thema's, focus,
rapporten, acties), 24 pagina's in totaal.

**Live:** https://effectory-ux.github.io/gtma/

| Organisatie | Q2 (voor) | Q3 (na) |
|---|---|---|
| Novanta | [overview](https://effectory-ux.github.io/gtma/novanta-before-overview.html) | [overview](https://effectory-ux.github.io/gtma/novanta-after-overview.html) |
| Team IT | [overview](https://effectory-ux.github.io/gtma/team-it-before-overview.html) | [overview](https://effectory-ux.github.io/gtma/team-it-after-overview.html) |

## Hoe het in elkaar zit

Elke pagina is een shell van ruim twintig regels die `renderOverview('<groep>-<moment>', '<scherm>')`
aanroept. De opbouw, de data en de grafieken zitten in `effectiveness.js`, met
`effectiveness.css` voor de opmaak en `i18n.js` voor de teksten. Chart.js komt van een CDN.

De bestandsnamen doen ertoe: de navigatie bouwt links op als
`${groep}-${moment}-${scherm}.html`, dus hernoemen breekt het wisselen tussen
organisatie en periode.

`tokens.css`, `foundation.css`, `components.css`, `icons.js` en `assets/` zijn kopieën uit het
[Engage design system](https://effectory-ux.github.io/Engage-Design-system-/), zodat dit
prototype op zichzelf werkt.
