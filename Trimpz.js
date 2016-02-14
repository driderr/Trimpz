/*global game,tooltip,resolvePow,getNextPrestigeCost,adjustMap,updateMapCost,addSpecials*/
/*jslint plusplus: true */

//sets of constants to modify that will be switched out over the course of the game
//generally speaking, and by default, it starts with constantsEarlyGame and then uses the next set at 45,55, and then 60
//if you add an entirely new constant set, be sure to add it in order in the array "constantsSets" and set the set's "zoneToStartAt" appropriately
var constantsEarlyGame = (function () {
    "use strict";
    var zoneToStartAt = 0,                  //where this set of constants begins being used
        runInterval = 200,                 //how often Trimpz main loop is run
        minerMultiplier = 2,                //how many more miners than farmers? (multiplied)
        trainerCostRatio = 0.2,             //buy trainers with enough resources (0.2 = 20% of resources)
        explorerCostRatio = 0.2,            //buy explorers with enough resources (0.2 = 20% of resources)
        minFoodOwned = 15,                  //minimum food on hand, required for beginning of the game
        minWoodOwned = 15,                  //minimum wood on hand, required for beginning of the game
        minTrimpsOwned = 10,                //minimum trimps on hand, required for beginning of the game
        minScienceOwned = 10,               //minimum science on hand, required for beginning of the game
        housingCostRatio = 0.3,             //buy housing with enough resources (0.2 = 20% of resources)
        gymCostRatio = 0.6,                 //buy gyms with enough resources (0.2 = 20% of resources)
        maxGyms = 10000,                    //maximum number of gyms to buy
        tributeCostRatio = 0.5,             //buy tributes with enough resources (0.2 = 20% of resources)
        nurseryCostRatio = 0.5,             //buy nursery with enough resources (0.2 = 20% of resources)
        maxLevel = 10,                      //maximum level of all equipment per tier unless it's really cheap(see constant above)
        equipmentCostRatio = 0.5,           //buy equipment with enough resources (0.2 = 20% of resources)
        otherWorkersFocusRatio = 0.5,       //what percent of trimps to take from each other job to focus on gaining resources for an upgrade, including science
        numTrapsForAutoTrapping = 10000,    //maximum number of traps to build
        shieldCostRatio = 1,                //buy shield with enough resources (1 = 100% of resources)
        lumberjackMultiplier = 1,           //how many more lumberjacks than farmers? (multiplied)
        maxWormholes = 0,                   //maximum number of wormholes to buy
        shouldSkipHpEquipment = false,      //true to not buy or prestige/upgrade health equipment
        minimumEquipmentLevel = 5;          //currently unused
    return {
        getZoneToStartAt: function () { return zoneToStartAt; },
        getRunInterval: function () { return runInterval; },
        getTrainerCostRatio: function () { return trainerCostRatio; },
        getMinerMultiplier: function () { return minerMultiplier; },
        getExplorerCostRatio: function () { return explorerCostRatio; },
        getMinFoodOwned: function () { return minFoodOwned; },
        getMinWoodOwned: function () { return minWoodOwned; },
        getMinTrimpsOwned: function () { return minTrimpsOwned; },
        getMinScienceOwned: function () { return minScienceOwned; },
        getGymCostRatio: function () { return gymCostRatio; },
        getMaxGyms : function () { return maxGyms; },
        getHousingCostRatio: function () { return housingCostRatio; },
        getTributeCostRatio: function () { return tributeCostRatio; },
        getNurseryCostRatio: function () { return nurseryCostRatio; },
        getMaxLevel: function () {return maxLevel;},
        getEquipmentCostRatio: function () {return equipmentCostRatio;},
        getOtherWorkersFocusRatio: function () {return otherWorkersFocusRatio;},
        getNumTrapsForAutoTrapping: function () {return numTrapsForAutoTrapping;},
        getShieldCostRatio: function () {return shieldCostRatio;},
        getLumberjackMultiplier: function () {return lumberjackMultiplier;},
        getMaxWormholes: function () {return maxWormholes;},
        getShouldSkipHpEquipment: function () {return shouldSkipHpEquipment;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;}
    };
})();
var constantsLateGame = (function () {
    "use strict";
    var zoneToStartAt = 45,
        runInterval = 200,
        minerMultiplier = 0.5,
        trainerCostRatio = 0.2,
        explorerCostRatio = 0.2,
        minFoodOwned = 15,
        minWoodOwned = 15,
        minTrimpsOwned = 10,
        minScienceOwned = 10,
        housingCostRatio = 0.1,
        gymCostRatio = 0.95,
        maxGyms = 170,
        tributeCostRatio = 0.8,
        nurseryCostRatio = 0.15,
        maxLevel = 5,
        equipmentCostRatio = 0.8,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 0.05,
        lumberjackMultiplier = 0.5,
        maxWormholes = 0,
        shouldSkipHpEquipment = false,
        minimumEquipmentLevel = 5;
    return {
        getZoneToStartAt: function () { return zoneToStartAt; },
        getRunInterval: function () { return runInterval; },
        getTrainerCostRatio: function () { return trainerCostRatio; },
        getMinerMultiplier: function () { return minerMultiplier; },
        getExplorerCostRatio: function () { return explorerCostRatio; },
        getMinFoodOwned: function () { return minFoodOwned; },
        getMinWoodOwned: function () { return minWoodOwned; },
        getMinTrimpsOwned: function () { return minTrimpsOwned; },
        getMinScienceOwned: function () { return minScienceOwned; },
        getGymCostRatio: function () { return gymCostRatio; },
        getMaxGyms : function () { return maxGyms; },
        getHousingCostRatio: function () { return housingCostRatio; },
        getTributeCostRatio: function () { return tributeCostRatio; },
        getNurseryCostRatio: function () { return nurseryCostRatio; },
        getMaxLevel: function () {return maxLevel;},
        getEquipmentCostRatio: function () {return equipmentCostRatio;},
        getOtherWorkersFocusRatio: function () {return otherWorkersFocusRatio;},
        getNumTrapsForAutoTrapping: function () {return numTrapsForAutoTrapping;},
        getShieldCostRatio: function () {return shieldCostRatio;},
        getLumberjackMultiplier: function () {return lumberjackMultiplier;},
        getMaxWormholes: function () {return maxWormholes;},
        getShouldSkipHpEquipment: function () {return shouldSkipHpEquipment;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;}
    };
})();
var constantsLateLateGame = (function () {
    "use strict";
    var zoneToStartAt = 55,
        runInterval = 200,
        minerMultiplier = 1,
        trainerCostRatio = 0.01,
        explorerCostRatio = 0.01,
        minFoodOwned = 15,
        minWoodOwned = 15,
        minTrimpsOwned = 10,
        minScienceOwned = 10,
        housingCostRatio = 0.05,
        gymCostRatio = 0.8,
        maxGyms = 170,
        tributeCostRatio = 0.9,
        nurseryCostRatio = 0.01,
        maxLevel = 4,
        equipmentCostRatio = 0.9,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 0.01,
        lumberjackMultiplier = 1,
        maxWormholes = 0,
        shouldSkipHpEquipment = true,
        minimumEquipmentLevel = 5;
    return {
        getZoneToStartAt: function () { //don't start until enough block since last constants should be getting gyms
            if (game.global.soldierCurrentBlock > 750 * 1000000000000000) { //need about 750Qa to beat 59 boss
                return zoneToStartAt; //enough block, begin!
            }
            return constantsEndGame.getZoneToStartAt(); //not enough block, but need to start next constants if too late
        },
        getRunInterval: function () { return runInterval; },
        getTrainerCostRatio: function () { return trainerCostRatio; },
        getMinerMultiplier: function () { return minerMultiplier; },
        getExplorerCostRatio: function () { return explorerCostRatio; },
        getMinFoodOwned: function () { return minFoodOwned; },
        getMinWoodOwned: function () { return minWoodOwned; },
        getMinTrimpsOwned: function () { return minTrimpsOwned; },
        getMinScienceOwned: function () { return minScienceOwned; },
        getGymCostRatio: function () { return gymCostRatio; },
        getMaxGyms : function () { return maxGyms; },
        getHousingCostRatio: function () { return housingCostRatio; },
        getTributeCostRatio: function () { return tributeCostRatio; },
        getNurseryCostRatio: function () { return nurseryCostRatio; },
        getMaxLevel: function () {return maxLevel;},
        getEquipmentCostRatio: function () {return equipmentCostRatio;},
        getOtherWorkersFocusRatio: function () {return otherWorkersFocusRatio;},
        getNumTrapsForAutoTrapping: function () {return numTrapsForAutoTrapping;},
        getShieldCostRatio: function () {return shieldCostRatio;},
        getLumberjackMultiplier: function () {return lumberjackMultiplier;},
        getMaxWormholes: function () {return maxWormholes;},
        getShouldSkipHpEquipment: function () {return shouldSkipHpEquipment;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;}
    };
})();
var constantsEndGame = (function () {
    "use strict";
    var zoneToStartAt = 60,
        runInterval = 200,
        minerMultiplier = 4,
        trainerCostRatio = 0,
        explorerCostRatio = 0,
        minFoodOwned = 15,
        minWoodOwned = 15,
        minTrimpsOwned = 10,
        minScienceOwned = 10,
        housingCostRatio = 0,
        gymCostRatio = 0,
        maxGyms = 10000,
        tributeCostRatio = 0.7,
        nurseryCostRatio = 0.20,
        maxLevel = 4,
        equipmentCostRatio = 0.9,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 0.01,
        lumberjackMultiplier = 0.33,
        maxWormholes = 0,
        shouldSkipHpEquipment = false,
        minimumEquipmentLevel = 5;
    return {
        getZoneToStartAt: function () { return zoneToStartAt; },
        getRunInterval: function () { return runInterval; },
        getTrainerCostRatio: function () { return trainerCostRatio; },
        getMinerMultiplier: function () { return minerMultiplier; },
        getExplorerCostRatio: function () { return explorerCostRatio; },
        getMinFoodOwned: function () { return minFoodOwned; },
        getMinWoodOwned: function () { return minWoodOwned; },
        getMinTrimpsOwned: function () { return minTrimpsOwned; },
        getMinScienceOwned: function () { return minScienceOwned; },
        getGymCostRatio: function () { return gymCostRatio; },
        getMaxGyms : function () { return maxGyms; },
        getHousingCostRatio: function () { return housingCostRatio; },
        getTributeCostRatio: function () { return tributeCostRatio; },
        getNurseryCostRatio: function () { return nurseryCostRatio; },
        getMaxLevel: function () {return maxLevel;},
        getEquipmentCostRatio: function () {return equipmentCostRatio;},
        getOtherWorkersFocusRatio: function () {return otherWorkersFocusRatio;},
        getNumTrapsForAutoTrapping: function () {return numTrapsForAutoTrapping;},
        getShieldCostRatio: function () {return shieldCostRatio;},
        getLumberjackMultiplier: function () {return lumberjackMultiplier;},
        getMaxWormholes: function () {return maxWormholes;},
        getShouldSkipHpEquipment: function () {return shouldSkipHpEquipment;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;}
    };
})();

