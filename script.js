document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('pigment-grid');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let data = [];
    let currentSearchTerm = '';

    // Ladda data från JSON (händer lokalt)
    fetch('./pigments.json')
        .then(res => res.json())
        .then(pigmentData => {
            data = pigmentData;
            renderGrid(data); // Initial laddning
        })
        .catch(err => console.error("Error loading JSON:", err));

    // Sökevents (real-time)
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        currentSearchTerm = term;
        
        if (!term) {
            renderGrid(data);
        } else {
            const filtered = data.filter(p => 
                (p.englishName || p.vanligtNamn).toLowerCase().includes(term) ||
                (p.pigmentKod && p.pigmentKod.toLowerCase().includes(term)) || // SÖKER PÅ KOD HÄR!
                (p.kemiskFormel || '').toLowerCase().includes(term) ||
                (p.beskrivning || '').toLowerCase().includes(term)
            );
            renderGrid(filtered);
        }
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderGrid(data); // Återställ till allt
    });

    // Filterhändelser (Knappar)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Uppdatera UI knappar
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;
            
            // Leta efter vilken grupp filtrering är i (Familj vs Egenskap)
            if(btn.parentElement.closest('.filter-group-title').textContent === "Color Family") {
                filterByFamily(category);
            } else if (btn.parentElement.closest('.filter-group-title').textContent === "Properties") {
                filterByTransparency(category);
            } else if (btn.parentElement.closest('.filter-group-title').textContent === "Lightfastness") {
                filterByLightfastness(category);
            }
        });
    });

    // Rendere funktionen
    function renderGrid(list) {
        grid.innerHTML = '';
        
        if (list.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:2rem;">Inga pigment hittade.</div>';
            return;
        }

        list.forEach(p => {
            // Hämta färgkod för bolus om hexFarg finns, annars grått
            const hex = p.hexFarg || '#cccccc'; 
            
            const card = document.createElement('article');
            card.className = 'pigment-card';
            
            // Bygg HTML med färger och kategorier
            card.innerHTML = `
                <div class="color-swatch" style="background-color: ${hex}; width:100%; height:80px; border-radius:4px; margin-bottom:1rem;"></div>
                
                <div class="pigment-title">${p.englishName || p.vanligtNamn}</div>
                <div class="pigment-code">CODE: ${p.pigmentKod || 'N/A'}</div>

                <div style="margin-bottom:1rem;">
                    ${getTag(p.fargFamilj, 'Color Family')}
                    ${getTag(p.transparens, 'Transparency')}
                    ${getTag(p.ljusäkthet, 'Lightfastness', '')}
                </div>

                <div class="pigment-desc">${p.beskrivning || ''}</div>
            `;
            
            grid.appendChild(card);
        });
    }

    // Hjälpfunktion för taggar (färgkodade bänkar)
    function getTag(value, type, className = '') {
        if (!value) return '';
        let cssClass = 'meta-tag';
        if (type === 'Color Family') cssClass += ' tag-fam';
        else if (type.includes('Opaque')) cssClass += ' tag-opaque';
        else if (type.includes('Transparent')) cssClass += ' tag-transparent';
        else if (type.includes('Lightfastness-I')) cssClass += ' tag-light-i';
        else if (type.includes('Lightfastness-II')) cssClass += ' tag-light-ii';

        return `<span class="${cssClass}">${value}</span>`;
    }
});
