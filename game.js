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

// Potion cards for Game Mode 2
const POTIONS = {
  Maleficia: [
    { name: "Severance Draught", ingredients: ["Coffin Nails", "Whispering Bark", "Ghost Pepper Essence", "Clear Quartz"], summary: "Shuffle and reveal new potions in all categories", effect: "Changes available potions of every category. Current potion is placed back in it's category deck, the deck reshuffled and a new potion is drawn of each for everyone to try to collect." },
    { name: "Silence of the Grave", ingredients: ["Ghoul Tongue", "Coffin Nails", "Nightshade", "White Sage"], summary: "Everyone discards hand and draws new cards", effect: "Everybody (including spell user) folds complete hand into deck, new hands are delt to everyone." },
    { name: "Witch's Chain", ingredients: ["Graveyard Dirt", "Ashes of a Burnt Letter", "Bat Wing", "Spider Silk"], summary: "Lock one potion to require exact ingredients", effect: "A potion of your choosing requires the exact 4 ingredients in it to be acquired. No substitution allowed." },
    { name: "Maledicta Vitae", ingredients: ["Fairy Dust", "Starflower", "Whispering Bark", "Raven Feather"], summary: "Everyone discards hand and draws new cards", effect: "Everybody (including spell user) folds complete hand into deck, new hands are delt to everyone." },
    { name: "Hex of Hollow Flame", ingredients: ["Raven Feather", "Manticore Venom", "Pumpkin Guts", "Eye of Newt"], summary: "Shuffle and reveal new potions in all categories", effect: "Changes available potions of every category. Current potion is placed back in it's category deck, the deck reshuffled and a new potion is drawn of each for everyone to try to collect." },
    { name: "Bind of the Forgotten", ingredients: ["Graveyard Dirt", "Nightshade", "Yew Tree Branch", "Ashes of a Burnt Letter"], summary: "Lock one potion to require exact ingredients", effect: "A potion of your choosing requires the exact 4 ingredients in it to be acquired. No substitution allowed." }
  ],
  Benedicta: [
    { name: "Lover's Whisper", ingredients: ["Hair of a Virgin", "Unicorn Hair", "White Sage", "Starflower"], summary: "Request a card from others in turn order", effect: "Ask a for a card to the group, the first player that has it (in the current turn order) shall give it to you. You have to comply with the total of cards in your crafting table by the end of the turn." },
    { name: "Petal Ward Elixir", ingredients: ["Four Leaf Clover", "Starflower", "Spider Silk", "Amethyst"], summary: "Block any action card played against you", effect: "Block any action card against you" },
    { name: "Heartfire Infusion", ingredients: ["Ghost Pepper Essence", "Unicorn Hair", "Crushed Pearl", "Moonstone Powder"], summary: "Copy any ingredient used in completed potions", effect: "This potion takes the from of any other ingredient already used in a potion during this game" },
    { name: "Mirror Dew", ingredients: ["Clear Quartz", "Moonstone Powder", "Fairy Dust", "Frankincense"], summary: "Copy any ingredient used in completed potions", effect: "This potion takes the from of any other ingredient already used in a potion during this game" },
    { name: "Wispwine", ingredients: ["Frankincense", "Lightning Bug Glow", "Raven Feather", "Crushed Pearl"], summary: "Request a card from others in turn order", effect: "Ask a for a card to the group, the first player that has it (in the current turn order) shall give it to you. You have to comply with the total of cards in your crafting table by the end of the turn." },
    { name: "Basilisk Balm", ingredients: ["Fairy Dust", "Crushed Pearl", "Pumpkin Guts", "Hair of a Virgin"], summary: "Block any action card played against you", effect: "Block any action card against you" }
  ],
  Fortuna: [
    { name: "Dreambinder Elixir", ingredients: ["Moonstone Powder", "Spider Silk", "White Sage", "Fairy Dust"], summary: "See and reorder top cards of deck", effect: "See top cards equal to number of players x2 and order them however you like." },
    { name: "Twist of Fate", ingredients: ["Amethyst", "Hair of a Virgin", "Eye of Newt", "Four Leaf Clover"], summary: "Reshuffle all discards back into main deck", effect: "Reshuffle all discarded decks back into main deck" },
    { name: "Illusion's Glee", ingredients: ["Mermaid Scale", "Fairy Dust", "Lightning Bug Glow", "Whispering Bark"], summary: "Your pairs can substitute as wild cards", effect: "Any pair of cards you have acts as a wild card." },
    { name: "Oracle's Dew", ingredients: ["Clear Quartz", "Mermaid Scale", "Amethyst", "Lightning Bug Glow"], summary: "See and reorder top cards of deck", effect: "See top cards equal to number of players x2 and order them however you like." },
    { name: "Serpent's Luck", ingredients: ["Yew Tree Branch", "Four Leaf Clover", "Manticore Venom", "Ghost Pepper Essence"], summary: "Your pairs can substitute as wild cards", effect: "Any pair of cards you have acts as a wild card." },
    { name: "Veilpiercer Tonic", ingredients: ["Ashes of a Burnt Letter", "Frankincense", "Eye of Newt", "Mermaid Scale"], summary: "Reshuffle all discards back into main deck", effect: "Reshuffle all discarded decks back into main deck" }
  ]
};

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
  skipPlayerNextTurn: null, // ID of player to skip on their next turn
  blockEffect: null, // { category: string, turnsRemaining: number }
  discardsThisTurn: 0,
  pendingAction: null,
  minDiscardsThisTurn: 0,
  tempHandBonus: 0,
  dragIndex: null,
  round: 1,
  gameMode: 1, // 1 = The Apothecary, 2 = The Alchemist
  // Game Mode 2 only:
  potionDecks: { Maleficia: [], Benedicta: [], Fortuna: [] },
  revealedPotions: { Maleficia: null, Benedicta: null, Fortuna: null },
};

