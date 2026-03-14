/* ═══════════════════════════════════════
   connect — full app JS
   ═══════════════════════════════════════ */

// ── STATE ────────────────────────────────
const state = {
  user: { name: '김지은', handle: '@jieun_k', school: '연세대학교', coins: 730, adToday: 2 },
  screen: 'splash',
  chatOpen: null,
  letters: [
    { id: 1, initials: '박', name: '박지호', preview: '연구실에서 자주 마주쳤는데...', time: '일', isNew: true, matched: true, msgs: [
      { me: false, text: '안녕하세요! 드디어 연결됐네요 😊', time: '일 오후 3:12' },
      { me: true, text: '헉 저도 설레요..! 혹시 같은 학과인가요?', time: '일 오후 3:15' },
      { me: false, text: '네! 경영학과 3학년이에요', time: '일 오후 3:16' },
    ]},
    { id: 2, initials: '이', name: '이수현', preview: '도서관에서 항상 같은 자리...', time: '월', isNew: false, matched: true, msgs: [
      { me: false, text: '용기 내봤어요 ☺️', time: '월 오후 7:40' },
      { me: true, text: '저도요! 언제 커피 한 잔 어때요?', time: '월 오후 8:01' },
    ]},
  ],
  lockedCount: 3,
  nominated: [],
  tags: ['같은 학교', '동아리', '같은 과', '직장 동료'],
  selectedTags: [],
  sundayDays: 3,
  onboardStep: 1,
  countUnlocked: false,
  revealedCount: 4,
  regStep: 1,
  regMethod: null,
  regData: {},
  cancelTickets: 0,
  attendedDate: null,
  notifOn: true,
  paymentHistory: [
    { label: "500코인 구매", date: "2025.03.10", price: "₩1,200" },
    { label: "1,500코인 구매", date: "2025.03.05", price: "₩2,900" },
  ],
  sentLetters: [
    { id: 1, method: 'info', name: '이준혁', school: '연세대학교', gender: '남성', hint: '도서관 3층 창가 자주 앉는 사람', sentAt: '월요일', cancelled: false, accountStatus: 'active' },
    { id: 2, method: 'insta', name: '박준호', insta: 'junho_k', gender: '남성', hint: '인스타에서 자주 보던 사람', sentAt: '수요일', cancelled: false, accountStatus: 'none' },
    { id: 3, method: 'phone', name: '최서연', phone: '010-1234-5678', hint: '', sentAt: '목요일', cancelled: false, accountStatus: 'none' },
  ],
};

// ── UPDATE COIN UI ────────────────────────
function updateCoinUI() {
  // update every coin pill on screen
  document.querySelectorAll('.coin-pill-amount').forEach(el => {
    el.textContent = state.user.coins.toLocaleString();
  });
  // update coin screen if open
  const coinBig = document.getElementById('coinDisplay');
  if (coinBig) coinBig.textContent = state.user.coins.toLocaleString();
}

// ── SVGs ─────────────────────────────────
const envelopeSVG = (size=72) => `
<svg width="${size}" height="${size}" viewBox="0 0 72 72" fill="none">
  <rect x="6" y="16" width="60" height="40" rx="5" fill="#fff8ec" stroke="#c8a050" stroke-width="1.8"/>
  <path d="M6 22 L36 42 L66 22" stroke="#c8a050" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6 56 L26 38" stroke="#d8b868" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M66 56 L46 38" stroke="#d8b868" stroke-width="1" fill="none" stroke-linecap="round"/>
  <rect x="46" y="20" width="14" height="18" rx="2" fill="#f5dfa8" stroke="#c8a040" stroke-width="1"/>
  <rect x="48" y="22" width="10" height="14" rx="1.5" fill="#e8b840" opacity="0.5"/>
</svg>`;


const cancelTicketSVG = (size=20) => `<svg width="${size}" height="${size}" viewBox="0 0 28 18" fill="none">
  <rect x="1" y="1" width="26" height="16" rx="3" fill="#f5dfa8" stroke="#c8a040" stroke-width="1.5"/>
  <path d="M1 6 Q4.5 9 1 12" stroke="#c8a040" stroke-width="1.5" fill="none"/>
  <path d="M27 6 Q23.5 9 27 12" stroke="#c8a040" stroke-width="1.5" fill="none"/>
  <line x1="9" y1="1" x2="9" y2="17" stroke="#c8a040" stroke-width="1" stroke-dasharray="2 2.5"/>
  <circle cx="18.5" cy="5" r="1.2" fill="#c8a040"/>
  <circle cx="18.5" cy="9" r="1.2" fill="#c8a040"/>
  <circle cx="18.5" cy="13" r="1.2" fill="#c8a040"/>
</svg>`;

const lockSVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <rect x="4" y="9" width="12" height="9" rx="2" fill="#c8a050" stroke="#9a7030" stroke-width="1"/>
  <path d="M7 9V6.5a3 3 0 016 0V9" stroke="#9a7030" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="10" cy="13.5" r="1.5" fill="#7a5020"/>
</svg>`;

const mailboxSVG = (letterCount=0, doorOpen=false) => {
  const doorTransform = doorOpen ? 'transform="rotate(78,304,340)"' : '';
  const lettersOpacity = doorOpen ? '1' : '0';
  return `
<svg width="140" height="180" viewBox="100 140 260 230" fill="none">
  <defs>
    <filter id="mwc" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="4" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="0.6" result="b"/>
      <feComposite in="b" in2="SourceGraphic" operator="in"/>
    </filter>
    <clipPath id="bc">
      <path d="M180 250 Q180 195 230 178 Q268 166 304 166 Q340 166 378 178 Q428 195 428 250 L428 345 L180 345 Z"/>
    </clipPath>
  </defs>
  <!-- shadow -->
  <ellipse cx="304" cy="348" rx="74" ry="9" fill="#2a1808" opacity="0.14"/>
  <!-- pole -->
  <rect x="295" y="330" width="18" height="35" rx="5" fill="#c0c8d4"/>
  <rect x="297" y="332" width="6" height="31" rx="3" fill="#dde4ee" opacity="0.4"/>
  <!-- body -->
  <g filter="url(#mwc)">
    <path d="M180 250 Q180 195 230 178 Q268 166 304 166 Q340 166 378 178 Q428 195 428 250 L428 335 Q428 345 418 345 L190 345 Q180 345 180 335 Z" fill="#e01e10" opacity="0.93"/>
    <path d="M200 215 Q250 185 304 180 Q358 185 408 215" stroke="#ff6050" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.2"/>
  </g>
  <!-- letters inside -->
  <g opacity="${lettersOpacity}" clip-path="url(#bc)" style="transition:opacity 0.5s ease 0.8s">
    <rect x="224" y="213" width="100" height="124" rx="3" fill="#e4dfda" opacity="0.9" transform="rotate(-1,274,275)"/>
    <rect x="230" y="216" width="100" height="124" rx="3" fill="#eee9e2"/>
    <path d="M230 222 L280 254 L330 222" stroke="#ccc8c0" stroke-width="1.5" fill="none" opacity="0.8"/>
  </g>
  <!-- tray -->
  <g filter="url(#mwc)">
    <path d="M178 335 Q178 354 196 358 L420 358 Q436 354 436 335 L428 335 Q428 351 416 354 L192 354 Q180 351 180 335 Z" fill="#c01808" opacity="0.88"/>
  </g>
  <!-- hinge -->
  <rect x="416" y="232" width="14" height="96" rx="5" fill="#b0b8c8"/>
  <circle cx="423" cy="253" r="5.5" fill="#a8b0bc" stroke="#8898a8" stroke-width="1"/>
  <circle cx="423" cy="253" r="2" fill="#d0d8e8"/>
  <circle cx="423" cy="306" r="5.5" fill="#a8b0bc" stroke="#8898a8" stroke-width="1"/>
  <circle cx="423" cy="306" r="2" fill="#d0d8e8"/>
  <!-- flag -->
  <rect x="408" y="170" width="8" height="52" rx="3" fill="#b0b8c8"/>
  <path d="M416 172 L440 180 L416 192 Z" fill="#c82010" stroke="#9a0808" stroke-width="1"/>
  <!-- door -->
  <g id="svgDoor" ${doorTransform} style="transition:transform 1.1s cubic-bezier(0.34,1.4,0.64,1)">
    <g filter="url(#mwc)">
      <path d="M180 250 Q180 195 230 178 Q268 166 304 166 Q340 166 378 178 Q428 195 428 250 L428 340 L180 340 Z" fill="#e82010" opacity="0.94"/>
      <path d="M200 215 Q250 185 304 180 Q358 185 408 215" stroke="#ff6050" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.22"/>
      <path d="M212 206 Q255 182 304 177 Q353 182 396 206" stroke="#ffffff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.09"/>
      <line x1="180" y1="340" x2="428" y2="340" stroke="#aa0e08" stroke-width="2" opacity="0.5"/>
    </g>
    <!-- latch -->
    <rect x="187" y="283" width="24" height="11" rx="5.5" fill="#b8c0cc" stroke="#8898a8" stroke-width="1"/>
    <circle cx="188" cy="288" r="7" fill="#c0c8d4" stroke="#9098a8" stroke-width="1.2"/>
    <circle cx="188" cy="288" r="2.5" fill="#d8e0ec"/>
  </g>
  <!-- bracket -->
  <rect x="292" y="342" width="34" height="10" rx="4" fill="#b0b8c4"/>