//game variables, not for user setting
var constantsSets = [constantsEarlyGame, constantsLateGame, constantsLateLateGame, constantsEndGame];
var constantsIndex;
var constants;
var trimpz = 0;             //"Trimpz" running indicator
var autoFighting = false;   //Autofight on?
var workersFocused = false;
var workersFocusedOn;
var workersMoved = [];
var mapsWithDesiredUniqueDrops = [8,10,14,15,18,23,25,29,30,34,40,47,50,80,125]; //removed from array when done, reset on portal or refresh
var uniqueMaps = ["The Block", "The Wall",  "Dimension of Anger", "Trimple Of Doom", "The Prison", "Bionic Wonderland", "Bionic Wonderland II", "Bionic Wonderland III", "Bionic Wonderland IV", "Bionic Wonderland V", "Bionic Wonderland VI"];
var helium = -1;
var heliumHistory = [];
var portalObtained = false;
var pauseTrimpz = false;
var bionicDone = false;
var formationDone = false;
var heliumLog = [];
var lastFoughtInWorld = true;
var trimpzSettings = {};

//Loads the automation settings from browser cache
function loadPageVariables() {
    var tmp = JSON.parse(localStorage.getItem('TrimpzSettings'));
    if (tmp !== null) {
        trimpzSettings = tmp;
    }
}

//Saves automation settings to browser cache
function saveSettings() {
    localStorage.setItem('TrimpzSettings', JSON.stringify(trimpzSettings));
}

function initializeUiAndSettings() {
    loadPageVariables();
    document.head.appendChild(document.createElement('script')).src = 'https://rawgit.com/driderr/AutoTrimps/TrimpzUI/NewUI.js';
}

/**
 * @return {boolean} return.canAfford affordable respecting the ratio?
 */
function CanBuyNonUpgrade(nonUpgradeItem, ratio) {
    "use strict";
    var aResource; //JSLint insisted I move declaration to top...
    var needed;
    for (aResource in nonUpgradeItem.cost) {
        needed = nonUpgradeItem.cost[aResource];
        if (typeof needed[1] !== 'undefined') {
            needed = resolvePow(needed, nonUpgradeItem);
        }
        if (typeof nonUpgradeItem.prestige !== 'undefined') {//Discount equipment
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
        } else if (game.portal.Resourceful.level)
        {
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level)));
        }
        if (game.resources[aResource].owned * ratio < needed) {
            return false;
        }
    }
    return true;
}

function GetNonUpgradePrice(nonUpgradeItem) {
    "use strict";
    var aResource;
    var needed;
    for (aResource in nonUpgradeItem.cost) {
        needed = nonUpgradeItem.cost[aResource];
        if (typeof needed[1] !== 'undefined') {
            needed = resolvePow(needed, nonUpgradeItem);
        }
        if (typeof nonUpgradeItem.prestige !== 'undefined') {//Discount equipment
            needed = Math.ceil(needed * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
        }
        if (aResource === "gems" && nonUpgradeItem === game.buildings.Warpstation)
        {
            return needed;
        }
    }
    return needed;
}

/**
 * @return {number}
 */
function CanBuyWorkerWithResource(job, ratio, food, extraWorkers){
    "use strict";
    var cost = job.cost.food;
    var price = 0;
    if (typeof cost[1] !== 'undefined')
        price =  Math.floor((cost[0] * Math.pow(cost[1], job.owned + extraWorkers)) * ((Math.pow(cost[1], 1) - 1) / (cost[1] - 1)));
    else
        price = cost;
    if ( food * ratio >= price)
        return price;
    else{
        return -1;
    }
}

function getTotalTimeForBreeding(almostOwnedGeneticists) {
    "use strict";
    var trimps = game.resources.trimps;
    var trimpsMax = trimps.realMax();
    var potencyMod = trimps.potency;

    //Broken Planet
    if (game.global.brokenPlanet) potencyMod /= 10;
    //Pheromones
    potencyMod *= 1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
    //Geneticist
    if (game.jobs.Geneticist.owned + almostOwnedGeneticists > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned + almostOwnedGeneticists);
    //Quick Trimps
    if (game.unlocks.quickTrimps) potencyMod *= 2;
    if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0){
        potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
    }
    potencyMod = (1 + (potencyMod / 10));
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var totalTime;
    if (game.options.menu.showFullBreed.enabled == 1) totalTime = log10((trimpsMax - trimps.employed) / (trimpsMax - adjustedMax - trimps.employed)) / log10(potencyMod);
    else {
        var threshold = Math.ceil((trimpsMax - trimps.employed) * 0.95);
        totalTime = log10(threshold / (threshold - adjustedMax)) / log10(potencyMod);
    }
    totalTime /= 10;
    return totalTime;
}