function createPlayers(count) {
  const players = [];
  for (let i = 0; i < count; i++) {
    players.push({ 
      id: i, 
      name: `Player ${i + 1}`, 
      hand: [], 
      discard: [], 
      melds: [], // Game Mode 1
      potions: [], // Game Mode 2: { potion: potionCard, faceUp: bool }
      tempHandBonus: 0, 
      turns: 0 
    });
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

function buildPotionDecks() {
  const decks = { Maleficia: [], Benedicta: [], Fortuna: [] };
  for (const [category, potions] of Object.entries(POTIONS)) {
    decks[category] = potions.map((p, idx) => ({
      id: `POT-${category}-${idx}`,
      type: "potion",
      name: p.name,
      category: category,
      ingredients: p.ingredients,
      summary: p.summary,
      effect: p.effect
    }));
    shuffle(decks[category]);
  }
  return decks;
}

function revealPotionFromDeck(category) {
  const deck = state.potionDecks[category];
  if (deck.length > 0) {
    state.revealedPotions[category] = deck.pop();
  } else {
    state.revealedPotions[category] = null;
  }
}

// Rendering
const els = {
  home: document.getElementById("home"),
  game: document.getElementById("game"),
  startBtn: document.getElementById("startBtn"),
  onlineBtn: document.getElementById("onlineBtn"),
  gameMode: document.getElementById("gameMode"),
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
  potionsRow: document.getElementById("potionsRow"),
  potionsDisplay: document.getElementById("potionsDisplay"),
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

function renderPotions() {
  if (state.gameMode !== 2 || !els.potionsRow || !els.potionsDisplay) return;
  
  els.potionsRow.classList.remove("hidden");
  els.potionsDisplay.innerHTML = "";
  
  const categories = ["Maleficia", "Benedicta", "Fortuna"];
  categories.forEach(cat => {
    const potionWrap = document.createElement("div");
    potionWrap.className = "potion-slot";
    
    const label = document.createElement("div");
    label.className = "potion-label";
    label.textContent = cat;
    potionWrap.appendChild(label);
    
    const potion = state.revealedPotions[cat];
    if (potion) {
      const potionEl = cardElement(potion, true);
      if (potion.noSubstitution) {
        const lockBadge = document.createElement("div");
        lockBadge.className = "pill";
        lockBadge.style.backgroundColor = "#d32f2f";
        lockBadge.style.color = "white";
        lockBadge.style.marginTop = "4px";
        lockBadge.textContent = "🔒 No Substitution";
        potionEl.appendChild(lockBadge);
      }
      potionWrap.appendChild(potionEl);
    } else {
      const empty = document.createElement("div");
      empty.className = "card back";
      empty.textContent = "None Available";
      potionWrap.appendChild(empty);
    }
    
    els.potionsDisplay.appendChild(potionWrap);
  });
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

  if (card.type === "potion") {
    const ingredients = document.createElement("div");
    ingredients.className = "potion-ingredients";
    const ingredientsList = card.ingredients.map(ing => {
      const category = getIngredientCategory(ing);
      const initials = category ? getCategoryInitials(category) : "??";
      const colorClass = category ? categoryToClass(category) : "";
      return `<span class="ingredient-badge ${colorClass}">${initials}</span> ${ing}`;
    }).join('<br>');
    ingredients.innerHTML = `<strong>Requires any 3 of:</strong><br>${ingredientsList}`;
    
    const effect = document.createElement("div");
    effect.className = "potion-effect";
    effect.innerHTML = `<strong>Effect:</strong> ${card.summary || card.effect}`;
    
    el.appendChild(top);
    el.appendChild(title);
    el.appendChild(ingredients);
    el.appendChild(effect);
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
    case "Witch's Pantry": return "cat-pantry";
    case "Action": return "cat-action";
    case "Wild Card": return "cat-wild";
    case "Maleficia": return "cat-maleficia";
    case "Benedicta": return "cat-benedicta";
    case "Fortuna": return "cat-fortuna";
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
    
    // Define isActive early so it can be used in potion rendering
    const isActive = onlineMode ? (player.id === myId) : (idx === state.activePlayer);
    
    if (state.gameMode === 2) {
      // Show potions in Game Mode 2
      (player.potions || []).forEach((potionData, potIdx) => {
        const potionEl = document.createElement("div");
        potionEl.className = "meld";
        const card = cardElement(potionData.potion, true);
        if (!potionData.faceUp) {
          card.classList.add("spent");
          card.title = "Perk used";
        } else if (isActive && !state.pendingAction && state.turnPhase === "discard" && player.turns > (potionData.turnClaimed || 0)) {
          // Can use perk if it's your turn, not your first turn after claiming
          card.classList.add("clickable");
          card.title = "Click to use perk";
          card.addEventListener("click", () => usePotionPerk(idx, potIdx));
        }
        potionEl.appendChild(card);
        meldsWrap.appendChild(potionEl);
      });
    } else {
      // Show melds in Game Mode 1
      for (const meld of player.melds) {
        const meldEl = document.createElement("div");
        meldEl.className = "meld";
        meld.forEach((c, cardIdx) => {
          const ce = cardElement(c, true);
          if (cardIdx > 0) ce.style.marginLeft = "-60px"; // 50% overlap of 120px width
          meldEl.appendChild(ce);
        });
        meldsWrap.appendChild(meldEl);
      }
    }

    const row = document.createElement("div");
    row.className = "discard-row";
    row.appendChild(discardWrap);
    row.appendChild(meldsWrap);

    const hand = document.createElement("div");
    hand.className = "hand";
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

      // Sorting tools always available to active player
      const sortBtn = document.createElement("button");
      sortBtn.className = "btn";
      sortBtn.textContent = "Sort by Category";
      sortBtn.addEventListener("click", sortActiveHandByCategory);
      actions.appendChild(sortBtn);
      
      if (state.gameMode === 2) {
        const sortPotionsBtn = document.createElement("button");
        sortPotionsBtn.className = "btn";
        sortPotionsBtn.textContent = "Sort by Potions";
        sortPotionsBtn.addEventListener("click", sortActiveHandByPotions);
        actions.appendChild(sortPotionsBtn);
      }

      if (state.turnPhase === "discard") {
        const selCount = state.selectedIndices.length;
        
        if (state.gameMode === 2) {
          // Game Mode 2: Check for potion crafting
          const selectedCards = getSelectedCards();
          const categories = ["Maleficia", "Benedicta", "Fortuna"];
          
          for (const cat of categories) {
            const potion = state.revealedPotions[cat];
            if (potion) {
              const craftResult = canCraftPotion(selectedCards, potion);
              if (craftResult) {
                const craftBtn = document.createElement("button");
                craftBtn.className = "btn meld";
                craftBtn.textContent = `Craft ${potion.name}`;
                if (craftResult.substitution) {
                  craftBtn.title = `Using substitution: ${craftResult.substitution.cards.join(", ")} for ${craftResult.substitution.missing}`;
                }
                craftBtn.addEventListener("click", () => {
                  if (onlineMode && socket) {
                    // TODO: Add online support for GM2
                  } else {
                    craftPotion(cat);
                  }
                });
                actions.appendChild(craftBtn);
              }
            }
          }
        } else {
          // Game Mode 1: Check for melding
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
  renderPotions();
  renderPlayers();
  setPhaseText();
}

function startGame() {
  const count = Math.max(1, Math.min(4, parseInt(els.playerCount.value, 10) || 2));
  const gameMode = parseInt(els.gameMode?.value || "1", 10);
  
  state.players = createPlayers(count);
  state.activePlayer = 0;
  state.deck = buildDeck();
  state.turnPhase = "draw";
  state.selectedIndices = [];
  state.gameOver = false;
  state.winnerId = null;
  state.direction = 1;
  state.skipNextCount = 0;
  state.skipPlayerNextTurn = null;
  state.blockEffect = null;
  state.discardsThisTurn = 0;
  state.minDiscardsThisTurn = 0;
  state.tempHandBonus = 0;
  state.round = 1;
  state.gameMode = gameMode;
  
  // Game Mode 2: Initialize potion decks
  if (gameMode === 2) {
    state.potionDecks = buildPotionDecks();
    revealPotionFromDeck("Maleficia");
    revealPotionFromDeck("Benedicta");
    revealPotionFromDeck("Fortuna");
  } else {
    state.potionDecks = { Maleficia: [], Benedicta: [], Fortuna: [] };
    state.revealedPotions = { Maleficia: null, Benedicta: null, Fortuna: null };
  }
  
  dealInitialHands(state.deck, state.players);
  els.home.classList.add("hidden");
  els.game.classList.remove("hidden");
  renderAll();
  // Scroll to game area smoothly
  els.game.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  // Check if this specific player should be skipped on their next turn
  if (state.skipPlayerNextTurn === state.activePlayer) {
    state.skipPlayerNextTurn = null;
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
      const wasHidden = els.game.classList.contains("hidden");
      els.home.classList.add("hidden");
      els.game.classList.remove("hidden");
      renderAll();
      // Scroll to game area when first starting
      if (wasHidden) {
        els.game.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
        const cancelBtn = document.createElement("button"); cancelBtn.className = "btn"; cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
          renderAll();
        });
        footer.appendChild(cancelBtn);
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
        const cancelBtn = document.createElement("button"); cancelBtn.className = "btn"; cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
          renderAll();
        });
        footer.appendChild(cancelBtn);
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
        const cancelBtn = document.createElement("button"); cancelBtn.className = "btn"; cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
          renderAll();
        });
        footer.appendChild(cancelBtn);
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
        const cancelBtn = document.createElement("button"); cancelBtn.className = "btn"; cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
          renderAll();
        });
        footer.appendChild(cancelBtn);
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
      if (state.gameMode === 2) {
        // Game Mode 2 version: Steal a potion by wagering 4 cards
        const choices = state.players.filter(p => p.id !== state.activePlayer && (p.potions || []).length > 0);
        if (choices.length === 0) return finalizeActionCard(card);
        
        openOverlay(container => {
          container.appendChild(cardElement(card, true));
          const h = document.createElement("h3"); h.textContent = "Thief's Gamble (GM2)"; container.appendChild(h);
          const p = document.createElement("p"); p.textContent = "Choose a player and one of their potions to steal. You'll wager 4 cards."; container.appendChild(p);
          const row = document.createElement("div"); row.className = "choices"; container.appendChild(row);
          
          for (const opp of choices) {
            const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = opp.name;
            btn.addEventListener("click", () => {
              // Show their potions
              container.innerHTML = "";
              const h2 = document.createElement("h3"); h2.textContent = `Choose a potion from ${opp.name}`; container.appendChild(h2);
              const potionsRow = document.createElement("div"); potionsRow.className = "cards"; container.appendChild(potionsRow);
              
              opp.potions.forEach((potionData, potIdx) => {
                const potEl = cardElement(potionData.potion, true);
                potEl.classList.add("clickable");
                potEl.title = "Steal this potion";
                potEl.addEventListener("click", () => {
                  // Select 4 cards as wager
                  container.innerHTML = "";
                  const h3 = document.createElement("h3"); h3.textContent = "Select 4 cards as your wager"; container.appendChild(h3);
                  const cardsRow = document.createElement("div"); cardsRow.className = "cards"; container.appendChild(cardsRow);
                  const player = state.players[state.activePlayer];
                  let selectedWager = [];
                  
                  const renderWagerSelection = () => {
                    cardsRow.innerHTML = "";
                    player.hand.forEach((c, idx) => {
                      const ce = cardElement(c, true);
                      ce.classList.add("clickable");
                      if (selectedWager.includes(idx)) ce.classList.add("selected");
                      ce.addEventListener("click", () => {
                        const i = selectedWager.indexOf(idx);
                        if (i >= 0) selectedWager.splice(i, 1);
                        else if (selectedWager.length < 4) selectedWager.push(idx);
                        renderWagerSelection();
                      });
                      cardsRow.appendChild(ce);
                    });
                    
                    if (selectedWager.length === 4) {
                      const confirmBtn = document.createElement("button");
                      confirmBtn.className = "btn";
                      confirmBtn.textContent = "Confirm Wager";
                      confirmBtn.addEventListener("click", () => {
                        // Check if opponent has a pair
                        const oppIngredients = opp.hand.filter(c => c.type === "ingredient").map(c => c.name);
                        const counts = {};
                        for (const name of oppIngredients) counts[name] = (counts[name] || 0) + 1;
                        const hasPair = Object.values(counts).some(v => v >= 2);
                        
                        if (hasPair) {
                          // Success! Steal the potion
                          const [stolenPotion] = opp.potions.splice(potIdx, 1);
                          player.potions = player.potions || [];
                          player.potions.push(stolenPotion);
                          
                          // Discard wager cards
                          selectedWager.sort((a, b) => b - a);
                          for (const idx of selectedWager) {
                            const [c] = player.hand.splice(idx, 1);
                            if (c) player.discard.push(c);
                          }
                          
                          // Opponent discards their pair
                          for (const name in counts) {
                            if (counts[name] >= 2) {
                              for (let i = 0; i < 2; i++) {
                                const idx = opp.hand.findIndex(c => c.name === name);
                                if (idx >= 0) {
                                  const [c] = opp.hand.splice(idx, 1);
                                  if (c) opp.discard.push(c);
                                }
                              }
                              break;
                            }
                          }
                          
                          container.innerHTML = "";
                          const success = document.createElement("h3"); success.textContent = "Success! Potion stolen!"; container.appendChild(success);
                          const okBtn = document.createElement("button"); okBtn.className = "btn"; okBtn.textContent = "OK";
                          okBtn.addEventListener("click", () => finalizeActionCard(card));
                          container.appendChild(okBtn);
                        } else {
                          // Failed! Discard wager and lose next turn
                          selectedWager.sort((a, b) => b - a);
                          for (const idx of selectedWager) {
                            const [c] = player.hand.splice(idx, 1);
                            if (c) player.discard.push(c);
                          }
                          state.skipPlayerNextTurn = state.activePlayer;
                          
                          container.innerHTML = "";
                          const fail = document.createElement("h3"); fail.textContent = "Busted! No pair found. You lose your next turn."; container.appendChild(fail);
                          const okBtn = document.createElement("button"); okBtn.className = "btn"; okBtn.textContent = "OK";
                          okBtn.addEventListener("click", () => finalizeActionCard(card));
                          container.appendChild(okBtn);
                        }
                      });
                      container.appendChild(confirmBtn);
                    }
                  };
                  
                  renderWagerSelection();
                });
                potionsRow.appendChild(potEl);
              });
            });
            row.appendChild(btn);
          }
        });
      } else {
        // Game Mode 1 version: blind pick one card, then discard 1
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
      }
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
  if (state.gameMode === 2) {
    // In Game Mode 2, potions count as 3 each
    return (player.potions || []).length * 3;
  }
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
  else {
    const maxSelect = state.gameMode === 2 ? 5 : 3; // In GM2, may need more cards for substitution
    if (state.selectedIndices.length < maxSelect) state.selectedIndices.push(index);
  }
  renderPlayers();
}

