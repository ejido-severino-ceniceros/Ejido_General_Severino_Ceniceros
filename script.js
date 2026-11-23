// ==========================================
// 1. MENÚ NAVEGACIÓN Y RESALTADO DE SECCIONES
// ==========================================

function abrirMenu() {
    const menu = document.querySelector('.menu');
    const boton = document.querySelector('.menu-btn');
    if (!menu) return;
    const abierto = menu.classList.toggle('activo');
    boton?.setAttribute('aria-expanded', String(abierto));
    boton?.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
}

const menuPrincipal = document.querySelector(".menu");

function actualizarMenuFijo() {
    if (menuPrincipal) {
        menuPrincipal.classList.toggle("menu-fijo", window.scrollY > 150 && window.innerWidth > 900);
    }
}

window.addEventListener("scroll", actualizarMenuFijo, { passive: true });
window.addEventListener("resize", actualizarMenuFijo, { passive: true });
actualizarMenuFijo();

const enlacesMenu = [...document.querySelectorAll(".menu a[href^='#']")];
const seccionesMenu = enlacesMenu
    .map(enlace => document.querySelector(enlace.getAttribute("href")))
    .filter(Boolean);

function marcarEnlaceActivo(id) {
    enlacesMenu.forEach(enlace => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${id}`);
    });
}

enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", () => {
        marcarEnlaceActivo(enlace.getAttribute("href").slice(1));
        menuPrincipal?.classList.remove("activo");
        document.querySelector(".menu-btn")?.setAttribute("aria-expanded", "false");
        document.querySelector(".menu-btn")?.setAttribute("aria-label", "Abrir menú");
    });
});

const observadorSecciones = new IntersectionObserver((entradas) => {
    const visible = entradas
        .filter(entrada => entrada.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) marcarEnlaceActivo(visible.target.id);
}, { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.2, 0.5] });

seccionesMenu.forEach(seccion => observadorSecciones.observe(seccion));


// Cerrar el menú móvil al tocar fuera de él o presionar Escape.
document.addEventListener('click', (evento) => {
    if (window.innerWidth > 900 || !menuPrincipal?.classList.contains('activo')) return;
    if (evento.target.closest('.menu, .menu-btn')) return;
    menuPrincipal.classList.remove('activo');
    document.querySelector('.menu-btn')?.setAttribute('aria-expanded', 'false');
    document.querySelector('.menu-btn')?.setAttribute('aria-label', 'Abrir menú');
});

// ==========================================
// 2. CARRUSEL HERO PRINCIPAL
// ==========================================

const slides = document.querySelectorAll(".hero-slide");
const mensajes = document.querySelectorAll(".hero-mensaje");
const indicadores = document.querySelectorAll(".indicadores button");
let diapositivaActual = 0;
let temporizadorHero = null;

function mostrarDiapositiva(indice) {
    if (slides.length === 0) return;
    diapositivaActual = (indice + slides.length) % slides.length;
    
    slides.forEach((slide, i) => slide.classList.toggle("activo", i === diapositivaActual));
    mensajes.forEach((mensaje, i) => mensaje.classList.toggle("activo", i === diapositivaActual));
    indicadores.forEach((indicador, i) => indicador.classList.toggle("activo", i === diapositivaActual));
}

function iniciarAutoplayHero() {
    if (temporizadorHero) clearInterval(temporizadorHero);
    temporizadorHero = setInterval(() => mostrarDiapositiva(diapositivaActual + 1), 6500);
}

document.querySelector(".anterior")?.addEventListener("click", () => {
    mostrarDiapositiva(diapositivaActual - 1);
    iniciarAutoplayHero();
});

document.querySelector(".siguiente")?.addEventListener("click", () => {
    mostrarDiapositiva(diapositivaActual + 1);
    iniciarAutoplayHero();
});

indicadores.forEach((indicador, i) => {
    indicador.addEventListener("click", () => {
        mostrarDiapositiva(i);
        iniciarAutoplayHero();
    });
});

iniciarAutoplayHero();


// ==========================================
// 3. CARRUSEL BIBLIOTECA, GALERÍA Y MUSEO DIGITAL
// ==========================================

function moverLibros(direccion) {
    const track = document.getElementById('carruselLibrosTrack');
    const items = document.querySelectorAll('.libro-card');
    if (!track || items.length === 0) return;

    const estiloTrack = window.getComputedStyle(track);
    const gap = parseFloat(estiloTrack.gap) || 20;
    const anchoPaso = items[0].getBoundingClientRect().width + gap;

    const scrollMaximo = Math.max(0, track.scrollWidth - track.clientWidth);
    let nuevoScroll = track.scrollLeft + (direccion * anchoPaso);

    if (nuevoScroll > scrollMaximo + 10 && direccion > 0) {
        nuevoScroll = 0;
    } else if (track.scrollLeft <= 10 && direccion < 0) {
        nuevoScroll = scrollMaximo;
    }

    track.scrollTo({ left: nuevoScroll, behavior: 'smooth' });
}

function moverGaleria(direccion) {
    const track = document.getElementById('carruselGaleriaTrack') || document.querySelector('.galeria-track');
    const items = document.querySelectorAll('.galeria-item');
    if (!track || items.length === 0) return;

    const estiloTrack = window.getComputedStyle(track);
    const gap = parseFloat(estiloTrack.gap) || 20;
    const anchoPaso = items[0].getBoundingClientRect().width + gap;

    const scrollMaximo = Math.max(0, track.scrollWidth - track.clientWidth);
    let nuevoScroll = track.scrollLeft + (direccion * anchoPaso);

    if (nuevoScroll > scrollMaximo + 10 && direccion > 0) {
        nuevoScroll = 0;
    } else if (track.scrollLeft <= 10 && direccion < 0) {
        nuevoScroll = scrollMaximo;
    }

    track.scrollTo({ left: nuevoScroll, behavior: 'smooth' });
}

// FUNCIÓN DE MUSEO DIGITAL CORREGIDA Y EXACTA
function moverMuseo(direccion) {
    const track = document.getElementById('carruselMuseoTrack');
    const items = document.querySelectorAll('.museo-card');
    if (!track || items.length === 0) return;

    const estiloTrack = window.getComputedStyle(track);
    const gap = parseFloat(estiloTrack.gap) || 25;
    const anchoPaso = items[0].getBoundingClientRect().width + gap;

    const scrollMaximo = Math.max(0, track.scrollWidth - track.clientWidth);
    let nuevoScroll = track.scrollLeft + (direccion * anchoPaso);

    // Control de límites fluido sin rebotes raros
    if (nuevoScroll > scrollMaximo) {
        nuevoScroll = scrollMaximo;
    } else if (nuevoScroll < 0) {
        nuevoScroll = 0;
    }

    track.scrollTo({ left: nuevoScroll, behavior: 'smooth' });
}


// Las tarjetas del museo llaman a esta función desde index.html.
// Se conserva el mismo visor utilizado por la galería general.
let ultimoElementoAntesDeModal = null;

function abrirModalImagen(ruta, descripcion = 'Fotografía histórica') {
    const modal = document.getElementById('modalGaleria');
    const imagen = document.getElementById('modalImagen');
    const pie = document.getElementById('modalPieFoto');
    if (!modal || !imagen || !ruta) return;

    ultimoElementoAntesDeModal = document.activeElement;
    resetearZoomModal();
    imagen.src = ruta;
    imagen.alt = descripcion;
    if (pie) pie.textContent = descripcion;
    modal.classList.add('activo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-cerrar')?.focus();
}

// Las tarjetas ya tienen onclick para mouse; esto agrega soporte de teclado.
document.querySelectorAll('.museo-card, .galeria-item, .libro-portada-wrapper').forEach(tarjeta => {
    if (!tarjeta.hasAttribute('tabindex')) tarjeta.setAttribute('tabindex', '0');
    if (!tarjeta.hasAttribute('role')) tarjeta.setAttribute('role', 'button');
    tarjeta.addEventListener('keydown', evento => {
        if (evento.key === 'Enter' || evento.key === ' ') {
            evento.preventDefault();
            tarjeta.click();
        }
    });
});

// ==========================================
// 4. MODAL / LIGHTBOX DE GALERÍA
// ==========================================

let escalaZoom = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

function actualizarTransformacionImagen() {
    const modalImg = document.getElementById('modalImagen') || document.getElementById('modalGaleriaImg');
    const modalCaption = document.getElementById('modalPieFoto') || document.getElementById('modalGaleriaPie');
    if (!modalImg) return;

    if (escalaZoom <= 1) {
        escalaZoom = 1;
        posX = 0;
        posY = 0;
        modalImg.style.cursor = 'zoom-in';
        if (modalCaption) {
            modalCaption.style.opacity = '1';
            modalCaption.style.visibility = 'visible';
        }
    } else {
        modalImg.style.cursor = isDragging ? 'grabbing' : 'grab';
        if (modalCaption) {
            modalCaption.style.opacity = '0';
            modalCaption.style.visibility = 'hidden';
        }
    }

    modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${escalaZoom})`;
    modalImg.style.transition = isDragging ? 'none' : 'transform 0.15s ease-out';
}

function resetearZoomModal() {
    escalaZoom = 1;
    posX = 0;
    posY = 0;
    isDragging = false;
    actualizarTransformacionImagen();
}

function cerrarModalDirecto() {
    const modal = document.getElementById('modalGaleria');
    if (modal) {
        modal.classList.remove('activo');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        resetearZoomModal();
        if (ultimoElementoAntesDeModal?.focus) ultimoElementoAntesDeModal.focus();
    }
}

function cerrarModal(e) {
    if (e.target.id === 'modalGaleria' || e.target.classList.contains('modal-galeria-wrapper')) {
        cerrarModalDirecto();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const itemsGaleria = document.querySelectorAll('.galeria-item');
    const modal = document.getElementById('modalGaleria');
    const modalImg = document.getElementById('modalImagen') || document.getElementById('modalGaleriaImg');
    const modalCaption = document.getElementById('modalPieFoto') || document.getElementById('modalGaleriaPie');

    itemsGaleria.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const titulo = item.querySelector('h4') || item.querySelector('p');
            const etiqueta = item.querySelector('span');

            if (img && modal && modalImg) {
                ultimoElementoAntesDeModal = document.activeElement;
                resetearZoomModal();
                modalImg.src = img.src;
                modalImg.alt = img.alt || 'Imagen de la galería';
                
                if (modalCaption) {
                    let textoPie = "";
                    if (etiqueta) textoPie += `[${etiqueta.innerText.trim()}] `;
                    if (titulo) {
                        let tituloLimpio = titulo.innerText.trim().replace(/\s*\(\d{4}\)/, '');
                        textoPie += tituloLimpio;
                    }
                    modalCaption.innerText = textoPie || img.alt || "";
                }

                modal.classList.add('activo');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                modal.querySelector('.modal-cerrar')?.focus();
            }
        });
    });

    if (modalImg) {
        modalImg.addEventListener('click', (e) => {
            e.stopPropagation();
            if (escalaZoom === 1) {
                escalaZoom = 2.5;
            } else {
                resetearZoomModal();
            }
            actualizarTransformacionImagen();
        });

        modal?.addEventListener('wheel', (e) => {
            if (!modal.classList.contains('activo')) return;
            e.preventDefault();

            const delta = e.deltaY < 0 ? 0.25 : -0.25;
            escalaZoom = Math.min(Math.max(1, escalaZoom + delta), 4);

            if (escalaZoom === 1) {
                resetearZoomModal();
            } else {
                actualizarTransformacionImagen();
            }
        }, { passive: false });

        modalImg.addEventListener('mousedown', (e) => {
            if (escalaZoom <= 1) return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            actualizarTransformacionImagen();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            actualizarTransformacionImagen();
        });

        window.mouseup = window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                actualizarTransformacionImagen();
            }
        });

        modalImg.addEventListener('touchstart', (e) => {
            if (escalaZoom <= 1 || e.touches.length !== 1) return;
            isDragging = true;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        }, { passive: true });

        modalImg.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            actualizarTransformacionImagen();
        }, { passive: true });

        modalImg.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
});


