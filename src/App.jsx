import './styles.css';
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { news, groups, resources, contact, roadmap } from './community.js';

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialStats = { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 };

const armourOptions = [
  { value: 'none',   label: 'None',   armour: 0, agi: +2 },
  { value: 'light',  label: 'Light',  armour: 2, agi:  0 },
  { value: 'medium', label: 'Medium', armour: 4, agi: -2 },
  { value: 'heavy',  label: 'Heavy',  armour: 8, agi: -4 },
];

const skills = [
  { id: 1,  name: '1.Smelly',       description: 'Gain a free action to make a model, not engaged, within 4 inches do a dedication test. if failed, instantly move that model a full move directly away from this model. -4 charm.',                                                                                                                                                                     modifiers: { STR: 0, INT: 0, DED:  0, CHA: -4, AGI:  0 } },
  { id: 2,  name: '2.Slippery',     description: 'Model always succeeds on a Flee and has -4 to get hit in close combat. But due to bad friction,  -4 agility.',                                                                                                                                                                                                                                    modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI: -4 } },
  { id: 3,  name: '3.Scared',       description: 'Weak nerves but fast! -4 dedication and +4 agility.',                                                                                                                                                                                                                                                                                             modifiers: { STR: 0, INT: 0, DED: -4, CHA:  0, AGI:  4 } },
  { id: 4,  name: '4.Thug',         description: "Swelling biceps but can't count or tie your shoelaces. +4 strength and -4 intelligence.",                                                                                                                                                                                                                                                         modifiers: { STR: 4, INT:-4, DED:  0, CHA:  0, AGI:  0 } },
  { id: 5,  name: '5.Vampire',      description: 'Each time this model kills, get +2 on all stats. After third kill, model goes frenzy. In Frenzy it must always move, or run, and fight the closest model in melee. Resets at the end of the scenario.',                                                                                                                                           modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 6,  name: '6.Translucent',  description: 'Other models get -4 to hit this model on ranged attacks. Also, this model always succeeds to hide. But due to trouble communicating, -8 charm.',                                                                                                                                                                                                  modifiers: { STR: 0, INT: 0, DED:  0, CHA: -8, AGI:  0 } },
  { id: 7,  name: '7.Leather face', description: 'Lack of sunscreen has made this model\u2019s face impenetrable. Cannot do a flirt action, but gain +1 armour.',                                                                                                                                                                                                                                  modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 8,  name: '8.Scissor hands',description: 'This model\u2019s None/improvised attacks cannot be modified by opponents\u2019 armour and power becomes 0 instead of normal penalty. But cannot equip or carry any weapon.',                                                                                                                                                                     modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 9,  name: '9.Swindler',     description: 'Player always gains double the money after scenario. But all money can only be spent on this model, and nothing can ever be traded. +2 charm and +2 intelligence.',                                                                                                                                                                               modifiers: { STR: 0, INT: 4, DED:  0, CHA:  4, AGI:  0 } },
  { id: 10, name: '10.Clumsy',      description: 'When this skill is gained, roll immediately on the injury table. +4 charm.',                                                                                                                                                                                                                                                                      modifiers: { STR: 0, INT: 0, DED:  0, CHA:  4, AGI:  0 } },
  { id: 11, name: '11.Brainwashed', description: 'This model has seen the light. Immune to convince action, -4 intelligence and +4 dedication.',                                                                                                                                                                                                                                                    modifiers: { STR: 0, INT:-4, DED:  4, CHA:  0, AGI:  0 } },
  { id: 12, name: '12.Bookworm',    description: 'In theory, this model has seen many battles. +4 intelligence, but -2 to agility and -2 strength.',                                                                                                                                                                                                                                               modifiers: { STR:-2, INT: 4, DED:  0, CHA:  0, AGI: -2 } },
  { id: 13, name: '13.Sticky',      description: 'Model can run up terrain without any movement penalty, but can never remove equipped weapons.',                                                                                                                                                                                                                                                   modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 14, name: '14.Railed',      description: 'Double movement! Must always move full in a straight line. If wanting to stop or turn, roll a dedication test. If failed, the model keeps going in the same direction and can only be stopped by structures or models over 2".',                                                                                                                   modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 15, name: '15.Infiltrator', description: 'Model can choose to start the scenario on the opponent\u2019s side, but cannot start base to base with anyone. Roll a charm test. On a fail, the model has been found out and killed before the scenario started. Roll on the injury table.',                                                                                                      modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 16, name: '16.Zombie',      description: 'If killed, roll injury but do not remove the model. It cannot activate the same round and gets play dead status. Then activates as normally the round after (Unless the injury roll was a 1). -8 on all stats.',                                                                                                                                  modifiers: { STR:-8, INT:-8, DED: -8, CHA: -8, AGI: -8 } },
  { id: 17, name: '17.Bland',       description: 'Utterly boring! This model\u2019s stats are now all zero. This is your new base; delete your values set at creation. Additional modifiers still apply.',                                                                                                                                                                                          modifiers: { STR: 0, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 18, name: '18.Radiant',     description: 'Always succeed on flirt actions. Always fail on Hide actions. +4 charm.',                                                                                                                                                                                                                                                                         modifiers: { STR: 0, INT: 0, DED:  0, CHA:  4, AGI:  0 } },
  { id: 19, name: '19.Enraged',     description: 'No penalty to dual wielding. But -4 to succeed with all rolls except kill rolls and can never flee. +4 strength.',                                                                                                                                                                                                                               modifiers: { STR: 4, INT: 0, DED:  0, CHA:  0, AGI:  0 } },
  { id: 20, name: '20.The legend',  description: 'If this model ever rolls a crit or fumble, thE character instantly disappears mysteriously (perma dead), before any action is carried out. +8 to all base stats.',                                                                                                                                                                               modifiers: { STR: 8, INT: 8, DED:  8, CHA:  8, AGI:  8 } },
];

