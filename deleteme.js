/*global game,tooltip,resolvePow*/
var openTrapsForDefault;    //Open traps as default action?
var trimpz = 0;             //"Trimpz" running indicator
var autoFighting = false;   //Autofight on?
var constants = (function () {
    "use strict";
    var runInterval = 1500,
        minerMultiplier = 2,
        trainerCostRatio = 0.2,
        explorerCostRatio = 0.2,
        minFoodOwned = 15,
        minWoodOwned = 15,
        minTrimpsOwned = 10,
        minScienceOwned = 10,
        housingCostRatio = 0.3,
        gymCostRatio = 0.2,
        maxGyms = 10000,
        tributeCostRatio = 0.5,
        nurseryCostRatio = 0.5,
        maxLevel = 15,
        equipmentCostRatio = 0.5,
        numTrapsForAutoTrapping = 10000;
    return {
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
        getNumTrapsForAutoTrapping: function () {return numTrapsForAutoTrapping;}
    };
})();

function AssignFreeWorkers() {
    "use strict";
    var trimps = game.resources.trimps;
    if (trimps.owned === 0) {
        return;
    }
    if (game.global.firing){
        return;
    }
    var free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);
    while (free > 0 && Math.floor(game.resources.trimps.owned) > game.resources.trimps.employed) {
        trimps = game.resources.trimps;
        free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);
        if (free === 0) {
            break;
        }
        if (game.jobs.Trainer.locked === 0 &&
            CanBuyNonUpgrade(game.jobs.Trainer, constants.getTrainerCostRatio()) === true){
            document.getElementById("Trainer").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Explorer.locked === 0 &&
            CanBuyNonUpgrade(game.jobs.Explorer, constants.getExplorerCostRatio()) === true){
            document.getElementById("Explorer").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Scientist.locked === 0 && game.jobs.Scientist.owned < game.global.world + 1 &&
            CanBuyNonUpgrade(game.jobs.Scientist, 1) === true) {
            document.getElementById("Scientist").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Miner.locked === 0 && game.jobs.Miner.owned < game.jobs.Farmer.owned * constants.getMinerMultiplier() &&
            CanBuyNonUpgrade(game.jobs.Miner, 1) === true) {
            document.getElementById("Miner").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Lumberjack.locked === 0 && game.jobs.Lumberjack.owned < game.jobs.Farmer.owned &&
            CanBuyNonUpgrade(game.jobs.Lumberjack, 1) === true){
            document.getElementById("Lumberjack").click();
            tooltip('hide');
            continue;
        }
        if (CanBuyNonUpgrade(game.jobs.Farmer, 1) === true){
            document.getElementById("Farmer").click();
            tooltip('hide');
            continue;
        }
        return; //Can't afford anything!
    }
}
function Fight() {
    "use strict";
    if (autoFighting === true && game.resources.trimps.owned > 25) { //>25 should reset autofighting on portal
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
        if (game.buildings.Barn.locked == 0) {
            document.getElementById("Barn").click();
        }
    }
    if (game.resources.wood.owned > game.buildings.Shed.cost.wood()) {
        if (game.buildings.Shed.locked == 0) {
            document.getElementById("Shed").click();
        }
    }
    if (game.resources.metal.owned > game.buildings.Forge.cost.metal()) {
        if (game.buildings.Forge.locked == 0) {
            document.getElementById("Forge").click();
        }
    }
}
function ClickAllNonEquipmentUpgrades() {
    "use strict";
    for (var upgrade in game.upgrades) {
        if (upgrade === "Coordination" && game.resources.trimps.realMax() < game.resources.trimps.maxSoldiers * 3) {
            continue;
        }
        if (typeof game.upgrades[upgrade].prestiges === 'undefined' && game.upgrades[upgrade].locked === 0) {
            document.getElementById(upgrade).click();  //Upgrade!
        }
    }
    tooltip('hide');
}
/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function UpgradeNonEquipment() {
    "use strict";
    ClickAllNonEquipmentUpgrades();
    for (var upgrade in game.upgrades) {
        if (typeof game.upgrades[upgrade].prestiges === 'undefined' && game.upgrades[upgrade].locked === 0) {
            if (upgrade === "Coordination" && game.resources.trimps.realMax() < game.resources.trimps.maxSoldiers * 3){
                continue;
            }
            for (var aResource in game.upgrades[upgrade].cost.resources) {
                var needed = game.upgrades[upgrade].cost.resources[aResource];
                if (typeof needed[1] !== 'undefined') {
                    needed = resolvePow(needed, game.upgrades[upgrade]);
                }
                if (aResource === "food" && needed > game.resources.food.owned) {
                    document.getElementById("foodCollectBtn").click();
                    return true;
                }
                if (aResource === "metal" && needed > game.resources.metal.owned) {
                    document.getElementById("metalCollectBtn").click();
                    return true;
                }
                if (aResource === "science" && needed > game.resources.science.owned) {
                    document.getElementById("scienceCollectBtn").click();
                    return true;
                }
                if (aResource === "wood" && needed > game.resources.wood.owned) {
                    document.getElementById("woodCollectBtn").click();
                    return true;
                }
            }
            document.getElementById(upgrade).click();  //Upgrade!
        }
    }
    return false;
}
/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function BeginDefaultManualActionAndUpgrade(trappingSpan) {
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
/**
 * @return {boolean} return.canAfford affordable respecting the ratio?
 */
function CanBuyNonUpgrade(nonUpgradeItem, ratio) {
    for (var aResource in nonUpgradeItem.cost) {
        var needed = nonUpgradeItem.cost[aResource];
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
    tooltip('hide');
}

function TurnOnAutoBuildTraps() {
    if (document.getElementById("autoTrapBtn").getAttribute("style") !== "display: none" &&
        document.getElementById("autoTrapBtn").innerHTML === "Traps Off") {
        document.getElementById("autoTrapBtn").click();
    }
}

function BuyEquipment() {
    "use strict";
    //Find lowest level
    var lowestLevel = 1000;
    for (var anEquipment in game.equipment) {
        if (game.equipment[anEquipment].locked === 1) {
            continue;
        }
        if (anEquipment === "Shield") {
            if (CanBuyNonUpgrade(game.equipment[anEquipment], 1) === true &&
                game.equipment[anEquipment].level < constants.getMaxLevel()) { //Buy immediately(1 ratio)
                document.getElementById(anEquipment).click();
            }
        } else if (game.equipment[anEquipment].level < lowestLevel) {
            lowestLevel = game.equipment[anEquipment].level;
        }
    }
    if (lowestLevel >= constants.getMaxLevel()) {   //Done upgrading levels?
        return;
    }
    //Buy lowest level equipment
    for (anEquipment in game.equipment){
        if (game.equipment[anEquipment].locked === 1 ||
            anEquipment === "Shield"
            || game.equipment[anEquipment].level > lowestLevel){
            continue;
        }
        if (CanBuyNonUpgrade(game.equipment[anEquipment], constants.getEquipmentCostRatio()) === true) {
            document.getElementById(anEquipment).click();
        }
    }
}

function BuyEquipmentUpgrades() {
    var canBuyUpgrade;
    var costOfNextLevel;
    for (var upgrade in game.upgrades) {
        if (typeof game.upgrades[upgrade].prestiges !== 'undefined' && game.upgrades[upgrade].locked === 0) {
            canBuyUpgrade = true;
            for (var aResource in game.upgrades[upgrade].cost.resources) {
                if (aResource === "metal" || aResource === "wood"){
                    continue;
                }
                var needed = game.upgrades[upgrade].cost.resources[aResource];
                if (typeof needed[1] !== 'undefined') {
                    needed = resolvePow(needed, game.upgrades[upgrade]);
                }
                if (needed > game.resources[aResource].owned) {
                    canBuyUpgrade = false;
                }
            }
            if (canBuyUpgrade === false)
                continue;
            costOfNextLevel = Math.ceil(getNextPrestigeCost(upgrade) * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
            if (upgrade === "Supershield"){
                var costOfTwoLevels = costOfNextLevel * (1 + game.equipment.Shield.cost.wood[1]);
                if (game.resources.wood.owned < costOfTwoLevels){
                    continue;
                }
            } else{
                if (game.resources.metal.owned < costOfNextLevel){
                    continue;
                }
            }
            document.getElementById(upgrade).click();  //Upgrade!
            document.getElementById(game.upgrades[upgrade].prestiges).click();  //Buy a level!
            if (upgrade === "Supershield") {
                document.getElementById(game.upgrades[upgrade].prestiges).click();  //Buy another!
            }
        }
    }
}

function GotoMapsScreen() {
    if (game.global.preMapsActive === true) {
        return;
    }
    document.getElementById("mapsBtn").click();  //mapsClicked();
    if (document.getElementById("mapsBtn").innerHTML === "Abandon Soldiers"){
        document.getElementById("mapsBtn").click();
    }
}

function RunNewMap() {
    var newMap;
    GotoMapsScreen();
    var size = 9;

    adjustMap('difficulty', 9);
    adjustMap('size', size);
    var cost = updateMapCost(true);
    while (cost > game.resources.fragments.owned){
        size--;
        if (size === 0){
            return;         //need more fragments!
        }
        adjustMap('size', size);
        cost = updateMapCost(true);
    }
    document.getElementById("mapCreateBtn").click();
    newMap = game.global.mapsOwnedArray[game.global.mapsOwnedArray.length - 1];
    RunMap(newMap);
}

function RunMap(map) {
    GotoMapsScreen();
    document.getElementById(map.id).click();
    document.getElementById("selectMapBtn").click();
}

function RunWorld() {
    document.getElementById("mapsBtn").click();  //mapsClicked();
}

function RunMaps() {
    if (game.global.world < 7 || game.global.mapsActive === true){ //no map ability(wait one) or already running a map(repeat should be off)
        return;
    }
    var itemsAvailableInNewMap = addSpecials(true,true,{ id: "map999", name: "My Map", location: "Sea", clears: 0, level: game.global.world, difficulty: 1.11, size: 40, loot: 1.2, noRecycle: false })
    for (var map in game.global.mapsOwnedArray){
        var itemsAvailable = addSpecials(true,true,game.global.mapsOwnedArray[map]);
        if (itemsAvailable >= itemsAvailableInNewMap) {
            RunMap(game.global.mapsOwnedArray[map]);
            return;
        }
    }
    if (itemsAvailableInNewMap > 0){
        RunNewMap();
    }
    if (game.global.preMapsActive === true){
        RunWorld();
    }
}

//Main
(function () {
    "use strict";
    var trappingSpan = CreateButtonForTrapping();
    setInterval(function () {
        //Main loop code
        ShowRunningIndicator();
        TurnOnAutoBuildTraps();
        AssignFreeWorkers();
        Fight();
        UpgradeStorage();
        var shouldReturn = BeginPriorityAction();
        if (shouldReturn === true) {
            tooltip('hide');
            return;
        }
        var collectingForUpgrade = BeginDefaultManualActionAndUpgrade(trappingSpan);
        if (collectingForUpgrade === false) { //allow resources to accumulate for upgrades if true
            BuyBuildings();
            BuyEquipmentUpgrades();
            BuyEquipment();
        }
        RunMaps();
        //End Main loop code
    }, constants.getRunInterval());
})();

function CreateButtonForTrapping() {
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
