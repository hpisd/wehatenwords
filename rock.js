// --- GAME DATA & STATE ---
let game = {
    rocks: 0,
    totalClicks: 0,
    clickPower: 1,
    tps: 0,
    globalTpsMult: 1,
    prestigePoints: 0,
    lastSaveTime: Date.now()
};

const buildingsData = [
    { id: 'picker', name: 'Rock Picker', desc: 'A local kid who gathers pebbles.', baseCost: 15, baseTps: 1, count: 0, mult: 1 },
    { id: 'mouse', name: 'Iron Mouse', desc: 'Increases click power.', baseCost: 50, increaseClickPower: 1, count: 0, mult: 1 },
    { id: 'pickaxe', name: 'Iron Pickaxe', desc: 'A reliable tool for breaking stone.', baseCost: 100, baseTps: 5, count: 0, mult: 1 },
    { id: 'shaft', name: 'Mine Shaft', desc: 'Dig deeper into the crust.', baseCost: 1100, baseTps: 50, count: 0, mult: 1 },
    { id: 'dynamite', name: 'Dynamite Rig', desc: 'Explosive excavation.', baseCost: 12000, baseTps: 250, count: 0, mult: 1 },
    { id: 'excavator', name: 'Heavy Excavator', desc: 'Industrial strip mining machinery.', baseCost: 130000, baseTps: 1500, count: 0, mult: 1 },
    { id: 'drill', name: 'Deep Earth Drill', desc: 'Piercing through the bedrock.', baseCost: 1500000, baseTps: 12000, count: 0, mult: 1 },
    { id: 'dredge', name: 'Magma Dredge', desc: 'Pulling rare minerals from lava.', baseCost: 20000000, baseTps: 100000, count: 0, mult: 1 },
    { id: 'extractor', name: 'Core Extractor', desc: 'Harvesting the center of the Earth.', baseCost: 300000000, baseTps: 1000000, count: 0, mult: 1 },
    { id: 'asteroid', name: 'Asteroid Miner', desc: 'Catching space rocks in orbit.', baseCost: 5000000000, baseTps: 15000000, count: 0, mult: 1 },
    { id: 'moon', name: 'Moon Quarry', desc: 'Mining the Moon.', baseCost: 100000000000, baseTps: 100000000, count: 0, mult: 1 },
    { id: 'planet', name: 'Planet Cracker', desc: 'Breaking entire planets.', baseCost: 1000000000000, baseTps: 1000000000, count: 0, mult: 1 },
    { id: 'star', name: 'Star Harvester', desc: 'Harvesting stellar material.', baseCost: 10000000000000, baseTps: 10000000000, count: 0, mult: 1 },
    { id: 'blackhole', name: 'Black Hole Extractor', desc: 'Pulling matter from singularities.', baseCost: 100000000000000, baseTps: 100000000000, count: 0, mult: 1 },
    { id: 'universe', name: 'Universe Miner', desc: 'Mining entire universes.', baseCost: 1000000000000000, baseTps: 1000000000000, count: 0, mult: 1 }
];

