function switchChart(val) {
  var groups = {
    style: { tags: [
      { n:'баланс', c:'#26A69A', d:[50,55,62,70,78,85] },
      { n:'динамика', c:'#FFB300', d:[32,38,45,52,62,70] },
      { n:'кампус', c:'#E53935', d:[15,18,22,28,34,40] },
      { n:'силовой', c:'#43A047', d:[28,34,40,48,55,60] },
      { n:'статика', c:'#1E88E5', d:[42,48,55,62,70,80] },
      { n:'техничный', c:'#8E24AA', d:[32,40,48,56,65,75] }
    ]},
    relief: { tags: [
      { n:'арка', c:'#26A69A', d:[32,38,44,50,56,60] },
      { n:'вертикаль', c:'#FFB300', d:[48,55,62,70,78,85] },
      { n:'камин', c:'#E53935', d:[10,14,18,22,26,30] },
      { n:'нависание', c:'#43A047', d:[32,40,48,55,62,70] },
      { n:'полка', c:'#1E88E5', d:[25,30,36,42,48,55] },
      { n:'положилово', c:'#8E24AA', d:[18,22,28,34,40,45] }
    ]},
    hold: { tags: [
      { n:'подхват', c:'#26A69A', d:[42,50,58,66,74,80] },
      { n:'карман', c:'#FFB300', d:[32,38,46,54,62,70] },
      { n:'щипок', c:'#E53935', d:[28,34,42,50,58,65] },
      { n:'мизера', c:'#43A047', d:[22,28,34,42,48,55] },
      { n:'пассив', c:'#1E88E5', d:[16,20,26,32,38,45] }
    ]},
    type: { tags: [
      { n:'боулдеринг', c:'#26A69A', d:[48,55,62,70,78,85] },
      { n:'скорость', c:'#FFB300', d:[10,14,18,22,24,25] },
      { n:'трудность', c:'#E53935', d:[28,34,42,50,56,60] }
    ]}
  };
  var xs = [50, 155, 260, 365, 455, 565];
  var gl = document.getElementById('chartLines');
  var st = document.getElementById('chartStats');
  var lg = document.getElementById('chartLegend');
  var ax = ['axis1','axis2','axis3','axis4'].map(function(id){return document.getElementById(id);});
  if (val === 'all') {
    gl.innerHTML = '<path d="M 50 140 C 130 135, 200 100, 260 90 C 320 80, 380 55, 455 45 C 500 38, 530 32, 565 30 L 565 175 L 50 175 Z" fill="url(#gradeGrad)" opacity=".3"/>' +
      '<path d="M 50 140 C 130 135, 200 100, 260 90 C 320 80, 380 55, 455 45 C 500 38, 530 32, 565 30" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="50" cy="140" r="4" fill="var(--primary)"/>' +
      '<circle cx="155" cy="115" r="4" fill="var(--primary)"/>' +
      '<circle cx="260" cy="90" r="4" fill="var(--primary)"/>' +
      '<circle cx="365" cy="65" r="4" fill="var(--primary)"/>' +
      '<circle cx="455" cy="45" r="4" fill="var(--primary)"/>' +
      '<circle cx="565" cy="30" r="5" fill="var(--secondary)" stroke="var(--bg)" stroke-width="2"/>' +
      '<text x="555" y="20" fill="var(--secondary)" font-size="9" font-weight="700" text-anchor="end">🏆 534</text>';
    st.style.display = ''; lg.style.display = 'none';
    ax.forEach(function(t,i){if(t)t.textContent=[600,450,300,150][i];});
    return;
  }
  var grp = groups[val];
  if (!grp) return;
  ax.forEach(function(t,i){if(t)t.textContent=[100,75,50,25][i];});
  var h = '';
  grp.tags.forEach(function(tag){
    var pts = tag.d.map(function(v,i){ var y = 175 - v*1.55; return xs[i]+','+y; }).join(' ');
    h += '<path d="M '+pts+'" fill="none" stroke="'+tag.c+'" stroke-width="2" stroke-linecap="round"/>';
    tag.d.forEach(function(v,i){
      var y = 175 - v*1.55;
      h += '<circle cx="'+xs[i]+'" cy="'+y+'" r="'+(i===5?4:2.5)+'" fill="'+tag.c+'"/>';
      if (i===5) h += '<text x="'+(xs[i]+8)+'" y="'+(y+3)+'" fill="'+tag.c+'" font-size="8" font-weight="600">'+v+'</text>';
    });
  });
  gl.innerHTML = h;
  st.style.display = 'none';
  var lh = '<div class="flex items-c jc-c gap-12 wrap">';
  grp.tags.forEach(function(tag){
    lh += '<span><span style="display:inline-block;width:14px;height:3px;background:'+tag.c+';border-radius:2px;vertical-align:middle;margin-right:5px;"></span><span class="text-2 text-sm">'+tag.n+'</span></span>';
  });
  lh += '</div>';
  lg.innerHTML = lh;
  lg.style.display = '';
}

