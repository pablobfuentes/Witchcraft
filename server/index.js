import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Game constants reused from client
const COPIES_PER_INGREDIENT = 4;
const COPIES_PER_ACTION = 3;

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildDeck() {
  const deck = [];
  for (const ing of INGREDIENTS) {
    for (let i = 0; i < COPIES_PER_INGREDIENT; i++) {
      deck.push({ id: `ING-${ing.name}-${i}-${randomUUID()}`, type: 'ingredient', name: ing.name, category: ing.category });
    }
  }
  for (const act of ACTIONS) {
    const copies = act.copies != null ? act.copies : COPIES_PER_ACTION;
    for (let i = 0; i < copies; i++) {
      deck.push({ id: `ACT-${act.name}-${i}-${randomUUID()}`, type: 'action', name: act.name, category: 'Action', desc: act.desc });
    }
  }
  deck.push({ id: `WILD-0-${randomUUID()}`, type: 'wild', name: 'Secret Ingredient', category: 'Wild Card' });
  return shuffle(deck);
}

function createPlayer(socketId, name) {
  return { id: socketId, name, hand: [], discard: [], melds: [], tempHandBonus: 0, turns: 0 };
}

function redactStateFor(playerId, game) {
  const you = playerId;
  return {
    activePlayer: game.activePlayer,
    players: game.players.map(p => ({
      id: p.id,
      name: p.name,
      hand: p.id === you ? p.hand : p.hand.map(_ => ({ id: 'X', type: 'hidden' })),
      discard: p.discard.slice(-1),
      melds: p.melds,
      tempHandBonus: p.tempHandBonus,
      turns: p.turns
    })),
    deckCount: game.deck.length,
    turnPhase: game.turnPhase,
    blocked: game.blocked,
    you: playerId
  };
}

// Single public room game state
const game = {
  players: [],
  started: false,
  hostId: null,
  deck: [],
  activePlayer: 0,
  turnPhase: 'draw',
  blocked: null,
  skipNextCount: 0,
};

function dealInitial() {
  const HAND = 9;
  for (let i = 0; i < HAND; i++) {
    for (const p of game.players) {
      const c = game.deck.pop(); if (c) p.hand.push(c);
    }
  }
}

function broadcastState() {
  for (const p of game.players) {
    io.to(p.id).emit('state_update', redactStateFor(p.id, game));
  }
  io.emit('room_update', { players: game.players.map(p => ({ id: p.id, name: p.name })), hostId: game.hostId, started: game.started });
}

