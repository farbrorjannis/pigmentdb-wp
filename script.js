// Akvarellskiss Pigment Database - JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pigment-container');
    let pigments = [];

    // Load JSON data (you'll replace this with your actual data)
    fetch('./pigments.json')
        .then(response => response.json())
        .then(data => {
            pigments = data;
            renderPigments();
        })
        .catch(error => {
            console.error('Error loading pigment data:', error);
            container.innerHTML = '<p>Loading pigment database...</p>';
        });

    function renderPigments() {
        pigments.forEach(p => {
            const card = document.createElement('article');
            card.className = 'pigment-card';
            card.innerHTML = `
                <h3>${p.englishName || p.vanligtNamn}</h3>
                <div class="pigment-meta">
                    <span><strong>ID:</strong> ${p.pigmentKod}</span>
                    <span><strong>Formula:</strong> ${p.kemiskBeteckning}</span>
                    <span><strong>FAM:</strong> ${p.hexFarg || ''}</span>
                </div>
                <p class="pigment-description">${p.beskrivning || p.ljusäkthetText}</p>
            `;
            container.appendChild(card);
        });
    }
});
