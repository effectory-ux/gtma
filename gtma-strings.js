/* ── What this prototype says, in Dutch and German ───────────────────────────
   The design system's i18n.js already carries the dashboard's copy, so this map
   only holds what the prototype writes itself. Same shape as the design system's:
   the English source is the key, missing entries fall back to English.

   Dutch speaks to the user as "je", German as "Sie", the way the design system
   does. Product names, group names, survey names and template names are data and
   stay as they are.

   GTMA_RULES catches the strings that carry a number, a name or a date, because
   their key only exists once the page has rendered.
   GTMA_PAGE_STRINGS overrides a word for one page when it reads differently there. */

window.GTMA_STRINGS = {

  /* ── Shell ── */
  "Language": { nl: "Taal", de: "Sprache" },
  "Main": { nl: "Hoofdmenu", de: "Hauptmenü" },
  "Breadcrumb": { nl: "Kruimelpad", de: "Navigationspfad" },
  "a few days": { nl: "een paar dagen", de: "ein paar Tagen" },
  "less than a day": { nl: "minder dan een dag", de: "weniger als einem Tag" },
  "English": { nl: "Engels", de: "Englisch" },
  "Dutch": { nl: "Nederlands", de: "Niederländisch" },
  "German": { nl: "Duits", de: "Deutsch" },

  /* ── Surveys page ── */
  "See your most recent surveys and projects": { nl: "Bekijk je meest recente onderzoeken en projecten", de: "Sehen Sie Ihre neuesten Befragungen und Projekte" },
  "Create survey": { nl: "Onderzoek maken", de: "Befragung erstellen" },
  "Latest projects": { nl: "Recente projecten", de: "Neueste Projekte" },
  "Go to projects": { nl: "Naar projecten", de: "Zu den Projekten" },
  "Show only my surveys": { nl: "Alleen mijn onderzoeken tonen", de: "Nur meine Befragungen anzeigen" },
  "Created last": { nl: "Nieuwste eerst", de: "Neueste zuerst" },
  "Created first": { nl: "Oudste eerst", de: "Älteste zuerst" },
  "Status:": { nl: "Status:", de: "Status:" },
  "Draft": { nl: "Concept", de: "Entwurf" },
  "Planned": { nl: "Gepland", de: "Geplant" },
  "In Progress": { nl: "Loopt", de: "Läuft" },
  "Completed": { nl: "Afgerond", de: "Abgeschlossen" },
  "Merged": { nl: "Samengevoegd", de: "Zusammengeführt" },
  "merged": { nl: "samengevoegd", de: "zusammengeführt" },
  "Running": { nl: "Loopt", de: "Läuft" },
  "Starts": { nl: "Start", de: "Start" },
  "No surveys match your filters.": { nl: "Geen onderzoeken die aan je filters voldoen.", de: "Keine Befragungen entsprechen Ihren Filtern." },
  "Previous projects": { nl: "Vorige projecten", de: "Vorherige Projekte" },
  "Next projects": { nl: "Volgende projecten", de: "Nächste Projekte" },
  "Search surveys": { nl: "Onderzoeken zoeken", de: "Befragungen suchen" },
  "More options": { nl: "Meer opties", de: "Weitere Optionen" },
  "More actions": { nl: "Meer acties", de: "Weitere Aktionen" },
  "Search templates": { nl: "Templates zoeken", de: "Vorlagen suchen" },
  "Enter a survey name": { nl: "Geef het onderzoek een naam", de: "Geben Sie der Befragung einen Namen" },

  /* ── Survey page (planned / running) ── */
  "Edit survey": { nl: "Onderzoek bewerken", de: "Befragung bearbeiten" },
  "Survey settings": { nl: "Onderzoeksinstellingen", de: "Befragungseinstellungen" },
  "Survey invitation:": { nl: "Uitnodiging:", de: "Einladung:" },
  "Survey end date:": { nl: "Einddatum:", de: "Enddatum:" },
  "Phased release:": { nl: "Gefaseerde publicatie:", de: "Schrittweise Freigabe:" },
  "Your survey is running! Check out the current response rate to see how it is going": { nl: "Je onderzoek loopt! Bekijk de respons om te zien hoe het ervoor staat", de: "Ihre Befragung läuft! Sehen Sie sich die Rücklaufquote an, um zu sehen, wie es läuft" },
  "Not selected": { nl: "Niet gekozen", de: "Nicht ausgewählt" },
  "View details": { nl: "Details bekijken", de: "Details ansehen" },
  "Period": { nl: "Periode", de: "Zeitraum" },
  "Edit period": { nl: "Periode bewerken", de: "Zeitraum bearbeiten" },
  "Survey reminders": { nl: "Herinneringen", de: "Erinnerungen" },
  "View questions": { nl: "Vragen bekijken", de: "Fragen ansehen" },
  "Design": { nl: "Vormgeving", de: "Design" },
  "Edit design": { nl: "Vormgeving bewerken", de: "Design bearbeiten" },
  "Sharing results": { nl: "Resultaten delen", de: "Ergebnisse teilen" },
  "Results access": { nl: "Toegang tot resultaten", de: "Zugriff auf Ergebnisse" },
  "Decide which users can view the survey results and response rate": { nl: "Bepaal welke gebruikers de resultaten en de respons mogen zien", de: "Legen Sie fest, welche Nutzer die Ergebnisse und die Rücklaufquote sehen dürfen" },
  "Results Release": { nl: "Resultaten vrijgeven", de: "Ergebnisse freigeben" },
  "Manage how and when you share results": { nl: "Bepaal hoe en wanneer je resultaten deelt", de: "Legen Sie fest, wie und wann Sie Ergebnisse teilen" },
  "Release in phases": { nl: "Gefaseerd vrijgeven", de: "Schrittweise freigeben" },
  "No response yet": { nl: "Nog geen respons", de: "Noch kein Rücklauf" },
  "You don’t have any responses": { nl: "Je hebt nog geen respons", de: "Sie haben noch keine Antworten" },
  "View response": { nl: "Respons bekijken", de: "Rücklauf ansehen" },
  "Results": { nl: "Resultaten", de: "Ergebnisse" },
  "No results yet": { nl: "Nog geen resultaten", de: "Noch keine Ergebnisse" },
  "We do not have any results yet": { nl: "We hebben nog geen resultaten", de: "Wir haben noch keine Ergebnisse" },
  "View results": { nl: "Resultaten bekijken", de: "Ergebnisse ansehen" },
  "PLANNED": { nl: "GEPLAND", de: "GEPLANT" },
  "RUNNING": { nl: "LOOPT", de: "LÄUFT" },
  "COMPLETED": { nl: "AFGEROND", de: "ABGESCHLOSSEN" },

  /* ── Survey creator: the rail and the footer, on every step ── */
  "Edit name": { nl: "Naam bewerken", de: "Namen bearbeiten" },
  "Select participants": { nl: "Deelnemers selecteren", de: "Teilnehmende auswählen" },
  "Select questions": { nl: "Vragen kiezen", de: "Fragen auswählen" },
  /* "Befragungszeitraum" does not fit the step in the creator's rail, and the
     calendar icon next to it carries the rest of the meaning. */
  "Survey period": { nl: "Onderzoeksperiode", de: "Zeitraum" },
  "Select period": { nl: "Selecteer periode", de: "Zeitraum auswählen" },
  "Layout & emails": { nl: "Vormgeving & e-mails", de: "Layout & E-Mails" },
  "Previous step": { nl: "Vorige stap", de: "Vorheriger Schritt" },
  "Next step": { nl: "Volgende stap", de: "Nächster Schritt" },
  "Save & close": { nl: "Opslaan & sluiten", de: "Speichern & schließen" },
  "All changes were saved": { nl: "Alle wijzigingen zijn opgeslagen", de: "Alle Änderungen wurden gespeichert" },
  "Review & plan": { nl: "Controleren & plannen", de: "Prüfen & planen" },
  "Survey setup": { nl: "Onderzoek opzetten", de: "Befragung einrichten" },

  /* ── Review and plan dialog ── */
  "Review and plan": { nl: "Controleren en plannen", de: "Prüfen und planen" },
  "Review your survey details and plan your survey. No worries, you can still make edits up to 2 hours before the survey starts.": { nl: "Loop de gegevens van je onderzoek na en plan het in. Geen zorgen, je kunt tot 2 uur voor de start nog wijzigingen doorvoeren.", de: "Prüfen Sie die Angaben zu Ihrer Befragung und planen Sie sie ein. Keine Sorge, Sie können bis 2 Stunden vor dem Start noch Änderungen vornehmen." },
  "Plan survey": { nl: "Onderzoek plannen", de: "Befragung planen" },
  "Launch survey": { nl: "Onderzoek starten", de: "Befragung starten" },

  /* ── Confirmation ── */
  "Your survey is ready for take off!": { nl: "Je onderzoek staat klaar om te starten!", de: "Ihre Befragung ist startklar!" },
  "Your survey will start shortly": { nl: "Je onderzoek begint zo", de: "Ihre Befragung beginnt in Kürze" },
  "Your survey has started": { nl: "Je onderzoek is gestart", de: "Ihre Befragung ist gestartet" },
  "Go back to Surveys": { nl: "Terug naar Onderzoeken", de: "Zurück zu den Befragungen" }
};

