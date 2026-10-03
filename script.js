/*    MeuSiteJá — script.js
   Seções: WhatsApp/E-mail · Menu · Tema · Banner · Pop-ups · Carrinho */

/*  CONFIGURAÇÃO — número e e-mail do desenvolvedor */
const NUMERO_WHATSAPP  = "5511914222424";
const EMAIL_DESENVOLVEDOR = "caueribeiroferreira@gmail.com";

document.getElementById('linkWhatsApp').href =
  `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site MeuSiteJá e gostaria de falar sobre um projeto.')}`;

function abrirEmail(){
  window.location.href =
    `mailto:${EMAIL_DESENVOLVEDOR}?subject=${encodeURIComponent('Contato via MeuSiteJá')}&body=${encodeURIComponent('Olá, gostaria de saber mais sobre os serviços de desenvolvimento de sites.')}`;
}

/*  MENU HAMBÚRGUER — painel lateral full-height*/
const btnHamburger = document.getElementById('btnHamburger');
const menuLateral  = document.getElementById('menuLateral');
const menuOverlay  = document.getElementById('menuOverlay');

btnHamburger.addEventListener('click', () => {
  const aberto = menuLateral.classList.toggle('aberto');
  menuOverlay.classList.toggle('ativo', aberto);
  btnHamburger.classList.toggle('aberto', aberto);
  // trava o scroll da página enquanto o menu está aberto
  document.body.style.overflow = aberto ? 'hidden' : '';
});

function fecharMenu(){
  menuLateral.classList.remove('aberto');
  menuOverlay.classList.remove('ativo');
  btnHamburger.classList.remove('aberto');
  document.body.style.overflow = '';
}

// fecha com Esc
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fecharMenu();
});

/* --- Abrir o menu ao passar o mouse (hover), só em telas com mouse --- */
const suportaHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let timeoutFecharMenu;

function abrirMenuHover(){
  clearTimeout(timeoutFecharMenu);
  menuLateral.classList.add('aberto');
  menuOverlay.classList.add('ativo');
  btnHamburger.classList.add('aberto');
}
function agendarFechamentoMenuHover(){
  clearTimeout(timeoutFecharMenu);
  timeoutFecharMenu = setTimeout(fecharMenu, 250);
}

if(suportaHover){
  btnHamburger.addEventListener('mouseenter', abrirMenuHover);
  btnHamburger.addEventListener('mouseleave', agendarFechamentoMenuHover);
  menuLateral.addEventListener('mouseenter', () => clearTimeout(timeoutFecharMenu));
  menuLateral.addEventListener('mouseleave', agendarFechamentoMenuHover);
}

/*  ALTERNAR TEMA CLARO / ESCURO — salva no localStorage */
const btnTema   = document.getElementById('btnTema');
const iconeTema = document.getElementById('iconeTema');
const SOL = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const LUA = '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>';

function aplicarTema(claro){
  document.body.classList.toggle('light', claro);
  iconeTema.innerHTML = claro ? SOL : LUA;
  localStorage.setItem('meusiteja-tema', claro ? 'claro' : 'escuro');
}
aplicarTema(localStorage.getItem('meusiteja-tema') === 'claro');
btnTema.addEventListener('click', () => {
  aplicarTema(!document.body.classList.contains('light'));
});

/*   BANNER — carrossel automático + setas manuais + bolinhas + swipe em mobile */
const slides     = document.querySelectorAll('.banner-slide');
const dots       = document.querySelectorAll('.banner-dot');
const setaEsq    = document.getElementById('bannerSetaEsq');
const setaDir    = document.getElementById('bannerSetaDir');
const banner     = document.getElementById('banner');
let indiceSlide  = 0;
let intervalo;

// vai para o slide de índice informado e atualiza bolinhas
function irParaSlide(novoIndice){
  slides[indiceSlide].classList.remove('ativo');
  dots[indiceSlide].classList.remove('ativo');
  indiceSlide = (novoIndice + slides.length) % slides.length;
  slides[indiceSlide].classList.add('ativo');
  dots[indiceSlide].classList.add('ativo');
}

// avança automaticamente a cada 5s; reinicia ao usar seta/bolinha
function iniciarIntervalo(){
  clearInterval(intervalo);
  intervalo = setInterval(() => irParaSlide(indiceSlide + 1), 5000);
}
iniciarIntervalo();

