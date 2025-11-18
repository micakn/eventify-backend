// public/js/filtros.js

class FiltrosUtil {
    static aplicarFiltrosTabla(searchInputId, filterSelectId, config = {}) {
        const searchInput = document.getElementById(searchInputId);
        const filterSelect = document.getElementById(filterSelectId);
        
        if (!searchInput || !filterSelect) {
            console.warn('Elementos de filtro no encontrados');
            return;
        }

        const tableRows = document.querySelectorAll('tbody tr');
        const searchColumn = config.searchColumn || 0;
        const filterColumn = config.filterColumn !== undefined ? config.filterColumn : 
                            (filterSelectId.includes('estado') ? 4 : 5);

        function aplicarFiltros() {
            const searchTerm = searchInput.value.toLowerCase();
            const filterValue = filterSelect.value;

            tableRows.forEach(row => {
                const searchText = row.cells[searchColumn].textContent.toLowerCase();
                const filterCell = row.cells[filterColumn];
                const filterText = filterCell ? filterCell.textContent.toLowerCase() : '';
                
                const coincideBusqueda = searchText.includes(searchTerm) || 
                                       (config.searchAdditionalColumns ? 
                                        config.searchAdditionalColumns.some(col => {
                                            const additionalCell = row.cells[col];
                                            return additionalCell ? additionalCell.textContent.toLowerCase().includes(searchTerm) : false;
                                        }) : false);
                
                const coincideFiltro = filterValue === 'all' || 
                                      filterText.includes(filterValue.toLowerCase());

                row.style.display = (coincideBusqueda && coincideFiltro) ? '' : 'none';
            });

            this.mostrarMensajeNoResultados(tableRows);
        }

        searchInput.addEventListener('input', aplicarFiltros.bind(this));
        filterSelect.addEventListener('change', aplicarFiltros.bind(this));
        aplicarFiltros.bind(this)();
    }

    static mostrarMensajeNoResultados(tableRows) {
        const visibleRows = Array.from(tableRows).filter(row => row.style.display !== 'none');
        const noResultsMessage = document.getElementById('noResultsMessage');
        
        if (visibleRows.length === 0) {
            if (!noResultsMessage) {
                this.crearMensajeNoResultados();
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    static crearMensajeNoResultados() {
        const tbody = document.querySelector('tbody');
        const tr = document.createElement('tr');
        tr.id = 'noResultsMessage';
        tr.innerHTML = `
            <td colspan="100%" class="text-center py-4">
                <i class="bi bi-search fs-1 text-muted"></i>
                <h5 class="mt-3 text-muted">No se encontraron resultados</h5>
                <p class="text-muted">Intenta con otros términos de búsqueda o filtros</p>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// Configuración de filtros por módulo: define inputs y columnas a usar para cada vista
const FiltrosConfig = {
    eventos: {
        searchInputId: 'searchInput',
        filterSelectId: 'filterEstado',
        config: {
            searchColumn: 0,
            searchAdditionalColumns: [3],
            filterColumn: 4 // Estado está en la columna 4
        }
    },
    
    clientes: {
        searchInputId: 'searchInput', 
        filterSelectId: 'filterType',
        config: {
            searchColumn: 1,
            searchAdditionalColumns: [2],
            filterColumn: 4 // Tipo está en la columna 4
        }
    }
};

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('filterEstado')) {
        FiltrosUtil.aplicarFiltrosTabla(
            FiltrosConfig.eventos.searchInputId,
            FiltrosConfig.eventos.filterSelectId,
            FiltrosConfig.eventos.config
        );
    }
    
    if (document.getElementById('filterType')) {
        FiltrosUtil.aplicarFiltrosTabla(
            FiltrosConfig.clientes.searchInputId,
            FiltrosConfig.clientes.filterSelectId,
            FiltrosConfig.clientes.config
        );
    }
});

// Soporte para Empleados y Tareas
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('filterRole')) {
        FiltrosUtil.aplicarFiltrosTabla('searchInput', 'filterRole', {
            searchColumn: 1, // Nombre
            searchAdditionalColumns: [3,4], // Área, Email
            filterColumn: 2 // Rol
        });
    }

    if (document.getElementById('filterEstadoTareas')) {
        FiltrosUtil.aplicarFiltrosTabla('searchInput', 'filterEstadoTareas', {
            searchColumn: 1, // Título
            searchAdditionalColumns: [2], // Área
            filterColumn: 3 // Estado
        });
    }
});
