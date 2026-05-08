// --- SYMBOL DICTIONARY ---
const SYMBOLS = {
    // --- BLANKS & BASICS ---
    'empty': { id: 'empty', img: '', val: 0, rarity: 'none', desc: 'Empty space.' },
    'coin': { id: 'coin', img: '🪙', val: 1, rarity: 'common', desc: 'A basic coin.' },
    
    // --- NATURE & PLANTS ---
    'seed': { id: 'seed', img: '🌱', val: 0, rarity: 'common', desc: 'Has a 25% chance to grow into a Flower.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.25) {
                engine.replaceSymbol(idx, 'flower');
                engine.log("A Seed grew into a Flower!");
            }
        }
    },
    'flower': { id: 'flower', img: '🌻', val: 1, rarity: 'common', desc: 'Peaceful. Buffed by Sun and Rain.' },
    'sun': { id: 'sun', img: '☀️', val: 2, rarity: 'uncommon', desc: 'Gives +2 to adjacent Flowers.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'flower') bonus += 2; });
            return bonus;
        }
    },
    'rain': { id: 'rain', img: '🌧️', val: 2, rarity: 'uncommon', desc: 'Gives +2 to adjacent Flowers and Seeds.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { 
                if (grid[adjIdx].id === 'flower' || grid[adjIdx].id === 'seed') bonus += 2; 
            });
            return bonus;
        }
    },
    
    // --- ANIMALS ---
    'bee': { id: 'bee', img: '🐝', val: 1, rarity: 'uncommon', desc: 'Gives +2 to adjacent Flowers.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'flower') bonus += 2; });
            return bonus;
        }
    },
    'mouse': { id: 'mouse', img: '🐭', val: 1, rarity: 'common', desc: 'Eats Cheese for +10.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'cheese') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 10);
                }
            });
        }
    },
    'cat': { id: 'cat', img: '🐱', val: 1, rarity: 'uncommon', desc: 'Eats adjacent Milk or Mice for +9.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['milk', 'mouse'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 9);
                }
            });
        }
    },
    'dog': { id: 'dog', img: '🐶', val: 2, rarity: 'uncommon', desc: 'Gives +2 to adjacent Humans.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            const humans = ['cultist', 'miner', 'thief', 'toddler', 'diver', 'billionaire', 'bartender'];
            engine.getAdjacent(idx).forEach(adjIdx => { if (humans.includes(grid[adjIdx].id)) bonus += 2; });
            return bonus;
        }
    },
    'monkey': { id: 'monkey', img: '🐒', val: 1, rarity: 'uncommon', desc: 'Eats adjacent Bananas or Coconuts for +14.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['banana', 'coconut'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 14);
                }
            });
        }
    },
    'bear': { id: 'bear', img: '🐻', val: 2, rarity: 'uncommon', desc: 'Eats adjacent Honey or Bees for +20.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['honey', 'bee'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 20);
                }
            });
        }
    },
    'wolf': { id: 'wolf', img: '🐺', val: 2, rarity: 'uncommon', desc: 'Eats adjacent Sheep for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'sheep') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    
    // --- FOOD ---
    'milk': { id: 'milk', img: '🥛', val: 1, rarity: 'common', desc: 'Yummy.' },
    'cheese': { id: 'cheese', img: '🧀', val: 1, rarity: 'common', desc: 'Mice love it.' },
    'banana': { id: 'banana', img: '🍌', val: 1, rarity: 'common', desc: 'Monkey business.' },
    'coconut': { id: 'coconut', img: '🥥', val: 2, rarity: 'common', desc: 'Hard to crack.' },
    'honey': { id: 'honey', img: '🍯', val: 2, rarity: 'uncommon', desc: 'Sweet.' },
    'wine': { id: 'wine', img: '🍷', val: 2, rarity: 'uncommon', desc: 'Fancy drink.' },
    'candy': { id: 'candy', img: '🍬', val: 1, rarity: 'common', desc: 'Sugar rush.' },
    'beer': { id: 'beer', img: '🍺', val: 1, rarity: 'common', desc: 'Cheers.' },

    // --- HUMANS ---
    'cultist': { id: 'cultist', img: '🦇', val: 0, rarity: 'uncommon', desc: 'Gives +1 for EVERY other Cultist on the board.',
        score: (idx, grid, engine) => {
            return grid.filter(s => s.id === 'cultist').length - 1; 
        }
    },
    'miner': { id: 'miner', img: '⛏️', val: 1, rarity: 'uncommon', desc: 'Destroys adjacent Ore to create a Diamond.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'ore') {
                    engine.replaceSymbol(adjIdx, 'diamond');
                    engine.log("Miner struck Diamond!");
                }
            });
        }
    },
    'thief': { id: 'thief', img: '🥷', val: 1, rarity: 'uncommon', desc: 'Eats all adjacent Coins for +4 each.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'coin') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 4);
                }
            });
        }
    },
    'toddler': { id: 'toddler', img: '👶', val: 1, rarity: 'uncommon', desc: 'Eats adjacent Candy for +9.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'candy') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 9);
                }
            });
        }
    },
    'bartender': { id: 'bartender', img: '🤵', val: 2, rarity: 'rare', desc: 'Gives +3 to adjacent Wine and Beer.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { 
                if (['wine', 'beer'].includes(grid[adjIdx].id)) bonus += 3; 
            });
            return bonus;
        }
    },
    'diver': { id: 'diver', img: '🤿', val: 2, rarity: 'rare', desc: 'Eats adjacent Pearls and Oysters for massive gains.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'pearl') { engine.consumeSymbol(adjIdx, idx); engine.addBonus(idx, 25); }
                if (grid[adjIdx].id === 'oyster') { engine.consumeSymbol(adjIdx, idx); engine.addBonus(idx, 15); }
            });
        }
    },
    'billionaire': { id: 'billionaire', img: '🎩', val: 2, rarity: 'rare', desc: 'Eats adjacent Diamonds and Wine for +30.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['diamond', 'wine'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 30);
                }
            });
        }
    },
    'king midas': { id: 'king midas', img: '👑', val: 3, rarity: 'epic', desc: 'Turns adjacent Empty spaces into Coins.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'empty') {
                    engine.replaceSymbol(adjIdx, 'coin');
                }
            });
        }
    },

    // --- OBJECTS & MINERALS ---
    'ore': { id: 'ore', img: '🪨', val: 1, rarity: 'common', desc: 'Wait for a miner.' },
    'diamond': { id: 'diamond', img: '💎', val: 5, rarity: 'rare', desc: 'Pure wealth.' },
    'pearl': { id: 'pearl', img: '⚪', val: 3, rarity: 'uncommon', desc: 'Shiny.' },
    'oyster': { id: 'oyster', img: '🦪', val: 1, rarity: 'uncommon', desc: 'Sometimes produces a Pearl.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.15) {
                engine.replaceSymbol(idx, 'pearl');
                engine.log("An Oyster produced a Pearl!");
            }
        }
    },
    'safe': { id: 'safe', img: '🗄️', val: 0, rarity: 'uncommon', desc: 'Destroyed by a Key to give +30.' },
    'key': { id: 'key', img: '🗝️', val: 1, rarity: 'uncommon', desc: 'Destroys adjacent Safes or Lockboxes.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'safe') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 30);
                    engine.log("A Safe was unlocked!");
                }
            });
        }
    },
    'moon': { id: 'moon', img: '🌙', val: 2, rarity: 'uncommon', desc: 'Eaten by Wolves.' },
    'sheep': { id: 'sheep', img: '🐑', val: 2, rarity: 'common', desc: 'Baa.' },

    // --- GEMS & GEOLOGY ---
    'coal': { id: 'coal', img: '🪨', val: 0, rarity: 'common', desc: 'Has a 5% chance each spin to turn into a Diamond under pressure.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.05) {
                engine.replaceSymbol(idx, 'diamond');
                engine.log("Coal was crushed into a Diamond!");
            }
        }
    },
    'amethyst': { id: 'amethyst', img: '🔮', val: 1, rarity: 'uncommon', desc: 'Gives +1 for EVERY other Amethyst on the board.',
        score: (idx, grid, engine) => {
            return grid.filter(s => s.id === 'amethyst').length - 1; 
        }
    },
    'emerald': { id: 'emerald', img: '🟩', val: 2, rarity: 'uncommon', desc: 'Shiny green gem.' },
    'ruby': { id: 'ruby', img: '🟥', val: 2, rarity: 'uncommon', desc: 'Shiny red gem.' },
    'sapphire': { id: 'sapphire', img: '🟦', val: 2, rarity: 'uncommon', desc: 'Shiny blue gem.' },
    'golem': { id: 'golem', img: '🗿', val: 1, rarity: 'rare', desc: 'Eats adjacent Gems for +15.',
        action: (idx, grid, engine) => {
            const gems = ['amethyst', 'emerald', 'ruby', 'sapphire', 'diamond'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (gems.includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },

    // --- PIRATES & THE OCEAN ---
    'pirate': { id: 'pirate', img: '🏴‍☠️', val: 2, rarity: 'rare', desc: 'Eats adjacent Coins, Pearls, and Anchors for +10.',
        action: (idx, grid, engine) => {
            const loot = ['coin', 'pearl', 'anchor'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (loot.includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 10);
                }
            });
        }
    },
    'anchor': { id: 'anchor', img: '⚓', val: 1, rarity: 'common', desc: 'Heavy.' },
    'chest': { id: 'chest', img: '🧰', val: 0, rarity: 'uncommon', desc: 'Destroyed by a Key or Thief for +25.' },
    'crab': { id: 'crab', img: '🦀', val: 1, rarity: 'common', desc: 'Gives +1 to adjacent Crabs.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'crab') bonus += 1; });
            return bonus;
        }
    },
    'goldfish': { id: 'goldfish', img: '🐠', val: 1, rarity: 'common', desc: 'Gives +1 for every adjacent Empty space.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'empty') bonus += 1; });
            return bonus;
        }
    },
    'turtle': { id: 'turtle', img: '🐢', val: 2, rarity: 'uncommon', desc: 'Slow and steady.' },

    // --- THE OCCULT & SPOOKY ---
    'spirit': { id: 'spirit', img: '👻', val: 2, rarity: 'uncommon', desc: 'Ethereal.' },
    'tombstone': { id: 'tombstone', img: '🪦', val: 1, rarity: 'common', desc: 'Gives +2 to adjacent Spirits.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'spirit') bonus += 2; });
            return bonus;
        }
    },
    'urn': { id: 'urn', img: '🏺', val: 1, rarity: 'common', desc: 'Destroyed by Cultists to release a Spirit and give +10.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'cultist') {
                    engine.replaceSymbol(idx, 'spirit');
                    engine.addBonus(idx, 10);
                    engine.log("A Cultist smashed an Urn and released a Spirit!");
                }
            });
        }
    },
    'witch': { id: 'witch', img: '🧙‍♀️', val: 2, rarity: 'rare', desc: 'Turns adjacent Hexes into Spirits.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'hex') {
                    engine.replaceSymbol(adjIdx, 'spirit');
                }
            });
        }
    },
    'hex': { id: 'hex', img: '🟣', val: -1, rarity: 'uncommon', desc: 'Curses you by subtracting gold.' },
    'bounty hunter': { id: 'bounty hunter', img: '🤠', val: 2, rarity: 'rare', desc: 'Eats adjacent Thieves for +20.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'thief') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 20);
                }
            });
        }
    },
    'ninja': { id: 'ninja', img: '🥷', val: 2, rarity: 'rare', desc: 'Gives +2 for every empty space on the board.',
        score: (idx, grid, engine) => {
            return grid.filter(s => s.id === 'empty').length * 2;
        }
    },

    // --- FARMING & AGRICULTURE ---
    'farmer': { id: 'farmer', img: '🧑‍🌾', val: 2, rarity: 'rare', desc: 'Eats adjacent Apples, Peaches, and Watermelons for +10.',
        action: (idx, grid, engine) => {
            const crops = ['apple', 'peach', 'watermelon'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (crops.includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 10);
                }
            });
        }
    },
    'apple': { id: 'apple', img: '🍎', val: 1, rarity: 'common', desc: 'Keeps the doctor away.' },
    'peach': { id: 'peach', img: '🍑', val: 1, rarity: 'common', desc: 'Sweet and fuzzy.' },
    'watermelon': { id: 'watermelon', img: '🍉', val: 2, rarity: 'uncommon', desc: 'Refreshing.' },
    'cow': { id: 'cow', img: '🐄', val: 2, rarity: 'uncommon', desc: 'Has a 20% chance to produce Milk.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.20) {
                let adj = engine.getAdjacent(idx);
                let emptySpots = adj.filter(a => grid[a].id === 'empty');
                if (emptySpots.length > 0) {
                    engine.replaceSymbol(emptySpots[0], 'milk');
                    engine.log("A Cow produced Milk!");
                }
            }
        }
    },
    'chicken': { id: 'chicken', img: '🐔', val: 2, rarity: 'uncommon', desc: 'Has a 20% chance to produce an Egg.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.20) {
                let adj = engine.getAdjacent(idx);
                let emptySpots = adj.filter(a => grid[a].id === 'empty');
                if (emptySpots.length > 0) {
                    engine.replaceSymbol(emptySpots[0], 'egg');
                    engine.log("A Chicken laid an Egg!");
                }
            }
        }
    },
    'egg': { id: 'egg', img: '🥚', val: 1, rarity: 'common', desc: 'Has a 10% chance to hatch into a Chicken.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.10) {
                engine.replaceSymbol(idx, 'chicken');
                engine.log("An Egg hatched!");
            }
        }
    },
    'golden egg': { id: 'golden egg', img: '🥚✨', val: 4, rarity: 'rare', desc: 'Very valuable.' },
    'goose': { id: 'goose', img: '🪿', val: 2, rarity: 'rare', desc: 'Has a 10% chance to lay a Golden Egg.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.10) {
                let adj = engine.getAdjacent(idx);
                let emptySpots = adj.filter(a => grid[a].id === 'empty');
                if (emptySpots.length > 0) {
                    engine.replaceSymbol(emptySpots[0], 'golden egg');
                    engine.log("The Goose laid a Golden Egg!");
                }
            }
        }
    },

    // --- BIRDS & COSMOS ---
    'owl': { id: 'owl', img: '🦉', val: 2, rarity: 'uncommon', desc: 'Eats adjacent Mice for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'mouse') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'magpie': { id: 'magpie', img: '🐦‍⬛', val: 1, rarity: 'uncommon', desc: 'Gives +2 for every adjacent Gem or Coin.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            const shiny = ['coin', 'diamond', 'emerald', 'ruby', 'sapphire', 'amethyst', 'pearl'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (shiny.includes(grid[adjIdx].id)) bonus += 2;
            });
            return bonus;
        }
    },
    'dove': { id: 'dove', img: '🕊️', val: 1, rarity: 'common', desc: 'Gives +1 to adjacent Humans.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            const humans = ['cultist', 'miner', 'thief', 'toddler', 'diver', 'billionaire', 'bartender', 'farmer', 'pirate', 'witch', 'bounty hunter', 'ninja'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (humans.includes(grid[adjIdx].id)) bonus += 1;
            });
            return bonus;
        }
    },
    'star': { id: 'star', img: '⭐', val: 1, rarity: 'uncommon', desc: 'Gives +1 for EVERY other Star on the board.',
        score: (idx, grid, engine) => {
            return grid.filter(s => s.id === 'star').length - 1; 
        }
    },
    'astronaut': { id: 'astronaut', img: '🧑‍🚀', val: 2, rarity: 'rare', desc: 'Eats adjacent Stars and Moons for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['star', 'moon'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'ufo': { id: 'ufo', img: '🛸', val: 2, rarity: 'rare', desc: 'Abducts adjacent Cows for +20.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'cow') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 20);
                }
            });
        }
    },
    'martian': { id: 'martian', img: '👽', val: 2, rarity: 'rare', desc: 'Gives +3 to adjacent UFOs and Astronauts.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['ufo', 'astronaut'].includes(grid[adjIdx].id)) bonus += 3;
            });
            return bonus;
        }
    },
    'void': { id: 'void', img: '🌌', val: 0, rarity: 'epic', desc: 'Consumes adjacent Empty spaces for +3 each.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'empty') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 3);
                }
            });
        }
    },

    // --- CARDS & FANTASY ---
    'spade': { id: 'spade', img: '♠️', val: 1, rarity: 'common', desc: 'Gives +1 to adjacent Spades and Jokers.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (['spade', 'joker'].includes(grid[adjIdx].id)) bonus += 1; });
            return bonus;
        }
    },
    'heart': { id: 'heart', img: '♥️', val: 1, rarity: 'common', desc: 'Gives +1 to adjacent Hearts and Jokers.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (['heart', 'joker'].includes(grid[adjIdx].id)) bonus += 1; });
            return bonus;
        }
    },
    'club': { id: 'club', img: '♣️', val: 1, rarity: 'common', desc: 'Gives +1 to adjacent Clubs and Jokers.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (['club', 'joker'].includes(grid[adjIdx].id)) bonus += 1; });
            return bonus;
        }
    },
    'joker': { id: 'joker', img: '🃏', val: 3, rarity: 'rare', desc: 'Gives +2 to adjacent Card Suits.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { 
                if (['spade', 'heart', 'club', 'diamond'].includes(grid[adjIdx].id)) bonus += 2; 
            });
            return bonus;
        }
    },
    'dice': { id: 'dice', img: '🎲', val: 0, rarity: 'uncommon', desc: 'Rolls a random value between 1 and 6.',
        score: (idx, grid, engine) => { return Math.floor(Math.random() * 6) + 1; }
    },
    'wizard': { id: 'wizard', img: '🧙‍♂️', val: 2, rarity: 'rare', desc: 'Eats adjacent Potions and Scrolls for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['potion', 'scroll'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'potion': { id: 'potion', img: '🧪', val: 2, rarity: 'uncommon', desc: 'Magical concoction.' },
    'scroll': { id: 'scroll', img: '📜', val: 2, rarity: 'uncommon', desc: 'Ancient knowledge.' },
    'dragon': { id: 'dragon', img: '🐉', val: 3, rarity: 'epic', desc: 'Eats adjacent Knights and Gold for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['knight', 'coin', 'diamond'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'knight': { id: 'knight', img: '🛡️', val: 2, rarity: 'rare', desc: 'Destroys adjacent Dragons for +50.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'dragon') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 50);
                }
            });
        }
    },

    // --- CITY, TECH & WILDLIFE ---
    'trash': { id: 'trash', img: '🗑️', val: 0, rarity: 'common', desc: 'Clutters the board.' },
    'rat': { id: 'rat', img: '🐀', val: 1, rarity: 'common', desc: 'Eats adjacent Trash and Cheese for +5.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['trash', 'cheese'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 5);
                }
            });
        }
    },
    'garbage collector': { id: 'garbage collector', img: '🚛', val: 2, rarity: 'uncommon', desc: 'Eats adjacent Trash for +10.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'trash') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 10);
                }
            });
        }
    },
    'dough': { id: 'dough', img: '🫓', val: 1, rarity: 'common', desc: 'Has a 15% chance to bake into Bread or a Pie.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.15) {
                const bakedGoods = ['bread', 'pie'];
                const result = bakedGoods[Math.floor(Math.random() * bakedGoods.length)];
                engine.replaceSymbol(idx, result);
            }
        }
    },
    'bread': { id: 'bread', img: '🍞', val: 2, rarity: 'uncommon', desc: 'Fresh out of the oven.' },
    'pie': { id: 'pie', img: '🥧', val: 3, rarity: 'rare', desc: 'Delicious.' },
    'chef': { id: 'chef', img: '🧑‍🍳', val: 2, rarity: 'rare', desc: 'Gives +3 to adjacent Bread, Pie, and Cheese.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['bread', 'pie', 'cheese'].includes(grid[adjIdx].id)) bonus += 3;
            });
            return bonus;
        }
    },
    'gear': { id: 'gear', img: '⚙️', val: 1, rarity: 'common', desc: 'Gives +1 to adjacent Gears.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'gear') bonus += 1; });
            return bonus;
        }
    },
    'lightbulb': { id: 'lightbulb', img: '💡', val: 1, rarity: 'common', desc: 'Gives +2 to adjacent Robots and Scientists.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (['robot', 'scientist'].includes(grid[adjIdx].id)) bonus += 2; });
            return bonus;
        }
    },
    'robot': { id: 'robot', img: '🤖', val: 2, rarity: 'uncommon', desc: 'Eats adjacent Gears for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'gear') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'scientist': { id: 'scientist', img: '🧑‍🔬', val: 2, rarity: 'rare', desc: 'Eats adjacent Potions and Hexes for +20.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['potion', 'hex'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 20);
                }
            });
        }
    },
    'present': { id: 'present', img: '🎁', val: 0, rarity: 'uncommon', desc: 'Has a 15% chance to open into a random shiny object.',
        action: (idx, grid, engine) => {
            if (Math.random() < 0.15) {
                const loot = ['coin', 'diamond', 'ruby', 'emerald', 'sapphire'];
                const result = loot[Math.floor(Math.random() * loot.length)];
                engine.replaceSymbol(idx, result);
            }
        }
    },
    'pinata': { id: 'pinata', img: '🪅', val: 1, rarity: 'uncommon', desc: 'Destroyed by Toddlers or Ninjas to release Candy.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['toddler', 'ninja'].includes(grid[adjIdx].id)) {
                    engine.replaceSymbol(idx, 'candy');
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'dart': { id: 'dart', img: '🎯', val: 1, rarity: 'common', desc: 'Gives +3 to adjacent Apples and Ninjas.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (['apple', 'ninja'].includes(grid[adjIdx].id)) bonus += 3; });
            return bonus;
        }
    },
    'clown': { id: 'clown', img: '🤡', val: 2, rarity: 'rare', desc: 'Eats adjacent Bananas and Pies for +15.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['banana', 'pie'].includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'rabbit': { id: 'rabbit', img: '🐇', val: 1, rarity: 'common', desc: 'Eats adjacent Carrots for +5.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'carrot') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 5);
                }
            });
        }
    },
    'carrot': { id: 'carrot', img: '🥕', val: 1, rarity: 'common', desc: 'What\'s up, doc?' },
    'fox': { id: 'fox', img: '🦊', val: 2, rarity: 'uncommon', desc: 'Eats adjacent Rabbits, Chickens, and Eggs for +15.',
        action: (idx, grid, engine) => {
            const prey = ['rabbit', 'chicken', 'egg'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (prey.includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    // --- NEW LEGENDARY SYMBOLS (0.1% Chance) ---
    'black hole': { 
        id: 'black hole', img: '🕳️', val: 0, rarity: 'legendary', 
        desc: 'Consumes ALL adjacent non-Legendaries for +15 each.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                const target = grid[adjIdx];
                if (target.id !== 'empty' && target.rarity !== 'legendary') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                    engine.log("The Black Hole consumed everything!");
                }
            });
        }
    },
    'excalibur': { 
        id: 'excalibur', img: '⚔️', val: 5, rarity: 'legendary', 
        desc: 'If adjacent to a Knight, grants +100 and destroys the Knight.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].id === 'knight') {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 100);
                    engine.log("The Knight pulled Excalibur!");
                }
            });
        }
    },

    // --- NEW EPIC SYMBOLS (0.5% Chance) ---
    'philosophers stone': { 
        id: 'philosophers stone', img: '🔮', val: 5, rarity: 'epic', 
        desc: 'Transforms adjacent Coal and Ore into Diamonds (+20 bonus).',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['coal', 'ore'].includes(grid[adjIdx].id)) {
                    engine.replaceSymbol(adjIdx, 'diamond');
                    engine.addBonus(idx, 20);
                    engine.log("Alchemy! Created a Diamond.");
                }
            });
        }
    },
    't-rex': { 
        id: 't-rex', img: '🦖', val: 4, rarity: 'epic', 
        desc: 'Eats adjacent Animals for +15 each.',
        action: (idx, grid, engine) => {
            const prey = ['cat', 'dog', 'sheep', 'cow', 'chicken', 'mouse', 'rabbit', 'fox', 'wolf'];
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (prey.includes(grid[adjIdx].id)) {
                    engine.consumeSymbol(adjIdx, idx);
                    engine.addBonus(idx, 15);
                }
            });
        }
    },
    'robin hood': { 
        id: 'robin hood', img: '🏹', val: 2, rarity: 'epic', 
        desc: 'Steals from adjacent Billionaires and Kings for +30.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (['billionaire', 'king midas'].includes(grid[adjIdx].id)) {
                    bonus += 30;
                }
            });
            return bonus;
        }
    },
    // --- UPDATED DECK-THINNING SYMBOLS (WITH RNG) ---
    'incinerator': { 
        id: 'incinerator', img: '🔥', val: 1, rarity: 'uncommon', 
        desc: '50% chance to permanently destroy adjacent Trash and Coal for +20.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                let targetId = grid[adjIdx].id;
                if (['trash', 'coal'].includes(targetId)) {
                    // 50% chance to trigger the destruction
                    if (Math.random() < 0.5) { 
                        engine.consumeSymbol(adjIdx, idx);
                        let deckIdx = GAME.deck.indexOf(targetId);
                        if (deckIdx > -1) GAME.deck.splice(deckIdx, 1);
                        engine.addBonus(idx, 20); // Bigger bonus for the gamble
                    }
                }
            });
        }
    },
    'assassin': { 
        id: 'assassin', img: '🗡️', val: 2, rarity: 'rare', 
        desc: '50% chance to permanently assassinate adjacent Cultists/Thieves for +50.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                let targetId = grid[adjIdx].id;
                if (['cultist', 'thief'].includes(targetId)) {
                    // 50% chance to trigger the destruction
                    if (Math.random() < 0.5) {
                        engine.consumeSymbol(adjIdx, idx);
                        let deckIdx = GAME.deck.indexOf(targetId);
                        if (deckIdx > -1) GAME.deck.splice(deckIdx, 1);
                        engine.addBonus(idx, 50);
                    }
                }
            });
        }
    },
    'sacrificial altar': { 
        id: 'sacrificial altar', img: '🩸', val: 0, rarity: 'epic', 
        desc: '30% chance to permanently destroy each adjacent Common symbol for +30.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                let target = grid[adjIdx];
                if (target.rarity === 'common' && target.id !== 'empty') {
                    // 30% chance per common item
                    if (Math.random() < 0.3) {
                        let targetId = target.id;
                        engine.consumeSymbol(adjIdx, idx);
                        let deckIdx = GAME.deck.indexOf(targetId);
                        if (deckIdx > -1) GAME.deck.splice(deckIdx, 1);
                        engine.addBonus(idx, 30);
                    }
                }
            });
        }
    },
    'phoenix': {
        id: 'phoenix', img: '🔥', val: 3, rarity: 'epic',
        desc: 'If destroyed, has a 100% chance to reappear next spin.',
        // Note: This requires a 'destroyed' trigger in your deck logic, 
        // but for now, it provides high base value.
    },
    'golden touch': {
        id: 'golden touch', img: '✨', val: 0, rarity: 'epic',
        desc: 'Turns ALL adjacent common symbols into Gold Coins.',
        action: (idx, grid, engine) => {
            engine.getAdjacent(idx).forEach(adjIdx => {
                if (grid[adjIdx].rarity === 'common') {
                    engine.replaceSymbol(adjIdx, 'coin');
                }
            });
        }
    },
    'snail': { id: 'snail', img: '🐌', val: 0, rarity: 'common', desc: 'Gives +1 for every adjacent Empty space.',
        score: (idx, grid, engine) => {
            let bonus = 0;
            engine.getAdjacent(idx).forEach(adjIdx => { if (grid[adjIdx].id === 'empty') bonus += 1; });
            return bonus;
        }
    }
};

