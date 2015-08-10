/*global game,tooltip,resolvePow*/
function AssignFreeWorkers($) {
    "use strict";
    var constants = (function () {
        var minerMultiplier = 2,
            trainerCostRatio = 0.2,
            explorerCostRatio = 0.2;
        return {
            getTrainerCostRatio: function () { return trainerCostRatio; },
            getMinerMultiplier: function () { return minerMultiplier; },
            getExplorerCostRatio: function () { return explorerCostRatio; }
        };
    })();
    var trimps = game.resources.trimps;
    if (trimps.owned === 0) {
        return;
    }
    var free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);
    while (free > 0) {
        trimps = game.resources.trimps;
        free = (Math.ceil(trimps.realMax() / 2) - trimps.employed);
        if (free === 0) {
            break;
        }
        if (game.jobs.Trainer.locked === 0 &&
            CanBuyNonUpgrade(game.jobs.Trainer, constants.getTrainerCostRatio()) === true){
            $("#Trainer").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Explorer.locked === 0 &&
            CanBuyNonUpgrade(game.jobs.Explorer, constants.getExplorerCostRatio()) === true){
            $("#Explorer").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Scientist.locked === 0 && game.jobs.Scientist.owned < game.global.world + 1) {
            $("#Scientist").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Miner.locked === 0 && game.jobs.Miner.owned < game.jobs.Farmer.owned * constants.getMinerMultiplier()) {
            $("#Miner").click();
            tooltip('hide');
            continue;
        }
        if (game.jobs.Lumberjack.locked === 0 && game.jobs.Lumberjack.owned < game.jobs.Farmer.owned) {
            $("#Lumberjack").click();
            tooltip('hide');
            continue;
        }
        $("#Farmer").click();
        tooltip('hide');
    }
}
function Fight($) {
    "use strict";
    var pauseFightButton = $("#pauseFight");
    if (pauseFightButton[0].offsetHeight > 0 && document.getElementById("pauseFight").innerHTML !== "AutoFight On") {
        pauseFightButton.click();
    }
    if (pauseFightButton[0].offsetHeight === 0 &&
        $("#battleContainer")[0].style.visibility !== "hidden") {
        $("#fightBtn").click();
    }
}
function ShowRunningIndicator() {
    "use strict";
    if (typeof this.trimpz === "undefined") {
        this.trimpz = 0;
    }
    var rotater = ["|", "/", "-", "\\"][this.trimpz];
    this.trimpz += 1;
    if (this.trimpz > 3) {
        this.trimpz = 0;
    }
    document.getElementById("trimpTitle").innerHTML = "Trimpz " + rotater;
}
function UpgradeStorage($) {
    "use strict";
    if (game.resources.food.owned > game.buildings.Barn.cost.food()) {
        $("#Barn").click();
    }
    if (game.resources.wood.owned > game.buildings.Shed.cost.wood()) {
        $("#Shed").click();
    }
    if (game.resources.metal.owned > game.buildings.Forge.cost.metal()) {
        $("#Forge").click();
    }
}
function ClickAllNonEquipmentUpgrades() {
    for (var name in game.upgrades) {
        if (typeof game.upgrades[name].prestiges === 'undefined' && game.upgrades[name].locked === 0) {
            document.getElementById(name).click();  //Upgrade!
        }
    }
    tooltip('hide');
}
/**
 * @return {boolean} return.collectingForNonEquipment Is it collecting for upgrade?
 */