/* ── Survey creator: participants ── */
Object.assign(window.GTMA_STRINGS, {
  "Select the groups that will participate in this survey": { nl: "Selecteer de groepen die aan dit onderzoek deelnemen", de: "Wählen Sie die Gruppen aus, die an dieser Befragung teilnehmen" },
  "Learn more": { nl: "Meer informatie", de: "Mehr erfahren" },
  "Random sample": { nl: "Willekeurige steekproef", de: "Stichprobe" },
  "Invite a randomized representative sample of all the groups you select": { nl: "Nodig een aselecte, representatieve steekproef uit van alle groepen die je kiest", de: "Laden Sie eine zufällige, repräsentative Stichprobe aus allen von Ihnen gewählten Gruppen ein" },
  "Select groups": { nl: "Groepen selecteren", de: "Gruppen auswählen" },
  "Edit selection": { nl: "Selectie bewerken", de: "Auswahl bearbeiten" },
  "Inviting a randomized & representative sample": { nl: "Een willekeurige en representatieve steekproef uitnodigen", de: "Eine zufällige und repräsentative Stichprobe einladen" },
  "Add participant groups first. Then set a sample percentage to invite enough participants.": { nl: "Voeg eerst deelnemersgroepen toe. Stel vervolgens een steekproefpercentage in om genoeg deelnemers uit te nodigen.", de: "Fügen Sie zuerst Teilnehmergruppen hinzu. Legen Sie danach einen Stichprobenanteil fest, um genügend Teilnehmende einzuladen." },
  "Read our guide": { nl: "Lees onze gids", de: "Lesen Sie unseren Leitfaden" },
  "Select sample size": { nl: "Steekproefgrootte kiezen", de: "Stichprobengröße wählen" },
  "Sample size": { nl: "Steekproefgrootte", de: "Stichprobengröße" },
  "Need help with random sampling?": { nl: "Hulp nodig bij steekproeven?", de: "Brauchen Sie Hilfe bei Stichproben?" },
  "About random sampling": { nl: "Over steekproeven", de: "Über Stichproben" },
  "Add your participants": { nl: "Voeg jouw deelnemers toe", de: "Fügen Sie Ihre Teilnehmenden hinzu" },
  "Who would you like to receive feedback from?": { nl: "Van wie wil je feedback ontvangen?", de: "Von wem möchten Sie Feedback erhalten?" },
  "Select which groups you would like to invite to this survey, by editing the selection.": { nl: "Selecteer de groepen die je wilt uitnodigen voor dit onderzoek door de selectie te bewerken.", de: "Wählen Sie über Auswahl bearbeiten, welche Gruppen Sie zu dieser Befragung einladen möchten." },
  "Select your preferred group structure and add the groups you want to invite. The structure you choose here will become the Inviting Structure of the survey. This means you will receive the most comprehensive results based on this structure.": { nl: "Selecteer een groepsstructuur naar keuze en voeg de groepen toe die je wilt uitnodigen. De structuur die je hier kiest wordt de Uitnodigende Structuur van het onderzoek. Dit betekent dat je de meest uitgebreide resultaten ontvangt op basis van deze structuur.", de: "Wählen Sie die gewünschte Gruppenstruktur und fügen Sie die Gruppen hinzu, die Sie einladen möchten. Die hier gewählte Struktur wird zur Einladungsstruktur der Befragung. So erhalten Sie die umfassendsten Ergebnisse auf Basis dieser Struktur." },
  "Group structure": { nl: "Groepsstructuur", de: "Gruppenstruktur" },
  "Name": { nl: "Naam", de: "Name" },
  "Number of surveys the group is invited to": { nl: "Aantal onderzoeken waarvoor de groep is uitgenodigd", de: "Anzahl der Befragungen, zu denen die Gruppe eingeladen ist" },
  "Search for a group": { nl: "Een groep zoeken", de: "Nach einer Gruppe suchen" }
});