// Get ingredient category for a card
function getIngredientCategory(cardName) {
  const ing = INGREDIENTS.find(i => i.name === cardName);
  return ing ? ing.category : null;
}

// Get category initials (2 letters)
function getCategoryInitials(category) {
  const initials = {
    "Occult Rituals": "OR",
    "Body & Transformation": "BT",
    "Sacred Herbs & Botanicals": "SH",
    "Purification & Blessing": "PB",
    "Mythical Beasts": "MB",
    "Death & the Beyond": "DB",
    "Celestial & Dream Magic": "CD",
    "Crystals & Earthbound Magic": "CE",
    "Witch's Pantry": "WP"
  };
  return initials[category] || "??";
}

// Check if selected cards can craft a potion (with substitution)
function canCraftPotion(cards, potion) {
  if (!potion || !potion.ingredients) return null;
  
  const required = potion.ingredients.slice(); // 4 ingredients required
  const ingredientCards = cards.filter(c => c.type === "ingredient");
  
  // Build a map of what we have
  const available = ingredientCards.map(c => c.name);
  
  // Need any 3 of the 4 ingredients
  let matched = [];
  let unmatched = [];
  
  for (const req of required) {
    const idx = available.indexOf(req);
    if (idx >= 0) {
      matched.push(req);
      available.splice(idx, 1);
    } else {
      unmatched.push(req);
    }
  }
  
  // If we have 3 or more matches, we can craft directly
  if (matched.length >= 3) {
    return { direct: matched.slice(0, 3), substitution: null };
  }
  
  // If potion is locked (Witch's Chain/Bind of the Forgotten), no substitution allowed
  if (potion.noSubstitution) {
    return null;
  }
  
  // If we have 2 matches, check if we can substitute for one of the missing ingredients
  if (matched.length === 2) {
    // Try to substitute for each unmatched ingredient
    for (const missing of unmatched) {
      const missingCategory = getIngredientCategory(missing);
      if (!missingCategory) continue;
      
      // Check if we have 2 other cards from the same category (not already matched)
      const categoryCards = ingredientCards.filter(c => 
        getIngredientCategory(c.name) === missingCategory &&
        !matched.includes(c.name)
      );
      
      if (categoryCards.length >= 2) {
        return { 
          direct: matched, 
          substitution: { 
            missing: missing, 
            category: missingCategory, 
            cards: categoryCards.slice(0, 2).map(c => c.name) 
          } 
        };
      }
    }
  }
  
  return null;
}