function getRemainingTimeForBreeding() {
    "use strict";
    var trimps = game.resources.trimps;
    var trimpsMax = trimps.realMax();
    var potencyMod = trimps.potency;

    //Broken Planet
    if (game.global.brokenPlanet) potencyMod /= 10;
    //Pheromones
    potencyMod *= 1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
    //Geneticist
    if (game.jobs.Geneticist.owned  > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned);
    //Quick Trimps
    if (game.unlocks.quickTrimps) potencyMod *= 2;
    if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0){
        potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
    }
    potencyMod = (1 + (potencyMod / 10));
    var timeRemaining = log10((trimpsMax - trimps.employed) / (trimps.owned - trimps.employed)) / log10(potencyMod);
    timeRemaining /= 10;
    return timeRemaining;
}

function ShouldBuyGeneticist(food, extraGeneticists) {
    var trimps = game.resources.trimps;
    var cost;
    var targetBreedTime = trimpzSettings["targetBreedTime"].value;

    var shouldBuy = game.jobs.Geneticist.locked === 0 &&
        game.global.challengeActive !== "Electricity" &&
        (cost = CanBuyWorkerWithResource(game.jobs.Geneticist, 1, food, extraGeneticists)) !== -1 &&
        getTotalTimeForBreeding(extraGeneticists) < targetBreedTime &&
        getRemainingTimeForBreeding() < targetBreedTime &&
        (game.global.lastBreedTime / 1000 < targetBreedTime - getRemainingTimeForBreeding() + trimpzSettings["targetBreedTimeHysteresis"].value
        || trimps.owned === trimps.realMax());
    return {
        shouldBuy : shouldBuy,
        cost : cost
    };
}

function AssignFreeWorkers() {
    "use strict";
    var trimps = game.resources.trimps;
    var food = game.resources.food.owned;
    var buy = {
        "Geneticist" : 0,
        "Trainer" : 0,
        "Explorer" : 0,
        "Scientist" : 0,
        "Miner" : 0,
        "Lumberjack" : 0,
        "Farmer" : 0
    };
    if (trimps.owned === 0 || game.global.firing) {
        return;
    }

    var free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);

    //make room for a Geneticist
    if (free === 0 && ShouldBuyGeneticist(food,0).shouldBuy){
        game.global.firing = true;
        game.global.buyAmt = 1;
        document.getElementById("Farmer").click();
        game.global.firing = false;
    }

    if (free > 0){
        document.getElementById("tab1").click();    //hire 1 at a time
    } else
    {
        return;
    }
    var breedCount = (trimps.owned - trimps.employed > 2) ? Math.floor(trimps.owned - trimps.employed) : 0;
    if (free > trimps.owned){
        free = Math.floor(trimps.owned / 3);
    }
    if (autoFighting === false){
        if (breedCount - trimps.employed > 0){
            free = Math.min(free,Math.floor((breedCount - trimps.employed)/2));
        } else {
            return;
        }
    }
    var cost;
    var maxFreeForAssignOneAtATime = 1000;
    var totalMultipliers;
    var assignThisMany;
    while (free > 0) {
        if (free > maxFreeForAssignOneAtATime && game.jobs.Miner.locked === 0){
            totalMultipliers = constants.getMinerMultiplier() + constants.getLumberjackMultiplier() + 1; //1 for default/reference farmer
            assignThisMany = constants.getMinerMultiplier() / totalMultipliers * (free - maxFreeForAssignOneAtATime);
            buy.Miner += Math.floor(assignThisMany);
            assignThisMany = constants.getLumberjackMultiplier() / totalMultipliers * (free - maxFreeForAssignOneAtATime);
            buy.Lumberjack += Math.floor(assignThisMany);
            assignThisMany = free - maxFreeForAssignOneAtATime - buy.Miner - buy.Lumberjack;
            buy.Farmer += assignThisMany;

            free -= buy.Miner + buy.Lumberjack + buy.Farmer;
        }
        var geneticistValues = ShouldBuyGeneticist(food, buy.Geneticist);
        if (geneticistValues.shouldBuy){
            food -= geneticistValues.cost;
            buy.Geneticist += 1;
            free--;
        } else if (game.jobs.Trainer.locked === 0 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Trainer, constants.getTrainerCostRatio(), food , buy.Trainer)) !== -1){
            food -= cost;
            buy.Trainer += 1;
            free--;
        } else if (game.jobs.Explorer.locked === 0 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Explorer, constants.getExplorerCostRatio(), food, buy.Explorer)) !== -1){
            food -= cost;
            buy.Explorer += 1;
            free--;
        } else if (game.jobs.Scientist.locked === 0 && game.jobs.Scientist.owned + buy.Scientist < game.global.world + 1 &&
            (cost = CanBuyWorkerWithResource(game.jobs.Scientist, 1, food, buy.Scientist)) !== -1) {
            food -= cost;
            buy.Scientist += 1;
            free--;
        } else if (game.jobs.Miner.locked === 0 && game.jobs.Miner.owned + buy.Miner < (game.jobs.Farmer.owned + buy.Farmer) * constants.getMinerMultiplier() &&
            (cost = CanBuyWorkerWithResource(game.jobs.Miner, 1, food, buy.Miner)) !== -1) {
            food -= cost;
            buy.Miner += 1;
            free--;
        } else if (game.jobs.Lumberjack.locked === 0 && game.jobs.Lumberjack.owned + buy.Lumberjack < (game.jobs.Farmer.owned + buy.Farmer) * constants.getLumberjackMultiplier() &&
            (cost = CanBuyWorkerWithResource(game.jobs.Lumberjack, 1, food, buy.Lumberjack)) !== -1){
            food -= cost;
            buy.Lumberjack += 1;
            free--;
        } else if ((cost = CanBuyWorkerWithResource(game.jobs.Farmer, 1, food, buy.Farmer)) !== -1){
            food -= cost;
            buy.Farmer += 1;
            free--;
        } else {
            break; //Can't afford anything!
        }
    }
    var jobName;
    var numberToBuy;
    var element;
    for (jobName in buy){
        numberToBuy = buy[jobName];
        if (numberToBuy > 0){
            game.global.buyAmt = numberToBuy;
            element = document.getElementById(jobName);
            if (element !== 'undefined')
                element.click();
        }
    }
    game.global.buyAmt = 1;
    tooltip('hide');
}
function Fight() {
    "use strict";
    if (autoFighting === true && game.resources.trimps.owned > 25) { //>25 should reset autoFighting on portal
        return;
    }

    autoFighting = false;
    var pauseFightButton = document.getElementById("pauseFight");
    if (pauseFightButton.offsetHeight > 0 && game.resources.trimps.owned === game.resources.trimps.realMax() || game.resources.trimps.owned > 5000000) {
        if (pauseFightButton.innerHTML !== "AutoFight On") {
            pauseFightButton.click();
        }
        autoFighting = true;
    } else if (document.getElementById("battleContainer").style.visibility !== "hidden") {
        document.getElementById("fightBtn").click();
    }
}
function ShowRunningIndicator() {
    "use strict";
    var rotater = ["|", "/", "-", "\\"][trimpz];
    trimpz += 1;
    if (trimpz > 3) {
        trimpz = 0;
    }
    document.getElementById("trimpTitle").innerHTML = "Trimpz " + rotater;
}

function getMaxResource(resource)
{
    "use strict";
    var theResource = game.resources[resource];
    return theResource.max + (theResource.max * game.portal.Packrat.modifier * game.portal.Packrat.level);
}

function queueContainsItem(item){
    "use strict";
    for (var queued in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[queued].indexOf(item) > -1)
            return true;
    }
    return false;
}

function UpgradeStorage() {
    "use strict";

    if (game.resources.food.owned > game.buildings.Barn.cost.food() &&
        game.resources.food.owned > 0.9 * getMaxResource("food")) {
        if (game.buildings.Barn.locked === 0 && !queueContainsItem("Barn")) {
            document.getElementById("Barn").click();
        }
    }
    if (game.resources.wood.owned > game.buildings.Shed.cost.wood() &&
        game.resources.wood.owned > 0.9 * getMaxResource("wood")) {
        if (game.buildings.Shed.locked === 0 && !queueContainsItem("Shed")) {
            document.getElementById("Shed").click();
        }
    }
    if (game.resources.metal.owned > game.buildings.Forge.cost.metal() &&
        game.resources.metal.owned > 0.9 * getMaxResource("metal")) {
        if (game.buildings.Forge.locked === 0 && !queueContainsItem("Forge")) {
            document.getElementById("Forge").click();
        }
    }
}

