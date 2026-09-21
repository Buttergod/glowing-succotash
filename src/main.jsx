import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Github, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import './styles.css';

const GAME_DEFS = [
  { id: 'scale', title: 'Scale of the Universe', category: 'Science & Space', emoji: '🪐', description: 'Slide from the tiniest distances to the mind-bending size of the universe.' },
  { id: 'element', title: 'Element Mixer', category: 'Science & Space', emoji: '⚗️', description: 'Mix atoms and discover the compounds hidden in plain sight.' },
  { id: 'deep-sea', title: 'Deep Sea Explorer', category: 'Science & Space', emoji: '🐙', description: 'Descend into darkness, pressure, and incredible ocean life.' },
  { id: 'gravity', title: 'Gravity Simulator', category: 'Science & Space', emoji: '🍎', description: 'Drop the same object on different worlds and compare acceleration.' },
  { id: 'life', title: 'Life Expectancy Time Travel', category: 'History & Geography', emoji: '⌛', description: 'Compare your life story with different eras and regions.' },
  { id: 'country', title: 'Country Size Compare', category: 'History & Geography', emoji: '🗺️', description: 'Compare actual land area without a distorted map fooling you.' },
  { id: 'timeline', title: 'History Timeline Slider', category: 'History & Geography', emoji: '🏺', description: 'Jump from the Big Bang to the present and explore major eras.' },
  { id: 'wonders', title: 'Wonders of the World Checklist', category: 'History & Geography', emoji: '🏛️', description: 'Plan a dream tour with a limited budget and limited time.' },
  { id: 'trillion', title: 'Visualizing a Trillion Dollars', category: 'Mathematics & Finance', emoji: '💵', description: 'See how absurdly tall a stack of money gets at massive scales.' },
  { id: 'inflation', title: 'Inflation Calculator', category: 'Mathematics & Finance', emoji: '🥖', description: 'Convert old prices into modern purchasing power to see inflation in action.' },
  { id: 'plinko', title: 'Probability Plinko', category: 'Mathematics & Finance', emoji: '🔴', description: 'Drop marbles and watch randomness become a bell curve.' },
  { id: 'bubble', title: 'Crypto Tulip Mania Sandbox', category: 'Mathematics & Finance', emoji: '🌷', description: 'Trade through bubbles, crashes, and crowd psychology.' },
  { id: 'carbon', title: 'Carbon Footprint Tycoon', category: 'Nature & Environment', emoji: '🌱', description: 'Build a city that balances comfort, cost, and climate impact.' },
  { id: 'race', title: 'Animal Speed Drag Race', category: 'Nature & Environment', emoji: '🐆', description: 'Watch different species sprint at their real world speeds.' },
  { id: 'forest', title: 'Deforestation Visualizer', category: 'Nature & Environment', emoji: '🌳', description: 'Measure how fast forests are disappearing in real time.' },
  { id: 'brain', title: 'Interactive Human Brain Map', category: 'Language, Culture & Anatomy', emoji: '🧠', description: 'Tap different brain regions to trigger sensory experiments.' },
  { id: 'idiom', title: 'Idioms Around the World', category: 'Language, Culture & Anatomy', emoji: '🗣️', description: 'Reveal literal translations for phrases that mean something else entirely.' },
  { id: 'typing', title: 'The Speed of Typing Facts', category: 'Language, Culture & Anatomy', emoji: '⌨️', description: 'Type your way through science facts and unlock deeper trivia.' },
];