// ===== Glassmorphism Radar Renderer =====
const radarData = {
  style: {
    label: '🎨 Стиль',
    strong: 'баланс', growth: 'техничный',
    strongIcon: '🎯', growthIcon: '📈',
    items: [
      { n:'баланс',    c:'#26A69A', v:85 },
      { n:'динамика',  c:'#FFB300', v:70 },
      { n:'кампус',    c:'#EF5350', v:40 },
      { n:'силовой',   c:'#66BB6A', v:60 },
      { n:'статика',   c:'#42A5F5', v:80 },
      { n:'техничный', c:'#AB47BC', v:75 }
    ]
  },
  relief: {
    label: '🏔 Рельеф',
    strong: 'вертикаль', growth: 'нависание',
    strongIcon: '🏔', growthIcon: '📈',
    items: [
      { n:'арка',       c:'#26A69A', v:60 },
      { n:'вертикаль',  c:'#FFB300', v:85 },
      { n:'камин',      c:'#EF5350', v:30 },
      { n:'нависание',  c:'#66BB6A', v:70 },
      { n:'полка',      c:'#42A5F5', v:55 },
      { n:'положилово', c:'#AB47BC', v:45 }
    ]
  },
  hold: {
    label: '🤲 Зацеп',
    strong: 'подхват', growth: 'карман',
    strongIcon: '🤲', growthIcon: '📈',
    items: [
      { n:'подхват', c:'#26A69A', v:80 },
      { n:'карман',  c:'#FFB300', v:70 },
      { n:'щипок',   c:'#EF5350', v:65 },
      { n:'мизера',  c:'#66BB6A', v:55 },
      { n:'пассив',  c:'#42A5F5', v:45 }
    ]
  },
  type: {
    label: '📌 Тип',
    strong: 'боулдеринг', growth: 'трудность',
    strongIcon: '📌', growthIcon: '📈',
    items: [
      { n:'боулдеринг', c:'#26A69A', v:85 },
      { n:'скорость',   c:'#FFB300', v:25 },
      { n:'трудность',  c:'#EF5350', v:60 }
    ]
  }
};