// setas
setaDir.addEventListener('click', () => { irParaSlide(indiceSlide + 1); iniciarIntervalo(); });
setaEsq.addEventListener('click', () => { irParaSlide(indiceSlide - 1); iniciarIntervalo(); });

// bolinhas clicáveis
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    irParaSlide(parseInt(dot.dataset.index));
    iniciarIntervalo();
  });
});

// swipe em mobile/tablet (touch)
let touchStartX = 0;
let touchEndX = 0;

banner.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

banner.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}, { passive: true });

function handleSwipe(){
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if(Math.abs(diff) > swipeThreshold){
    if(diff > 0){
      irParaSlide(indiceSlide + 1);
    } else {
      irParaSlide(indiceSlide - 1);
    }
    iniciarIntervalo();
  }
}

/*  POP-UPS GENÉRICOS (whatsapp, FAQ, política) */
function abrirModal(id){ document.getElementById(id).classList.remove('oculto'); }
function fecharModal(id){ document.getElementById(id).classList.add('oculto'); }

/*  POP-UP DE POLÍTICA — libera o site após aceite */
const checkPolitica = document.getElementById('checkPolitica');
const btnAceitar    = document.getElementById('btnAceitarPolitica');
const modalPolitica = document.getElementById('modalPolitica');

// verifica se o usuário já aceitou a política anteriormente
const politicaAceita = localStorage.getItem('meusiteja-politica-aceita');

if(politicaAceita === 'true'){
  // já aceitou antes, remove o modal e libera o scroll
  modalPolitica.classList.add('oculto');
  document.body.style.overflow = 'auto';
} else {
  // primeira vez, bloqueia o scroll e mostra o modal
  document.body.style.overflow = 'hidden';
}

checkPolitica.addEventListener('change', () => {
  btnAceitar.disabled = !checkPolitica.checked;
});
btnAceitar.addEventListener('click', () => {
  // salva que o usuário aceitou
  localStorage.setItem('meusiteja-politica-aceita', 'true');
  modalPolitica.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

/*  BANNER DE COOKIES — popup na parte inferior da tela */
const cookieBanner = document.getElementById('cookieBanner');
const btnAceitarCookies = document.getElementById('btnAceitarCookies');
const btnRejeitarCookies = document.getElementById('btnRejeitarCookies');

// verifica se o usuário já fez uma escolha sobre cookies
const cookieEscolha = localStorage.getItem('meusiteja-cookies-escolha');

if(!cookieEscolha){
  // ainda não fez escolha, mostra o banner após um pequeno delay
  setTimeout(() => {
    cookieBanner.classList.add('visivel');
  }, 1500);
}

btnAceitarCookies.addEventListener('click', () => {
  localStorage.setItem('meusiteja-cookies-escolha', 'aceito');
  cookieBanner.classList.remove('visivel');
});

btnRejeitarCookies.addEventListener('click', () => {
  localStorage.setItem('meusiteja-cookies-escolha', 'rejeitado');
  cookieBanner.classList.remove('visivel');
});

/* POP-UP DE VÍDEO */
const modalVideo      = document.getElementById('modalVideo');
const videoModal      = document.getElementById('videoModal');
const tituloModalVideo= document.getElementById('tituloModalVideo');

function abrirModalVideo(caminhoVideo, titulo){
  tituloModalVideo.textContent = titulo;
  videoModal.src = caminhoVideo;
  modalVideo.classList.remove('oculto');
}
function fecharModalVideo(){
  modalVideo.classList.add('oculto');
  videoModal.pause();
  videoModal.currentTime = 0;
}
modalVideo.addEventListener('click', e => {
  if(e.target === modalVideo) fecharModalVideo();
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && !modalVideo.classList.contains('oculto')) fecharModalVideo();
});
document.querySelectorAll('.servico-video').forEach(card => {
  card.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.click(); }
  });
});

/*  CARRINHO DE COMPRAS */
let itensCarrinho = []; // [{nome, preco}]

const modalCarrinho  = document.getElementById('modalCarrinho');
const carrinhoLista  = document.getElementById('carrinhoLista');
const carrinhoVazio  = document.getElementById('carrinhoVazio');
const carrinhoRodape = document.getElementById('carrinhoRodape');
const badge          = document.getElementById('carrinhoBadge');

// adiciona item ao carrinho (evita duplicatas — substitui pelo mais recente)
function adicionarCarrinho(nome, preco){
  const jaExiste = itensCarrinho.findIndex(i => i.nome === nome);
  if(jaExiste >= 0){
    // já está no carrinho: apenas abre o carrinho para o usuário ver
    abrirCarrinho();
    return;
  }
  itensCarrinho.push({ nome, preco });
  atualizarBadge();
  renderizarCarrinho();
  abrirCarrinho();
}

