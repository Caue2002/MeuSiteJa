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

/*   BANNER — carrossel automático + setas manuais + bolinhas */
const slides     = document.querySelectorAll('.banner-slide');
const dots       = document.querySelectorAll('.banner-dot');
const setaEsq    = document.getElementById('bannerSetaEsq');
const setaDir    = document.getElementById('bannerSetaDir');
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

/*  POP-UPS GENÉRICOS (whatsapp, FAQ, política) */
function abrirModal(id){ document.getElementById(id).classList.remove('oculto'); }
function fecharModal(id){ document.getElementById(id).classList.add('oculto'); }

/*  POP-UP DE POLÍTICA — libera o site após aceite */
const checkPolitica = document.getElementById('checkPolitica');
const btnAceitar    = document.getElementById('btnAceitarPolitica');
const modalPolitica = document.getElementById('modalPolitica');

checkPolitica.addEventListener('change', () => {
  btnAceitar.disabled = !checkPolitica.checked;
});
btnAceitar.addEventListener('click', () => {
  modalPolitica.classList.add('oculto');
  document.body.style.overflow = 'auto';
});
document.body.style.overflow = 'hidden';

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