const upgradesData = [
    { id: 'c1', type: 'click', name: 'Sharper Chisels', desc: '+1 Rock per click', cost: 100, purchased: false, effect: () => { game.clickPower += 1; } },
    { id: 'c2', type: 'click', name: 'Heavy Sledgehammer', desc: '+5 Rocks per click', cost: 1000, purchased: false, effect: () => { game.clickPower += 5; } },
    { id: 'c3', type: 'click', name: 'Pneumatic Jackhammer', desc: 'Click power x2', cost: 10000, purchased: false, effect: () => { game.clickPower *= 2; } },
    { id: 'c4', type: 'click', name: 'Laser Drill', desc: 'Click power x5', cost: 100000, purchased: false, effect: () => { game.clickPower *= 5; } },
    { id: 'c5', type: 'click', name: 'Plasma Cutter', desc: 'Click power x5', cost: 1000000, purchased: false, effect: () => { game.clickPower *= 5; } },
    { id: 'c6', type: 'click', name: 'Resonance Tuning', desc: 'Click power x10', cost: 25000000, purchased: false, effect: () => { game.clickPower *= 10; } },
    { id: 'c7', type: 'click', name: 'Nanobot Swarm', desc: 'Click power x10', cost: 500000000, purchased: false, effect: () => { game.clickPower *= 10; } },
    { id: 'c8', type: 'click', name: 'Antimatter Pickaxe', desc: 'Click power x25', cost: 10000000000, purchased: false, effect: () => { game.clickPower *= 25; } },
    { id: 'c9', type: 'click', name: 'Quantum Clicker', desc: 'Click power x50', cost: 500000000000, purchased: false, effect: () => { game.clickPower *= 50; } },
    { id: 'c10', type: 'click', name: 'The Hand of God', desc: 'Click power x100', cost: 10000000000000, purchased: false, effect: () => { game.clickPower *= 100; } },

    { id: 'b0_1', type: 'building', name: 'Leather Gloves', desc: 'Pickers x2', cost: 100, purchased: false, effect: () => { buildingsData[0].mult *= 2; } },
    { id: 'b0_2', type: 'building', name: 'Sturdy Boots', desc: 'Pickers x3', cost: 1000, purchased: false, effect: () => { buildingsData[0].mult *= 3; } },
    { id: 'b0_3', type: 'building', name: 'Energy Drinks', desc: 'Pickers x4', cost: 10000, purchased: false, effect: () => { buildingsData[0].mult *= 4; } },
    { id: 'b0_4', type: 'building', name: 'Bionic Limbs', desc: 'Pickers x5', cost: 100000, purchased: false, effect: () => { buildingsData[0].mult *= 5; } },
    { id: 'b0_5', type: 'building', name: 'Cloning Vats', desc: 'Pickers x10', cost: 1000000, purchased: false, effect: () => { buildingsData[0].mult *= 10; } },

    { id: 'b1_1', type: 'building', name: 'Steel Heads', desc: 'Pickaxes x2', cost: 500, purchased: false, effect: () => { buildingsData[2].mult *= 2; } },
    { id: 'b1_2', type: 'building', name: 'Titanium Handles', desc: 'Pickaxes x3', cost: 5000, purchased: false, effect: () => { buildingsData[2].mult *= 3; } },
    { id: 'b1_3', type: 'building', name: 'Carbon Fiber Grips', desc: 'Pickaxes x4', cost: 50000, purchased: false, effect: () => { buildingsData[2].mult *= 4; } },
    { id: 'b1_4', type: 'building', name: 'Diamond Tips', desc: 'Pickaxes x5', cost: 500000, purchased: false, effect: () => { buildingsData[2].mult *= 5; } },
    { id: 'b1_5', type: 'building', name: 'Vibranium Forging', desc: 'Pickaxes x10', cost: 5000000, purchased: false, effect: () => { buildingsData[2].mult *= 10; } },

    { id: 'b2_1', type: 'building', name: 'Reinforced Supports', desc: 'Shafts x2', cost: 5500, purchased: false, effect: () => { buildingsData[3].mult *= 2; } },
    { id: 'b2_2', type: 'building', name: 'High-Speed Elevators', desc: 'Shafts x3', cost: 55000, purchased: false, effect: () => { buildingsData[3].mult *= 3; } },
    { id: 'b2_3', type: 'building', name: 'Automated Minecarts', desc: 'Shafts x4', cost: 550000, purchased: false, effect: () => { buildingsData[3].mult *= 4; } },
    { id: 'b2_4', type: 'building', name: 'Geothermal Power', desc: 'Shafts x5', cost: 5500000, purchased: false, effect: () => { buildingsData[3].mult *= 5; } },
    { id: 'b2_5', type: 'building', name: 'Spatial Folding', desc: 'Shafts x10', cost: 55000000, purchased: false, effect: () => { buildingsData[3].mult *= 10; } },

    { id: 'b3_1', type: 'building', name: 'High-Yield Explosives', desc: 'Dynamite x2', cost: 60000, purchased: false, effect: () => { buildingsData[4].mult *= 2; } },
    { id: 'b3_2', type: 'building', name: 'C4 Charges', desc: 'Dynamite x3', cost: 600000, purchased: false, effect: () => { buildingsData[4].mult *= 3; } },
    { id: 'b3_3', type: 'building', name: 'Shaped Charges', desc: 'Dynamite x4', cost: 6000000, purchased: false, effect: () => { buildingsData[4].mult *= 4; } },
    { id: 'b3_4', type: 'building', name: 'Nuclear Detonators', desc: 'Dynamite x5', cost: 60000000, purchased: false, effect: () => { buildingsData[4].mult *= 5; } },
    { id: 'b3_5', type: 'building', name: 'Antimatter Triggers', desc: 'Dynamite x10', cost: 600000000, purchased: false, effect: () => { buildingsData[4].mult *= 10; } },

    { id: 'b4_1', type: 'building', name: 'Titanium Treads', desc: 'Excavators x2', cost: 650000, purchased: false, effect: () => { buildingsData[5].mult *= 2; } },
    { id: 'b4_2', type: 'building', name: 'V8 Engines', desc: 'Excavators x3', cost: 6500000, purchased: false, effect: () => { buildingsData[5].mult *= 3; } },
    { id: 'b4_3', type: 'building', name: 'AI Autopilots', desc: 'Excavators x4', cost: 65000000, purchased: false, effect: () => { buildingsData[5].mult *= 4; } },
    { id: 'b4_4', type: 'building', name: 'Fusion Reactors', desc: 'Excavators x5', cost: 650000000, purchased: false, effect: () => { buildingsData[5].mult *= 5; } },
    { id: 'b4_5', type: 'building', name: 'Matter Disassemblers', desc: 'Excavators x10', cost: 6500000000, purchased: false, effect: () => { buildingsData[5].mult *= 10; } },

    { id: 'b5_1', type: 'building', name: 'Diamond Tipped Drills', desc: 'Drills x2', cost: 7500000, purchased: false, effect: () => { buildingsData[6].mult *= 2; } },
    { id: 'b5_2', type: 'building', name: 'Liquid Cooling', desc: 'Drills x3', cost: 75000000, purchased: false, effect: () => { buildingsData[6].mult *= 3; } },
    { id: 'b5_3', type: 'building', name: 'Sonic Resonance', desc: 'Drills x4', cost: 750000000, purchased: false, effect: () => { buildingsData[6].mult *= 4; } },
    { id: 'b5_4', type: 'building', name: 'Plasma Bits', desc: 'Drills x5', cost: 7500000000, purchased: false, effect: () => { buildingsData[6].mult *= 5; } },
    { id: 'b5_5', type: 'building', name: 'Tachyon Pulses', desc: 'Drills x10', cost: 75000000000, purchased: false, effect: () => { buildingsData[6].mult *= 10; } },

    { id: 'b6_1', type: 'building', name: 'Thermal Plating', desc: 'Dredges x2', cost: 100000000, purchased: false, effect: () => { buildingsData[7].mult *= 2; } },
    { id: 'b6_2', type: 'building', name: 'Obsidian Nets', desc: 'Dredges x3', cost: 1000000000, purchased: false, effect: () => { buildingsData[7].mult *= 3; } },
    { id: 'b6_3', type: 'building', name: 'Convection Turbines', desc: 'Dredges x4', cost: 10000000000, purchased: false, effect: () => { buildingsData[7].mult *= 4; } },
    { id: 'b6_4', type: 'building', name: 'Mantle Siphons', desc: 'Dredges x5', cost: 100000000000, purchased: false, effect: () => { buildingsData[7].mult *= 5; } },
    { id: 'b6_5', type: 'building', name: 'Star Core Tech', desc: 'Dredges x10', cost: 1000000000000, purchased: false, effect: () => { buildingsData[7].mult *= 10; } },

    { id: 'b7_1', type: 'building', name: 'Magnetic Containment', desc: 'Extractors x2', cost: 1500000000, purchased: false, effect: () => { buildingsData[8].mult *= 2; } },
    { id: 'b7_2', type: 'building', name: 'Gravity Inverters', desc: 'Extractors x3', cost: 15000000000, purchased: false, effect: () => { buildingsData[8].mult *= 3; } },
    { id: 'b7_3', type: 'building', name: 'Pressure Domes', desc: 'Extractors x4', cost: 150000000000, purchased: false, effect: () => { buildingsData[8].mult *= 4; } },
    { id: 'b7_4', type: 'building', name: 'Singularity Drives', desc: 'Extractors x5', cost: 1500000000000, purchased: false, effect: () => { buildingsData[8].mult *= 5; } },
    { id: 'b7_5', type: 'building', name: 'Dyson Harvesters', desc: 'Extractors x10', cost: 15000000000000, purchased: false, effect: () => { buildingsData[8].mult *= 10; } },

    { id: 'b8_1', type: 'building', name: 'Orbital Nets', desc: 'Asteroid Miners x2', cost: 25000000000, purchased: false, effect: () => { buildingsData[9].mult *= 2; } },
    { id: 'b8_2', type: 'building', name: 'Tractor Beams', desc: 'Asteroid Miners x3', cost: 250000000000, purchased: false, effect: () => { buildingsData[9].mult *= 3; } },
    { id: 'b8_3', type: 'building', name: 'Warp Drives', desc: 'Asteroid Miners x4', cost: 2500000000000, purchased: false, effect: () => { buildingsData[9].mult *= 4; } },
    { id: 'b8_4', type: 'building', name: 'Galaxy Sweepers', desc: 'Asteroid Miners x5', cost: 25000000000000, purchased: false, effect: () => { buildingsData[9].mult *= 5; } },
    { id: 'b8_5', type: 'building', name: 'Multiverse Tethers', desc: 'Asteroid Miners x10', cost: 250000000000000, purchased: false, effect: () => { buildingsData[9].mult *= 10; } },

    { id: 'g1', type: 'global', name: 'Geologist\'s Insight', desc: '+10% ALL production', cost: 25000, purchased: false, effect: () => { game.globalTpsMult *= 1.1; } },
    { id: 'g2', type: 'global', name: 'The Gold Rush', desc: '+50% ALL production', cost: 500000, purchased: false, effect: () => { game.globalTpsMult *= 1.5; } },
    { id: 'g3', type: 'global', name: 'Tectonic Resonance', desc: 'Doubles ALL production', cost: 25000000, purchased: false, effect: () => { game.globalTpsMult *= 2.0; } },
    { id: 'g4', type: 'global', name: 'Universal Gravity', desc: 'Triples ALL production', cost: 5000000000, purchased: false, effect: () => { game.globalTpsMult *= 3.0; } },
    { id: 'g5', type: 'global', name: 'Deep Earth Synergy', desc: 'Global x2', cost: 50000000000, purchased: false, effect: () => { game.globalTpsMult *= 2.0; } },
    { id: 'g6', type: 'global', name: 'Planetary Core Tap', desc: 'Global x3', cost: 1000000000000, purchased: false, effect: () => { game.globalTpsMult *= 3.0; } },
    { id: 'g7', type: 'global', name: 'Solar System Mining', desc: 'Global x5', cost: 25000000000000, purchased: false, effect: () => { game.globalTpsMult *= 5.0; } },
    { id: 'g8', type: 'global', name: 'Galactic Federation', desc: 'Global x10', cost: 500000000000000, purchased: false, effect: () => { game.globalTpsMult *= 10.0; } },
    { id: 'g9', type: 'global', name: 'Cosmic Convergence', desc: 'Global x25', cost: 10000000000000000, purchased: false, effect: () => { game.globalTpsMult *= 25.0; } },
    { id: 'g10', type: 'global', name: 'Omnipotence', desc: 'Global x100', cost: 999000000000000000, purchased: false, effect: () => { game.globalTpsMult *= 100.0; } },
    // --- Moon Quarry ---
    { id: 'b9_1', type: 'building', name: 'Lunar Rovers', desc: 'Moon Quarries x2', cost: 1e11, purchased: false, effect: () => { buildingsData[10].mult *= 2; } },
    { id: 'b9_2', type: 'building', name: 'Moon Bases', desc: 'Moon Quarries x3', cost: 1e12, purchased: false, effect: () => { buildingsData[10].mult *= 3; } },
    { id: 'b9_3', type: 'building', name: 'Low Gravity Boost', desc: 'Moon Quarries x4', cost: 1e13, purchased: false, effect: () => { buildingsData[10].mult *= 4; } },
    { id: 'b9_4', type: 'building', name: 'Helium-3 Reactors', desc: 'Moon Quarries x5', cost: 1e14, purchased: false, effect: () => { buildingsData[10].mult *= 5; } },
    { id: 'b9_5', type: 'building', name: 'Lunar Megastructures', desc: 'Moon Quarries x10', cost: 1e15, purchased: false, effect: () => { buildingsData[10].mult *= 10; } },
    // --- Planet Cracker ---
    { id: 'b10_1', type: 'building', name: 'Seismic Charges', desc: 'Planet Crackers x2', cost: 1e12, purchased: false, effect: () => { buildingsData[11].mult *= 2; } },
    { id: 'b10_2', type: 'building', name: 'Core Drillers', desc: 'Planet Crackers x3', cost: 1e13, purchased: false, effect: () => { buildingsData[11].mult *= 3; } },
    { id: 'b10_3', type: 'building', name: 'Mantle Collapsers', desc: 'Planet Crackers x4', cost: 1e14, purchased: false, effect: () => { buildingsData[11].mult *= 4; } },
    { id: 'b10_4', type: 'building', name: 'Gravity Breakers', desc: 'Planet Crackers x5', cost: 1e15, purchased: false, effect: () => { buildingsData[11].mult *= 5; } },
    { id: 'b10_5', type: 'building', name: 'Planet Annihilators', desc: 'Planet Crackers x10', cost: 1e16, purchased: false, effect: () => { buildingsData[11].mult *= 10; } },
    // --- Star Harvester ---
    { id: 'b11_1', type: 'building', name: 'Solar Nets', desc: 'Star Harvesters x2', cost: 1e13, purchased: false, effect: () => { buildingsData[12].mult *= 2; } },
    { id: 'b11_2', type: 'building', name: 'Fusion Boosters', desc: 'Star Harvesters x3', cost: 1e14, purchased: false, effect: () => { buildingsData[12].mult *= 3; } },
    { id: 'b11_3', type: 'building', name: 'Stellar Compressors', desc: 'Star Harvesters x4', cost: 1e15, purchased: false, effect: () => { buildingsData[12].mult *= 4; } },
    { id: 'b11_4', type: 'building', name: 'Supernova Harvesting', desc: 'Star Harvesters x5', cost: 1e16, purchased: false, effect: () => { buildingsData[12].mult *= 5; } },
    { id: 'b11_5', type: 'building', name: 'Dyson Swarms', desc: 'Star Harvesters x10', cost: 1e17, purchased: false, effect: () => { buildingsData[12].mult *= 10; } },
    // --- Black Hole Extractor ---
    { id: 'b12_1', type: 'building', name: 'Event Horizon Stabilizers', desc: 'Black Hole Extractors x2', cost: 1e14, purchased: false, effect: () => { buildingsData[13].mult *= 2; } },
    { id: 'b12_2', type: 'building', name: 'Singularity Pumps', desc: 'Black Hole Extractors x3', cost: 1e15, purchased: false, effect: () => { buildingsData[13].mult *= 3; } },
    { id: 'b12_3', type: 'building', name: 'Spacetime Funnels', desc: 'Black Hole Extractors x4', cost: 1e16, purchased: false, effect: () => { buildingsData[13].mult *= 4; } },
    { id: 'b12_4', type: 'building', name: 'Hawking Extractors', desc: 'Black Hole Extractors x5', cost: 1e17, purchased: false, effect: () => { buildingsData[13].mult *= 5; } },
    { id: 'b12_5', type: 'building', name: 'Infinite Density Core', desc: 'Black Hole Extractors x10', cost: 1e18, purchased: false, effect: () => { buildingsData[13].mult *= 10; } },
    // --- Universe Miner ---
    { id: 'b13_1', type: 'building', name: 'Reality Anchors', desc: 'Universe Miners x2', cost: 1e15, purchased: false, effect: () => { buildingsData[14].mult *= 2; } },
    { id: 'b13_2', type: 'building', name: 'Dimensional Rifts', desc: 'Universe Miners x3', cost: 1e16, purchased: false, effect: () => { buildingsData[14].mult *= 3; } },
    { id: 'b13_3', type: 'building', name: 'Multiverse Bridges', desc: 'Universe Miners x4', cost: 1e17, purchased: false, effect: () => { buildingsData[14].mult *= 4; } },
    { id: 'b13_4', type: 'building', name: 'Timeline Colliders', desc: 'Universe Miners x5', cost: 1e18, purchased: false, effect: () => { buildingsData[14].mult *= 5; } },
    { id: 'b13_5', type: 'building', name: 'Omniversal Engines', desc: 'Universe Miners x10', cost: 1e19, purchased: false, effect: () => { buildingsData[14].mult *= 10; } },
];

