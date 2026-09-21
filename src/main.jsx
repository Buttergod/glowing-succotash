import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Sparkles, ArrowLeft, SlidersHorizontal, Github } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './styles.css'

const specs = [
  ['Scale of the Universe','Science & Space','🪐','Zoom from a Planck length to the observable universe.','ScaleUniverse'],
  ['Element Mixer','Science & Space','⚗️','Combine atoms and discover everyday compounds.','ElementMixer'],
  ['Deep Sea Explorer','Science & Space','🐙','Dive through pressure, darkness, and alien life.','DeepSea'],
  ['Gravity Simulator','Science & Space','🍎','Drop objects on different worlds and compare falls.','Gravity'],
  ['Life Expectancy Time Travel','History & Geography','⌛','Change your birth year and peek at another lifetime.','LifeExpectancy'],
  ['Country Size Compare','History & Geography','🗺️','Put countries side by side without map distortion.','CountryCompare'],
  ['History Timeline Slider','History & Geography','🏺','Scrub from the Big Bang to your breakfast today.','Timeline'],
  ['Wonders Checklist','History & Geography','🏛️','Plan a curious, limited-budget tour of the classics.','Wonders'],
  ['Visualizing a Trillion Dollars','Mathematics & Finance','💵','See just how absurdly tall a stack of bills gets.','Trillion'],
  ['Inflation Calculator','Mathematics & Finance','🥖','Translate an old price into today’s purchasing power.','Inflation'],
  ['Probability Plinko','Mathematics & Finance','🔴','Drop marbles and watch a bell curve emerge.','Plinko'],
  ['Crypto Tulip Mania','Mathematics & Finance','🌷','Ride a bubble, notice the psychology, learn the lesson.','Bubbles'],
  ['Carbon Footprint Tycoon','Nature & Environment','🌱','Balance a city’s comfort with its climate budget.','Carbon'],
  ['Animal Speed Drag Race','Nature & Environment','🐆','Line up four species and let biology sprint.','Race'],
  ['Deforestation Visualizer','Nature & Environment','🌳','Turn an alarming statistic into a moving landscape.','Forest'],
  ['Interactive Brain Map','Language, Culture & Anatomy','🧠','Explore lobes and trigger tiny sensory experiments.','Brain'],
  ['Idioms Around the World','Language, Culture & Anatomy','🗣️','Meet phrases that get wonderfully weird in translation.','Idioms'],
  ['Speed of Typing Facts','Language, Culture & Anatomy','⌨️','Type surprising science to unlock harder facts.','Typing']
]
const modules = Object.fromEntries(specs.map(([, , , , key]) => [key, lazy(() => import(`./games/${key}.jsx`))]))
const categories = ['All', ...new Set(specs.map(s => s[1]))]

function App(){
 const [selected,setSelected]=useState(null), [query,setQuery]=useState(''), [category,setCategory]=useState('All')
 const filtered=useMemo(()=>specs.filter(s=>(category==='All'||s[1]===category)&&s[0].toLowerCase().includes(query.toLowerCase())),[query,category])
 const Component=selected && modules[selected[4]]
 return <main className="app">
  <header className="topbar"><div className="brand" onClick={()=>setSelected(null)}><span className="logo">✦</span><span>WONDERLAB</span></div><div className="header-note">18 small portals to a bigger world <Sparkles size={17}/></div></header>
  <AnimatePresence mode="wait">{selected ? <motion.section className="game-view" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0}} key={selected[4]}>
   <button className="back" onClick={()=>setSelected(null)}><ArrowLeft size={18}/> all experiments</button>
   <div className="game-heading"><span className="game-emoji">{selected[2]}</span><div><p className="eyebrow">{selected[1]}</p><h1>{selected[0]}</h1><p>{selected[3]}</p></div></div>
   <Suspense fallback={<div className="loading">Loading experiment…</div>}><Component /></Suspense>
  </motion.section> : <>
   <section className="hero"><div className="hero-copy"><p className="eyebrow">A TINY MUSEUM OF BIG IDEAS</p><h1>Learn something<br/><em>by messing with it.</em></h1><p className="hero-text">Wonderlab is a playful collection of interactive experiments for curious humans. No grades. Just better questions.</p></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-a">✦</div><div className="orbit orbit-b">?</div><div className="planet">🌎</div></div></section>
   <section className="toolbar"><div className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search an experiment…" /></div><div className="filters"><SlidersHorizontal size={18}/>{categories.map(c=><button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div></section>
   <section className="grid">{filtered.map((s,i)=><motion.button className="tile" key={s[0]} onClick={()=>setSelected(s)} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.025}}><span className="tile-icon">{s[2]}</span><span className="tile-category">{s[1]}</span><h2>{s[0]}</h2><p>{s[3]}</p><span className="try">try it →</span></motion.button>)}</section>
   {filtered.length===0&&<div className="empty">No experiments found. Try a bigger question.</div>}
   <footer><span>Made for curious minds · progress saves automatically</span><a href="https://github.com/Buttergod/glowing-succotash"><Github size={15}/> source</a></footer>
  </>}</AnimatePresence>
 </main>
}
createRoot(document.getElementById('root')).render(<App />)