function ClickAllNonEquipmentUpgrades() {
    "use strict";
    var upgrade;
    for (upgrade in game.upgrades) {
        if (upgrade === "Gigastation"){
            continue;
        }
        if (trimpzSettings["skipShieldBlock"].value === true && upgrade === "Shieldblock"){
            continue;
        }
        if (typeof game.upgrades[upgrade].prestiges === 'undefined' && game.upgrades[upgrade].locked === 0) {
            document.getElementById(upgrade).click();  //Upgrade!
        }
    }
    tooltip('hide');
}
function FocusWorkersOn(jobToFocusOn) {
    "use strict";
    var jobObj;
    var workersToMove;
    var jobsToMoveFrom = ["Farmer", "Lumberjack", "Miner"];
    var fromJobButton;
    var job;

    if (game.jobs[jobToFocusOn].locked) {
        return;
    }
    if (workersFocused === true && jobToFocusOn === workersFocusedOn) {
        return;
    }
    if (workersFocused === true){ //focused on the wrong thing!
        RestoreWorkerFocus();
        if (workersFocused === true){
            return;
        }
    }
    workersMoved = [];
    for (job in jobsToMoveFrom) {
        jobObj = game.jobs[jobsToMoveFrom[job]];
        if (jobObj.locked === true || jobObj.owned < 2 || jobsToMoveFrom[job] === jobToFocusOn) {
            continue;
        }
        workersToMove = Math.floor(jobObj.owned * constants.getOtherWorkersFocusRatio());
        if (game.resources.food.owned < workersToMove * game.jobs[jobToFocusOn].cost.food) {
            continue;
        }
        game.global.buyAmt = workersToMove;
        game.global.firing = true;
        fromJobButton = document.getElementById(jobsToMoveFrom[job]);
        fromJobButton.click();
        game.global.firing = false;
        document.getElementById(jobToFocusOn).click();
        game.global.buyAmt = 1;
        workersMoved.push([jobsToMoveFrom[job], workersToMove, jobToFocusOn]);
    }
    if (workersMoved.length !== 0) {
        workersFocused = true;
        workersFocusedOn = jobToFocusOn;
    }
}
function RestoreWorkerFocus() {
    "use strict";
    var workersToMove;
    var job;
    var workersLeft = 0;
    var jobMoved;

    if (workersFocused === false){
        return;
    }
    for (jobMoved in workersMoved)
    {
        workersToMove = workersMoved[jobMoved][1];
        job = workersMoved[jobMoved][0];
        if (game.resources.food.owned <  workersToMove * game.jobs[job].cost.food || workersToMove === 0){
            workersLeft += workersToMove;
            continue;
        }
        game.global.buyAmt = workersToMove;
        game.global.firing = true;
        document.getElementById(workersMoved[jobMoved][2]).click();
        game.global.firing = false;
        document.getElementById(job).click();
        game.global.buyAmt = 1;
        workersMoved[jobMoved][1] = 0;
    }
    if (workersLeft === 0) {
        workersFocused = false;
        workersFocusedOn = "";
    }
}
/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function UpgradeNonEquipment() {
    "use strict";
    var upgrade;
    var aResource;
    var needed;
    ClickAllNonEquipmentUpgrades();
    for (upgrade in game.upgrades) {
        if (typeof game.upgrades[upgrade].prestiges === 'undefined' && game.upgrades[upgrade].locked === 0) {
            if (upgrade === "Gigastation" && 
				(game.buildings.Warpstation.owned < trimpzSettings["minimumWarpStations"].value + trimpzSettings["deltaIncreaseInMinimumWarpstationsPerGigastationPurchase"].value * game.upgrades.Gigastation.done
                || CanBuyNonUpgrade(game.buildings.Warpstation, 2) === true)){ //ratio 2 for "can buy soon"
                continue;
            }
            if (upgrade == 'Coordination' && !canAffordCoordinationTrimps()) continue;
            if (trimpzSettings["skipShieldBlock"].value === true && upgrade === "Shieldblock"){
                continue;
            }
            for (aResource in game.upgrades[upgrade].cost.resources) {
                needed = game.upgrades[upgrade].cost.resources[aResource];
                if (typeof needed[1] !== 'undefined') {
                    needed = resolvePow(needed, game.upgrades[upgrade]);
                }
                if (aResource === "food" && needed > game.resources.food.owned) {
                    document.getElementById("foodCollectBtn").click();
                    FocusWorkersOn("Farmer");
                    return true;
                }
                if (aResource === "metal" && needed > game.resources.metal.owned) {
                    document.getElementById("metalCollectBtn").click();
                    FocusWorkersOn("Miner");
                    return true;
                }
                if (aResource === "science" && needed > game.resources.science.owned) {
                    document.getElementById("scienceCollectBtn").click();
                    FocusWorkersOn("Scientist");
                    return true;
                }
                if (aResource === "wood" && needed > game.resources.wood.owned) {
                    document.getElementById("woodCollectBtn").click();
                    FocusWorkersOn("Lumberjack");
                    return true;
                }
            }
            document.getElementById(upgrade).click();  //Upgrade!
        }
    }
    RestoreWorkerFocus();
    return false;
}

function GetBreedSpeed() {
    "use strict";
    var breedArray = document.getElementById("trimpsPs").innerHTML.match(/(\d+(?:\.\d+)?)(\D+)?(?:\/sec)/);
    return unprettify(breedArray);
}

/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function UpgradeAndGather() {
    "use strict";
    var collectingForNonEquipment = UpgradeNonEquipment();
    if (collectingForNonEquipment)
        return true;

    if (game.resources.trimps.owned < game.resources.trimps.realMax() &&
        game.buildings.Trap.owned > 0 &&
        GetBreedSpeed() < trimpzSettings["minBreedingSpeed"].value){
        document.getElementById("trimpsCollectBtn").click();
//        } else if (game.global.buildingsQueue.length > 0) {
//            document.getElementById("buildingsCollectBtn").click();
    } else { //nothing to build
        document.getElementById("metalCollectBtn").click();
    }
    tooltip('hide');
    return false;
}
/**
 * @return {boolean} return.shouldReturn Was priority found (stop further processing)?
 */
function BeginPriorityAction() { //this is really just for the beginning (after a portal)
    "use strict";
    if (game.global.buildingsQueue.length > 0) {//Build queue
        if (document.getElementById("autoTrapBtn").innerHTML !== "Traps On" ||
            game.global.buildingsQueue[0] !== "Trap.1") {
            document.getElementById("buildingsCollectBtn").click();
            return true;
        }
    }
    if (game.resources.food.owned < constants.getMinFoodOwned()) {//Collect food
        document.getElementById("foodCollectBtn").click();
        return true;
    }
    if (game.resources.wood.owned < constants.getMinWoodOwned()) {//Collect wood
        document.getElementById("woodCollectBtn").click();
        return true;
    }
    if (game.buildings.Trap.owned < 1) {//Enqueue trap
        document.getElementById("Trap").click();
        document.getElementById("buildingsCollectBtn").click();
        return true;
    }
    if (game.resources.trimps.owned < constants.getMinTrimpsOwned() &&
        game.resources.trimps.owned < game.resources.trimps.realMax()/2) {//Open trap
        document.getElementById("trimpsCollectBtn").click();
        return true;
    }
    if (game.resources.science.owned < constants.getMinScienceOwned()) {//Collect science
        document.getElementById("scienceCollectBtn").click();
        return true;
    }
    return false;
}

/**
 * @return {boolean}
 */