function polarToCartesian(cx, cy, r, angleDeg) {
  var rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function renderRadar(category) {
  var data = radarData[category];
  if (!data) return;

  // Assign indices first
  data.items.forEach(function(item, i) { item.i = i; });

  var cx = 150, cy = 150, maxR = 100;
  var N = data.items.length;
  var angleStep = 360 / N;

  // Data polygon
  var dataPoints = data.items.map(function(item) {
    var p = polarToCartesian(cx, cy, maxR * item.v / 100, angleStep * item.i);
    return p.x + ',' + p.y;
  }).join(' ');

  var svgContent = '';

  // Defs with glow filter
  svgContent += '<defs>' +
    '<filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">' +
      '<feGaussianBlur stdDeviation="3" result="blur"/>' +
      '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    '<filter id="radarGlowStrong" x="-50%" y="-50%" width="200%" height="200%">' +
      '<feGaussianBlur stdDeviation="5" result="blur"/>' +
      '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
    '</filter>' +
    '</defs>';

  // Background subtle ring glow
  svgContent += '<circle cx="' + cx + '" cy="' + cy + '" r="' + maxR + '" ' +
    'fill="none" stroke="var(--primary)" stroke-width="0.3" opacity="0.15"/>';

  // Grid circles with glass style
  [0.25, 0.5, 0.75, 1.0].forEach(function(r) {
    svgContent += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (maxR * r) + '" ' +
      'fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>';
  });

  // Axis lines
  data.items.forEach(function(item) {
    var p = polarToCartesian(cx, cy, maxR + 5, angleStep * item.i);
    var pInner = polarToCartesian(cx, cy, 10, angleStep * item.i);
    svgContent += '<line x1="' + pInner.x + '" y1="' + pInner.y + '" ' +
      'x2="' + p.x + '" y2="' + p.y + '" ' +
      'stroke="rgba(255,255,255,0.06)" stroke-width="1"/>';
  });

  // Glass fill (translucent gradient polygon)
  var gradId = 'radarGrad_' + category;
  svgContent += '<defs>' +
    '<linearGradient id="' + gradId + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + data.items[0].c + '" stop-opacity="0.35"/>' +
      '<stop offset="100%" stop-color="' + data.items[Math.min(2, N-1)].c + '" stop-opacity="0.1"/>' +
    '</linearGradient>' +
    '</defs>';

  // Data polygon with glow
  svgContent += '<polygon points="' + dataPoints + '" ' +
    'fill="url(#' + gradId + ')" ' +
    'stroke="rgba(255,255,255,0.1)" stroke-width="0.5" ' +
    'filter="url(#radarGlow)"/>';

  // Closed polygon outline (white-ish glow border)
  svgContent += '<polygon points="' + dataPoints + '" ' +
    'fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5" ' +
    'filter="url(#radarGlow)"/>';

  // Gradient edges between vertices — smooth gradient along the edge
  data.items.forEach(function(item) {
    var next = data.items[(item.i + 1) % N];
    var p1 = polarToCartesian(cx, cy, maxR * item.v / 100, angleStep * item.i);
    var p2 = polarToCartesian(cx, cy, maxR * next.v / 100, angleStep * ((item.i + 1) % N));
    var gid = 'eg_' + category + '_' + item.i;
    svgContent +=
      '<defs><linearGradient id="' + gid + '" x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" gradientUnits="userSpaceOnUse">' +
        '<stop offset="0%" stop-color="' + item.c + '"/>' +
        '<stop offset="100%" stop-color="' + next.c + '"/>' +
      '</linearGradient></defs>';
    // Glow edge
    svgContent += '<line x1="' + p1.x + '" y1="' + p1.y + '" ' +
      'x2="' + p2.x + '" y2="' + p2.y + '" ' +
      'stroke="url(#' + gid + ')" stroke-width="2.5" stroke-linecap="round" opacity="0.9" ' +
      'filter="url(#radarGlow)"/>';
    // Brighter inner edge
    svgContent += '<line x1="' + p1.x + '" y1="' + p1.y + '" ' +
      'x2="' + p2.x + '" y2="' + p2.y + '" ' +
      'stroke="url(#' + gid + ')" stroke-width="1" stroke-linecap="round" opacity="0.6"/>';
  });

  // Vertex dots with glow
  data.items.forEach(function(item) {
    var p = polarToCartesian(cx, cy, maxR * item.v / 100, angleStep * item.i);
    // Outer glow ring
    svgContent += '<circle cx="' + p.x + '" cy="' + p.y + '" r="7" ' +
      'fill="' + item.c + '" opacity="0.15" filter="url(#radarGlowStrong)"/>';
    // Main dot
    svgContent += '<circle cx="' + p.x + '" cy="' + p.y + '" r="4.5" ' +
      'fill="' + item.c + '" stroke="var(--bg)" stroke-width="1.5" filter="url(#radarGlow)"/>';
    // Inner highlight
    svgContent += '<circle cx="' + p.x + '" cy="' + p.y + '" r="1.5" ' +
      'fill="rgba(255,255,255,0.6)"/>';
  });

  // Labels — glass chip with name stacked above value
  data.items.forEach(function(item) {
    var labelR = maxR + 26;
    var p = polarToCartesian(cx, cy, labelR, angleStep * item.i);

    // Determine text-anchor based on quadrant
    var anchor = 'middle';
    if (p.x > cx + 3) anchor = 'start';
    else if (p.x < cx - 3) anchor = 'end';

    // Glass pill — fixed width, auto height
    var tw = 52, th = 32;
    var tx = p.x - tw/2, ty = p.y - th/2;
    // Clamp
    if (tx < 4) tx = 4;
    if (tx + tw > 296) tx = 296 - tw;
    if (ty < 4) ty = 4;
    if (ty + th > 296) ty = 296 - th;

    // Background glass pill
    svgContent += '<rect x="' + tx + '" y="' + ty + '" ' +
      'width="' + tw + '" height="' + th + '" rx="8" ry="8" ' +
      'fill="' + item.c + '" opacity="0.1" ' +
      'stroke="' + item.c + '" stroke-width="0.6" opacity="0.25"/>';

    // Name text
    svgContent += '<text x="' + (tx + tw/2) + '" y="' + (ty + 14) + '" ' +
      'fill="rgba(255,255,255,0.8)" font-size="8" font-weight="500" text-anchor="middle">' + item.n + '</text>';

    // Value text — smaller, below the name
    svgContent += '<text x="' + (tx + tw/2) + '" y="' + (ty + 25) + '" ' +
      'fill="' + item.c + '" font-size="10" font-weight="700" text-anchor="middle">' + item.v + '</text>';
  });

  // Center value
  var avg = Math.round(data.items.reduce(function(s, it) { return s + it.v; }, 0) / N);
  svgContent += '<circle cx="' + cx + '" cy="' + cy + '" r="18" ' +
    'fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>';
  svgContent += '<text x="' + cx + '" y="' + (cy - 2) + '" ' +
    'fill="rgba(255,255,255,0.5)" font-size="7" text-anchor="middle" font-weight="400">среднее</text>';
  svgContent += '<text x="' + cx + '" y="' + (cy + 11) + '" ' +
    'fill="var(--text)" font-size="14" text-anchor="middle" font-weight="700">' + avg + '</text>';

  var html = svgContent;

  // Update SVG
  document.getElementById('radarSvg').innerHTML = html;

  // Update labels below
  document.getElementById('radarStrong').textContent = data.strong;
  document.getElementById('radarGrowth').textContent = data.growth;
  document.getElementById('radarStrongIcon').textContent = data.strongIcon;
  document.getElementById('radarGrowthIcon').textContent = data.growthIcon;
}

function switchRadar(val) {
  // Update active select
  var sel = document.querySelector('.radar-select');
  if (sel) sel.value = val;
  renderRadar(val);
}

// ===== Post Card Toggle (compact / expanded) =====
function togglePost(el) {
  var card = el.closest('.post-card');
  if (!card) return;
  card.classList.toggle('is-compact');
  card.classList.toggle('is-expanded');
  el.blur();
}

// ===== Instagram‑style Carousel =====
function carouselPrev(el) {
  var car = el.closest('.carousel');
  var cur = parseInt(car.getAttribute('data-current') || '0');
  var slides = car.querySelectorAll('.carousel-slide');
  var max = slides.length - 1;
  var next = cur <= 0 ? max : cur - 1;
  carouselSet(car, next);
}
function carouselNext(el) {
  var car = el.closest('.carousel');
  var cur = parseInt(car.getAttribute('data-current') || '0');
  var slides = car.querySelectorAll('.carousel-slide');
  var max = slides.length - 1;
  var next = cur >= max ? 0 : cur + 1;
  carouselSet(car, next);
}
function carouselGo(el, idx) {
  var car = el.closest('.carousel');
  carouselSet(car, idx);
}
function carouselSet(car, idx) {
  var slides = car.querySelectorAll('.carousel-slide');
  if (idx < 0) idx = 0;
  if (idx >= slides.length) idx = slides.length - 1;
  var track = car.querySelector('.carousel-track');
  track.style.transform = 'translateX(-' + (idx * 100) + '%)';
  car.setAttribute('data-current', idx);
  // update dots
  var dots = car.querySelectorAll('.carousel-dot');
  dots.forEach(function(d, i) {
    d.classList.toggle('active', i === idx);
  });
}

// Auto-init on page load
document.addEventListener('DOMContentLoaded', function() {
  renderRadar('style');
});

// ===== Feed filter =====
function switchFeed(val) {
  var tag = document.querySelector('.sub-feed');
  if (!tag) return;

  if (val === 'subs') {
    tag.classList.remove('feed-show-recommended');
    tag.classList.add('feed-show-subs');
  } else {
    tag.classList.remove('feed-show-subs');
    tag.classList.add('feed-show-recommended');
  }
}
