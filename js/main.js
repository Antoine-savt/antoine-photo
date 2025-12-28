// Gestion de la navigation et des interactions
document.addEventListener('DOMContentLoaded', function() {
  // Navigation sticky avec effet au scroll
  const mainNav = document.querySelector('.main-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Navigation smooth scroll
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navHeight = mainNav.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Modal pour les images de la galerie avec métadonnées
  const photoCards = document.querySelectorAll('.photo-card');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <span class="modal-close">&times;</span>
    <div class="modal-wrapper">
      <div class="modal-image-container">
        <img class="modal-content" src="" alt="">
        <div class="modal-info">
          <h3 class="modal-title"></h3>
          <div class="modal-meta"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalWrapper = modal.querySelector('.modal-wrapper');
  const modalImg = modal.querySelector('.modal-content');
  const modalTitle = modal.querySelector('.modal-title');
  const modalMeta = modal.querySelector('.modal-meta');
  const closeBtn = modal.querySelector('.modal-close');

  photoCards.forEach(card => {
    const img = card.querySelector('.photo-image img');
    
    card.addEventListener('click', function() {
      // Récupérer les données de la photo
      const photoData = card.getAttribute('data-photo');
      let photoInfo = {};
      
      if (photoData) {
        try {
          photoInfo = JSON.parse(photoData);
        } catch (e) {
          console.error('Erreur lors du parsing des données photo:', e);
        }
      }

      // Mettre à jour l'image
      modal.classList.add('active');
      let imageSrc = img.src;
      // Améliorer la qualité de l'image pour le modal
      imageSrc = imageSrc.replace('w=600', 'w=1920').replace('w=800', 'w=1920');
      modalImg.src = imageSrc;
      modalImg.alt = img.alt;
      
      // Mettre à jour le titre
      if (photoInfo.title) {
        modalTitle.textContent = photoInfo.title;
        modalTitle.style.display = 'block';
      } else {
        modalTitle.style.display = 'none';
      }

      // Mettre à jour les métadonnées
      if (photoInfo && Object.keys(photoInfo).length > 0) {
        modalMeta.innerHTML = '';
        
        const metaFields = [
          { key: 'camera', label: 'Appareil' },
          { key: 'lens', label: 'Objectif' },
          { key: 'aperture', label: 'Ouverture' },
          { key: 'iso', label: 'ISO' },
          { key: 'shutter', label: 'Vitesse' },
          { key: 'location', label: 'Lieu' }
        ];

        metaFields.forEach(field => {
          if (photoInfo[field.key]) {
            const metaItem = document.createElement('div');
            metaItem.className = 'modal-meta-item';
            metaItem.innerHTML = `
              <span class="modal-meta-label">${field.label}</span>
              <span class="modal-meta-value">${photoInfo[field.key]}</span>
            `;
            modalMeta.appendChild(metaItem);
          }
        });
        
        modalMeta.style.display = 'grid';
      } else {
        modalMeta.style.display = 'none';
      }
      
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Fermer avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // Gestion du formulaire de contact
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Récupération des données du formulaire
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      // Simulation d'envoi (à remplacer par une vraie API)
      console.log('Données du formulaire:', formData);
      
      // Message de confirmation élégant
      const button = contactForm.querySelector('.btn-primary');
      const originalText = button.innerHTML;
      button.innerHTML = '<span>Message envoyé ✓</span>';
      button.style.background = '#4caf50';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // Animation au scroll avec Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observer les sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });

  // Animation des cartes photo avec délai progressif
  const photoObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const photoCardsForAnimation = document.querySelectorAll('.photo-card');
  photoCardsForAnimation.forEach(card => {
    photoObserver.observe(card);
  });

  // Animation des projets éditoriaux (page projets.html)
  const projectFeatures = document.querySelectorAll('.project-feature');
  if (projectFeatures.length > 0) {
    const projectObserver = new IntersectionObserver(function(entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 200);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    projectFeatures.forEach(feature => {
      projectObserver.observe(feature);
    });
    
    // Ajouter l'interaction de clic pour ouvrir les images en modal
    const projectImages = document.querySelectorAll('.project-image-full');
    projectImages.forEach(imageWrapper => {
      imageWrapper.addEventListener('click', function() {
        const img = imageWrapper.querySelector('img');
        if (img) {
          // Créer ou réutiliser le modal existant
          let modal = document.querySelector('.modal');
          if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
              <span class="modal-close">&times;</span>
              <div class="modal-wrapper">
                <div class="modal-image-container">
                  <img class="modal-content" src="" alt="">
                </div>
              </div>
            `;
            document.body.appendChild(modal);
            
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', function() {
              modal.classList.remove('active');
              document.body.style.overflow = 'auto';
            });
            
            modal.addEventListener('click', function(e) {
              if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
              }
            });
            
            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
              }
            });
          }
          
          const modalImg = modal.querySelector('.modal-content');
          modalImg.src = img.src.replace('w=1920', 'w=2560');
          modalImg.alt = img.alt;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
});

