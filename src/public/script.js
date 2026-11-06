const API_URL = '/transacoes';

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDashboard();

    const form = document.getElementById('transacaoForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaTransacao = {
            descricao: document.getElementById('descricao').value,
            valor: parseFloat(document.getElementById('valor').value),
            tipo: document.getElementById('tipo').value,
            categoria: document.getElementById('categoria').value,
            // Se o checkbox estiver marcado, é consumo consciente (true). Se não, é impulso (false).
            consumoConsciente: document.getElementById('consumoConsciente').checked
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaTransacao)
            });

            if (response.ok) {
                form.reset();
                carregarDadosDashboard();
            } else {
                alert('Erro ao registar transação.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
        }
    });
});

async function carregarDadosDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Atualizar Métricas (o front-end apenas consome o que vem pronto do back-end)
        document.getElementById('saldoTotal').textContent = `R$ ${data.metricas.saldoTotal.toFixed(2)}`;
        document.getElementById('totalDespesas').textContent = `R$ ${data.metricas.totalDespesas.toFixed(2)}`;
        document.getElementById('totalGastoImpulso').textContent = `R$ ${data.metricas.totalGastoImpulso.toFixed(2)}`;

        // Renderizar Extrato / Histórico
        const listaEl = document.getElementById('historicoLista');
        listaEl.innerHTML = '';

        if (data.historico.length === 0) {
            listaEl.innerHTML = '<p style="text-align:center; color:#888; font-size:0.85rem;">Nenhuma transação registada.</p>';
            return;
        }

        data.historico.reverse().forEach(t => {
            const item = document.createElement('div');
            item.className = 'transacao-item';
            
            const sinal = t.tipo === 'receita' ? '+' : '-';
            const classeValor = t.tipo;

            item.innerHTML = `
                <div class="transacao-info">
                    <strong>${t.descricao}</strong>
                    <span>${t.categoria} ${t.consumoConsciente ? '🌿 (Consciente)' : '⚡ (Impulso)'}</span>
                </div>
                <div class="transacao-valor ${classeValor}">
                    ${sinal} R$ ${t.valor.toFixed(2)}
                </div>
            `;
            listaEl.appendChild(item);
        });

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}