function BuyBuilding(buildingName, ratio, max){
    "use strict";
    var useMax;
    if (typeof max === 'undefined'){
        useMax = 999999999999999999999999999999;
    } else {
        useMax = max;
    }
    var theBuilding = game.buildings[buildingName];
    if (theBuilding.locked === 0 && theBuilding.owned < useMax &&
        CanBuyNonUpgrade(theBuilding, ratio) === true) {
        document.getElementById(buildingName).click();
        return true;
    }
    return false;
}

function BuyBuildings() {
    "use strict";
    BuyBuilding("Gym", constants.getGymCostRatio(), constants.getMaxGyms());
    BuyBuilding("Nursery", constants.getNurseryCostRatio());
    BuyBuilding("Tribute", constants.getTributeCostRatio());
    BuyBuilding("Hut", constants.getHousingCostRatio());
    BuyBuilding("House", constants.getHousingCostRatio());
    BuyBuilding("Mansion", constants.getHousingCostRatio());
    BuyBuilding("Hotel", constants.getHousingCostRatio());
    BuyBuilding("Resort", constants.getHousingCostRatio());
    BuyBuilding("Gateway", constants.getHousingCostRatio());
    BuyBuilding("Wormhole", 1, constants.getMaxWormholes());
    if (game.buildings.Warpstation.locked === 1 || GetNonUpgradePrice(game.buildings.Warpstation) > GetNonUpgradePrice(game.buildings.Collector) * game.buildings.Warpstation.increase.by / game.buildings.Collector.increase.by) {
        BuyBuilding("Collector", 1);
    }
    while (BuyBuilding("Warpstation", 1)){}
    tooltip('hide');
}

function TurnOnAutoBuildTraps() {
    "use strict";
    if (document.getElementById("autoTrapBtn").getAttribute("style") !== "display: none" &&
        document.getElementById("autoTrapBtn").innerHTML === "Traps Off") {
        document.getElementById("autoTrapBtn").click();
    }
}


function BuyShield() {
    "use strict";
    var shieldUpgrade = game.upgrades.Supershield;
    if (shieldUpgrade.locked === 0 && CanAffordEquipmentUpgrade("Supershield") === true) {
        var costOfNextLevel = Math.ceil(getNextPrestigeCost("Supershield") * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
        var costOfTwoLevels = costOfNextLevel * (1 + game.equipment.Shield.cost.wood[1]);
        if (game.resources.wood.owned * constants.getShieldCostRatio() > costOfTwoLevels) {
            document.getElementById("Supershield").click();  //Upgrade!
            document.getElementById("Shield").click();  //Buy a level!
            document.getElementById("Shield").click();  //Buy another!
            tooltip('hide');
        }
    }
    var shield = game.equipment.Shield;
    if (shield.locked === 0 && CanBuyNonUpgrade(shield, constants.getShieldCostRatio()) === true &&
        shield.level < constants.getMaxLevel()) {
        document.getElementById("Shield").click();
        tooltip('hide');
    }
}
function FindBestEquipmentToLevel(debugHpToAtkRatio) {
    "use strict";
    var anEquipment;
    var bestEquipGainPerMetal = 0;
    var bestEquipment;
    var gainPerMetal;
    var cost;
    var currentEquip;
    var multiplier;
    for (anEquipment in game.equipment) {
        currentEquip = game.equipment[anEquipment];
        if (currentEquip.locked === 1 || anEquipment === "Shield" || (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined')) {
            continue;
        }
        if (currentEquip.level >= constants.getMaxLevel()) {
            continue;
        }
        cost = GetNonUpgradePrice(currentEquip);
        multiplier = currentEquip.healthCalculated ? 1 / 8 : 1;
        gainPerMetal = (currentEquip.healthCalculated || currentEquip.attackCalculated) * multiplier / cost;
        debugHpToAtkRatio.push([anEquipment, gainPerMetal * 1000000]);
        if (gainPerMetal > bestEquipGainPerMetal) {
            bestEquipGainPerMetal = gainPerMetal;
            bestEquipment = anEquipment;
        }
    }
    return {
        bestEquipGainPerMetal: bestEquipGainPerMetal,
        bestEquipment: bestEquipment
    };
}
function FindBestEquipmentUpgrade(debugHpToAtkRatio) {
    "use strict";
    var gainPerMetal;
    var cost;
    var currentEquip;
    var multiplier;
    var upgrade;
    var currentUpgrade;
    var bestUpgradeGainPerMetal = 0;
    var bestUpgrade;
    var bestUpgradeCost;
    var stat;
    var gain;
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges !== 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            cost = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
            multiplier = currentEquip.healthCalculated ? 1 / 8 : 1;
            stat = (typeof currentEquip.health !== 'undefined') ? "health" : "attack";
            gain = Math.round(currentEquip[stat] * Math.pow(1.19, ((currentEquip.prestige) * game.global.prestige[stat]) + 1));
            gainPerMetal = gain * multiplier / cost;
            debugHpToAtkRatio.push([upgrade, gainPerMetal * 1000000]);
            if (gainPerMetal > bestUpgradeGainPerMetal) {
                bestUpgradeGainPerMetal = gainPerMetal;
                bestUpgrade = upgrade;
                bestUpgradeCost = cost;
            }
        }
    }
    return {
        bestUpgradeGainPerMetal: bestUpgradeGainPerMetal,
        bestUpgrade: bestUpgrade,
        bestUpgradeCost: bestUpgradeCost
    };
}
function BuyEquipmentOrUpgrade(bestEquipGainPerMetal, bestUpgradeGainPerMetal, bestEquipment, timeStr, bestUpgrade, bestUpgradeCost, debugHpToAtkRatio) {
    "use strict";
    var boughtSomething = false;
    if (bestEquipGainPerMetal > bestUpgradeGainPerMetal) {
        if (CanBuyNonUpgrade(game.equipment[bestEquipment], constants.getEquipmentCostRatio()) === true) {
            document.getElementById(bestEquipment).click();
            console.debug("Best buy " + bestEquipment + timeStr);
            boughtSomething = true;
        }
    } else {
        if (CanAffordEquipmentUpgrade(bestUpgrade) === true && bestUpgradeCost < game.resources.metal.owned * constants.getEquipmentCostRatio()) {
            document.getElementById(bestUpgrade).click();
            console.debug("Best buy " + bestUpgrade + timeStr);
            boughtSomething = true;
        }
    }
    var entry;
    if (boughtSomething === true) {
        for (entry in debugHpToAtkRatio) {
            console.debug(debugHpToAtkRatio[entry][0] + ":" + debugHpToAtkRatio[entry][1]);
        }
        console.debug("****End of Best Buy****");
    }
}
function BuyCheapEquipment(timeStr) {
    "use strict";
    var anEquipment;
    var currentEquip;
    for (anEquipment in game.equipment) {
        currentEquip = game.equipment[anEquipment];
        if (currentEquip.locked === 1 || anEquipment === "Shield" || (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined')) {
            continue;
        }
        if (CanBuyNonUpgrade(game.equipment[anEquipment], trimpzSettings["CheapEquipmentRatio"].value) === true) {
            document.getElementById(anEquipment).click();
            console.debug("Low cost buy for " + anEquipment + timeStr);
        }
    }
    return currentEquip;
}
function BuyCheapEquipmentUpgrades(timeStr) {
    "use strict";
    var currentEquip;
    var upgrade;
    var cost;
    var currentUpgrade;
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges !== 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            cost = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
            if (CanAffordEquipmentUpgrade(upgrade) === true && cost < game.resources.metal.owned * trimpzSettings["CheapEqUpgradeRatio"].value) {
                document.getElementById(upgrade).click();
                console.debug("Low cost buy for " + upgrade + timeStr);
            }
        }
    }
}
function BuyMetalEquipment() {
    "use strict";
    var debugHpToAtkRatio = [];
    var time = new Date();
    var timeStr = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

    var retFBETL = FindBestEquipmentToLevel(debugHpToAtkRatio);
    var bestEquipGainPerMetal = retFBETL.bestEquipGainPerMetal;
    var bestEquipment = retFBETL.bestEquipment;

    var retFBEU = FindBestEquipmentUpgrade(debugHpToAtkRatio);
    var bestUpgradeGainPerMetal = retFBEU.bestUpgradeGainPerMetal;
    var bestUpgrade = retFBEU.bestUpgrade;
    var bestUpgradeCost = retFBEU.bestUpgradeCost;

    if (bestEquipGainPerMetal === 0 && bestUpgradeGainPerMetal === 0) {   //nothing to buy
        return;
    }
    BuyEquipmentOrUpgrade(bestEquipGainPerMetal, bestUpgradeGainPerMetal, bestEquipment, timeStr, bestUpgrade, bestUpgradeCost, debugHpToAtkRatio);
    BuyCheapEquipment(timeStr);
    BuyCheapEquipmentUpgrades(timeStr);
    tooltip('hide');
}

