// proto-config.js — what THIS prototype puts in the shared prototype toolbar
// (toolbar/prototype-bar.js). Host-specific by design: the toolbar itself
// knows nothing about GTMA. Pages are named <org>-<moment>-<screen>.html; the
// four AI Adoption Scan pages stand apart from that grid.
(function () {
  var RE = /^(novanta|team-it)-(before|after)-([a-z]+)\.html$/;
  function parts(u) {
    var m = RE.exec(u.pathname.split("/").pop());
    return { org: m ? m[1] : "novanta", moment: m ? m[2] : "after", screen: m ? m[3] : "overview" };
  }
  // The same page with one part swapped — org, moment or screen.
  function page(o) {
    return function (u) { var p = parts(u); return (o.org || p.org) + "-" + (o.moment || p.moment) + "-" + (o.screen || p.screen) + ".html"; };
  }
  var DASHBOARD = [
    ["overview", "Overview", "Effectiveness, engagement, eNPS and themes at a glance"],
    ["scores", "Scores", "Every question, with benchmark and previous survey"],
    ["themes", "Themes", "The themes compared"],
    ["focus", "Focus", "What to work on first"],
    ["reports", "Reports", "Downloads and shared reports"],
    ["actions", "Actions", "Action plans on the results"]
  ];
  /* Where the demo starts, and the survey it ends on. */
  var FLOW = [
    ["surveys.html", "Surveys", "The list the demo opens on: the two measurements on top"],
    ["survey-detail.html", "Survey page", "A planned or running survey, with its timeline"]
  ];
  /* Setting a survey up, in the order the rail walks. */
  var CREATOR = [
    ["ai-adoption-scan-questionnaire.html", "Questions", "The template's questionnaire, read-only"],
    ["cyos-participants.html", "Participants", "Groups, and the randomized sample"],
    ["cyos-survey-period.html", "Survey period", "When it starts, how often, how long it stays open"],
    ["cyos-layout-emails.html", "Layout & emails", "The survey's design and the two emails"],
    ["cyos-launched.html", "Ready for take off", "The confirmation, once it is planned"]
  ];
  /* The scan's results are one page with five views, so each is a hash. */
  var SCAN = [
    ["#overview", "Overview", "Highest and lowest scores, and the response rate"],
    ["#themes", "Themes", "The six stages compared, one card per theme"],
    ["#scores", "Scores", "Every question per theme, with the Effectory Index"],
    ["#reports", "Reports", "The three reports the scan offers"],
    ["#actions", "Actions", "What was decided, and the planner behind it"]
  ];
  window.PROTO_TOOLBAR = {
    prefix: "gtma",            // localStorage namespace
    name: "GTMA",              // badge on pages outside the before/after grid
    live: "https://effectory-ux.github.io/gtma/",
    versions: [
      { key: "before", label: "Before · Q2", desc: "The dashboard as it is today, after the Q2 survey.", match: /-before-/, go: page({ moment: "before" }) },
      { key: "after", label: "After · Q3", desc: "The new dashboard, after the Q3 survey.", match: /-after-/, go: page({ moment: "after" }) }
    ],
    screens: DASHBOARD.map(function (s) {
      return { key: s[0], label: s[1], desc: s[2], group: "Results dashboard", href: page({ screen: s[0] }),
        match: function (u) { return RE.test(u.pathname.split("/").pop()) && parts(u).screen === s[0]; } };
    }).concat(FLOW.map(function (s) {
      return { key: s[0], label: s[1], desc: s[2], group: "The flow", href: s[0],
        match: function (u) { return u.pathname.split("/").pop() === s[0]; } };
    })).concat(CREATOR.map(function (s) {
      return { key: s[0], label: s[1], desc: s[2], group: "Survey creator", href: s[0],
        match: function (u) { return u.pathname.split("/").pop() === s[0]; } };
    })).concat(SCAN.map(function (s) {
      return { key: "scan" + s[0], label: s[1], desc: s[2], group: "AI Adoption Scan results",
        href: "ai-adoption-scan.html" + s[0],
        match: function (u) {
          return u.pathname.split("/").pop() === "ai-adoption-scan.html" &&
                 (u.hash || "#overview") === s[0];
        } };
    })),
    variants: [
      { key: "team-it", label: "Team IT instead of Novanta", desc: "The same screens for the second example organisation.",
        on: function (u) { return parts(u).org === "team-it"; },
        href: function (on) { return page({ org: on ? "team-it" : "novanta" }); } }
    ]
  };
})();