</svg>`;
};

// ── ROUTER ────────────────────────────────
// ── SWIPE SCREENS (main tabs) ──
const MAIN_SCREENS = ['coins', 'register', 'home', 'inbox', 'profile'];
const SCREEN_RENDERS = {
  coins: renderCoins, register: renderRegister,
  home: renderHome, inbox: renderInbox, profile: renderProfile
};

function go(screenId, opts={}) {
  const isMain = MAIN_SCREENS.includes(screenId);
  const isMain_current = MAIN_SCREENS.includes(state.screen);

  // hide any open overlay
  document.querySelectorAll('.screen-overlay').forEach(s => s.classList.remove('active'));

  if (isMain) {
    const idx = MAIN_SCREENS.indexOf(screenId);
    slideTo(idx, opts);
  } else {
    // overlay screens: chat, onboard, splash
    if (isMain_current) {
      // keep slider visible underneath
    }
    const el = document.getElementById('screen-' + screenId);
    if (el) {
      el.classList.add('active');
      state.screen = screenId;
    }
    if (opts.render) opts.render();
    updateNav(screenId);
  }
  window.scrollTo(0,0);
}

function slideTo(idx, opts={}) {
  const wrapper = document.getElementById('screen-wrapper');
  if (!wrapper) return;
  const screenId = MAIN_SCREENS[idx];
  state.currentTabIdx = idx;
  state.screen = screenId;

  // render before sliding
  if (opts.render) opts.render();
  else if (SCREEN_RENDERS[screenId]) SCREEN_RENDERS[screenId]();

  wrapper.style.transform = `translateX(-${idx * 100}%)`;
  updateNav(screenId);
  updateDots(idx);
  // re-init rubber scroll for this screen
  setTimeout(() => {
    const screenEl = document.getElementById('screen-' + screenId);
    if (screenEl) initRubberScrollEl(screenEl);
  }, 50);
}

function updateNav(screenId) {
  const isMain = MAIN_SCREENS.includes(screenId);
  document.getElementById('nav-bar').style.display = isMain ? 'flex' : 'none';
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('on', n.dataset.screen === screenId);
  });
  // dots
  const dots = document.getElementById('swipe-dots');
  if (dots) dots.classList.toggle('visible', isMain);
}

function updateDots(idx) {
  document.querySelectorAll('.swipe-dot').forEach((d,i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ── TOAST ────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── SCREENS ──────────────────────────────
function renderHome() {
  const el = document.getElementById('screen-home');
  el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <div class="top-title">${state.user.name.slice(1)}님의 우편함</div>
  <button class="coin-pill" onclick="go('coins',{render:renderCoins})">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" fill="#e8b840" stroke="#c8900a" stroke-width="1"/><text x="7" y="10.5" text-anchor="middle" font-size="8" fill="#7a4808" font-weight="700" font-family="sans-serif">C</text></svg>
    <span class="coin-pill-amount">${state.user.coins.toLocaleString()}</span>
  </button>
</div>
<div class="scroll-content paper-bg">
  <!-- Compact sunday countdown -->
  <div class="sunday-compact anim-up" style="animation-delay:0.05s" onclick="openSundayDetail()">
    <div class="sunday-compact-left">
      <div class="sunday-compact-label">공개 카운트다운</div>
      <div class="sunday-compact-timer" id="sundayTimer">--:--:--</div>
    </div>
    <div class="sunday-compact-right">
      <div class="sunday-bar-wrap" style="width:100%;margin:0">
        <div class="sunday-bar-fill" id="sundayBar"></div>
      </div>
      <div class="sunday-compact-hint">눌러서 자세히 보기 ›</div>
    </div>
  </div>


  <!-- My letters card -->
  <div class="card anim-up" style="animation-delay:0.1s">
    <div class="card-row">
      <span class="card-title">✉ 나를 지목한 사람</span>
      <span class="badge badge-gold">이번 주</span>
    </div>
    <div class="card-desc" style="font-size:32px;font-family:var(--font-serif);font-weight:700;color:var(--red2);margin:8px 0 4px">${state.revealedCount}명</div>
    <div class="card-desc">나를 지목한 사람 수예요. 서로 지목해야만 일요일에 매칭돼요.</div>
    <div class="btn-row">
      <button class="card-btn" onclick="refreshCount()">
        <div class="bc">🪙 150 새로고침</div>
        <div class="bl">즉시 반영</div>
      </button>
    </div>
  </div>




</div>`;
  setTimeout(() => {
    const bar = document.getElementById('sundayBar');
    if (bar) bar.style.width = `${Math.round((7 - state.sundayDays) / 7 * 100)}%`;
    startSundayTimer();
  }, 200);

}

function showConfirm({ title, desc, confirmLabel, cancelLabel, onConfirm }) {
  const ov = document.getElementById('overlay-confirm');
  ov.innerHTML = `
<div class="confirm-card" onclick="event.stopPropagation()">
  <div class="confirm-title">${title}</div>
  <div class="confirm-desc">${desc.replace(/\n/g,'<br/>')}</div>
  <div class="confirm-btns">
    <button class="confirm-btn-cancel" onclick="hideConfirm()">${cancelLabel || '취소'}</button>
    <button class="confirm-btn-ok" id="confirmOkBtn">${confirmLabel || '확인'}</button>
  </div>
</div>`;
  ov.style.opacity = '0';
  ov.style.transition = 'opacity 0.22s ease';
  ov.style.display = 'flex';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });
  document.getElementById('confirmOkBtn').onclick = () => { hideConfirm(); onConfirm(); };
}

function hideConfirm() {
  const ov = document.getElementById('overlay-confirm');
  if (!ov) return;
  ov.style.transition = 'opacity 0.18s ease';
  ov.style.opacity = '0';
  setTimeout(() => { ov.style.display = 'none'; ov.style.opacity = '1'; }, 200);
}


function showAttendOverlay() {
  // only show once per day
  const todayKey = new Date().toDateString();
  if (state.attendedDate === todayKey) return;
  state.attendedDate = todayKey;
  state.user.coins += 5;
  updateCoinUI();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const DAYS = ['일','월','화','수','목','금','토'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const filled = firstDay + daysInMonth;
  const remaining = filled % 7 === 0 ? 0 : 7 - (filled % 7);

  let dayHeaders = DAYS.map((d,i) =>
    `<div style="font-size:10px;color:${i===0?'#c01808':i===6?'#2060c0':'#9a7040'};font-family:sans-serif;font-weight:700;text-align:center;padding:3px 0">${d}</div>`
  ).join('');

  let prevCells = '';
  for(let i=firstDay-1;i>=0;i--){
    prevCells += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;color:#c8a880;font-family:sans-serif">${prevDays-i}</div>`;
  }

  let dayCells = '';
  for(let d=1;d<=daysInMonth;d++){
    if(d===today){
      dayCells += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff8f0;font-family:sans-serif;background:#8b2010;border-radius:50%;position:relative" id="attendTodayCell">
        ${d}
        <div id="attendStamp" style="position:absolute;inset:-3px;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(2) rotate(-15deg);transition:opacity .35s ease,transform .45s cubic-bezier(0.34,1.56,0.64,1)">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="17" fill="none" stroke="#c01808" stroke-width="3" opacity="0.9"/>
            <circle cx="19" cy="19" r="12" fill="none" stroke="#c01808" stroke-width="1.2" opacity="0.5"/>
            <text x="19" y="24" text-anchor="middle" font-size="14" fill="#c01808" font-weight="700" font-family="Georgia,serif">✓</text>
          </svg>
        </div>
      </div>`;
    } else {
      dayCells += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;color:#5a3a18;font-family:sans-serif;border-radius:6px">${d}</div>`;
    }
  }

  let nextCells = '';
  for(let d=1;d<=remaining;d++){
    nextCells += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;color:#c8a880;font-family:sans-serif">${d}</div>`;
  }

  const ov = document.getElementById('overlay-attend');
  ov.innerHTML = `
<div style="background:#fdf6ec;border:2px solid #c8a050;border-radius:20px;padding:22px 20px 20px;width:100%;max-width:300px;background-image:repeating-linear-gradient(0deg,transparent,transparent 14px,rgba(130,100,60,.05) 14px,rgba(130,100,60,.05) 15px)" onclick="event.stopPropagation()">
  <div style="font-family:Georgia,serif;font-size:11px;color:#9a7040;letter-spacing:2px;text-align:center;margin-bottom:3px">${year}년</div>
  <div style="font-family:Georgia,serif;font-size:20px;color:#3a1e08;font-weight:700;text-align:center;margin-bottom:14px">${MONTHS[month]}</div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:14px">
    ${dayHeaders}${prevCells}${dayCells}${nextCells}
  </div>
  <div style="display:flex;align-items:center;justify-content:center;margin-bottom:10px">
    <div id="attendCoinBadge" style="background:#f0d090;border:1.5px solid #c8a040;border-radius:20px;padding:6px 18px;font-size:14px;font-weight:700;color:#5a2808;font-family:sans-serif;opacity:0;transform:translateY(8px);transition:opacity .4s ease .5s,transform .4s ease .5s">+5 코인 적립!</div>
  </div>
  <div id="attendStreakTxt" style="font-size:11px;color:#8a5828;font-family:sans-serif;text-align:center;margin-bottom:12px;opacity:0;transition:opacity .4s ease .6s"></div>
  <button id="attendOkBtn" style="width:100%;padding:13px;background:#8b2010;border:none;border-radius:12px;font-size:14px;font-weight:700;color:#fff8f0;font-family:sans-serif;cursor:pointer;box-shadow:0 3px 0 #5a1008;opacity:0;transform:translateY(8px);transition:opacity .4s ease .7s,transform .4s ease .7s" onclick="closeAttendOverlay()">확인</button>
</div>`;

  ov.style.opacity = '0';
  ov.style.transition = 'opacity 0.3s ease';
  ov.style.display = 'flex';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });

  setTimeout(() => {
    const stamp = document.getElementById('attendStamp');
    if(stamp){ stamp.style.opacity='1'; stamp.style.transform='scale(1) rotate(-8deg)'; }
    const badge = document.getElementById('attendCoinBadge');
    if(badge){ badge.style.opacity='1'; badge.style.transform='translateY(0)'; }
    const streak = document.getElementById('attendStreakTxt');
    if(streak){ streak.style.opacity='1'; streak.textContent=today+'일 연속 출석 중!'; }
    const btn = document.getElementById('attendOkBtn');
    if(btn){ btn.style.opacity='1'; btn.style.transform='translateY(0)'; }
  }, 400);
}

function closeAttendOverlay() {
  const ov = document.getElementById('overlay-attend');
  ov.style.transition = 'opacity 0.22s ease';
  ov.style.opacity = '0';
  setTimeout(() => { ov.style.display = 'none'; ov.style.opacity='1'; }, 230);
}