io.on('connection', (socket) => {
  const name = `Witch ${String(Math.floor(Math.random() * 900) + 100)}`;
  const player = createPlayer(socket.id, name);
  game.players.push(player);
  if (!game.hostId) game.hostId = socket.id;
  socket.emit('assigned', { id: socket.id, name, host: socket.id === game.hostId });
  broadcastState();

  socket.on('set_name', (n) => {
    const me = game.players.find(p => p.id === socket.id);
    if (me) me.name = (n || '').slice(0, 24) || me.name;
    broadcastState();
  });

  socket.on('start_game', () => {
    if (socket.id !== game.hostId || game.started) return;
    game.deck = buildDeck();
    game.started = true;
    game.activePlayer = 0;
    game.turnPhase = 'draw';
    game.blocked = null;
    // limit to first 4 players
    game.players = game.players.slice(0, 4);
    for (const p of game.players) { p.hand = []; p.discard = []; p.melds = []; p.tempHandBonus = 0; p.turns = 0; }
    dealInitial();
    broadcastState();
  });

  socket.on('draw_from_deck', () => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'draw') return;
    if (game.deck.length === 0) {
      const collected = [];
      for (const p of game.players) while (p.discard.length) collected.push(p.discard.pop());
      if (collected.length === 0) return;
      shuffle(collected); game.deck = collected;
    }
    const c = game.deck.pop(); if (!c) return;
    game.players[idx].hand.push(c);
    game.players[idx].turns += 1;
    game.turnPhase = 'discard';
    broadcastState();
  });

  socket.on('draw_from_discard', (targetId) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const tIdx = game.players.findIndex(p => p.id === targetId);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'draw') return;
    if (tIdx < 0) return;
    const pile = game.players[tIdx].discard;
    const top = pile[pile.length - 1];
    if (!top || top.type === 'action') return;
    const card = pile.pop();
    game.players[idx].hand.push(card);
    game.players[idx].turns += 1;
    game.turnPhase = 'discard';
    broadcastState();
  });

  socket.on('discard', (cardId) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    const me = game.players[idx];
    const i = me.hand.findIndex(c => c.id === cardId);
    if (i < 0) return;
    const [c] = me.hand.splice(i, 1);
    me.discard.push(c);
    // end turn if at or under cap
    const total = me.hand.length + me.melds.reduce((s,m)=>s+m.length,0);
    const cap = 9 + (me.tempHandBonus || 0);
    if (total <= cap) {
      game.activePlayer = (game.activePlayer + 1) % game.players.length;
      game.turnPhase = 'draw';
    }
    broadcastState();
  });

  socket.on('end_turn', () => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    const me = game.players[idx];
    const total = me.hand.length + me.melds.reduce((s,m)=>s+m.length,0);
    const cap = 9 + (me.tempHandBonus || 0);
    if (total > cap) return; // must meet cap before ending
    game.activePlayer = (game.activePlayer + 1) % game.players.length;
    if (game.skipNextCount > 0) { game.skipNextCount -= 1; game.activePlayer = (game.activePlayer + 1) % game.players.length; }
    game.turnPhase = 'draw';
    broadcastState();
  });

  socket.on('play_action', (cardId) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    const me = game.players[idx];
    const i = me.hand.findIndex(c => c.id === cardId && c.type === 'action');
    if (i < 0) return;
    const [card] = me.hand.splice(i, 1);

    function finalize() {
      me.discard.push(card);
      broadcastState();
    }

    switch (card.name) {
      case 'Circle Breaker': {
        game.skipNextCount += 1;
        return finalize();
      }
      case 'Twist of Fate': {
        // Reverse direction (simple 2-direction model: add a flag if needed later)
        // For now, simulate by skipping one extra player on next end (effectively reversing in 2-player games)
        // Better: track direction; keeping simple for prototype.
        return finalize();
      }
      case 'Foul Elixir': {
        const toDiscard = Math.min(2, me.hand.length);
        for (let k = 0; k < toDiscard; k++) {
          const r = Math.floor(Math.random() * me.hand.length);
          const [c] = me.hand.splice(r, 1);
          if (c) me.discard.push(c);
        }
        return finalize();
      }
      case 'Astral Projection': {
        // Ensure we have up to 3 cards to peek; reshuffle if deck empty
        if (game.deck.length === 0) {
          const collected = [];
          for (const p of game.players) while (p.discard.length) collected.push(p.discard.pop());
          if (collected.length) { shuffle(collected); game.deck = collected; }
        }
        const n = Math.min(3, game.deck.length);
        if (n <= 0) return finalize();
        const top = game.deck.slice(game.deck.length - n);
        io.to(socket.id).emit('prompt_astral_keep', { actionCardId: card.id, cards: top.map(c => ({ id: c.id, name: c.name, category: c.category, type: c.type })) });
        socket._pendingAction = { type: 'astral', card, topIds: top.map(c => c.id) };
        return;
      }
      case 'Venom Brew': {
        const targets = game.players.filter(p => p.id !== me.id && p.hand.length > 0).map(p => ({ id: p.id, name: p.name }));
        if (!targets.length) return finalize();
        io.to(socket.id).emit('prompt_venom_target', { targets, actionCardId: card.id });
        socket._pendingAction = { type: 'venom', card };
        return;
      }
      case 'Crackling Cauldron': {
        if (game.deck.length === 0) {
          const collected = [];
          for (const p of game.players) while (p.discard.length) collected.push(p.discard.pop());
          if (collected.length) { shuffle(collected); game.deck = collected; }
        }
        const c = game.deck.pop(); if (c) me.hand.push(c);
        me.tempHandBonus = Math.max(me.tempHandBonus || 0, 1);
        return finalize();
      }
      case 'Hex Seal': {
        const categories = Array.from(new Set(INGREDIENTS.map(i => i.category)));
        io.to(socket.id).emit('prompt_choose_category', { categories, actionCardId: card.id });
        // store pending in socket object
        socket._pendingAction = { type: 'hex', card };
        return;
      }
      case "Summon from beyond": {
        const targets = game.players.filter(p => p.discard.length > 0).map(p => ({ id: p.id, name: p.name }));
        if (!targets.length) return finalize();
        io.to(socket.id).emit('prompt_summon_target', { targets, actionCardId: card.id });
        socket._pendingAction = { type: 'summon', card };
        return;
      }
      case "Thief's Gamble": {
        const targets = game.players.filter(p => p.id !== me.id && p.hand.length > 0).map(p => ({ id: p.id, name: p.name }));
        if (!targets.length) return finalize();
        io.to(socket.id).emit('prompt_thief_target', { targets, actionCardId: card.id });
        socket._pendingAction = { type: 'thief', card };
        return;
      }
      default:
        return finalize();
    }
  });

  socket.on('choose_category', ({ category, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    const pend = socket._pendingAction;
    if (!pend || pend.type !== 'hex' || pend.card.id !== actionCardId) return;
    game.blocked = category;
    const me = game.players[idx];
    me.discard.push(pend.card);
    socket._pendingAction = null;
    broadcastState();
  });

  socket.on('summon_target', ({ targetId, actionCardId }) => {
    const pend = socket._pendingAction;
    if (!pend || pend.type !== 'summon' || pend.card.id !== actionCardId) return;
    const t = game.players.find(p => p.id === targetId);
    if (!t || t.discard.length === 0) return;
    io.to(socket.id).emit('prompt_summon_pick', { targetId, actionCardId, cards: t.discard.map(c => ({ id: c.id, name: c.name, category: c.category, type: c.type })) });
  });

  socket.on('astral_keep', ({ pickId, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const pend = socket._pendingAction;
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    if (!pend || pend.type !== 'astral' || pend.card.id !== actionCardId) return;
    const me = game.players[idx];
    const deckIndex = game.deck.findIndex(c => c.id === pickId);
    if (deckIndex < 0) return;
    const [kept] = game.deck.splice(deckIndex, 1);
    if (kept) me.hand.push(kept);
    const remainingIds = pend.topIds.filter(id => id !== pickId).filter(id => game.deck.some(c => c.id === id));
    if (remainingIds.length <= 1) {
      // finalize immediately
      me.discard.push(pend.card);
      socket._pendingAction = null;
      return broadcastState();
    }
    // Ask order for the remaining two
    const remainingCards = remainingIds.map(id => game.deck.find(c => c.id === id)).filter(Boolean);
    const cards = remainingCards.map(c => ({ id: c.id, name: c.name, category: c.category, type: c.type }));
    io.to(socket.id).emit('prompt_astral_order', { actionCardId, cards });
    socket._pendingAction.remainingCards = remainingCards;
  });

  socket.on('astral_order', ({ orderIds, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const pend = socket._pendingAction;
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    if (!pend || pend.type !== 'astral' || pend.card.id !== actionCardId) return;
    // remove both from deck
    const set = new Set(orderIds);
    game.deck = game.deck.filter(c => !set.has(c.id));
    // push back in given order: first id should be placed first among pushed (becomes nearest to top)
    const map = new Map((pend.remainingCards || []).map(c => [c.id, c]));
    for (const id of orderIds) {
      const obj = map.get(id);
      if (obj) game.deck.push(obj);
    }
    const me = game.players[idx];
    me.discard.push(pend.card);
    socket._pendingAction = null;
    broadcastState();
  });

  socket.on('summon_take', ({ targetId, cardId, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const pend = socket._pendingAction;
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    if (!pend || pend.type !== 'summon' || pend.card.id !== actionCardId) return;
    const me = game.players[idx];
    const t = game.players.find(p => p.id === targetId);
    if (!t) return;
    const i = t.discard.findIndex(c => c.id === cardId);
    if (i < 0) return;
    const [taken] = t.discard.splice(i, 1);
    me.hand.push(taken);
    me.discard.push(pend.card);
    socket._pendingAction = null;
    broadcastState();
  });

  socket.on('venom_target', ({ targetId, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const pend = socket._pendingAction;
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    if (!pend || pend.type !== 'venom' || pend.card.id !== actionCardId) return;
    const target = game.players.find(p => p.id === targetId);
    if (!target || target.id === socket.id || target.hand.length === 0) return;
    const r = Math.floor(Math.random() * target.hand.length);
    const [c] = target.hand.splice(r, 1);
    if (c) target.discard.push(c);
    const me = game.players[idx];
    me.discard.push(pend.card);
    socket._pendingAction = null;
    broadcastState();
  });

  socket.on('thief_target', ({ targetId, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const pend = socket._pendingAction;
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    if (!pend || pend.type !== 'thief' || pend.card.id !== actionCardId) return;
    const me = game.players[idx];
    const target = game.players.find(p => p.id === targetId);
    if (!target || target.id === me.id || target.hand.length === 0) return;
    const r = Math.floor(Math.random() * target.hand.length);
    const [taken] = target.hand.splice(r, 1);
    if (taken) me.hand.push(taken);
    // now prompt discard from your hand
    io.to(socket.id).emit('prompt_thief_discard', { actionCardId, cards: me.hand.map(c => ({ id: c.id, name: c.name, category: c.category, type: c.type })) });
  });

  socket.on('thief_discard', ({ cardId, actionCardId }) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    const pend = socket._pendingAction;
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    if (!pend || pend.type !== 'thief' || pend.card.id !== actionCardId) return;
    const me = game.players[idx];
    const i = me.hand.findIndex(c => c.id === cardId);
    if (i < 0) return;
    const [dc] = me.hand.splice(i, 1);
    if (dc) me.discard.push(dc);
    me.discard.push(pend.card);
    socket._pendingAction = null;
    broadcastState();
  });

  socket.on('meld', (cardIds) => {
    const idx = game.players.findIndex(p => p.id === socket.id);
    if (!game.started || idx !== game.activePlayer || game.turnPhase !== 'discard') return;
    const me = game.players[idx];
    const cards = cardIds.map(id => me.hand.find(c => c.id === id)).filter(Boolean);
    if (cards.length !== 3) return;
    // Validate: 3-of-a-kind or same category trio
    const wilds = cards.filter(c => c.type === 'wild');
    const real = cards.filter(c => c.type !== 'wild');
    if (real.length && new Set(real.map(c => c.name)).size === 1) {
      // ok
    } else {
      const cats = new Set(real.map(c => c.category));
      if (cats.size > 1) return;
      if (new Set(real.map(c => c.name)).size !== real.length) return;
      if (real.length + wilds.length !== 3) return;
    }
    // Remove from hand
    for (const id of cardIds) {
      const i = me.hand.findIndex(c => c.id === id); if (i>=0) me.hand.splice(i,1);
    }
    me.melds.push(cards);
    if ((me.tempHandBonus||0) > 0) me.tempHandBonus = 0;
    // Win check: 3 melds of distinct categories
    const cats = me.melds.map(m => (m.find(c=>c.type!=='wild')||{}).category).filter(Boolean);
    if (me.melds.length>=3 && new Set(cats).size>=3) {
      io.emit('effect', { type: 'win', winnerId: me.id, name: me.name });
      game.started = false;
    }
    broadcastState();
  });

  socket.on('reorder', (newOrderIds) => {
    const me = game.players.find(p => p.id === socket.id);
    if (!me) return;
    const map = new Map(me.hand.map(c => [c.id, c]));
    const next = [];
    for (const id of newOrderIds) if (map.has(id)) next.push(map.get(id));
    // append any missing
    for (const c of me.hand) if (!next.includes(c)) next.push(c);
    me.hand = next;
    broadcastState();
  });

  socket.on('disconnect', () => {
    const i = game.players.findIndex(p => p.id === socket.id);
    if (i>=0) game.players.splice(i,1);
    if (socket.id === game.hostId) {
      game.hostId = game.players[0]?.id || null;
    }
    broadcastState();
  });
});

// Serve client
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));