const weapons = [
  { id: 1, name: 'None melee',    description: '[Ded] Power -8',          modifiers: { AGI:  0 } },
  { id: 2, name: 'Light melee',   description: '[Agi] Power -2',          modifiers: { AGI:  0 } },
  { id: 3, name: 'Medium melee',  description: '[Str] Power +2',          modifiers: { AGI: -2 } },
  { id: 4, name: 'Heavy melee',   description: '[Str] Power +6',          modifiers: { AGI: -4 } },
  { id: 5, name: 'None ranged',   description: '[Ded] Power -8 6"',       modifiers: { AGI:  0 } },
  { id: 6, name: 'Short ranged',  description: '[Agi] Power -2 12"',      modifiers: { AGI:  0 } },
  { id: 7, name: 'Medium ranged', description: '[Int] Power +2 18"',      modifiers: { AGI: -2 } },
  { id: 8, name: 'Long ranged',   description: '[Int] power +4 24"',      modifiers: { AGI: -4 } },
  { id: 9, name: 'Artillery',     description: '[Int] power +6 30"',      modifiers: { AGI: -8 } },
];

const upgradeOptions = ['None', 'Fire', 'Lightning', 'Poison'];

const accessoryOptions = [
  { name: 'None',              description: '',                                                                                                                                                                                                     modifiers: { STR:  0, INT:  0, DED:  0, CHA:  0, AGI:  0 } },
  { name: 'Book of belief',    description: 'If killed, roll a d20. on a 20: This tiny book was miraculously placed where the hit struck. The book is destroyed permanently, but the model is saved.',                                             modifiers: { STR:  0, INT:  0, DED:  0, CHA:  4, AGI:  0 } },
  { name: 'Nice hat',          description: 'Dashing and stylish, +4 charm. Lost permanently if leaping, falling or pushed.',                                                                                                                      modifiers: { STR:  0, INT:  0, DED:  0, CHA:  4, AGI:  0 } },
  { name: 'Ergonomic chair',   description: 'Ugly but comfortable +4 intelligence, -4 agility and -4 charm. Cannot double move.',                                                                                                                  modifiers: { STR:  0, INT: +4, DED:  0, CHA: -4, AGI: -4 } },
  { name: 'Glass eye',         description: 'Can detect hidden figures. But in return get bad depth perception and -4 to hit on all shoot and fight rolls.',                                                                                       modifiers: { STR:  0, INT:  0, DED:  0, CHA:  0, AGI:  0 } },
  { name: 'Cool tattoo',       description: 'a +4 dedication, but the vanity makes all flirt actions automatically succeed on this character.',                                                                                                    modifiers: { STR:  0, INT:  0, DED: +4, CHA:  0, AGI:  0 } },
  { name: 'Big buckle',        description: "a +4 strength, but -4 agility because you can't feel your legs.",                                                                                                                                     modifiers: { STR: +4, INT:  0, DED:  0, CHA:  0, AGI: -4 } },
  { name: 'Stilts',            description: 'model always move 3" in a straight line, regardless of move. but also counts all falls as extra +2"',                                                                                                modifiers: { STR:  0, INT:  0, DED:  0, CHA:  0, AGI:  0 } },
  { name: '"New" underwear',   description: 'a +1 dedication -1 charm. Sale now 75% reduced price. Only 10 credits!',                                                                                                                             modifiers: { STR:  0, INT:  0, DED: +1, CHA: -1, AGI:  0 } },
];

const itemOptions = [
  { name: 'None',              description: '',                                                                                                                              modifiers: { STR: 0, INT:  0, DED: 0, CHA:  0, AGI:  0 } },
  { name: 'Yeasty drink',      description: '[Ded] +4 armour, but -4 intelligence.',                                                                                        modifiers: { STR: 0, INT: -4, DED: 0, CHA:  0, AGI:  0, ARMOUR: 4 } },
  { name: 'Smell well water',  description: '[Cha] +4 on charm rolls, unable to get the hidden.',                                                                           modifiers: { STR: 0, INT:  0, DED: 0, CHA:  4, AGI:  0 } },
  { name: 'Rabid stew',        description: '[Ded]  +4 strength, but -4 charm and can never flee.',                                                                         modifiers: { STR: 4, INT:  0, DED: 0, CHA: -4, AGI:  0 } },
  { name: 'Never-stop pill',   description: '[Ded] +2 to all stats but roll more injury on model (see in depth)',                                                           modifiers: { STR: 2, INT:  2, DED: 2, CHA:  2, AGI:  2 } },
  { name: 'Teleporta bello',   description: '[Int] teleport to any point seen within 20". (see in depth)',                                                                  modifiers: { STR: 0, INT:  0, DED: 0, CHA:  0, AGI:  0 } },
  { name: 'Detox',             description: '[Int] Remove the poison condition.',                                                                                            modifiers: { STR: 0, INT:  0, DED: 0, CHA:  0, AGI:  0 } },
  { name: 'Eek ink',           description: '[agi] target must pass a [ded] or blindly run away (see in depth)',                                                            modifiers: { STR: 0, INT:  0, DED: 0, CHA:  0, AGI:  0 } },
  { name: 'Airy Berry',        description: '[Int] target becomes airborne until next activation (see in depth)',                                                           modifiers: { STR: 0, INT:  0, DED: 0, CHA:  0, AGI:  0 } },
];