function openSundayDetail() {
  const ov = document.getElementById('overlay-sunday');
  if (!ov) return;
  ov.innerHTML = `
    <div class="sunday-detail-card" onclick="event.stopPropagation()">
      <div style="text-align:center;margin-bottom:12px">${envelopeSVG(52)}</div>
      <div class="sunday-title" style="text-align:center;margin-bottom:6px">매주 일요일, 매칭이 공개돼요</div>
      <div class="sunday-sub" style="text-align:center">나도 지목하고, 상대도 나를 지목해야만<br/>매칭이 돼요. 서로 닿는 순간을 기다려요.</div>
      <div class="sunday-pill" style="margin:12px auto">D-${state.sundayDays} 다음 공개</div>
      <div style="text-align:center;margin-bottom:12px">
        <div style="font-size:11px;color:var(--ink3);font-family:var(--font-sans);letter-spacing:0.8px;margin-bottom:4px">공개까지</div>
        <div class="sunday-compact-timer" id="sundayTimerPopup" style="font-size:32px;letter-spacing:2px">--:--:--</div>
      </div>
      <div class="sunday-bar-wrap" style="width:80%;margin:0 auto 20px">
        <div class="sunday-bar-fill" style="width:${Math.round((7-state.sundayDays)/7*100)}%"></div>
      </div>
      <button class="btn-secondary" style="max-width:100%;margin-top:4px" onclick="closeSundayDetail()">닫기</button>
    </div>`;
  ov.style.opacity = '0';
  ov.style.transition = 'opacity 0.25s ease';
  ov.style.display = 'flex';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });

  // start timer inside popup
  function updatePopupTimer() {
    const el = document.getElementById('sundayTimerPopup');
    if (!el) return;
    const now = new Date();
    const day = now.getDay();
    const daysUntilSun = day === 0 ? 7 : 7 - day;
    const nextSun = new Date(now);
    nextSun.setDate(now.getDate() + daysUntilSun);
    nextSun.setHours(0,0,0,0);
    const diff = Math.max(0, nextSun - now);
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  updatePopupTimer();
  const popupTimer = setInterval(() => {
    if (!document.getElementById('sundayTimerPopup')) { clearInterval(popupTimer); return; }
    updatePopupTimer();
  }, 1000);
}

function closeSundayDetail() {
  const ov = document.getElementById('overlay-sunday');
  if (!ov) return;
  ov.style.transition = 'opacity 0.22s ease';
  ov.style.opacity = '0';
  setTimeout(() => { ov.style.display = 'none'; ov.style.opacity = '1'; }, 230);
}

function startSundayTimer() {
  function update() {
    const el = document.getElementById('sundayTimer');
    if (!el) return;
    // compute seconds until next sunday midnight
    const now = new Date();
    const day = now.getDay(); // 0=sun
    const daysUntilSun = day === 0 ? 7 : 7 - day;
    const nextSun = new Date(now);
    nextSun.setDate(now.getDate() + daysUntilSun);
    nextSun.setHours(0,0,0,0);
    const diff = Math.max(0, nextSun - now);
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
}

function claimAttend(btn) {
  state.user.coins += 5;
  btn.querySelector('.bc').textContent = '✓ 출석 완료!';
  btn.disabled = true; btn.style.opacity = '0.6';
  toast('+5코인 적립됐어요!');
  updateCoinUI();
}

function renderInbox() {
  const el = document.getElementById('screen-inbox');
  let html = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <div class="top-title">우편함</div>
  <span style="font-size:11px;color:var(--ink3);font-family:var(--font-sans)">${state.letters.filter(l=>l.matched).length}개 매칭</span>
</div>
<div class="scroll-content paper-bg">
  <div class="section-lbl">💌 서로 닿은 편지 — 매칭됨</div>`;

  state.letters.filter(l=>l.matched).forEach(l => {
    html += `
<div class="letter-item anim-up" onclick="openChat(${l.id})">
  <div class="letter-avatar">${l.initials}</div>
  <div class="letter-info">
    <div class="letter-name">${l.name}</div>
    <div class="letter-preview">${l.preview}</div>
  </div>
  <div class="letter-meta">
    <div class="letter-time">${l.time}</div>
    ${l.isNew ? '<div class="letter-dot"></div>' : ''}
  </div>
</div>`;
  });

  for (let i = 0; i < state.lockedCount; i++) {
    html += `
<div class="locked-item anim-up" style="animation-delay:${0.05*(i+1)}s">
  <div class="lock-avatar">${lockSVG}</div>
  <div class="lock-text">
    ???님이 편지를 보냈어요<br/>
    <small>서로 지목해야 공개돼요</small>
  </div>
</div>`;
  }

  html += `</div>`;
  el.innerHTML = html;
}

function renderRegister() {
  const el = document.getElementById('screen-register');
  const tab = state.regTab || 'write';

  const tabBar = `
<div class="reg-tab-bar">
  <button class="reg-tab${tab==='write'?' active':''}" onclick="state.regTab='write';state.regStep=1;renderRegister()">
    ✉ 편지 쓰기
  </button>
  <button class="reg-tab${tab==='sent'?' active':''}" onclick="state.regTab='sent';renderRegister()">
    📬 보낸 편지
    ${state.sentLetters.filter(l=>!l.cancelled).length > 0 ? `<span class="reg-tab-badge">${state.sentLetters.filter(l=>!l.cancelled).length + state.nominated.length}</span>` : ''}
  </button>
</div>`;

  if (tab === 'sent') {
  checkAccountStatuses();
    const methodLabel = { phone: '📱 전화번호', insta: '📸 인스타', info: '🔍 이름+정보' };
    const letters = state.sentLetters;
    const allLetters = [...letters, ...state.nominated.map((n,i) => ({
      id: 9000+i, method: n.method||'info',
      name: n.name, school: n.school, gender: n.gender,
      insta: n.insta, phone: n.phone, hint: n.hint||'',
      sentAt: '방금', cancelled: false
    }))];

    el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <div class="top-title">편지</div>
  <div style="display:flex;align-items:center;gap:4px;background:var(--gold2);border:1px solid var(--gold);border-radius:14px;padding:4px 10px">${cancelTicketSVG(16)}<span style="font-size:12px;font-weight:700;color:var(--ink);font-family:var(--font-sans);line-height:1">${state.cancelTickets}개</span></div>
</div>
${tabBar}
<div class="scroll-content paper-bg">
  ${allLetters.length === 0 ? `
    <div style="text-align:center;padding:48px 0 16px">
      ${envelopeSVG(48)}
      <div style="font-family:var(--font-serif);font-style:italic;color:var(--ink3);margin-top:12px;font-size:13px">아직 보낸 편지가 없어요</div>
    </div>
  ` : allLetters.map(l => `
  <div class="sent-letter-item ${l.cancelled ? 'cancelled' : ''} anim-up" onclick="openLetterDetail(${l.id})">
    <div class="sli-left">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
        <div class="sli-method" style="margin-bottom:0">${methodLabel[l.method] || '✉ 편지'}</div>
        ${!l.cancelled ? getStatusBadge(l.accountStatus || 'none') : ''}
      </div>
      <div class="sli-target">${l.name || '무명의 누군가'}</div>
      <div class="sli-detail">${
        l.method === 'phone' ? (l.phone || '전화번호 미입력') :
        l.method === 'insta' ? (l.insta ? '@' + l.insta : '아이디 미입력') :
        (l.school || '') + (l.gender ? ' · ' + l.gender : '')
      }</div>
      ${l.hint ? `<div class="sli-hint">📝 ${l.hint}</div>` : ''}
      <div class="sli-date">${l.sentAt} 발송 · 탭해서 세부정보 보기</div>
    </div>
    <div class="sli-right" onclick="event.stopPropagation()">
      ${l.cancelled
        ? `<div class="sli-cancelled-badge">취소됨</div>`
        : `<button class="sli-cancel-btn" onclick="useCancelTicket(${l.id})" title="취소권 사용">
            ${cancelTicketSVG(22)}
          </button>`
      }
    </div>
  </div>`).join('')}

  ${state.cancelTickets === 0 ? `
  <div class="onboard-notice" style="margin-top:8px">
    ${envelopeSVG(18)}
    <p>취소권이 없어요. 코인 화면에서 🪙100에 구매할 수 있어요.</p>
  </div>
  <button class="btn-secondary" style="max-width:100%;margin-top:8px" onclick="slideTo(MAIN_SCREENS.indexOf('coins'));renderCoins()">
    취소권 구매하러 가기 →
  </button>` : ''}
</div>`;
    return;
  }

  // ── WRITE TAB ──
  const s = state.regStep || 1;

  if (s === 1) {
    el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <div class="top-title">편지</div>
  <div style="display:flex;align-items:center;gap:4px;background:var(--gold2);border:1px solid var(--gold);border-radius:14px;padding:4px 10px">${cancelTicketSVG(16)}<span style="font-size:12px;font-weight:700;color:var(--ink);font-family:var(--font-sans);line-height:1">${state.cancelTickets}개</span></div>
</div>
${tabBar}
<div class="scroll-content paper-bg">
  <div style="text-align:center;padding:8px 0 16px">${envelopeSVG(48)}</div>
  <div class="onboard-notice anim-up" style="margin-bottom:16px">
    ${envelopeSVG(20)}
    <p>상대방을 정확히 찾기 위해 아는 정보를 선택해주세요. 상대방에게는 절대 공개되지 않아요.</p>
  </div>
  <div class="section-lbl">상대방을 어떻게 찾을까요?</div>
  <div class="card anim-up" style="cursor:pointer;animation-delay:0.05s" onclick="selectMethod('phone')">
    <div class="card-row">
      <span class="card-title">📱 전화번호로 찾기</span>
      <span class="badge badge-green">1순위 · 정확도 최고</span>
    </div>
    <div class="card-desc">전화번호는 중복이 없어요. 가장 정확하게 찾을 수 있어요.</div>
  </div>
  <div class="card anim-up" style="cursor:pointer;animation-delay:0.1s" onclick="selectMethod('insta')">
    <div class="card-row">
      <span class="card-title">📸 인스타그램 아이디로 찾기</span>
      <span class="badge badge-gold">2순위 · 정확도 높음</span>
    </div>
    <div class="card-desc">전화번호를 모를 때 사용해요. 아이디는 중복이 없지만 바뀔 수 있어요.</div>
  </div>
  <div class="card anim-up" style="cursor:pointer;animation-delay:0.15s" onclick="selectMethod('info')">
    <div class="card-row">
      <span class="card-title">🔍 이름 + 정보로 찾기</span>
      <span class="badge badge-red">3순위 · 최대한 좁히기</span>
    </div>
    <div class="card-desc">전화번호도 인스타도 모를 때 — 이름, 학교/직장, 성별로 좁혀서 찾아요.</div>
  </div>
</div>`;
  }

  else if (s === 2 && state.regMethod === 'phone') {
    el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <button class="back-btn" onclick="saveRegFields();state.regStep=1;renderRegister()">&larr;</button>
  <div class="top-title">전화번호로 찾기</div>
  <div style="font-size:10px;color:var(--green-badge);font-family:var(--font-sans);font-weight:700">1순위</div>
</div>
${tabBar}
<div class="scroll-content paper-bg">
  <div class="card anim-up" style="margin-top:8px">
    <div class="inp-group">
      <div class="inp-label">상대방 이름</div>
      <input class="inp-field" placeholder="이름을 입력하세요" id="reg-name" value="${state.regData.name||''}"
        oninput="state.regData.name=this.value"/>
    </div>
    <div class="inp-group">
      <div class="inp-label">상대방 전화번호</div>
      <input class="inp-field" type="tel" placeholder="010-0000-0000" id="reg-phone"
        oninput="formatPhone(this);state.regData.phone=this.value" value="${state.regData.phone||''}"/>
      <div style="font-size:11px;color:var(--ink3);margin-top:5px;font-family:var(--font-sans)">전화번호는 매칭 외 절대 사용되지 않아요</div>
    </div>
    <div class="inp-group">
      <div class="inp-label">상대방 성별</div>
      <div class="tag-row">
        ${['남성','여성','선택 안 함'].map(g=>`<span class="tag${state.regData.gender===g?' selected':''}" onclick="state.regData.gender='${g}';renderRegister()">${g}</span>`).join('')}
      </div>
    </div>
    <div class="inp-group">
      <div class="inp-label">내 기억용 메모 <span style="color:var(--ink3)">(선택 · 나만 봐요)</span></div>
      <input class="inp-field" placeholder="예: 화요일 오전 강의에서 자주 보던 사람" id="reg-hint"
        value="${state.regData.hint||''}" oninput="state.regData.hint=this.value"/>
      <div style="font-size:11px;color:var(--ink3);margin-top:5px;font-family:var(--font-sans)">매칭됐을 때 내가 확인하는 메모예요. 상대방에게는 절대 보이지 않아요.</div>
    </div>
  </div>
  <div class="onboard-notice anim-up" style="animation-delay:0.1s">
    ${envelopeSVG(20)}
    <p>편지를 받는 상대방은 누가 보냈는지 알 수 없어요. 서로 지목해야만 일요일에 매칭이 공개돼요.</p>
  </div>
  <button class="btn-primary anim-up" style="max-width:100%;animation-delay:0.15s" onclick="confirmSendLetter()">편지 보내기 ✉</button>
</div>`;
  }

  else if (s === 2 && state.regMethod === 'insta') {
    el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <button class="back-btn" onclick="saveRegFields();state.regStep=1;renderRegister()">&larr;</button>
  <div class="top-title">인스타그램으로 찾기</div>
  <div style="font-size:10px;color:var(--gold);font-family:var(--font-sans);font-weight:700">2순위</div>
</div>
${tabBar}
<div class="scroll-content paper-bg">
  <div class="card anim-up" style="margin-top:8px">
    <div class="inp-group">
      <div class="inp-label">상대방 이름</div>
      <input class="inp-field" placeholder="이름을 입력하세요" id="reg-name" value="${state.regData.name||''}"
        oninput="state.regData.name=this.value"/>
    </div>
    <div class="inp-group">
      <div class="inp-label">인스타그램 아이디</div>
      <input class="inp-field" type="text" placeholder="@username" id="reg-insta"
        value="${state.regData.insta||''}" oninput="state.regData.insta=this.value.replace(/^@/,'')"/>
      <div style="font-size:11px;color:var(--ink3);margin-top:5px;font-family:var(--font-sans)">아이디가 바뀌어도 매칭 시점 기준으로 처리돼요</div>
    </div>
    <div class="inp-group">
      <div class="inp-label">상대방 성별</div>
      <div class="tag-row">
        ${['남성','여성','선택 안 함'].map(g=>`<span class="tag${state.regData.gender===g?' selected':''}" onclick="state.regData.gender='${g}';renderRegister()">${g}</span>`).join('')}
      </div>
    </div>
    <div class="inp-group">
      <div class="inp-label">내 기억용 메모 <span style="color:var(--ink3)">(선택 · 나만 봐요)</span></div>
      <input class="inp-field" placeholder="예: 인스타 팔로워인데 카페에서 봤어요" id="reg-hint"
        value="${state.regData.hint||''}" oninput="state.regData.hint=this.value"/>
      <div style="font-size:11px;color:var(--ink3);margin-top:5px;font-family:var(--font-sans)">매칭됐을 때 내가 확인하는 메모예요. 상대방에게는 절대 보이지 않아요.</div>
    </div>
  </div>
  <div class="onboard-notice anim-up" style="animation-delay:0.1s">
    ${envelopeSVG(20)}
    <p>인스타 아이디는 중복이 없어요. 전화번호보다 찾기 어려울 수 있지만 충분히 정확해요.</p>
  </div>
  <button class="btn-primary anim-up" style="max-width:100%;animation-delay:0.15s" onclick="confirmSendLetter()">편지 보내기 ✉</button>
</div>`;
  }

  else if (s === 2 && state.regMethod === 'info') {
    const tagsHTML = state.tags.map((t,i) =>
      `<span class="tag${state.selectedTags.includes(i)?' selected':''}" onclick="toggleTag(${i})">${t}</span>`
    ).join('') + `<span class="tag-add" onclick="toast('직접 입력 기능은 곧 출시돼요!')">+ 직접 입력</span>`;

    el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <button class="back-btn" onclick="state.regStep=1;renderRegister()">&larr;</button>
  <div class="top-title">정보로 좁혀 찾기</div>
  <div style="font-size:10px;color:var(--red2);font-family:var(--font-sans);font-weight:700">3순위</div>
</div>
${tabBar}
<div class="scroll-content paper-bg">
  <div class="card anim-up" style="margin-top:8px">
    <div class="inp-group">
      <div class="inp-label">상대방 이름 <span style="color:var(--red2)">*</span></div>
      <input class="inp-field" placeholder="이름을 입력하세요" id="reg-name" value="${state.regData.name||''}" oninput="state.regData.name=this.value"/>
    </div>
    <div class="inp-group">
      <div class="inp-label">학교 또는 직장 <span style="color:var(--red2)">*</span></div>
      <input class="inp-field" placeholder="예: 연세대학교, 카카오" id="reg-school" value="${state.regData.school||''}" oninput="state.regData.school=this.value"/>
    </div>
    <div class="inp-group">
      <div class="inp-label">성별 <span style="color:var(--red2)">*</span></div>
      <div class="tag-row">
        ${['남성','여성'].map(g=>`<span class="tag${state.regData.gender===g?' selected':''}" onclick="state.regData.gender='${g}';renderRegister()">${g}</span>`).join('')}
      </div>
    </div>
    <div class="inp-group">
      <div class="inp-label">인연</div>
      <div class="tag-row" id="tagRow">${tagsHTML}</div>
    </div>
    <div class="inp-group">
      <div class="inp-label">내 기억용 메모 <span style="color:var(--ink3)">(선택 · 나만 봐요)</span></div>
      <input class="inp-field" placeholder="예: 3층 도서관 창가 자리 자주 앉는 사람" id="reg-hint" value="${state.regData.hint||''}"/>
      <div style="font-size:11px;color:var(--ink3);margin-top:5px;font-family:var(--font-sans)">매칭됐을 때 내가 확인하는 메모예요. 상대방에게는 절대 보이지 않아요.</div>
    </div>
  </div>
  <div class="onboard-notice anim-up" style="animation-delay:0.1s">
    ${envelopeSVG(20)}
    <p>이름+학교/직장+성별은 중복될 수 있어요. 최대한 많은 정보를 입력할수록 정확하게 찾을 수 있어요.</p>
  </div>
  <button class="btn-primary anim-up" style="max-width:100%;animation-delay:0.15s" onclick="confirmSendLetter()">편지 보내기 ✉</button>
</div>`;
  }
}

