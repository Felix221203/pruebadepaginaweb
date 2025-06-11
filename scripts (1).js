
        // Lógica para el menú de navegación activo y desplazamiento suave
        document.addEventListener("DOMContentLoaded", function() {
            const navLinks = document.querySelectorAll('nav ul li a');
            const nav = document.getElementById('main-nav'); // Obtener el elemento nav

            // Función para el desplazamiento suave al hacer clic en el menú
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault(); // Evita el comportamiento predeterminado del ancla
                    const targetId = this.getAttribute('href').substring(1); // Obtiene el ID del destino
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        // Calcula la posición de desplazamiento, ajustando por la altura del menú fijo
                        const offsetTop = targetSection.offsetTop - nav.offsetHeight - 20; // 20px extra para un margen

                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });

                        // Actualiza la clase 'active' después del click
                        navLinks.forEach(item => item.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
            });

            // Función para activar el enlace del menú al hacer scroll (más robusta)
            const sections = document.querySelectorAll('article[id]');
            window.addEventListener('scroll', () => {
                let currentActiveId = '';
                const scrollY = window.pageYOffset;
                const navHeight = nav.offsetHeight;

                sections.forEach(section => {
                    // Considera la posición de la sección y la altura del nav pegajoso
                    const sectionTop = section.offsetTop - navHeight - 30; // Ajuste para que se active antes de llegar al top
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollY >= sectionTop && scrollY < sectionBottom) {
                        currentActiveId = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === currentActiveId) {
                        link.classList.add('active');
                    }
                });

                // Si se está en la parte superior de la página, activa el primer enlace
                if (scrollY === 0) {
                    navLinks[0].classList.add('active');
                }
            });
        });

        // Lógica para el formulario de contacto (simulación de envío)
        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío real del formulario
            alert('¡Gracias por tu mensaje! Hemos recibido tu consulta y nos pondremos en contacto contigo pronto.');
            this.reset(); // Limpia el formulario
        });

        // Lógica para el formulario de comentarios (simulación de añadir comentario)
        document.getElementById('comment-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('comment-name').value.trim();
            const commentText = document.getElementById('comment-text').value.trim();
            const commentsList = document.getElementById('comments-list');
            const placeholderComment = commentsList.querySelector('p');

            if (name && commentText) {
                // Elimina el mensaje "Sé el primero en comentar" si existe
                if (placeholderComment && placeholderComment.textContent.includes('Sé el primero')) {
                    commentsList.removeChild(placeholderComment);
                }

                const newComment = document.createElement('div');
                newComment.classList.add('comment');
                newComment.setAttribute('role', 'comment'); // Rol ARIA para accesibilidad
                const now = new Date();
                const dateString = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
                newComment.innerHTML = `<strong>${name}</strong> <span class="comment-date">(${dateString})</span>: ${commentText}`;
                commentsList.prepend(newComment); // Añade el nuevo comentario al principio
                this.reset();
                alert('¡Tu comentario ha sido añadido!');
            } else {
                alert('Por favor, asegúrate de completar tu nombre y el comentario antes de enviar.');
            }
        });

        // Lógica para la encuesta (simulación de resultados persistentes con Local Storage)
        document.getElementById('poll-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedOption = document.querySelector('input[name="tech_poll"]:checked');

            if (selectedOption) {
                // Simulación de votos: carga, actualiza, guarda
                let votes = JSON.parse(localStorage.getItem('pollVotes')) || { IA: 0, IoT: 0, 'RV/RA': 0, Blockchain: 0 };
                votes[selectedOption.value]++;
                localStorage.setItem('pollVotes', JSON.stringify(votes));
                localStorage.setItem('hasVotedPoll', 'true'); // Marca que el usuario ya votó

                updatePollResults();
                document.getElementById('poll-results').style.display = 'block';
                document.getElementById('poll-form').style.display = 'none'; // Oculta el formulario después de votar
                alert(`¡Gracias por tu voto! Has seleccionado: ${selectedOption.value}.`);
            } else {
                alert('Por favor, selecciona una opción antes de votar en la encuesta.');
            }
        });

        function updatePollResults() {
            const votes = JSON.parse(localStorage.getItem('pollVotes')) || { IA: 0, IoT: 0, 'RV/RA': 0, Blockchain: 0 };
            const totalVotes = Object.values(votes).reduce((sum, current) => sum + current, 0);

            for (const tech in votes) {
                const percentage = totalVotes > 0 ? ((votes[tech] / totalVotes) * 100).toFixed(1) : 0;
                const barContainer = document.getElementById(`${tech.toLowerCase().replace('/', '').replace('rv/ra', 'rvra')}-bar`);
                
                if (barContainer) {
                    const percentageSpan = barContainer.querySelector('.poll-percentage');
                    const barElement = barContainer.querySelector('.poll-bar');

                    if (percentageSpan && barElement) {
                        percentageSpan.textContent = `${percentage}%`;
                        barElement.style.width = `${percentage}%`;
                        // Ajusta el color del texto si la barra es muy ancha para contraste
                        if (parseFloat(percentage) > 50) {
                            percentageSpan.style.color = 'white'; // O el color que contraste mejor
                        } else {
                            percentageSpan.style.color = '#333';
                        }
                    }
                }
            }
        }

        // Cargar resultados de la encuesta al cargar la página si el usuario ya votó
        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('hasVotedPoll')) {
                updatePollResults();
                document.getElementById('poll-results').style.display = 'block';
                document.getElementById('poll-form').style.display = 'none';
            }
        });
    