// ==========================================
// 5. VISOR DE PDF Y DESCARGAS
// ==========================================

function abrirVisorPDF(urlPdf, titulo) {
    const modal = document.getElementById('modalVisorPDF') || document.getElementById('modalVisor');
    const iframe = document.getElementById('iframePDF') || document.getElementById('visorIframe');
    const tituloEl = document.getElementById('visorTitulo');

    if (modal && iframe) {
        iframe.src = urlPdf;
        if (tituloEl) tituloEl.textContent = titulo;

        modal.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarVisorPDFDirecto() {
    const modal = document.getElementById('modalVisorPDF') || document.getElementById('modalVisor');
    const iframe = document.getElementById('iframePDF') || document.getElementById('visorIframe');

    if (modal && iframe) {
        modal.classList.remove('activo');
        iframe.src = '';
        document.body.style.overflow = '';
    }
}

function cerrarVisorPDF(event) {
    if (event.target.id === 'modalVisorPDF' || event.target.id === 'modalVisor') {
        cerrarVisorPDFDirecto();
    }
}

function descargarForzado(ruta, nombreArchivo) {
    const enlace = document.createElement('a');
    enlace.href = encodeURI(ruta);
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

// Cierre con la tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModalDirecto();
        cerrarVisorPDFDirecto();
        menuPrincipal?.classList.remove('activo');
        document.querySelector('.menu-btn')?.setAttribute('aria-expanded', 'false');
    }
});