/* ── Survey creator: survey period ── */
Object.assign(window.GTMA_STRINGS, {
  "When should the survey start?": { nl: "Wanneer moet het onderzoek beginnen?", de: "Wann soll die Befragung starten?" },
  "Schedule for later": { nl: "Plannen voor later", de: "Für später planen" },
  "Immediately": { nl: "Onmiddellijk", de: "Sofort" },
  "Frequency": { nl: "Frequentie", de: "Häufigkeit" },
  "About frequency": { nl: "Over frequentie", de: "Über die Häufigkeit" },
  "Choose how often this survey should be sent. This will create a recurring schedule.": { nl: "Kies hoe vaak dit onderzoek verstuurd moet worden. Zo ontstaat een terugkerend schema.", de: "Wählen Sie, wie oft diese Befragung verschickt werden soll. So entsteht ein wiederkehrender Zeitplan." },
  "Once": { nl: "Eenmalig", de: "Einmalig" },
  "Weekly": { nl: "Wekelijks", de: "Wöchentlich" },
  "Monthly": { nl: "Maandelijks", de: "Monatlich" },
  "Quarterly": { nl: "Per kwartaal", de: "Vierteljährlich" },
  "Start date": { nl: "Startdatum", de: "Startdatum" },
  "The first survey of the schedule goes out on this date": { nl: "Het eerste onderzoek van het schema gaat op deze datum de deur uit", de: "Die erste Befragung des Zeitplans wird an diesem Datum verschickt" },
  "Select start date": { nl: "Selecteer startdatum", de: "Startdatum wählen" },
  "About the schedule start": { nl: "Over de start van het schema", de: "Über den Beginn des Zeitplans" },
  "End date": { nl: "Einddatum", de: "Enddatum" },
  "No new surveys are sent after this date": { nl: "Na deze datum worden er geen nieuwe onderzoeken meer verstuurd", de: "Nach diesem Datum werden keine neuen Befragungen mehr verschickt" },
  "Select end date": { nl: "Selecteer einddatum", de: "Enddatum wählen" },
  "About the schedule end": { nl: "Over het einde van het schema", de: "Über das Ende des Zeitplans" },
  "Start hour": { nl: "Startuur", de: "Startstunde" },
  "Start minute": { nl: "Startminuut", de: "Startminute" },
  "End hour": { nl: "Einduur", de: "Endstunde" },
  "End minute": { nl: "Eindminuut", de: "Endminute" },
  "Later": { nl: "Later", de: "Später" },
  "Earlier": { nl: "Eerder", de: "Früher" },
  "Selected time zone:": { nl: "Selecteer tijdzone:", de: "Gewählte Zeitzone:" },
  "Survey duration": { nl: "Looptijd", de: "Laufzeit" },
  "About survey duration": { nl: "Over de looptijd", de: "Über die Laufzeit" },
  "How long each survey in the schedule stays open": { nl: "Hoe lang elk onderzoek in het schema open blijft staan", de: "Wie lange jede Befragung im Zeitplan geöffnet bleibt" },
  "Tip!": { nl: "Tip!", de: "Tipp!" },
  "We recommend setting a survey period of at least one week": { nl: "We raden aan om een onderzoeksperiode van minimaal één week in te stellen", de: "Wir empfehlen einen Befragungszeitraum von mindestens einer Woche" },
  "The selected sampling rotation": { nl: "De gekozen steekproefrotatie", de: "Die gewählte Stichprobenrotation" },
  "Edit sample size": { nl: "Steekproefgrootte bewerken", de: "Stichprobengröße bearbeiten" }
});

/* ── Survey creator: layout & emails ── */
Object.assign(window.GTMA_STRINGS, {
  "Choose your survey layout and manage the email messages sent to participants.": { nl: "Kies de vormgeving van je onderzoek en beheer de e-mails die deelnemers krijgen.", de: "Wählen Sie das Layout Ihrer Befragung und verwalten Sie die E-Mails an die Teilnehmenden." },
  "Survey layout": { nl: "Vormgeving onderzoek", de: "Layout der Befragung" },
  "The design of the questionnaire": { nl: "De vormgeving van de vragenlijst", de: "Das Design des Fragebogens" },
  "Landing page": { nl: "Landingspagina", de: "Landingpage" },
  "Questionnaire": { nl: "Vragenlijst", de: "Fragebogen" },
  "Email communication": { nl: "E-mailcommunicatie", de: "E-Mail-Kommunikation" },
  "Invitation email": { nl: "Uitnodigingsmail", de: "Einladungs-E-Mail" },
  "The first email sent to participants to complete the survey": { nl: "De eerste mail die deelnemers krijgen om het onderzoek in te vullen", de: "Die erste E-Mail, die Teilnehmende erhalten, um die Befragung auszufüllen" },
  "Reminder email": { nl: "Herinneringsmail", de: "Erinnerungs-E-Mail" },
  "A follow-up email sent to participants who haven’t completed the survey": { nl: "Een vervolgmail voor deelnemers die het onderzoek nog niet hebben ingevuld", de: "Eine Folge-E-Mail für Teilnehmende, die die Befragung noch nicht ausgefüllt haben" },
  "Invitation": { nl: "Uitnodiging", de: "Einladung" },
  "Reminder": { nl: "Herinnering", de: "Erinnerung" },
  "Selected template": { nl: "Gekozen template", de: "Gewählte Vorlage" },
  "Create template": { nl: "Template maken", de: "Vorlage erstellen" },
  "Edit email content": { nl: "E-mailinhoud bewerken", de: "E-Mail-Inhalt bearbeiten" },
  "Subject:": { nl: "Onderwerp:", de: "Betreff:" },
  "Subject line": { nl: "Onderwerpregel", de: "Betreffzeile" },
  "The email layout could vary depending on the email type and also your email client.": { nl: "De vormgeving van de mail kan verschillen per soort mail en per e-mailprogramma.", de: "Das Layout der E-Mail kann je nach E-Mail-Typ und E-Mail-Programm abweichen." },
  "Use email template": { nl: "E-mailtemplate gebruiken", de: "E-Mail-Vorlage verwenden" },
  "We guarantee your privacy": { nl: "We garanderen je privacy", de: "Wir garantieren Ihre Privatsphäre" },
  "Share your thoughts": { nl: "Deel je mening", de: "Teilen Sie Ihre Meinung" }
});