// remove um item pelo índice
function removerItem(indice){
  itensCarrinho.splice(indice, 1);
  atualizarBadge();
  renderizarCarrinho();
}

// atualiza o número no badge do ícone
function atualizarBadge(){
  const total = itensCarrinho.length;
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

// monta a lista de itens no modal
function renderizarCarrinho(){
  carrinhoLista.innerHTML = '';

  if(itensCarrinho.length === 0){
    carrinhoVazio.style.display  = 'flex';
    carrinhoRodape.style.display = 'none';
    return;
  }

  carrinhoVazio.style.display  = 'none';
  carrinhoRodape.style.display = 'flex';

  itensCarrinho.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'carrinho-item';
    el.innerHTML = `
      <div class="carrinho-item-info">
        <span class="carrinho-item-nome">${item.nome}</span>
        <span class="carrinho-item-preco">a partir de ${item.preco}</span>
      </div>
      <button class="carrinho-item-remover" onclick="removerItem(${i})" aria-label="Remover ${item.nome}">✕</button>
    `;
    carrinhoLista.appendChild(el);
  });
}

function abrirCarrinho(){
  renderizarCarrinho();
  modalCarrinho.classList.remove('oculto');
}

function fecharCarrinho(){
  modalCarrinho.classList.add('oculto');
}

// fecha clicando fora da caixa
modalCarrinho.addEventListener('click', e => {
  if(e.target === modalCarrinho) fecharCarrinho();
});

// botão FINALIZAR — monta mensagem e abre WhatsApp
function finalizarCarrinho(){
  if(itensCarrinho.length === 0) return;

  const lista = itensCarrinho.map(i => `• ${i.nome} (${i.preco})`).join('\n');
  const mensagem =
    `Olá, Cauê! 👋\n\n` +
    `Vim pelo site MeuSiteJá e fiquei interessado(a) nos seguintes modelos:\n\n` +
    `${lista}\n\n` +
    `Poderia me passar mais detalhes sobre prazo, processo de desenvolvimento e como dar início ao projeto? Aguardo seu retorno! 🚀`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank', 'noopener');
}

/*    WIDGET DE CHAT — "Atendente On-line"
   Bot com respostas prontas (sem IA real — funciona 100% no navegador,
   sem precisar de servidor). Termina sempre com a opção de ir pro WhatsApp. */
const chatBolha   = document.getElementById('chatBolha');
const chatPainel  = document.getElementById('chatPainel');
const chatMsgsEl  = document.getElementById('chatMensagens');
const chatChipsEl = document.getElementById('chatRespostasRapidas');

// Lista de perguntas prontas + respostas automáticas.
// Para adicionar uma nova pergunta, é só copiar um bloco { pergunta, resposta } aqui.
const CHAT_PERGUNTAS = [
  {
    pergunta: 'Quanto custa um site?',
    resposta: 'Os valores começam em R$ 500 (Landing Page) e variam conforme o modelo escolhido. Dá uma olhada na seção "Modelos e valores" aqui em cima — ou me conta o que você precisa que te ajudo a decidir 🙂'
  },
  {
    pergunta: 'Quanto tempo demora?',
    resposta: 'O prazo varia com a complexidade do projeto, mas a maioria dos sites fica pronta entre 7 e 20 dias úteis após alinharmos todos os detalhes com você.'
  },
  {
    pergunta: 'Como funciona o processo?',
    resposta: 'É simples: conversamos sobre sua ideia, alinhamos escopo e prazo, você aprova o orçamento, eu desenvolvo o site e entrego com toda a documentação de acesso — do jeitinho que está na nossa política de prestação de serviço.'
  },
  {
    pergunta: 'Tem garantia?',
    resposta: 'Sim! Todo site tem 3 meses de garantia após a entrega, cobrindo erros e falhas de desenvolvimento, conforme prevê o Código de Defesa do Consumidor.'
  },
  {
    pergunta: 'Formas de pagamento',
    resposta: 'O pagamento é feito exclusivamente via Pix, combinado previamente com o desenvolvedor antes do início do projeto.'
  },
  {
    pergunta: 'Preciso de hospedagem e domínio?',
    resposta: 'Hospedagem e domínio não estão inclusos no valor de desenvolvimento, mas te oriento em como contratar e configurar tudo sem dificuldade.'
  },
  {
    pergunta: 'Posso pedir alterações depois de pronto?',
    resposta: 'Sim! Durante os 3 meses de garantia, corrijo qualquer erro do desenvolvimento sem custo. Alterações de conteúdo ou novas funcionalidades fora do combinado entram como serviço adicional.'
  },
  {
    pergunta: 'Atende clientes de outras cidades?',
    resposta: 'Sim, todo o processo é feito remotamente por WhatsApp (e videochamada quando precisar) — não importa a cidade ou o estado onde você está.'
  },
  {
    pergunta: 'O site fica no meu nome?',
    resposta: 'Sim, todos os acessos (hospedagem, domínio, painel do site) ficam em seu nome, e você recebe tudo documentado na entrega.'
  },
  {
    pergunta: 'Como peço um orçamento?',
    resposta: 'É só me chamar no WhatsApp contando sua ideia, ou usar a calculadora de orçamento aqui no site que já te ajudo a definir o melhor modelo 🙂'
  },
  {
    pergunta: 'Não sei qual modelo escolher',
    resposta: 'Sem problemas! Vou fechar o chat e abrir nossa calculadora rápida de orçamento — em 3 perguntinhas eu já te sugiro o modelo ideal 👇',
    acao: () => { fecharChat(); abrirCalculadora(); }
  }
];