/**
 * @return {boolean} return.canAfford affordable upgrade?
 */
function CanAffordEquipmentUpgrade(upgrade) {
    "use strict";
    var canBuyUpgrade = true;
    var aResource;
    var needed;
    for (aResource in game.upgrades[upgrade].cost.resources) {
        if (aResource === "metal" || aResource === "wood") {
            continue;
        }
        needed = game.upgrades[upgrade].cost.resources[aResource];
        if (typeof needed[1] !== 'undefined') {
            needed = resolvePow(needed, game.upgrades[upgrade]);
        }
        if (needed > game.resources[aResource].owned) {
            canBuyUpgrade = false;
            break;
        }
    }
    return canBuyUpgrade;
}

function unprettify(splitArray) {
    "use strict";
    var suffices = [
        'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud',
        'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv',
        'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'
    ];
    var suffixIndex = suffices.indexOf(splitArray[2]);
    var base = suffixIndex + 1;
    return splitArray[1] * Math.pow(1000, base);
}

function getAverageOfPrettifiedString(attackString) {
    "use strict";
    var splitArray = attackString.split("-");
    var minArray = splitArray[0].match(/(\d+(?:\.\d+)?)(\D+)/); //[1] is number, [2] is unit
    var maxArray= splitArray[1].match(/(\d+(?:\.\d+)?)(\D+)/); //[1] is number, [2] is unit

    var min;
    var max;
    if (minArray === null){
        min = splitArray[0];
    } else{
        min = unprettify(minArray);
    }
    if (maxArray === null){
        max = splitArray[0];
    } else{
        max = unprettify(maxArray);
    }
    return (max + min)/2;
}

function getBossAttack() {
    "use strict";
    var cell = game.global.gridArray[99];
    var baseAttack = game.global.getEnemyAttack(cell.level, cell.name);
    if (game.global.challengeActive === "Toxicity"){
        baseAttack *= 5;
    }
    var attackString = calculateDamage(baseAttack, true);
    return getAverageOfPrettifiedString(attackString);
}

function getBossHealth() {
    "use strict";
    var cell = game.global.gridArray[99];
    var health = game.global.getEnemyHealth(cell.level, cell.name);
    if (game.global.challengeActive === "Toxicity"){
        health *= 2;
    }
    return health;
}

function getSoldierAttack(){
    "use strict";
    var attackString = document.getElementById("goodGuyAttack").innerHTML;
    return getAverageOfPrettifiedString(attackString);
}

function canTakeOnBoss(){
    "use strict";
    var bossAttackBase = getBossAttack();
    var bossHealth = getBossHealth();
    var soldierAttack = getSoldierAttack();
    if (!lastFoughtInWorld)
    {
        soldierAttack *= 1 + (0.2 * game.global.mapBonus);
    }
    var soldierHealth = game.global.soldierHealthMax;

    var attackAndBlock = bossAttackBase - game.global.soldierCurrentBlock;
    if (game.global.brokenPlanet){
        var overpower = (game.global.formation == 3) ? bossAttackBase * 0.1 : bossAttackBase * 0.2;
        if (attackAndBlock < overpower) attackAndBlock = overpower;
    }
    if (attackAndBlock < 0) attackAndBlock = 1; //1 to prevent divide by 0
    var bossAttack = attackAndBlock;

    if (game.global.challengeActive == "Toxicity" || game.global.challengeActive == "Nom") {
        bossAttack += game.global.soldierHealthMax * 0.05;
    }

    var attacksToKillBoss = bossHealth/soldierAttack;
    var attacksToKillSoldiers = soldierHealth/bossAttack;
    var numberOfDeaths = attacksToKillBoss/attacksToKillSoldiers;

    if (attacksToKillSoldiers < 1)
        return false;
    if (numberOfDeaths > trimpzSettings["numberOfDeathsAllowedToKillBoss"].value)
        return false;

    if (game.global.challengeActive == "Nom" && numberOfDeaths > 1){
        var cbossAttackBase = bossAttackBase;
        var cbossHealth = bossHealth;
        var csoldierAttack = soldierAttack;
        var cattacksToKillSoldiers = attacksToKillSoldiers;

        for (var i = 0; i < numberOfDeaths; i++){
            cbossHealth -= (cattacksToKillSoldiers - 1) * csoldierAttack;
            cbossHealth += 0.05 * bossHealth;
            if (cbossHealth <= 0){
                return true;
            }
            cbossAttackBase *= 1.25;

            var cattackAndBlock = cbossAttackBase - game.global.soldierCurrentBlock;
            if (game.global.brokenPlanet){
                var coverpower = (game.global.formation == 3) ? cbossAttackBase * 0.1 : cbossAttackBase * 0.2;
                if (cattackAndBlock < coverpower) cattackAndBlock = coverpower;
            }
            if (cattackAndBlock < 0) cattackAndBlock = 1;
            var cbossAttack = cattackAndBlock;
            cbossAttack += game.global.soldierHealthMax * 0.05;
            cattacksToKillSoldiers = soldierHealth/cbossAttack;
            if (cattacksToKillSoldiers < 1)
                return false;
        }
        return false;
    }

    return true;
}

function GotoMapsScreen() {
    "use strict";
    if (game.global.preMapsActive === true) {
        return;
    }
    var mapsButton = document.getElementById("mapsBtn");
    mapsButton.click();  //mapsClicked();
    if (mapsButton.innerHTML === "Abandon Soldiers"){
        mapsButton.click();
    }
}

function RunNewMap(zoneToCreate) {
    "use strict";
    var newMap;
    var size = 9;   //0-9
    var difficulty = 9; //0-9
    var loot = 0; //0-9
    var biome = "Random";

    GotoMapsScreen();
    document.getElementById("difficultyAdvMapsRange").value = difficulty;
    adjustMap('difficulty', difficulty);
    document.getElementById("sizeAdvMapsRange").value = size;
    adjustMap('size', size);
    document.getElementById("lootAdvMapsRange").value = loot;
    adjustMap('loot', loot);
    document.getElementById("biomeAdvMapsSelect").value = biome;
    if (typeof zoneToCreate !== 'undefined') {
        document.getElementById("mapLevelInput").value = zoneToCreate;
    }
    var cost = updateMapCost(true);
    while (cost > game.resources.fragments.owned){
        if (size === 1){
            difficulty--;
            if (difficulty === 1) {
                return;         //need more fragments!
            }
        } else {
            size--;
        }
        document.getElementById("sizeAdvMapsRange").value = size;
        adjustMap('size', size);
        document.getElementById("difficultyAdvMapsRange").value = difficulty;
        adjustMap('difficulty', difficulty);
        cost = updateMapCost(true);
    }
    document.getElementById("mapCreateBtn").click();
    newMap = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1];
    RunMap(newMap);
}

