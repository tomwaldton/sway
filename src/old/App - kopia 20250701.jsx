import './styles.css';
import React, { useState, useRef, useEffect } from 'react'; 


const initialStats = {
  STR: 0,
  INT: 0,
  DED: 0,
  CHA: 0,
  AGI: 0
};


const armourOptions = [
  { value: 'none', label: 'None', armour: 0, agi: +2 },
  { value: 'light', label: 'Light', armour: 2, agi: 0 },
  { value: 'medium', label: 'Medium', armour: 4, agi: -2 },
  { value: 'heavy', label: 'Heavy', armour: 8, agi: -4 }
];

const skills = [
  { id: 1, name: '1.Smelly', description: 'Gain a free action to make a model, not engaged, within 4 inches do a dedication test. if failed, instantly move that model a full move directly away from this model. -4 charm.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: -4, AGI: 0 } },
  { id: 2, name: '2.Slippery', description: 'Model always succeeds on a Flee and has -4 to get hit in close combat. But due to bad friction,  -4 agility.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: -4 } },
  { id: 3, name: '3.Scared', description: 'Weak nerves but fast! -4 dedication and +4 agility.', modifiers: { STR: 0, INT: 0, DED: -4, CHA: 0, AGI: 4 } },
  { id: 4, name: '4.Thug', description: "Swelling biceps but can't count or tie your shoelaces. +4 strength and -4 intelligence.", modifiers: { STR: 4, INT: -4, DED: 0, CHA: 0, AGI: 0 } },
  { id: 5, name: '5.Vampire', description: 'Each time this model kills, get +2 on all stats. After third kill, model goes frenzy. In Frenzy it must always move, or run, and fight the closest model in melee. Resets at the end of the scenario.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 6, name: '6.Translucent', description: 'Other models get -4 to hit this model on ranged attacks. Also, this model always succeeds to hide. But due to trouble communicating, -8 charm.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: -8, AGI: 0 } },
  { id: 7, name: '7.Leather face', description: 'Lack of sunscreen has made this model’s face impenetrable. Cannot do a flirt action, but gain +1 armour.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 8, name: '8.Scissor hands', description: 'This model’s None/improvised attacks cannot be modified by opponents’ armour and power becomes 0 instead of normal penalty. But cannot equip or carry any weapon.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 9, name: '9.Swindler', description: 'Player always gains double the money after scenario. But all money can only be spent on this model, and nothing can ever be traded. +2 charm and +2 intelligence.', modifiers: { STR: 0, INT: 4, DED: 0, CHA: 4, AGI: 0 } },
  { id: 10, name: '10.Clumsy', description: 'When this skill is gained, roll immediately on the injury table. +4 charm.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 4, AGI: 0 } },
  { id: 11, name: '11.Brainwashed', description: 'This model has seen the light. Immune to convince action, -4 intelligence and +4 dedication.', modifiers: { STR: 0, INT: -4, DED: 4, CHA: 0, AGI: 0 } },
  { id: 12, name: '12.Bookworm', description: 'In theory, this model has seen many battles. +4 intelligence, but -2 to agility and -2 strength.', modifiers: { STR: -2, INT: 4, DED: 0, CHA: 0, AGI: -2 } },
  { id: 13, name: '13.Sticky', description: 'Model can run up terrain without any movement penalty, but can never remove equipped weapons.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 14, name: '14.Railed', description: 'Double movement! Must always move full in a straight line. If wanting to stop or turn, roll a dedication test. If failed, the model keeps going in the same direction and can only be stopped by structures or models over 2”.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 15, name: '15.Infiltrator', description: 'Model can choose to start the scenario on the opponent’s side, but cannot start base to base with anyone. Roll a charm test. On a fail, the model has been found out and killed before the scenario started. Roll on the injury table.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 16, name: '16.Zombie', description: 'If killed, roll injury but do not remove the model. It cannot activate the same round and gets play dead status. Then activates as normally the round after (Unless the injury roll was a 1). -8 on all stats.', modifiers: { STR: -8, INT: -8, DED: -8, CHA: -8, AGI: -8 } },
  { id: 17, name: '17.Bland', description: 'Utterly boring! This model’s stats are now all zero. This is your new base; delete your values set at creation. Additional modifiers still apply.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 18, name: '18.Radiant', description: 'Always succeed on flirt actions. Always fail on Hide actions. +4 charm.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 4, AGI: 0 } },
  { id: 19, name: '19.Enraged', description: 'No penalty to dual wielding. But -4 to succeed with all rolls except kill rolls and can never flee. +4 strength.', modifiers: { STR: 4, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { id: 20, name: '20.The legend', description: 'If this model ever rolls a crit or fumble, thE character instantly disappears mysteriously (perma dead), before any action is carried out. +8 to all base stats.', modifiers: { STR: 8, INT: 8, DED: 8, CHA: 8, AGI: 8 } }
];


const weapons = [
  { id: 1, name: 'None melee', description: '[Ded]  Power -8', modifiers: { AGI: 0 } },
  { id: 2, name: 'Light melee', description: '[Agi]  Power -2', modifiers: { AGI: 0 } },
  { id: 3, name: 'Medium melee', description: '[Str]  Power +2', modifiers: { AGI: -2 } },
  { id: 4, name: 'Heavy melee', description: '[Str]  Power +6', modifiers: { AGI: -4 } },
  { id: 5, name: 'None ranged', description: '[Ded]  Power -8  Range: 6”', modifiers: { AGI: 0 } },
  { id: 6, name: 'Short ranged', description: '[Agi]  Power -2  Range:12”', modifiers: { AGI: 0 } },
  { id: 7, name: 'Medium ranged', description: '[Agi]  Power +2  Range:18”', modifiers: { AGI: -2 } },
  { id: 8, name: 'Long ranged', description: '[Int]  power +4  Range:24”', modifiers: { AGI: -4 } },
  { id: 9, name: 'Artillery', description: '[Int]  power +6  Range:30”', modifiers: { AGI: -8 } }
];

const upgradeOptions = ['None', 'Fire', 'Lightning', 'Poison'];

const accessoryOptions = [
  { name: 'None', description: '', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Nice hat', description: 'Dashing and stylish, +4 charm. Lost permanently if leaping, falling or pushed.', modifiers: { STR: 4, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Ergonomic chair', description: 'Ugly but comfortable +4 intelligence, -4 agility and -4 charm. Cannot double move.', modifiers: { STR: -4, INT: -4, DED: 4, CHA: 0, AGI: 0 } },
  { name: 'Glass eye', description: 'Can detect hidden figures within 12 inches. But in return get bad depth perception and -4 to hit on all shoot and fight rolls.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 4, AGI: 0 } },
  { name: 'Cool tattoo', description: 'a +4 dedication, but the vanity makes all flirt actions automatically succeed on this character.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Big buckle', description: "a +4 strength, but -4 agility because you can't feel your legs.", modifiers: { STR: 0, INT: -4, DED: 0, CHA: 0, AGI: 4 } },
  { name: 'Stilts', description: 'model always move 3” in a straight line, regardless of move. but also counts all falls as extra +2”', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: '“New” underwear', description: 'a +1 dedication -1 charm. Sale now 75% reduced price. Only 10 credits!', modifiers: { STR: -1, INT: 0, DED: 0, CHA: 1, AGI: 0 } }
];


const itemOptions = [
  { name: 'None', description: '', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Yeasty drink', description: '[Ded] +4 armour, but -4 intelligence.', modifiers: { STR: 0, INT: -4, DED: 0, CHA: 0, AGI: 0, ARMOUR: 4 } },
  { name: 'Smell well water', description: '[Cha] +4 on charm rolls, unable to get the hidden.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 4, AGI: 0 } },
  { name: 'Rabid stew', description: '[Ded]  +4 strength, but -4 charm and can never flee.', modifiers: { STR: 4, INT: 0, DED: 0, CHA: -4, AGI: 0 } },
  { name: 'Never-stop pill', description: '[Ded] +2 to all stats but roll more injury on model (see in depth)', modifiers: { STR: 2, INT: 2, DED: 2, CHA: 2, AGI: 2 } },
  { name: 'Teleporta bello', description: '[Int] teleport to any point seen within 20”. (see in depth)', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Detox', description: '[Int] Remove the poison condition.', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Eek ink', description: '[agi] target must pass a [ded] or blindly run away (see in depth)', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } },
  { name: 'Airy Berry', description: '[Int] target becomes airborne until next activation (see in depth)', modifiers: { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 } }
];

const gearCosts = {
  'Book of belief': 40,
  'Nice hat': 40,
  'Ergonomic chair': 40,
  'Glass eye': 40,
  'Cool tattoo': 40,
  'Big buckle': 40,
  'Stilts': 40,
  '“New” underwear': 10,
  'Yeasty drink': 40,
  'Smell well water': 40,
  'Rabid stew': 40,
  'Never-stop pill': 40,
  'Teleporta bello': 40,
  'Detox': 40,
  'Eek ink': 40,
  'Airy Berry': 40,
  'Light': 20,
  'Medium': 40,
  'Heavy': 80,
  'Light melee': 30,
  'Medium melee': 40,
  'Heavy melee': 50,
  'Short ranged': 30,
  'Medium ranged': 40,
  'Long ranged': 50,
  'Artillery': 80,
  'Fire': 30,
  'Lightning': 30,
  'Poison': 30
};

const CharacterSheet = ({ character, calculateCostForCharacter }) => {
  const stats = character.stats;
  return (
    <div className="character-sheet-print">
      <h2>{character.name || "Unnamed"}</h2>
      <p>Level: {character.level}</p>
      <p>Cost: {calculateCostForCharacter(character)}</p>
      <p>STR: {stats.STR}, INT: {stats.INT}, DED: {stats.DED}, CHA: {stats.CHA}, AGI: {stats.AGI}</p>
      <p>Primary Skill: {character.primarySkill}</p>
      <p>Secondary Skill: {character.secondarySkill}</p>
      {/* Add more if needed */}
    </div>
  );
};

const TeamOverview = ({ teamName, characters, teamCredits, teamNotes, calculateCostForCharacter, totalTeamCost }) => {
  return (
    <div className="team-overview-print border p-4 w-[260mm] max-w-[260mm]">
      <h2>Team: {teamName}</h2>
      {characters.map((char, i) => (
        <p key={i}>{char.name || `Character ${i + 1}`}: {calculateCostForCharacter(char)} pts</p>
      ))}
      <p>Total: {totalTeamCost()} / {teamCredits}</p>
      <p>Remaining: {teamCredits - totalTeamCost()}</p>
      <p>Notes: {teamNotes}</p>
    </div>
  );
};

export default function App() {
  const characterScrollRef = useRef(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(false);

// Detect scroll availability
useEffect(() => {
  const el = characterScrollRef.current;
  if (!el) return;

  const handleScroll = () => {
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  handleScroll(); // run once on mount
  el.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  return () => {
    el.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  };
}, []);

// Enable mouse wheel horizontal scroll
useEffect(() => {
  const el = characterScrollRef.current;
  if (!el) return;

  const handleWheel = (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 3, behavior: 'smooth' });

    }
  };

  el.addEventListener('wheel', handleWheel, { passive: false });
  return () => el.removeEventListener('wheel', handleWheel);
}, []);

const characterCount = 4;
const [index, setindex] = useState(0);
const [teamName, setTeamName] = useState('');
const [teamCredits, setTeamCredits] = useState(200);
const [teamNotes, setTeamNotes] = useState('');
const calculateCostForCharacter = (char) => {
  let total = 0;

  const selectedArmour = armourOptions.find(a => a.value === char.armourType);
  const armourLabel = selectedArmour?.label;
  if (gearCosts[armourLabel]) total += gearCosts[armourLabel];

  const weaponLeftName = weapons.find(w => w.id.toString() === char.weaponLeft)?.name || '';
  const weaponRightName = weapons.find(w => w.id.toString() === char.weaponRight)?.name || '';
  Object.entries(gearCosts).forEach(([label, cost]) => {
    if (weaponLeftName.includes(label)) total += cost;
    if (weaponRightName.includes(label)) total += cost;
  });

  if (gearCosts[char.upgradeLeft]) total += gearCosts[char.upgradeLeft];
  if (gearCosts[char.upgradeRight]) total += gearCosts[char.upgradeRight];

  char.items.forEach(item => {
    if (gearCosts[item]) total += gearCosts[item];
  });

  if (gearCosts[char.accessory]) total += gearCosts[char.accessory];

  return total;
};

const totalTeamCost = () =>
  characters.reduce((sum, char) => sum + calculateCostForCharacter(char), 0);

const [characters, setCharacters] = useState(Array.from({ length: characterCount }, () => ({
  name: '',
  stats: { ...initialStats },
  primarySkill: '',
  secondarySkill: '',
  notes: '',
  armourType: 'none',
  weaponLeft: '',
  weaponRight: '',
  upgradeLeft: 'None',
  upgradeRight: 'None',
  items: ['', '', ''],
  usedItems: [false, false, false],
  accessory: '',
  injuries: ['', '', '', '', ''],
  level: 0
})));

const updateCharacter = (field, value) => {
  setCharacters((prev) => {
    const updated = [...prev];
    const character = { ...updated[activeCharacterIndex] };

    if (typeof value === "object" && !Array.isArray(value)) {
      // Merge objects (e.g., items, stats)
      character[field] = {
        ...character[field],
        ...value,
      };
    } else {
      // Direct field replacement
      character[field] = value;
    }

    updated[activeCharacterIndex] = character;
    return updated;
  });
};

const updateStat = (key, value) => {
  const num = parseInt(value, 10);
  const clamped = Math.max(-10, Math.min(10, isNaN(num) ? 0 : num));

  setCharacters(prev => {
    const updated = [...prev];
    updated[index] = {
      ...updated[index],
      stats: {
        ...updated[index].stats,
        [key]: clamped
      }
    };
    return updated;
  });
};

  const [cost, setCost] = useState(0); // Placeholder for future logic
  



 const getModifiersForCharacter = (character) => {
  const primary = skills.find(s => s.id.toString() === character.primarySkill)?.modifiers || {};
  const secondary = skills.find(s => s.id.toString() === character.secondarySkill)?.modifiers || {};
  const weaponL = weapons.find(w => w.id.toString() === character.weaponLeft)?.modifiers || {};
  const weaponR = weapons.find(w => w.id.toString() === character.weaponRight)?.modifiers || {};
  const accMod = accessoryOptions.find(a => a.name === character.accessory)?.modifiers || {};
  const itemMods = character.items.map((itemName, idx) => {
    const item = itemOptions.find(opt => opt.name === itemName);
    return character.usedItems[idx] ? item?.modifiers || {} : { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 };
  });

  const injuryMod = { STR: 0, INT: 0, DED: 0, CHA: 0, AGI: 0 };
  let isDead = false;

  character.injuries.forEach(val => {
    if (!val) return;
    if (val === 1) isDead = true;
    else if (val >= 2 && val <= 5) injuryMod.AGI -= 1;
    else if (val >= 6 && val <= 9) injuryMod.STR -= 1;
    else if (val >= 10 && val <= 13) injuryMod.INT -= 1;
    else if (val >= 14 && val <= 17) injuryMod.DED -= 1;
    else if (val >= 18 && val <= 19) injuryMod.CHA -= 1;
    else if (val === 20) injuryMod.CHA += 1;
  });

  const selectedArmour = armourOptions.find(a => a.value === character.armourType);

  let acc = Object.keys(initialStats).reduce((acc, key) => {
    const armourMod = key === 'AGI' ? selectedArmour?.agi || 0 : 0;
    const weaponMod = key === 'AGI' ? (weaponL.AGI || 0) + (weaponR.AGI || 0) : 0;
    const itemTotal = itemMods.reduce((sum, mod) => sum + (mod[key] || 0), 0);

    acc[key] =
      (primary[key] || 0) +
      (secondary[key] || 0) +
      armourMod +
      weaponMod +
      itemTotal +
      (accMod[key] || 0) +
      (injuryMod[key] || 0);

    return acc;
  }, isDead ? { _DEAD: true } : {});

  const totalArmourBonus = itemMods.reduce((sum, mod) => sum + (mod.ARMOUR || 0), 0);
  acc.ARMOUR = totalArmourBonus;

  return acc;
};

  const getSkillDescription = (id) => {
    const skill = skills.find(s => s.id.toString() === id);
    return skill ? skill.description : '';
  };

const calculateMoveForCharacter = (character) => {
  const baseAGI = character.stats.AGI || 0;
  const modAGI = getModifiersForCharacter(character).AGI || 0;
  return 5 + Math.floor((baseAGI + modAGI) / 2);
};



// RENDER things below!

return (
  <div className="print-only-character-sheet flex h-screen overflow-hidden">


    {/* Left Column – Team Overview */}
    
    <div className="left-column w-[500px] p-4 border-r">
      <div className="text-center font-bold mb-2">Team Overview</div>

      <input
        className="w-full p-2 border rounded mb-2"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team Name"
      />

      {characters.map((char, i) => (
        <div key={i} className="flex justify-between items-center text-sm mb-1">
          <span>{char.name || `Character ${i + 1}`}</span>
          <span>{calculateCostForCharacter(char)}</span>
        </div>
      ))}

      <div className="mt-2 font-bold">Credits</div>
      <input
        className="w-full p-2 border rounded mb-1"
        type="number"
        value={teamCredits}
        onChange={(e) => setTeamCredits(Number(e.target.value))}
      />

      <div className="flex justify-between text-sm">
        <span>Unspent:</span>
        <span>{teamCredits - totalTeamCost()}</span>
      </div>

      <textarea
        className="w-full mt-2 p-2 border rounded"
        rows="4"
        placeholder="Notes..."
        value={teamNotes}
        onChange={(e) => setTeamNotes(e.target.value)}
      />

      <button
  className="mt-4 w-full bg-red-300 header-text py-3 rounded shadow"
  onClick={() => window.print()}
>
  Print Team
</button>

    </div>

    {/* Middle Column – Character Sheet */}
<div
  ref={characterScrollRef}
  className="character-sheet-area flex-1 relative overflow-x-auto"
  style={{ overflowY: 'hidden' }}
>

{canScrollLeft && (
  <button
    onClick={() => characterScrollRef.current.scrollBy({ left: -2000, behavior: 'smooth' })}
    className="fixed left-[510px] top-1/2 transform -translate-y-1/2 z-50 rounded-md p-2 bg-black hover:bg-black/50 transition"
  >
    <span className="text-white text-2xl font-bold">◄</span>
  </button>
)}
{canScrollRight && (
  <button
    onClick={() => characterScrollRef.current.scrollBy({ left: 2000, behavior: 'smooth' })}
    className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 rounded-md p-2 bg-black hover:bg-black/50 transition"
  >
    <span className="text-white text-2xl font-bold">►</span>
  </button>
)}



  <div className="flex min-h-screen w-max gap-3 p-4">
    {characters.map((char, charIndex) => {
  const stats = char.stats;
  const modifiers = getModifiersForCharacter(char);

      return (
        <div key={index} className="character-sheet-print p-4 w-[500px] border rounded shadow bg-white flex-shrink-0">
      {modifiers._DEAD && (
        <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          Character {index + 1}
          <div className="text-9xl text-red-600 font-extrabold drop-shadow-lg">
            DEAD
          </div>
        </div>
      )}

      <div className="flex gap-4 items-end">
        <label className="flex-1 header-text">
          Name:
          <input
            className="block w-full border p-2 rounded mt-1 input-text"
            value={char.name}
onChange={(e) =>
  setCharacters(prev => {
    const updated = [...prev];
    updated[charIndex].name = e.target.value;
    return updated;
  })
}

          />
        </label>
        <div className="flex-none">
          <div className="header-text">Move</div>
          <div className="p-2 border rounded text-center input-text">
            {calculateMoveForCharacter(char)}
          </div>
        </div>
      </div>


<div className="flex justify-between gap-2 mt-2">
  {Object.keys(stats).map((key) => {
    const modifier = getModifiersForCharacter(char)[key] || 0;

    return (
      <label key={key} className="w-[90px] header-text">
        {key}:
        <div className="relative">
  {/* Display combined value like 3+2 */}
  <div className="relative">
  {/* Display value + modifier as background content (non-clickable) */}
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
{char.stats[key] + (modifier || 0)}

  </div>
</div>


  {/* Transparent number input over it — arrows will still show */}
<input
  type="number"
  className="absolute inset-0 w-full h-full text-transparent caret-transparent bg-transparent border-none"
  value={char.stats[key]}
onChange={(e) => {
  setCharacters(prev => {
  const updated = [...prev];
  const val = parseInt(e.target.value, 10);
  updated[index].stats[key] = isNaN(val) ? 0 : Math.max(-10, Math.min(10, val));
  setCharacters(updated);
    return updated;
});
}}

  min="-10"
  max="10"
  style={{
    WebkitAppearance: 'number-input',
    MozAppearance: 'number-input',
    appearance: 'number-input',
  }}
/>


</div>


</div>

      </label>
    );
  })}
</div>


      <div className="flex gap-4 items-start mt-2">
        <div className="flex-1">
          <div className="flex gap-2">
            <label className="flex-1 header-text">



Primary Skill:
              <select
  className="block w-full border p-2 rounded input-text"
  value={char.primarySkill}
onChange={(e) => {
  const updatedCharacters = [...characters];
  updatedCharacters[charIndex].primarySkill = e.target.value;
  setCharacters(updatedCharacters);
}}

>

                <option value="">Select Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <div className="description-text mt-1 w-full border rounded p-2" style={{ height: '165px' }}>
{getSkillDescription(char.primarySkill) || ''}

</div>
            </label>

            <label className="flex-1 header-text">


Secondary Skill:
<select
  className="block w-full border p-2 rounded input-text"
  value={char.secondarySkill}
onChange={(e) => {
  const updatedCharacters = [...characters];
  updatedCharacters[charIndex].secondarySkill = e.target.value;
  setCharacters(updatedCharacters);
}}

>

                <option value="">Select Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <div className="description-text mt-1 w-full border rounded p-2" style={{ height: '165px' }}>
{getSkillDescription(char.secondarySkill) || ''}

</div>

            </label>
          </div>
        </div>

        <div className="w-1/5">
          <label className="block mb-2 header-text">

            
Armour:
            <select
  className="block w-full border p-2 rounded mt-1 input-text"
  value={char.armourType}
onChange={(e) => {
  const updatedCharacters = [...characters];
  updatedCharacters[charIndex].armourType = e.target.value;
  setCharacters(updatedCharacters);
}}

>

              {armourOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="text-sm text-center mt-1 font-bold">
{(armourOptions.find(a => a.value === char.armourType)?.armour || 0)}
{getModifiersForCharacter(char).ARMOUR !== 0 && (
  <span className={getModifiersForCharacter(char).ARMOUR > 0 ? 'text-green-600' : 'text-red-600'}>
    {getModifiersForCharacter(char).ARMOUR > 0 ? `+${getModifiersForCharacter(char).ARMOUR}` : getModifiersForCharacter(char).ARMOUR}
  </span>
)}

</div>

          </label>
        </div>
      </div>


<div className="flex flex-col gap-0 mt-2">
  {["Right", "Left"].map((hand, idx) => {
    const weaponKey = hand === "Right" ? "weaponRight" : "weaponLeft";
    const upgradeKey = hand === "Right" ? "upgradeRight" : "upgradeLeft";
    const selected = char[weaponKey];
    const upgrade = char[upgradeKey];
    const weapon = weapons.find(w => w.id.toString() === selected);

    return (
      <div key={idx}>
        <div className="flex justify-between items-center">
          <span className="block header-text">{hand} Hand Weapon:</span>
          <span className="block header-text">Upgrade:</span>
        </div>

        <div className="flex gap-4 items-start">
          {/* Weapon dropdown */}
          <select
            className="w-[150px] border p-2 rounded input-text"
            value={selected}
            onChange={(e) => {
setCharacters(prev => {
  const updated = [...prev];
  updated[charIndex][weaponKey] = e.target.value;
  return updated;
});

            }}
          >
            <option value="">Select Weapon</option>
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Description */}
          <div className="flex-1 input-text border rounded p-2 whitespace-nowrap overflow-hidden text-ellipsis" style={{ height: '39px' }}>
            {weapon?.description || ''}
          </div>

          {/* Upgrade dropdown */}
          <select
            className="w-30 border p-2 rounded input-text"
            value={upgrade}
            onChange={(e) => {
setCharacters(prev => {
  const updated = [...prev];
  updated[charIndex][upgradeKey] = e.target.value;
  return updated;
});

            }}
          >
            {upgradeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    );
  })}
</div>



<div className="flex gap-4 mt-2">

  
  {/* Items container */}
  <div className="flex-[1_1_60%]">
    <h3 className="block header-text mb-1">Items</h3>
{char.items.map((item, itemIdx) => {
  const selectedItem = itemOptions.find(opt => opt.name === item);
  return (
    <div key={index} className="flex gap-2 mb-2 items-start">
      <div className="flex flex-col w-[140px]">
        <select
          className="border p-2 rounded input-text"
          value={item}
          onChange={(e) => {
            setCharacters(prev => {
  const updated = [...prev];
            updated[charIndex].items[itemIdx] = e.target.value;            setCharacters(updated);
              return updated;
});
          }}
        >
          {itemOptions.map((opt) => (
            <option key={opt.name} value={opt.name}>{opt.name}</option>
          ))}
        </select>

        <div className="mt-1 flex items-center justify-end w-full">
          <span className="text-xs mr-1">Used</span>
<input
  type="checkbox"
  checked={char.usedItems[itemIdx]}
  onChange={(e) => {
    const updatedCharacters = [...characters];
    const newUsedItems = [...char.usedItems];
    newUsedItems[itemIdx] = e.target.checked;
    updatedCharacters[charIndex].usedItems = newUsedItems;
    setCharacters(updatedCharacters);
  }}
/>


        </div>
      </div>

      <div className="flex-1 description-text p-2 border rounded" style={{ height: '70px' }}>
        {selectedItem?.description || ''}
      </div>
    </div>
  );
})}


  </div>

  {/* Accessory container (narrower) */}
<div className="flex-[1_1_27%]">
  <h3 className="block header-text mb-1">Accessory</h3>
  <select
    className="w-full border p-2 rounded input-text"
    value={char.accessory}
    onChange={(e) => {
setCharacters(prev => {
  const updated = [...prev];
  updated[charIndex].accessory = e.target.value;
  return updated;
});

}}

  >
    {accessoryOptions.map((opt) => (
      <option key={opt.name} value={opt.name}>{opt.name}</option>
    ))}
  </select>

  <div className="description-text mt-2 w-full border rounded p-2" style={{ height: '180px' }}>
    {
      accessoryOptions.find(a => a.name === char.accessory)?.description || ''
    }
  </div>
</div>


</div>

<div className="flex gap-4 items-end mt-2">


  {/* Injuries */}
  <div className="flex flex-col">
  <label className="block header-text mb-1">Injuries:</label>
  <div className="flex gap-2">
{char.injuries.map((val, i) => (
  <select
    key={i}
    className="border p-2 rounded input-text"
    value={val}
    onChange={(e) => {
      const updatedCharacters = [...characters];
const updatedInjuries = [...char.injuries];
updatedInjuries[i] = parseInt(e.target.value) || '';
updatedCharacters[charIndex].injuries = updatedInjuries;
setCharacters(updatedCharacters);

    }}
  >

    <option value="">—</option>
    {Array.from({ length: 20 }, (_, i) => (
      <option key={i + 1} value={i + 1}>{i + 1}</option>
    ))}
  </select>
))}

  </div>
</div>

  {/* Level */}
  <div className="flex-[1_1_20%]">
    <label className="block header-text mb-1">Level:</label>
<select
  className="w-full border p-2 rounded input-text"
  value={char.level}
onChange={(e) => {
  setCharacters(prev => {
  const updated = [...prev];
  updated[index].level = parseInt(e.target.value);
  setCharacters(updated);
    return updated;
});
}}

>
  {Array.from({ length: 21 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ))}
</select>


  </div>

  {/* Cost */}
  <div className="flex-[1_1_25%]">
  <label className="block header-text mb-1">Cost:</label>
  <div className="w-full border p-2 rounded input-text bg-gray-100 text-right font-mono">
{calculateCostForCharacter(char)}

  </div>
</div>
</div>
</div>
      );
    })}
  </div>
</div>



















{/* Printable static version of all 4 characters */}
<div
  id="print-clone"
  className="print-clone screen-hidden"
  style={{
    position: "left",
    margin: "0 auto",
    width: "100%",
    padding: 0,
    zIndex: 1
  }}
>
  {Array.from({ length: Math.ceil(characters.length / 2) }).map((_, pairIndex) => {
    const startIndex = pairIndex * 2;
    return (
        <div key={pairIndex}>
      <div className="character-pair" key={pairIndex}>
        {[0, 1].map((offset) => {
          const index = startIndex + offset;
          if (index >= characters.length) return null;
          const char = characters[index];
          const stats = char.stats;
          const modifiers = getModifiersForCharacter(char);

          return (
            <div
              key={index}
              className="character-sheet-print p-4 w-[500px] border rounded shadow bg-white flex-shrink-0">
      {modifiers._DEAD && (
        <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          Character {index + 1}
          <div className="text-9xl text-red-600 font-extrabold drop-shadow-lg">
            DEAD
          </div>
        </div>
      )}

      <div className="flex gap-4 items-end">
        <label className="flex-1 header-text">
          Name:
          <input
            className="block w-full border p-2 rounded mt-1 input-text"
            value={char.name}
onChange={(e) =>
  setCharacters(prev => {
    const updated = [...prev];
    updated[charIndex].name = e.target.value;
    return updated;
  })
}

          />
        </label>
        <div className="flex-none">
          <div className="header-text">Move</div>
          <div className="p-2 border rounded text-center input-text">
            {calculateMoveForCharacter(char)}
          </div>
        </div>
      </div>


<div className="flex justify-between gap-2 mt-2">
  {Object.keys(stats).map((key) => {
    const modifier = getModifiersForCharacter(char)[key] || 0;

    return (
      <label key={key} className="w-[90px] header-text">
        {key}:
        <div className="relative">
  {/* Display combined value like 3+2 */}
  <div className="relative">
  {/* Display value + modifier as background content (non-clickable) */}
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
{char.stats[key] + (modifier || 0)}

  </div>
</div>


  {/* Transparent number input over it — arrows will still show */}
<input
  type="number"
  className="absolute inset-0 w-full h-full text-transparent caret-transparent bg-transparent border-none"
  value={char.stats[key]}
onChange={(e) => {
  setCharacters(prev => {
  const updated = [...prev];
  const val = parseInt(e.target.value, 10);
  updated[index].stats[key] = isNaN(val) ? 0 : Math.max(-10, Math.min(10, val));
  setCharacters(updated);
    return updated;
});
}}

  min="-10"
  max="10"
  style={{
    WebkitAppearance: 'number-input',
    MozAppearance: 'number-input',
    appearance: 'number-input',
  }}
/>


</div>


</div>

      </label>
    );
  })}
</div>


      <div className="flex gap-4 items-start mt-2">
        <div className="flex-1">
          <div className="flex gap-2">
            <label className="flex-1 header-text">



Primary Skill:
              <select
  className="block w-full border p-2 rounded input-text"
  value={char.primarySkill}
onChange={(e) => {
  const updatedCharacters = [...characters];
  updatedCharacters[charIndex].primarySkill = e.target.value;
  setCharacters(updatedCharacters);
}}

>

                <option value="">Select Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <div className="description-text mt-1 w-full border rounded p-2" style={{ height: '165px' }}>
{getSkillDescription(char.primarySkill) || ''}

</div>
            </label>

            <label className="flex-1 header-text">


Secondary Skill:
<select
  className="block w-full border p-2 rounded input-text"
  value={char.secondarySkill}
onChange={(e) => {
  const updatedCharacters = [...characters];
  updatedCharacters[charIndex].secondarySkill = e.target.value;
  setCharacters(updatedCharacters);
}}

>

                <option value="">Select Skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
              </select>
              <div className="description-text mt-1 w-full border rounded p-2" style={{ height: '165px' }}>
{getSkillDescription(char.secondarySkill) || ''}

</div>

            </label>
          </div>
        </div>

        <div className="w-1/5">
          <label className="block mb-2 header-text">

            
Armour:
            <select
  className="block w-full border p-2 rounded mt-1 input-text"
  value={char.armourType}
onChange={(e) => {
  const updatedCharacters = [...characters];
  updatedCharacters[charIndex].armourType = e.target.value;
  setCharacters(updatedCharacters);
}}

>

              {armourOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="text-sm text-center mt-1 font-bold">
{(armourOptions.find(a => a.value === char.armourType)?.armour || 0)}
{getModifiersForCharacter(char).ARMOUR !== 0 && (
  <span className={getModifiersForCharacter(char).ARMOUR > 0 ? 'text-green-600' : 'text-red-600'}>
    {getModifiersForCharacter(char).ARMOUR > 0 ? `+${getModifiersForCharacter(char).ARMOUR}` : getModifiersForCharacter(char).ARMOUR}
  </span>
)}

</div>

          </label>
        </div>
      </div>


<div className="flex flex-col gap-0 mt-2">
  {["Right", "Left"].map((hand, idx) => {
    const weaponKey = hand === "Right" ? "weaponRight" : "weaponLeft";
    const upgradeKey = hand === "Right" ? "upgradeRight" : "upgradeLeft";
    const selected = char[weaponKey];
    const upgrade = char[upgradeKey];
    const weapon = weapons.find(w => w.id.toString() === selected);

    return (
      <div key={idx}>
        <div className="flex justify-between items-center">
          <span className="block header-text">{hand} Hand Weapon:</span>
          <span className="block header-text">Upgrade:</span>
        </div>

        <div className="flex gap-4 items-start">
          {/* Weapon dropdown */}
          <select
            className="w-[150px] border p-2 rounded input-text"
            value={selected}
            onChange={(e) => {
setCharacters(prev => {
  const updated = [...prev];
  updated[charIndex][weaponKey] = e.target.value;
  return updated;
});

            }}
          >
            <option value="">Select Weapon</option>
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* Description */}
          <div className="flex-1 input-text border rounded p-2 whitespace-nowrap overflow-hidden text-ellipsis" style={{ height: '39px' }}>
            {weapon?.description || ''}
          </div>

          {/* Upgrade dropdown */}
          <select
            className="w-30 border p-2 rounded input-text"
            value={upgrade}
            onChange={(e) => {
setCharacters(prev => {
  const updated = [...prev];
  updated[charIndex][upgradeKey] = e.target.value;
  return updated;
});

            }}
          >
            {upgradeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    );
  })}
</div>



<div className="flex gap-4 mt-2">

  
  {/* Items container */}
  <div className="flex-[1_1_60%]">
    <h3 className="block header-text mb-1">Items</h3>
{char.items.map((item, itemIdx) => {
  const selectedItem = itemOptions.find(opt => opt.name === item);
  return (
    <div key={index} className="flex gap-2 mb-2 items-start">
      <div className="flex flex-col w-[140px]">
        <select
          className="border p-2 rounded input-text"
          value={item}
          onChange={(e) => {
            setCharacters(prev => {
  const updated = [...prev];
            updated[charIndex].items[itemIdx] = e.target.value;            setCharacters(updated);
              return updated;
});
          }}
        >
          {itemOptions.map((opt) => (
            <option key={opt.name} value={opt.name}>{opt.name}</option>
          ))}
        </select>

        <div className="mt-1 flex items-center justify-end w-full">
          <span className="text-xs mr-1">Used</span>
<input
  type="checkbox"
  checked={char.usedItems[itemIdx]}
  onChange={(e) => {
    const updatedCharacters = [...characters];
    const newUsedItems = [...char.usedItems];
    newUsedItems[itemIdx] = e.target.checked;
    updatedCharacters[charIndex].usedItems = newUsedItems;
    setCharacters(updatedCharacters);
  }}
/>


        </div>
      </div>

      <div className="flex-1 description-text p-2 border rounded" style={{ height: '70px' }}>
        {selectedItem?.description || ''}
      </div>
    </div>
  );
})}


  </div>

  {/* Accessory container (narrower) */}
<div className="flex-[1_1_27%]">
  <h3 className="block header-text mb-1">Accessory</h3>
  <select
    className="w-full border p-2 rounded input-text"
    value={char.accessory}
    onChange={(e) => {
setCharacters(prev => {
  const updated = [...prev];
  updated[charIndex].accessory = e.target.value;
  return updated;
});

}}

  >
    {accessoryOptions.map((opt) => (
      <option key={opt.name} value={opt.name}>{opt.name}</option>
    ))}
  </select>

  <div className="description-text mt-2 w-full border rounded p-2" style={{ height: '180px' }}>
    {
      accessoryOptions.find(a => a.name === char.accessory)?.description || ''
    }
  </div>
</div>


</div>

<div className="flex gap-4 items-end mt-2">


  {/* Injuries */}
  <div className="flex flex-col">
  <label className="block header-text mb-1">Injuries:</label>
  <div className="flex gap-2">
{char.injuries.map((val, i) => (
  <select
    key={i}
    className="border p-2 rounded input-text"
    value={val}
    onChange={(e) => {
      const updatedCharacters = [...characters];
const updatedInjuries = [...char.injuries];
updatedInjuries[i] = parseInt(e.target.value) || '';
updatedCharacters[charIndex].injuries = updatedInjuries;
setCharacters(updatedCharacters);

    }}
  >

    <option value="">—</option>
    {Array.from({ length: 20 }, (_, i) => (
      <option key={i + 1} value={i + 1}>{i + 1}</option>
    ))}
  </select>
))}

  </div>
</div>

  {/* Level */}
  <div className="flex-[1_1_20%]">
    <label className="block header-text mb-1">Level:</label>
<select
  className="w-full border p-2 rounded input-text"
  value={char.level}
onChange={(e) => {
  setCharacters(prev => {
  const updated = [...prev];
  updated[index].level = parseInt(e.target.value);
  setCharacters(updated);
    return updated;
});
}}

>
  {Array.from({ length: 21 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ))}
</select>


  </div>

  {/* Cost */}
  <div className="flex-[1_1_25%]">
  <label className="block header-text mb-1">Cost:</label>
  <div className="w-full border p-2 rounded input-text bg-gray-100 text-right font-mono">
{calculateCostForCharacter(char)}

  </div>
</div>
</div>
</div>
      );
    })}
    </div> 
      {pairIndex === 0 && <div className="brute-force-page-break" />}
</div>
    
  ) 


  })} 
   </div>    </div>)}
