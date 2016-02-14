# Trimpz
Automated runner (Javascript) of Trimps game

Some of the Features:
- Buys buildings.

- Buys upgrades.

- Buys equipment.

- Portals with challenges.

- Tracks helium/hr and /zone for all runs since script started.

- Assigns workers.

- Runs maps for equipment drops.

- Runs maps for unique drops.

- Runs maps for world/zone bonus when needed.

- Runs maps for loot for equipment upgrades when needed.

- Auto-assigns workers temporarily to perform tasks as needed such as research. For example, when a useful upgrade comes up, it will shift a bunch of workers into research. Or, if that upgrade requires something else like metal, they will get significantly shifted towards metal acquisition.

- Different sets of constants are used for different stages of the game and are stored in constant structures (normally changed settings are now in a UI on the menu bar under "Trimpz")

- There are tons of constants to set such as zone to portal at, challenge to run, ratios for workers, ratios for building purchase, minimum number of warpstations before purchasing gigastation. (MANY more)

- Picks formations.

- Turns on auto-fight and auto-trap.

- Hires and fires geneticists to maintain 30s (or specified) anticipation.

- “Pause” button for pausing the script.

- Buys the most efficient equipment upgrade/prestige and saves up for the correct one.

- Assigns “you” where needed (Mining, Researching, Building, etc.). Prioritizes building.

- Buys the more efficient of warpstation or collector when affordable.

- Calculates how hard the current Boss will be taking some challenges(nom, toxicity) into account and runs maps.

- Buys maps and sets sliders as needed and as affordable.

- UI adapted from AutoTrimps.


Use this bookmarklet to run the script while you're at https://trimps.github.io/# :
javascript:document.body.appendChild(document.createElement('script')).setAttribute('src','https://rawgit.com/driderr/Trimpz/master/Trimpz.js');void(0);