function selectMethod(method) {
  state.regMethod = method;
  state.regStep = 2;
  state.regData = {};
  state.selectedTags = [];
  renderRegister();
  go('register');
}

function saveRegFields() {
  const fields = {
    'reg-name': 'name', 'reg-phone': 'phone',
    'reg-insta': 'insta', 'reg-school': 'school', 'reg-hint': 'hint'
  };
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) state.regData[key] = el.value;
  });
}

function formatPhone(inp) {
  let v = inp.value.replace(/\D/g,'');
  if (v.length > 3 && v.length <= 7) v = v.slice(0,3)+'-'+v.slice(3);
  else if (v.length > 7) v = v.slice(0,3)+'-'+v.slice(3,7)+'-'+v.slice(7,11);
  inp.value = v;
}


function toggleTag(i) {
  const idx = state.selectedTags.indexOf(i);
  if (idx >= 0) state.selectedTags.splice(idx,1); else state.selectedTags.push(i);
  renderRegister(); go('register');
}

function confirmSendLetter() {
  // gather current field values before showing confirm
  saveRegFields();
  const method = state.regMethod;
  let target = '';
  if (method === 'phone') target = state.regData.name || state.regData.phone || '상대방';
  else if (method === 'insta') target = state.regData.name || ('@' + (state.regData.insta || '')) || '상대방';
  else target = state.regData.name || '상대방';

  showConfirm({
    title: '편지를 보낼까요?',
    desc: `${target}님에게 편지를 보내요.\n보낸 후에는 취소권으로만 취소할 수 있어요.`,
    confirmLabel: '편지 보내기 ✉',
    cancelLabel: '다시 확인할게요',
    onConfirm: () => submitNomination()
  });
}

function submitNomination() {
  const method = state.regMethod;
  let valid = false;
  let label = '';

  if (method === 'phone') {
    const name = (document.getElementById('reg-name')||{}).value||state.regData.name||'';
    const phone = (document.getElementById('reg-phone')||{}).value||state.regData.phone||'';
    const hint = (document.getElementById('reg-hint')||{}).value||state.regData.hint||'';
    if (!name) { toast('이름을 입력해주세요'); return; }
    if (!phone || phone.replace(/[^0-9]/g,'').length < 10) { toast('전화번호를 정확히 입력해주세요'); return; }
    state.regData = { ...state.regData, name, phone, hint };
    label = name;
    valid = true;
  } else if (method === 'insta') {
    const name = (document.getElementById('reg-name')||{}).value||state.regData.name||'';
    const insta = (document.getElementById('reg-insta')||{}).value||state.regData.insta||'';
    const hint = (document.getElementById('reg-hint')||{}).value||state.regData.hint||'';
    if (!name) { toast('이름을 입력해주세요'); return; }
    if (!insta) { toast('인스타그램 아이디를 입력해주세요'); return; }
    state.regData = { ...state.regData, name, insta: insta.replace(/^@/,''), hint };
    label = name;
    valid = true;
  } else if (method === 'info') {
    const name = (document.getElementById('reg-name')||{}).value||'';
    const school = (document.getElementById('reg-school')||{}).value||'';
    const hint = (document.getElementById('reg-hint')||{}).value||'';
    if (!name) { toast('이름을 입력해주세요'); return; }
    if (!school) { toast('학교 또는 직장을 입력해주세요'); return; }
    if (!state.regData.gender) { toast('성별을 선택해주세요'); return; }
    state.regData = { ...state.regData, name, school, hint };
    label = name;
    valid = true;
  }

  if (!valid) return;

  state.nominated.push({ ...state.regData, method, sentAt: new Date().toISOString() });
  state.regStep = 1; state.regMethod = null; state.regData = {}; state.selectedTags = []; state.regTab = 'write';
  toast(`편지를 보냈어요 💌 일요일까지 기다려봐요`);
  slideTo(0);
}

