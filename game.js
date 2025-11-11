// Data derived from Ingredients.txt, Actions cards.txt, and Gameplay 1 Rules.txt
// Deck spec (initial scope): 108 Ingredient (27 x4), 16 Action (8 x2), 1 Wild

/** Ingredients (27 unique across 9 categories), excluding OUT and Wild Card rows */
const INGREDIENTS = [
  { name: "Coffin Nails", category: "Occult Rituals" },
  { name: "Ashes of a Burnt Letter", category: "Occult Rituals" },
  { name: "Eye of Newt", category: "Occult Rituals" },

  { name: "Hair of a Virgin", category: "Body & Transformation" },
  { name: "Spider Silk", category: "Body & Transformation" },
  { name: "Mermaid Scale", category: "Body & Transformation" },

  { name: "Nightshade", category: "Sacred Herbs & Botanicals" },
  { name: "Yew Tree Branch", category: "Sacred Herbs & Botanicals" },
  { name: "Whispering Bark", category: "Sacred Herbs & Botanicals" },

  { name: "White Sage", category: "Purification & Blessing" },
  { name: "Four Leaf Clover", category: "Purification & Blessing" },
  { name: "Frankincense", category: "Purification & Blessing" },

  { name: "Unicorn Hair", category: "Mythical Beasts" },
  { name: "Manticore Venom", category: "Mythical Beasts" },
  { name: "Fairy Dust", category: "Mythical Beasts" },

  { name: "Graveyard Dirt", category: "Death & the Beyond" },
  { name: "Ghoul Tongue", category: "Death & the Beyond" },
  { name: "Raven Feather", category: "Death & the Beyond" },

  { name: "Moonstone Powder", category: "Celestial & Dream Magic" },
  { name: "Starflower", category: "Celestial & Dream Magic" },
  { name: "Lightning Bug Glow", category: "Celestial & Dream Magic" },

  { name: "Clear Quartz", category: "Crystals & Earthbound Magic" },
  { name: "Amethyst", category: "Crystals & Earthbound Magic" },
  { name: "Crushed Pearl", category: "Crystals & Earthbound Magic" },

  { name: "Pumpkin Guts", category: "Witch’s Pantry" },
  { name: "Ghost Pepper Essence", category: "Witch’s Pantry" },
  { name: "Bat Wing", category: "Witch’s Pantry" }
];

/** Action cards (types with default 2 copies unless specified) */
const ACTIONS = [
  { name: "Circle Breaker", desc: "Skip the next player's turn" },
  { name: "Twist of Fate", desc: "Reverse direction of play" },
  { name: "Venom Brew", desc: "Target player discards 1 random card" },
  { name: "Astral Projection", desc: "Peek top 3, keep 1, reorder rest" },
  { name: "Foul Elixir", desc: "You discard 2 random cards" },
  { name: "Crackling Cauldron", desc: "Draw 1 extra; keep +1 total until your next meld" },
  { name: "Hex Seal", desc: "Block a category for the table until replaced" },
  { name: "Thief's Gamble", desc: "Blind-pick 1 from a player's hand; then discard 1" },
  { name: "Summon from beyond", desc: "Choose any player's discard pile; take 1 card from it", copies: 3 }
];

const WILD_CARD = { name: "Secret Ingredient", category: "Wild Card" };

const COPIES_PER_INGREDIENT = 4; // 27 * 4 = 108
const COPIES_PER_ACTION = 3; // default copies for each Action card
const HAND_SIZE = 9; // per Gameplay 1 Rules