const gearCosts = {
  'Book of belief': 40, 'Nice hat': 40, 'Ergonomic chair': 40, 'Glass eye': 40,
  'Cool tattoo': 40, 'Big buckle': 40, 'Stilts': 40, '"New" underwear': 10,
  'Yeasty drink': 40, 'Smell well water': 40, 'Rabid stew': 40, 'Never-stop pill': 40,
  'Teleporta bello': 40, 'Detox': 40, 'Eek ink': 40, 'Airy Berry': 40,
  'Light': 20, 'Medium': 40, 'Heavy': 80,
  'Light melee': 30, 'Medium melee': 40, 'Heavy melee': 50,
  'Short ranged': 30, 'Medium ranged': 40, 'Long ranged': 50, 'Artillery': 80,
  'Fire': 30, 'Lightning': 30, 'Poison': 30,
};

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing() {
  const [activeSection, setActiveSection] = useState('home');
  const [shopImageIndex, setShopImageIndex] = useState(0);

  const shopImages = [
    '/sale-book-bg-3-lines.png',
    '/sale-book-back.png',
    '/sale-book-closeup.png',
    '/sale-game_01.png',
  ];

  const nextShopImage = () => setShopImageIndex(prev => (prev + 1) % shopImages.length);
  const prevShopImage = () => setShopImageIndex(prev => (prev - 1 + shopImages.length) % shopImages.length);

  useEffect(() => { document.title = 'SWAY - Main'; }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeSection !== 'shop') return;
    const old = document.getElementById('publit-webshop-script');
    if (old) old.remove();
    const container = document.getElementById('publit-shop-container');
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.id = 'publit-webshop-script';
    script.async = true;
    script.loading = 'lazy';
    script.src = 'https://webshop.publit.com/publit-webshop-1.0.js';
    script.text = `
{
  "id": "5906",
  "type": "button",
  "isbn": "9789153161059",
  "theme": {
    "backgroundColor": "#ffee2a",
    "buyButton": { "backgroundColor": "#e65a23", "textColor": "#ffffff" }
  },
  "details": ["title", "cover", "metadata", "isbn"]
}`;
    container.appendChild(script);
  }, [activeSection]);

  const heroStyles = {
    home:      { backgroundImage: 'url("/landing-book-bg-3-lines.png")' },
    shop:      { backgroundColor: '#ffee2a', backgroundImage: 'none' },
    community: { backgroundColor: '#ffee2a', backgroundImage: 'none' },
    files:     { backgroundColor: '#ffee2a', backgroundImage: 'none' },
  };

  return (
    <div className="landing-page">
      <button
        type="button"
        className="landing-home-btn"
        onClick={() => setActiveSection('home')}
        aria-label="Back to home"
      >
        <img src="/home-icon2.png" alt="Home" className="landing-home-icon" />
      </button>

      <section className="landing-hero">
        <div className="landing-hero-bg" style={heroStyles[activeSection]} />

        {activeSection === 'home' && (
          <div className="landing-hero-overlay">
            <div className="landing-hero-side landing-hero-side-left">
              <img src="/landing-text-left.png" alt="What SWAY is - left text" className="landing-hero-text-img" />
            </div>
            <div className="landing-hero-side landing-hero-side-right">
              <img src="/landing-text-right.png" alt="What SWAY is - right text" className="landing-hero-text-img" />
            </div>
          </div>
        )}

        {activeSection === 'shop' && (
          <div className="landing-shop-split">
            <div className="landing-shop-left">
              <div className="landing-shop-left-inner">
                <div className="shop-slideshow">
                  <div className="shop-slideshow-image-wrapper">
                    <img src={shopImages[shopImageIndex]} alt="SWAY rulebook" className="landing-shop-image" />
                    <button type="button" className="shop-slide-nav shop-slide-nav-left" onClick={prevShopImage}>‹</button>
                    <button type="button" className="shop-slide-nav shop-slide-nav-right" onClick={nextShopImage}>›</button>
                  </div>
                  <div className="shop-slide-dots">
                    {shopImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={'shop-slide-dot' + (i === shopImageIndex ? ' shop-slide-dot-active' : '')}
                        onClick={() => setShopImageIndex(i)}
                        aria-label={`Show image ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <div id="publit-shop-container" className="publit-wrapper"></div>
              </div>
            </div>

            <div className="landing-shop-right">
              <div className="landing-shop-info">
                <div className="header-text !text-[60px]">SWAY – rulebook</div>
                <div className="header-text !text-[20px]">A Quick &amp; light-hearted skirmish RPG for 28–32mm minis.</div>
                <p className="landing-shop-body">
                  <strong><br />The game features:</strong><br />
                  • Miniature-agnostic, genre-agnostic<br />
                  • One d20 to rule them all. (11+ always succeeds)<br />
                  • Only 4 models per player, fast games, zero brain strain<br />
                  • Bag-based activation, to keep players on their toes.<br />
                  • 20 weird skills (become Slippery, Brainwashed, or The Legend)<br />
                  • Items, accessories &amp; NPCs<br />
                  • Surprise Sway Cards, turn the tide at any moment.<br />
                  • No health tracking, no XP bookkeeping<br />
                  • Three mini-campaigns: Fantasy, Thriller, Sci-Fi
                </p>
                <p className="header-text !text-[20px]">
                  <button
                    type="button"
                    onClick={() => handleNavClick('files')}
                    style={{ color: '#e8432b', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                  >
                    RULEBOOK PDF 100% FREE! - AVAILABLE UNDER FREE FILES.
                  </button><br /><br />
                  <div className="header-text !text-[17px]">
                    HARDCOVER EU VERSION: PRINTED IN SWEDEN! <br />
                    LOCATED IN US OR UK? ORDER BOOK FROM : &nbsp;
                    <a href="https://www.drivethrurpg.com/en/product/547807/sway-rulebook" target="_blank" rel="noopener noreferrer">
                      <span className="!text-[#e8432b]">DRIVETHRURPG</span>
                    </a>
                  </div>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'community' && (
          <div className="landing-community-panel">
            <div className="landing-community-inner justify-between">

              {/* LEFT — Communities */}
              <div className="landing-community-left">
                <div className="header-text !text-[28px] mb-2">Communities</div><br />
                <div className="description-text !text-[14px]">

                  <strong><u>Selected Stores</u></strong><br />
                  {groups.map((g, i) => (
                    <React.Fragment key={i}>
                      <a href={g.url} target="_blank" rel="noopener noreferrer">{g.label}</a><br />
                    </React.Fragment>
                  ))}
                  <br /><br />

                  <strong><u>Community Sites </u></strong><br />
                  {resources.map((r, i) => (
                    <React.Fragment key={i}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a><br />
                    </React.Fragment>
                  ))}
                  <br /><br />

                  <strong><u>message the creator</u></strong><br />
                  {contact.name}<br />
                  <a href={`mailto:${contact.email}`} style={{ color: '#ffffff', backgroundColor: '#e87a2f' }}>{contact.email}</a><br /><br />
                </div>
              </div>

              {/* MIDDLE — News */}
              <div className="landing-community-middle">
                <div className="header-text !text-[28px] mb-2">NEWS</div>
                <div className="description-text !text-[14px] leading-relaxed">
                  {news.map((post, i) => (
                    <React.Fragment key={i}>
                      <strong><u>{post.date}</u></strong><br />
                      {post.text}
                      {i < news.length - 1 && <><br /><br /></>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* RIGHT — Roadmap */}
              <div className="landing-community-right">
                <div className="header-text !text-[28px] mb-2">ROADMAP</div>
                <div className="description-text !text-[14px] leading-relaxed">
                  {roadmap.map((section, i) => (
                    <React.Fragment key={i}>
                      <strong><u>{section.title}</u></strong><br />
                      {section.items.map((item, j) => (
                        <React.Fragment key={j}>
                          {item.startsWith('– ')
                            ? <>&nbsp;&nbsp;{item}<br /></>
                            : <>• {item}<br /></>
                          }
                        </React.Fragment>
                      ))}
                      {i < roadmap.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeSection === 'files' && (
          <div className="landing-shop-overlay landing-files-panel">
            <div className="landing-files-inner">
              <div className="header-text !text-[40px] mb-4">ALL THE THINGS!</div>
              <div className="landing-files-list">
                <a className="landing-files-link" href="https://files.swaygame.info/rulebook/SWAY%20-%20RULEBOOK%201.0.0%20v2.pdf" target="_blank" rel="noopener noreferrer">
                  <div className="header-text !text-[22px]">SWAY - RULEBOOK PDF</div>
                  <div className="input-text !text-[16px]">100% free!</div>
                </a>
                <a className="landing-files-link" href="https://files.swaygame.info/sway_icon_stl_v005/sway_icons_stl_v005.zip" target="_blank" rel="noopener noreferrer">
                  <div className="header-text !text-[22px]">Icon STLs</div>
                  <div className="input-text !text-[16px]">Use with any 3D printer!</div>
                </a>
                <a className="landing-files-link" href="https://files.swaygame.info/swaycards/swaycards_pdf_v002.pdf" target="_blank" rel="noopener noreferrer">
                  <div className="header-text !text-[22px]">SWAY Cards</div>
                  <div className="input-text !text-[16px]">Print and laminate!</div>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      <nav className="landing-nav bottom-0 left-0 w-full">
        <button type="button" className="landing-nav-item" onClick={() => handleNavClick('shop')}>
          <img src="/nav-shop.png" alt="Shop" className="landing-nav-img" />
        </button>
        <button type="button" className="landing-nav-item" onClick={() => handleNavClick('community')}>
          <img src="/nav-community.png" alt="Community" className="landing-nav-img" />
        </button>
        <Link to="/creator" className="landing-nav-item">
          <img src="/nav-creator2.png" alt="Character Creator" className="landing-nav-img" />
        </Link>
        <button type="button" className="landing-nav-item" onClick={() => handleNavClick('files')}>
          <img src="/nav-files2.png" alt="Free Files" className="landing-nav-img" />
        </button>
      </nav>
    </div>
  );
}

// ─── CharacterCreator ─────────────────────────────────────────────────────────

function CharacterCreator() {
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);
  const [sheetsVisible, setSheetsVisible]       = useState(false);
  const [showScrollTop, setShowScrollTop]       = useState(false);
  const [canScrollLeft, setCanScrollLeft]       = useState(false);
  const [canScrollRight, setCanScrollRight]     = useState(false);
  const [expandedDesc, setExpandedDesc]         = useState(null);
  const characterScrollRef = useRef(null);

  useEffect(() => { document.title = 'SWAY - Team Creator'; }, []);

  // Horizontal scroll arrows
  useEffect(() => {
    const el = characterScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    onScroll();
    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // IntersectionObserver to show/hide scroll arrows
  useEffect(() => {
    const target = document.getElementById('character-sheet-area');
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSheetsVisible(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0, 0.2, 1] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Scroll-to-top button visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mouse wheel → horizontal scroll
  useEffect(() => {
    const el = characterScrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 3, behavior: 'smooth' });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── State ──────────────────────────────────────────────────────────────────
  const [teamName,    setTeamName]    = useState('');
  const [teamCredits, setTeamCredits] = useState(500);
  const [teamNotes,   setTeamNotes]   = useState('');
  const [characters,  setCharacters]  = useState(
    Array.from({ length: 4 }, () => ({
      name:          '',
      stats:         { ...initialStats },
      primarySkill:  '',
      secondarySkill:'',
      notes:         '',
      armourType:    'none',
      weaponLeft:    '',
      weaponRight:   '',
      upgradeLeft:   'None',
      upgradeRight:  'None',
      items:         ['', '', ''],
      usedItems:     [false, false, false],
      accessory:     '',
      injuries:      ['', '', '', '', ''],
      level:         0,
    }))
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const calculateCostForCharacter = (char) => {
    let total = 0;
    const armourLabel = armourOptions.find(a => a.value === char.armourType)?.label;
    if (gearCosts[armourLabel]) total += gearCosts[armourLabel];
    const weaponLeftName  = weapons.find(w => w.id.toString() === char.weaponLeft)?.name  || '';
    const weaponRightName = weapons.find(w => w.id.toString() === char.weaponRight)?.name || '';
    if (gearCosts[weaponLeftName])  total += gearCosts[weaponLeftName];
    if (gearCosts[weaponRightName]) total += gearCosts[weaponRightName];
    if (gearCosts[char.upgradeLeft])  total += gearCosts[char.upgradeLeft];
    if (gearCosts[char.upgradeRight]) total += gearCosts[char.upgradeRight];
    char.items.forEach(item => { if (gearCosts[item]) total += gearCosts[item]; });
    if (gearCosts[char.accessory]) total += gearCosts[char.accessory];
    return total;
  };

  const totalTeamCost = () =>
    characters.reduce((sum, char) => sum + calculateCostForCharacter(char), 0);

  const getModifiersForCharacter = (character) => {
    const primary   = skills.find(s => s.id.toString() === character.primarySkill)?.modifiers   || {};
    const secondary = skills.find(s => s.id.toString() === character.secondarySkill)?.modifiers || {};
    const weaponL   = weapons.find(w => w.id.toString() === character.weaponLeft)?.modifiers    || {};
    const weaponR   = weapons.find(w => w.id.toString() === character.weaponRight)?.modifiers   || {};
    const accMod    = accessoryOptions.find(a => a.name === character.accessory)?.modifiers      || {};
    const itemMods  = character.items.map((itemName, idx) => {
      const item = itemOptions.find(opt => opt.name === itemName);
      return character.usedItems[idx] ? (item?.modifiers || {}) : initialStats;
    });

    const injuryMod = { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 };
    let isDead = false;
    character.injuries.forEach(val => {
      if (!val) return;
      if      (val === 1)                  isDead = true;
      else if (val >= 2  && val <= 5)  injuryMod.AGI -= 1;
      else if (val >= 6  && val <= 9)  injuryMod.STR -= 1;
      else if (val >= 10 && val <= 13) injuryMod.INT -= 1;
      else if (val >= 14 && val <= 17) injuryMod.DED -= 1;
      else if (val >= 18 && val <= 19) injuryMod.CHA -= 1;
      else if (val === 20)             injuryMod.CHA += 1;
    });

    const selectedArmour = armourOptions.find(a => a.value === character.armourType);
    const result = Object.keys(initialStats).reduce((acc, key) => {
      const armourMod = key === 'AGI' ? (selectedArmour?.agi || 0) : 0;
      const weaponMod = key === 'AGI' ? ((weaponL.AGI || 0) + (weaponR.AGI || 0)) : 0;
      const itemTotal = itemMods.reduce((sum, mod) => sum + (mod[key] || 0), 0);
      acc[key] =
        (primary[key]    || 0) +
        (secondary[key]  || 0) +
        armourMod +
        weaponMod +
        itemTotal +
        (accMod[key]     || 0) +
        (injuryMod[key]  || 0);
      return acc;
    }, isDead ? { _DEAD: true } : {});

    result.ARMOUR = itemMods.reduce((sum, mod) => sum + (mod.ARMOUR || 0), 0);
    return result;
  };

  const getSkillDescription = (id) =>
    skills.find(s => s.id.toString() === id)?.description || '';

  const calculateMoveForCharacter = (character) => {
    const baseAGI = character.stats.AGI || 0;
    const modAGI  = getModifiersForCharacter(character).AGI || 0;
    return 5 + Math.floor((baseAGI + modAGI) / 2);
  };

  // ── Shared card renderer (interactive + print both use this) ───────────────
  const renderCharCard = (char, charIdx) => {
    const modifiers = getModifiersForCharacter(char);

    const DescBox = ({ text, title, desktopHeight, className = '' }) => {
      const isEmpty = !text?.trim();
      return (
        <div
          className={`description-text mt-1 w-full border rounded p-2 desc-box-interactive ${!isEmpty ? 'cursor-pointer' : ''} ${className}`}
          style={{ height: desktopHeight, overflow: 'hidden' }}
          onClick={() => !isEmpty && setExpandedDesc({ title, text })}
          title={!isEmpty ? 'Tap to expand' : undefined}
        >
          {text}
        </div>
      );
    };

    return (
      <div
        key={charIdx}
        className="character-sheet-print relative p-2 w-[calc(100vw-16px)] sm:w-[500px] border rounded shadow bg-white flex-shrink-0"
      >
        {modifiers._DEAD && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-6xl text-red-600 font-extrabold drop-shadow-lg">DEAD</div>
          </div>
        )}

        {/* Name + Move */}
        <div className="flex gap-2 items-end mt-[2px] sm:mt-[5px]">
          <label className="flex-1 header-text">
            Name:
            <input
              className="block w-full border p-1 rounded mt-0 input-text !text-[22px]"
              value={char.name}
              onChange={(e) => setCharacters(prev => {
                const updated = [...prev];
                updated[charIdx] = { ...updated[charIdx], name: e.target.value };
                return updated;
              })}
            />
          </label>
          <div className="w-[88px]">
            <div className="header-text">Move:</div>
            <div className="p-1 border rounded text-center header-text !text-[22px]">
              {calculateMoveForCharacter(char)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between gap-1 mt-[4px] sm:mt-[10px]">
          {Object.keys(char.stats).map((key) => {
            const modifier = modifiers[key] || 0;
            return (
              <label key={key} className="flex-1 header-text">
                {key}:
                <div className="relative">
                  <div className="relative">
                    <div
                      className="block w-full border p-2 rounded text-center font-mono bg-white"
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className="text-sm input-text">
                        {char.stats[key]}
                        {modifier !== 0 && (
                          <span className={`ml-1 ${modifier > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {modifier > 0 ? `+${modifier}` : modifier}
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-bold leading-tight">
                        {char.stats[key] + modifier}
                      </div>
                    </div>
                    <input
                      type="number"
                      className="absolute inset-0 w-full h-full text-transparent caret-transparent bg-transparent border-none"
                      value={char.stats[key]}
                      onChange={(e) => setCharacters(prev => {
                        const updated = [...prev];
                        const val = parseInt(e.target.value, 10);
                        updated[charIdx] = {
                          ...updated[charIdx],
                          stats: {
                            ...updated[charIdx].stats,
                            [key]: isNaN(val) ? 0 : Math.max(-10, Math.min(10, val)),
                          },
                        };
                        return updated;
                      })}
                      min="-10"
                      max="10"
                      style={{ WebkitAppearance: 'number-input', MozAppearance: 'number-input', appearance: 'number-input' }}
                    />
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Skills + Armour */}
        <div className="flex gap-4 items-start mt-[4px] sm:mt-[10px]">
          <div className="flex-1">
            <div className="flex gap-2">
              {/* Primary Skill */}
              <label className="flex-1 header-text">
                Primary Skill:
                <select
                  className="block w-full border p-2 rounded input-text"
                  value={char.primarySkill}
                  onChange={(e) => setCharacters(prev => {
                    const updated = [...prev];
                    updated[charIdx] = { ...updated[charIdx], primarySkill: e.target.value };
                    return updated;
                  })}
                >
                  <option value="">Select Skill</option>
                  {skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                </select>
                <div className="description-text mt-1 w-full border rounded p-2 desc-box-interactive desc-box-skill" style={{ height: '165px', overflow: 'hidden' }}
                  onClick={() => { const d = getSkillDescription(char.primarySkill); d && setExpandedDesc({ title: 'Primary Skill', text: d }); }}
                  title="Tap to expand"
                >
                  {getSkillDescription(char.primarySkill)}
                </div>
              </label>

              {/* Secondary Skill */}
              <label className="flex-1 header-text">
                Secondary Skill:
                <select
                  className="block w-full border p-2 rounded input-text"
                  value={char.secondarySkill}
                  onChange={(e) => setCharacters(prev => {
                    const updated = [...prev];
                    updated[charIdx] = { ...updated[charIdx], secondarySkill: e.target.value };
                    return updated;
                  })}
                >
                  <option value="">Select Skill</option>
                  {skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                </select>
                <div className="description-text mt-1 w-full border rounded p-2 desc-box-interactive desc-box-skill" style={{ height: '165px', overflow: 'hidden' }}
                  onClick={() => { const d = getSkillDescription(char.secondarySkill); d && setExpandedDesc({ title: 'Secondary Skill', text: d }); }}
                  title="Tap to expand"
                >
                  {getSkillDescription(char.secondarySkill)}
                </div>
              </label>
            </div>
          </div>

          {/* Armour */}
          <div className="w-1/5">
            <label className="block header-text">
              Armour:
              <select
                className="block w-full border p-2 rounded input-text"
                value={char.armourType}
                onChange={(e) => setCharacters(prev => {
                  const updated = [...prev];
                  updated[charIdx] = { ...updated[charIdx], armourType: e.target.value };
                  return updated;
                })}
              >
                {armourOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <div className="header-text text-center border p-2 rounded mt-1 !text-[22px]">
                {armourOptions.find(a => a.value === char.armourType)?.armour || 0}
                {modifiers.ARMOUR !== 0 && (
                  <span className={modifiers.ARMOUR > 0 ? 'text-green-600' : 'text-red-600'}>
                    {modifiers.ARMOUR > 0 ? `+${modifiers.ARMOUR}` : modifiers.ARMOUR}
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Weapons */}
        <div className="flex flex-col gap-0 mt-[4px] sm:mt-[10px]">
          {['Right', 'Left'].map((hand) => {
            const weaponKey  = hand === 'Right' ? 'weaponRight'  : 'weaponLeft';
            const upgradeKey = hand === 'Right' ? 'upgradeRight' : 'upgradeLeft';
            const selected   = char[weaponKey];
            const upgrade    = char[upgradeKey];
            const weapon     = weapons.find(w => w.id.toString() === selected);
            return (
              <div key={hand}>
                <div className="flex justify-between items-center">
                  <span className="block header-text">{hand} Hand Weapon:</span>
                  <span className="block header-text">Upgrade:</span>
                </div>
                <div className="flex gap-4 items-center">
                  <select
                    className="w-[150px] border p-2 rounded input-text"
                    value={selected}
                    onChange={(e) => setCharacters(prev => {
                      const updated = [...prev];
                      updated[charIdx] = { ...updated[charIdx], [weaponKey]: e.target.value };
                      return updated;
                    })}
                  >
                    <option value="">Select Weapon</option>
                    {weapons.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  <div
                    className="flex-1 input-text border rounded p-2 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                    style={{ height: '35px' }}
                    onClick={() => weapon?.description && setExpandedDesc({ title: `${hand} Hand Weapon`, text: weapon.description })}
                    title="Tap to expand"
                  >
                    {weapon?.description || ''}
                  </div>
                  <select
                    className="w-30 border p-2 rounded input-text"
                    value={upgrade}
                    onChange={(e) => setCharacters(prev => {
                      const updated = [...prev];
                      updated[charIdx] = { ...updated[charIdx], [upgradeKey]: e.target.value };
                      return updated;
                    })}
                  >
                    {upgradeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Items + Accessory */}
        <div className="flex gap-4 mt-[4px] sm:mt-[10px]">
          <div className="flex-[1_1_60%]">
            <div className="block header-text mb-0">Items</div>
            {char.items.map((item, itemIdx) => {
              const selectedItem = itemOptions.find(opt => opt.name === item);
              return (
                <div key={itemIdx} className="flex gap-2 mb-2 items-start overflow-hidden">
                  <div className="flex flex-col w-[140px] flex-shrink-0">
                    <select
                      className="border p-2 rounded input-text !text-[10px]"
                      value={item}
                      onChange={(e) => setCharacters(prev => {
                        const updated = [...prev];
                        const newItems = [...updated[charIdx].items];
                        newItems[itemIdx] = e.target.value;
                        updated[charIdx] = { ...updated[charIdx], items: newItems };
                        return updated;
                      })}
                    >
                      {itemOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                    </select>
                    <div className="mt-1 flex items-center justify-end w-full">
                      <span className="header-text mr-1">Used</span>
                      <input
                        type="checkbox"
                        checked={char.usedItems[itemIdx]}
                        onChange={(e) => setCharacters(prev => {
                          const updated = [...prev];
                          const newUsedItems = [...updated[charIdx].usedItems];
                          newUsedItems[itemIdx] = e.target.checked;
                          updated[charIdx] = { ...updated[charIdx], usedItems: newUsedItems };
                          return updated;
                        })}
                      />
                    </div>
                  </div>
                  <div
                    className={`flex-1 min-w-0 description-text p-2 border rounded desc-box-interactive desc-box-item ${selectedItem?.description ? 'cursor-pointer' : ''}`}
                    style={{ height: '70px', overflow: 'hidden', minWidth: 0 }}
                    onClick={() => selectedItem?.description && setExpandedDesc({ title: `Item: ${item}`, text: selectedItem.description })}
                    title={selectedItem?.description ? 'Tap to expand' : undefined}
                  >
                    {selectedItem?.description || ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accessory */}
          <div className="flex-[1_1_27%]">
            <div className="block header-text mb-0">Accessory</div>
            <select
              className="w-full border p-2 rounded input-text !text-[10px]"
              value={char.accessory}
              onChange={(e) => setCharacters(prev => {
                const updated = [...prev];
                updated[charIdx] = { ...updated[charIdx], accessory: e.target.value };
                return updated;
              })}
            >
              {accessoryOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
            </select>
            <div
              className={`description-text mt-2 w-full border rounded p-2 desc-box-interactive desc-box-accessory ${accessoryOptions.find(a => a.name === char.accessory)?.description ? 'cursor-pointer' : ''}`}
              style={{ height: '188px', overflow: 'hidden' }}
              onClick={() => {
                const d = accessoryOptions.find(a => a.name === char.accessory)?.description;
                d && setExpandedDesc({ title: `Accessory: ${char.accessory}`, text: d });
              }}
              title={accessoryOptions.find(a => a.name === char.accessory)?.description ? 'Tap to expand' : undefined}
            >
              {accessoryOptions.find(a => a.name === char.accessory)?.description || ''}
            </div>
          </div>
        </div>

        {/* Injuries + Level + Cost */}
        <div className="flex gap-2 items-end mt-[1px] sm:mt-[10px]">
          <div className="flex flex-col flex-shrink-0">
            <label className="block header-text mb-0">Injuries:</label>
            <div className="flex gap-1">
              {char.injuries.map((val, i) => (
                <select
                  key={i}
                  className="w-[46px] sm:w-[52px] border p-2 rounded input-text text-center"
                  value={val}
                  onChange={(e) => setCharacters(prev => {
                    const updated = [...prev];
                    const newInjuries = [...updated[charIdx].injuries];
                    newInjuries[i] = parseInt(e.target.value) || '';
                    updated[charIdx] = { ...updated[charIdx], injuries: newInjuries };
                    return updated;
                  })}
                >
                  <option value="">—</option>
                  {Array.from({ length: 20 }, (_, j) => (
                    <option key={j + 1} value={j + 1}>{j + 1}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <div className="flex-[1_1_20%]">
            <label className="block header-text mb-0">Level:</label>
            <select
              className="w-full text-center border rounded p-2 input-text appearance-none"
              value={char.level}
              onChange={(e) => setCharacters(prev => {
                const updated = [...prev];
                updated[charIdx] = { ...updated[charIdx], level: parseInt(e.target.value) };
                return updated;
              })}
            >
              {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="flex-[1_1_25%]">
            <label className="block header-text mb-0">Cost:</label>
            <div className="w-full border p-2 rounded input-text bg-gray-100 text-right font-mono">
              {calculateCostForCharacter(char)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Interactive UI (hidden during print) ────────────────────────── */}
      <div className="no-print flex flex-col md:flex-row md:h-screen md:overflow-hidden">

        {/* Left Column */}
        <div className="left-column w-full md:w-[350px] p-4 border-r bg-[#ffee2a]">
          <div className="mt-auto flex gap-1 mb-2">
            <Link to="/" className="w-1/2">
              <img
                src="/sway_logo_only_rgb_cutout_2k.png"
                alt="Sway Logo"
                className="w-full max-h-[180px] object-contain cursor-pointer"
              />
            </Link>
            <img
              src="/swaycover 11_cmyk characters seperated color v2.png"
              alt="Characters"
              className="w-1/2 max-h-[180px] object-contain"
            />
          </div>

          <input
            className="w-full p-2 rounded mb-2 header-text text-center !text-[30px] bg-[#e87a2f] team-name-input !text-[#fcf8cc]"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
          />

          {characters.map((char, i) => (
            <div key={i} className="flex justify-between items-center input-text mb-1 !text-[22px]">
              <span>{char.name || `Character ${i + 1}`}</span>
              <span>{calculateCostForCharacter(char)}</span>
            </div>
          ))}

          <hr className="my-2 border-t border-black" />

          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="header-text">Team Credits:</span>
              <input
                className="rounded w-20 text-center input-text !text-[22px] bg-[#ffee2a] border team-credits-input"
                type="number"
                value={teamCredits}
                onChange={(e) => setTeamCredits(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="header-text">unspent:</span>
              <span className="text-right input-text !text-[22px] bg-[#ffee2a]">
                {teamCredits - totalTeamCost()}
              </span>
            </div>
          </div>

          <textarea
            className="w-full h-[300px] mt-2 p-2 rounded input-text left-input"
            rows="4"
            placeholder="Notes..."
            value={teamNotes}
            onChange={(e) => setTeamNotes(e.target.value)}
          />

          {/* Print Team — now calls window.print() */}
          <button
            className="mt-2 w-full bg-[#442655] !text-[#ffee2a] header-text !text-[22px] py-1 rounded shadow"
            onClick={() => window.print()}
          >
            Print Team
          </button>

          <button
            className="mt-2 w-full bg-[#e87a2f] !text-[#ffee2a] header-text !text-[22px] py-1 rounded shadow"
            onClick={() => {
              const data = { teamName, teamCredits, teamNotes, characters };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url  = URL.createObjectURL(blob);
              const a    = document.createElement('a');
              a.href     = url;
              a.download = `${teamName || 'my_team'}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download Team
          </button>

          <label className="mt-2 w-full bg-[#e8432b] !text-[#ffee2a] header-text !text-[22px] py-1 rounded shadow text-center cursor-pointer block">
            Load Team
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const data = JSON.parse(event.target.result);
                    if (
                      typeof data.teamName    === 'string' &&
                      typeof data.teamCredits === 'number' &&
                      Array.isArray(data.characters)
                    ) {
                      setTeamName(data.teamName);
                      setTeamCredits(data.teamCredits);
                      setTeamNotes(data.teamNotes || '');
                      setCharacters(data.characters);
                    } else {
                      alert('Invalid team file');
                    }
                  } catch {
                    alert('Could not load file');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>
        </div>

        {/* Character Sheet Scroll Area */}
        <div
          ref={characterScrollRef}
          className="character-sheet-area flex-1 relative"
          id="character-sheet-area"
          style={{ overflowY: 'hidden' }}
        >
          {sheetsVisible && canScrollLeft && (
            <button
              onClick={() => characterScrollRef.current.scrollBy({ left: -2000, behavior: 'smooth' })}
              className="fixed left-2 md:left-[360px] top-1/2 -translate-y-1/2 z-50 rounded-md p-2 bg-black hover:bg-black/50 transition"
            >
              <span className="text-white text-2xl font-bold">◄</span>
            </button>
          )}
          {sheetsVisible && canScrollRight && (
            <button
              onClick={() => characterScrollRef.current.scrollBy({ left: 2000, behavior: 'smooth' })}
              className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 rounded-md p-2 bg-black hover:bg-black/50 transition"
            >
              <span className="text-white text-2xl font-bold">►</span>
            </button>
          )}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed top-2 left-1/2 -translate-x-1/2 z-50 rounded-md p-2 bg-black hover:bg-black/50 transition md:hidden"
            >
              <span className="text-white text-2xl font-bold">▲</span>
            </button>
          )}

          <div className="flex min-h-screen w-max gap-3 p-2">
            {characters.map((char, charIdx) => renderCharCard(char, charIdx))}
          </div>
        </div>

        {/* Description Expand Overlay */}
        {expandedDesc && (
          <div
            className="fixed inset-0 z-[9998] flex items-center justify-center"
            style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.35)' }}
            onClick={() => setExpandedDesc(null)}
          >
            <div
              className="bg-white border-2 border-black rounded-lg p-4 mx-4 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="header-text !text-[16px] mb-2">{expandedDesc.title}</div>
              <div className="description-text !text-[11px] leading-relaxed">{expandedDesc.text}</div>
              <button
                className="mt-4 w-full bg-black header-text !text-[14px] py-2 rounded"
                style={{ color: '#ffee2a' }}
                onClick={() => setExpandedDesc(null)}
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

        {/* Phone Warning Modal */}
        {showPhoneWarning && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white border-4 border-black rounded-lg p-6 w-[350px] text-center shadow-xl">
              <div className="header-text !text-[32px] mb-4">SORRY</div>
              <div className="input-text !text-[16px] leading-relaxed mb-6">
                Team Creator does not work<br />
                on phones *currently*.<br /><br />
                But it is on the to-do list!
              </div>
              <button
                className="mt-2 w-full bg-black !text-white header-text py-2 rounded"
                onClick={() => { window.location.href = '/'; }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Print-only layout (A4 landscape, 2 chars per page) ──────────── */}
      <div className="print-only" id="print-clone">
        {/* Page 1 — Characters 1 & 2 */}
        <div className="print-page">
          {renderCharCard(characters[0], 0)}
          {renderCharCard(characters[1], 1)}
        </div>
        {/* Page 2 — Characters 3 & 4 */}
        <div className="print-page">
          {renderCharCard(characters[2], 2)}
          {renderCharCard(characters[3], 3)}
        </div>
      </div>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"        element={<Landing />}          />
        <Route path="/creator" element={<CharacterCreator />} />
      </Routes>
    </Router>
  );
}
