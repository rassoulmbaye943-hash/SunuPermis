/* SunuPermis — rendu des images individuelles issues du PDF fourni */
function spSignSVG(p, size) {
  size = size || 64;
  var src = p.image || "assets/panneaux/pdf-001.png";
  var label =
    (p.nom || "Panneau") +
    (p.code ? " — code " + p.code : "") +
    " — image du PDF";
  return (
    '<img class="sign-original-pdf" src="' +
    src +
    '" width="' +
    size +
    '" height="' +
    size +
    '" alt="' +
    label.replace(/&/g, "&amp;").replace(/"/g, "&quot;") +
    '" loading="lazy" decoding="async" onerror="this.classList.add(\'sign-image-missing\');this.alt=\'Image du panneau indisponible\';">'
  );
}
function oct(s) {
  var k = s * 0.29,
    m = s - k;
  return (
    [k, 4].join(",") +
    " " +
    [m, 4].join(",") +
    " " +
    [s - 4, k].join(",") +
    " " +
    [s - 4, m].join(",") +
    " " +
    [m, s - 4].join(",") +
    " " +
    [k, s - 4].join(",") +
    " " +
    [4, m].join(",") +
    " " +
    [4, k].join(",")
  );
}
