function toggleTheme() { document.body.classList.toggle('light-mode'); }

function lerFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.getElementById('cv-foto-img');
            img.src = e.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addBloco(listaId, comDesc, tagLabel, comDataFim) {
    const lista = document.getElementById(listaId);
    const div = document.createElement('div');
    div.className = 'bloco-entrada'; 
    div.innerHTML = `
        <button class="btn-remover" onclick="this.parentElement.remove(); atualizar()">X</button>
        <label>${listaId === 'lista-cur' ? 'Instituição' : 'Empresa / Instituição'}</label><input type="text" class="in-emp" oninput="atualizar()">
        <label>${listaId === 'lista-cur' ? 'Nome do Curso' : 'Cargo / Curso'}</label><input type="text" class="in-sub" oninput="atualizar()">
        <div class="grid-2">
            <div><label>${comDataFim ? 'Início' : 'Data de Conclusão'}</label><input type="text" class="in-inicio" oninput="atualizar()"></div>
            ${comDataFim ? '<div><label>Fim</label><input type="text" class="in-fim" oninput="atualizar()"></div>' : ''}
        </div>
        ${comDesc ? '<label>Descrição / Resumo</label><textarea class="in-desc" oninput="atualizar()"></textarea>' : ''}
        <label>${tagLabel}</label>
        <div class="tags-input-container">
            <div class="wrap-pills" style="display:flex; flex-wrap:wrap; gap:5px"></div>
            <input type="text" class="pill-input" placeholder="Aperte Enter..." onkeyup="processPill(event, this)">
        </div>
    `;
    lista.appendChild(div);
}

function processPill(e, input) {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
            const tag = document.createElement('span');
            tag.className = 'tag-chip';
            tag.innerHTML = `${val} <i class="fas fa-times" onclick="this.parentElement.remove(); atualizar()"></i>`;
            input.parentElement.querySelector('.wrap-pills').appendChild(tag);
            input.value = '';
            atualizar();
        }
    }
}

function processSimpleTag(e, input, wrapId) {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
            const tag = document.createElement('span');
            tag.className = 'tag-chip';
            tag.innerHTML = `${val} <i class="fas fa-times" onclick="this.parentElement.remove(); atualizar()"></i>`;
            document.getElementById(wrapId).appendChild(tag);
            input.value = '';
            atualizar();
        }
    }
}

function atualizar() {
    document.getElementById('cv-nome').innerText = document.getElementById('campo-nome').value || "SEU NOME";
    document.getElementById('cv-bio').innerText = document.getElementById('bio').value;

    const conts = [
        { v: document.getElementById('campo-tel').value, i: 'fa-phone' },
        { v: document.getElementById('campo-email').value, i: 'fa-envelope' },
        { v: document.getElementById('campo-endereco').value, i: 'fa-home' },
        { v: document.getElementById('campo-cidade').value, i: 'fa-map-marker-alt' },
        { v: document.getElementById('campo-link').value, i: 'fa-linkedin', fab: true },
        { v: document.getElementById('campo-github').value, i: 'fa-github', fab: true }
    ];
    document.getElementById('cv-contatos').innerHTML = conts.filter(c => c.v).map(c => 
        `<span><i class="${c.fab ? 'fab' : 'fas'} ${c.i}"></i> ${c.v}</span>`
    ).join('');

    renderSecao('lista-exp', 'cv-lista-exp', 'sec-exp', 'Tecnologias:');
    renderSecao('lista-edu', 'cv-lista-edu', 'sec-edu', 'Destaques Acadêmicos:');
    renderSecao('lista-cur', 'cv-lista-cur', 'sec-cur', 'Competências Aprendidas:');
    renderSkills('wrap-hard', 'cv-hard-tags', 'sec-hard');
    renderSkills('wrap-soft', 'cv-soft-tags', 'sec-soft');
}

function renderSecao(origem, destino, container, labelText) {
    const blocos = document.querySelectorAll(`#${origem} .bloco-entrada`);
    const area = document.getElementById(destino);
    area.innerHTML = "";
    document.getElementById(container).style.display = blocos.length ? 'block' : 'none';

    blocos.forEach(b => {
        const p = b.querySelector('.in-emp').value;
        const s = b.querySelector('.in-sub').value;
        const i = b.querySelector('.in-inicio').value;
        const inputFim = b.querySelector('.in-fim');
        const f = inputFim ? inputFim.value : "";
        const d = b.querySelector('.in-desc')?.value || "";
        const pills = Array.from(b.querySelectorAll('.tag-chip')).map(t => t.innerText.trim());
        const pillsHtml = pills.map(pill => `<span class="cv-pill">${pill}</span>`).join('');

        const dataTexto = f ? `${i} — ${f}` : i;

        if (p) {
            area.innerHTML += `
                <div class="cv-item">
                    <div class="cv-item-header">
                        <span class="cv-item-titulo">${p.toUpperCase()}</span>
                        <span class="cv-item-data">${dataTexto}</span>
                    </div>
                    <div class="cv-item-sub">${s}</div>
                    ${d ? `<div class="cv-desc">${d}</div>` : ''}
                    ${pills.length ? `<span class="cv-comp-label">${labelText}</span><div class="cv-pills-container">${pillsHtml}</div>` : ''}
                </div>`;
        }
    });
}

function renderSkills(origemWrap, destinoArea, container) {
    const tags = document.querySelectorAll(`#${origemWrap} .tag-chip`);
    const area = document.getElementById(destinoArea);
    area.innerHTML = "";
    document.getElementById(container).style.display = tags.length ? 'block' : 'none';
    tags.forEach(t => { area.innerHTML += `<span class="skill-tag">${t.innerText.trim()}</span>`; });
}