// --- GAME STATE ---
const GAME = {
    gold: 0, rent: 50, spinsLeft: 7, round: 1,
    gridSize: 25, cols: 5, rows: 5,
    deck: ['coin','coin','coin','coin','coin','cat','milk','seed','flower', 'sun'],
    gridObjects: [], 
    tempBonuses: new Array(25).fill(0) 
};

// --- DOM ELEMENTS ---
const UI = {
    grid: document.getElementById('grid'),
    gold: document.getElementById('gold'),
    rent: document.getElementById('rent'),
    spins: document.getElementById('spins'),
    btn: document.getElementById('spin-btn'),
    log: document.getElementById('log-console'),
    invCount: document.getElementById('deck-count'),
    invGrid: document.getElementById('inventory-grid'),
    shop: document.getElementById('shop-modal'),
    shopOptions: document.getElementById('shop-options'),
    skipBtn: document.getElementById('skip-btn'),
    clearBtn: document.getElementById('clear-save-btn') // <-- NEW: Added the clear button
};

// --- ENGINE LOGIC ---
const Engine = {
    init: () => {
        UI.grid.innerHTML = '';
        for (let i = 0; i < GAME.gridSize; i++) {
            let div = document.createElement('div');
            div.className = 'slot';
            UI.grid.appendChild(div);
        }
        
        if (!Engine.loadGame()) {
            Engine.updateHUD();
        }
        
        UI.btn.onclick = Engine.spin;
        
        UI.skipBtn.onclick = () => { 
            GAME.gold += 1; 
            Engine.picksLeft--;
            if (Engine.picksLeft > 0) {
                Engine.openShop();
            } else {
                Engine.closeShop(); 
            }
        };

        // --- NEW: Clear Save Logic ---
        UI.clearBtn.onclick = () => {
            // confirm() creates a browser popup that returns true if they click OK
            if (confirm("Are you sure you want to delete your save and start over?")) {
                localStorage.removeItem('slotRogueSave');
                location.reload(); // Refreshes the page to start fresh
            }
        };
    },

    spin: async () => {
        UI.btn.disabled = true;
        GAME.spinsLeft--;
        GAME.tempBonuses.fill(0);
        UI.log.innerText = "Spinning...";

        let pool = [...GAME.deck];
        
        while (pool.length < GAME.gridSize) { pool.push('empty'); }

        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        GAME.gridObjects = [];
        const slots = document.querySelectorAll('.slot');
        
        for (let i = 0; i < GAME.gridSize; i++) {
            slots[i].className = 'slot'; 
            let pulledId = pool[i];
            GAME.gridObjects.push({ ...SYMBOLS[pulledId] });
            slots[i].innerText = GAME.gridObjects[i].img;
        }

        await new Promise(r => setTimeout(r, 400));

        for (let i = 0; i < GAME.gridSize; i++) {
            let sym = GAME.gridObjects[i];
            if (sym.action && sym.id !== 'empty') {
                sym.action(i, GAME.gridObjects, Engine);
            }
        }

        await new Promise(r => setTimeout(r, 300));

        // Scoring Phase
        let spinTotal = 0;
        for (let i = 0; i < GAME.gridSize; i++) {
            let sym = GAME.gridObjects[i];
            if (sym.id === 'empty') continue;

            let baseVal = sym.val;
            let scoreBonus = sym.score ? sym.score(i, GAME.gridObjects, Engine) : 0;
            
            // NEW: Visually trigger the score bonus if there is one!
            if (scoreBonus !== 0) {
                Engine.addBonus(i, scoreBonus); 
            }

            // Note: We use the already updated GAME.tempBonuses here instead of re-adding scoreBonus
            let totalVal = baseVal + GAME.tempBonuses[i];

            if (totalVal > 0) {
                spinTotal += totalVal;
                slots[i].classList.add('hit');
            }
        }

        GAME.gold += spinTotal;
        UI.log.innerText = `Earned +$${spinTotal} this spin!`;
        Engine.updateHUD();

        setTimeout(() => {
            if (GAME.spinsLeft <= 0) Engine.checkRent();
            else UI.btn.disabled = false;
        }, 800);
    },

    getAdjacent: (idx) => {
        let adj = [];
        let r = Math.floor(idx / GAME.cols), c = idx % GAME.cols;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < GAME.rows && nc >= 0 && nc < GAME.cols) {
                    adj.push(nr * GAME.cols + nc);
                }
            }
        }
        return adj;
    },
    
    consumeSymbol: (targetIdx, consumerIdx) => {
        const slots = document.querySelectorAll('.slot');
        slots[targetIdx].classList.add('eaten');
        GAME.gridObjects[targetIdx] = { ...SYMBOLS['empty'] };
    },
    
    replaceSymbol: (idx, newSymbolId) => {
        GAME.gridObjects[idx] = { ...SYMBOLS[newSymbolId] };
        document.querySelectorAll('.slot')[idx].innerText = SYMBOLS[newSymbolId].img;
    },
    
    addBonus: (idx, amount) => { 
        // 1. Add the math to the game state
        GAME.tempBonuses[idx] += amount; 
        
        // 2. Grab the visual slot
        const slot = document.querySelectorAll('.slot')[idx];
        
        // 3. Apply a glowing buff or shrinking debuff class
        if (amount > 0) {
            slot.classList.add('buffed');
        } else if (amount < 0) {
            slot.classList.add('debuffed');
        }

        // 4. Create floating text (e.g., "+15" or "-1")
        let floatTxt = document.createElement('span');
        floatTxt.innerText = amount > 0 ? `+${amount}` : `${amount}`;
        floatTxt.className = `floating-text ${amount > 0 ? 'positive' : 'negative'}`;
        slot.appendChild(floatTxt);

        // 5. Remove the visual effect classes after the animation finishes
        setTimeout(() => {
            slot.classList.remove('buffed', 'debuffed');
        }, 600);
    },
    log: (msg) => { UI.log.innerText = msg; },

    checkRent: () => {
        if (GAME.gold >= GAME.rent) {
            GAME.gold -= GAME.rent;
            GAME.round++;
            GAME.rent = Math.floor(GAME.rent * 1.6 + 25);
            GAME.spinsLeft = 6 + GAME.round; 
            
            Engine.updateHUD();
            
            // NEW: Give the player 3 picks before opening the shop!
            Engine.picksLeft = 3; 
            Engine.openShop();
        } else {
            localStorage.removeItem('slotRogueSave'); 
            alert(`GAME OVER.\nSurvived to Round ${GAME.round}.\nFinal Gold: ${GAME.gold}`);
            location.reload();
        }
    },

    updateHUD: () => {
        UI.gold.innerText = GAME.gold;
        UI.rent.innerText = GAME.rent;
        UI.spins.innerText = GAME.spinsLeft;
        UI.invCount.innerText = GAME.deck.length;
        UI.invGrid.innerHTML = '';
        
        GAME.deck.sort().forEach(id => {
            let item = SYMBOLS[id];
            let el = document.createElement('div');
            el.className = 'inv-item';
            el.innerText = item.img;
            el.title = `${item.id.toUpperCase()}\nBase Value: ${item.val}\n${item.desc}`;
            el.style.cursor = 'help';
            UI.invGrid.appendChild(el);
        });
    },

    openShop: () => {
        UI.shop.classList.remove('hidden');
        UI.shopOptions.innerHTML = '';
        
        // Update the log so the player knows how many picks they have left
        UI.log.innerText = `Shop Time! You have ${Engine.picksLeft} picks left.`;

        const pool = Object.values(SYMBOLS).filter(s => s.rarity !== 'none');
        
        for (let i = 0; i < 3; i++) {
            let roll = Math.random();
            
            // NEW RARITY ODDS: 
            // 2% Epic, 10% Rare, 28% Uncommon, 60% Common
            // New Odds: 0.5% Epic, 4.5% Rare, 20% Uncommon, 75% Common
            let targetRarity = roll > 0.995 ? 'epic' : roll > 0.95 ? 'rare' : roll > 0.75 ? 'uncommon' : 'common';
            
            let options = pool.filter(s => s.rarity === targetRarity);
            if (options.length === 0) options = pool.filter(s => s.rarity === 'common');
            let item = options[Math.floor(Math.random() * options.length)];

            let card = document.createElement('div');
            card.className = `shop-card rarity-${item.rarity}`;
            card.innerHTML = `
                <div class="card-icon">${item.img}</div>
                <div class="card-title">${item.id.toUpperCase()}</div>
                <div class="card-desc">${item.desc}</div>
                <div>💰 ${item.val}</div>
            `;
            
            card.onclick = () => {
                GAME.deck.push(item.id);
                Engine.picksLeft--; // Subtract 1 from your picks
                
                if (Engine.picksLeft > 0) {
                    Engine.openShop(); // Re-roll the 3 cards if you have picks left
                } else {
                    Engine.closeShop(); // Close the shop if you are out of picks
                }
            };
            UI.shopOptions.appendChild(card);
        }
    },
    
    closeShop: () => {
        UI.shop.classList.add('hidden');
        UI.btn.disabled = false;
        Engine.updateHUD();
        Engine.saveGame();
        UI.log.innerText = `Rent paid! Next goal: $${GAME.rent}`;
    },

    saveGame: () => {
        const saveData = {
            gold: GAME.gold, rent: GAME.rent,
            spinsLeft: GAME.spinsLeft, round: GAME.round, deck: GAME.deck
        };
        localStorage.setItem('slotRogueSave', JSON.stringify(saveData));
        Engine.log("Game Auto-saved.");
    },

    loadGame: () => {
        const saved = localStorage.getItem('slotRogueSave');
        if (saved) {
            const data = JSON.parse(saved);
            GAME.gold = data.gold; GAME.rent = data.rent;
            GAME.spinsLeft = data.spinsLeft; GAME.round = data.round;
            GAME.deck = data.deck;
            Engine.log("Game Loaded!");
            Engine.updateHUD();
            return true;
        }
        return false;
    }
};

window.onload = Engine.init;