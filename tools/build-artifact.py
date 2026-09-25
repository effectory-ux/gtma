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
       fetched, so the icons travel as a map and a stand-in renderer uses it.

       All of them, not the ones a pattern finds: a page names its icons in
       markup, in a config object and in plain arrays, and a missed name shows
       up as an empty square. The whole set is 274 KB against a file of 3.7 MB."""
    out = {}
    for f in sorted((DS / "assets" / "icons").glob("*.svg")):
        svg = f.read_text(encoding="utf-8")
        svg = re.sub(r'\sfill="#[0-9a-fA-F]{3,8}"', ' fill="currentColor"', svg)
        svg = re.sub(r'\sstroke="#[0-9a-fA-F]{3,8}"', ' stroke="currentColor"', svg)
        svg = re.sub(r'<svg([^>]*?)\swidth="[^"]*"', r"<svg\1", svg)
        svg = re.sub(r'<svg([^>]*?)\sheight="[^"]*"', r"<svg\1", svg)
        svg = re.sub(r"<svg\b", '<svg aria-hidden="true" width="100%" height="100%" style="display:block"', svg, count=1)
        out[f.stem] = " ".join(svg.split())
    return out

def asset_map():
    """Every image a screen can ask for, as a data URI.

       Keyed twice, under the full URL and under the bare path: a page writes
       the first, effectiveness.js composes the second from an ASSET_BASE that
       is empty inside an inline script. Vector illustrations all travel, the
       same reasoning as the icons: they are named in markup, in config and in
       arrays, and guessing which ones missed win-small and improve-small on
       every dashboard. Photographs are only packed when something asks for
       them by name, because they are the heavy ones."""
    text = "\n".join(read(p) for p in list(ROOT.glob("*.html")) + list(ROOT.glob("*.js")))
    eff = read(DS / "effectiveness.js")
    out = {}

    uris, index = [], {}

    def add(path, *keys):
        path = Path(path)
        if not path.is_file():
            return
        if path not in index:
            index[path] = len(uris)
            uris.append(data_uri(path))
        for k in keys:
            out[k] = index[path]
            if not k.startswith("http"):
                out[PAGES + k] = index[path]

    # every vector the design system ships, under both spellings
    for f in (DS / "assets" / "illustrations").rglob("*.svg"):
        rel = str(f.relative_to(DS))
        add(f, rel)
    # an icon can also be drawn as an image rather than inlined: the reports view
    # builds ${ASSET_BASE}assets/icons/${type}-file.svg, a name no pattern finds.
    # They are small, so they all get a URI as well as their inline copy.
    for f in (DS / "assets" / "icons").glob("*.svg"):
        add(f, str(f.relative_to(DS)))

    # written out in full by a page or by the design system
    for url in set(re.findall(r'https://effectory-ux\.github\.io/Engage-Design-system-/(assets/[^"\'\s)]+)', text + eff)):
        add(DS / url, url)
    # this repo's own images, relative
    for rel in set(re.findall(r'["\'](assets/[a-z0-9/_.-]+\.(?:svg|png|jpe?g))["\']', text)):
        add(ROOT / rel, rel)
    return {"keys": out, "uris": uris}

print("design system  ", end="", flush=True)
CSS = css_files(("tokens.css", "foundation.css", "components.css"))
EFF_CSS_RAW = None
EFF_CSS = css_files(("effectiveness.css",))
JS, ICONS, ASSETS = shared_js(), icon_map(), asset_map()
print("%d KB css + %d KB dashboard-css \u00b7 %d KB js \u00b7 %d icons \u00b7 %d plaatjes onder %d namen" % (len(CSS)//1024, len(EFF_CSS)//1024, len(JS)//1024, len(ICONS), len(ASSETS["uris"]), len(ASSETS["keys"])))

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

    # head: keep this page's own <style>, inline <script> and own stylesheets,
    # drop what came from another host. A stylesheet of this repo is read in
    # where its <link> stood, so the cascade keeps the order the page had: it
    # carries the review dialog and the Action Center, and without it those
    # draw unstyled, icons at full width.
    keep = []
    for m in re.finditer(r"<style>(.*?)</style>|<script>(.*?)</script>"
                         r'|<link[^>]*?rel="stylesheet"[^>]*?href="([^"]+)"[^>]*>', head, re.S):
        if m.group(1) is not None:
            keep.append("<style>%s</style>" % m.group(1))
        elif m.group(2) is not None:
            keep.append("<script>%s</script>" % m.group(2))
        else:
            f = ROOT / m.group(3)
            if f.is_file():
                keep.append("<style>/* %s */\n%s</style>" % (m.group(3), read(f)))
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
# Live, each of the six views is its own file calling renderOverview(variant, view).
# Here one screen per variant serves all six, and the view arrives in the query
# the router hands it, so a link to …-themes.html still opens on Themes.
VIEW = "(__loc.search.match(/view=([a-z]+)/) || [])[1] || 'overview'"
for variant, label in DASHBOARDS:
    js = [re.sub(r"renderOverview\('[^']+',\s*'[^']*'", "renderOverview('%s', %s" % (variant, VIEW),
                 re.sub(r"renderOverview\('[^']+'(?!\s*,)", "renderOverview('%s'" % variant, j))
          for j in SHELL["js"]]
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
  /* A document built from a string has no URL, so the History API refuses to
     write one: replaceState throws a SecurityError. The scan's tabs call it on
     every click, and the error stopped the click before it switched the view.
     The parent owns the address bar here, so these become no-ops. */
  try { history.replaceState = function () {}; history.pushState = function () {}; } catch (e) {}
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
    var i = A.keys[src];
    if (i === undefined) i = A.keys[src.replace(/^\.\//, '')];
    if (i === undefined) { console.warn('[gtma] geen ingebakken plaatje voor', src); return; }
    el.setAttribute('src', A.uris[i]);
  }
  /* Markup a screen writes at run time carries the same image paths, and the
     parser fetches them the instant the string is assigned: by the time the
     observer below runs, the request is already out and 404s. So the string
     is swapped on its way in, and the observer stays as the safety net. */
  function swapHTML(html) {
    if (html.indexOf('assets/') === -1) return html;
    return html.replace(/(\ssrc=")([^"]+)(")/g, function (m, a, url, z) {
      if (url.slice(0, 5) === 'data:') return m;
      var i = A.keys[url];
      if (i === undefined) i = A.keys[url.replace(/^\.\//, '')];
      return i === undefined ? m : a + A.uris[i] + z;
    });
  }
  var IH = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: true, enumerable: IH.enumerable,
    get: function () { return IH.get.call(this); },
    set: function (v) { IH.set.call(this, swapHTML(String(v))); }
  });
  var IA = Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML = function (pos, html) {
    return IA.call(this, pos, swapHTML(String(html)));
  };
  var SRC = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true, enumerable: SRC.enumerable,
    get: function () { return SRC.get.call(this); },
    set: function (v) {
      var u = String(v), i = A.keys[u];
      if (i === undefined) i = A.keys[u.replace(/^\.\//, '')];
      SRC.set.call(this, i === undefined ? u : A.uris[i]);
    }
  });

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

LOC_PROPS = ("href", "pathname", "search", "hash", "origin", "host", "hostname",
             "protocol", "replace", "assign", "reload")

def rewrite(js):
    """Screen code talks to __loc instead of location: inside an iframe built
       from a string there is no URL to read or to navigate. Only the real
       properties are swapped, because the design system's translations talk
       about "location" as a word and must be left alone."""
    return re.sub(r"\b(?:window\.)?location\.(?=(?:%s)\b)" % "|".join(LOC_PROPS),
                  "__loc.", js)


def rewrite_css(css, assets):
    """An image can also arrive through CSS: the layout previews, the phase
       glyphs in the timeline, a checkmark in a checkbox. Nothing rewrites those
       at run time the way an <img> is rewritten, so they are swapped here."""
    def sub(m):
        raw = m.group(2).strip()
        if raw.startswith(("data:", "http")) and "effectory-ux.github.io" not in raw:
            return m.group(0)
        key = raw.replace("./", "")
        i = assets["keys"].get(key, assets["keys"].get(raw))
        return "url(%s)" % assets["uris"][i] if i is not None else m.group(0)
    return re.sub(r"url\((['\"]?)([^)]*?)\1\)", sub, css)


def swap_img(html, assets):
    """An <img> in the markup is fetched the moment the parser reads it, long
       before the shim can swap it. Outside the artifact that is a request that
       404s, so the src is resolved here instead."""
    def sub(m):
        raw = m.group(2)
        if raw.startswith("data:"):
            return m.group(0)
        key = raw.replace("./", "").replace(PAGES, "")
        i = assets["keys"].get(raw, assets["keys"].get(key))
        return m.group(1) + assets["uris"][i] + m.group(3) if i is not None else m.group(0)
    return re.sub(r'(<img\b[^>]*?\ssrc=")([^"]+)(")', sub, html)


def rewrite_markup(html):
    """The same, for the navigation a page writes straight into its markup:
       onclick="location.href='cyos-participants.html'" on the step buttons.
       Left alone, a relative URL in a frame without one resolves against the
       page around it, and the whole artifact goes looking for a file that is
       not there. Only inside on* attributes, never in the text itself."""
    return re.sub(r'(\son\w+=")([^"]*)(")',
                  lambda m: m.group(1) + rewrite(m.group(2)) + m.group(3), html)

# ── the file ─────────────────────────────────────────────────────────────────
def js_string(s):
    return json.dumps(s).replace("</", "<\\/")

groups = []
for key, s in BUILT.items():
    if s["group"] not in groups:
        groups.append(s["group"])

payload = {
    "screens": {k: {"label": v["label"], "group": v["group"], "file": v["file"],
                    "head": rewrite_css(v["head"], ASSETS), "body": swap_img(rewrite_markup(v["body"]), ASSETS),
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
    let rest = u.slice(u.split(/[?#]/)[0].length);
    /* A dashboard is one screen per group and period; which of the six views it
       opens on is the last part of the file name the prototype asks for. */
    const dash = file.match(/^(novanta|team-it)-(after|before)-(overview|focus|themes|scores|reports|actions)\.html$/);
    if (dash) {
      rest = '?view=' + dash[3] + (rest.match(/#.*/) || [''])[0];
      return show('dash-' + dash[1] + '-' + dash[2], rest);
    }
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

function fromHash() {
  const h = (location.hash || '').slice(1);
  return BUNDLE.screens[h] ? h : (BY_FILE[h] || 'surveys');
}
/* A link straight to #questions changes the hash without reloading the page. */
window.addEventListener('hashchange', () => { if (fromHash() !== current) show(fromHash()); });
show(fromHash());
</script>
"""

SUBS = {
    "@@PAYLOAD@@": js_string(json.dumps(payload)),
    "@@CSS@@": js_string(rewrite_css(CSS, ASSETS)),
    "@@EFFCSS@@": js_string(rewrite_css(EFF_CSS, ASSETS)),
    "@@I18N@@": js_string(rewrite(read(DS / "i18n.js"))),
    "@@EFF@@": js_string(rewrite(read(DS / "effectiveness.js"))),
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
