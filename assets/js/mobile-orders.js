(function () {
  var assetBase = 'bairu_pic_new/';

  var categories = [
    { id: 'hot', label: '爆款单', icon: '爆款.jpg' },
    { id: 'guarantee', label: '保底/陪玩单', icon: '保底.jpg' },
    { id: 'red', label: '出红单', icon: '赌红单1.jpg' },
    { id: 'special', label: '特殊物品单', icon: '特殊物品带出-aw子弹.jpg' },
    { id: 'space', label: '航天单', icon: '航天专属.jpg' },
    { id: 'baks', label: '巴克单', icon: '巴克专属.jpg' }
  ];

  var orders = [
    item('hot-pack', '爆款单', ['爆款.jpg', '爆款2.jpg'], ['hot'], ['爆款', '热门']),

    item('guarantee-play', '保底/陪玩单', ['保底.jpg', '陪玩.jpg'], ['guarantee'], ['保底', '陪玩']),

    item('red-n', 'N红保底', ['赌红单1.jpg'], ['red'], ['出红', '保底']),
    item('red-same-three', '三红相同', ['赌红单2.jpg'], ['red'], ['出红', '同名']),
    item('red-specials', '锅、油、三幻神', ['赌红-锅、油、三幻神.jpg'], ['red'], ['锅', '油', '三幻神']),

    item('special-aw', 'AW子弹', ['特殊物品带出-aw子弹.jpg'], ['special'], ['特殊物品', 'AW', '子弹']),
    item('special-gun', '满改枪', ['特殊物品带出-满改枪.jpg'], ['special'], ['特殊物品', '满改枪']),
    item('special-marriage', '我要结婚了', ['特殊物品带出-我要结婚了.jpg'], ['special'], ['特殊物品', '结婚']),

    item('space-only', '航天专属', ['航天专属.jpg'], ['space'], ['航天', '专属']),
    item('baks-only', '巴克专属', ['巴克专属.jpg'], ['baks'], ['巴克', '专属'])
  ];

  var state = {
    category: 'hot',
    sub: 'all',
    query: ''
  };

  var mainTabs = document.getElementById('mainTabs');
  var subTabs = document.getElementById('subTabs');
  var orderList = document.getElementById('orderList');
  var orderStatus = document.getElementById('orderStatus');
  var search = document.getElementById('orderSearch');
  var viewer = document.getElementById('imageViewer');

  function item(id, name, images, categories, tags) {
    return {
      id: id,
      name: name,
      images: images.map(function (image) { return assetBase + image; }),
      categories: categories,
      tags: tags
    };
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function fuzzyMatch(text, query) {
    var body = normalize(text);
    var q = normalize(query);
    if (!q) return true;
    if (body.indexOf(q) !== -1) return true;

    var index = 0;
    for (var i = 0; i < body.length && index < q.length; i += 1) {
      if (body[i] === q[index]) index += 1;
    }
    return index === q.length;
  }

  function activeCategoryItems() {
    return orders.filter(function (order) {
      return order.categories.indexOf(state.category) !== -1;
    });
  }

  function visibleItems() {
    var pool = state.query ? orders : activeCategoryItems();
    return pool.filter(function (order) {
      var haystack = [order.name].concat(order.tags).concat(order.categories).join(' ');
      return fuzzyMatch(haystack, state.query);
    });
  }

  function renderMainTabs() {
    mainTabs.innerHTML = categories.map(function (cat) {
      return '<button class="mo-tab' + (cat.id === state.category ? ' active' : '') + '" type="button" data-category="' + cat.id + '">' +
        '<img src="' + assetBase + cat.icon + '" alt="">' +
        '<span>' + cat.label + '</span>' +
      '</button>';
    }).join('');
  }

  function renderSubTabs() {
    var items = activeCategoryItems();
    var html = '<button class="mo-subtab' + (state.sub === 'all' ? ' active' : '') + '" type="button" data-sub="all">全部</button>';
    html += items.map(function (order) {
      return '<button class="mo-subtab' + (state.sub === order.id ? ' active' : '') + '" type="button" data-sub="' + order.id + '">' + order.name + '</button>';
    }).join('');
    subTabs.innerHTML = html;
  }

  function renderOrders() {
    var list = visibleItems();
    var currentCategory = categories.find(function (cat) { return cat.id === state.category; });
    orderStatus.textContent = state.query
      ? '搜索结果 · ' + list.length + ' 个'
      : currentCategory.label + ' · ' + list.length + ' 个';

    if (!list.length) {
      orderList.innerHTML = '<div class="mo-empty">没有找到相关单子</div>';
      return;
    }

    orderList.innerHTML = list.map(function (order) {
      var chips = order.tags.slice(0, 3).map(function (tag) { return '<span>' + tag + '</span>'; }).join('');
      var images = order.images.map(function (image, index) {
        var title = order.images.length > 1 ? order.name + ' ' + (index + 1) : order.name;
        return '<button class="mo-img-button" type="button" data-preview="' + image + '" data-title="' + title + '">' +
          '<img src="' + image + '" alt="' + title + '">' +
        '</button>';
      }).join('');

      return '<article class="mo-card' + (order.images.length > 1 ? ' mo-card-multi' : '') + '" data-order-id="' + order.id + '">' +
        '<div class="mo-card-head">' +
          '<h2>' + order.name + '</h2>' +
          '<div class="mo-chipline">' + chips + '</div>' +
        '</div>' +
        images +
      '</article>';
    }).join('');
  }

  function renderAll() {
    renderMainTabs();
    renderSubTabs();
    renderOrders();
  }

  function scrollToOrder(id) {
    function move() {
      var target = id === 'all' ? orderList : document.querySelector('[data-order-id="' + id + '"]');
      if (!target) return;
      var control = document.querySelector('.mo-control');
      var offset = control ? control.getBoundingClientRect().height + 18 : 150;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      if (id === 'all') return;
      target.classList.add('is-target');
      window.setTimeout(function () {
        target.classList.remove('is-target');
      }, 900);
    }

    window.requestAnimationFrame(move);
    window.setTimeout(move, 220);
  }

  function openViewer(src, title) {
    var img = viewer.querySelector('img');
    img.src = src;
    img.alt = title || '单子详情';
    viewer.hidden = false;
    document.body.classList.add('no-scroll');
  }

  function closeViewer() {
    viewer.hidden = true;
    viewer.querySelector('img').src = assetBase + '爆款.jpg';
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('click', function (event) {
    var categoryButton = event.target.closest('[data-category]');
    if (categoryButton) {
      state.category = categoryButton.getAttribute('data-category');
      state.sub = 'all';
      state.query = '';
      search.value = '';
      renderAll();
      scrollToOrder('all');
      return;
    }

    var subButton = event.target.closest('[data-sub]');
    if (subButton) {
      var hadQuery = Boolean(state.query);
      state.sub = subButton.getAttribute('data-sub');
      state.query = '';
      search.value = '';
      renderSubTabs();
      if (hadQuery) renderOrders();
      scrollToOrder(state.sub);
      return;
    }

    var previewButton = event.target.closest('[data-preview]');
    if (previewButton) {
      openViewer(previewButton.getAttribute('data-preview'), previewButton.getAttribute('data-title'));
      return;
    }

    if (event.target.closest('.mo-viewer-close') || event.target === viewer) {
      closeViewer();
    }
  });

  search.addEventListener('input', function () {
    state.query = search.value;
    state.sub = 'all';
    renderSubTabs();
    renderOrders();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !viewer.hidden) closeViewer();
  });

  renderAll();
})();