/* ── Questions step + the AI Adoption Scan screens ── */
Object.assign(window.GTMA_STRINGS, {
  "You are not able to change or edit questions in this template": { nl: "Je kunt de vragen in dit template niet veranderen of bewerken", de: "Sie können die Fragen in dieser Vorlage nicht ändern oder bearbeiten" },
  "5-point scale": { nl: "5-puntsschaal", de: "5-Punkte-Skala" },
  "Standard": { nl: "Standaard", de: "Standard" },
  "Multiple choice": { nl: "Meerkeuze", de: "Mehrfachauswahl" },
  "Single choice": { nl: "Enkele keuze", de: "Einfachauswahl" },
  "Open-ended question": { nl: "Open vraag", de: "Offene Frage" },
  "Additional comments": { nl: "Aanvullende opmerkingen", de: "Weitere Anmerkungen" },
  "Highest scores": { nl: "Hoogste scores", de: "Höchste Werte" },
  "The five questions with the highest score": { nl: "De vijf vragen met de hoogste score", de: "Die fünf Fragen mit dem höchsten Wert" },
  "Lowest scores": { nl: "Laagste scores", de: "Niedrigste Werte" },
  "The five questions with the lowest score": { nl: "De vijf vragen met de laagste score", de: "Die fünf Fragen mit dem niedrigsten Wert" },
  "Share of invited employees who completed the scan": { nl: "Aandeel uitgenodigde medewerkers dat de scan heeft ingevuld", de: "Anteil der eingeladenen Mitarbeitenden, die den Scan ausgefüllt haben" },
  "ALL THEMES": { nl: "ALLE THEMA'S", de: "ALLE THEMEN" },
  "View insights": { nl: "Inzichten bekijken", de: "Erkenntnisse ansehen" },
  "Pin theme": { nl: "Thema pinnen", de: "Thema anpinnen" },
  "This question is part of a theme": { nl: "Deze vraag hoort bij een thema", de: "Diese Frage gehört zu einem Thema" },
  "Compare how your group scores on the other questions that belong to the same theme": { nl: "Vergelijk hoe je groep scoort op de andere vragen die bij hetzelfde thema horen", de: "Vergleichen Sie, wie Ihre Gruppe bei den anderen Fragen desselben Themas abschneidet" },
  "No actions have been created for this question yet.": { nl: "Voor deze vraag zijn nog geen acties gemaakt.", de: "Für diese Frage wurden noch keine Maßnahmen erstellt." },
  "Turn your results into action": { nl: "Zet je resultaten om in actie", de: "Machen Sie aus Ihren Ergebnissen Maßnahmen" },
  "Respond to a focus area to decide how you'll act on it, and it shows up here. Not sure where to start? Create a custom pin from your own goal.": { nl: "Reageer op een aandachtsgebied om te bepalen wat je ermee doet. Het verschijnt dan hier. Weet je niet waar je moet beginnen? Maak een eigen pin vanuit je eigen doel.", de: "Reagieren Sie auf einen Schwerpunkt, um festzulegen, wie Sie damit umgehen. Er erscheint dann hier. Sie wissen nicht, wo Sie anfangen sollen? Erstellen Sie eine eigene Markierung aus Ihrem eigenen Ziel." },
  /* The design system translates "Custom pin" and "Create pin"; this label is new, so it lives here. */
  "Add custom pin": { nl: "Aangepaste pin toevoegen", de: "Eigene Markierung hinzufügen" },

  "Something the team can influence, so commit to a concrete next step now.": { nl: "Iets waar het team invloed op heeft, dus spreek nu een concrete vervolgstap af.", de: "Etwas, worauf das Team Einfluss hat, also legen Sie jetzt einen konkreten nächsten Schritt fest." },
  "Not urgent yet, so keep it on your radar and revisit at the next survey.": { nl: "Nog niet urgent, dus hou het in de gaten en kijk er bij het volgende onderzoek opnieuw naar.", de: "Noch nicht dringend, behalten Sie es also im Blick und schauen Sie bei der nächsten Befragung erneut hin." },
  "Outside the team's control, so flag it for the right person to pick up.": { nl: "Buiten de invloed van het team, dus leg het neer bij de juiste persoon.", de: "Außerhalb des Einflusses des Teams, geben Sie es also an die richtige Person weiter." },
  "A real strength worth celebrating, so plan a way to share the win with your team or more widely.": { nl: "Een echte sterkte om te vieren, dus bedenk hoe je dit succes deelt met je team of breder.", de: "Eine echte Stärke, die es zu feiern gilt. Überlegen Sie, wie Sie diesen Erfolg mit Ihrem Team oder darüber hinaus teilen." },
  "Includes the response rate, the themes, how every question scored and the group deep dives.": { nl: "Bevat de respons, de thema's, hoe elke vraag scoorde en de verdieping per groep.", de: "Enthält die Rücklaufquote, die Themen, das Abschneiden jeder Frage und die Vertiefung je Gruppe." },
  "A leadership-ready summary of what the scan says about AI adoption, where it is strong and where it is not.": { nl: "Een samenvatting voor de directie van wat de scan zegt over AI-adoptie, waar die sterk is en waar niet.", de: "Eine Zusammenfassung für die Leitung, was der Scan über die KI-Nutzung sagt, wo sie stark ist und wo nicht." },
  "A concise overview of the key results and highlights to share quickly.": { nl: "Een beknopt overzicht van de belangrijkste resultaten en hoogtepunten om snel te delen.", de: "Ein kompakter Überblick über die wichtigsten Ergebnisse und Highlights zum schnellen Teilen." },
  "AI clarity": { nl: "AI-duidelijkheid", de: "KI-Klarheit" },
  "AI capability": { nl: "AI-vaardigheid", de: "KI-Kompetenz" },
  "AI environment": { nl: "AI-omgeving", de: "KI-Umfeld" },
  "AI usage": { nl: "AI-gebruik", de: "KI-Nutzung" },
  "AI impact": { nl: "AI-impact", de: "KI-Wirkung" },
  "AI wellbeing": { nl: "AI-welzijn", de: "KI-Wohlbefinden" },
  "Clarity": { nl: "Duidelijkheid", de: "Klarheit" },
  "Capability": { nl: "Vaardigheid", de: "Kompetenz" },
  "Environment": { nl: "Omgeving", de: "Umfeld" },
  "Usage": { nl: "Gebruik", de: "Nutzung" },
  "Impact": { nl: "Impact", de: "Wirkung" },
  "Wellbeing": { nl: "Welzijn", de: "Wohlbefinden" }
});