let chatPerguntasRestantes = [...CHAT_PERGUNTAS];
let chatIniciado = false;

function adicionarMensagemChat(texto, autor){
  const bolha = document.createElement('div');
  bolha.className = `chat-msg chat-msg-${autor}`;
  bolha.textContent = texto;
  chatMsgsEl.appendChild(bolha);
  chatMsgsEl.scrollTop = chatMsgsEl.scrollHeight;
}

function renderizarChipsChat(){
  chatChipsEl.innerHTML = '';
  chatPerguntasRestantes.forEach((item, indice) => {
    const chip = document.createElement('button');
    chip.className = 'chat-chip';
    chip.textContent = item.pergunta;
    chip.onclick = () => responderChat(indice);
    chatChipsEl.appendChild(chip);
  });
}

function responderChat(indice){
  const item = chatPerguntasRestantes[indice];
  adicionarMensagemChat(item.pergunta, 'usuario');

  // pequeno atraso simulando "o atendente está digitando"
  setTimeout(() => {
    adicionarMensagemChat(item.resposta, 'bot');
    if(item.acao) item.acao();
  }, 500);

  // remove a pergunta já feita da lista de sugestões
  chatPerguntasRestantes = chatPerguntasRestantes.filter((_, i) => i !== indice);
  renderizarChipsChat();
}

function iniciarChat(){
  if(chatIniciado) return;
  chatIniciado = true;
  adicionarMensagemChat('Olá! 👋 Eu sou o assistente virtual do MeuSiteJá. Posso te ajudar com algumas dúvidas rápidas — escolha uma opção abaixo ou fale direto com o desenvolvedor no WhatsApp.', 'bot');
  renderizarChipsChat();
}

function alternarChat(){
  const abrindo = chatPainel.classList.contains('oculto');
  chatPainel.classList.toggle('oculto', !abrindo);
  chatBolha.classList.toggle('aberto', abrindo);
  if(abrindo) iniciarChat();
}

function fecharChat(){
  chatPainel.classList.add('oculto');
  chatBolha.classList.remove('aberto');
}

function finalizarChatWhats(){
  const mensagem = 'Olá! Vim pelo site MeuSiteJá, conversei com o assistente virtual e gostaria de falar com o desenvolvedor sobre um projeto.';
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank', 'noopener');
}

/* POP-UP "VER MAIS MODELOS" */
const modalMaisModelos = document.getElementById('modalMaisModelos');

function abrirMaisModelos(){ modalMaisModelos.classList.remove('oculto'); }
function fecharMaisModelos(){ modalMaisModelos.classList.add('oculto'); }

// fecha clicando fora da caixa
modalMaisModelos.addEventListener('click', e => {
  if(e.target === modalMaisModelos) fecharMaisModelos();
});

/* CALCULADORA DE ORÇAMENTO — wizard de 3 perguntas */
const modalCalculadora = document.getElementById('modalCalculadora');
const calcBtnAdicionar = document.getElementById('calcBtnAdicionar');

