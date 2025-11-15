import React from "react";

export default function CharacterSheetFull({
  character,
  index,
  updateCharacter,
  updateCharacterField,
  calculateMove,
  getModifiers,
  getSkillDescription,
  updateStat,
  gearCosts,
  weapons,
  armourOptions,
  skills,
  upgradeOptions,
  itemOptions,
  accessoryOptions
}) {
  const stats = character.stats;
  const selectedArmour = armourOptions.find(a => a.value === character.armourType);

  return (
    <div className="p-4 max-w-[500px] mx-auto page-break border border-gray-300 m-4 bg-white shadow">
      <div className="flex gap-4 items-end">
        <label className="flex-1 header-text">
          Name:
          <input
            className="block w-full border p-2 rounded mt-1 input-text"
            value={character.name}
            onChange={(e) => updateCharacter(index, "name", e.target.value)}
          />
        </label>
        <div className="flex-none">
          <div className="header-text">Move</div>
          <div className="p-2 border rounded text-center input-text">
            {calculateMove(character)}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2 mt-2">
        {Object.keys(stats).map((key) => {
          const modifier = getModifiers(character)[key] || 0;
          return (
            <label key={key} className="w-[90px] header-text">
              {key}:
              <div className="relative">
                <div
                  className="block w-full border p-2 rounded text-center font-mono bg-white"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="text-sm input-text">
                    {stats[key]}
                    {modifier !== 0 && (
                      <span className={`ml-1 ${modifier > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {modifier > 0 ? `+${modifier}` : modifier}
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-bold leading-tight">
                    {stats[key] + modifier}
                  </div>
                </div>
                <input
                  type="number"
                  className="absolute inset-0 w-full h-full text-transparent caret-transparent bg-transparent border-none"
                  value={stats[key]}
                  onChange={(e) => {
                    const base = stats[key];
                    const newVal = parseInt(e.target.value, 10);
                    if (!isNaN(newVal)) {
                      const diff = newVal - base;
                      updateStat(index, key, base + diff);
                    }
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
            </label>
          );
        })}
      </div>

      {/* You will paste the remaining parts of your original character sheet (skills, weapons, items, accessories, injuries, etc.) here in the next steps. */}
    </div>
  );
}
