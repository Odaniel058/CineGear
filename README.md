# 💰 Vault — Finanças Pessoais

App de controle financeiro pessoal moderno, com dark mode, gráficos e design premium.

## ✨ Funcionalidades

| Seção | Descrição |
|---|---|
| **Dashboard** | KPIs do mês, gráfico por categoria, evolução diária, transações recentes |
| **Gastos** | Cadastro com categoria, filtros por mês e categoria, exclusão |
| **Contas** | Controle de vencimentos, status (pendente/paga/vencida), recorrência |
| **Relatórios** | Gráfico de pizza, tendência mensal (linha), distribuição diária |

## 🎨 Design

- **Tema escuro/claro** com alternância instantânea
- Paleta verde-menta + dourado sobre fundo profundo
- Tipografia: Playfair Display (títulos) + Outfit (corpo)
- Animações suaves de entrada e transição
- Totalmente responsivo para celular

## 🛠 Tecnologias

- HTML5 + CSS3 + JavaScript puro (zero dependências de framework)
- [Chart.js 4.4](https://www.chartjs.org/) para gráficos
- [Font Awesome 6](https://fontawesome.com/) para ícones
- `localStorage` para persistência de dados

## 🚀 Como usar

### Localmente
Basta abrir o `index.html` no navegador. Funciona sem servidor.

### GitHub Pages
1. Suba os 3 arquivos (`index.html`, `style.css`, `app.js`) em um repositório
2. Vá em **Settings → Pages**
3. Source: `Deploy from branch` → `main` → `/ (root)`
4. Aguarde 1-2 minutos e acesse o link gerado

## 📁 Estrutura

```
vault/
├── index.html   → Estrutura da página e modais
├── style.css    → Design, tema claro/escuro, responsividade
├── app.js       → Lógica completa, gráficos, localStorage
└── README.md    → Este arquivo
```

## ⌨️ Atalhos

- `Esc` — Fechar modal aberto

## 💡 Customização

Para ajustar a **meta mensal** (usada na barra de progresso do KPI principal), edite em `app.js`:
```js
const meta = 3000; // Altere para sua meta em reais
```