function UpgradeNonEquipment($) {
    "use strict";
    ClickAllNonEquipmentUpgrades();
    for (var name in game.upgrades) {
        if (typeof game.upgrades[name].prestiges === 'undefined' && game.upgrades[name].locked === 0) {
            for (var aResource in game.upgrades[name].cost.resources) {
                var needed = game.upgrades[name].cost.resources[aResource];
                if (typeof needed[1] !== 'undefined') {
                    needed = resolvePow(needed, game.upgrades[name]);
                }
                if (aResource === "food" && needed > game.resources.food.owned) {
                    $("#foodCollectBtn").click();
                    return true;
                }
                if (aResource === "metal" && needed > game.resources.metal.owned) {
                    $("#metalCollectBtn").click();
                    return true;
                }
                if (aResource === "science" && needed > game.resources.science.owned) {
                    $("#scienceCollectBtn").click();
                    return true;
                }
                if (aResource === "wood" && needed > game.resources.wood.owned) {
                    $("#woodCollectBtn").click();
                    return true;
                }
            }
            document.getElementById(name).click();  //Upgrade!
        }
    }
    return false;
}
function BeginDefaultManualActionAndUpgrade($) {
    "use strict";
    var collectingForNonEquipment = UpgradeNonEquipment($);
    if (collectingForNonEquipment === false) {
        //Collect trimps if breeding speed is low
        if (game.resources.trimps.owned < game.resources.trimps.realMax() &&
            document.getElementById("trimpsPs").innerHTML.match(/\d+/)[0] < 1) {
            $("#trimpsCollectBtn").click();
        } else if (game.global.buildingsQueue.length > 0) {
            $("#buildingsCollectBtn").click();
        } else {
            $("#metalCollectBtn").click();
        }
        tooltip('hide');
    }
}
/**
 * @return {boolean} return.shouldReturn Was priority found (stop further processing)?
 */
function BeginPriorityAction($) {
    "use strict";
    var constants = (function () {
        var minFoodOwned = 15,
            minWoodOwned = 15,
            minTrimpsOwned = 10,
            minScienceOwned = 10;
        return {
            getMinFoodOwned: function () { return minFoodOwned; },
            getMinWoodOwned: function () { return minWoodOwned; },
            getMinTrimpsOwned: function () { return minTrimpsOwned; },
            getMinScienceOwned: function () { return minScienceOwned; }
        };
    })();
    if (game.global.buildingsQueue.length > 0) {//Build queue
        if (document.getElementById("autoTrapBtn").innerHTML !== "Traps On" ||
            game.global.buildingsQueue[0] !== "Trap.1") {
            $("#buildingsCollectBtn").click();
            return true;
        }
    }
    if (game.resources.food.owned < constants.getMinFoodOwned()) {//Collect food
        $("#foodCollectBtn").click();
        return true;
    }
    if (game.resources.wood.owned < constants.getMinWoodOwned()) {//Collect wood
        $("#woodCollectBtn").click();
        return true;
    }
    if (game.buildings.Trap.owned < 1) {//Enqueue trap
        $("#Trap").click();
        $("#buildingsCollectBtn").click();
        return true;
    }
    if (game.resources.trimps.owned < constants.getMinTrimpsOwned() &&
        game.resources.trimps.owned < game.resources.trimps.realMax()/2) {//Open trap
        $("#trimpsCollectBtn").click();
        return true;
    }
    if (game.resources.science.owned < constants.getMinScienceOwned()) {//Collect science
        $("#scienceCollectBtn").click();
        return true;
    }
    return false;
}
/**
 * @return {boolean} return.canAfford affordable respecting the ratio?
 */
