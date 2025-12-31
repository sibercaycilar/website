document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (sunIcon && moonIcon) {
        sunIcon.style.opacity = '0';
        sunIcon.style.transform = 'scale(0)';
        moonIcon.style.opacity = '1';
        moonIcon.style.transform = 'scale(1)';
      }
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'dark' } }));
    } else {
      body.classList.remove('dark-mode');
      if (sunIcon && moonIcon) {
        sunIcon.style.opacity = '1';
        sunIcon.style.transform = 'scale(1)';
        moonIcon.style.opacity = '0';
        moonIcon.style.transform = 'scale(0)';
      }
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
    }
  }

  function toggleThemeAndAnimate() {
    if (!themeToggleBtn || themeToggleBtn.classList.contains('is-rotating')) return;
    themeToggleBtn.classList.add('is-rotating');
    const isDarkMode = body.classList.contains('dark-mode');
    setTimeout(() => {
      if (isDarkMode) {
        body.classList.remove('dark-mode');
        if (sunIcon && moonIcon) {
          sunIcon.style.opacity = '1';
          sunIcon.style.transform = 'scale(1)';
          moonIcon.style.opacity = '0';
          moonIcon.style.transform = 'scale(0)';
        }
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
      } else {
        body.classList.add('dark-mode');
        if (sunIcon && moonIcon) {
          sunIcon.style.opacity = '0';
          sunIcon.style.transform = 'scale(0)';
          moonIcon.style.opacity = '1';
          moonIcon.style.transform = 'scale(1)';
        }
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'dark' } }));
      }
    }, 200);
    setTimeout(() => {
      themeToggleBtn.classList.remove('is-rotating');
    }, 400);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    applyTheme(e.matches ? 'dark' : 'light');
  });

  applyTheme(getSystemTheme());
  localStorage.removeItem('themePreference');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleThemeAndAnimate);
  }
});