(function () {
  function fallbackCopy(text, button) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      setCopied(button);
    } catch (err) {
      alert('复制失败，请手动复制：' + text);
    }
    document.body.removeChild(area);
  }

  function setCopied(button) {
    var old = button.textContent;
    button.textContent = '已复制';
    button.classList.add('copied');
    setTimeout(function () {
      button.textContent = old;
      button.classList.remove('copied');
    }, 1200);
  }

  function openPreview(img) {
    var modal = document.createElement('div');
    modal.className = 'image-lightbox';
    modal.innerHTML = '<button type="button" aria-label="关闭">×</button><img src="' + img.src + '" alt="' + (img.alt || '单图预览') + '">';
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');

    function close() {
      modal.remove();
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(event) {
      if (event.key === 'Escape') close();
    }

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.tagName === 'BUTTON') close();
    });
    document.addEventListener('keydown', onKeydown);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-copy]');
    if (button) {
      var text = button.getAttribute('data-copy') || '';
      if (!text) return;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          setCopied(button);
        }).catch(function () {
          fallbackCopy(text, button);
        });
      } else {
        fallbackCopy(text, button);
      }
      return;
    }

    var filterButton = event.target.closest('[data-order-filter]');
    if (filterButton) {
      var filter = filterButton.getAttribute('data-order-filter');
      var tabs = filterButton.closest('.service-tabs') || filterButton.closest('.order-v2-categories');
      var scope = document.querySelector('.order-image-list');
      if (!tabs || !scope) return;
      tabs.querySelectorAll('[data-order-filter]').forEach(function (item) {
        item.classList.toggle('active', item === filterButton);
      });
      scope.querySelectorAll('[data-order-group]').forEach(function (card) {
        var visible = filter === 'all' || card.getAttribute('data-order-group') === filter;
        card.hidden = !visible;
      });
      return;
    }

    var image = event.target.closest('.zoomable-image');
    if (image) openPreview(image);
  });
})();