// Craft a potion
function craftPotion(potionCategory) {
  if (state.gameMode !== 2) return;
  if (state.pendingAction) return;
  
  const player = state.players[state.activePlayer];
  const potion = state.revealedPotions[potionCategory];
  if (!potion) return;
  
  const selectedCards = getSelectedCards();
  const craftResult = canCraftPotion(selectedCards, potion);
  
  if (!craftResult) return;
  
  // Remove used cards from hand
  const usedCardNames = [...craftResult.direct];
  if (craftResult.substitution) {
    usedCardNames.push(...craftResult.substitution.cards);
  }
  
  // Remove cards in reverse order of indices
  const sorted = [...state.selectedIndices].sort((a, b) => b - a);
  const removed = [];
  for (const idx of sorted) {
    const [c] = player.hand.splice(idx, 1);
    if (c) removed.push(c);
  }
  
  // Discard used cards
  removed.forEach(c => player.discard.push(c));
  
  // Claim the potion
  player.potions = player.potions || [];
  player.potions.push({ potion: potion, faceUp: true, turnClaimed: player.turns });
  
  // Reveal new potion from that category
  revealPotionFromDeck(potionCategory);
  
  state.selectedIndices = [];
  
  // Check win condition
  checkWinAfterCraft(player);
  
  renderAll();
}

