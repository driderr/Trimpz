/*global game,tooltip,resolvePow,getNextPrestigeCost,adjustMap,updateMapCost,addSpecials*/
/*jslint plusplus: true */
var openTrapsForDefault;    //Open traps as default action?
var trimpz = 0;             //"Trimpz" running indicator
var autoFighting = false;   //Autofight on?
var workersFocused = false;
var workersFocusedOn;
var workersMoved = [];
var constantsEarlyGame = (function () {
    "use strict";
    var zoneToStartAt = 0,
        runInterval = 1500,
        minerMultiplier = 2,
        trainerCostRatio = 0.2,
        explorerCostRatio = 0.2,
        minFoodOwned = 15,
        minWoodOwned = 15,
        minTrimpsOwned = 10,
        minScienceOwned = 10,
        housingCostRatio = 0.3,
        gymCostRatio = 0.6,
        maxGyms = 10000,
        tributeCostRatio = 0.5,
        nurseryCostRatio = 0.5,
        maxLevel = 15,
        equipmentCostRatio = 0.5,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 1,
        lumberjackMultiplier = 1,
        maxWormholes = 7,
        shouldSkipHpEquipment = false,
        minimumWarpStations = 10,
        minimumEquipmentLevel = 5,
        shouldRunMaps = true;
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
        getMinimumWarpStations: function () {return minimumWarpStations;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;},
        getShouldRunMaps: function () {return shouldRunMaps;}
    };
})();
var constantsLateGame = (function () {
    "use strict";
    var zoneToStartAt = 45,
        runInterval = 1500,
        minerMultiplier = 2,
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
        maxLevel = 15,
        equipmentCostRatio = 0.8,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 0.05,
        lumberjackMultiplier = 6,
        maxWormholes = 7,
        shouldSkipHpEquipment = false,
        minimumWarpStations = 10,
        minimumEquipmentLevel = 5,
        shouldRunMaps = true;
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
        getMinimumWarpStations: function () {return minimumWarpStations;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;},
        getShouldRunMaps: function () {return shouldRunMaps;}
    };
})();
var constantsLateLateGame = (function () {
    "use strict";
    var zoneToStartAt = 55,
        runInterval = 1500,
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
        maxLevel = 15,
        equipmentCostRatio = 0.5,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 0.01,
        lumberjackMultiplier = 3,
        maxWormholes = 7,
        shouldSkipHpEquipment = true,
        minimumWarpStations = 10,
        minimumEquipmentLevel = 5,
        shouldRunMaps = false;
    return {
        getZoneToStartAt: function () { //don't start until enough block since last constants should be getting gyms
            if (game.global.soldierCurrentBlock > 750 * 1000000000000000) { //need about 750Qa to beat 59 boss
                return zoneToStartAt; //enough block, begin!
            } else {
                return constantsEndGame.getZoneToStartAt(); //not enough block, but need to start next constants if too late
            }
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
        getMinimumWarpStations: function () {return minimumWarpStations;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;},
        getShouldRunMaps: function () {return shouldRunMaps;}
    };
})();
var constantsEndGame = (function () {
    "use strict";
    var zoneToStartAt = 60,
        runInterval = 1500,
        minerMultiplier = 2,
        trainerCostRatio = 0.1,
        explorerCostRatio = 0.1,
        minFoodOwned = 15,
        minWoodOwned = 15,
        minTrimpsOwned = 10,
        minScienceOwned = 10,
        housingCostRatio = 0.01,
        gymCostRatio = 0.6,
        maxGyms = 10000,
        tributeCostRatio = 0.7,
        nurseryCostRatio = 0.20,
        maxLevel = 15,
        equipmentCostRatio = 0.5,
        otherWorkersFocusRatio = 0.5,
        numTrapsForAutoTrapping = 10000,
        shieldCostRatio = 0.01,
        lumberjackMultiplier = 1,
        maxWormholes = 7,
        shouldSkipHpEquipment = false,
        minimumWarpStations = 5,
        minimumEquipmentLevel = 5,
        shouldRunMaps = true;
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
        getMinimumWarpStations: function () {return minimumWarpStations;},
        getMinimumEquipmentLevel: function () {return minimumEquipmentLevel;},
        getShouldRunMaps: function () {return shouldRunMaps;}
    };
})();
var constantsSets = [constantsEarlyGame, constantsLateGame, constantsLateLateGame, constantsEndGame];
var constantsIndex;
var constants;

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
        }
        if (game.resources[aResource].owned * ratio < needed) {
            return false;
        }
    }
    return true;
}