/**
 * Utility: shuffle array in-place (Fisher-Yates)
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Reshuffle mechanics: when the deck is empty and a draw is attempted,
// gather ALL players' discard piles, shuffle, and create a new deck.
function reshuffleDiscardsIntoDeck() {
  const collected = [];
  for (const p of state.players) {
    while (p.discard.length) {
      collected.push(p.discard.pop());
    }
  }
  if (collected.length === 0) return false;
  shuffle(collected);
  // Place as new deck
  state.deck = collected;
  return true;
}

function safeDrawOne() {
  if (state.deck.length === 0) {
    const ok = reshuffleDiscardsIntoDeck();
    if (!ok) return null;
  }
  return state.deck.pop() || null;
}

function buildDeck() {
  const deck = [];

  // Ingredient cards
  for (const ing of INGREDIENTS) {
    for (let i = 0; i < COPIES_PER_INGREDIENT; i++) {
      deck.push({
        id: `ING-${ing.name}-${i}`,
        type: "ingredient",
        name: ing.name,
        category: ing.category
      });
    }
  }

  // Action cards
  for (const act of ACTIONS) {
    const copies = act.copies != null ? act.copies : COPIES_PER_ACTION;
    for (let i = 0; i < copies; i++) {
      deck.push({
        id: `ACT-${act.name}-${i}`,
        type: "action",
        name: act.name,
        desc: act.desc,
        category: "Action"
      });
    }
  }

  // Wild card
  deck.push({ id: `WILD-0`, type: "wild", name: WILD_CARD.name, category: WILD_CARD.category });

  return shuffle(deck);
}

const state = {
  players: [],
  activePlayer: 0,
  deck: [],
  turnPhase: "draw", // "draw" | "discard"
  selectedIndices: [], // indices in active player's hand
  gameOver: false,
  winnerId: null,
  direction: 1,
  skipNextCount: 0,
  blockEffect: null, // { category: string, turnsRemaining: number }
  discardsThisTurn: 0,
  pendingAction: null,
  minDiscardsThisTurn: 0,
  tempHandBonus: 0,
  dragIndex: null,
  round: 1,
};

function createPlayers(count) {
  const players = [];
  for (let i = 0; i < count; i++) {
    players.push({ id: i, name: `Player ${i + 1}`, hand: [], discard: [], melds: [], tempHandBonus: 0, turns: 0 });
  }
  return players;
}

function dealInitialHands(deck, players) {
  for (let r = 0; r < HAND_SIZE; r++) {
    for (let p = 0; p < players.length; p++) {
      const card = deck.pop();
      if (card) players[p].hand.push(card);
    }
  }
}

// Rendering
const els = {
  home: document.getElementById("home"),
  game: document.getElementById("game"),
  startBtn: document.getElementById("startBtn"),
  onlineBtn: document.getElementById("onlineBtn"),
  playerCount: document.getElementById("playerCount"),
  playerName: document.getElementById("playerName"),
  deck: document.getElementById("deck"),
  deckCount: document.getElementById("deckCount"),
  players: document.getElementById("players"),
  activePlayerName: document.getElementById("activePlayerName"),
  prevPlayer: document.getElementById("prevPlayer"),
  nextPlayer: document.getElementById("nextPlayer"),
  phaseText: document.getElementById("phaseText"),
  overlay: document.getElementById("overlay"),
  modalContent: document.getElementById("modalContent"),
  blockedText: document.getElementById("blockedText"),
  roundCounter: document.getElementById("roundCounter"),
  hostStartBtn: document.getElementById("hostStartBtn"),
  winOverlay: document.getElementById("winOverlay"),
  winText: document.getElementById("winText"),
  playAgainBtn: document.getElementById("playAgainBtn"),
  bubbles: document.getElementById("bubbles"),
};

// Online mode
let socket = null;
let onlineMode = false;
let myId = null;
let roomStarted = false;
let roomHostId = null;

function renderDeck() {
  els.deck.innerHTML = "";
  const remaining = state.deck.length;
  els.deckCount.textContent = `Deck: ${remaining}`;
  if (!state.gameOver && !state.pendingAction && state.turnPhase === "draw" && remaining > 0) {
    els.deck.classList.add("clickable");
    els.deck.title = "Draw from deck";
  } else {
    els.deck.classList.remove("clickable");
    els.deck.removeAttribute("title");
  }
  const layers = Math.min(10, remaining); // draw up to 10 layered backs for visual stack
  for (let i = 0; i < layers; i++) {
    const back = document.createElement("div");
    back.className = "card back";
    back.style.setProperty("--i", String(i * 3));
    back.textContent = "Card";
    els.deck.appendChild(back);
  }
}

function cardElement(card, faceUp) {
  if (!faceUp) {
    const back = document.createElement("div");
    back.className = "card back";
    back.textContent = "Card";
    return back;
  }
  const el = document.createElement("div");
  el.className = `card ${card.type}`;

  const top = document.createElement("div");
  top.className = "meta";
  top.innerHTML = `<span class="pill ${categoryToClass(card.category)}">${card.category}</span>`;

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = card.name;

  if (card.type === "action" && card.desc) {
    const desc = document.createElement("div");
    desc.className = "meta";
    desc.textContent = card.desc;
    el.appendChild(top);
    el.appendChild(title);
    el.appendChild(desc);
    return el;
  }

  const bottom = document.createElement("div");
  bottom.className = "meta";
  bottom.textContent = card.type === "ingredient" ? "Ingredient" : (card.type === "action" ? "Action" : "Wild");

  el.appendChild(top);
  el.appendChild(title);
  el.appendChild(bottom);
  return el;
}

function categoryToClass(category) {
  switch (category) {
    case "Occult Rituals": return "cat-occult";
    case "Body & Transformation": return "cat-body";
    case "Sacred Herbs & Botanicals": return "cat-herbs";
    case "Purification & Blessing": return "cat-purification";
    case "Mythical Beasts": return "cat-mythical";
    case "Death & the Beyond": return "cat-death";
    case "Celestial & Dream Magic": return "cat-celestial";
    case "Crystals & Earthbound Magic": return "cat-crystals";
    case "Witch’s Pantry": return "cat-pantry";
    case "Action": return "cat-action";
    case "Wild Card": return "cat-wild";
    default: return "";
  }
}

function renderPlayers() {
  els.players.innerHTML = "";
  for (let idx = 0; idx < state.players.length; idx++) {
    const player = state.players[idx];
    const section = document.createElement("section");
    section.className = "player";
    if (idx === state.activePlayer) section.classList.add("active");

    const title = document.createElement("h2");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = player.name;
    const countSpan = document.createElement("span");
    countSpan.className = "meta";
    countSpan.textContent = `${player.hand.length} cards`;
    title.appendChild(nameSpan);
    title.appendChild(countSpan);

    // Discard + Melds row
    const discardWrap = document.createElement("div");
    discardWrap.className = "discard";
    const discardLabel = document.createElement("div");
    discardLabel.className = "label";
    discardLabel.textContent = "Discard:";
    const topDiscard = player.discard[player.discard.length - 1] || null;
    const discardTopEl = topDiscard ? cardElement(topDiscard, true) : (function(){
      const empty = document.createElement("div");
      empty.className = "card back";
      empty.textContent = "Empty";
      return empty;
    })();
    if (topDiscard && topDiscard.type !== "action" && !state.gameOver && !state.pendingAction && state.turnPhase === "draw" && idx !== state.activePlayer) {
      discardTopEl.classList.add("clickable");
      discardTopEl.title = `Draw top of ${player.name}'s discard`;
      discardTopEl.addEventListener("click", () => {
        if (onlineMode && socket) socket.emit('draw_from_discard', player.id);
        else drawFromDiscard(player.id);
      });
    }
    discardWrap.appendChild(discardLabel);
    discardWrap.appendChild(discardTopEl);

    const meldsWrap = document.createElement("div");
    meldsWrap.className = "melds";
    for (const meld of player.melds) {
      const meldEl = document.createElement("div");
      meldEl.className = "meld";
      meld.forEach((c, idx) => {
        const ce = cardElement(c, true);
        if (idx > 0) ce.style.marginLeft = "-60px"; // 50% overlap of 120px width
        meldEl.appendChild(ce);
      });
      meldsWrap.appendChild(meldEl);
    }

    const row = document.createElement("div");
    row.className = "discard-row";
    row.appendChild(discardWrap);
    row.appendChild(meldsWrap);

    const hand = document.createElement("div");
    hand.className = "hand";
    const isActive = onlineMode ? (player.id === myId) : (idx === state.activePlayer);
    player.hand.forEach((card, idx) => {
      const el = cardElement(card, isActive);
      if (isActive && !state.gameOver && !state.pendingAction) {
        el.setAttribute("draggable", "true");
        el.addEventListener("dragstart", () => { state.dragIndex = idx; });
        el.addEventListener("dragover", (e) => { e.preventDefault(); });
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          if (state.dragIndex == null) return;
          const from = state.dragIndex;
          const to = idx;
          if (from === to) { state.dragIndex = null; return; }
          const selfIdx = onlineMode ? state.players.findIndex(p => p.id === myId) : state.activePlayer;
          const arr = state.players[selfIdx].hand;
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          state.dragIndex = null;
          state.selectedIndices = [];
          // Persist order online
          if (onlineMode && socket) {
            const ids = arr.map(c => c.id).filter(Boolean);
            socket.emit('reorder', ids);
          }
          renderPlayers();
        });
      }
      if (!state.gameOver && !state.pendingAction && isActive && state.turnPhase === "discard") {
        if (card.type === "action") {
          el.classList.add("clickable");
          el.title = "Play or discard this action";
          el.addEventListener("click", () => chooseActionPlayOrDiscard(idx));
        } else {
          el.classList.add("clickable");
          if (state.selectedIndices.includes(idx)) el.classList.add("selected");
          el.title = state.selectedIndices.includes(idx) ? "Selected" : "Select for meld/discard";
          el.addEventListener("click", () => toggleSelect(idx));
        }
      }
      hand.appendChild(el);
    });

    section.appendChild(title);
    if ((player.tempHandBonus || 0) > 0) {
      const bonus = document.createElement("div");
      bonus.className = "hint";
      bonus.innerHTML = `<span class="pill bonus">+1 allowance until meld</span>`;
      section.appendChild(bonus);
    }
    section.appendChild(row);
    if (isActive) {
      const actions = document.createElement("div");
      actions.className = "actions";

      // Sorting tool always available to active player
      const sortBtn = document.createElement("button");
      sortBtn.className = "btn";
      sortBtn.textContent = "Sort by Category";
      sortBtn.addEventListener("click", sortActiveHandByCategory);
      actions.appendChild(sortBtn);

      if (state.turnPhase === "discard") {
        const selCount = state.selectedIndices.length;
        const canMeld = selCount === 3 && validateMeld(getSelectedCards());
        const maybeBlocked = selCount === 3 && !canMeld && isValidMeldIgnoringBlock(getSelectedCards()) && state.blockEffect;
        if (canMeld) {
          const meldBtn = document.createElement("button");
          meldBtn.className = "btn meld";
          meldBtn.textContent = "Meld Selected";
          meldBtn.addEventListener("click", () => {
            const ids = getSelectedCards().map(c => c.id);
            if (onlineMode && socket) socket.emit('meld', ids);
            else meldSelected();
          });
          actions.appendChild(meldBtn);
        }
        if (maybeBlocked) {
          const note = document.createElement("div");
          note.className = "hint";
          note.textContent = `Meld blocked by Hex Seal: ${state.blockEffect.category}`;
          actions.appendChild(note);
        }
        if (selCount === 1 && getRemainingDiscards() > 0) {
          const discardBtn = document.createElement("button");
          discardBtn.className = "btn discard";
          discardBtn.textContent = "Discard Selected";
          discardBtn.addEventListener("click", () => {
            const selfIdx = onlineMode ? state.players.findIndex(p => p.id === myId) : state.activePlayer;
            const sel = state.selectedIndices[0];
            const card = state.players[selfIdx].hand[sel];
            if (onlineMode && socket && card?.id) socket.emit('discard', card.id);
            else discardCardFromHand(sel);
          });
          actions.appendChild(discardBtn);
        }
        if (selCount > 0) {
          const clearBtn = document.createElement("button");
          clearBtn.className = "btn clear";
          clearBtn.textContent = "Clear Selection";
          clearBtn.addEventListener("click", clearSelection);
          actions.appendChild(clearBtn);
        }
        if (getRemainingDiscards() === 0) {
          const endBtn = document.createElement("button");
          endBtn.className = "btn";
          endBtn.textContent = "End Turn";
          endBtn.addEventListener("click", () => {
            if (onlineMode && socket) socket.emit('end_turn');
            else endTurn();
          });
          actions.appendChild(endBtn);
        }
      }
      section.appendChild(actions);
    }
    section.appendChild(hand);
    els.players.appendChild(section);
  }
  els.activePlayerName.textContent = state.players[state.activePlayer]?.name ?? "Player 1";
}

function renderAll() {
  renderDeck();
  renderPlayers();
  setPhaseText();
}

function startGame() {
  const count = Math.max(1, Math.min(4, parseInt(els.playerCount.value, 10) || 2));
  state.players = createPlayers(count);
  state.activePlayer = 0;
  state.deck = buildDeck();
  state.turnPhase = "draw";
  state.selectedIndices = [];
  state.gameOver = false;
  state.winnerId = null;
  state.direction = 1;
  state.skipNextCount = 0;
  state.blockEffect = null;
  state.discardsThisTurn = 0;
  state.minDiscardsThisTurn = 0;
  state.tempHandBonus = 0;
  state.round = 1;
  dealInitialHands(state.deck, state.players);
  els.home.classList.add("hidden");
  els.game.classList.remove("hidden");
  renderAll();
}

function nextPlayer(delta) {
  const n = state.players.length;
  state.activePlayer = (state.activePlayer + delta + n) % n;
  renderAll();
}

// Event wiring
els.startBtn.addEventListener("click", () => {
  if (onlineMode && socket) {
    socket.emit('start_game');
  } else {
    startGame();
  }
});
els.prevPlayer.addEventListener("click", () => nextPlayer(-1));
els.nextPlayer.addEventListener("click", () => nextPlayer(1));
if (els.hostStartBtn) {
  els.hostStartBtn.addEventListener("click", () => {
    if (onlineMode && socket && myId && myId === roomHostId && !roomStarted) {
      socket.emit('start_game');
    }
  });
}

// Phase & actions
function setPhaseText() {
  if (els.phaseText) {
    if (state.gameOver && state.winnerId != null) {
      els.phaseText.textContent = `Round Won: ${state.players[state.winnerId].name}`;
    } else {
      const phase = state.turnPhase === "draw" ? "Draw" : "Discard";
      const dir = state.direction === 1 ? "→" : "←";
      const rem = getRemainingDiscards();
      const extra = rem > 0 ? ` • Discards: ${rem} left` : "";
      els.phaseText.textContent = `Phase: ${phase} ${dir}${extra}`;
    }
  }
  if (els.blockedText) {
    els.blockedText.textContent = state.blockEffect ? `Blocked: ${state.blockEffect.category}` : "";
  }
  if (els.roundCounter) {
    const active = state.players[state.activePlayer];
    const turns = active ? active.turns : 0;
    els.roundCounter.textContent = `Turns (${active?.name || 'Player'}): ${turns}`;
  }
}

function endTurn() {
  const n = state.players.length;
  // advance by direction
  state.activePlayer = (state.activePlayer + state.direction + n) % n;
  // apply skip if any
  if (state.skipNextCount > 0) {
    state.skipNextCount -= 1;
    state.activePlayer = (state.activePlayer + state.direction + n) % n;
  }
  state.turnPhase = "draw";
  state.selectedIndices = [];
  state.discardsThisTurn = 0;
  state.minDiscardsThisTurn = 0;
  // Hex Seal now persists until replaced; no decrement
  renderAll();
}

function drawFromDeck() {
  if (state.gameOver) return;
  if (state.turnPhase !== "draw") return;
  if (state.pendingAction) return;
  const card = safeDrawOne();
  if (!card) return;
  // Action cards are now kept in hand; not auto-activated
  const player = state.players[state.activePlayer];
  player.hand.push(card);
  // Count a turn for this player upon drawing
  player.turns += 1;
  state.turnPhase = "discard";
  state.selectedIndices = [];
  renderAll();
}

function drawFromDiscard(fromPlayerId) {
  if (state.gameOver) return;
  if (state.turnPhase !== "draw") return;
  if (state.pendingAction) return;
  const pile = state.players[fromPlayerId].discard;
  if (!pile.length) return;
  const card = pile.pop();
  // Disallow taking Action cards from discard piles
  if (card.type === "action") { pile.push(card); return; }
  const player = state.players[state.activePlayer];
  player.hand.push(card);
  // Count a turn for this player upon drawing
  player.turns += 1;
  state.turnPhase = "discard";
  state.selectedIndices = [];
  renderAll();
}

function discardCardFromHand(handIndex) {
  if (state.gameOver) return;
  if (state.turnPhase !== "discard") return;
  if (state.pendingAction) return;
  const player = state.players[state.activePlayer];
  const [card] = player.hand.splice(handIndex, 1);
  if (!card) return;
  player.discard.push(card);
  state.selectedIndices = [];
  state.discardsThisTurn += 1;
  if (getRemainingDiscards() <= 0) {
    endTurn();
  } else {
    renderAll();
  }
}

// Make deck clickable during Draw phase
els.deck.addEventListener("click", () => {
  if (onlineMode && socket) {
    socket.emit('draw_from_deck');
  } else {
    drawFromDeck();
  }
});

// Online: connect
if (els.onlineBtn) {
  els.onlineBtn.addEventListener("click", () => {
    if (onlineMode) return;
    onlineMode = true;
    try {
      // When served from the Node server, same-origin connect is enough
      socket = io({ transports: ["websocket", "polling"] });
    } catch (_) { socket = io(); }
    socket.on('connect_error', (err) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Online connection failed"; container.appendChild(h);
        const p = document.createElement("p"); p.textContent = "Make sure the server is running: open a terminal, cd server, npm install, npm start. Then click Start Online again."; container.appendChild(p);
        const p2 = document.createElement("p"); p2.textContent = `Tried to connect to http://${(location.hostname||'localhost')}:4000`; container.appendChild(p2);
        const foot = document.createElement("div"); foot.className = "footer"; container.appendChild(foot);
        const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "Close"; btn.addEventListener("click", closeOverlay);
        foot.appendChild(btn);
      });
    });
    socket.on('assigned', ({ id }) => { 
      myId = id;
      // Send player name if provided
      const playerName = els.playerName?.value?.trim();
      if (playerName) {
        socket.emit('set_name', playerName);
      }
    });
    socket.on('room_update', (room) => {
      roomHostId = room.hostId;
      roomStarted = room.started;
      if (els.hostStartBtn) {
        if (onlineMode && myId && myId === roomHostId && !roomStarted) {
          els.hostStartBtn.style.display = 'block';
        } else {
          els.hostStartBtn.style.display = 'none';
        }
      }
    });
    socket.on('state_update', (srvState) => {
      // Map server redacted state into client state shape
      state.players = srvState.players.map(p => ({
        id: p.id,
        name: p.name,
        hand: p.hand,
        discard: p.discard,
        melds: p.melds,
        tempHandBonus: p.tempHandBonus,
        turns: p.turns
      }));
      state.activePlayer = srvState.activePlayer;
      state.deck = new Array(srvState.deckCount).fill({ id: 'X', type: 'hidden' });
      state.turnPhase = srvState.turnPhase;
      state.blockEffect = srvState.blocked ? { category: srvState.blocked } : null;
      state.selectedIndices = [];
      els.home.classList.add("hidden");
      els.game.classList.remove("hidden");
      renderAll();
    });
    // Server action prompts
    socket.on('prompt_choose_category', ({ categories, actionCardId }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Choose category to block"; container.appendChild(h);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        categories.forEach(cat => {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = cat;
          btn.addEventListener("click", () => {
            socket.emit('choose_category', { category: cat, actionCardId });
            closeOverlay();
          });
          row.appendChild(btn);
        });
      });
    });
    socket.on('prompt_summon_target', ({ targets, actionCardId }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Summon from beyond - choose a player"; container.appendChild(h);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        targets.forEach(t => {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = t.name;
          btn.addEventListener("click", () => {
            socket.emit('summon_target', { targetId: t.id, actionCardId });
          });
          row.appendChild(btn);
        });
      });
    });
    socket.on('prompt_astral_keep', ({ actionCardId, cards }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Astral Projection - keep 1"; container.appendChild(h);
        const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
        cards.forEach(c => {
          const ce = cardElement(c, true); ce.classList.add("clickable"); ce.title = "Keep this card";
          ce.addEventListener("click", () => { socket.emit('astral_keep', { pickId: c.id, actionCardId }); closeOverlay(); });
          cardsRow.appendChild(ce);
        });
      });
    });
    socket.on('prompt_astral_order', ({ actionCardId, cards }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Order the remaining 2 (first will be on top)"; container.appendChild(h);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        const optA = document.createElement("button"); optA.className = "btn"; optA.textContent = `${cards[0].name} then ${cards[1].name}`;
        const optB = document.createElement("button"); optB.className = "btn"; optB.textContent = `${cards[1].name} then ${cards[0].name}`;
        optA.addEventListener("click", () => { socket.emit('astral_order', { orderIds: [cards[0].id, cards[1].id], actionCardId }); closeOverlay(); });
        optB.addEventListener("click", () => { socket.emit('astral_order', { orderIds: [cards[1].id, cards[0].id], actionCardId }); closeOverlay(); });
        row.appendChild(optA); row.appendChild(optB);
      });
    });
    socket.on('prompt_summon_pick', ({ targetId, actionCardId, cards }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Pick a card from discard"; container.appendChild(h);
        const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
        cards.forEach(c => {
          const ce = cardElement(c, true); ce.classList.add("clickable"); ce.title = "Take this card";
          ce.addEventListener("click", () => {
            socket.emit('summon_take', { targetId, cardId: c.id, actionCardId });
            closeOverlay();
          });
          cardsRow.appendChild(ce);
        });
      });
    });
    socket.on('prompt_venom_target', ({ targets, actionCardId }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Venom Brew - choose a player"; container.appendChild(h);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        targets.forEach(t => {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = t.name;
          btn.addEventListener("click", () => {
            socket.emit('venom_target', { targetId: t.id, actionCardId });
            closeOverlay();
          });
          row.appendChild(btn);
        });
      });
    });
    socket.on('prompt_thief_target', ({ targets, actionCardId }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Thief's Gamble - choose a player"; container.appendChild(h);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        targets.forEach(t => {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = t.name;
          btn.addEventListener("click", () => {
            socket.emit('thief_target', { targetId: t.id, actionCardId });
          });
          row.appendChild(btn);
        });
      });
    });
    socket.on('prompt_thief_discard', ({ actionCardId, cards }) => {
      openOverlay(container => {
        const h = document.createElement("h3"); h.textContent = "Discard 1 card"; container.appendChild(h);
        const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
        cards.forEach(c => {
          const ce = cardElement(c, true); ce.classList.add("clickable"); ce.title = "Discard this card";
          ce.addEventListener("click", () => {
            socket.emit('thief_discard', { actionCardId, cardId: c.id });
            closeOverlay();
          });
          cardsRow.appendChild(ce);
        });
      });
    });
    socket.on('effect', (e) => {
      if (e.type === 'win') {
        showWin(e.name);
      }
    });
  });
}

// Overlay helpers
function openOverlay(builder) {
  els.modalContent.innerHTML = "";
  builder(els.modalContent);
  els.overlay.classList.remove("hidden");
}

function closeOverlay() {
  els.overlay.classList.add("hidden");
  els.modalContent.innerHTML = "";
  renderAll();
}

function showWin(name) {
  if (!els.winOverlay) return;
  els.winText.textContent = `${name} won!`;
  els.bubbles.innerHTML = "";
  // spawn bubbles
  for (let i = 0; i < 30; i++) {
    const b = document.createElement("div");
    b.className = `bubble ${Math.random() > 0.5 ? 'purple' : ''}`;
    const left = Math.floor(Math.random() * 100);
    const delay = (Math.random() * 3).toFixed(2);
    const dur = (5 + Math.random() * 4).toFixed(2);
    b.style.left = `${left}%`;
    b.style.animationDelay = `${delay}s`;
    b.style.animationDuration = `${dur}s`;
    els.bubbles.appendChild(b);
  }
  els.winOverlay.classList.add('show');
  if (els.playAgainBtn) {
    els.playAgainBtn.onclick = () => {
      els.winOverlay.classList.remove('show');
      if (onlineMode && socket && myId && myId === roomHostId) {
        socket.emit('start_game');
      } else if (!onlineMode) {
        startGame();
      }
    };
  }
}
function chooseActionPlayOrDiscard(handIndex) {
  const player = state.players[state.activePlayer];
  const card = player.hand[handIndex];
  if (!card || card.type !== "action") return;
  if (onlineMode && socket) {
    openOverlay(container => {
      container.appendChild(cardElement(card, true));
      const p = document.createElement("p"); p.textContent = "Play this action now or discard it?"; container.appendChild(p);
      const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
      const playBtn = document.createElement("button"); playBtn.className = "btn"; playBtn.textContent = "Play Action";
      playBtn.addEventListener("click", () => {
        closeOverlay();
        if (card?.id) socket.emit('play_action', card.id);
      });
      const discardBtn = document.createElement("button"); discardBtn.className = "btn discard"; discardBtn.textContent = "Discard";
      discardBtn.addEventListener("click", () => {
        const c = state.players[state.activePlayer].hand[handIndex];
        if (c?.id) socket.emit('discard', c.id);
        closeOverlay();
      });
      const cancelBtn = document.createElement("button"); cancelBtn.className = "btn"; cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", () => {
        closeOverlay();
      });
      row.appendChild(playBtn);
      row.appendChild(discardBtn);
      row.appendChild(cancelBtn);
    });
    return;
  }
  openOverlay(container => {
    container.appendChild(cardElement(card, true));
    const p = document.createElement("p"); p.textContent = "Play this action now or discard it?"; container.appendChild(p);
    const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
    const playBtn = document.createElement("button"); playBtn.className = "btn"; playBtn.textContent = "Play Action";
    playBtn.addEventListener("click", () => {
      // remove from hand and resolve
      player.hand.splice(handIndex, 1);
      closeOverlay();
      handleActionCard(card, { source: "hand" });
    });
    const discardBtn = document.createElement("button"); discardBtn.className = "btn"; discardBtn.textContent = "Discard";
    discardBtn.addEventListener("click", () => {
      closeOverlay();
      discardCardFromHand(handIndex);
    });
    const cancelBtn = document.createElement("button"); cancelBtn.className = "btn"; cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
      closeOverlay();
    });
    row.appendChild(playBtn);
    row.appendChild(discardBtn);
    row.appendChild(cancelBtn);
  });
}

function finalizeActionCard(card) {
  // Action cards go to top of active player's discard
  state.players[state.activePlayer].discard.push(card);
  state.turnPhase = "discard";
  state.selectedIndices = [];
  state.pendingAction = null;
  // Count as this turn's discard
  state.discardsThisTurn += 1;
  closeOverlay();
}

function handleActionCard(card, opts = { source: "draw" }) {
  state.pendingAction = card;
  switch (card.name) {
    case "Circle Breaker": {
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const p = document.createElement("p"); p.textContent = "Skip the next player's turn."; container.appendChild(p);
        const footer = document.createElement("div"); footer.className = "footer"; container.appendChild(footer);
        const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "Resolve";
        btn.addEventListener("click", () => { state.skipNextCount += 1; finalizeActionCard(card); });
        footer.appendChild(btn);
      });
      return;
    }
    case "Twist of Fate": {
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const p = document.createElement("p"); p.textContent = "Reverse direction of play."; container.appendChild(p);
        const footer = document.createElement("div"); footer.className = "footer"; container.appendChild(footer);
        const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "Resolve";
        btn.addEventListener("click", () => { state.direction *= -1; finalizeActionCard(card); });
        footer.appendChild(btn);
      });
      return;
    }
    case "Foul Elixir": {
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const p = document.createElement("p"); p.textContent = "You discard 2 random cards immediately."; container.appendChild(p);
        const footer = document.createElement("div"); footer.className = "footer"; container.appendChild(footer);
        const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "Resolve";
        btn.addEventListener("click", () => {
          const player = state.players[state.activePlayer];
          const toDiscard = Math.min(2, player.hand.length);
          for (let i = 0; i < toDiscard; i++) {
            if (!player.hand.length) break;
            const idx = Math.floor(Math.random() * player.hand.length);
            const [c] = player.hand.splice(idx, 1);
            if (c) player.discard.push(c);
          }
          finalizeActionCard(card);
        });
        footer.appendChild(btn);
      });
      return;
    }
    case "Crackling Cauldron": {
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const p = document.createElement("p"); p.textContent = "Draw 1 extra card now. Your total (hand + melded) may be 10 until you make a meld; after melding, discard back to total 9."; container.appendChild(p);
        const footer = document.createElement("div"); footer.className = "footer"; container.appendChild(footer);
        const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "Resolve";
        btn.addEventListener("click", () => {
          const p = state.players[state.activePlayer];
          const c = safeDrawOne(); if (c) p.hand.push(c);
          // Allow temporary +1 total until the next meld by THIS player
          p.tempHandBonus = Math.max(p.tempHandBonus || 0, 1);
          finalizeActionCard(card);
        });
        footer.appendChild(btn);
      });
      return;
    }
    case "Venom Brew": {
      // pick target player to discard 1 random
      const choices = state.players.filter(p => p.id !== state.activePlayer && p.hand.length > 0);
      if (choices.length === 0) return finalizeActionCard(card);
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const h = document.createElement("h3"); h.textContent = "Choose a player to lose 1 random card"; container.appendChild(h);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        for (const p of choices) {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = p.name;
          btn.addEventListener("click", () => {
            const idx = Math.floor(Math.random() * p.hand.length);
            const [c] = p.hand.splice(idx, 1);
            if (c) p.discard.push(c);
            finalizeActionCard(card);
          });
          row.appendChild(btn);
        }
      });
      return;
    }
    case "Astral Projection": {
      if (state.deck.length === 0) reshuffleDiscardsIntoDeck();
      const n = Math.min(3, state.deck.length);
      if (n <= 0) return finalizeActionCard(card);
      const topCards = state.deck.slice(state.deck.length - n);
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const h = document.createElement("h3"); h.textContent = "Astral Projection"; container.appendChild(h);
        const p = document.createElement("p"); p.textContent = "Peek top 3 cards. Keep 1, then choose order of the rest."; container.appendChild(p);
        const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
        topCards.forEach((c, i) => {
          const ce = cardElement(c, true); ce.classList.add("clickable"); ce.title = "Keep this card";
          ce.addEventListener("click", () => {
            // remove chosen from deck and give to player
            const deckIndex = state.deck.length - n + i;
            const [kept] = state.deck.splice(deckIndex, 1);
            state.players[state.activePlayer].hand.push(kept);
            const remaining = topCards.filter((_, j) => j !== i);
            // reorder remaining
            if (remaining.length <= 1) return finalizeActionCard(card);
            container.innerHTML = "";
            const h2 = document.createElement("h3"); h2.textContent = "Choose order for the remaining two"; container.appendChild(h2);
            const order = document.createElement("div"); order.className = "choices"; container.appendChild(order);
            const optA = document.createElement("button"); optA.className = "btn"; optA.textContent = `${remaining[0].name} on top, then ${remaining[1].name}`;
            const optB = document.createElement("button"); optB.className = "btn"; optB.textContent = `${remaining[1].name} on top, then ${remaining[0].name}`;
            optA.addEventListener("click", () => {
              // remove both from deck (they are the last two now) and push back in chosen order
              // First, filter them out and then push in order
              const set = new Set(remaining.map(r => r.id));
              state.deck = state.deck.filter(c0 => !set.has(c0.id));
              state.deck.push(remaining[0], remaining[1]);
              finalizeActionCard(card);
            });
            optB.addEventListener("click", () => {
              const set = new Set(remaining.map(r => r.id));
              state.deck = state.deck.filter(c0 => !set.has(c0.id));
              state.deck.push(remaining[1], remaining[0]);
              finalizeActionCard(card);
            });
            order.appendChild(optA); order.appendChild(optB);
          });
          cardsRow.appendChild(ce);
        });
      });
      return;
    }
    case "Hex Seal": {
      // Choose category to block for one full cycle
      const categories = Array.from(new Set(INGREDIENTS.map(i => i.category)));
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const h = document.createElement("h3"); h.textContent = "Hex Seal"; container.appendChild(h);
        const p = document.createElement("p"); p.textContent = "Choose a category to block for one full cycle."; container.appendChild(p);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        categories.forEach(cat => {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = cat;
          btn.addEventListener("click", () => {
            state.blockEffect = { category: cat, turnsRemaining: state.players.length };
            finalizeActionCard(card);
          });
          row.appendChild(btn);
        });
      });
      return;
    }
    case "Thief's Gamble": {
      // select opponent, blind pick one of their cards by position (backs shown), then you discard 1 of your choosing
      const choices = state.players.filter(p => p.id !== state.activePlayer && p.hand.length > 0);
      if (choices.length === 0) return finalizeActionCard(card);
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const h = document.createElement("h3"); h.textContent = "Thief's Gamble"; container.appendChild(h);
        const p = document.createElement("p"); p.textContent = "Choose a player, then pick one of their facedown cards (blind). Then discard 1 from your hand."; container.appendChild(p);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        for (const opp of choices) {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = opp.name;
          btn.addEventListener("click", () => {
            container.innerHTML = "";
            const h2 = document.createElement("h3"); h2.textContent = `Pick one facedown card from ${opp.name}`; container.appendChild(h2);
            const backsRow = document.createElement("div"); backsRow.className = "cards"; container.appendChild(backsRow);
            opp.hand.forEach((_, i) => {
              const back = document.createElement("div"); back.className = "card back clickable"; back.textContent = "Card"; back.title = `Pick card #${i+1}`;
              back.addEventListener("click", () => {
                const [taken] = opp.hand.splice(i, 1);
                if (taken) state.players[state.activePlayer].hand.push(taken);
                // now choose a card to discard from your hand
                container.innerHTML = "";
                const h3e = document.createElement("h3"); h3e.textContent = "Discard 1 card from your hand"; container.appendChild(h3e);
                const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
                const player = state.players[state.activePlayer];
                player.hand.forEach((c, j) => {
                  const ce = cardElement(c, true); ce.classList.add("clickable"); ce.title = "Discard this card";
                  ce.addEventListener("click", () => {
                    const [dc] = player.hand.splice(j, 1);
                    if (dc) player.discard.push(dc);
                    finalizeActionCard(card);
                  });
                  cardsRow.appendChild(ce);
                });
              });
              backsRow.appendChild(back);
            });
          });
          row.appendChild(btn);
        }
      });
      return;
    }
    case "Summon from beyond":
    case "Summon from Beyond": {
      // Choose any player's discard pile (including self), then take any 1 card from it (actions allowed here)
      const available = state.players.filter(p => p.discard.length > 0);
      if (available.length === 0) return finalizeActionCard(card);
      openOverlay(container => {
        container.appendChild(cardElement(card, true));
        const h = document.createElement("h3"); h.textContent = "Summon from beyond"; container.appendChild(h);
        const p = document.createElement("p"); p.textContent = "Choose a player's discard pile to take 1 card from."; container.appendChild(p);
        const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
        for (const target of available) {
          const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = target.name;
          btn.addEventListener("click", () => {
            container.innerHTML = "";
            const h2 = document.createElement("h3"); h2.textContent = `Choose a card from ${target.name}'s discard`; container.appendChild(h2);
            const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
            target.discard.forEach((c, i) => {
              const ce = cardElement(c, true); ce.classList.add("clickable"); ce.title = "Take this card";
              ce.addEventListener("click", () => {
                const [taken] = target.discard.splice(i, 1);
                if (taken) state.players[state.activePlayer].hand.push(taken);
                finalizeActionCard(card);
              });
              cardsRow.appendChild(ce);
            });
          });
          row.appendChild(btn);
        }
      });
      return;
    }
    default:
      return finalizeActionCard(card);
  }
}

// Selection helpers & meld validation
function getMeldedCount(player) {
  return player.melds.reduce((sum, m) => sum + m.length, 0);
}

function getRequiredDiscards() {
  const player = state.players[state.activePlayer];
  const total = player.hand.length + getMeldedCount(player);
  const cap = 9 + (player.tempHandBonus || 0);
  const requiredByTotal = Math.max(0, total - cap);
  return Math.max(state.minDiscardsThisTurn, requiredByTotal);
}

function getRemainingDiscards() {
  const player = state.players[state.activePlayer];
  const total = player.hand.length + getMeldedCount(player);
  const cap = 9 + (player.tempHandBonus || 0);
  const remainingCap = Math.max(0, total - cap);
  const remainingMin = Math.max(0, state.minDiscardsThisTurn - state.discardsThisTurn);
  return Math.max(remainingCap, remainingMin);
}
function toggleSelect(index) {
  if (state.gameOver) return;
  if (state.pendingAction) return;
  const i = state.selectedIndices.indexOf(index);
  if (i >= 0) state.selectedIndices.splice(i, 1);
  else if (state.selectedIndices.length < 3) state.selectedIndices.push(index);
  renderPlayers();
}

function clearSelection() {
  state.selectedIndices = [];
  renderPlayers();
}

function sortActiveHandByCategory() {
  const player = state.players[state.activePlayer];
  const orderKey = (card) => `${card.category || 'zzz'}|${card.name}`;
  const sorted = [...player.hand].sort((a, b) => {
    const ka = orderKey(a).toLowerCase();
    const kb = orderKey(b).toLowerCase();
    if (ka < kb) return -1; if (ka > kb) return 1; return 0;
  });
  if (onlineMode && socket) {
    const ids = sorted.map(c => c.id).filter(Boolean);
    socket.emit('reorder', ids);
  } else {
    player.hand = sorted;
    state.selectedIndices = [];
    renderPlayers();
  }
}

function getSelectedCards() {
  const player = state.players[state.activePlayer];
  return state.selectedIndices.map(i => player.hand[i]).filter(Boolean);
}

function validateMeld(cards) {
  if (cards.length !== 3) return false;
  // Only Ingredient/Wild are allowed in melds
  if (cards.some(c => c.type === "action")) return false;
  const wildCount = cards.filter(c => c.type === "wild").length;
  const real = cards.filter(c => c.type !== "wild");
  // Hex Seal: block category
  if (state.blockEffect && real.some(c => c.category === state.blockEffect.category)) return false;

  // Three-of-a-kind: all real have same name, wilds can fill the rest
  if (real.length === 0 || new Set(real.map(c => c.name)).size === 1) {
    return true;
  }

  // Same-category trio (all distinct names in one category), wilds can fill
  const categories = new Set(real.map(c => c.category));
  if (categories.size > 1) return false;
  const cat = real[0]?.category;
  if (!cat) return true; // only wilds: can form any valid trio
  // ensure distinct names among real
  if (new Set(real.map(c => c.name)).size !== real.length) return false;
  // non-wild count <= 3 and same cat; wilds fill missing names to reach 3
  return real.length + wildCount === 3;
}

function isValidMeldIgnoringBlock(cards) {
  if (cards.length !== 3) return false;
  if (cards.some(c => c.type === "action")) return false;
  const wildCount = cards.filter(c => c.type === "wild").length;
  const real = cards.filter(c => c.type !== "wild");
  if (real.length === 0 || new Set(real.map(c => c.name)).size === 1) return true;
  const categories = new Set(real.map(c => c.category));
  if (categories.size > 1) return false;
  if (new Set(real.map(c => c.name)).size !== real.length) return false;
  return real.length + wildCount === 3;
}

function meldSelected() {
  if (state.pendingAction) return;
  const player = state.players[state.activePlayer];
  const cards = getSelectedCards();
  if (!validateMeld(cards)) return;
  // Remove selected cards from hand (sort indices desc before splicing)
  const sorted = [...state.selectedIndices].sort((a, b) => b - a);
  const taken = [];
  for (const idx of sorted) {
    const [c] = player.hand.splice(idx, 1);
    if (c) taken.push(c);
  }
  taken.reverse(); // maintain original order
  player.melds.push(taken);
  state.selectedIndices = [];
  // If Crackling Cauldron bonus is active for this player, clear it on their next meld
  if ((player.tempHandBonus || 0) > 0) player.tempHandBonus = 0;
  checkWinAfterMeld(player);
  renderAll();
}

function computeMeldCategory(cards) {
  const real = cards.filter(c => c.type !== "wild");
  return real[0]?.category || null;
}

function checkWinAfterMeld(player) {
  const categories = player.melds.map(m => computeMeldCategory(m)).filter(Boolean);
  const distinct = new Set(categories);
  if (player.melds.length >= 3 && distinct.size >= 3) {
    state.gameOver = true;
    state.winnerId = player.id;
    // Optional: alert for quick feedback
    try { alert(`${player.name} wins the round!`); } catch (e) {}
  }
}

