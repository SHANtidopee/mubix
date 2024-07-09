const toggleDarkMode = () => {
    const toggle = document.getElementById('toggleDark');
    const article = document.querySelector('article');
  
    toggle.addEventListener('click', function() {
      this.classList.toggle('bi-moon');
      if (this.classList.toggle('bi-brightness-high-fill')) {
        article.style.background = '#576CBC';
        article.style.color = 'black';
        article.style.transition = '2s';
      } else {
        article.style.background = '#1a1820';
        article.style.color = 'azure';
        article.style.transition = '2s';
      }
    });
  };

toggleDarkMode();