// Use a potion's perk
function usePotionPerk(playerIdx, potionIdx) {
  if (state.gameMode !== 2) return;
  if (state.pendingAction) return;
  
  const player = state.players[playerIdx];
  const potionData = player.potions[potionIdx];
  if (!potionData || !potionData.faceUp) return;
  
  const potion = potionData.potion;
  
  // Mark as pending so we can't do other actions
  state.pendingAction = { type: 'potion-perk', potion: potion };
  
  // Implement each potion effect
  switch (potion.name) {
    case "Severance Draught":
    case "Hex of Hollow Flame":
      // Changes available potions of every category
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Shuffle and Reveal New Potions";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const btnRow = document.createElement("div");
        btnRow.className = "footer";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Activate";
        btn.addEventListener("click", () => {
          // Return current potions to their decks and reshuffle
          ["Maleficia", "Benedicta", "Fortuna"].forEach(cat => {
            const current = state.revealedPotions[cat];
            if (current) {
              state.potionDecks[cat].push(current);
              shuffle(state.potionDecks[cat]);
            }
            revealPotionFromDeck(cat);
          });
          finalizePotionPerk(playerIdx, potionIdx);
        });
        btnRow.appendChild(btn);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);
      });
      break;
      
    case "Silence of the Grave":
    case "Maledicta Vitae":
      // Everyone folds hand into deck, new hands dealt
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Reshuffle All Hands";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const btnRow = document.createElement("div");
        btnRow.className = "footer";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Activate";
        btn.addEventListener("click", () => {
          // Fold all hands back into deck
          state.players.forEach(p => {
            while (p.hand.length > 0) {
              state.deck.push(p.hand.pop());
            }
          });
          shuffle(state.deck);
          // Deal new hands
          dealInitialHands(state.deck, state.players);
          finalizePotionPerk(playerIdx, potionIdx);
        });
        btnRow.appendChild(btn);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);
      });
      break;
      
    case "Twist of Fate":
    case "Veilpiercer Tonic":
      // Reshuffle all discarded decks back into main deck
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Reshuffle Discards";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const btnRow = document.createElement("div");
        btnRow.className = "footer";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Activate";
        btn.addEventListener("click", () => {
          reshuffleDiscardsIntoDeck();
          finalizePotionPerk(playerIdx, potionIdx);
        });
        btnRow.appendChild(btn);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);
      });
      break;
      
    case "Witch's Chain":
    case "Bind of the Forgotten":
      // Lock a potion to require exact ingredients (no substitution)
      const availablePotions = Object.entries(state.revealedPotions).filter(([_, p]) => p !== null);
      if (availablePotions.length === 0) {
        state.pendingAction = null;
        return finalizePotionPerk(playerIdx, potionIdx);
      }
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Lock a Potion";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const row = document.createElement("div");
        row.className = "choices";
        availablePotions.forEach(([cat, pot]) => {
          const btn = document.createElement("button");
          btn.className = "btn";
          btn.textContent = `${pot.name} (${cat})`;
          btn.addEventListener("click", () => {
            pot.noSubstitution = true;
            finalizePotionPerk(playerIdx, potionIdx);
          });
          row.appendChild(btn);
        });
        container.appendChild(row);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        container.appendChild(cancelBtn);
      });
      break;
      
    case "Lover's Whisper":
    case "Wispwine":
      // Request a card from others in turn order
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Request a Card";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter card name";
        input.style.width = "100%";
        input.style.padding = "8px";
        input.style.marginBottom = "10px";
        container.appendChild(input);
        const btnRow = document.createElement("div");
        btnRow.className = "footer";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Request";
        btn.addEventListener("click", () => {
          const cardName = input.value.trim();
          if (!cardName) return;
          
          // Find first player in turn order who has it
          let foundPlayer = null;
          const currentIdx = state.activePlayer;
          for (let i = 1; i < state.players.length; i++) {
            const checkIdx = (currentIdx + i * state.direction + state.players.length) % state.players.length;
            const other = state.players[checkIdx];
            const cardIdx = other.hand.findIndex(c => c.name.toLowerCase() === cardName.toLowerCase());
            if (cardIdx >= 0) {
              foundPlayer = { player: other, cardIdx };
              break;
            }
          }
          
          if (foundPlayer) {
            const [card] = foundPlayer.player.hand.splice(foundPlayer.cardIdx, 1);
            player.hand.push(card);
          }
          finalizePotionPerk(playerIdx, potionIdx);
        });
        btnRow.appendChild(btn);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);
      });
      break;
      
    case "Petal Ward Elixir":
    case "Basilisk Balm":
      // Passive effect: Block action cards
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Passive Protection Activated";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect + " This effect is now active as a passive protection.";
        container.appendChild(p);
        const note = document.createElement("p");
        note.style.fontSize = "0.9em";
        note.style.fontStyle = "italic";
        note.textContent = "Note: This is a passive effect. You can manually block the next action card played against you.";
        container.appendChild(note);
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "OK";
        btn.addEventListener("click", () => {
          // Mark that this player has action protection
          player.hasActionProtection = true;
          finalizePotionPerk(playerIdx, potionIdx);
        });
        container.appendChild(btn);
      });
      break;
      
    case "Heartfire Infusion":
    case "Mirror Dew":
      // Copy an ingredient from completed potions
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Wildcard Ingredient";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const note = document.createElement("p");
        note.style.fontSize = "0.9em";
        note.style.fontStyle = "italic";
        note.textContent = "This potion now acts as a wildcard that can substitute for any ingredient when crafting.";
        container.appendChild(note);
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "OK";
        btn.addEventListener("click", () => {
          // Mark this potion as a wildcard
          potionData.actsAsWildcard = true;
          finalizePotionPerk(playerIdx, potionIdx);
        });
        container.appendChild(btn);
      });
      break;
      
    case "Illusion's Glee":
    case "Serpent's Luck":
      // Passive effect: Pairs act as wildcards
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Wildcard Pairs Activated";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect;
        container.appendChild(p);
        const note = document.createElement("p");
        note.style.fontSize = "0.9em";
        note.style.fontStyle = "italic";
        note.textContent = "Your pairs of matching cards can now be used as wildcards when crafting potions.";
        container.appendChild(note);
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "OK";
        btn.addEventListener("click", () => {
          // Mark that this player's pairs act as wildcards
          player.pairsActAsWildcards = true;
          finalizePotionPerk(playerIdx, potionIdx);
        });
        container.appendChild(btn);
      });
      break;
    
    case "Dreambinder Elixir":
    case "Oracle's Dew":
      // See top cards equal to players x2, order them
      const numCards = state.players.length * 2;
      const topCards = state.deck.slice(-numCards);
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = `Order Top ${numCards} Cards`;
        container.appendChild(h);
        const pEffect = document.createElement("p");
        pEffect.textContent = potion.effect;
        container.appendChild(pEffect);
        const p = document.createElement("p");
        p.textContent = "Drag cards to reorder them. Top card will be drawn first.";
        container.appendChild(p);
        
        const cardsRow = document.createElement("div");
        cardsRow.className = "cards";
        container.appendChild(cardsRow);
        
        let orderedCards = [...topCards];
        const renderCards = () => {
          cardsRow.innerHTML = "";
          orderedCards.forEach((c, idx) => {
            const ce = cardElement(c, true);
            ce.setAttribute("draggable", "true");
            ce.style.cursor = "move";
            ce.addEventListener("dragstart", (e) => {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", idx);
            });
            ce.addEventListener("dragover", (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            });
            ce.addEventListener("drop", (e) => {
              e.preventDefault();
              const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
              const toIdx = idx;
              if (fromIdx !== toIdx) {
                const [moved] = orderedCards.splice(fromIdx, 1);
                orderedCards.splice(toIdx, 0, moved);
                renderCards();
              }
            });
            cardsRow.appendChild(ce);
          });
        };
        renderCards();
        
        const btnRow = document.createElement("div");
        btnRow.className = "footer";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Confirm Order";
        btn.addEventListener("click", () => {
          // Remove old cards and add in new order
          state.deck.splice(-numCards, numCards);
          state.deck.push(...orderedCards);
          finalizePotionPerk(playerIdx, potionIdx);
        });
        btnRow.appendChild(btn);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);
      });
      break;
      
    default:
      // For effects we haven't implemented yet, just mark as spent
      openOverlay(container => {
        container.appendChild(cardElement(potion, true));
        const h = document.createElement("h3");
        h.textContent = "Potion Effect";
        container.appendChild(h);
        const p = document.createElement("p");
        p.textContent = potion.effect || "This potion effect is not yet fully implemented.";
        container.appendChild(p);
        const btnRow = document.createElement("div");
        btnRow.className = "footer";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "OK";
        btn.addEventListener("click", () => finalizePotionPerk(playerIdx, potionIdx));
        btnRow.appendChild(btn);
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
          state.pendingAction = null;
          closeOverlay();
        });
        btnRow.appendChild(cancelBtn);
        container.appendChild(btnRow);
      });
      break;
  }
}

