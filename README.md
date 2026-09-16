# GTMA prototype

De go-to-market-demo: de oude en nieuwe situatie naast elkaar, voor twee
voorbeeldorganisaties. Per moment zes schermen (overview, scores, thema's, focus,
rapporten, acties), 24 pagina's in totaal.

**Live:** https://effectory-ux.github.io/gtma/

## Waar de demo begint

De flow start op [`surveys.html`](https://effectory-ux.github.io/gtma/surveys.html), de
Surveys-pagina van Novanta B.V. Bovenaan de lijst staan de twee metingen; daaronder de
AI Adoption Scan en wat context-rijen.

| Vanaf de Surveys-pagina | Waar je uitkomt |
|---|---|
| Rij **Your voice 2026 Q3** | `novanta-after-overview.html` (de nieuwe situatie) |
| Rij **Your voice 2026 Q2** | `novanta-before-overview.html` (de oude situatie) |
| Rij **AI Adoption Scan** | `ai-adoption-scan-overview.html`, met Themes en Scores in de tabbar |
| Knop **Create survey** | de template-dialog en verder naar de vragenlijst |

Terug loopt het net zo: **Back** in de breadcrumb en **All surveys** in de navigatie komen op
de Surveys-pagina uit, "Save & Close" in de vragenlijst ook. Alleen de rijen die hierboven
staan zijn klikbaar; de andere rijen zijn er voor het beeld en om de filters iets te filteren
te geven, en die reageren dus niet op een klik.

Op de resultaatschermen wordt die navigatie geregeld door [`gtma-flow.js`](gtma-flow.js) in
deze repo. Dat kan niet in `effectiveness.js`, want dat bestand komt uit het design system en
weet niets van deze demo.

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
| [Template kiezen](https://effectory-ux.github.io/gtma/surveys.html) | Zit nu in de Surveys-pagina, achter **Create survey**: de "Choose a survey template"-dialog met AI Adoption Scan vooraan. Preview toont de hele vragenlijst; de flow loopt door naar de vragenlijst-pagina. |
| [Vragenlijst](https://effectory-ux.github.io/gtma/ai-adoption-scan-questionnaire.html) | De CYOS Questions-stap: 24 vragen in zeven secties, read-only. |
| [Overview](https://effectory-ux.github.io/gtma/ai-adoption-scan-overview.html) | Het Overview-tabblad, met alleen de kaarten die deze scan heeft: hoogste scores, laagste scores en respons. Shell en kaarten komen uit `effectiveness.css`, dus het is letterlijk de Overview van het dashboard met drie kaarten. |
| [Thema's](https://effectory-ux.github.io/gtma/ai-adoption-scan-themes.html) | Het Themes-tabblad: de zes stages vergeleken, plus een kaart per thema met de definitie uit de template. |
| [Scores](https://effectory-ux.github.io/gtma/ai-adoption-scan-scores.html) | Het Scores-tabblad: de 18 schaalvragen per thema, met Effectory Index en vorige meting. |
| [Actions](https://effectory-ux.github.io/gtma/ai-adoption-scan-actions.html) | Het Actions-tabblad zolang er nog niets besloten is: de lege staat van het dashboard, met de vier reactietypes en een route terug naar de resultaten. |

De tabbar van deze drie schermen is korter dan die van het dashboard: Focus View, Open answers en
Topics & Ideas staan er niet in, omdat de scan die niet heeft. Wat overblijft is Overview, Themes,
Scores, Reports en Actions, waarvan alleen Reports nog leeg blijft.

De Actions-pagina heeft een werkende action planner, maar begint leeg. "Create custom action" maakt
een pin aan en opent het sidepanel: titel, goal, omschrijving en to-do's met een deadline en iemand
erop. Zodra er een pin is, wisselt de lege staat om naar de kop, de vier tellers en de tabel, precies
zoals op het dashboard; haal je de laatste pin weg, dan komt de lege staat terug.

Dat werkt doordat deze pagina `effectiveness.js` laadt zonder `renderOverview()` aan te roepen. Dan
krijg je alleen de bouwstenen (`ACT_STORE`, `actionPanel`, `loadActions`, `wireActions`, `apRowHTML`,
`actionsSummaryHTML`, `actRemoveDialog`) en wordt er geen dashboard opgebouwd en niets geseed. De
enige twee die niet te hergebruiken zijn, `openAP` en `renderAPBody`, staan in dat bestand binnen
`renderOverview()`; die staan hier in de pagina zelf, korter dan het origineel omdat elke rij op dit
scherm een custom pin is en er dus geen thema- of vraagpanel is om naartoe te routeren.

De teksten, de wrapper en de maatvoering zijn gelijk aan het dashboard: `.overview-wrap` >
`.view#view-actions` > `.ap-wrap.actions-page`, met dezelfde 1152 px kolom en dezelfde 960 px lege
staat. Let op: de lege staat noemt de Focus View ("Respond to a focus area"), en die tab heeft deze
scan niet. Dat is bewust gelijkgehouden aan het dashboard.

De pin blijft staan als je naar Themes of Scores gaat en terugkomt. Op het dashboard wisselen de
tabs binnen één pagina, dus daar overleeft `ACT_STORE` dat vanzelf; hier is elke tab een echte
paginalading. De state gaat daarom in `sessionStorage` onder `gtma-ai-scan-planner`: hij blijft zolang
het tabblad open is, en een nieuw tabblad begint weer leeg.

Twee `[hidden]`-regels staan lokaal in de pagina. `.actions-empty` en `.act-row` zetten hun eigen
`display`, en die wint van `[hidden]`. Op het dashboard valt dat niet op, want daar wordt de lege
staat uit de DOM gehaald in plaats van verborgen, en heeft de planner altijd een geseede rij met een
bewerkdatum. Hoort eigenlijk in `effectiveness.css` opgelost te worden.

De inhoud komt uit *AI survey template 1.0.xlsx*: de vragen en antwoordtypes uit `English_FINAL`, de
thema-omschrijvingen uit `Theme descriptions_FINAL`, en de template-teksten uit `Template details_FINAL`.
`#ORGANISATIE#` is Novanta B.V. geworden, zodat het bij de rest van deze repo past.

**De scores zijn verzonnen**, maar niet willekeurig: elk thema-cijfer is het gemiddelde van zijn eigen
vragen, en het verhaal loopt door de funnel — Clarity 74, Capability 68, Environment 79, Usage 71,
Impact 76, Wellbeing 65. Alles staat boven de vorige meting; Capability en Wellbeing zitten net onder
de benchmark. Zo is er iets te vieren én iets te bespreken.

Drie dingen om te weten voor je hierop verder bouwt:

- **De AI-illustratie komt uit deze repo, niet uit het design system.** Al het andere op deze
  schermen laadt van de design-system-site, maar daar zit nog geen AI-illustratie. Daarom staat
  `assets/illustrations/templates/ai-template.svg` hier, en wijst alleen dat ene pad lokaal.
  Zodra de illustratie in `assets.tar.gz` van het design system zit, kan het lokale bestand weg en
  gaat het pad terug naar de site — zoek op `TPL_ART_LOCAL`.
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

## Participants-stap (random sampling)

[`cyos-participants.html`](https://effectory-ux.github.io/gtma/cyos-participants.html) is stap 2 van
CYOS. De sampling-inhoud komt uit de Figma-sectie *Turning on sampling* in
`Participant-random-sampling`; de shell, de maatvoering en de teksten zijn daarna
gelijkgetrokken met de echte stap in My Effectory. Eén pagina met de states, niet acht losse
schermen:

| State | Wat je ziet |
|---|---|
| Leeg | De illustratie met "Add your participants" |
| Leeg + Random sample aan | De uitleg-kaart erboven, illustratie blijft |
| Select groups | De dialog: structuur, zoeken, en per groep een vinkje |
| Gekozen | "N groups selected", daaronder de deelnemers zelf (naam, e-mail, groep) |
| Gekozen + Random sample aan | "Inviting X of Y", de sample-slider, de guide-strip, en de groepentabel |

De slider rekent alles live door: per groep `floor(n × percentage)` en de kop is de som. Een groep met
minder dan vijf deelnemers krijgt het `eye-off`-icoon met "Limited results because group is too
small"; dat hangt aan de omvang van de groep zelf, niet aan het getrokken sample. In de structuur is
Board (2 mensen) de groep waar dat op staat. De vinkjes in de dialog werken, dus de aantallen, de deelnemerslijst, de stepper-subtitel en
de knop ("Select N groups") volgen wat je aanvinkt.

### Wat er uit de vergelijking met de echte stap kwam

De eerste versie stond op de shell uit de Figma (`_CYOS alt-menu`: stappen als pillen in de
bovenbalk, en Questionnaire / Schedule als stapnamen). Die shell staat niet in het product. Naast de
echte stap gelegd zijn deze dingen rechtgezet:

- **De shell is nu die van het vragenlijst-scherm in deze repo**, en dat is ook die van het product:
  logobalk met Draft, naam en Edit name links en Help articles + English rechts, daaronder de
  vier-stappenrail met Questions, Participants, Survey period en Layout & emails. De twee
  CYOS-schermen hier zijn nu dus gelijk aan elkaar.
- **Kolombreedte 1000px** in plaats van 920, en de lege staat loopt over de volle breedte met rechte
  hoeken in plaats van afgerond.
- **De teksten komen uit het product**, niet uit de Figma: "Select the groups that will participate
  in this survey" met een Learn more-link, "…, by editing the selection." in de lege staat, en de
  dialog-omschrijving over de Inviting Structure.
- **De toggle blijft in de kop staan**, ook als er groepen gekozen zijn. De Figma zette hem in dat
  geval in de kaart; het product doet dat niet.
- **De knoppen hebben geen icoon** ("Select groups", "Edit selection"), de kaart heeft een neutrale
  rand van 8px met 32px padding, en het percentage naast de slider is platte tekst in plaats van een
  invoerveld.
- **De voetbalk** heeft links Previous step, rechts "All changes were saved". De labels staan in
  sentence case in de HTML en worden door CSS getitelcased, precies zoals het product het doet.
- **De groepentabel heet Name / Invited sample / Participants**, en in de dialog staat bij
  Participants een breuk (`60/60`), zoals in het product.

Vier dingen om te weten:

- **Slider en tabel zijn prototype-lokaal.** Het design system heeft nog geen Slider- en
  Table-component; beide docs-pagina's zijn een placeholder. Ze staan hier op DS-tokens.
- **De illustratie staat in deze repo**, net als de AI-template-art. Uit Figma gerenderd op 1x, dus
  net niet scherp op retina. Zoek op `PT_ART_LOCAL`.
- **De verdeling van het sample is simpeler dan in het product.** Hier is het `floor(n × percentage)`
  per groep. Het product verdeelt anders: bij 25% van 365 kwamen daar 4 van 17, 36 van 141 en 4 van
  25 uit, dus dat is geen vast percentage per groep maar een gestratificeerde verdeling.
- **De structuren zijn verzonnen.** Novanta B.V. telt 481 mensen en is op twee manieren op te delen,
  te kiezen in de select boven de tabel:
  - **Organizational Structure** (blauw) met negen afdelingen en hun teams. **Team IT** zit erbij, dus
    de structuur hier en het resultatendashboard in dit repo wijzen naar dezelfde groep.
  - **Geographical** (groen) met The Netherlands, Germany en United Kingdom, elk met hun vestiging.
    Zo heet de tweede structuur ook in het product.

  Dezelfde mensen, andere snede: allebei tellen ze op tot 481, en elke persoon in de deelnemerslijst
  hangt in beide structuren ergens. De lijst toont de laatste stap van dat pad; hover je erover, dan
  zie je het hele pad, bijvoorbeeld "Novanta B.V. › Engineering › Software development". Wat je in de ene structuur aanvinkt blijft staan als je
  naar de andere wisselt. Alles boven een team wordt berekend uit de aangevinkte teams, dus ouder,
  kind en totaal kloppen altijd, bij elk samplepercentage. Rijen met een chevron klappen open.

## Survey period-stap

[`cyos-survey-period.html`](https://effectory-ux.github.io/gtma/cyos-survey-period.html) is stap 3,
nagebouwd van de echte stap in My Effectory. Boven de kaart de vraag "When should the survey start?"
met **Schedule for later** en **Immediately**; kies je Immediately, dan verdwijnt de startdatum, want
dan begint hij bij opslaan.

In de grijze kaart: **Frequency** (Once, Weekly, Monthly, Quarterly), een scheidingslijn, en daaronder
**Start date** en **End date**, elk met een datumveld en een tijdveld met losse uren en minuten en een
stepper. Daaronder de tijdzone en de blauwe tip "We recommend setting a survey period of at least one
week".

De datumpicker is de popover uit het product: 296px, ronde dagcellen van 36px, weken die op zondag
beginnen, vandaag met een randje. Hij respecteert het venster dat het project toestaat (hier heel
2026) en de einddatum kan nooit vóór de startdatum liggen; die dagen staan uit. Zodra allebei de data
staan, schrijft de stepper ze in de subtitel van de stap.

De twee gebouwde stappen lopen in elkaar over: de stepper bovenaan en de knoppen Previous step en
Next step wisselen tussen Participants en Survey period.

Twee dingen die de kaart omgooien, allebei nagekeken in het product:

- **Immediately** haalt de startdatum weg. De einddatum blijft in de linkerkolom op zijn eigen breedte
  staan, hij rekt niet op over de volle kaart.
- **Een herhalende frequentie** (Weekly, Monthly, Quarterly) maakt er een schema van: de labels worden
  "Start of schedule" en "End of schedule" met een infoicoon, er komt een veld **Survey duration**
  onder de tijdzone (1 tot 31 dagen, met 14 dagen als aanbeveling), en de blauwe tip verdwijnt, want
  die gaat over de looptijd van één survey.

**Random sampling verandert de stap ook.** Staat het op de Participants-stap aan, dan verschijnt hier
onder de kaart het blok **The selected sampling rotation**, zoals in het product: blauw vlak met een
volle blauwe rand, een titel met rechts een knop "Edit sample size", en daaronder een lijstje met per
regel een groen vinkje of een oranje waarschuwing.

De regels rekenen mee met wat er is ingesteld. Het aantal cycli dat nodig is om iedereen een keer te
bereiken is `ceil(totaal / sample)`, dus bij 25% van 481 zijn dat er 5. Hoeveel cycli er in de gekozen
periode passen volgt uit de start- en einddatum bij de gekozen frequentie; is dat minder dan nodig,
dan wordt die regel oranje. Zonder data laat hij die twee regels weg in plaats van er een placeholder
neer te zetten.

Beide stappen onthouden zichzelf, want heen en weer lopen is hier een echte paginalading. De
Participants-stap bewaart de toggle, het percentage, de gekozen structuur en welke teams zijn
aangevinkt; de Survey period-stap bewaart de startkeuze, de frequentie, de data, de tijden, de
tijdzone en de duur. Ook de subtitel van de Participants-stap in de stepper leest die opslag, dus die
telt mee met de echte selectie. Alles staat in `sessionStorage`, dus het blijft zolang het tabblad
open is en een nieuw tabblad begint schoon. In dat nieuwe tabblad is er ook niets over sampling
bekend, en blijft het rotatieblok weg.

Datumpicker en tijdveld zijn prototype-lokaal; het design system heeft wel een Date picker, maar deze
moest het toegestane venster kennen.

## Layout & emails-stap

[`cyos-layout-emails.html`](https://effectory-ux.github.io/gtma/cyos-layout-emails.html) is stap 4.
Bovenaan een kaart **Survey layout** met de keuze rechts, en daarin een grijze plaat met de twee
previews, elk onder een donker chipje: Landing page en Questionnaire. Daaronder de sectie **Email
communication** met twee rijen, Invitation email en Reminder email, elk met een icoontegel, een
omschrijving en de gekozen waarde. Die waarde is dezelfde inline selection button als bij de layout,
met hetzelfde merkje ervoor, alleen wijst de chevron naar rechts omdat je doorklikt naar de mail in
plaats van een menu te openen. Beide paginabrede kaarten staan op `--sh-card`.

Klik je op een rij, dan opent de mail-dialog, nagebouwd naar die in My Effectory. Bovenin een info-
notificatie die uitlegt dat beide mails dezelfde template gebruiken en alleen in onderwerp en inhoud
verschillen. Daaronder **Selected template**, een select over de volle breedte met **Create template**
ernaast, en dan een grijze plaat met de taalkeuze en **Edit email content**, en daarin de mail zelf:
onderwerpregel, logo, kop, tekst, de knop, het beeld en de privacyregel, met onderaan de opmerking dat
de opmaak per mailclient kan verschillen. De dialog is `dialog-m` (800px).

De keuze in de dialog is een concept tot je op **Use email template** klikt: dan pas verandert de rij
op de pagina. Sluit je met het kruisje, escape of naast de dialog, dan blijft alles zoals het was, net
als in het product. De dialog gebruikt de `overlay` van het design system en scrolt vanbinnen, dus de
titel en de actieknop blijven staan.

De mail draagt dezelfde templates als de survey layout, dus mail en vragenlijst horen altijd bij één
merk. Het merkje bovenin de mail, de knop en het beeld volgen de gekozen template: het beeld is dat
van de landingspagina en de knop is een primary button uit het design system, iets groter, met de
templatekleur en een label dat op die kleur leesbaar blijft. De taalkiezer werkt: onderwerp, kop,
tekst, knop en privacyregel wisselen mee tussen Engels, Nederlands en Duits. Het design system heeft
geen vlagafbeeldingen, alleen de `.flag`-swatch uit de select-documentatie (18x14, radius 2, hairline),
dus die zijn hier met gradients getekend. Beide mails delen één template, zoals de dialog zelf ook zegt: kies je in de reminder een andere
template, dan verandert de invitation mee.

De previews zijn nagebouwd naar de echte in My Effectory. Beide zijn een wit browserkaartje met een
balkje bovenin: het logo links, een grijze pil in het midden. De landingspagina toont daaronder de
foto over het hele vlak, met de titelregels, drie deelnemers (rondje met twee regels) en de knop
eroverheen in wit. Over de foto ligt een lichte blur met een donkere gradient, zodat die witte
elementen contrast houden waar de foto licht is. De vragenlijst heeft een band in de primaire kleur, daaronder het gekleurde vlak
met het patroon eroverheen, de titelregels in wit, de smalle vraagkaart met de vijfpuntsschaal en het
antwoordveld, en onderaan de knop. De knoppen liggen met een schaduw op het beeld en het gekleurde
vlak, zodat ze niet in de achtergrond wegvallen, en de bolletjes van de schaal zitten net als in het
echte scherm elk in een wit rondje dat de schaduw draagt. De tegels en iconen komen uit het product: `clipboard-a` en `send`
op accent-blauw, `bell` op accent-oranje.

De keuze is een inline selection button met de menu-component eronder, met twee templates: **Novanta
yellow** en **Novanta blue**. Elke template heeft een merkje van een vierkantje in zijn lichte kleur
met een rondje in zijn primaire kleur, en dat zijn precies de twee kleuren waar de previews mee zijn
opgebouwd. Wissel je van template, dan kleuren het logo in de balk, de knop, de voortgangsbalk en het
vlak van de vragenlijst mee, dus je ziet meteen wat je krijgt.

Het beeldmateriaal staat in `assets/img/`: `layout-landing.jpeg` is de foto van de landingspagina en
`layout-pattern.svg` het patroon van de vragenlijst. Het patroon is zwart en ligt op 12% over het
gekleurde vlak, zodat het in elke templatekleur werkt. Novanta yellow is geel op oranje, Novanta blue
is blauw op dieper blauw.

De oude naam `ai-adoption-scan-template-dialog.html` blijft bestaan als doorstuurpagina naar
`surveys.html`, zodat links die al rondgingen niet breken.

### De AI Adoption Scan per groep

De vier schermen van de scan lezen hun cijfers uit [`ai-scan-data.js`](ai-scan-data.js): per vraag een
benchmark en een score per groep en per meting, dezelfde vorm die `effectiveness.js` voor Your voice
gebruikt. Daaruit volgt de rest: de hoogste en laagste scores op de overview zijn de uitersten van die
lijst, en een thema is het gemiddelde van zijn eigen vragen. Zo kunnen de drie schermen niet meer uit
elkaar lopen.

De **Reports**-tab toont dezelfde drie rapporten als de Your voice-resultaten, met de tekst van de
scan.

De groep komt uit de URL: `?group=team-it` toont Team IT, zonder parameter de hele organisatie. De
filterknop in de kop wisselt ertussen en de tabs binnen de scan houden de keuze vast
([`ai-scan-scope.js`](ai-scan-scope.js)). Die knop is een toggle, net als in de Your voice-resultaten:
één klik en je zit in de andere groep, op dezelfde tab. Novanta houdt exact de cijfers die het had; Team IT is een
kleiner team dat op de meeste vragen hoger scoort maar achterblijft op de tools en op werkzekerheid.

### De Questions-stap

[`ai-adoption-scan-questionnaire.html`](https://effectory-ux.github.io/gtma/ai-adoption-scan-questionnaire.html)
is stap 1 en hing tot nu toe los van de rest. Hij heeft nu dezelfde brede stappenbalk als de andere drie,
navigeert via die balk naar Participants, Survey period en Layout & emails, en schrijft op wat de template
vraagt (`gtma-cyos-questions`: template, aantal vragen, invulduur). De andere stappen tonen dat in hun
balk, en de samenvatting telt daarmee de echte vragenlijst in plaats van een vast getal.

### Review and plan

**Review & plan** onderin is op elke stap uitgeschakeld tot alle stappen zijn ingevuld, met een tooltip
die dat zegt, en opent daarna de afsluitende samenvatting, nagebouwd naar die in My Effectory: een
`dialog-s` met per stap een rij, elk met een eigen tegel in brand-subtle, de staptitel en daaronder de
feiten als label-waardeparen. Alles wordt teruggelezen uit de stappen zelf, dus wat je in Participants
en Survey period koos staat er ook echt in; is een stap nog niet ingevuld, dan staat er "Not selected
yet". De rijen zijn gescheiden door hairlines en de lijst scrolt vanbinnen, dus de titel en de knoppen
blijven staan.

Waar het origineel een geruite lijst is, staat elke stap hier op een eigen kaartje met een tegel in zijn
eigen accentkleur, zodat je de vier blokken uit elkaar houdt. De labels staan in `content-secondary`,
de waarden in 500 en op één gedeelde kolom, dus je leest de waarden recht naar beneden. Elk kaartje
heeft een **Edit** naar die stap, behalve het kaartje van de stap waar je al bent.

Welke regels er staan is nagelopen in My Effectory, per combinatie:

| situatie | wat er staat |
|---|---|
| random sampling aan | `Randomized sample: 25% (91 participants)` |
| random sampling uit | de zin `365 participants from 17 groups`, zonder label |
| frequentie Once | blok heet **Survey period**, met `Starts` en `Ends` |
| een frequentie gekozen | blok heet **Schedule**, met `Frequency`, `Start of schedule`, `End of schedule` en `Total surveys created` |
| direct starten | de actieknop heet **Launch survey** in plaats van **Plan survey** |

De tijdzone en de looptijd per ronde staan wel in de stap zelf, maar niet in deze dialog. Het dialog
leeft in [`cyos-review.css`](cyos-review.css) en [`cyos-review.js`](cyos-review.js), zodat alle drie de
stappen hem openen en de knop blijft werken als je via **Edit** terugspringt.

### Afsluiten en terugkomen

**Plan survey** in de samenvatting sluit de setup af op
[`cyos-launched.html`](https://effectory-ux.github.io/gtma/cyos-launched.html): alleen de kopbalk, de
illustratie uit het product, "Your survey is ready for take off!" met de startdatum eronder, en een
knop terug naar Surveys. Start de survey direct, dan staat er dat hij meteen begint.

Het scherm komt in één beweging binnen: de illustratie schaalt op zijn plek, een ring rijdt er
eenmalig achter vandaan, en de kop, de regel eronder en de knop volgen elkaar op. Alles op de
motion-tokens van het design system, en onder `prefers-reduced-motion` staat het stil.

De kopbalk van de setup heeft geen **Help articles** meer; alleen de taalkeuze blijft staan.

**Save & close** laat de survey achter als concept in plaats van hem kwijt te raken.
[`cyos-draft.js`](cyos-draft.js) houdt een lijst bij van elke survey die je in deze sessie aanmaakt,
met naam, project, status, de stap waar je was en een kopie van wat de stappen hadden ingevuld. Op de
Surveys-pagina staan ze allemaal bovenaan **All surveys**, nieuwste eerst, met de tag Draft, Planned of
Running.

Een nieuwe survey begint schoon: de stappen worden leeggemaakt, zodat de tweede survey niet de vinkjes
van de eerste erft. Klik je een concept aan, dan wordt dat weer de survey die je bewerkt en komt zijn
invoer terug; een ingeplande of lopende survey opent zijn eigen pagina.

### De survey zelf

[`survey-detail.html`](https://effectory-ux.github.io/gtma/survey-detail.html) is de pagina van de
survey nadat hij is ingepland: de naam met zijn status, een balk die zegt wanneer hij begint en tot
wanneer je nog kunt wijzigen, de tijdlijn met de drie fasen en de momenten daarin, en daaronder
**Survey settings** met Participants, Period, Survey reminders, Questions en Design. Elke rij linkt
terug naar de stap die hem heeft ingevuld.

De opbouw komt uit de overview van het group-linking prototype, zodat het in beide prototypes
hetzelfde scherm blijft. Alles wat er staat wordt teruggelezen uit de stappen. De status volgt de
periodestap: **Scheduled** geeft Planned met de knop Edit survey, **Immediately** geeft Running met de
knop View response en de regel "Your survey is running!". Vanaf de Surveys-pagina opent een ingeplande
survey deze pagina; een concept gaat nog steeds naar de stap waar je was gebleven.

Onder de instellingen staat **Sharing results** met twee rijen, Results access en Results Release met
de waarde "Release in phases", en daaronder de twee kaartjes **Response** en **Results**. Die twee zijn
opgemeten aan een lopende survey: 384px breed, een titelrij van 73px met de titel op 16/600 en 24px
padding, en een body van 261px met de knop onderaan. Zolang de survey nog niet loopt zijn ze allebei
leeg: dezelfde illustratie uit het product (`assets/img/results-empty.svg`, gemaskeerd zodat hij zijn
kleur houdt), de naam op 16/600 en de regel eronder op 12px subdued. Draait de survey, dan toont
Response per regel de naam links, het percentage rechts en een balk eronder; die percentages zijn voor
de demo verzonnen.

De tijdlijn rekent met de echte datums: de PLANNED-band loopt tot de startdatum, RUNNING beslaat de
looptijd en COMPLETED de staart erna, en de marker staat waar vandaag valt. De drie momenten erop
hebben elk hun eigen kleur en een tooltip met de datum, in dezelfde bewoording als het product:
`Survey invitation`, `Survey end date` en `Phased release`. De fase-labels zijn een level 6 headline
(12px, uppercase) in `content-base`, en de drie fase-glyphs komen uit het product zelf: ze staan als
`assets/img/phase-*.svg` en worden met een CSS-mask getekend zodat ze hun kleur houden. Wijzigen kan tot twee uur voor de start, wat de review-dialog ook belooft.

### De stappenbalk

De balk is breder dan de contentkolom: maximaal 1300px, gecentreerd, met de vier stappen
`space-between` en 24px ertussen. De hairline zit op de balk eromheen, dus die loopt over de volle
breedte. De badge per stap volgt één regel, nagemeten in het product:

| Stand | Cirkel | Tegel |
|---|---|---|
| Nog niet klaar | grijs met het stapnummer | grijs |
| Klaar | groen met een wit vinkje | grijs |
| De stap waar je op staat | brand-tint (`--bg-brand-subtle-selected`), met nummer of vinkje | brand-tint |

De actieve stap wint dus van de klaar-stand: staat hij aan én is hij klaar, dan zie je een vinkje op
de lichte tint in plaats van het groene schijfje.

## Hoe het in elkaar zit

Elk resultaatscherm is een shell van ruim twintig regels die `renderOverview('<groep>-<moment>', '<scherm>')`
aanroept, gevolgd door `gtma-flow.js`. De opbouw, de data en de grafieken zitten in `effectiveness.js`, met
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

## Prototype toolbar

Elke schermpagina draagt de gedeelde [prototype toolbar](https://github.com/effectory-ux/prototype-toolbar)
(`toolbar/`, een kopie van de gepubliceerde release; `toolbar/update.sh` ververst hem): wissel tussen **Before (Q2)** en **After (Q3)**, spring naar een
scherm, en bekijk dezelfde schermen voor Team IT. Lokaal staat hij altijd aan. Live alleen via de
collega-link, bijvoorbeeld
https://effectory-ux.github.io/gtma/novanta-after-overview.html?prototype-toolbar —
zonder `?prototype-toolbar` is het de schone versie voor testers. Wat de toolbar toont staat
in `proto-config.js`; de toolbar zelf verandert alleen via `toolbar/` (zie `CLAUDE.md`).

Van tab naar tab is een echte paginalading. De scanschermen laten daarvoor de blur van
`effectiveness.css` staan, dezelfde die de Your voice-resultaten gebruiken: het oude scherm vervaagt en
het nieuwe komt scherp terug, zodat je de lading niet ziet. De overview stond eerder op
`@view-transition { navigation: none; }` omdat de andere scanschermen zich nog niet aanmeldden; nu doen
ze alle zes mee.