function renderCoins() {
  const el = document.getElementById('screen-coins');
  const adLeft = 5 - state.user.adToday;

  el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <div class="top-title">코인</div>
</div>
<div class="scroll-content paper-bg">

  <!-- 잔액 -->
  <div class="coin-balance anim-pop">
    <div style="font-size:12px;color:var(--ink3);font-family:var(--font-sans);margin-bottom:4px;position:relative;z-index:1">보유 코인</div>
    <div class="coin-big" id="coinDisplay">${state.user.coins.toLocaleString()}</div>
    <div class="coin-sub">코인으로 다양한 기능을 이용할 수 있어요</div>
  </div>

  <!-- 무료 획득 -->
  <div class="section-lbl">무료로 모으기</div>
  <div class="earn-grid anim-up" style="animation-delay:0.05s">
    <div class="earn-card">
      <div class="earn-emoji">📺</div>
      <div class="earn-title">광고 보기</div>
      <div class="earn-sub">+10코인 · 오늘 ${adLeft}회 남음</div>
    </div>
    <div class="earn-card">
      <div class="earn-emoji">📅</div>
      <div class="earn-title">출석 체크</div>
      <div class="earn-sub">+5코인 · 매일</div>
    </div>
  </div>
  <div class="ad-row anim-up" style="animation-delay:0.08s">
    <div class="ad-info">
      <div class="ad-title">광고 보고 코인 받기</div>
      <div class="ad-sub">30초 광고 시청 후 +10코인 적립</div>
    </div>
    <button class="ad-cta" onclick="watchAd()">${adLeft > 0 ? '시청하기' : '내일 다시'}</button>
  </div>

  <!-- 사용처 -->
  <div class="section-lbl">코인 사용처</div>

  <!-- 편지 관련 -->
  <div class="coin-use-group anim-up" style="animation-delay:0.1s">
    <div class="coin-use-header">✉ 편지</div>
    <div class="coin-use-item" onclick="refreshCount();slideTo(2)">
      <div class="cui-left">
        <div class="cui-name">나를 지목한 인원 수 새로고침</div>
        <div class="cui-desc">최신 인원 수로 즉시 업데이트</div>
      </div>
      <div class="cui-price">🪙 150</div>
    </div>
    <div class="coin-use-item" onclick="buyCancelTicket()">
      <div class="cui-left">
        <div class="cui-name" style="display:flex;align-items:center;gap:6px">${cancelTicketSVG(16)}<span>편지 취소권</span><span style="font-size:10px;color:var(--ink3);font-weight:400">아이템</span></div>
        <div class="cui-desc">보낸 편지 취소 시 1개 사용 · 지금 ${state.cancelTickets}개 보유</div>
      </div>
      <div class="cui-price" style="flex-direction:row;align-items:center;gap:6px">
        <span style="font-size:11px;color:var(--green-badge);font-weight:700">구매</span> 🪙 100
      </div>
    </div>
  </div>

  <!-- 매칭 후 -->
  <div class="coin-use-group anim-up" style="animation-delay:0.15s">
    <div class="coin-use-header">💌 매칭 후</div>
    <div class="coin-use-item" onclick="toast('곧 출시돼요!')">
      <div class="cui-left">
        <div class="cui-name">익명 꽃 한 송이 보내기</div>
        <div class="cui-desc">상대는 "누군가 꽃을 보냈어요"만 알 수 있어요</div>
      </div>
      <div class="cui-price">🪙 150 <span class="cui-soon">출시예정</span></div>
    </div>
    <div class="coin-use-item" onclick="toast('곧 출시돼요!')">
      <div class="cui-left">
        <div class="cui-name">채팅방 테마 변경</div>
        <div class="cui-desc">벚꽃, 밤하늘, 빈티지 등</div>
      </div>
      <div class="cui-price">🪙 50 <span class="cui-soon">출시예정</span></div>
    </div>
  </div>

  <!-- 꾸미기 -->
  <div class="coin-use-group anim-up" style="animation-delay:0.2s">
    <div class="coin-use-header">🎨 꾸미기</div>
    <div class="coin-use-item" onclick="toast('곧 출시돼요!')">
      <div class="cui-left">
        <div class="cui-name">우표 스킨</div>
        <div class="cui-desc">내 편지에 붙는 우표 디자인 변경</div>
      </div>
      <div class="cui-price">🪙 30 <span class="cui-soon">출시예정</span></div>
    </div>
    <div class="coin-use-item" onclick="toast('곧 출시돼요!')">
      <div class="cui-left">
        <div class="cui-name">편지지 디자인</div>
        <div class="cui-desc">매칭 후 채팅방 편지지 스킨</div>
      </div>
      <div class="cui-price">🪙 80 <span class="cui-soon">출시예정</span></div>
    </div>
    <div class="coin-use-item" onclick="toast('곧 출시돼요!')">
      <div class="cui-left">
        <div class="cui-name">프로필 배경 테마</div>
        <div class="cui-desc">내 프로필 페이지 배경 변경</div>
      </div>
      <div class="cui-price">🪙 150 <span class="cui-soon">출시예정</span></div>
    </div>
  </div>

  <!-- 구매 -->
  <div class="section-lbl">코인 구매</div>
  <button class="buy-btn buy-btn-primary anim-up" style="animation-delay:0.22s" onclick="buyCoin(500,1200)">
    💰 500코인 — ₩1,200
  </button>
  <button class="buy-btn buy-btn-primary anim-up" style="animation-delay:0.24s" onclick="buyCoin(1500,2900)">
    💎 1,500코인 — ₩2,900
  </button>
  <button class="buy-btn buy-btn-secondary anim-up" style="animation-delay:0.26s" onclick="buyCoin(3000,4900)">
    👑 3,000코인 — ₩4,900
  </button>

</div>`;
}

function watchAd() {
  if (state.user.adToday >= 5) { toast('오늘은 광고를 모두 시청했어요'); return; }
  toast('광고를 시청하고 있어요...');
  setTimeout(() => {
    state.user.adToday++;
    state.user.coins += 10;
    toast('+10코인 적립됐어요!');
    updateCoinUI();
    renderCoins(); go('coins');
  }, 2000);
}

function buyCoin(amount, price) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
  state.paymentHistory.unshift({ label: `${amount.toLocaleString()}코인 구매`, date: dateStr, price: `₩${price.toLocaleString()}` });
  state.user.coins += amount;
  updateCoinUI();
  toast(`${amount.toLocaleString()}코인이 충전됐어요!`);
}

function buyCancelTicket() {
  if (state.user.coins < 100) { toast('코인이 부족해요 (100코인 필요)'); return; }
  state.user.coins -= 100;
  state.cancelTickets += 1;
  updateCoinUI();
  renderCoins(); slideTo(MAIN_SCREENS.indexOf('coins'));
  toast(`편지 취소권 1개 구매 완료! (보유: ${state.cancelTickets}개)`);
}



function getStatusBadge(status) {
  if (status === 'active') return '<span style="font-size:10px;font-weight:700;font-family:var(--font-sans);background:#d8eeb8;color:#3a6018;padding:2px 8px;border-radius:8px;border:1px solid #a0c870">● 가입됨</span>';
  return '<span style="font-size:10px;font-weight:700;font-family:var(--font-sans);background:#f0e8d8;color:#8a6030;padding:2px 8px;border-radius:8px;border:1px solid #c8a860">○ 미가입</span>';
}

function checkAccountStatuses() {
  // In real app: POST /api/check-accounts with phone/insta/name
  // Demo: already set directly on each letter
}

function refreshAccountStatus(letterId) {
  const l = state.sentLetters.find(x => x.id === letterId);
  if (!l) return;
  // Demo: toggle for testing
  l.accountStatus = l.accountStatus === 'active' ? 'none' : 'active';
  if (state.regTab === 'sent' && state.screen === 'register') renderRegister();
  toast(l.accountStatus === 'active' ? '✓ connect에 가입되어 있어요!' : '아직 미가입이에요. 가입하면 자동으로 업데이트돼요.');
}

function openLetterDetail(letterId, isNominated) {
  const allLetters = [
    ...state.sentLetters,
    ...state.nominated.map((n,i) => ({...n, id: 9000+i}))
  ];
  const l = allLetters.find(x => x.id === letterId);
  if (!l) return;
  const methodLabel = { phone: '📱 전화번호', insta: '📸 인스타', info: '🔍 이름+정보' };

  const ov = document.getElementById('overlay-letter-detail');
  ov.innerHTML = `
<div class="letter-detail-card" onclick="event.stopPropagation()">
  <div class="letter-detail-header">
    <div>
      <div style="font-size:11px;color:var(--ink3);font-family:var(--font-sans);margin-bottom:3px">${methodLabel[l.method]||'✉ 편지'}</div>
      <div style="font-size:18px;font-weight:700;color:var(--ink);font-family:var(--font-sans)">${l.name||'무명의 누군가'}</div>
    </div>
    <button onclick="closeLetterDetail()" style="background:none;border:none;font-size:22px;color:var(--ink3);cursor:pointer;padding:4px">✕</button>
  </div>
  <div class="letter-detail-body">
    ${l.phone ? `<div class="ldb-row"><span class="ldb-label">전화번호</span><span class="ldb-val">${l.phone}</span></div>` : ''}
    ${l.insta ? `<div class="ldb-row"><span class="ldb-label">인스타</span><span class="ldb-val">@${l.insta}</span></div>` : ''}
    ${l.school ? `<div class="ldb-row"><span class="ldb-label">학교/직장</span><span class="ldb-val">${l.school}</span></div>` : ''}
    ${l.gender ? `<div class="ldb-row"><span class="ldb-label">성별</span><span class="ldb-val">${l.gender}</span></div>` : ''}
    ${l.hint ? `<div class="ldb-row"><span class="ldb-label">내 메모</span><span class="ldb-val" style="font-style:italic;color:var(--ink2)">${l.hint}</span></div>` : ''}
    <div class="ldb-row"><span class="ldb-label">발송일</span><span class="ldb-val">${l.sentAt}</span></div>
  </div>
  ${!l.cancelled ? `
  <div style="border-top:1px solid #e0c878;padding-top:14px">
    <button class="btn-secondary" style="max-width:100%;margin:0;font-size:13px;padding:12px;border-color:#c01808;color:var(--red2)" onclick="closeLetterDetail();useCancelTicket(${l.id})">
      ${cancelTicketSVG(16)} 취소권으로 편지 취소하기
    </button>
  </div>` : `
  <div style="text-align:center;padding:8px 0;font-size:12px;color:var(--ink3);font-family:var(--font-sans)">취소된 편지예요</div>`}
</div>`;

  ov.style.opacity = '0';
  ov.style.transition = 'opacity 0.25s ease';
  ov.style.display = 'flex';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });
}

function closeLetterDetail() {
  const ov = document.getElementById('overlay-letter-detail');
  if (!ov) return;
  ov.style.transition = 'opacity 0.2s ease';
  ov.style.opacity = '0';
  setTimeout(() => { ov.style.display = 'none'; ov.style.opacity = '1'; }, 220);
}

function useCancelTicket(letterId) {
  const letter = state.sentLetters.find(l => l.id === letterId);
  if (!letter || letter.cancelled) return;
  if (state.cancelTickets < 1) {
    toast('취소권이 없어요. 코인 화면에서 구매해주세요.');
    return;
  }
  showConfirm({
    title: '편지를 취소할까요?',
    desc: '취소하면 되돌릴 수 없어요.\n취소권 1개가 사용돼요.',
    confirmLabel: '취소권 사용 · 취소하기',
    cancelLabel: '아니요',
    onConfirm: () => {
      state.cancelTickets -= 1;
      letter.cancelled = true;
      closeLetterDetail();
      renderRegister();
      toast('편지가 취소됐어요.');
    }
  });
}



function renderSentLetters() {
  const el = document.getElementById('screen-sent');
  if (!el) return;
  const methodLabel = { phone: '📱 전화번호', insta: '📸 인스타', info: '🔍 이름+정보' };
  const letters = state.sentLetters;

  el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <button class="back-btn" onclick="closeSentLetters()">&larr;</button>
  <div class="top-title">내가 보낸 편지</div>
  <div style="font-size:11px;color:var(--ink3);font-family:var(--font-sans)">취소권 ${state.cancelTickets}개 보유</div>
</div>
<div class="scroll-content paper-bg">
  ${state.nominated.length + letters.length === 0 ? `
    <div style="text-align:center;padding:48px 0;color:var(--ink3);font-family:var(--font-serif);font-style:italic">
      아직 보낸 편지가 없어요
    </div>
  ` : ''}
  ${letters.map(l => `
  <div class="sent-letter-item ${l.cancelled ? 'cancelled' : ''}">
    <div class="sli-left">
      <div class="sli-method">${methodLabel[l.method] || '✉ 편지'}</div>
      <div class="sli-target">${
        l.method === 'phone' ? l.phone :
        l.method === 'insta' ? '@' + l.insta :
        l.name + ' · ' + l.school + ' · ' + l.gender
      }</div>
      ${l.hint ? `<div class="sli-hint">메모: ${l.hint}</div>` : ''}
      <div class="sli-date">${l.sentAt} 발송</div>
    </div>
    <div class="sli-right">
      ${l.cancelled
        ? `<div class="sli-cancelled-badge">취소됨</div>`
        : `<button class="sli-cancel-btn" onclick="useCancelTicket(${l.id})">
            취소권 사용
            <div style="font-size:9px;opacity:0.75;margin-top:1px">🎫 1개 사용</div>
          </button>`
      }
    </div>
  </div>`).join('')}

  ${state.cancelTickets === 0 ? `
  <div class="onboard-notice" style="margin-top:12px">
    ${envelopeSVG(20)}
    <p>편지 취소권이 없어요. 코인 화면에서 🪙100에 구매할 수 있어요.</p>
  </div>
  <button class="btn-primary" style="max-width:100%;margin-top:8px" onclick="slideTo(MAIN_SCREENS.indexOf('coins'));renderCoins();closeSentLetters()">
    취소권 구매하러 가기
  </button>` : ''}
</div>`;
}

