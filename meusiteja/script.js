/* =====================================================
   MeuSiteJá — Comportamento da página (menu, tema, banner,
   pop-ups, WhatsApp e e-mail)
   ===================================================== */

/* =====================================================
   NÚMERO DE WHATSAPP E E-MAIL DO DESENVOLVEDOR
   ===================================================== */
const NUMERO_WHATSAPP = "5511914222424";
const EMAIL_DESENVOLVEDOR = "caueribeiroferreira@gmail.com";

// monta o link do WhatsApp já com uma mensagem inicial
document.getElementById('linkWhatsApp').href =
  `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site MeuSiteJá e gostaria de falar sobre um projeto.')}`;

// abre o app de e-mail padrão do usuário com destinatário e assunto preenchidos
function abrirEmail(){
  window.location.href = `mailto:${EMAIL_DESENVOLVEDOR}?subject=${encodeURIComponent('Contato via MeuSiteJá')}&body=${encodeURIComponent('Olá, gostaria de saber mais sobre os serviços de desenvolvimento de sites.')}`;
}

/* =====================================================
   MENU HAMBÚRGUER
   ===================================================== */
const btnHamburger = document.getElementById('btnHamburger');
const menuLateral = document.getElementById('menuLateral');
btnHamburger.addEventListener('click', () => {
  btnHamburger.classList.toggle('aberto');
  menuLateral.classList.toggle('aberto');
});
function fecharMenu(){
  btnHamburger.classList.remove('aberto');
  menuLateral.classList.remove('aberto');
}

/* =====================================================
   ALTERNAR TEMA (claro/escuro) — salva a escolha do usuário
   ===================================================== */
const btnTema = document.getElementById('btnTema');
const iconeTema = document.getElementById('iconeTema');
const SOL = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const LUA = '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>';

function aplicarTema(claro){
  document.body.classList.toggle('light', claro);
  iconeTema.innerHTML = claro ? SOL : LUA;
  localStorage.setItem('meusiteja-tema', claro ? 'claro' : 'escuro');
}
// recupera o tema salvo (padrão: escuro)
aplicarTema(localStorage.getItem('meusiteja-tema') === 'claro');

btnTema.addEventListener('click', () => {
  aplicarTema(!document.body.classList.contains('light'));
});

/* =====================================================
   BANNER — troca automática de slide a cada 3 segundos, em loop
   ===================================================== */
const slides = document.querySelectorAll('.banner-slide');
let indiceSlide = 0;
setInterval(() => {
  slides[indiceSlide].classList.remove('ativo');
  indiceSlide = (indiceSlide + 1) % slides.length;
  slides[indiceSlide].classList.add('ativo');
}, 5000);

/* =====================================================
   POP-UPS genéricos (whatsapp)
   ===================================================== */
function abrirModal(id){ document.getElementById(id).classList.remove('oculto'); }
function fecharModal(id){ document.getElementById(id).classList.add('oculto'); }

/* =====================================================
   POP-UP DE POLÍTICA — só libera o site após "Li e concordo"
   ===================================================== */
const checkPolitica = document.getElementById('checkPolitica');
const btnAceitar = document.getElementById('btnAceitarPolitica');
const modalPolitica = document.getElementById('modalPolitica');

checkPolitica.addEventListener('change', () => {
  btnAceitar.disabled = !checkPolitica.checked;
});
btnAceitar.addEventListener('click', () => {
  modalPolitica.classList.add('oculto');
  document.body.style.overflow = 'auto';
});
// trava o scroll da página enquanto a política não é aceita
document.body.style.overflow = 'hidden';

/* =====================================================
   POP-UP DE VÍDEO — abre ao clicar em um card de "Modelos e valores"
   Fecha no botão "X", clicando fora da caixa, ou com a tecla Esc.
   ===================================================== */
const modalVideo = document.getElementById('modalVideo');
const videoModal = document.getElementById('videoModal');
const tituloModalVideo = document.getElementById('tituloModalVideo');

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

// fecha o pop-up ao clicar fora da caixa do vídeo (na área escura ao redor)
modalVideo.addEventListener('click', (evento) => {
  if (evento.target === modalVideo) {
    fecharModalVideo();
  }
});

// permite fechar o pop-up de vídeo com a tecla Esc
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && !modalVideo.classList.contains('oculto')) {
    fecharModalVideo();
  }
});

// permite abrir o vídeo pressionando Enter/Espaço quando o card está focado (acessibilidade)
document.querySelectorAll('.servico-video').forEach((card) => {
  card.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      card.click();
    }
  });
});