// --- DOM ELEMENTS ---
const rockCountEl = document.getElementById('rock-count');
const tpsCountEl = document.getElementById('tps-count');
const clickPowerEl = document.getElementById('click-power-display');
const globalMultEl = document.getElementById('global-mult-display');
const totalClicksEl = document.getElementById('total-clicks-display');
const prestigeDisplayEl = document.getElementById('prestige-display');
const mainBtn = document.getElementById('rock-btn');
const prestigeBtn = document.getElementById('prestige-btn');
const buildingsContainer = document.getElementById('buildings-container');
const upgradesContainer = document.getElementById('upgrades-container');

// --- CORE FUNCTIONS ---
function formatNumber(num) {
    if (num < 1000000) return Math.floor(num).toLocaleString();
    const suffixes = [
        { value: 1e303, symbol: " Centillion" }, { value: 1e300, symbol: " Novemnonagintillion" },
        { value: 1e297, symbol: " Octononagintillion" }, { value: 1e294, symbol: " Septennonagintillion" },
        { value: 1e291, symbol: " Sexnonagintillion" }, { value: 1e288, symbol: " Quinquanonagintillion" },
        { value: 1e285, symbol: " Quattuornonagintillion" }, { value: 1e282, symbol: " Tresnonagintillion" },
        { value: 1e279, symbol: " Duononagintillion" }, { value: 1e276, symbol: " Unnonagintillion" },
        { value: 1e273, symbol: " Nonagintillion" }, { value: 1e270, symbol: " Novemoctogintillion" },
        { value: 1e267, symbol: " Octooctogintillion" }, { value: 1e264, symbol: " Septemoctogintillion" },
        { value: 1e261, symbol: " Sexoctogintillion" }, { value: 1e258, symbol: " Quinquaoctogintillion" },
        { value: 1e255, symbol: " Quattuoroctogintillion" }, { value: 1e252, symbol: " Tresoctogintillion" },
        { value: 1e249, symbol: " Duooctogintillion" }, { value: 1e246, symbol: " Unoctogintillion" },
        { value: 1e243, symbol: " Octogintillion" }, { value: 1e240, symbol: " Novemseptuagintillion" },
        { value: 1e237, symbol: " Octoseptuagintillion" }, { value: 1e234, symbol: " Septenseptuagintillion" },
        { value: 1e231, symbol: " Sexseptuagintillion" }, { value: 1e228, symbol: " Quinquaseptuagintillion" },
        { value: 1e225, symbol: " Quattuorseptuagintillion" }, { value: 1e222, symbol: " Treseptuagintillion" },
        { value: 1e219, symbol: " Duoseptuagintillion" }, { value: 1e216, symbol: " Unseptuagintillion" },
        { value: 1e213, symbol: " Septuagintillion" }, { value: 1e210, symbol: " Novemsexagintillion" },
        { value: 1e207, symbol: " Octosexagintillion" }, { value: 1e204, symbol: " Septensexagintillion" },
        { value: 1e201, symbol: " Sexsexagintillion" }, { value: 1e198, symbol: " Quinquasexagintillion" },
        { value: 1e195, symbol: " Quattuorsexagintillion" }, { value: 1e192, symbol: " Tresexagintillion" },
        { value: 1e189, symbol: " Duosexagintillion" }, { value: 1e186, symbol: " Unsexagintillion" },
        { value: 1e183, symbol: " Sexagintillion" }, { value: 1e180, symbol: " Novemquinquagintillion" },
        { value: 1e177, symbol: " Octoquinquagintillion" }, { value: 1e174, symbol: " Septenquinquagintillion" },
        { value: 1e171, symbol: " Sexquinquagintillion" }, { value: 1e168, symbol: " Quinquaqinquagintillion" },
        { value: 1e165, symbol: " Quattuorquinquagintillion" }, { value: 1e162, symbol: " Tresquinquagintillion" },
        { value: 1e159, symbol: " Duoquinquagintillion" }, { value: 1e156, symbol: " Unquinquagintillion" },
        { value: 1e153, symbol: " Quinquagintillion" }, { value: 1e150, symbol: " Novemquadragintillion" },
        { value: 1e147, symbol: " Octoquadragintillion" }, { value: 1e144, symbol: " Septenquadragintillion" },
        { value: 1e141, symbol: " Sexquadragintillion" }, { value: 1e138, symbol: " Quinquaquadragintillion" },
        { value: 1e135, symbol: " Quattuorquadragintillion" }, { value: 1e132, symbol: " Tresquadragintillion" },
        { value: 1e129, symbol: " Duoquadragintillion" }, { value: 1e126, symbol: " Unquadragintillion" },
        { value: 1e123, symbol: " Quadragintillion" }, { value: 1e120, symbol: " Novemtrigintillion" },
        { value: 1e117, symbol: " Octotrigintillion" }, { value: 1e114, symbol: " Septentrigintillion" },
        { value: 1e111, symbol: " Sextrigintillion" }, { value: 1e108, symbol: " Quinquatrigintillion" },
        { value: 1e105, symbol: " Quattuortrigintillion" }, { value: 1e102, symbol: " Trestrigintillion" },
        { value: 1e99, symbol: " Duotrigintillion" }, { value: 1e96, symbol: " Untrigintillion" },
        { value: 1e93, symbol: " Trigintillion" }, { value: 1e90, symbol: " Novemvigintillion" },
        { value: 1e87, symbol: " Octovigintillion" }, { value: 1e84, symbol: " Septenvigintillion" },
        { value: 1e81, symbol: " Sexvigintillion" }, { value: 1e78, symbol: " Quinquavigintillion" },
        { value: 1e75, symbol: " Quattuorvigintillion" }, { value: 1e72, symbol: " Trevigintillion" },
        { value: 1e69, symbol: " Duovigintillion" }, { value: 1e66, symbol: " Unvigintillion" },
        { value: 1e63, symbol: " Vigintillion" }, { value: 1e60, symbol: " Novemdecillion" },
        { value: 1e57, symbol: " Octodecillion" }, { value: 1e54, symbol: " Septendecillion" },
        { value: 1e51, symbol: " Sexdecillion" }, { value: 1e48, symbol: " Quindecillion" },
        { value: 1e45, symbol: " Quattuordecillion" }, { value: 1e42, symbol: " Tredecillion" },
        { value: 1e39, symbol: " Duodecillion" }, { value: 1e36, symbol: " Undecillion" },
        { value: 1e33, symbol: " Decillion" }, { value: 1e30, symbol: " Nonillion" },
        { value: 1e27, symbol: " Octillion" }, { value: 1e24, symbol: " Septillion" },
        { value: 1e21, symbol: " Sextillion" }, { value: 1e18, symbol: " Quintillion" },
        { value: 1e15, symbol: " Quadrillion" }, { value: 1e12, symbol: " Trillion" },
        { value: 1e9, symbol: " Billion" }, { value: 1e6, symbol: " Million" }
    ];
    for (let i = 0; i < suffixes.length; i++) {
        if (num >= suffixes[i].value) {
            return (num / suffixes[i].value).toFixed(2) + suffixes[i].symbol;
        }
    }
    return Math.floor(num).toLocaleString();
}

