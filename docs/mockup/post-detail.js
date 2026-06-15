// Post Detail page JavaScript

// ===== Tab switching: Photo / Statistics =====
function switchPdTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.pd-tab').forEach(function(t) {
    t.classList.toggle('pd-tab-active', t.dataset.tab === tab);
  });

  // Show/hide carousels
  var photoCar = document.getElementById('pdCarouselPhoto');
  var statsCar = document.getElementById('pdCarouselStats');

  if (tab === 'photo') {
    photoCar.classList.add('active');
    statsCar.classList.remove('active');
  } else {
    photoCar.classList.remove('active');
    statsCar.classList.add('active');
    // Render radar data for this post's tags
    renderRadar('style');
  }
}

// ===== Like toggle with animation =====
document.addEventListener('DOMContentLoaded', function() {
  // Like buttons in post-detail
  document.querySelectorAll('.pd-action-btn.post-action-like').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var wasLiked = this.classList.toggle('liked');
      var svg = this.querySelector('svg');
      if (svg) {
        svg.style.animation = 'none';
        void svg.offsetHeight;
        svg.style.animation = wasLiked ? 'heartBeat .4s ease' : '';
      }
    });
  });

  // Comment submit enable/disable
  var input = document.querySelector('.pd-comment-input');
  var submit = document.querySelector('.pd-comment-submit');
  if (input && submit) {
    input.addEventListener('input', function() {
      submit.disabled = this.value.trim().length === 0;
    });

    submit.addEventListener('click', function() {
      var text = input.value.trim();
      if (!text) return;
      // Add comment to the list
      var comments = document.querySelector('.pd-comments');
      var commentEmpty = document.querySelector('.pd-comment-empty');
      if (commentEmpty) commentEmpty.style.display = 'none';

      var moreBtn = comments.querySelector('.pd-comments-more');
      var newComment = document.createElement('div');
      newComment.className = 'pd-comment';
      newComment.innerHTML = '<span class="pd-comment-author">Вы</span>' +
        '<span class="pd-comment-text">' + escapeHtml(text) + '</span>' +
        '<span class="pd-comment-time text-3">только что</span>';

      if (moreBtn) {
        comments.insertBefore(newComment, moreBtn);
      } else {
        comments.appendChild(newComment);
      }

      input.value = '';
      submit.disabled = true;
    });
  }
});

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
