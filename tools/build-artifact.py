#!/usr/bin/env python3
"""Build the prototype into one self-contained HTML file.

The prototype normally loads the design system from its Pages site. An artifact
may not: it can only fetch scripts from a handful of CDNs, so every stylesheet,
script, icon and illustration has to travel inside the file. This script packs
them, so the artifact stays a build of the repo instead of a copy that drifts.

Each screen keeps its own document, rendered into an iframe, which is what
spares us from merging eight pages' CSS and scripts into one namespace. A small
shim inside every iframe stands in for the things a document without a URL
cannot do by itself: navigate, read its own query string, and load an image.

  python3 tools/build-artifact.py            -> dist/gtma-artifact.html
"""
import base64, json, mimetypes, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DS = Path.home() / "Downloads" / "Engage-Design-system"
OUT = ROOT / "dist" / "gtma-artifact.html"
PAGES = "https://effectory-ux.github.io/Engage-Design-system-/"

# key, file, label, group — the screens a reader can reach from the picker.
SCREENS = [
    ("surveys",      "surveys.html",                        "Surveys",              "The flow"),
    ("survey",       "survey-detail.html",                  "Survey page",          "The flow"),
    ("questions",    "ai-adoption-scan-questionnaire.html", "Questions",            "Survey creator"),
    ("participants", "cyos-participants.html",              "Participants",         "Survey creator"),
    ("period",       "cyos-survey-period.html",             "Survey period",        "Survey creator"),
    ("design",       "cyos-layout-emails.html",             "Layout & emails",      "Survey creator"),
    ("launched",     "cyos-launched.html",                  "Ready for take off",   "Survey creator"),
    ("scan",         "ai-adoption-scan.html",               "AI Adoption Scan",     "Results"),
]
# The four dashboards are one page with a parameter, so they are built from a
# shell instead of from four files.
DASHBOARDS = [
    ("novanta-after",  "Novanta · Q3"),
    ("novanta-before", "Novanta · Q2"),
    ("team-it-after",  "Team IT · Q3"),
    ("team-it-before", "Team IT · Q2"),
]

def read(p):
    return Path(p).read_text(encoding="utf-8")

def data_uri(path):
    mime = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
    if mime == "image/svg+xml":
        return "data:image/svg+xml;base64," + base64.b64encode(Path(path).read_bytes()).decode()
    return "data:%s;base64,%s" % (mime, base64.b64encode(Path(path).read_bytes()).decode())

# ── what every screen needs ──────────────────────────────────────────────────
def css_files(names):
    """The design system, minus the @import that would pull the font stylesheet
       from another host; the pages carry their own @font-face already."""
    out = []
    for name in names:
        css = read(DS / name)
        css = re.sub(r"@import url\([^)]*\);\s*", "", css)
        out.append("/* ══ %s ══ */\n%s" % (name, css))
    return "\n".join(out)

def shared_js():
    """i18n first, then the dashboard renderer, the order the pages use."""
    return "\n".join(read(DS / n) for n in ("i18n.js", "effectiveness.js"))

def icon_map():
    """icons.js fetches one file per icon. Inside the artifact nothing can be
       fetched, so the icons travel as a map and a stand-in renderer uses it."""
    names = set(re.findall(r'data-icon=\\?["\']([a-zA-Z0-9_-]+)', "\n".join(
        read(p) for p in list(ROOT.glob("*.html")) + list(ROOT.glob("*.js")))))
    names |= set(re.findall(r'data-icon=\\?["\']([a-zA-Z0-9_-]+)', read(DS / "effectiveness.js")))
    names |= set(re.findall(r"icon:\s*'([a-zA-Z0-9_-]+)'", read(DS / "effectiveness.js")))
    out = {}
    for n in sorted(names):
        f = DS / "assets" / "icons" / (n + ".svg")
        if not f.exists():
            continue
        svg = f.read_text(encoding="utf-8")
        svg = re.sub(r'\sfill="#[0-9a-fA-F]{3,8}"', ' fill="currentColor"', svg)
        svg = re.sub(r'\sstroke="#[0-9a-fA-F]{3,8}"', ' stroke="currentColor"', svg)
        svg = re.sub(r'<svg([^>]*?)\swidth="[^"]*"', r"<svg\1", svg)
        svg = re.sub(r'<svg([^>]*?)\sheight="[^"]*"', r"<svg\1", svg)
        svg = re.sub(r"<svg\b", '<svg aria-hidden="true" width="100%" height="100%" style="display:block"', svg, count=1)
        out[n] = " ".join(svg.split())
    return out