function closeSentLetters() {
  const el = document.getElementById('screen-sent');
  if (el) el.classList.remove('active');
  state.screen = MAIN_SCREENS[state.currentTabIdx || 4];
  updateNav(state.screen);
}

function openPaymentHistory() {
  const ov = document.getElementById('overlay-confirm');
  const history = state.paymentHistory || [];
  const rows = history.length === 0
    ? `<div style="text-align:center;padding:24px 0;font-size:13px;color:var(--ink3);font-family:var(--font-sans);font-style:italic">결제 내역이 없어요</div>`
    : history.map(h => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:0.5px solid #ecdab8">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--ink);font-family:var(--font-sans)">${h.label}</div>
          <div style="font-size:11px;color:var(--ink3);font-family:var(--font-sans);margin-top:2px">${h.date}</div>
        </div>
        <div style="font-size:13px;font-weight:700;color:var(--red2);font-family:var(--font-sans)">${h.price}</div>
      </div>`).join('');

  ov.innerHTML = `
<div class="confirm-card" onclick="event.stopPropagation()" style="max-width:340px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
    <div class="confirm-title" style="margin:0">코인 결제 내역</div>
    <button onclick="hideConfirm()" style="background:none;border:none;font-size:20px;color:var(--ink3);cursor:pointer">✕</button>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;background:var(--paper3);border:1px solid #d0b878;border-radius:10px;padding:10px 14px;margin-bottom:14px">
    <div style="font-size:12px;color:var(--ink2);font-family:var(--font-sans)">현재 보유</div>
    <div style="font-size:16px;font-weight:700;color:var(--ink);font-family:var(--font-sans)">${state.user.coins.toLocaleString()} 코인</div>
  </div>
  <div style="max-height:240px;overflow-y:auto;-webkit-overflow-scrolling:touch">${rows}</div>
  <button class="confirm-btn-cancel" style="margin-top:16px" onclick="hideConfirm()">닫기</button>
</div>`;
  ov.style.opacity = '0';
  ov.style.transition = 'opacity 0.22s ease';
  ov.style.display = 'flex';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });
}

function openAccountSettings() {
  const ov = document.getElementById('overlay-confirm');
  ov.innerHTML = `
<div class="confirm-card" onclick="event.stopPropagation()" style="max-width:340px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
    <div class="confirm-title" style="margin:0">계정 설정</div>
    <button onclick="hideConfirm()" style="background:none;border:none;font-size:20px;color:var(--ink3);cursor:pointer">✕</button>
  </div>

  <div style="font-size:11px;color:var(--ink3);font-family:var(--font-sans);font-weight:700;letter-spacing:0.5px;margin-bottom:10px;text-align:left">알림</div>
  <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #ecdab8;margin-bottom:16px;background:#f5e8c8;border-radius:10px;border:1px solid #d8c080">
    <div style="font-size:13px;font-weight:700;color:var(--ink);font-family:var(--font-sans)">매칭 알림</div>
    <div id="notifBtn" onclick="toggleNotif()" style="width:48px;height:26px;background:${state.notifOn!==false?'#8b2010':'#c0b090'};border-radius:26px;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0">
      <div style="position:absolute;top:3px;width:20px;height:20px;background:white;border-radius:50%;transition:transform .2s;transform:translateX(${state.notifOn!==false?'25':'3'}px)"></div>
    </div>
  </div>

  <div style="font-size:11px;color:var(--ink3);font-family:var(--font-sans);font-weight:700;letter-spacing:0.5px;margin-bottom:10px;text-align:left">계정</div>
  <button onclick="event.stopPropagation();hideConfirm();setTimeout(logout,250)" style="width:100%;padding:11px;background:var(--paper3);border:1px solid #d0b878;border-radius:10px;font-size:13px;font-weight:700;color:var(--ink2);font-family:var(--font-sans);cursor:pointer;margin-bottom:8px;text-align:center">
    🚪 로그아웃
  </button>
  <button onclick="event.stopPropagation();hideConfirm();setTimeout(confirmReset,300)" style="width:100%;padding:11px;background:var(--paper3);border:1px solid #e0a0a0;border-radius:10px;font-size:13px;font-weight:700;color:var(--red2);font-family:var(--font-sans);cursor:pointer;text-align:center">
    ⚠️ 계정 초기화
  </button>
</div>`;
  ov.style.opacity = '0';
  ov.style.transition = 'opacity 0.22s ease';
  ov.style.display = 'flex';
  requestAnimationFrame(() => { ov.style.opacity = '1'; });
}

function toggleNotif() {
  state.notifOn = state.notifOn === false ? true : false;
  const btn = document.getElementById('notifBtn');
  if (btn) {
    btn.style.background = state.notifOn ? '#8b2010' : '#c0b090';
    btn.querySelector('div').style.transform = `translateX(${state.notifOn ? '24' : '3'}px)`;
  }
}

function confirmReset() {
  showConfirm({
    title: '계정을 초기화할까요?',
    desc: '모든 편지와 매칭 정보가\n삭제되며 되돌릴 수 없어요.',
    confirmLabel: '초기화하기',
    cancelLabel: '취소',
    onConfirm: () => {
      state.sentLetters = [];
      state.nominated = [];
      state.letters = [];
      state.user.coins = 0;
      state.cancelTickets = 0;
      state.countUnlocked = false;
      state.revealedCount = 0;
      state.paymentHistory = [];
      state.attendedDate = null;
      const splash = document.getElementById('screen-splash');
      if (splash) splash.classList.add('active');
      state.screen = 'splash';
    }
  });
}

function openSentLetters() {
  const el = document.getElementById('screen-sent');
  if (el) { el.classList.add('active'); state.screen = 'sent'; updateNav('sent'); }
  renderSentLetters();
}

function renderProfile() {
  const el = document.getElementById('screen-profile');
  el.innerHTML = `
<div class="top-bar paper-bg" style="flex-shrink:0">
  <div class="top-title">나</div>
</div>
<div class="scroll-content paper-bg">
  <div class="profile-header anim-fade">
    <div class="profile-avatar-big">${state.user.name[0]}</div>
    <div class="profile-name">${state.user.name}</div>
    <div class="profile-handle">${state.user.handle} · ${state.user.school}</div>
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-num">${state.sentLetters.length + state.nominated.length}</div>
        <div class="stat-lbl">내가 지목</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${state.revealedCount}</div>
        <div class="stat-lbl">나를 지목</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${state.letters.filter(l=>l.matched).length}</div>
        <div class="stat-lbl">매칭 성공</div>
      </div>
    </div>
  </div>

  <div class="profile-menu-list anim-up">
    <div class="pml-item" onclick="state.regTab='sent';slideTo(MAIN_SCREENS.indexOf('register'));renderRegister()">
      <span class="pml-label">내가 보낸 편지</span>
      <span class="pml-value">${state.sentLetters.length + state.nominated.length}개</span>
    </div>
    <div class="pml-item" onclick="openPaymentHistory()">
      <span class="pml-label">코인 결제 내역</span>
      <span class="pml-value">${state.user.coins.toLocaleString()}코인 보유</span>
    </div>
    <div class="pml-item" onclick="openAccountSettings()">
      <span class="pml-label">계정 설정</span>
      <span class="pml-value">›</span>
    </div>
    <div class="pml-item" onclick="toast('문의: connect@example.com')">
      <span class="pml-label">문의하기</span>
      <span class="pml-value">›</span>
    </div>
    <div class="pml-item" onclick="toast('이용약관 (곧 출시)')">
      <span class="pml-label">이용약관 · 개인정보처리방침</span>
      <span class="pml-value">›</span>
    </div>
  </div>

  <div style="text-align:center;margin-top:20px;font-size:10px;color:var(--ink3);font-family:var(--font-sans);line-height:1.8">
    connect v1.0.0<br/>ⓒ 2025 connect. All rights reserved.
  </div>
</div>`;
}

function logout() {
  showConfirm({
    title: '로그아웃 할까요?',
    desc: '다음에 다시 로그인하면\n돼요.',
    confirmLabel: '로그아웃',
    cancelLabel: '취소',
    onConfirm: () => {
      const splash = document.getElementById('screen-splash');
      if (splash) splash.classList.add('active');
      state.screen = 'splash';
    }
  });
}

// ── ONBOARDING ───────────────────────────
function renderOnboard() {
  const s = state.onboardStep;
  const steps = [
    { title: '전화번호 인증', desc: '본인 확인을 위해 전화번호를 입력해주세요.', field: 'tel', placeholder: '010-0000-0000', label: '전화번호', btnLabel: '인증번호 받기' },
    { title: '인스타그램 아이디', desc: '매칭 후 상대방에게 공개돼요.', field: 'text', placeholder: '@username', label: '인스타그램 아이디', btnLabel: '다음' },
    { title: '이름 · 학교/직장', desc: '마지막이에요! 거의 다 왔어요 ☺️', field: 'text', placeholder: '김지은', label: '이름', sub: true, btnLabel: '시작하기' },
  ];
  const cur = steps[s-1];
  const el = document.getElementById('screen-onboard');
  el.innerHTML = `
<div class="onboard-header paper-bg" style="flex-shrink:0">
  <button class="back-btn" onclick="${s===1?"go('splash')":'prevStep()'}">&larr;</button>
  <div class="onboard-step">${s} / ${steps.length}</div>
</div>
<div class="step-bar paper-bg" style="flex-shrink:0">
  <div class="step-bar-fill" style="--bar-from:${Math.round((s-1)/steps.length*100)}%;--bar-to:${Math.round(s/steps.length*100)}%;width:${Math.round(s/steps.length*100)}%"></div>
</div>
<div class="onboard-body paper-bg">
  <div class="onboard-title anim-up">${cur.title}</div>
  <div class="onboard-desc anim-up" style="animation-delay:0.05s">${cur.desc}</div>
  <div class="inp-group anim-up" style="animation-delay:0.1s">
    <div class="inp-label">${cur.label}</div>
    <input class="inp-field" type="${cur.field}" placeholder="${cur.placeholder}" id="ob-field"/>
  </div>
  ${cur.sub ? `<div class="inp-group anim-up" style="animation-delay:0.15s"><div class="inp-label">학교 또는 직장</div><input class="inp-field" placeholder="예: 연세대학교" id="ob-sub"/></div>` : ''}
  <div class="onboard-footer">
    <div class="onboard-notice anim-up" style="animation-delay:0.18s">
      ${envelopeSVG(20)}
      <p>개인정보는 매칭 외 어떤 용도로도 사용되지 않아요.</p>
    </div>
    <button class="btn-primary" onclick="nextStep()">${cur.btnLabel}</button>
  </div>
</div>`;
}

function nextStep() {
  if (state.onboardStep < 3) { state.onboardStep++; renderOnboard(); go('onboard'); }
  else {
    state.onboardStep = 1;
    const ob = document.getElementById('screen-onboard');
    if (ob) ob.classList.remove('active');
    state.currentTabIdx = 2;
    slideTo(2);
    setTimeout(showAttendOverlay, 600);
  }
}
function prevStep() { if (state.onboardStep > 1) { state.onboardStep--; renderOnboard(); go('onboard'); } }

// ── CHAT ────────────────────────────────
function openChat(id) {
  const letter = state.letters.find(l => l.id === id);
  if (!letter) return;
  letter.isNew = false;
  state.chatOpen = letter;
  renderChat();
  const chatEl = document.getElementById('screen-chat');
  if (chatEl) chatEl.classList.add('active');
  state.screen = 'chat';
  updateNav('chat');
  const nav = document.getElementById('mainNavBar');
  if (nav) nav.style.display = 'none';
}

function closeChat() {
  const el = document.getElementById('screen-chat');
  if (el) el.classList.remove('active');
  const nav = document.getElementById('mainNavBar');
  if (nav) nav.style.display = '';
  state.screen = MAIN_SCREENS[state.currentTabIdx || 3];
  updateNav(state.screen);
  renderInbox();
}

function renderChat() {
  const l = state.chatOpen;
  if (!l) return;
  const el = document.getElementById('screen-chat');
  const msgsHTML = l.msgs.map(m => `
<div class="bubble-wrap ${m.me?'me':'them'}">
  <div class="bubble ${m.me?'me':'them'}">${m.text}</div>
  <div class="bubble-time">${m.time}</div>
</div>`).join('');

  el.innerHTML = `
<div class="chat-header paper-bg" style="flex-shrink:0">
  <button class="back-btn" onclick="closeChat()">&larr;</button>
  <div class="chat-avatar">${l.initials}</div>
  <div>
    <div class="chat-name">${l.name}</div>
    <div class="chat-status">● 매칭됨</div>
  </div>
</div>
<div class="chat-messages paper-bg" id="chatMsgs" style="flex:1">${msgsHTML}</div>
<div class="chat-input-row paper-bg">
  <input class="chat-input" placeholder="메시지를 입력하세요..." id="chatInput" onkeydown="if(event.key==='Enter')sendMsg()"/>
  <button class="chat-send" onclick="sendMsg()">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9L16 2L10 16L8.5 10L2 9Z" fill="white" stroke="white" stroke-width="0.5" stroke-linejoin="round"/></svg>
  </button>
</div>`;
  setTimeout(() => {
    const msgs = document.getElementById('chatMsgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
}

function sendMsg() {
  const inp = document.getElementById('chatInput');
  const txt = inp.value.trim();
  if (!txt || !state.chatOpen) return;
  const now = new Date();
  const time = `${['일','월','화','수','목','금','토'][now.getDay()]} 오후 ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  state.chatOpen.msgs.push({ me: true, text: txt, time });
  inp.value = '';
  renderChat();
  go('chat');
}

// ── REVEAL OVERLAY ───────────────────────
function unlockCount() {
  // 500코인 잠금 제거 — 모든 사람이 무료로 볼 수 있음
  state.countUnlocked = true;
  slideTo(2);
  showRevealOverlay();
}

function refreshCount() {
  if (state.user.coins < 150) { toast('코인이 부족해요 (150코인 필요)'); return; }
  state.user.coins -= 150;
  state.revealedCount += Math.random() > 0.5 ? 1 : 0;
  updateCoinUI();
  slideTo(2);
  showRevealOverlay();
}

function showRevealOverlay() {
  const count = state.revealedCount;
  const ov = document.getElementById('overlay-reveal');

  // build full-screen content
  ov.innerHTML = `
<div class="reveal-top-label">connect</div>
<div class="reveal-postmark-corner">CONNECT<br/>SUNDAY<br/>✉</div>

<div class="reveal-body">
  <div class="reveal-mailbox-wrap" id="revealMb"></div>
  <div class="reveal-count-big" id="revealNum">${count >= 5 ? '5+' : count}</div>
  <div class="reveal-count-lbl" id="revealLbl">${count >= 5 ? '5명 이상이' : count + '명이'} 편지를 보냈어요</div>
  <div class="reveal-hint" id="revealHint">서로 지목해야만 일요일에 매칭 알림이 와요 💌</div>
  <button class="reveal-ok-btn" id="revealClose" onclick="closeReveal()">확인했어요</button>
</div>`;

  // show overlay with entrance anim
  ov.classList.add('active', 'entering');
  setTimeout(() => ov.classList.remove('entering'), 350);

  // render closed mailbox first
  document.getElementById('revealMb').innerHTML = mailboxSVG(Math.min(count, 5), false);

  // open door after short pause
  setTimeout(() => {
    document.getElementById('revealMb').innerHTML = mailboxSVG(Math.min(count, 5), true);
  }, 480);

  // reveal count and text sequentially
  const showEl = (id, delay) => setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
  }, delay);

  showEl('revealNum',   1500);
  showEl('revealLbl',   1680);
  showEl('revealHint',  1900);
  showEl('revealClose', 2150);
}