function CanBuyNonUpgrade(buildingOrWorker, ratio) {
    for (var aResource in buildingOrWorker.cost) {
        var needed = buildingOrWorker.cost[aResource];
        if (typeof needed[1] !== 'undefined') {
            needed = resolvePow(needed, buildingOrWorker);
        }
        if (game.resources[aResource].owned * ratio < needed) {
            return false;
        }
    }
    return true;
}
function BuyBuildings($) {
    "use strict";
    var constants = (function () {
        var housingCostRatio = 0.3,
            gymCostRatio = 0.2,
            tributeCostRatio = 0.5,
            nurseryCostRatio = 0.5;
        return {
            getGymCostRatio: function () { return gymCostRatio; },
            getHousingCostRatio: function () { return housingCostRatio; },
            getTributeCostRatio: function () { return tributeCostRatio; },
            getNurseryCostRatio: function () { return nurseryCostRatio; }
        };
    })();

    if (game.buildings.Gym.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Gym, constants.getGymCostRatio()) === true) {
        $("#Gym").click();
    }
    if (game.buildings.Nursery.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Nursery, constants.getNurseryCostRatio()) === true) {
        $("#Nursery").click();
    }
    if (game.buildings.Tribute.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Tribute, constants.getTributeCostRatio()) === true) {
        $("#Tribute").click();
    }
    if (game.buildings.Hut.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Hut, constants.getHousingCostRatio()) === true) {
        $("#Hut").click();
    }
    if (game.buildings.House.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.House, constants.getHousingCostRatio()) === true) {
        $("#House").click();
    }
    if (game.buildings.Mansion.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Mansion, constants.getHousingCostRatio()) === true) {
        $("#Mansion").click();
    }
    if (game.buildings.Hotel.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Hotel, constants.getHousingCostRatio()) === true) {
        $("#Hotel").click();
    }
    if (game.buildings.Resort.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Resort, constants.getHousingCostRatio()) === true) {
        $("#Tribute").click();
    }
    if (game.buildings.Gateway.locked === 0 &&
        CanBuyNonUpgrade(game.buildings.Gateway, 1) === true) { //Buy immediately(1 ratio)
        $("#Gateway").click();
    }
    tooltip('hide');
}

function TurnOnAutoFight($) {
    if (document.getElementById("autoTrapBtn").getAttribute("style") !== "display: none" &&
        document.getElementById("autoTrapBtn").innerHTML === "Traps Off") {
        $("#autoTrapBtn").click();
    }
}
function BuyEquipment($) {
    "use strict";
    var constants = (function () {
        var maxLevel = 15;
        return {
            getMaxLevel: function () {
                return maxLevel;
            }
        };
    })();

    //Find lowest level
    var lowestLevel = 1000;
    for (var anEquipment in game.equipment) {
        if (game.equipment[anEquipment].locked === 1) {
            continue;
        }
        if (anEquipment === "Shield") {
            if (CanBuyNonUpgrade(game.equipment[anEquipment], 1) === true) { //Buy immediately(1 ratio)
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
    for (var anEquipment in game.equipment){
        if (game.equipment[anEquipment].locked === 1 ||
            anEquipment === "Shield"
            || game.equipment[anEquipment].level > lowestLevel){
            continue;
        }
        if (CanBuyNonUpgrade(game.equipment[anEquipment], 0.5) === true) {
            document.getElementById(anEquipment).click()
        }
    }
}
(function () {
    "use strict";
    function callback() {
        (function ($) {
            var jQuery = $;
            const runInterval = 1500;
            setInterval(function () {
                //Main code
                ShowRunningIndicator.call(this);
                BuyBuildings($);
                BuyEquipment($);
                TurnOnAutoFight($);
                AssignFreeWorkers($);
                Fight($);
                UpgradeStorage($);
                var shouldReturn = BeginPriorityAction($);
                if (shouldReturn === true) {
                    tooltip('hide');
                    return;
                }
                BeginDefaultManualActionAndUpgrade($);
                //End Main code
            }, runInterval);
        })(jQuery.noConflict(true));
    }

    var s = document.createElement("script");
    s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
    if (s.addEventListener) {
        s.addEventListener("load", callback, false);
    }
    else if (s.readyState) {
        s.onreadystatechange = callback;
    }
    document.body.appendChild(s);
    CreateButtonForTrapping();
})();

function CreateButtonForTrapping() {
    var addElementsHere = document.getElementById("battleBtnsColumn");
    var newDiv = document.createElement("DIV");
    newDiv.className = "battleSideBtnContainer";
    addElementsHere.appendChild(newDiv);

    var newSpan = document.createElement("SPAN");
    newSpan.className = "btn btn-primary fightBtn";
    newSpan.innerHTML = "Button Test";
    newSpan.onclick = function () { // Note this is a function
        alert("blabla");
    };
    newDiv.appendChild(newSpan);
}
