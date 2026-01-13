/* ============================================
   CONVERSIÓN AUTOMÁTICA DE TABLAS A CARDS MÓVILES
   NO requiere modificar el HTML de ninguna página
   Usa el detector mobile-auto.js existente
   ============================================ */

(function() {
    'use strict';

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Detectar si es móvil (usa tu código existente)
        const isMobile = checkIfMobile();
        
        if (isMobile) {
            convertAllTablesToCards();
        }
        
        // Reconvertir en cambio de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (checkIfMobile()) {
                    convertAllTablesToCards();
                }
            }, 200);
        });
        
        // Observar nuevas tablas que se agreguen dinámicamente
        observeNewTables();
    }

    // Función para detectar móvil (compatible con tu código existente)
    function checkIfMobile() {
        // Método 1: Por tamaño de pantalla
        if (window.innerWidth <= 768) {
            return true;
        }
        
        // Método 2: Por User Agent
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
        
        return mobileRegex.test(userAgent.toLowerCase());
    }

    // Convertir todas las tablas a cards
    function convertAllTablesToCards() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            // Evitar procesar la misma tabla múltiples veces
            if (table.dataset.mobileProcessed === 'true') {
                return;
            }
            
            // Ocultar tabla original
            if (table.parentElement.classList.contains('table-container')) {
                table.parentElement.style.display = 'none';
            } else {
                table.style.display = 'none';
            }
            
            // Crear cards
            createMobileCards(table);
            
            table.dataset.mobileProcessed = 'true';
        });
    }

    // Crear cards móviles desde una tabla
    function createMobileCards(table) {
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        
        if (!thead || !tbody) return;
        
        // Crear contenedor de cards
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'mobile-cards';
        cardsContainer.style.display = 'block';
        
        // Obtener encabezados
        const headers = Array.from(thead.querySelectorAll('th')).map(th => 
            th.textContent.trim()
        );
        
        // Obtener todas las filas
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Crear un card por cada fila
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length === 0) return;
            
            const card = createCard(headers, cells, row);
            cardsContainer.appendChild(card);
        });
        
        // Insertar después de la tabla
        if (table.parentElement.classList.contains('table-container')) {
            table.parentElement.parentElement.insertBefore(cardsContainer, table.parentElement.nextSibling);
        } else {
            table.parentElement.insertBefore(cardsContainer, table.nextSibling);
        }
    }

    // Crear un card individual
    function createCard(headers, cells, originalRow) {
        const card = document.createElement('div');
        card.className = 'mobile-card';
        
        // Copiar data attributes de la fila original
        Array.from(originalRow.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                card.setAttribute(attr.name, attr.value);
            }
        });
        
        // HEADER: Primera celda (generalmente nombre/título)
        const headerDiv = document.createElement('div');
        headerDiv.className = 'mobile-card-header';
        headerDiv.innerHTML = `
            <div class="mobile-card-title">${cells[0]?.innerHTML || ''}</div>
        `;
        card.appendChild(headerDiv);
        
        // BODY: Resto de celdas (excepto la última si tiene botones)
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'mobile-card-body';
        
        const lastCellIndex = cells.length - 1;
        const hasActions = lastCellIndex > 0 && cellHasButtons(cells[lastCellIndex]);
        const endIndex = hasActions ? lastCellIndex : cells.length;
        
        for (let i = 1; i < endIndex; i++) {
            const cell = cells[i];
            const header = headers[i];
            
            if (!cell || !header) continue;
            
            const row = document.createElement('div');
            row.className = 'mobile-card-row';
            row.innerHTML = `
                <span class="mobile-card-label">${header}:</span>
                <span class="mobile-card-value">${cell.innerHTML}</span>
            `;
            bodyDiv.appendChild(row);
        }
        
        card.appendChild(bodyDiv);
        
        // ACTIONS: Si la última celda tiene botones
        if (hasActions) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'mobile-card-actions';
            actionsDiv.innerHTML = cells[lastCellIndex].innerHTML;
            
            // Hacer que los botones sean más touch-friendly
            const buttons = actionsDiv.querySelectorAll('button, a.btn, .btn');
            buttons.forEach(btn => {
                if (!btn.classList.contains('btn-sm')) {
                    btn.classList.add('btn-sm');
                }
            });
            
            card.appendChild(actionsDiv);
        }
        
        // Copiar eventos onclick si existen
        if (originalRow.onclick) {
            card.onclick = originalRow.onclick;
            card.style.cursor = 'pointer';
        }
        
        return card;
    }

    // Detectar si una celda tiene botones
    function cellHasButtons(cell) {
        if (!cell) return false;
        const buttons = cell.querySelectorAll('button, a.btn, .btn, [onclick]');
        return buttons.length > 0;
    }

    // Observar nuevas tablas agregadas dinámicamente
    function observeNewTables() {
        const observer = new MutationObserver(mutations => {
            if (!checkIfMobile()) return;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Buscar tablas en el nodo agregado
                        const tables = node.tagName === 'TABLE' 
                            ? [node] 
                            : node.querySelectorAll('table');
                        
                        tables.forEach(table => {
                            if (table.dataset.mobileProcessed !== 'true') {
                                if (table.parentElement.classList.contains('table-container')) {
                                    table.parentElement.style.display = 'none';
                                } else {
                                    table.style.display = 'none';
                                }
                                createMobileCards(table);
                                table.dataset.mobileProcessed = 'true';
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();

console.log('✅ Sistema de tablas móviles automático cargado');