function finalizePotionPerk(playerIdx, potionIdx) {
  const player = state.players[playerIdx];
  const potionData = player.potions[potionIdx];
  if (potionData) {
    potionData.faceUp = false; // Mark as spent
  }
  state.pendingAction = null;
  closeOverlay();
  renderAll();
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

function sortActiveHandByPotions() {
  if (state.gameMode !== 2) return;
  
  const player = state.players[state.activePlayer];
  
  // Build ordered list of ingredients from revealed potions
  const potionIngredients = [];
  const categories = ["Maleficia", "Benedicta", "Fortuna"];
  
  for (const cat of categories) {
    const potion = state.revealedPotions[cat];
    if (potion && potion.ingredients) {
      for (const ing of potion.ingredients) {
        // Only add if not already in the list (first occurrence has priority)
        if (!potionIngredients.includes(ing)) {
          potionIngredients.push(ing);
        }
      }
    }
  }
  
  // Sort hand: ingredients in potions (by order) -> other ingredients -> actions
  const sorted = [...player.hand].sort((a, b) => {
    const aIsAction = a.type === "action";
    const bIsAction = b.type === "action";
    
    // Actions go to the end
    if (aIsAction && !bIsAction) return 1;
    if (!aIsAction && bIsAction) return -1;
    if (aIsAction && bIsAction) return 0;
    
    // Both are ingredients
    const aIndex = potionIngredients.indexOf(a.name);
    const bIndex = potionIngredients.indexOf(b.name);
    const aInPotion = aIndex >= 0;
    const bInPotion = bIndex >= 0;
    
    // Cards in potions come before cards not in potions
    if (aInPotion && !bInPotion) return -1;
    if (!aInPotion && bInPotion) return 1;
    
    // Both in potions: sort by position in potion list
    if (aInPotion && bInPotion) {
      return aIndex - bIndex;
    }
    
    // Both not in potions: maintain current order or sort by name
    return a.name.localeCompare(b.name);
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

function checkWinAfterCraft(player) {
  if (state.gameMode !== 2) return;
  
  const potions = player.potions || [];
  const categories = potions.map(p => p.potion.category);
  const hasM = categories.includes("Maleficia");
  const hasB = categories.includes("Benedicta");
  const hasF = categories.includes("Fortuna");
  
  if (hasM && hasB && hasF) {
    state.gameOver = true;
    state.winnerId = player.id;
    showWin(player.name);
  }
}