/* ── One word, two meanings: these win on the page that means it differently ── */
window.GTMA_PAGE_STRINGS = {
  "survey-detail.html": {
    "Response": { nl: "Respons", de: "Rücklauf" },
    "Questions": { nl: "Vragen", de: "Fragen" },
    "Participants": { nl: "Deelnemers", de: "Teilnehmende" }
  },
  "ai-adoption-scan-questionnaire.html": {
    "Questions": { nl: "Vragen", de: "Fragen" }
  }
};

/* ── Strings that carry a number, a name or a date ───────────────────────────
   The key only exists once the page has rendered, so these are matched instead
   of looked up. $1, $2 … are the groups of the pattern. */
window.GTMA_RULES = [
  { re: /^(\d+) surveys?$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' onderzoek' : ' onderzoeken'); }, de: function (m) { return m[1] + (m[1] === '1' ? ' Befragung' : ' Befragungen'); } },
  { re: /^(\d+) questions?$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' vraag' : ' vragen'); }, de: function (m) { return m[1] + (m[1] === '1' ? ' Frage' : ' Fragen'); } },
  { re: /^(\d+) mins?$/, nl: '$1 minuten', de: '$1 Minuten' },
  { re: /^(\d+) minutes?$/, nl: '$1 minuten', de: '$1 Minuten' },
  { re: /^(\d+) days? \(recommended\)$/, nl: '$1 dagen (aanbevolen)', de: '$1 Tage (empfohlen)' },
  { re: /^(\d+) days?$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' dag' : ' dagen'); }, de: function (m) { return m[1] + (m[1] === '1' ? ' Tag' : ' Tage'); } },
  { re: /^All \((\d+)\)$/, nl: 'Alle ($1)', de: 'Alle ($1)' },
  { re: /^(\d+) groups? selected$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' groep geselecteerd' : ' groepen geselecteerd'); }, de: function (m) { return m[1] + (m[1] === '1' ? ' Gruppe ausgewählt' : ' Gruppen ausgewählt'); } },
  { re: /^(\d+) selected participants?$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' geselecteerde deelnemer' : ' geselecteerde deelnemers'); }, de: function (m) { return m[1] + (m[1] === '1' ? ' ausgewählte teilnehmende Person' : ' ausgewählte Teilnehmende'); } },
  { re: /^(\d+) categories$/, nl: '$1 categorieën', de: '$1 Kategorien' },
  { re: /^(\d+) applied$/, nl: '$1 toegepast', de: '$1 angewendet' },
  { re: /^(\d+) selected$/, nl: '$1 geselecteerd', de: '$1 ausgewählt' },
  { re: /^Expand (.+)$/, nl: '$1 uitklappen', de: '$1 ausklappen' },
  { re: /^Collapse (.+)$/, nl: '$1 inklappen', de: '$1 einklappen' },
  { re: /^Download (.+)$/, nl: '$1 downloaden', de: '$1 herunterladen' },
  { re: /^Standard template · (\d+) questions · (\d+) minutes$/, nl: 'Standaardtemplate · $1 vragen · $2 minuten', de: 'Standardvorlage · $1 Fragen · $2 Minuten' },
  { re: /^Available in (\d+) projects?$/, nl: function (m) { return 'Beschikbaar in ' + m[1] + (m[1] === '1' ? ' project' : ' projecten'); }, de: function (m) { return 'Verfügbar in ' + m[1] + (m[1] === '1' ? ' Projekt' : ' Projekten'); } },
  { re: /^(\d+) reminders?, sent to everyone who has not responded$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' herinnering' : ' herinneringen') + ', naar iedereen die nog niet heeft gereageerd'; }, de: function (m) { return m[1] + (m[1] === '1' ? ' Erinnerung' : ' Erinnerungen') + ', an alle, die noch nicht geantwortet haben'; } },
  { re: /^(\d+) participants from (\d+) groups$/, nl: '$1 deelnemers uit $2 groepen', de: '$1 Teilnehmende aus $2 Gruppen' },
  { re: /^(\d+) participants, (\d+)% random sample$/, nl: '$1 deelnemers, steekproef van $2%', de: '$1 Teilnehmende, $2% Stichprobe' },
  { re: /^Survey: (.+)$/, nl: 'Onderzoek: $1', de: 'Befragung: $1' },
  { re: /^Email: (.+)$/, nl: 'E-mail: $1', de: 'E-Mail: $1' },
  { re: /^on (.+)$/, nl: 'op $1', de: 'am $1' },
  { re: /^until (.+)$/, nl: 'tot $1', de: 'bis $1' },
  /* The two ends of the range are stamps of their own, so hand each one back
     through the lookup and they come out in the reader's date order. */
  { re: /^Select a survey period from: (.+)$/,
    nl: function (m) { return 'Selecteer een periode voor jouw onderzoek tussen: ' + m[1].split(' - ').map(function (d) { return window.gtmaT(d); }).join(' - '); },
    de: function (m) { return 'Wählen Sie einen Befragungszeitraum zwischen: ' + m[1].split(' - ').map(function (d) { return window.gtmaT(d); }).join(' - '); } },
  { re: /^Your survey starts in (.+)! You can make changes up until it starts$/,
    nl: function (m) { return 'Je onderzoek start over ' + window.gtmaT(m[1]) + '! Je kunt tot de start nog wijzigingen doorvoeren'; },
    de: function (m) { return 'Ihre Befragung startet in ' + window.gtmaT(m[1]) + '! Sie können bis zum Start noch Änderungen vornehmen'; } },
  { re: /^(\d+) questions?, completion time (.+)$/,
    nl: function (m) { return m[1] + ' vragen, invultijd ' + window.gtmaT(m[2]); },
    de: function (m) { return m[1] + ' Fragen, Ausfülldauer ' + window.gtmaT(m[2]); } },
  { re: /^(.+) scores (\d+)% point higher than (.+)$/, nl: '$1 scoort $2 procentpunt hoger dan $3', de: '$1 liegt $2 Prozentpunkte über $3' },
  { re: /^(.+) scores (\d+)% point lower than (.+)$/, nl: '$1 scoort $2 procentpunt lager dan $3', de: '$1 liegt $2 Prozentpunkte unter $3' },
  { re: /^(.+) scores the same as (.+)$/, nl: '$1 scoort hetzelfde als $2', de: '$1 liegt gleichauf mit $2' },
  { re: /^(.+) scores higher$/, nl: '$1 scoort hoger', de: '$1 liegt höher' },
  { re: /^Current: (\d+)%$/, nl: 'Huidig: $1%', de: 'Aktuell: $1%' },
  { re: /^Previous: (\d+)%$/, nl: 'Vorig: $1%', de: 'Vorher: $1%' },
  { re: /^Response rate (\d+)%$/, nl: 'Responspercentage $1%', de: 'Rücklaufquote $1%' }
];