// Catálogo com nome/preço/descrição de cada modelo — usado para montar o resultado da calculadora
const CATALOGO_MODELOS = {
  institucional : { nome:'Site Institucional',              preco:'R$ 1.000', desc:'Ideal para apresentar sua empresa, serviços e formas de contato com uma identidade visual profissional.' },
  landing       : { nome:'Landing Page',                    preco:'R$ 500',   desc:'Página única focada em conversão, perfeita para campanhas, lançamentos e captação de leads.' },
  loja          : { nome:'Loja Virtual',                    preco:'R$ 2.800', desc:'E-commerce completo com catálogo de produtos, carrinho e integração de pagamento.' },
  portfolio     : { nome:'Portfólio / Catálogo Digital',    preco:'R$ 700',   desc:'Galeria interativa para freelancers, arquitetos, fotógrafos e prestadores de serviço.' },
  vendas        : { nome:'Página de Vendas / Checkout',     preco:'R$ 1.200', desc:'Alta conversão para infoprodutos, cursos digitais ou lançamentos.' },
  agendamento   : { nome:'Sistema de Agendamento Online',   preco:'R$ 2.200', desc:'Agenda integrada e confirmações automáticas para clínicas, salões e consultórios.' },
  blog          : { nome:'Portal de Notícias / Blog',       preco:'R$ 1.600', desc:'Estrutura otimizada para portais de conteúdo e marketing de atração.' },
  redesign      : { nome:'Redesign de Site Existente',      preco:'R$ 800',   desc:'Modernização visual e otimização de velocidade para quem já possui um site.' },
};

let calcRespostas = {};

function abrirCalculadora(){
  reiniciarCalc();
  modalCalculadora.classList.remove('oculto');
}
function fecharCalculadora(){
  modalCalculadora.classList.add('oculto');
}
modalCalculadora.addEventListener('click', e => {
  if(e.target === modalCalculadora) fecharCalculadora();
});

function irParaPassoCalc(passo){
  document.querySelectorAll('.calc-passo').forEach(el => el.classList.remove('ativo'));
  const elPasso = passo === 'resultado' ? document.getElementById('calcResultado') : document.getElementById('calcPasso' + passo);
  elPasso.classList.add('ativo');

  document.querySelectorAll('.calc-progresso-dot').forEach(dot => {
    const n = parseInt(dot.dataset.passo);
    dot.classList.toggle('ativo', n === passo);
    dot.classList.toggle('concluido', typeof passo === 'number' ? n < passo : true);
  });
}

function responderCalc(passo, valor){
  calcRespostas['p' + passo] = valor;

  if(passo === 1) irParaPassoCalc(2);
  else if(passo === 2) irParaPassoCalc(3);
  else if(passo === 3) mostrarResultadoCalc();
}

function voltarCalc(){
  if(document.getElementById('calcPasso3').classList.contains('ativo')) irParaPassoCalc(2);
  else if(document.getElementById('calcPasso2').classList.contains('ativo')) irParaPassoCalc(1);
}

function reiniciarCalc(){
  calcRespostas = {};
  irParaPassoCalc(1);
}

// motor de sugestão: cruza as 3 respostas e decide o modelo mais indicado
function calcularModeloSugerido(){
  const { p1, p2, p3 } = calcRespostas;

  if(p1 === 'redesign')      return CATALOGO_MODELOS.redesign;
  if(p2 === 'sim')           return CATALOGO_MODELOS.loja;
  if(p1 === 'infoproduto')   return CATALOGO_MODELOS.vendas;
  if(p1 === 'portfolio')     return CATALOGO_MODELOS.portfolio;
  if(p1 === 'clinica')       return CATALOGO_MODELOS.agendamento;
  if(p1 === 'blog')          return CATALOGO_MODELOS.blog;
  // "empresa/prestador de serviço" (padrão): prazo urgente pede algo mais enxuto
  if(p3 === 'urgente')       return CATALOGO_MODELOS.landing;
  return CATALOGO_MODELOS.institucional;
}

function mostrarResultadoCalc(){
  const modelo = calcularModeloSugerido();

  document.getElementById('calcResultadoNome').textContent  = modelo.nome;
  document.getElementById('calcResultadoDesc').textContent  = modelo.desc;
  document.getElementById('calcResultadoPreco').textContent = `a partir de ${modelo.preco}`;

  calcBtnAdicionar.onclick = () => {
    adicionarCarrinho(modelo.nome, modelo.preco);
    fecharCalculadora();
  };

  irParaPassoCalc('resultado');
}