def asset_map():
    """Every image the screens or the dashboard point at, as a data URI, keyed on
       the path they use. Only what is referenced: the design system's own
       illustration folder is two megabytes, most of it for other prototypes."""
    text = "\n".join(read(p) for p in list(ROOT.glob("*.html")) + list(ROOT.glob("*.js")))
    eff = read(DS / "effectiveness.js")
    out = {}

    def add(key, f):
        if Path(f).is_file():
            out[key] = data_uri(f)

    # written out in full, in the repo or on the design system's site
    for url in set(re.findall(r'https://effectory-ux\.github\.io/Engage-Design-system-/(assets/[^"\'\s)]+)', text + eff)):
        add(PAGES + url, DS / url)
    for rel in set(re.findall(r'["\'](assets/[a-z0-9/_.-]+\.(?:svg|png|jpe?g))["\']', text)):
        add(rel, ROOT / rel)

    # composed at run time: the dashboard's three illustrations and its file icons,
    # and one illustration per survey template in the picker
    for name in ("actions-empty", "improve-small", "win-small"):
        add(PAGES + "assets/illustrations/%s.svg" % name, DS / ("assets/illustrations/%s.svg" % name))
    for name in ("file-loading", "file-ready", "ppt-file", "pdf-file"):
        add(PAGES + "assets/icons/%s.svg" % name, DS / ("assets/icons/%s.svg" % name))
    for f in (DS / "assets/illustrations/templates").glob("*.svg"):
        add(PAGES + "assets/illustrations/templates/" + f.name, f)
    add(PAGES + "assets/illustrations/logo/effectory-logo.svg", DS / "assets/illustrations/logo/effectory-logo.svg")
    return out