/* ── Content: the AI Adoption Scan questionnaire ─────────────────────────────
   These are survey items, not interface labels. They read the same on the
   Questions step and in the results, so they live here once. Translated for the
   demo: Effectory's own approved wording should replace this when it exists. */
Object.assign(window.GTMA_STRINGS, {
  "I understand where AI is relevant in my work": { nl: "Ik begrijp waar AI relevant is in mijn werk", de: "Ich verstehe, wo KI in meiner Arbeit relevant ist" },
  "Novanta B.V. has clear guidelines and policies on how to use AI safely and securely": { nl: "Novanta B.V. heeft duidelijke richtlijnen en beleid over hoe je AI veilig gebruikt", de: "Novanta B.V. hat klare Richtlinien und Vorgaben zur sicheren Nutzung von KI" },
  "I know where to go if I have questions about AI usage": { nl: "Ik weet waar ik terechtkan met vragen over het gebruik van AI", de: "Ich weiß, an wen ich mich bei Fragen zur KI-Nutzung wenden kann" },
  "I feel confident in my ability to use AI effectively": { nl: "Ik heb er vertrouwen in dat ik AI effectief kan gebruiken", de: "Ich bin zuversichtlich, dass ich KI wirksam einsetzen kann" },
  "I would like to further develop my AI skills": { nl: "Ik wil mijn AI-vaardigheden verder ontwikkelen", de: "Ich möchte meine KI-Fähigkeiten weiterentwickeln" },
  "I have sufficient opportunities to develop my AI skills": { nl: "Ik heb voldoende mogelijkheden om mijn AI-vaardigheden te ontwikkelen", de: "Ich habe ausreichend Möglichkeiten, meine KI-Fähigkeiten zu entwickeln" },
  "What would help you most improve how you use AI?": { nl: "Wat zou je het meest helpen om AI beter te gebruiken?", de: "Was würde Ihnen am meisten helfen, KI besser zu nutzen?" },
  "I feel comfortable being open about AI usage at work": { nl: "Ik voel me vrij om open te zijn over mijn gebruik van AI op het werk", de: "Ich fühle mich wohl dabei, offen über meine KI-Nutzung bei der Arbeit zu sprechen" },
  "In my team, learning about and experimenting with AI is actively encouraged": { nl: "In mijn team wordt leren over en experimenteren met AI actief aangemoedigd", de: "In meinem Team wird das Lernen über KI und das Experimentieren damit aktiv gefördert" },
  "My manager actively supports my team's use of AI": { nl: "Mijn leidinggevende steunt het gebruik van AI in mijn team actief", de: "Meine Führungskraft unterstützt die Nutzung von KI in meinem Team aktiv" },
  "The AI tools available to me fit well into existing systems and processes I use at work": { nl: "De AI-tools die ik tot mijn beschikking heb passen goed bij de systemen en processen die ik op mijn werk gebruik", de: "Die mir zur Verfügung stehenden KI-Tools passen gut zu den Systemen und Prozessen, die ich bei der Arbeit nutze" },
  "AI in our organization is managed in a way that makes me feel supported": { nl: "AI wordt binnen onze organisatie zo aangepakt dat ik me gesteund voel", de: "KI wird in unserer Organisation so gesteuert, dass ich mich unterstützt fühle" },
  "I feel positive about using AI in my work": { nl: "Ik sta positief tegenover het gebruik van AI in mijn werk", de: "Ich stehe dem Einsatz von KI in meiner Arbeit positiv gegenüber" },
  "AI is a regular part of how I work": { nl: "AI is een vast onderdeel van hoe ik werk", de: "KI ist ein fester Bestandteil meiner Arbeitsweise" },
  "How often do you use AI in your work?": { nl: "Hoe vaak gebruik je AI in je werk?", de: "Wie oft nutzen Sie KI in Ihrer Arbeit?" },
  "For which purposes do you use AI in your work?": { nl: "Waarvoor gebruik je AI in je werk?", de: "Wofür nutzen Sie KI in Ihrer Arbeit?" },
  "I regularly explore new ways to use AI tools in my work": { nl: "Ik zoek regelmatig naar nieuwe manieren om AI-tools in mijn werk te gebruiken", de: "Ich suche regelmäßig nach neuen Wegen, KI-Tools in meiner Arbeit einzusetzen" },
  "AI tools help me achieve my work-related goals": { nl: "AI-tools helpen mij mijn werkdoelen te halen", de: "KI-Tools helfen mir, meine Arbeitsziele zu erreichen" },
  "AI tools help improve my productivity": { nl: "AI-tools helpen mij productiever te werken", de: "KI-Tools helfen mir, produktiver zu arbeiten" },
  "In an average workweek, how much more productive are you as a direct result of using AI?": { nl: "Hoeveel productiever ben je in een gemiddelde werkweek als direct gevolg van AI?", de: "Wie viel produktiver sind Sie in einer durchschnittlichen Arbeitswoche als direkte Folge des KI-Einsatzes?" },
  "Where do you see the biggest opportunities for AI in your daily work?": { nl: "Waar zie je de grootste kansen voor AI in je dagelijkse werk?", de: "Wo sehen Sie die größten Chancen für KI in Ihrer täglichen Arbeit?" },
  "I feel secure in my employment as AI becomes more integrated into my work": { nl: "Ik voel me zeker over mijn baan nu AI een grotere rol krijgt in mijn werk", de: "Ich fühle mich in meiner Anstellung sicher, während KI stärker in meine Arbeit einfließt" },
  "AI helps reduce my workload": { nl: "AI helpt mijn werkdruk te verlagen", de: "KI hilft, meine Arbeitsbelastung zu senken" },
  "Is there anything else you would like to share that would help you use AI more effectively in your work?": { nl: "Is er nog iets anders dat je wilt delen dat je zou helpen om AI effectiever te gebruiken in je werk?", de: "Gibt es noch etwas, das Sie teilen möchten und das Ihnen helfen würde, KI in Ihrer Arbeit wirksamer einzusetzen?" }
});