function getBuildingCost(building) { return Math.floor(building.baseCost * Math.pow(1.15, building.count)); }

function calculateTPS() {
    let total = 0;
    buildingsData.forEach(b => { if (b.baseTps) total += (b.baseTps * b.mult) * b.count; });
    const prestigeMult = 1 + (game.prestigePoints * 0.10);
    game.tps = total * game.globalTpsMult * prestigeMult;
    tpsCountEl.innerText = formatNumber(game.tps);
}

mainBtn.addEventListener('click', () => {
    const prestigeMult = 1 + (game.prestigePoints * 0.10);
    game.rocks += game.clickPower * prestigeMult;
    game.totalClicks++;
    updateUI();
});

function buyBuilding(index) {
    const building = buildingsData[index];
    const cost = getBuildingCost(building);
    if (game.rocks >= cost) {
        game.rocks -= cost;
        building.count++;
        if (building.increaseClickPower) game.clickPower += (building.increaseClickPower * building.mult);
        calculateTPS();
        renderBuildings();
        updateUI();
    }
}

function buyUpgrade(index) {
    const upgrade = upgradesData[index];
    if (game.rocks >= upgrade.cost && !upgrade.purchased) {
        game.rocks -= upgrade.cost;
        upgrade.purchased = true;
        upgrade.effect(); 
        calculateTPS();   
        renderBuildings(); 
        renderUpgrades(); 
        updateUI();
    }
}

