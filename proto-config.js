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
  var SCAN = [
    ["ai-adoption-scan-template-dialog.html", "Choose a template", "The template dialog, AI Adoption Scan up front"],
    ["ai-adoption-scan-questionnaire.html", "Questionnaire", "24 questions in seven sections, read-only"],
    ["ai-adoption-scan-themes.html", "Themes", "The six stages compared, one card per theme"],
    ["ai-adoption-scan-scores.html", "Scores", "18 scale questions per theme, with Effectory Index"]
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
    }).concat(SCAN.map(function (s) {
      return { key: s[0], label: s[1], desc: s[2], group: "AI Adoption Scan", href: s[0] };
    })),
    variants: [
      { key: "team-it", label: "Team IT instead of Novanta", desc: "The same screens for the second example organisation.",
        on: function (u) { return parts(u).org === "team-it"; },
        href: function (on) { return page({ org: on ? "team-it" : "novanta" }); } }
    ]
  };
})();