/* ── Content: what the six scan themes mean ── */
Object.assign(window.GTMA_STRINGS, {
  "Clarity is the degree to which your employees understand where AI is relevant in their work. It also refers to how well they know the guidelines and support available to use it safely and responsibly.": { nl: "Duidelijkheid is de mate waarin je medewerkers begrijpen waar AI relevant is in hun werk. Het gaat er ook over hoe goed ze de richtlijnen en de beschikbare ondersteuning kennen om AI veilig en verantwoord te gebruiken.", de: "Klarheit ist das Ausmaß, in dem Ihre Mitarbeitenden verstehen, wo KI in ihrer Arbeit relevant ist. Sie umfasst auch, wie gut sie die Richtlinien und die verfügbare Unterstützung für einen sicheren und verantwortungsvollen Einsatz kennen." },
  "Capability is the degree to which your employees feel skilled and confident using AI in their work. It also refers to whether they have real opportunities to keep building on that skill.": { nl: "Vaardigheid is de mate waarin je medewerkers zich bekwaam en zeker voelen in het gebruik van AI in hun werk. Het gaat er ook over of ze echte mogelijkheden hebben om die vaardigheid verder op te bouwen.", de: "Kompetenz ist das Ausmaß, in dem sich Ihre Mitarbeitenden fähig und sicher im Umgang mit KI fühlen. Sie umfasst auch, ob sie echte Möglichkeiten haben, diese Fähigkeit weiter auszubauen." },
  "Environment is the degree to which your employees feel enabled and supported to use AI by the people and systems around them. It also refers to whether the organization is managing the shift to AI in a way that feels supportive rather than imposed.": { nl: "Omgeving is de mate waarin je medewerkers zich door de mensen en systemen om hen heen in staat gesteld en gesteund voelen om AI te gebruiken. Het gaat er ook over of de organisatie de overgang naar AI zo begeleidt dat die ondersteunend voelt in plaats van opgelegd.", de: "Umfeld ist das Ausmaß, in dem sich Ihre Mitarbeitenden durch die Menschen und Systeme um sie herum befähigt und unterstützt fühlen, KI zu nutzen. Es umfasst auch, ob die Organisation den Wandel hin zu KI so gestaltet, dass er unterstützend statt aufgezwungen wirkt." },
  "Usage is the degree to which AI has actually become part of how your employees work day to day, not just something they have been given access to. It also refers to how positively they experience that use, and how far they are pushing past the basics.": { nl: "Gebruik is de mate waarin AI daadwerkelijk onderdeel is geworden van hoe je medewerkers dagelijks werken, en niet alleen iets waar ze toegang toe hebben gekregen. Het gaat er ook over hoe positief ze dat gebruik ervaren en hoever ze voorbij de basis komen.", de: "Nutzung ist das Ausmaß, in dem KI tatsächlich Teil der täglichen Arbeit Ihrer Mitarbeitenden geworden ist und nicht nur etwas, wozu sie Zugang erhalten haben. Sie umfasst auch, wie positiv sie diese Nutzung erleben und wie weit sie über die Grundlagen hinausgehen." },
  "Impact is the degree to which AI is delivering real, felt value in your employees' work, not just activity but outcomes. Job security and workload are reported separately under Wellbeing, so this score is always about the work itself.": { nl: "Impact is de mate waarin AI echte, merkbare waarde oplevert in het werk van je medewerkers: niet alleen activiteit, maar resultaat. Baanzekerheid en werkdruk staan apart onder Welzijn, dus deze score gaat altijd over het werk zelf.", de: "Wirkung ist das Ausmaß, in dem KI einen echten, spürbaren Nutzen in der Arbeit Ihrer Mitarbeitenden bringt: nicht nur Aktivität, sondern Ergebnisse. Arbeitsplatzsicherheit und Arbeitsbelastung werden getrennt unter Wohlbefinden berichtet, daher geht es bei diesem Wert immer um die Arbeit selbst." },
  "Wellbeing captures what AI costs your employees personally, alongside what it gives their work. It asks whether AI is easing or adding to their workload, and whether they feel secure in their role as AI becomes more embedded in it.": { nl: "Welzijn laat zien wat AI je medewerkers persoonlijk kost, naast wat het hun werk oplevert. Het gaat over de vraag of AI hun werkdruk verlicht of vergroot, en of ze zich zeker voelen in hun rol nu AI daar een grotere plek in krijgt.", de: "Wohlbefinden zeigt, was KI Ihre Mitarbeitenden persönlich kostet, neben dem, was sie ihrer Arbeit bringt. Es geht darum, ob KI ihre Arbeitsbelastung senkt oder erhöht und ob sie sich in ihrer Rolle sicher fühlen, während KI dort einen größeren Platz einnimmt." }
});

/* ── Create survey: template picker and preview ── */
Object.assign(window.GTMA_STRINGS, {
  "Choose a survey template": { nl: "Kies een onderzoekstemplate", de: "Wählen Sie eine Befragungsvorlage" },
  "Save time with pre-made survey templates crafted by our experts": { nl: "Bespaar tijd met kant-en-klare templates van onze experts", de: "Sparen Sie Zeit mit fertigen Vorlagen unserer Expertinnen und Experten" },
  "Start from scratch": { nl: "Eigen onderzoek maken", de: "Eigene Befragung erstellen" },
  "Use template": { nl: "Gebruik template", de: "Vorlage verwenden" },
  "Preview": { nl: "Voorbeeld", de: "Vorschau" },
  "Back to templates": { nl: "Terug naar templates", de: "Zurück zu den Vorlagen" },
  "No results found": { nl: "Geen resultaten gevonden", de: "Keine Ergebnisse gefunden" }
});

/* ── Create survey: name and project ── */
Object.assign(window.GTMA_STRINGS, {
  "Let’s get started": { nl: "Aan de slag", de: "Auf geht's" },
  "Survey name": { nl: "Naam van het onderzoek", de: "Name der Befragung" },
  "At least 3 and at most 35 characters": { nl: "Minimaal 3 en maximaal 35 tekens", de: "Mindestens 3 und höchstens 35 Zeichen" },
  "What project does it belong to?": { nl: "Bij welk project hoort het?", de: "Zu welchem Projekt gehört sie?" },
  "Select a project": { nl: "Kies een project", de: "Projekt auswählen" },
  "Your new survey will be added to this project and use its settings": { nl: "Je nieuwe onderzoek wordt aan dit project toegevoegd en neemt de instellingen daarvan over", de: "Ihre neue Befragung wird diesem Projekt hinzugefügt und übernimmt dessen Einstellungen" },
  "Go back": { nl: "Terug", de: "Zurück" }
});