function RunNewMapForLoot(zoneToCreate) {
    "use strict";
    var newMap;
    var size = 0;   //0-9
    var difficulty = 9; //0-9
    var loot = 9; //0-9
    var biome = "Mountain";

    GotoMapsScreen();
    document.getElementById("difficultyAdvMapsRange").value = difficulty;
    adjustMap('difficulty', difficulty);
    document.getElementById("sizeAdvMapsRange").value = size;
    adjustMap('size', size);
    document.getElementById("lootAdvMapsRange").value = loot;
    adjustMap('loot', loot);
    document.getElementById("biomeAdvMapsSelect").value = biome;
    if (typeof zoneToCreate !== 'undefined') {
        document.getElementById("mapLevelInput").value = zoneToCreate;
    }
    var cost = updateMapCost(true);
    while (cost > game.resources.fragments.owned){
        if (loot === 1){
            difficulty--;
            if (difficulty === 1) {
                return;         //need more fragments!
            }
        } else {
            loot--;
        }
        document.getElementById("lootAdvMapsRange").value = loot;
        adjustMap('loot', loot);
        document.getElementById("difficultyAdvMapsRange").value = difficulty;
        adjustMap('difficulty', difficulty);
        cost = updateMapCost(true);
    }
    document.getElementById("mapCreateBtn").click();
    newMap = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1];
    RunMap(newMap);
}

function RunMap(map) {
    "use strict";
    GotoMapsScreen();
    lastFoughtInWorld = false;
    document.getElementById(map.id).click();
    document.getElementById("selectMapBtn").click();
}

function RunWorld() {
    "use strict";
    lastFoughtInWorld = true;
    document.getElementById("mapsBtn").click();  //mapsClicked();
}

function getMaxEnemyHealthForMapLevel(mapLevel) {  //adapted from Trimps getEnemyHealth()
    "use strict";
    var world = mapLevel;
    var level = 75;
    var name = "Mountimp";
    var difficulty = 0.84;

    var amt = 0;
    amt += 130 * Math.sqrt(world * Math.pow(3.265, world));
    amt -= 110;
    if (world == 1 || world == 2 && level < 10){
        amt *= 0.6;
        amt = (amt * 0.25) + ((amt * 0.72) * (level / 100));
    }
    else if (world < 60)
        amt = (amt * 0.4) + ((amt * 0.4) * (level / 110));
    else{
        amt = (amt * 0.5) + ((amt * 0.8) * (level / 100));
        amt *= Math.pow(1.1, world - 59);
    }
    if (world > 5) amt *= 1.1;
    amt *= game.badGuys[name].health;
    return Math.floor(amt * difficulty);
}

function getLevelOfOneShotMap() {
    "use strict";
    var soldierAttack = getSoldierAttack();
    if (lastFoughtInWorld){
        soldierAttack /= 1 + (0.2 * game.global.mapBonus);
    }

    for (var mapLevel = game.global.world; mapLevel > 6; mapLevel--) {
        var maxEnemyHealth = getMaxEnemyHealthForMapLevel(mapLevel);
        if (game.global.challengeActive == "Toxicity"){
            maxEnemyHealth *= 2;
        }
        if (soldierAttack >= maxEnemyHealth){
            return mapLevel;
        }
    }
    return 6;
}

function RunMaps() {
    "use strict";
    var map;
    var theMap;
    var itemsAvailable;

    if (game.global.world < 7 || (game.global.mapsActive === true && game.global.preMapsActive === false)){ //no map ability(wait one) or already running a map(repeat should be off)
        return;
    }

    if (game.global.preMapsActive === false)
    {
        if (game.resources.trimps.owned < game.resources.trimps.realMax() && game.resources.trimps.soldiers !== 0) {
            return;
        }
    }

    if (game.upgrades.Bounty.done === 0 && game.upgrades.Bounty.locked === 1) { //Look for Bounty upgrade
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "The Wall" && addSpecials(true, true, theMap) > 0){
                RunMap(theMap);
                return;
            }
        }
    }

    if (game.global.challengeActive === "Electricity" && game.global.world >= 80) { //Do Prison to turn off elec challenge
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "The Prison"){
                RunMap(theMap);
                return;
            }
        }
    }

    if (trimpzSettings["runBionicWonderland"].value && bionicDone === false && game.global.world >= 125) { //For Bionic speed run achieve
        for (map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name === "Bionic Wonderland"){
                bionicDone = true;
                RunMap(theMap);
                return;
            }
        }
    }

    if (trimpzSettings["doRunMapsForBonus"].value && game.global.lastClearedCell < 98 && game.global.world > 10){
        if (!canTakeOnBoss()){
            console.debug("Can't take on Boss!");
            var mapLevel;
            if (game.global.mapBonus < 10){
                console.debug("Let's increase bonus.");
                mapLevel = game.global.world - game.portal.Siphonology.level;
                for (map in game.global.mapsOwnedArray) {
                    theMap = game.global.mapsOwnedArray[map];
                    if (theMap.level === mapLevel && theMap.size <= 40){
                        console.debug("Found map to increase bonus on.");
                        RunMap(theMap);
                        return;
                    }
                }
                console.debug("Need a new map to increase bonus.");
                RunNewMap(mapLevel);
                return;
            }
            if (trimpzSettings["doRunMapsForEquipment"].value){
                console.debug("Bonus maxed.  Let's level equipment.");
                mapLevel = getLevelOfOneShotMap();
                for (map in game.global.mapsOwnedArray) {
                    theMap = game.global.mapsOwnedArray[map];
                    if (theMap.level === mapLevel && theMap.loot >= 1.40){
                        console.debug("Found a loot map to run for equipment.");
                        RunMap(theMap);
                        return;
                    }
                }
                console.debug("Making a new loot map.");
                RunNewMapForLoot(mapLevel);
                return;
            }
        }
    }


    var itemsAvailableInNewMap = addSpecials(true,true,{ id: "map999", name: "My Map", location: "Sea", clears: 0, level: game.global.world, difficulty: 1.11, size: 40, loot: 1.2, noRecycle: false });
    if (game.global.preMapsActive === true && itemsAvailableInNewMap === 0){
        RunWorld();
        return;
    }
    if (itemsAvailableInNewMap === 0){
        return;
    }

    var uniqueMapIndex = mapsWithDesiredUniqueDrops.indexOf(game.global.world); //Run new map if on zone with unique map drop then remove
    if (uniqueMapIndex > -1 && itemsAvailableInNewMap > 0){
        mapsWithDesiredUniqueDrops.splice(uniqueMapIndex,1);
        RunNewMap(game.global.world);
        return;
    }

    //Any equipment upgrades available?
    var upgrade;
    var currentUpgrade;
    var currentEquip;
    var totalUpgrades = 0;
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges !== 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            totalUpgrades++;
        }
    }

    if (totalUpgrades < trimpzSettings["minimumUpgradesOnHand"].value){//=== 0){ //if not equipment upgrades, go get some! (can make this a "< constant" later if desired)
        //what's the lowest zone map I can create and get items?
        var zoneToTry;
        for (zoneToTry = 6; zoneToTry <= game.global.world; zoneToTry++){
            itemsAvailableInNewMap = addSpecials(true,true,{ id: "map999", name: "My Map", location: "Sea", clears: 0, level: zoneToTry, difficulty: 1.11, size: 40, loot: 1.2, noRecycle: false });
            if (itemsAvailableInNewMap > 0)
            {
                break;
            }
        }

        for (map in game.global.mapsOwnedArray){ //look for an existing map first
            theMap = game.global.mapsOwnedArray[map];
            if (uniqueMaps.indexOf(theMap.name) > -1){
                continue;
            }
            itemsAvailable = addSpecials(true,true,game.global.mapsOwnedArray[map]);
            if (itemsAvailable > 0 && theMap.level === zoneToTry) {
                RunMap(game.global.mapsOwnedArray[map]);
                return;
            }
        }
        RunNewMap(zoneToTry);
    }
    if (game.global.preMapsActive === true){
        RunWorld();
    }
}


function ReallocateWorkers() {
    "use strict";
    var jobObj;
    var workersToFire;
    var jobsToFire = ["Farmer", "Lumberjack", "Miner"];
    var jobButton;
    var job;

    workersFocused = false;
    workersFocusedOn = "";
    game.global.firing = true;
    for (job in jobsToFire) {
        jobObj = game.jobs[jobsToFire[job]];
        if (jobObj.locked === true) {
            continue;
        }
        workersToFire = Math.floor(jobObj.owned);
        game.global.buyAmt = workersToFire;
        jobButton = document.getElementById(jobsToFire[job]);
        jobButton.click();
    }
    game.global.buyAmt = 1;
    game.global.firing = false;
    AssignFreeWorkers();
}