print("design system  ", end="", flush=True)
CSS = css_files(("tokens.css", "foundation.css", "components.css"))
EFF_CSS = css_files(("effectiveness.css",))
JS, ICONS, ASSETS = shared_js(), icon_map(), asset_map()
print("%d KB css + %d KB dashboard-css \u00b7 %d KB js \u00b7 %d icons \u00b7 %d assets" % (len(CSS)//1024, len(EFF_CSS)//1024, len(JS)//1024, len(ICONS), len(ASSETS)))

# ── the screens ──────────────────────────────────────────────────────────────
DROP_SRC = re.compile(r"(proto-config\.js|toolbar/load\.js|gtma-icons\.js|" + re.escape(PAGES) + r")")

def split_page(path):
    """Take a page apart into the pieces an iframe document is rebuilt from:
       its own head (minus everything that came from another host), its body,
       and its scripts in the order the page runs them."""
    s = read(ROOT / path)
    # a page may leave </head> out; then the head runs up to <body>
    head_end = s.index("</head>") if "</head>" in s else s.index("<body>")
    head = s[s.index("<head>") + 6: head_end]
    body = s[s.index("<body>") + 6:]
    body = body[:body.rindex("</body>")] if "</body>" in body else body

    # head: keep this page's own <style> and inline <script>, drop the rest
    keep = []
    for m in re.finditer(r"<style>(.*?)</style>|<script>(.*?)</script>", head, re.S):
        keep.append("<style>%s</style>" % m.group(1) if m.group(1) is not None else "<script>%s</script>" % m.group(2))
    needs_eff = "effectiveness.js" in s
    needs_eff_css = "effectiveness.css" in head
    needs_chart = "chart.umd" in s

    # body: pull the scripts out, inline the local ones, drop what came from Pages
    scripts = []
    def take(m):
        src, inline = m.group(1), m.group(2)
        if src:
            if DROP_SRC.search(src):
                return ""
            f = ROOT / src
            if f.is_file():
                scripts.append(read(f))
            return ""
        scripts.append(inline)
        return ""
    body = re.sub(r'<script(?:\s+src="([^"]+)")?\s*>(.*?)</script>', take, body, flags=re.S)
    return {"head": "\n".join(keep), "body": body, "js": scripts,
            "eff": needs_eff, "effcss": needs_eff_css, "chart": needs_chart}

print("screens        ", end="", flush=True)
BUILT = {}
for key, f, label, group in SCREENS:
    p = split_page(f)
    p.update(label=label, group=group, file=f)
    BUILT[key] = p
print("%d + %d dashboards" % (len(BUILT), len(DASHBOARDS)))

# The dashboards share one shell: effectiveness.js draws them from a variant name.
SHELL = split_page("novanta-after-overview.html")
for variant, label in DASHBOARDS:
    js = [re.sub(r"renderOverview\('[^']+'", "renderOverview('%s'" % variant, j) for j in SHELL["js"]]
    BUILT["dash-" + variant] = dict(SHELL, js=js, label=label, group="Your voice results",
                                    file=variant + "-overview.html")

# ── the shim every iframe gets ───────────────────────────────────────────────
# A document built from a string has no URL, so three things it normally takes
# for granted have to be handed to it: where it is, how to go somewhere else,
# and how to load an image.
SHIM = r"""
(function () {
  var P = window.__params || {};
  function go(u) { parent.GTMA.go(String(u)); }
  /* Screen code reads location.search and sets location.href; both are rewritten
     to __loc at build time, so this object is what they talk to. */
  window.__loc = {
    pathname: P.pathname || '/', search: P.search || '', hash: P.hash || '',
    origin: 'https://gtma.local', host: 'gtma.local', hostname: 'gtma.local', protocol: 'https:',
    get href() { return 'https://gtma.local' + this.pathname + this.search + this.hash; },
    set href(u) { go(u); },
    assign: go, replace: go, reload: function () { parent.GTMA.go(parent.GTMA.here()); },
    toString: function () { return this.href; }
  };
  /* Images live in the file, keyed on the path the page asks for. */
  var A = parent.GTMA.assets;
  function fix(el) {
    var src = el.getAttribute('src');
    if (!src || src.slice(0, 5) === 'data:') return;
    var hit = A[src] || A[src.replace(/^\.\//, '')];
    if (hit) el.setAttribute('src', hit);
  }
  function sweep(root) {
    if (root.nodeType === 1 && root.tagName === 'IMG') fix(root);
    if (root.querySelectorAll) root.querySelectorAll('img[src]').forEach(fix);
  }
  document.addEventListener('DOMContentLoaded', function () { sweep(document); });
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { [].forEach.call(m.addedNodes, sweep); });
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* Links between screens are routed instead of followed. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href[0] === '#' || /^(https?:|mailto:|tel:)/.test(href)) return;
    e.preventDefault();
    go(href);
  }, true);

  /* icons.js fetches one file per icon, which nothing here can do. Same API,
     reading from the map that travelled with the page. */
  var ICONS = parent.GTMA.icons;
  function place(el) {
    if (el.dataset.iconLoaded) return;
    var svg = ICONS[el.getAttribute('data-icon')];
    if (!svg) return;
    el.innerHTML = svg;
    el.dataset.iconLoaded = '1';
  }
  window.Icons = {
    render: function (root) {
      (root && root.querySelectorAll ? root : document).querySelectorAll('[data-icon]:not([data-icon-loaded])').forEach(place);
    },
    renderOne: place
  };
  document.addEventListener('DOMContentLoaded', function () { window.Icons.render(document); });
  new MutationObserver(function () { window.Icons.render(document); }).observe(document.documentElement, { childList: true, subtree: true });
})();
"""

def rewrite(js):
    """Screen code talks to __loc instead of location: inside an iframe built
       from a string there is no URL to read or to navigate."""
    return re.sub(r"\b(?:window\.)?location\.", "__loc.", js)

# ── the file ─────────────────────────────────────────────────────────────────
def js_string(s):
    return json.dumps(s).replace("</", "<\\/")

groups = []
for key, s in BUILT.items():
    if s["group"] not in groups:
        groups.append(s["group"])

payload = {
    "screens": {k: {"label": v["label"], "group": v["group"], "file": v["file"],
                    "head": v["head"], "body": v["body"],
                    "js": [rewrite(j) for j in v["js"]],
                    "eff": v["eff"], "effcss": v["effcss"], "chart": v["chart"]} for k, v in BUILT.items()},
    "groups": groups,
}

TEMPLATE = """<title>GTMA prototype</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap">
<style>
  /* The chrome around the prototype: a rail to pick a screen, and the screen
     itself. Everything inside the frame is the design system's own. */
  :root {
    color-scheme: light;
    --bar: #ffffff; --bar-line: #e4e7ec; --ink: #1a2b47; --ink-soft: #667085;
    --brand: #0c827f; --ground: #f7f8fa; --hover: #f2f4f7;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --bar: #161b22; --bar-line: #30363d; --ink: #e6edf3; --ink-soft: #9198a1;
      --brand: #5acbc7; --ground: #0d1117; --hover: #21262d;
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --bar: #161b22; --bar-line: #30363d; --ink: #e6edf3; --ink-soft: #9198a1;
    --brand: #5acbc7; --ground: #0d1117; --hover: #21262d;
  }
  html, body { height: 100%; }
  body {
    margin: 0; background: var(--ground); color: var(--ink);
    font: 14px/1.5 'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif;
    display: flex; flex-direction: column;
  }
  .gt-bar {
    flex: none; display: flex; align-items: center; gap: 12px;
    padding: 8px 16px; padding-top: calc(8px + env(safe-area-inset-top, 0px));
    background: var(--bar); border-bottom: 1px solid var(--bar-line);
  }
  .gt-name { font-weight: 600; letter-spacing: .01em; }
  .gt-name span { color: var(--ink-soft); font-weight: 400; }
  .gt-pick { position: relative; margin-left: auto; }
  .gt-btn {
    display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 12px;
    border: 1px solid var(--bar-line); border-radius: 6px; background: var(--bar);
    color: var(--ink); font: inherit; cursor: pointer;
  }
  .gt-btn:hover { background: var(--hover); }
  .gt-btn svg { width: 14px; height: 14px; }
  .gt-menu {
    position: absolute; right: 0; top: calc(100% + 6px); z-index: 10; width: 280px;
    max-height: 70vh; overflow-y: auto; padding: 6px;
    background: var(--bar); border: 1px solid var(--bar-line); border-radius: 10px;
    box-shadow: 0 12px 32px rgba(16, 24, 40, .18);
  }
  .gt-menu[hidden] { display: none; }
  .gt-group {
    padding: 10px 10px 4px; font-size: 11px; font-weight: 600; letter-spacing: .06em;
    text-transform: uppercase; color: var(--ink-soft);
  }
  .gt-item {
    display: block; width: 100%; padding: 8px 10px; border: 0; border-radius: 6px;
    background: none; color: var(--ink); font: inherit; text-align: left; cursor: pointer;
  }
  .gt-item:hover { background: var(--hover); }
  .gt-item.is-on { color: var(--brand); font-weight: 600; }
  .gt-stage { flex: 1; min-height: 0; border: 0; width: 100%; background: var(--ground); }
  @media (max-width: 520px) { .gt-name span { display: none; } }
</style>

<div class="gt-bar">
  <div class="gt-name">GTMA <span>· prototype</span></div>
  <div class="gt-pick">
    <button class="gt-btn" id="gtBtn" aria-haspopup="menu" aria-expanded="false">
      <span id="gtNow">Surveys</span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="gt-menu" id="gtMenu" role="menu" hidden></div>
  </div>
</div>
<iframe class="gt-stage" id="gtStage" title="GTMA prototype"></iframe>

<script>
const BUNDLE = JSON.parse(@@PAYLOAD@@);
const SHARED_CSS = @@CSS@@;
const EFF_CSS = @@EFFCSS@@;
const I18N_JS = @@I18N@@;
const EFF_JS = @@EFF@@;
const SHIM = @@SHIM@@;
const ICONS = JSON.parse(@@ICONS@@);
const ASSETS = JSON.parse(@@ASSETS@@);

/* Which file belongs to which screen, so a link inside the prototype finds it. */
const BY_FILE = {};
for (const [key, s] of Object.entries(BUNDLE.screens)) BY_FILE[s.file] = key;
/* The pages that only forwarded on the live site do the same here. */
Object.assign(BY_FILE, {
  'index.html': 'surveys',
  'ai-adoption-scan-overview.html': 'scan', 'ai-adoption-scan-themes.html': 'scan',
  'ai-adoption-scan-scores.html': 'scan', 'ai-adoption-scan-reports.html': 'scan',
  'ai-adoption-scan-actions.html': 'scan', 'ai-adoption-scan-template-dialog.html': 'surveys',
  'novanta-after-overview.html': 'dash-novanta-after', 'novanta-before-overview.html': 'dash-novanta-before',
  'team-it-after-overview.html': 'dash-team-it-after', 'team-it-before-overview.html': 'dash-team-it-before'
});

const stage = document.getElementById('gtStage');
const menu = document.getElementById('gtMenu');
const btn = document.getElementById('gtBtn');
const now = document.getElementById('gtNow');
let current = 'surveys';

function docFor(key, params) {
  const s = BUNDLE.screens[key];
  const chart = s.chart ? '<scr' + 'ipt src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"></scr' + 'ipt>' : '';
  const tag = (js) => '<scr' + 'ipt>' + js + '</scr' + 'ipt>';
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>' + SHARED_CSS + '</style>' + (s.effcss ? '<style>' + EFF_CSS + '</style>' : '') + s.head +
    tag('window.__params = ' + JSON.stringify(params) + ';') + tag(SHIM) + chart +
    tag(I18N_JS) + (s.eff ? tag(EFF_JS) : '') +
    '</head><body>' + s.body + s.js.map(tag).join('') + '</body></html>';
}

/* The prototype passes state in the query and the hash; an artifact link cannot
   carry either, so the router keeps them and hands them to the frame. */
const GTMA = {
  icons: ICONS, assets: ASSETS,
  here: () => BUNDLE.screens[current].file,
  go(url) {
    const u = String(url);
    const file = (u.split(/[?#]/)[0] || GTMA.here()).replace(/^\.\//, '');
    const rest = u.slice(u.split(/[?#]/)[0].length);
    show(BY_FILE[file] || current, rest);
  }
};
window.GTMA = GTMA;

function show(key, q = '') {
  if (!BUNDLE.screens[key]) key = 'surveys';
  current = key;
  const s = BUNDLE.screens[key];
  const search = (q.match(/\\?[^#]*/) || [''])[0];
  const hash = (q.match(/#.*/) || [''])[0];
  now.textContent = s.label;
  document.title = 'GTMA prototype';
  [...menu.querySelectorAll('.gt-item')].forEach(b => b.classList.toggle('is-on', b.dataset.key === key));
  stage.srcdoc = docFor(key, { pathname: '/' + s.file, search, hash });
  try { location.hash = key.replace(/[^a-z0-9-]/gi, ''); } catch (e) {}
}

BUNDLE.groups.forEach(g => {
  const h = document.createElement('div');
  h.className = 'gt-group';
  h.textContent = g;
  menu.appendChild(h);
  for (const [key, s] of Object.entries(BUNDLE.screens)) {
    if (s.group !== g) continue;
    const b = document.createElement('button');
    b.className = 'gt-item';
    b.dataset.key = key;
    b.textContent = s.label;
    b.setAttribute('role', 'menuitem');
    b.addEventListener('click', () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); show(key); });
    menu.appendChild(b);
  }
});

btn.addEventListener('click', e => {
  e.stopPropagation();
  menu.hidden = !menu.hidden;
  btn.setAttribute('aria-expanded', String(!menu.hidden));
});
document.addEventListener('click', () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); });

show(BY_FILE[(location.hash || '').slice(1)] ? BY_FILE[location.hash.slice(1)] : (BUNDLE.screens[(location.hash || '').slice(1)] ? location.hash.slice(1) : 'surveys'));
</script>
"""

SUBS = {
    "@@PAYLOAD@@": js_string(json.dumps(payload)),
    "@@CSS@@": js_string(CSS),
    "@@EFFCSS@@": js_string(EFF_CSS),
    "@@I18N@@": js_string(read(DS / "i18n.js")),
    "@@EFF@@": js_string(read(DS / "effectiveness.js")),
    "@@SHIM@@": js_string(SHIM),
    "@@ICONS@@": js_string(json.dumps(ICONS)),
    "@@ASSETS@@": js_string(json.dumps(ASSETS)),
}
HTML = TEMPLATE
for token, value in SUBS.items():
    HTML = HTML.replace(token, value)

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(HTML, encoding="utf-8")
print("geschreven     %s \u00b7 %.1f MB" % (OUT.relative_to(ROOT), OUT.stat().st_size / 1024 / 1024))