/* ── Review and plan: the cards ── */
Object.assign(window.GTMA_STRINGS, {
  "Completion time": { nl: "Invultijd", de: "Ausfülldauer" },
  "Not selected yet": { nl: "Nog niet gekozen", de: "Noch nicht ausgewählt" },
  "Inviting structure": { nl: "Uitnodigingsstructuur", de: "Einladungsstruktur" },
  "Randomized sample": { nl: "Aselecte steekproef", de: "Zufällige Stichprobe" },
  "Invited": { nl: "Uitgenodigd", de: "Eingeladen" },
  "Start of schedule": { nl: "Start van het schema", de: "Beginn des Zeitplans" },
  "End of schedule": { nl: "Einde van het schema", de: "Ende des Zeitplans" },
  "Total surveys created": { nl: "Totaal aantal onderzoeken", de: "Insgesamt erstellte Befragungen" },
  "Ends": { nl: "Eindigt", de: "Endet" },
  "Schedule": { nl: "Schema", de: "Zeitplan" },
  "Email content": { nl: "E-mailinhoud", de: "E-Mail-Inhalt" },
  "Default text": { nl: "Standaardtekst", de: "Standardtext" },
  "Edit": { nl: "Bewerken", de: "Bearbeiten" },
  "Survey": { nl: "Onderzoek", de: "Befragung" },
  "Email": { nl: "E-mail", de: "E-Mail" }
});

window.GTMA_RULES.push(
  { re: /^(\d+) participants?$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' deelnemer' : ' deelnemers'); }, de: function (m) { return m[1] + ' Teilnehmende'; } },
  { re: /^(\d+) minutes?$/, nl: '$1 minuten', de: '$1 Minuten' },
  { re: /^(\d+) Groups?$/, nl: function (m) { return m[1] + (m[1] === '1' ? ' groep' : ' groepen'); }, de: function (m) { return m[1] + (m[1] === '1' ? ' Gruppe' : ' Gruppen'); } }
);

/* A stamp reads "Thu, Sep 10, 2026, 09:00" in English. Dutch and German put the
   day first, so these reorder it and then swap the names. */
window.GTMA_RULES.push(
  { re: /^Your survey will start on (.+)$/,
    nl: function (m) { return 'Je onderzoek start op ' + window.gtmaT(m[1]); },
    de: function (m) { return 'Ihre Befragung startet am ' + window.gtmaT(m[1]); } }
);

/* English writes half past midnight as 12:00 AM; Dutch and German count to 24. */
window.gtmaClock24 = function (s) {
  return s.replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi, function (_, h, mm, ap) {
    h = Number(h) % 12;
    if (/pm/i.test(ap)) h += 12;
    return (h < 10 ? '0' : '') + h + ':' + mm;
  });
};

window.GTMA_RULES.push(
  { re: /^([A-Z][a-z]{2}), ([A-Z][a-z]{2}) (\d{1,2}), (\d{4})(.*)$/,
    nl: function (m) { return window.gtmaDate(m[1] + ', ' + m[3] + ' ' + m[2] + ' ' + m[4] + window.gtmaClock24(m[5])); },
    de: function (m) { return window.gtmaDate(m[1] + '., ' + m[3] + '. ' + m[2] + ' ' + m[4] + window.gtmaClock24(m[5])); } }
);

/* The scan compares one group against the benchmark, so its wording differs from
   the dashboard's, which also names the top-level group. */
Object.assign(window.GTMA_STRINGS, {
  "See how your group scores compared to the benchmark. If your group scores close or higher than the benchmark, that is great! If your group is falling far behind, you should look closer into this topic.": { nl: "Bekijk hoe je groep scoort ten opzichte van de benchmark. Scoort je groep dichtbij of hoger dan de benchmark, top! Blijft je groep ver achter, kijk dan beter naar dit onderwerp.", de: "Sehen Sie, wie Ihre Gruppe im Vergleich zur Benchmark abschneidet. Liegt Ihre Gruppe nahe an oder über der Benchmark, ist das super! Fällt Ihre Gruppe weit zurück, sollten Sie dieses Thema genauer betrachten." }
});

/* ── Waiting on the design system release ────────────────────────────────────
   Three strings, for the same reason as the thirty before them: the dashboard
   draws them, the design system owns the translation, and the prototype loads that file
   from Pages. The Actions intro was rewritten so it no longer claims responses
   are shared with HR, the Monitoring tile became "To monitor", and the empty
   state was reworded. A translation is keyed on its English source, so each
   rewrite took the Dutch and German with it. The fix is on the design
   system's pull request #13. Delete this block once that is released. */
Object.assign(window.GTMA_STRINGS, {
  "To monitor": { nl: "Monitoren", de: "Beobachten" },
  "Respond to a focus area to decide how you'll act on it, and it shows up here. Not sure where to start? Create a custom pin from your own goal.": { nl: "Reageer op een aandachtsgebied om te bepalen wat je ermee doet, dan verschijnt het hier. Weet je niet waar je moet beginnen? Maak een eigen pin vanuit je eigen doel.", de: "Reagieren Sie auf einen Schwerpunkt, um festzulegen, wie Sie damit umgehen, dann erscheint er hier. Sie wissen nicht, wo Sie anfangen sollen? Erstellen Sie eine eigene Markierung aus Ihrem eigenen Ziel." },
  "All actions you're taking, areas you're monitoring, and topics flagged for support, gathered from your focus areas and the questions you pinned in the Overview.": { nl: "Alle acties die je uitvoert, gebieden die je in de gaten houdt en onderwerpen waarvoor je hulp hebt aangevraagd, verzameld uit je aandachtsgebieden en de vragen die je in het overzicht hebt vastgepind.", de: "Alle Maßnahmen, die Sie ergreifen, Bereiche, die Sie beobachten, und Themen, für die Sie Unterstützung angefordert haben, gesammelt aus Ihren Schwerpunkten und den Fragen, die Sie in der Übersicht angepinnt haben." }
});