function CheckLateGame() {
    "use strict";
    if (game.global.world == 60 && document.getElementById('extraGridInfo').style.display == 'block')
        restoreGrid();
    if (game.global.world === 1 && helium !== -1) {
        constants = constantsSets[0];
        constantsIndex = 0;
        mapsWithDesiredUniqueDrops = [8,10,14,15,18,23,25,29,30,34,40,47,50,80,125];
        heliumHistory = [];
        formationDone = false;
        autoFighting = false;
        helium = -1;
        portalObtained = false;
        bionicDone = false;
        return;
    }
    if (constantsIndex === constantsSets.length - 1){ //check for last element
        return;
    }
    var nextSet = constantsIndex + 1;
    if (game.global.world >= constantsSets[nextSet].getZoneToStartAt())
    {
        constants = constantsSets[nextSet];
        constantsIndex = nextSet;
        RestoreWorkerFocus();
        ReallocateWorkers();
    }
}


function CheckHelium() {
    "use strict";
    var date;
    var oldHelium;
    var rate;
    var totalHelium;
    var totalTime;
    var cumulativeRate;
    if (helium === -1){
        helium = game.resources.helium.owned;
        heliumHistory.push({
            totalHelium: helium,
            date: Date.now(),
            heliumPerHourInZone: 0,
            totalHours: 0,
            totalHeliumPerHour: 0,
            zone: game.global.world});
    } else if (game.resources.helium.owned < helium){ //must have spent some helium
        helium = game.resources.helium.owned;
    } else if (game.resources.helium.owned > helium) {
        date = Date.now();
        oldHelium = helium;
        helium = game.resources.helium.owned;
        rate = (helium - oldHelium)/((date - heliumHistory[heliumHistory.length - 1].date)/(1000*60*60));
        totalTime = (date - heliumHistory[0].date)/(1000*60*60);
        totalHelium = helium - heliumHistory[0].totalHelium;
        cumulativeRate = totalHelium / totalTime;
        heliumHistory.push({
            totalHelium: helium,
            date: date,
            heliumPerHourInZone: rate,
            totalHours: totalTime,
            totalHeliumPerHour: cumulativeRate,
            zone: game.global.world
        });
    }
}


/**
 * @return {boolean}
 */
function CheckPortal() {
    "use strict";
    var map;
    var theMap;
    var itemsAvailable;
    if (game.global.world >= trimpzSettings["portalAt"].value - 2 && portalObtained === false)
    {
        for (map in game.global.mapsOwnedArray){
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.name !== "Dimension of Anger"){
                continue;
            }
            itemsAvailable = addSpecials(true,true,theMap);
            if (itemsAvailable > 0) {
                portalObtained = true;
                RunMap(theMap);
            }
        }
    }
    if (game.global.world >= trimpzSettings["portalAt"].value && game.global.challengeActive !== "Electricity") {
        heliumLog.push(heliumHistory);
        document.getElementById("portalBtn").click();

        switch(trimpzSettings["challenge"].selected){
            case "Electricity":
                document.getElementById("challengeElectricity").click();
                break;
            case "Crushed":
                document.getElementById("challengeCrushed").click();
                break;
            case "Nom":
                document.getElementById("challengeNom").click();
                break;
            case "Toxicity":
                document.getElementById("challengeToxicity").click();
                break;
            default:
                break;
        }
        document.getElementById("activatePortalBtn").click();
        document.getElementsByClassName("activatePortalBtn")[0].click();
        return true;
    }
    return false;
}

function CheckFormation() {
    "use strict";
    if (game.global.world < 70 || formationDone === true)
    {
        return;
    }
    if (document.getElementById("formation2").style.display === "block")
    {
        document.getElementById("formation2").click();
        formationDone = true;
    }
}

function FireGeneticists() {
    "use strict";
    if (game.jobs.Geneticist.locked !== 0 ||
        game.global.challengeActive === "Electricity" ||
        game.jobs.Geneticist.owned === 0) {
        return;
    }
    var targetBreedTime = trimpzSettings["targetBreedTime"].value;
    var targetBreedTimeHysteresis = trimpzSettings["targetBreedTimeHysteresis"].value;
    var jobButton = document.getElementById("Geneticist");
    while(getTotalTimeForBreeding(0) >= targetBreedTime + targetBreedTimeHysteresis ||
          getRemainingTimeForBreeding() >= targetBreedTime + targetBreedTimeHysteresis) {
        game.global.firing = true;
        game.global.buyAmt = 1;
        jobButton.click();
        game.global.firing = false;
    }
}
function MaxToxicStacks() {
    "use strict";
    if (game.global.mapsActive === true && game.global.preMapsActive === false){ //no map ability(wait one) or already running a map(repeat should be off)
        return;
    }
    if(trimpzSettings["shouldMaxOutToxicityHelium"].value && game.global.challengeActive === 'Toxicity' && game.global.lastClearedCell > 95 && game.challenges.Toxicity.stacks < 1500 && game.global.world >= trimpzSettings["zoneToStartMaxingAt"].value) {
        var mapLevel = getLevelOfOneShotMap();
        var theMap;
        for (var map in game.global.mapsOwnedArray) {
            theMap = game.global.mapsOwnedArray[map];
            if (theMap.level === mapLevel && theMap.loot >= 1.40){
                RunMap(theMap);
                return;
            }
        }
        RunNewMapForLoot(mapLevel);
    }
}

function TurnOffIncompatibleSettings() {
    if (game.global.repeatMap)
        repeatClicked();
    if (game.options.menu.confirmhole.enabled)
        toggleSetting("confirmhole");
    if (game.global.autoUpgrades)
        toggleAutoUpgrades();
}

//Start
(function () {
    "use strict";
    CreateButtonForPausing();
    initializeUiAndSettings();
    var i;
    for(i = 0; i < constantsSets.length; ++i){
        if (game.global.world >= constantsSets[i].getZoneToStartAt()) {
            constants = constantsSets[i];
            constantsIndex = i;
        }
    }
    setTimeout(MainLoopRunner, 100);
})();

function MainLoopRunner(){
    "use strict";
    if (trimpzSettings["portalAt"] !== undefined)
        MainLoop();
    setTimeout(MainLoopRunner, constants.getRunInterval());
}

function MainLoop(){
    "use strict";
    if (pauseTrimpz === true){
        return;
    }
    ShowRunningIndicator();
    TurnOffIncompatibleSettings();
    CheckLateGame();
    CheckHelium();
    CheckFormation();
    if (CheckPortal() === true){
        return;
    }
    TurnOnAutoBuildTraps();
    AssignFreeWorkers();
    FireGeneticists();
    Fight();
    UpgradeStorage();
    MaxToxicStacks();
    var shouldReturn = BeginPriorityAction();
    if (shouldReturn === true) {
        tooltip('hide');
        return;
    }
    var collectingForUpgrade = UpgradeAndGather();
    if (collectingForUpgrade === false) { //allow resources to accumulate for upgrades if true
        BuyBuildings();
        BuyShield();
        BuyMetalEquipment();
    }
    RunMaps();
}

function CreateButtonForPausing() {
    "use strict";
    var addElementsHere = document.getElementById("battleBtnsColumn");
    var newDiv = document.createElement("DIV");
    newDiv.className = "battleSideBtnContainer";
    addElementsHere.appendChild(newDiv);

    var newSpan = document.createElement("SPAN");
    newSpan.className = "btn btn-primary fightBtn";
    pauseTrimpz = false;
    newSpan.innerHTML = "Running";
    newSpan.onclick = function () {
        pauseTrimpz = ! pauseTrimpz;
        if (pauseTrimpz === true){
            newSpan.innerHTML = "Paused";
        } else{
            newSpan.innerHTML = "Running";
        }
    };
    newDiv.appendChild(newSpan);
    return newSpan;
}