function closeReveal() {
  const ov = document.getElementById('overlay-reveal');
  ov.classList.add('leaving');
  setTimeout(() => {
    ov.classList.remove('active', 'leaving');
    renderHome();
    slideTo(2);
  }, 400);
}

// ── BUILD DOM ─────────────────────────────
function buildApp() {
  document.getElementById('app').innerHTML = `
<!-- SWIPE EDGES -->
<div class="swipe-edge left" id="edge-left"></div>
<div class="swipe-edge right" id="edge-right"></div>

<!-- SWIPE DOTS -->
<div class="swipe-dots" id="swipe-dots">
  <div class="swipe-dot active"></div>
  <div class="swipe-dot"></div>
  <div class="swipe-dot"></div>
  <div class="swipe-dot"></div>
  <div class="swipe-dot"></div>
</div>

<!-- SWIPE WRAPPER (main 5 tabs) -->
<div id="swipe-container">
<div id="screen-wrapper">
  <div id="screen-coins" class="screen paper-bg"></div>
  <div id="screen-register" class="screen paper-bg"></div>
  <div id="screen-home" class="screen paper-bg"></div>
  <div id="screen-inbox" class="screen paper-bg"></div>
  <div id="screen-profile" class="screen paper-bg"></div>
</div>
</div>

<!-- OVERLAY SCREENS -->
<div id="screen-splash" class="screen-overlay paper-bg active">
  <div class="splash-inner">
    <div class="splash-envelope">${envelopeSVG(88)}</div>
    <div class="splash-title">connect</div>
    <div class="splash-sub">용기 없어도 괜찮아요</div>
    <div class="splash-btn-group">
      <button class="btn-primary" onclick="startOnboard()">알겠어요, 다음</button>
      <button class="btn-secondary" onclick="closeSplash()">이미 계정이 있어요</button>
    </div>
    <div style="margin-top:24px;font-size:10px;color:var(--ink3);font-family:var(--font-sans);text-align:center;line-height:1.8">
      서비스 이용약관 · 개인정보처리방침
    </div>
  </div>
</div>

<div id="screen-onboard" class="screen-overlay paper-bg"></div>






<div id="screen-chat" class="screen-overlay paper-bg" style="overflow:hidden"></div>
<div id="screen-sent" class="screen-overlay paper-bg"></div>

<!-- NAV BAR -->
<div id="nav-bar" class="nav-bar" style="display:none">
  <button class="nav-item" data-screen="coins" onclick="go('coins',{render:renderCoins})">
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 7v10M9.5 9.5C9.5 8.4 10.6 8 12 8s2.5.9 2.5 2c0 1-.7 1.6-2.5 2s-2.5.9-2.5 2c0 1.1 1.1 2 2.5 2s2.5-.4 2.5-1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>
    <span class="nav-label">코인</span>
  </button>
  <button class="nav-item" data-screen="register" onclick="go('register',{render:renderRegister})">
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="nav-label">편지 쓰기</span>
  </button>
  <button class="nav-item" data-screen="home" onclick="go('home',{render:renderHome})">
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M9 21V12h6v9" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    <span class="nav-label">홈</span>
  </button>
  <button class="nav-item" data-screen="inbox" onclick="go('inbox',{render:renderInbox})">
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 9l9 6 9-6" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    <span class="nav-label">우편함</span>
  </button>
  <button class="nav-item" data-screen="profile" onclick="go('profile',{render:renderProfile})">
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="nav-label">나</span>
  </button>
</div>

<!-- REVEAL OVERLAY -->
<div id="overlay-reveal"></div>
<div id="overlay-attend" style="display:none;position:fixed;inset:0;z-index:250;background:rgba(58,30,8,0.72);align-items:center;justify-content:center;padding:24px"></div>
<div id="overlay-confirm" style="display:none;position:fixed;inset:0;z-index:300;background:rgba(58,30,8,0.7);align-items:center;justify-content:center;padding:24px" onclick="hideConfirm()"></div>
<div id="overlay-letter-detail" style="display:none;position:fixed;inset:0;z-index:160;background:rgba(58,30,8,0.65);align-items:center;justify-content:center;padding:24px" onclick="closeLetterDetail()"></div>
<div id="overlay-sunday" style="display:none;position:fixed;inset:0;z-index:150;background:rgba(58,30,8,0.65);align-items:center;justify-content:center;padding:24px" onclick="closeSundayDetail()"></div>

<!-- TOAST -->
<div id="toast"></div>`;

  updateNav('splash');
}