function GetEquipmentPrice(nonUpgradeItem) {
    "use strict";
    var aResource;
    var needed;
    //noinspection LoopStatementThatDoesntLoopJS
    for (aResource in nonUpgradeItem.cost) {
        needed = nonUpgradeItem.cost[aResource];
        if (typeof needed[1] !== 'undefined') {
            needed = resolvePow(needed, nonUpgradeItem);
        }
        needed = Math.ceil(needed * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
        return needed;
    }
}

function AssignFreeWorkers() {
    "use strict";
    var trimpsAssigned = 0;
    var trimps = game.resources.trimps;
    if (trimps.owned === 0) {
        return;
    }
    if (game.global.firing){
        return;
    }
    var free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);
    if (free > 0){
        document.getElementById("tab1").click();    //hire 1 at a time
    }
    while (free > 0 && Math.floor(game.resources.trimps.owned) > game.resources.trimps.employed && trimpsAssigned < 1000) {
        trimps = game.resources.trimps;
        free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);
        if (free === 0) {
            break;
        }
        if (game.jobs.Trainer.locked === 0 &&
            CanBuyNonUpgrade(game.jobs.Trainer, constants.getTrainerCostRatio()) === true){
            document.getElementById("Trainer").click();
        } else if (game.jobs.Explorer.locked === 0 &&
            CanBuyNonUpgrade(game.jobs.Explorer, constants.getExplorerCostRatio()) === true){
            document.getElementById("Explorer").click();
        } else if (game.jobs.Scientist.locked === 0 && game.jobs.Scientist.owned < game.global.world + 1 &&
            CanBuyNonUpgrade(game.jobs.Scientist, 1) === true) {
            document.getElementById("Scientist").click();
        } else if (game.jobs.Miner.locked === 0 && game.jobs.Miner.owned < game.jobs.Farmer.owned * constants.getMinerMultiplier() &&
            CanBuyNonUpgrade(game.jobs.Miner, 1) === true) {
            document.getElementById("Miner").click();
        } else if (game.jobs.Lumberjack.locked === 0 && game.jobs.Lumberjack.owned < game.jobs.Farmer.owned * constants.getLumberjackMultiplier() &&
            CanBuyNonUpgrade(game.jobs.Lumberjack, 1) === true){
            document.getElementById("Lumberjack").click();
        } else if (CanBuyNonUpgrade(game.jobs.Farmer, 1) === true){
            document.getElementById("Farmer").click();
        } else {
            return; //Can't afford anything!
        }
        trimpsAssigned++;
    }
    tooltip('hide');
}
function Fight() {
    "use strict";
    if (autoFighting === true && game.resources.trimps.owned > 25) { //>25 should reset autoFighting on portal
        return;
    }
    autoFighting = false;
    var pauseFightButton = document.getElementById("pauseFight");
    if (pauseFightButton.offsetHeight > 0) {
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
function UpgradeStorage() {
    "use strict";
    if (game.resources.food.owned > game.buildings.Barn.cost.food()) {
        if (game.buildings.Barn.locked === 0) {
            document.getElementById("Barn").click();
        }
    }
    if (game.resources.wood.owned > game.buildings.Shed.cost.wood()) {
        if (game.buildings.Shed.locked === 0) {
            document.getElementById("Shed").click();
        }
    }
    if (game.resources.metal.owned > game.buildings.Forge.cost.metal()) {
        if (game.buildings.Forge.locked === 0) {
            document.getElementById("Forge").click();
        }
    }
}
function ClickAllNonEquipmentUpgrades() {
    "use strict";
    var upgrade;
    for (upgrade in game.upgrades) {
        if (upgrade === "Gigastation" && game.buildings.Warpstation.owned < constants.getMinimumWarpStations()){
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
            if (upgrade === "Gigastation" && game.buildings.Warpstation.owned < constants.getMinimumWarpStations()){
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
/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function UpgradeAndGather(trappingSpan) {
    "use strict";
    var collectingForNonEquipment = UpgradeNonEquipment();
    if (openTrapsForDefault === true && game.buildings.Trap.owned < 10){ //traps exhausted, turn off "Trapping"
        trappingSpan.innerHTML = "Building";
        openTrapsForDefault = false;
    }
    if (openTrapsForDefault === false && game.buildings.Trap.owned > constants.getNumTrapsForAutoTrapping()){ //traps overflowing, use them
        trappingSpan.innerHTML = "Trapping";
        openTrapsForDefault = true;
    }
    if (collectingForNonEquipment === false) {
        //Collect trimps if breeding speed is low
        if ((game.resources.trimps.owned < game.resources.trimps.realMax() &&
            document.getElementById("trimpsPs").innerHTML.match(/\d+/)[0] < 1) ||
            openTrapsForDefault === true) {
            document.getElementById("trimpsCollectBtn").click();
        } else if (game.global.buildingsQueue.length > 0) {
            document.getElementById("buildingsCollectBtn").click();
        } else { //nothing to build
            document.getElementById("metalCollectBtn").click();
        }
        tooltip('hide');
    }
    return collectingForNonEquipment;
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

function BuyBuildings() {
    "use strict";
    if (game.buildings.Gym.locked === 0 && game.buildings.Gym.owned < constants.getMaxGyms() &&
        CanBuyNonUpgrade(game.buildings.Gym, constants.getGymCostRatio()) === true) {
        document.getElementById("Gym").click();
    }
    if (game.buildings.Nursery.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Nursery, constants.getNurseryCostRatio()) === true) {
        document.getElementById("Nursery").click();
    }
    if (game.buildings.Tribute.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Tribute, constants.getTributeCostRatio()) === true) {
        document.getElementById("Tribute").click();
    }
    if (game.buildings.Hut.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Hut, constants.getHousingCostRatio()) === true) {
        document.getElementById("Hut").click();
    }
    if (game.buildings.House.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.House, constants.getHousingCostRatio()) === true) {
        document.getElementById("House").click();
    }
    if (game.buildings.Mansion.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Mansion, constants.getHousingCostRatio()) === true) {
        document.getElementById("Mansion").click();
    }
    if (game.buildings.Hotel.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Hotel, constants.getHousingCostRatio()) === true) {
        document.getElementById("Hotel").click();
    }
    if (game.buildings.Resort.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Resort, constants.getHousingCostRatio()) === true) {
        document.getElementById("Resort").click();
    }
    if (game.buildings.Gateway.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Gateway, 1) === true) { //Buy immediately(1 ratio)
        document.getElementById("Gateway").click();
    }
    if (game.buildings.Wormhole.locked === 0 && game.buildings.Wormhole.owned < constants.getMaxWormholes() &&
        CanBuyNonUpgrade(game.buildings.Wormhole, 1) === true) { //Buy immediately(1 ratio)
        document.getElementById("Wormhole").click();
    }
    if (game.buildings.Collector.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Collector, 1) === true) { //Buy immediately(1 ratio)
        document.getElementById("Collector").click();
    }
    if (game.buildings.Warpstation.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Warpstation, 1) === true) { //Buy immediately(1 ratio)
        document.getElementById("Warpstation").click();
    }
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
function BuyMetalEquipment() {  //ignoring max level, ignoring min level, buying cheap stuff
    "use strict";
    var DebugHpToAtkRatio = [];
    var anEquipment;
    var bestEquipGainPerMetal = 0;
    var bestEquipment;
    var bestEquipmentCost;
    var gainPerMetal;
    var cost;
    var currentEquip;
    var multiplier;
    for (anEquipment in game.equipment) {
        currentEquip = game.equipment[anEquipment];
        if (currentEquip.locked === 1 || anEquipment === "Shield" || constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined') {
            continue;
        }
        cost = GetEquipmentPrice(currentEquip);
        multiplier = currentEquip.healthCalculated ? 1/8 : 1;
        gainPerMetal = (currentEquip.healthCalculated || currentEquip.attackCalculated) * multiplier / cost;
        DebugHpToAtkRatio.push([anEquipment, gainPerMetal * 1000000]);
        if (gainPerMetal > bestEquipGainPerMetal) {
            bestEquipGainPerMetal = gainPerMetal;
            bestEquipment = anEquipment;
            bestEquipmentCost = cost;
        }
    }

    var upgrade;
    var currentUpgrade;
    var bestUpgradeGainPerMetal = 0;
    var bestUpgrade;
    var bestUpgradeCost;
    var bestUpgradesEquipment;
    var stat;
    var gain;
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        currentEquip = game.equipment[game.upgrades[upgrade].prestiges];
        if (typeof currentUpgrade.prestiges !== 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined'){ //don't buy hp equips in late late game
                continue;
            }
            cost = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
            multiplier = currentEquip.healthCalculated ? 1/8 : 1;
            stat = (typeof currentEquip.health !== 'undefined') ? "health" : "attack";
            gain = Math.round(currentEquip[stat] * Math.pow(1.19, ((currentEquip.prestige) * game.global.prestige[stat]) + 1));
            gainPerMetal = gain * multiplier / cost;
            DebugHpToAtkRatio.push([upgrade, gainPerMetal * 1000000]);
            if (gainPerMetal > bestUpgradeGainPerMetal) {
                bestUpgradeGainPerMetal = gainPerMetal;
                bestUpgrade = upgrade;
                bestUpgradeCost = cost;
                bestUpgradesEquipment = currentEquip;
            }
        }
    }
    if (bestEquipGainPerMetal === 0 && bestUpgradeGainPerMetal === 0)   //nothing to buy
        return;
    var boughtSomething = false;
    if (bestEquipGainPerMetal > bestUpgradeGainPerMetal){
        if (CanBuyNonUpgrade(game.equipment[bestEquipment], constants.getEquipmentCostRatio()) === true) {
            document.getElementById(bestEquipment).click();
            console.debug("Best buy " + bestEquipment);
            boughtSomething = true;
        }
    } else {
        if (CanAffordEquipmentUpgrade(upgrade) === true && CanBuyNonUpgrade(bestUpgradesEquipment, constants.getEquipmentCostRatio()) === true) {
            document.getElementById(bestUpgrade).click();
            console.debug("Best buy " + bestUpgrade);
            boughtSomething = true;
        }
    }
    for (anEquipment in game.equipment) {
        currentEquip = game.equipment[anEquipment];
        if (currentEquip.locked === 1 || anEquipment === "Shield" || constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined') {
            continue;
        }
        if (CanBuyNonUpgrade(game.equipment[anEquipment], 0.1) === true) {
            document.getElementById(anEquipment).click();
            console.debug("Low cost buy for " + anEquipment);
        }
    }
    for (upgrade in game.upgrades) {
        currentUpgrade = game.upgrades[upgrade];
        if (typeof currentUpgrade.prestiges !== 'undefined' && currentUpgrade.locked === 0 && upgrade !== "Supershield") {
            if (constants.getShouldSkipHpEquipment() === true && typeof currentEquip.health !== 'undefined') { //don't buy hp equips in late late game
                continue;
            }
            cost = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
            if (CanAffordEquipmentUpgrade(upgrade) === true && cost < game.resources.metal.owned * 0.1) {
                document.getElementById(upgrade).click();
                console.debug("Low cost buy for " + upgrade);
            }
        }
    }
    var entry;
    if (boughtSomething === true){
        for (entry in DebugHpToAtkRatio){
            console.debug(DebugHpToAtkRatio[entry][0] + ":" + DebugHpToAtkRatio[entry][1]);
        }
    }
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