const categories = ['All', ...new Set(GAME_DEFS.map((game) => game.category))];

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatMoney(n) {
  if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function Meter({ value, max = 100, color = '#6757e8' }) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className="meter">
      <i style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filteredGames = useMemo(() => {
    return GAME_DEFS.filter((game) => {
      const matchesCategory = category === 'All' || game.category === category;
      const haystack = `${game.title} ${game.description} ${game.category}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, query]);

  const selectedGame = GAME_DEFS.find((game) => game.id === selectedId) || null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setSelectedId(null)}>
          <span className="brand-mark">✦</span>
          <span>WONDERLAB</span>
        </button>
        <div className="topbar-note">
          <Sparkles size={16} />
          18 interactive experiments
        </div>
      </header>

      <AnimatePresence mode="wait">
        {selectedGame ? (
          <motion.section
            key={selectedGame.id}
            className="game-view"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <button className="back-button" onClick={() => setSelectedId(null)}>
              <ArrowLeft size={18} />
              all experiments
            </button>

            <div className="game-header">
              <span className="game-emoji">{selectedGame.emoji}</span>
              <div>
                <p className="eyebrow">{selectedGame.category}</p>
                <h1>{selectedGame.title}</h1>
                <p className="subheader">{selectedGame.description}</p>
              </div>
            </div>

            <SelectedGamePanel gameId={selectedGame.id} />
          </motion.section>
        ) : (
          <motion.section
            key="dashboard"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">A TINY MUSEUM OF BIG IDEAS</p>
                <h2>
                  Learn by<br />
                  <span>messing with it.</span>
                </h2>
                <p>
                  Wonderlab is a playful collection of interactive experiments for curious minds.
                  Explore the world through speed, scale, climate, money, and human stories.
                </p>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="orbit one">✦</div>
                <div className="orbit two">?</div>
                <div className="planet">🌎</div>
              </div>
            </section>

            <section className="toolbar">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search experiments…"
                />
              </div>

              <div className="filter-row">
                <SlidersHorizontal size={16} />
                {categories.map((name) => (
                  <button
                    key={name}
                    className={category === name ? 'filter-chip active' : 'filter-chip'}
                    onClick={() => setCategory(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            <section className="game-grid">
              {filteredGames.map((game, index) => (
                <motion.button
                  key={game.id}
                  className="game-card"
                  onClick={() => setSelectedId(game.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <span className="card-emoji">{game.emoji}</span>
                  <span className="card-category">{game.category}</span>
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <span className="card-link">try it →</span>
                </motion.button>
              ))}
            </section>

            {filteredGames.length === 0 && (
              <div className="empty-state">No experiments match that search. Try a broader term.</div>
            )}

            <footer className="footer">
              <span>Made for curious minds</span>
              <a href="https://github.com/Buttergod/glowing-succotash" target="_blank" rel="noreferrer">
                <Github size={14} />
                source
              </a>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function SelectedGamePanel({ gameId }) {
  switch (gameId) {
    case 'scale':
      return <ScaleUniverse />;
    case 'element':
      return <ElementMixer />;
    case 'deep-sea':
      return <DeepSeaExplorer />;
    case 'gravity':
      return <GravitySimulator />;
    case 'life':
      return <LifeExpectancy />;
    case 'country':
      return <CountryCompare />;
    case 'timeline':
      return <TimelineSlider />;
    case 'wonders':
      return <WondersChecklist />;
    case 'trillion':
      return <TrillionVisualizer />;
    case 'inflation':
      return <InflationCalculator />;
    case 'plinko':
      return <PlinkoGame />;
    case 'bubble':
      return <TulipBubble />;
    case 'carbon':
      return <CarbonTycoon />;
    case 'race':
      return <AnimalRace />;
    case 'forest':
      return <DeforestationVisualizer />;
    case 'brain':
      return <BrainMap />;
    case 'idiom':
      return <IdiomsWorld />;
    case 'typing':
      return <TypingFacts />;
    default:
      return <div className="panel">Coming soon.</div>;
  }
}

function ScaleUniverse() {
  const [value, setValue] = useLocalStorageState('wonder-scale', 55);
  const levels = [
    { label: 'Planck length', text: 'The smallest meaningful length in physics. At this scale, mathematics starts to wobble.' },
    { label: 'DNA helix', text: 'Millions of molecules are packed into a single tiny coil of life.' },
    { label: 'Human', text: 'You are roughly 1.7 to 2 meters tall and full of systems that feel huge.' },
    { label: 'Earth', text: 'Our planet is a blue marble carrying a lot of drama.' },
    { label: 'Solar system', text: 'The Sun and planets are spread across a vast empty neighborhood.' },
    { label: 'Observable universe', text: 'The sphere of what we can see is bigger than our minds can comfortably hold.' },
  ];
  const index = Math.min(levels.length - 1, Math.floor((value / 100) * levels.length));
  const level = levels[index];

  return (
    <div className="panel">
      <h2>Scale of the Universe</h2>
      <div className="reading large">10{index === 5 ? '^26' : '^' + (index + 1)} m</div>
      <input className="range-input" type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      <div className="info-row">
        <span className="pill">Current scale</span>
        <strong>{level.label}</strong>
      </div>
      <p className="fact-copy">{level.text}</p>
    </div>
  );
}

function ElementMixer() {
  const [selected, setSelected] = useLocalStorageState('element-mixer-selected', ['Hydrogen', 'Oxygen']);
  const elements = ['Hydrogen', 'Oxygen', 'Carbon', 'Sodium', 'Chlorine', 'Nitrogen'];
  const recipes = {
    'Hydrogen,Oxygen': 'Water: H₂O — two hydrogen atoms and one oxygen atom create the molecule life depends on.',
    'Hydrogen,Carbon': 'Methane: CH₄ — a lightweight gas that fuels some of humanity\'s heat and power.',
    'Sodium,Chlorine': 'Salt: NaCl — a dazzling ionic bond that turns reactive ingredients into a stable crystal.',
    'Carbon,Oxygen': 'Carbon dioxide: CO₂ — a molecule with a surprisingly large role in climate and breathing.',
    'Hydrogen,Nitrogen': 'Ammonia: NH₃ — a key industrial compound that also shows up in many biological systems.',
  };

  const key = selected.slice().sort().join(',');
  const result = recipes[key] || 'Try a pair that forms a common molecule. The reaction can be surprisingly elegant.';

  const toggleElement = (element) => {
    const next = selected.includes(element)
      ? selected.filter((item) => item !== element)
      : selected.length >= 2
        ? [selected[1], element]
        : [...selected, element];
    setSelected(next.slice(0, 2));
  };

  return (
    <div className="panel">
      <h2>Element Mixer</h2>
      <div className="choice-grid">
        {elements.map((element) => (
          <button
            key={element}
            className={selected.includes(element) ? 'choice-button selected' : 'choice-button'}
            onClick={() => toggleElement(element)}
          >
            {element}
          </button>
        ))}
      </div>
      <div className="info-row">
        <span className="pill">Current pair</span>
        <strong>{selected.join(' + ') || 'Pick two elements'}</strong>
      </div>
      <div className="highlight-box">{result}</div>
    </div>
  );
}

function DeepSeaExplorer() {
  const [depth, setDepth] = useLocalStorageState('deep-sea-depth', 55);
  const meterDepth = Math.round((depth / 100) * 4000);
  const zones = [
    { label: 'Sunlight zone', fact: 'Photosynthesis still works. Fish can see their food clearly.' },
    { label: 'Twilight zone', fact: 'Sunlight fades, and bioluminescence becomes the main visual trick.' },
    { label: 'Midnight zone', fact: 'It is pitch black and the pressure is crushing for surface life.' },
    { label: 'Abyssal plain', fact: 'The ocean floor looks alien and the ecosystem is built for scarcity.' },
  ];
  const zoneIndex = Math.min(zones.length - 1, Math.floor((depth / 100) * zones.length));
  const zone = zones[zoneIndex];

  return (
    <div className="panel">
      <h2>Deep Sea Explorer</h2>
      <div className="reading large">{meterDepth} m</div>
      <input className="range-input" type="range" min="0" max="100" value={depth} onChange={(e) => setDepth(Number(e.target.value))} />
      <div className="ocean-scene" style={{ background: `linear-gradient(180deg, #8fd7f3 0%, #4db0d8 ${50 - depth / 3}%, #091f3d ${100 - depth / 4}%)` }}>
        <span className="sea-creature">{meterDepth < 1000 ? '🐠' : meterDepth < 2500 ? '🐡' : meterDepth < 3500 ? '🦑' : '🦀'}</span>
      </div>
      <div className="info-row">
        <span className="pill">Zone</span>
        <strong>{zone.label}</strong>
      </div>
      <p className="fact-copy">{zone.fact}</p>
    </div>
  );
}

function GravitySimulator() {
  const [planet, setPlanet] = useLocalStorageState('gravity-planet', 'Earth');
  const [dropCount, setDropCount] = useLocalStorageState('gravity-count', 0);
  const values = {
    Earth: 9.8,
    Moon: 1.6,
    Mars: 3.7,
    Jupiter: 24.8,
  };

  return (
    <div className="panel">
      <h2>Gravity Simulator</h2>
      <div className="choice-grid compact">
        {Object.keys(values).map((name) => (
          <button key={name} className={planet === name ? 'choice-button selected' : 'choice-button'} onClick={() => setPlanet(name)}>
            {name}
          </button>
        ))}
      </div>
      <div className="drop-zone">
        <div className="falling-object">🍎</div>
        <div className="ground-line" />
      </div>
      <div className="reading">{values[planet].toFixed(1)} m/s²</div>
      <button className="primary-button" onClick={() => setDropCount((count) => count + 1)}>
        Drop again
      </button>
      <p className="fact-copy">This object falls faster on {planet} because gravitational acceleration is {values[planet].toFixed(1)} m/s². Total drops: {dropCount}.</p>
    </div>
  );
}

function LifeExpectancy() {
  const [birthYear, setBirthYear] = useLocalStorageState('life-year', 1995);
  const [country, setCountry] = useLocalStorageState('life-country', 'United States');
  const years = [1800, 1900, 1950, 1980, 2000, 2026];
  const countries = ['United States', 'Japan', 'India', 'Brazil', 'Nigeria'];

  const estimatedAge = Math.min(90, Math.max(25, Math.round((2026 - birthYear) * 0.9 + 20)));
  const countryAdjust = country === 'Japan' ? 4 : country === 'India' ? -8 : country === 'Nigeria' ? -10 : 0;
  const lifeExpectancy = clamp(75 + countryAdjust + (2026 - birthYear) / 250, 24, 86);

  return (
    <div className="panel">
      <h2>Life Expectancy Time Travel</h2>
      <label className="field-label">Birth year</label>
      <input className="range-input" type="range" min="1800" max="2026" value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value))} />
      <div className="reading">{birthYear}</div>
      <label className="field-label">Country</label>
      <div className="choice-grid compact">
        {countries.map((item) => (
          <button key={item} className={country === item ? 'choice-button selected' : 'choice-button'} onClick={() => setCountry(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="highlight-box">Estimated median lifespan: {lifeExpectancy.toFixed(1)} years. Your life would likely feel like a mix of {years.filter((year) => year <= birthYear).slice(-2).join(' and ')}-era habits and present-day health care.</div>
      <p className="fact-copy">A person born in {birthYear} in {country} would probably see one of the biggest global shifts in medicine, transport, and communication the world has ever seen.</p>
    </div>
  );
}

function CountryCompare() {
  const countries = [
    { name: 'Greenland', area: 2_166_086, emoji: '❄️' },
    { name: 'India', area: 3_287_263, emoji: '🇮🇳' },
    { name: 'Brazil', area: 8_515_767, emoji: '🇧🇷' },
    { name: 'United States', area: 9_833_517, emoji: '🇺🇸' },
  ];
  const [selected, setSelected] = useLocalStorageState('country-selected', 'Brazil');
  const target = countries.find((country) => country.name === selected) || countries[2];

  return (
    <div className="panel">
      <h2>Country Size Compare</h2>
      <div className="choice-grid compact">
        {countries.map((country) => (
          <button key={country.name} className={selected === country.name ? 'choice-button selected' : 'choice-button'} onClick={() => setSelected(country.name)}>
            {country.emoji} {country.name}
          </button>
        ))}
      </div>
      <div className="reading large">{target.area.toLocaleString()} km²</div>
      <div className="map-block">{target.emoji}</div>
      <p className="fact-copy">Mercator projections exaggerate regions near the poles. {target.name} is a reminder that real land area can look very different on a flat map.</p>
    </div>
  );
}

function TimelineSlider() {
  const [value, setValue] = useLocalStorageState('timeline-value', 45);
  const eras = [
    { label: 'Big Bang', fact: 'Space, time, and the first particles emerged from an unimaginably hot beginning.' },
    { label: 'First life', fact: 'Cells formed in oceans, beginning a long chain of adaptation and complexity.' },
    { label: 'Dinosaurs', fact: 'Large reptiles ruled the land before a mass extinction changed the world.' },
    { label: 'Civilizations', fact: 'Humans began writing, building cities, and making laws and myth.' },
    { label: 'Modern world', fact: 'Science, communication, and global systems compressed geography and time.' },
  ];
  const index = Math.min(eras.length - 1, Math.floor((value / 100) * eras.length));
  const era = eras[index];

  return (
    <div className="panel">
      <h2>History Timeline Slider</h2>
      <input className="range-input" type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      <div className="reading">{era.label}</div>
      <div className="highlight-box">{era.fact}</div>
      <p className="fact-copy">Every era feels long when you live in it, but the full arc of human history is only a brief blink against cosmic time.</p>
    </div>
  );
}

function WondersChecklist() {
  const [selected, setSelected] = useLocalStorageState('wonders', ['Pyramids of Giza']);
  const wonders = ['Pyramids of Giza', 'Petra', 'Machu Picchu', 'Colosseum', 'Taj Mahal'];
  const toggle = (wonder) => {
    setSelected((prev) => (prev.includes(wonder) ? prev.filter((item) => item !== wonder) : [...prev, wonder]));
  };

  return (
    <div className="panel">
      <h2>Wonders Checklist</h2>
      <div className="choice-grid compact">
        {wonders.map((wonder) => (
          <button key={wonder} className={selected.includes(wonder) ? 'choice-button selected' : 'choice-button'} onClick={() => toggle(wonder)}>
            {selected.includes(wonder) ? '✓ ' : '○ '}{wonder}
          </button>
        ))}
      </div>
      <div className="reading">{selected.length} chosen</div>
      <p className="fact-copy">Saving time and money matters, but these places teach that engineering, culture, and labor are often a giant shared act of imagination.</p>
    </div>
  );
}

function TrillionVisualizer() {
  const [value, setValue] = useLocalStorageState('trillion-slider', 60);
  const scales = [
    { label: '$100', amount: 100 },
    { label: '$1M', amount: 1_000_000 },
    { label: '$1B', amount: 1_000_000_000 },
    { label: '$1T', amount: 1_000_000_000_000 },
  ];
  const index = Math.min(scales.length - 1, Math.floor((value / 100) * scales.length));
  const amount = scales[index].amount;

  return (
    <div className="panel">
      <h2>Visualizing a Trillion Dollars</h2>
      <div className="reading large">{scales[index].label}</div>
      <input className="range-input" type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      <div className="money-stack" style={{ height: 30 + (value / 100) * 120 }}>{'💵'.repeat(Math.max(1, Math.round(value / 20)))}</div>
      <p className="fact-copy">A trillion dollars is enough to make even a giant stack of bills feel absurdly tall. In perspective, the scale of wealth dwarfs what most people experience in a lifetime.</p>
    </div>
  );
}

function InflationCalculator() {
  const [year, setYear] = useLocalStorageState('inflation-year', 2026);
  const [item, setItem] = useLocalStorageState('inflation-item', 'Loaf of bread');
  const itemMap = {
    'Loaf of bread': { 1800: 0.07, 1900: 0.12, 1950: 0.18, 2026: 2.89 },
    'House': { 1800: 600, 1900: 3500, 1950: 9200, 2026: 450000 },
    'Coffee': { 1800: 0.12, 1900: 0.2, 1950: 0.45, 2026: 5.75 },
    'Movie ticket': { 1800: 0.05, 1900: 0.15, 1950: 0.75, 2026: 13.5 },
  };

  const price = itemMap[item][Math.min(2026, Math.max(1800, year))] ?? 1;

  return (
    <div className="panel">
      <h2>Inflation Calculator</h2>
      <div className="choice-grid compact">
        {Object.keys(itemMap).map((entry) => (
          <button key={entry} className={item === entry ? 'choice-button selected' : 'choice-button'} onClick={() => setItem(entry)}>
            {entry}
          </button>
        ))}
      </div>
      <label className="field-label">Year</label>
      <input className="range-input" type="range" min="1800" max="2026" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      <div className="reading large">{formatMoney(price)}</div>
      <p className="fact-copy">In {year}, the cost of {item.toLowerCase()} is roughly {formatMoney(price)}, a reminder that prices rise and purchasing power shifts over time.</p>
    </div>
  );
}

function PlinkoGame() {
  const [balls, setBalls] = useState(() => Array.from({ length: 25 }, () => Math.random()));

  return (
    <div className="panel">
      <h2>Probability Plinko</h2>
      <button className="primary-button" onClick={() => setBalls(Array.from({ length: 40 }, () => Math.random()))}>Drop 40 marbles</button>
      <div className="plinko-board">
        {Array.from({ length: 9 }, (_, column) => (
          <div key={column} className="plinko-column">
            {balls.map((ball, index) => (
              <span key={`${column}-${index}`} className="plinko-dot" style={{ left: `${(column / 8) * 100}%`, top: `${(index % 8) * 10 + ((ball * 100) % 15)}%` }} />
            ))}
          </div>
        ))}
      </div>
      <p className="fact-copy">The middle bins become most common, and the distribution starts to resemble a bell curve. That is the heart of the Central Limit Theorem in action.</p>
    </div>
  );
}

function TulipBubble() {
  const [cash, setCash] = useLocalStorageState('bubble-cash', 1000);
  const [holding, setHolding] = useLocalStorageState('bubble-holding', 0);
  const [price, setPrice] = useLocalStorageState('bubble-price', 10);

  const buy = () => {
    if (cash >= price) {
      setCash((current) => current - price);
      setHolding((current) => current + 1);
      setPrice((current) => current + 2.5);
    }
  };

  const sell = () => {
    if (holding > 0) {
      setCash((current) => current + price);
      setHolding((current) => current - 1);
      setPrice((current) => current - 1.8);
    }
  };

  return (
    <div className="panel">
      <h2>Crypto Tulip Mania Sandbox</h2>
      <div className="reading">Cash: {formatMoney(cash)} · Holding: {holding}</div>
      <div className="highlight-box">Price per token: {formatMoney(price)}</div>
      <div className="button-row">
        <button className="primary-button" onClick={buy}>Buy</button>
        <button className="secondary-button" onClick={sell}>Sell</button>
      </div>
      <p className="fact-copy">Market sentiment can snowball. When everyone believes the story, price becomes a mood more than a measure. The crash is where the story finally meets reality.</p>
    </div>
  );
}

function CarbonTycoon() {
  const [choices, setChoices] = useLocalStorageState('carbon-choices', ['solar', 'transit']);
  const totals = {
    solar: 8,
    transit: 10,
    trees: 6,
    efficiency: 7,
  };

  const reduce = Object.values(totals).reduce((sum, value) => sum + value, 0) - choices.length * 4;

  const toggleChoice = (choice) => {
    setChoices((prev) => (prev.includes(choice) ? prev.filter((item) => item !== choice) : [...prev, choice]));
  };

  return (
    <div className="panel">
      <h2>Carbon Footprint Tycoon</h2>
      <div className="choice-grid compact">
        {Object.keys(totals).map((choice) => (
          <button key={choice} className={choices.includes(choice) ? 'choice-button selected' : 'choice-button'} onClick={() => toggleChoice(choice)}>
            {choice}
          </button>
        ))}
      </div>
      <Meter value={Math.max(0, 100 - reduce)} max={100} color="#3dbb76" />
      <div className="reading">{Math.max(0, 100 - reduce)}% emissions remaining</div>
      <p className="fact-copy">A cleaner city is a better city when many small upgrades stack together: cleaner grids, better transit, and greener land use.</p>
    </div>
  );
}

function AnimalRace() {
  const animals = [
    { name: 'Snail', speed: 0.05, emoji: '🐌' },
    { name: 'Human', speed: 40, emoji: '🏃' },
    { name: 'Cheetah', speed: 110, emoji: '🐆' },
    { name: 'Peregrine', speed: 320, emoji: '🦅' },
  ];
  const [start, setStart] = useState(false);

  return (
    <div className="panel">
      <h2>Animal Speed Drag Race</h2>
      <button className="primary-button" onClick={() => setStart(true)}>Start race</button>
      {animals.map((animal) => (
        <div className="race-track" key={animal.name}>
          <span className="race-label">{animal.emoji} {animal.name}</span>
          <span className="race-progress" style={{ width: start ? `${Math.min(96, animal.speed / 4)}%` : '4%' }} />
        </div>
      ))}
      <p className="fact-copy">The real world is messy, but the rough numbers remind us that speed is not just a sport fact — it is a physical system shaped by biology and physics.</p>
    </div>
  );
}

function DeforestationVisualizer() {
  const [fieldCount, setFieldCount] = useLocalStorageState('forest-fields', 12);

  useEffect(() => {
    const handle = setInterval(() => {
      setFieldCount((current) => (current + 2) % 100);
    }, 1200);
    return () => clearInterval(handle);
  }, [setFieldCount]);

  return (
    <div className="panel">
      <h2>Deforestation Visualizer</h2>
      <div className="reading large">{fieldCount} football fields / sec</div>
      <div className="forest-strip">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} className={index < Math.max(2, 12 - Math.round(fieldCount / 10)) ? 'forest-tree active' : 'forest-tree'}>
            🌲
          </span>
        ))}
      </div>
      <p className="fact-copy">Loss rates are often easier to grasp when visualized as a changing landscape. The real lesson is that ecosystems are not unlimited.</p>
    </div>
  );
}

function BrainMap() {
  const [selected, setSelected] = useLocalStorageState('brain-lobe', 'Frontal');
  const lobes = ['Frontal', 'Parietal', 'Temporal', 'Occipital'];

  return (
    <div className="panel">
      <h2>Interactive Human Brain Map</h2>
      <div className="brain-panel">
        <div className="brain-core">🧠</div>
        <div className="choice-grid compact">
          {lobes.map((lobe) => (
            <button key={lobe} className={selected === lobe ? 'choice-button selected' : 'choice-button'} onClick={() => setSelected(lobe)}>
              {lobe}
            </button>
          ))}
        </div>
      </div>
      <div className="highlight-box">Selected lobe: {selected}. This region helps coordinate planning, perception, memory, and sensory interpretation.</div>
    </div>
  );
}

function IdiomsWorld() {
  const [country, setCountry] = useLocalStorageState('idiom-country', 'Japan');
  const idioms = {
    Japan: 'A person is “on the edge of a spoon” when they are awkwardly close to something weird.',
    France: 'Someone may be “walking with a banana” when they are acting silly in a nice way.',
    Brazil: 'A phrase can sound like a very literal football storm when it means “totally overwhelmed.”',
    Finland: 'Literal wording can sound like a winter joke when it really means “to overthink it.”',
  };

  return (
    <div className="panel">
      <h2>Idioms Around the World</h2>
      <div className="choice-grid compact">
        {Object.keys(idioms).map((entry) => (
          <button key={entry} className={country === entry ? 'choice-button selected' : 'choice-button'} onClick={() => setCountry(entry)}>
            {entry}
          </button>
        ))}
      </div>
      <div className="highlight-box">{idioms[country]}</div>
      <p className="fact-copy">Idioms are thought-pictures. A literal translation can reveal a culture\'s favorite image, emotion, or discomfort.</p>
    </div>
  );
}

function TypingFacts() {
  const phrase = 'A day on Venus is longer than a year on Venus, because Venus spins more slowly than it orbits the Sun.';
  const [value, setValue] = useState('');
  const typedPercentage = (value.length / phrase.length) * 100;
  const accuracy = value ? Math.min(100, (phrase.split('').filter((char, index) => value[index] === char).length / value.length) * 100) : 100;

  return (
    <div className="panel">
      <h2>Speed of Typing Facts</h2>
      <p className="fact-copy">Type the fact below to unlock the next layer of science trivia.</p>
      <textarea className="typing-box" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Type the fact here…" />
      <Meter value={typedPercentage} max={100} color={typedPercentage >= 100 ? '#3dbb76' : '#6757e8'} />
      <div className="reading">Progress: {Math.round(typedPercentage)}% · Accuracy: {Math.round(accuracy)}%</div>
      <p className="fact-copy">{typedPercentage >= 100 ? 'Unlocked: octopuses have three hearts, which is wild and slightly alarming.' : phrase}</p>
    </div>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<App />);

export default App;