function startOnboard() {
  state.onboardStep = 1;
  renderOnboard();
  const el = document.getElementById('screen-onboard');
  if (el) el.classList.add('active');
  const splash = document.getElementById('screen-splash');
  if (splash) { splash.classList.remove('active'); }
  state.screen = 'onboard';
  updateNav('onboard');
}

// ── SWIPE ENGINE ──────────────────────────
function initSwipe() {
  const container = document.getElementById('swipe-container');
  if (!container) return;

  let startX = 0, startY = 0, startTime = 0;
  let isDragging = false, isScrolling = null;
  let currentX = 0;
  const wrapper = document.getElementById('screen-wrapper');

  function getIdx() { return state.currentTabIdx || 0; }

  function onStart(x, y) {
    // don't swipe if inside a scrollable element
    startX = x; startY = y; startTime = Date.now();
    isDragging = true; isScrolling = null;
    currentX = getIdx() * -100;
    wrapper.style.transition = 'none';
  }

  function onMove(x, y) {
    if (!isDragging) return;
    const dx = x - startX;
    const dy = y - startY;
    if (isScrolling === null) {
      isScrolling = Math.abs(dy) > Math.abs(dx) + 4;
    }
    if (isScrolling) { isDragging = false; return; }
    const idx = getIdx();
    let pct = currentX + (dx / window.innerWidth * 100);
    // rubber-band resistance at edges — moves but with friction (1/3 speed)
    if (idx === 0 && dx > 0) {
      const rubberDx = dx * 0.28;
      pct = rubberDx / window.innerWidth * 100;
    }
    if (idx === MAIN_SCREENS.length - 1 && dx < 0) {
      const rubberDx = dx * 0.28;
      pct = currentX + (rubberDx / window.innerWidth * 100);
    }
    wrapper.style.transform = `translateX(${pct}%)`;
    // edge flash
    const edgeL = document.getElementById('edge-left');
    const edgeR = document.getElementById('edge-right');
    if (edgeL) edgeL.style.opacity = dx > 8 && idx === 0 ? Math.min(dx/60, 1).toString() : '0';
    if (edgeR) edgeR.style.opacity = dx < -8 && idx === MAIN_SCREENS.length-1 ? Math.min(-dx/60, 1).toString() : '0';
  }

  function onEnd(x) {
    if (!isDragging || isScrolling) { isDragging = false; return; }
    isDragging = false;
    const dx = x - startX;
    const dt = Date.now() - startTime;
    const velocity = Math.abs(dx) / dt; // px/ms
    const threshold = velocity > 0.3 ? 30 : window.innerWidth * 0.28;
    const idx = getIdx();
    wrapper.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1)';
    const edgeL = document.getElementById('edge-left');
    const edgeR = document.getElementById('edge-right');
    if (edgeL) edgeL.style.opacity = '0';
    if (edgeR) edgeR.style.opacity = '0';

    if (dx < -threshold && idx < MAIN_SCREENS.length - 1) {
      slideTo(idx + 1);
    } else if (dx > threshold && idx > 0) {
      slideTo(idx - 1);
    } else {
      // spring snap back
      wrapper.style.transition = 'transform 0.45s cubic-bezier(0.25,1.5,0.5,1)';
      wrapper.style.transform = `translateX(-${idx * 100}%)`;
      setTimeout(() => { wrapper.style.transition = 'transform 0.38s cubic-bezier(0.4,0,0.2,1)'; }, 450);
    }
  }

  // Touch events
  container.addEventListener('touchstart', e => {
    if (!MAIN_SCREENS.includes(state.screen)) return;
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  container.addEventListener('touchmove', e => {
    onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  container.addEventListener('touchend', e => {
    onEnd(e.changedTouches[0].clientX);
  });

  // Mouse events (desktop)
  container.addEventListener('mousedown', e => {
    if (!MAIN_SCREENS.includes(state.screen)) return;
    if (e.button !== 0) return;
    onStart(e.clientX, e.clientY);
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    onMove(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    onEnd(e.clientX);
  });

  // Keyboard arrow navigation (desktop)
  window.addEventListener('keydown', e => {
    if (!MAIN_SCREENS.includes(state.screen)) return;
    const idx = getIdx();
    if (e.key === 'ArrowRight' && idx < MAIN_SCREENS.length - 1) slideTo(idx + 1);
    if (e.key === 'ArrowLeft' && idx > 0) slideTo(idx - 1);
  });
}

function initRubberScrollEl(el) {
  if (el._rubberInit) return;
  el._rubberInit = true;
  let startY = 0, pulling = false;
  el.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY; pulling = false;
    el.style.transition = 'none';
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    const dy = e.touches[0].clientY - startY;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if ((atTop && dy > 0) || (atBottom && dy < 0)) {
      pulling = true;
      el.style.transform = `translateY(${dy * 0.28}px)`;
    }
  }, { passive: true });
  el.addEventListener('touchend', () => {
    if (!pulling) return;
    el.style.transition = 'transform 0.42s cubic-bezier(0.25,1.5,0.5,1)';
    el.style.transform = 'translateY(0)';
    pulling = false;
    setTimeout(() => { el.style.transition = ''; }, 450);
  });
  el.addEventListener('wheel', e => {
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
      const bump = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.22, 16);
      el.style.transition = 'none';
      el.style.transform = `translateY(${-bump}px)`;
      clearTimeout(el._wt);
      el._wt = setTimeout(() => {
        el.style.transition = 'transform 0.4s cubic-bezier(0.25,1.5,0.5,1)';
        el.style.transform = 'translateY(0)';
        setTimeout(() => { el.style.transition = ''; }, 420);
      }, 60);
    }
  }, { passive: true });
}

function initRubberScroll() {
  // Apply rubber-band overscroll to all .screen elements
  document.querySelectorAll('.screen').forEach(el => {
    let startY = 0;
    let pulling = false;
    let pullDist = 0;

    el.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      pulling = false; pullDist = 0;
      el.style.transition = 'none';
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      const dy = e.touches[0].clientY - startY;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      if ((atTop && dy > 0) || (atBottom && dy < 0)) {
        pulling = true;
        pullDist = dy * 0.32; // resistance
        el.style.transform = `translateY(${pullDist}px)`;
      }
    }, { passive: true });

    el.addEventListener('touchend', () => {
      if (!pulling) return;
      el.style.transition = 'transform 0.42s cubic-bezier(0.25, 1.5, 0.5, 1)';
      el.style.transform = 'translateY(0)';
      pulling = false;
      setTimeout(() => { el.style.transition = ''; }, 450);
    });

    // Desktop mouse wheel overscroll
    el.addEventListener('wheel', e => {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        const bump = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.25, 18);
        el.style.transition = 'none';
        el.style.transform = `translateY(${-bump}px)`;
        clearTimeout(el._wheelTimer);
        el._wheelTimer = setTimeout(() => {
          el.style.transition = 'transform 0.4s cubic-bezier(0.25,1.5,0.5,1)';
          el.style.transform = 'translateY(0)';
          setTimeout(() => { el.style.transition = ''; }, 420);
        }, 60);
      }
    }, { passive: true });
  });
}

function closeSplash() {
  const splash = document.getElementById('screen-splash');
  if (splash) {
    splash.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    splash.style.opacity = '0';
    splash.style.transform = 'scale(1.04)';
    setTimeout(() => {
      splash.classList.remove('active');
      splash.style.opacity='';
      splash.style.transform='';
      // show attendance popup after splash is fully gone
      setTimeout(showAttendOverlay, 600);
    }, 400);
  }
  state.currentTabIdx = 2;
  slideTo(2);
}

// ── INIT ─────────────────────────────────
buildApp();
state.currentTabIdx = 2;
setTimeout(() => {
  initSwipe();
  renderHome();
  setTimeout(initRubberScroll, 100);
}, 50);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