// ==========================================
// 6. CARGAR AVISOS DINÁMICOS DESDE EL PANEL
// ==========================================

async function cargarAvisosPublicos() {
    const contenedor = document.getElementById('contenedorAvisos');
    if (!contenedor) return;

    try {
        const config = window.SUPABASE_CONFIG || {};
        const usaSupabase = Boolean(config.url && config.anonKey);
        let avisos;

        if (usaSupabase) {
            const respuesta = await fetch(
                `${config.url}/rest/v1/${config.table || 'avisos'}?select=*&order=fecha.desc,created_at.desc`,
                { headers: { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` } }
            );
            if (!respuesta.ok) throw new Error(await respuesta.text());
            avisos = (await respuesta.json()).map(aviso => ({
                ...aviso,
                enlaceFacebook: aviso.enlaceFacebook ?? aviso.enlace_facebook ?? ''
            }));
        } else {
            const respuesta = await fetch(
                `https://api.github.com/repos/tologamer1209/ejido-severino-ceniceros/contents/avisos.json?ref=main&t=${Date.now()}`,
                { headers: { Accept: 'application/vnd.github+json' } }
            );
            if (!respuesta.ok) {
                contenedor.innerHTML = "<p>No hay avisos recientes por el momento.</p>";
                return;
            }
            const archivo = await respuesta.json();
            const binario = atob((archivo.content || '').replace(/\s/g, ''));
            const bytes = Uint8Array.from(binario, caracter => caracter.charCodeAt(0));
            avisos = JSON.parse(new TextDecoder('utf-8').decode(bytes));
        }

        if (!Array.isArray(avisos) || avisos.length === 0) {
            contenedor.innerHTML = "<p>No hay avisos publicados todavía.</p>";
            return;
        }

        contenedor.innerHTML = "";

        avisos.forEach(aviso => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'aviso-card';
            const cabecera = document.createElement('div');
            cabecera.className = 'aviso-header';
            const titulo = document.createElement('h3');
            titulo.textContent = `📢 ${aviso.titulo || 'Aviso'}`;
            const fecha = document.createElement('span');
            fecha.className = 'aviso-fecha';
            fecha.textContent = `📅 ${aviso.fecha || ''}`;
            cabecera.append(titulo, fecha);
            const resumen = document.createElement('p');
            resumen.className = 'aviso-resumen';
            resumen.textContent = aviso.resumen || '';
            tarjeta.append(cabecera, resumen);
            if (aviso.enlaceFacebook) {
                try {
                    const url = new URL(aviso.enlaceFacebook, window.location.href);
                    if (['https:', 'http:'].includes(url.protocol)) {
                        const enlace = document.createElement('a');
                        enlace.href = url.href;
                        enlace.target = '_blank';
                        enlace.rel = 'noopener noreferrer';
                        enlace.className = 'btn-facebook';
                        enlace.textContent = '🔵 Ver aviso completo en Facebook';
                        tarjeta.appendChild(enlace);
                    }
                } catch (_) { /* Ignorar enlaces mal formados. */ }
            }
            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar los avisos:", error);
        contenedor.innerHTML = "<p>No hay avisos recientes por el momento.</p>";
    }
}

document.addEventListener('DOMContentLoaded', cargarAvisosPublicos);

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') cargarAvisosPublicos();
});