// --- PRESTIGE SYSTEM ---
function prestige() {
    if (game.rocks < 1e9) return; 
    const pointsGained = Math.floor(Math.pow(game.rocks / 1e9, 0.5));
    if(confirm(`Are you sure you want to ascend? You will sacrifice all your rocks, buildings, and research to gain ${formatNumber(pointsGained)} Prestige Points.\n\nEach point gives a permanent +10% boost to ALL production!`)) {
        game.prestigePoints += pointsGained;
        game.rocks = 0;
        game.clickPower = 1;
        game.globalTpsMult = 1;
        buildingsData.forEach(b => { b.count = 0; b.mult = 1; });
        upgradesData.forEach(u => u.purchased = false);
        saveGame();
        location.reload(); 
    }
}

// --- UI RENDERING ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

function renderBuildings() {
    buildingsContainer.innerHTML = '';
    const prestigeMult = 1 + (game.prestigePoints * 0.10);
    buildingsData.forEach((b, index) => {
        const cost = getBuildingCost(b);
        const isAffordable = game.rocks >= cost;
        let effectText = "";
        let effectColor = "";
        if (b.increaseClickPower) {
            effectText = `+${formatNumber(b.increaseClickPower * b.mult)} Click Power`;
            effectColor = "#64b5f6"; 
        } else if (b.baseTps) {
            effectText = `Mines ${formatNumber((b.baseTps * b.mult) * game.globalTpsMult * prestigeMult)} TPS`;
            effectColor = "var(--gold)"; 
        }
        const div = document.createElement('div');
        div.id = `building-${index}`;
        div.className = `store-item ${isAffordable ? '' : 'disabled'}`;
        div.onclick = () => buyBuilding(index);
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${b.name}</span>
                <span class="item-tps" style="color: ${effectColor}; margin-bottom: 4px; font-size: 12px;">${effectText}</span>
                <span class="item-desc">${b.desc}</span>
                <span class="item-cost">Cost: ${formatNumber(cost)}</span>
            </div>
            <div class="item-count">${b.count}</div>
        `;
        buildingsContainer.appendChild(div);
    });
}

function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    let available = upgradesData.filter(u => !u.purchased);
    available.sort((a, b) => {
        const aAffordable = game.rocks >= a.cost ? 1 : 0;
        const bAffordable = game.rocks >= b.cost ? 1 : 0;
        if (aAffordable !== bAffordable) return bAffordable - aAffordable;
        return a.cost - b.cost;
    });
    if (available.length === 0) {
        upgradesContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">All current geological research completed!</p>';
        return;
    }
    available.forEach(u => {
        const index = upgradesData.indexOf(u);
        const isAffordable = game.rocks >= u.cost;
        let typeClass = '', typeLabel = '';
        if(u.type === 'click') { typeClass = 'type-click'; typeLabel = '⛏️ Pickaxe Boost'; }
        if(u.type === 'building') { typeClass = 'type-building'; typeLabel = '🏭 Tech Boost'; }
        if(u.type === 'global') { typeClass = 'type-global'; typeLabel = '🌍 Global Boost'; }
        const div = document.createElement('div');
        div.id = `upgrade-${index}`;
        div.className = `store-item ${isAffordable ? '' : 'disabled'}`;
        div.onclick = () => buyUpgrade(index);
        div.innerHTML = `
            <div class="item-info">
                <span class="upgrade-type ${typeClass}">${typeLabel}</span>
                <span class="item-name">${u.name}</span>
                <span class="item-desc" style="color: #cfd8dc;">Effect: ${u.desc}</span>
                <span class="item-cost" style="margin-top: 5px;">Cost: ${formatNumber(u.cost)}</span>
            </div>
        `;
        upgradesContainer.appendChild(div);
    });
}

function checkAffordability() {
    buildingsData.forEach((b, i) => {
        const el = document.getElementById(`building-${i}`);
        if (el) game.rocks >= getBuildingCost(b) ? el.classList.remove('disabled') : el.classList.add('disabled');
    });
    upgradesData.forEach((u, i) => {
        const el = document.getElementById(`upgrade-${i}`);
        if (el && !u.purchased) game.rocks >= u.cost ? el.classList.remove('disabled') : el.classList.add('disabled');
    });
}

function updateUI() {
    rockCountEl.innerText = formatNumber(game.rocks) + " Rocks";
    const prestigeMult = 1 + (game.prestigePoints * 0.10);
    clickPowerEl.innerText = formatNumber(game.clickPower * prestigeMult);
    globalMultEl.innerText = game.globalTpsMult.toFixed(2) + "x";
    prestigeDisplayEl.innerText = `+${formatNumber(game.prestigePoints * 10)}% (${prestigeMult.toFixed(2)}x)`;
    totalClicksEl.innerText = formatNumber(game.totalClicks);
    if (game.rocks >= 1e9) {
        prestigeBtn.classList.remove('disabled');
        prestigeBtn.innerText = "Ascend (Ready!)";
    } else {
        prestigeBtn.classList.add('disabled');
        prestigeBtn.innerText = "Ascend (Needs 1 Billion)";
    }
    checkAffordability(); // Instant light-up
}

// --- SYSTEM FUNCTIONS ---
function saveGame() {
    game.lastSaveTime = Date.now();
    const saveData = {
        gameData: game,
        bData: buildingsData.map(b => ({ count: b.count, mult: b.mult })),
        uData: upgradesData.map(u => ({ purchased: u.purchased }))
    };
    localStorage.setItem('rockTycoonSave', JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem('rockTycoonSave');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(game, parsed.gameData);
            parsed.bData.forEach((b, i) => { if (buildingsData[i]) { buildingsData[i].count = b.count || 0; buildingsData[i].mult = b.mult || 1; } });
            parsed.uData.forEach((u, i) => { if (upgradesData[i]) { upgradesData[i].purchased = u.purchased || false; } });
            const now = Date.now();
            if (game.lastSaveTime && game.tps > 0) {
                const offlineSeconds = (now - game.lastSaveTime) / 1000;
                if (offlineSeconds > 60) {
                    const offlineEarnings = (game.tps / 2) * offlineSeconds; 
                    game.rocks += offlineEarnings;                           
                    alert(`Welcome back! You earned ${formatNumber(offlineEarnings)} rocks while offline.`);
                }
            }
        } catch (e) { console.error("Save corrupted."); }
    }
    calculateTPS(); renderBuildings(); renderUpgrades(); updateUI();
}

function exportSave() { saveGame(); prompt("Export code:", btoa(localStorage.getItem('rockTycoonSave'))); }
function importSave() {
    const str = prompt("Paste code:");
    if (str) { try { localStorage.setItem('rockTycoonSave', atob(str)); location.reload(); } catch (e) { alert("Invalid!"); } }
}
function resetGame() { if (confirm("Wipe save?")) { localStorage.removeItem('rockTycoonSave'); location.reload(); } }

// --- LOOP ---
let lastTick = Date.now();
function gameLoop() {
    const now = Date.now();
    const dt = (now - lastTick) / 1000;
    lastTick = now;
    if (game.tps > 0) game.rocks += game.tps * dt;
    updateUI();
    requestAnimationFrame(gameLoop);
}

setInterval(saveGame, 10000); // Auto-save
loadGame();
requestAnimationFrame(gameLoop);