function GotoMapsScreen() {
    "use strict";
    if (game.global.preMapsActive === true) {
        return;
    }
    document.getElementById("mapsBtn").click();  //mapsClicked();
    if (document.getElementById("mapsBtn").innerHTML === "Abandon Soldiers"){
        document.getElementById("mapsBtn").click();
    }
}

function RunNewMap() {
    "use strict";
    var newMap;
    GotoMapsScreen();
    var size = 9;
    var difficulty = 9;

    document.getElementById("difficultyAdvMapsRange").value = difficulty;
    adjustMap('difficulty', difficulty);
    document.getElementById("sizeAdvMapsRange").value = size;
    adjustMap('size', size);
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

function RunMap(map) {
    "use strict";
    GotoMapsScreen();
    document.getElementById(map.id).click();
    document.getElementById("selectMapBtn").click();
}

function RunWorld() {
    "use strict";
    document.getElementById("mapsBtn").click();  //mapsClicked();
}

function RunMaps() {
    "use strict";
    var map;
    var itemsAvailable;
    if (game.global.world < 7 || game.global.mapsActive === true){ //no map ability(wait one) or already running a map(repeat should be off)
        return;
    }
    var itemsAvailableInNewMap = addSpecials(true,true,{ id: "map999", name: "My Map", location: "Sea", clears: 0, level: game.global.world, difficulty: 1.11, size: 40, loot: 1.2, noRecycle: false });
    for (map in game.global.mapsOwnedArray){
        itemsAvailable = addSpecials(true,true,game.global.mapsOwnedArray[map]);
        if (itemsAvailable >= itemsAvailableInNewMap && itemsAvailable > 0) {
            RunMap(game.global.mapsOwnedArray[map]);
            return;
        }
    }
    if (itemsAvailableInNewMap > 0 && constants.getShouldRunMaps() === true){
        RunNewMap();
        return;
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
    if (game.resources.trimps.owned < 1000) {
        constants = constantsSets[0];
        constantsIndex = 0;
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
        ReallocateWorkers();
    }
}

//Main
(function () {
    "use strict";
    var trappingSpan = CreateButtonForTrapping();
    var i;
    for(i = 0; i < constantsSets.length; ++i){
        if (game.global.world >= constantsSets[i].getZoneToStartAt()) {
            constants = constantsSets[i];
            constantsIndex = i;
        }
    }
    setInterval(function () {
        //Main loop code
        ShowRunningIndicator();
        CheckLateGame();
        TurnOnAutoBuildTraps();
        AssignFreeWorkers();
        Fight();
        UpgradeStorage();
        var shouldReturn = BeginPriorityAction();
        if (shouldReturn === true) {
            tooltip('hide');
            return;
        }
        var collectingForUpgrade = UpgradeAndGather(trappingSpan);
        if (collectingForUpgrade === false) { //allow resources to accumulate for upgrades if true
            BuyBuildings();
            BuyShield();
            BuyMetalEquipment();
        }
        RunMaps();
        //End Main loop code
    }, constants.getRunInterval());
})();

function CreateButtonForTrapping() {
    "use strict";
    var addElementsHere = document.getElementById("battleBtnsColumn");
    var newDiv = document.createElement("DIV");
    newDiv.className = "battleSideBtnContainer";
    addElementsHere.appendChild(newDiv);

    var newSpan = document.createElement("SPAN");
    newSpan.className = "btn btn-primary fightBtn";
    openTrapsForDefault = false;
    newSpan.innerHTML = "Building";
    newSpan.onclick = function () {
        openTrapsForDefault = ! openTrapsForDefault;
        if (openTrapsForDefault === true){
            newSpan.innerHTML = "Trapping";
        } else{
            newSpan.innerHTML = "Building";
        }
    };
    newDiv.appendChild(newSpan);
    return newSpan;
}
