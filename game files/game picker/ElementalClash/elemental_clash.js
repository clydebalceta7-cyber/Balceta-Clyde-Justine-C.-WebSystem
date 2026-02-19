// Game constants
const ELEMENTS = 4;
const elementNames = ["Water", "Air", "Fire", "Earth"];
const usedElements = [false, false, false, false];
const MAX_HEALTH = 400;

const TOTAL_ENEMY_TYPES = 8;
const enemyTypes = [
    "Slime", "Golem", "Phoenix", "Specter",
    "Wraith", "Crystal Bug", "Rock Drake", "Wind Serpent"
];
const enemyWeaknesses = [2, 1, 0, 1, 2, 1, 1, 2];
const enemyBaseHealth = [50, 100, 150, 300, 200, 80, 180, 120];

// Game state
let playerHealth = 100;
let currentEnemy = null;
let currentEncounterCount = 0;
let totalEncounters = 10;
let chestTriggerEncounter = 0;
let enemiesDefeated = 0;
let reviveUsed = false;
let elementGuideShown = false;
let mimicChest = 0;
let scrollSource = ''; // Track where scroll came from (chest or mimic)

function startGame() {
    playerHealth = 100;
    currentEncounterCount = 0;
    enemiesDefeated = 0;
    chestTriggerEncounter = Math.floor(Math.random() * 2) + 3; // Random between 3-4
    reviveUsed = false;
    elementGuideShown = false;
    usedElements.fill(false);
    
    updateHealthBars();
    showScreen('battleScreen');
    nextEncounter();
}

function showScreen(screenId) {
    $('.screen').removeClass('active');
    $('#' + screenId).addClass('active');
}

function updateHealthBars() {
    const playerPercent = Math.max(0, (playerHealth / MAX_HEALTH) * 100);
    $('#playerHealthBar').css('width', playerPercent + '%');
    $('#playerHealthText').text(Math.max(0, playerHealth) + '/' + MAX_HEALTH);

    if (currentEnemy) {
        const enemyPercent = Math.max(0, (currentEnemy.health / currentEnemy.maxHealth) * 100);
        $('#enemyHealthBar').css('width', enemyPercent + '%');
        $('#enemyHealthText').text(Math.max(0, currentEnemy.health) + '/' + currentEnemy.maxHealth);
    }
}

function addLog(message, className = '') {
    const log = $('#battleLog');
    const p = $('<p>').text(message);
    if (className) p.addClass(className);
    log.prepend(p);
    
    // Keep only last 10 messages
    if (log.children().length > 10) {
        log.children().last().remove();
    }
}

function nextEncounter() {
    // After 10 regular enemies, fight Specter, then Boss
    if (currentEncounterCount >= totalEncounters) {
        addLog('You sense a powerful presence...', 'critical');
        setTimeout(() => {
            startBattle(3); // Specter
        }, 1500);
        return;
    }

    // Show chest after 3-4 encounters
    if (currentEncounterCount === chestTriggerEncounter) {
        showChestEvent();
        return;
    }

    // Random enemy from pool (excluding Specter which is index 3)
    let randomEnemyIndex;
    do {
        randomEnemyIndex = Math.floor(Math.random() * TOTAL_ENEMY_TYPES);
    } while (randomEnemyIndex === 3); // Don't randomly spawn Specter
    
    startBattle(randomEnemyIndex);
}

function startBattle(enemyIndex) {
    const enemyType = enemyTypes[enemyIndex];
    const baseHealth = enemyBaseHealth[enemyIndex];
    const maxHealth = baseHealth + Math.floor(Math.random() * 31);
    
    currentEnemy = {
        name: enemyType,
        health: maxHealth,
        maxHealth: maxHealth,
        weakness: enemyWeaknesses[enemyIndex],
        index: enemyIndex
    };

    $('#enemyName').text('⚔️ ' + currentEnemy.name + ' appears!');
    $('#battleLog').empty();
    addLog('A wild ' + currentEnemy.name + ' appears!');
    updateHealthBars();
}

function playerAttack(elementIndex) {
    if (!currentEnemy) return;

    usedElements[elementIndex] = true;
    
    addLog('You used ' + elementNames[elementIndex] + '!');

    let damage;
    if (elementIndex === currentEnemy.weakness) {
        damage = Math.floor(currentEnemy.maxHealth * 0.7);
        addLog("It's super effective! " + damage + " damage!", 'critical');
    } else {
        damage = Math.floor(currentEnemy.maxHealth / 3);
        addLog('You dealt ' + damage + ' damage.', 'damage');
    }

    currentEnemy.health -= damage;
    updateHealthBars();

    if (currentEnemy.health <= 0) {
        setTimeout(() => {
            enemyDefeated();
        }, 1000);
        return;
    }

    // Enemy attacks back
    setTimeout(() => {
        enemyAttack();
    }, 1000);
}

function enemyAttack() {
    const damage = 10 + Math.floor(Math.random() * 11);
    playerHealth -= damage;
    
    addLog(currentEnemy.name + ' strikes back for ' + damage + ' damage!', 'damage');
    updateHealthBars();

    if (playerHealth <= 0) {
        playerDefeated();
    }
}

function enemyDefeated() {
    addLog('Enemy defeated!', 'heal');
    
    if (playerHealth < MAX_HEALTH) {
        playerHealth += 60;
        if (playerHealth > MAX_HEALTH) playerHealth = MAX_HEALTH;
        addLog('You gained 60 HP!', 'heal');
        updateHealthBars();
    }

    // Special message for Mimic
    if (currentEnemy.name === "Mimic") {
        if (!elementGuideShown) {
            $('#elementGuide').show();
            elementGuideShown = true;
        }
        
        // Show scroll screen after defeating mimic
        setTimeout(() => {
            scrollSource = 'mimic';
            $('#scrollDiscoveryText').text("While searching the mimic's remains, you find an ancient scroll!");
            showScreen('scrollScreen');
        }, 2000);
        
        enemiesDefeated++;
        return; // Don't continue yet, wait for scroll screen
    }

    enemiesDefeated++;
    
    // Only increment encounter count for regular enemies (not Specter or Mimic)
    if (currentEnemy.name !== "Specter" && currentEnemy.name !== "Mimic") {
        currentEncounterCount++;
    }

    setTimeout(() => {
        if (currentEnemy.name === "Specter") {
            // After Specter, go to boss fight
            addLog('The final battle awaits...', 'critical');
            setTimeout(() => {
                startBossFight();
            }, 2000);
        } else {
            // For regular enemies, continue to next encounter
            nextEncounter();
        }
    }, 2000);
}

function playerDefeated() {
    const allUsed = usedElements.every(u => u);
    
    if (allUsed && !reviveUsed) {
    reviveUsed = true;

    showScreen('revivalCutscene');

    // Reset animations so they replay properly
    $('#revivalCutscene .cutscene-text').addClass('reset');
    setTimeout(() => {
        $('#revivalCutscene .cutscene-text').removeClass('reset');
    }, 50);

    // Show continue button after animations finish
    setTimeout(() => {
        $('#revivalContinue').fadeIn(1000);
    }, 10000);

    return;
    }


    $('#gameOverTitle').text('💀 DEFEAT 💀').addClass('defeat');
    $('#gameOverMessage').html(
        '<p>You were defeated by ' + currentEnemy.name + '...</p>' +
        '<p>The prophecy remains unfulfilled.</p>' +
        '<p>Humanity falls into an age of ruin.</p>'
    );
    showScreen('gameOverScreen');
}

function showChestEvent() {
    mimicChest = Math.floor(Math.random() * 3) + 1;
    // Increment counter so chest doesn't appear again
    currentEncounterCount++;
    showScreen('chestScreen');
}

function openChest(chestNum) {
    // Disable all chest buttons after first click
    $('.chest-buttons button').prop('disabled', true);
    
    if (chestNum === mimicChest) {
        addLog("It's a Mimic!", 'critical');
        setTimeout(() => {
            showScreen('battleScreen');
            startMimicBattle();
        }, 1000);
    } else {
        playerHealth += 40;
        if (playerHealth > MAX_HEALTH) playerHealth = MAX_HEALTH;
        
        addLog('You gained 40 HP from the chest!', 'heal');
        updateHealthBars();
        
        // Show scroll screen
        scrollSource = 'chest';
        $('#scrollDiscoveryText').text('While searching the chest, you find an ancient scroll!');
        showScreen('scrollScreen');
        
        if (!elementGuideShown) {
            $('#elementGuide').show();
            elementGuideShown = true;
        }
    }
}

function startMimicBattle() {
    // Re-enable chest buttons since we're leaving chest screen
    $('.chest-buttons button').prop('disabled', false);
    
    currentEnemy = {
        name: "Mimic",
        health: 120,
        maxHealth: 120,
        weakness: 1, // Air
        index: -1
    };
    
    $('#enemyName').text('⚔️ Mimic appears!');
    $('#battleLog').empty();
    addLog("It's a Mimic! Prepare for battle!");
    updateHealthBars();
}

function startBossFight() {
    // Show cutscene first
    showScreen('bossCutscene');
    
    // Show continue button after all animations complete (after 10 seconds)
    setTimeout(() => {
        $('#cutsceneContinue').fadeIn(1000);
    }, 10000);
}

function startBossFight() {
    // Show cutscene first
    showScreen('bossCutscene');
    
    // Show continue button after all animations complete (after 10 seconds)
    setTimeout(() => {
        $('#cutsceneContinue').fadeIn(1000);
    }, 10000);
}

function continueAfterRevival() {
    $('#revivalContinue').hide();

    if (currentEnemy && currentEnemy.isBoss) {
    currentEnemy.nextElement = Math.floor(Math.random() * ELEMENTS);
    addLog('Conjugator prepares ' + elementNames[currentEnemy.nextElement] + '!', 'critical');
}

    // Restore player state
    playerHealth = 100;
    updateHealthBars();

    // VERY IMPORTANT: restore normal attack function
    if (!currentEnemy || !currentEnemy.isBoss) return;

    // Re-enable buttons
    $('.element-btn').prop('disabled', false);

    showScreen('battleScreen');
}

function startBossBattle() {
    // Hide the continue button
    $('#cutsceneContinue').hide();
    
    const bossHealth = 1000;
    currentEnemy = {
        name: "Conjugator",
        health: bossHealth,
        maxHealth: bossHealth,
        weakness: -1,
        index: -2,
        isBoss: true,
        enraged: false,
        nextElement: Math.floor(Math.random() * ELEMENTS) // Pre-roll first element
    };

    showScreen('battleScreen');
    $('#enemyName').text('👑 FINAL BOSS: Conjugator 👑');
    $('#battleLog').empty();
    addLog('Conjugator, master of all elements, appears!', 'critical');
    addLog('Conjugator prepares ' + elementNames[currentEnemy.nextElement] + '!', 'critical');
    updateHealthBars();

    // Override player attack for boss
    window.playerAttack = bossPlayerAttack;
}

function bossPlayerAttack(playerElement) {
    if (!currentEnemy || !currentEnemy.isBoss) return;

    // Disable element buttons during attack
    $('.element-btn').prop('disabled', true);

    usedElements[playerElement] = true;
    const bossElement = currentEnemy.nextElement; // Use the pre-shown element

    addLog('You used ' + elementNames[playerElement] + '!');

    if (playerElement === bossElement) {
        addLog('Powers clash and negate! No damage.', 'critical');
        
        // Prepare next element for next turn
        currentEnemy.nextElement = Math.floor(Math.random() * ELEMENTS);
        setTimeout(() => {
            addLog('Conjugator prepares ' + elementNames[currentEnemy.nextElement] + '!', 'critical');
            $('.element-btn').prop('disabled', false);
        }, 1000);
    } else {
        let damage;
        const strength = getElementStrength(playerElement);
        
        if (strength === bossElement) {
            damage = 150;
            addLog('Super effective! Critical hit for ' + damage + ' damage!', 'critical');
        } else if (getElementStrength(bossElement) === playerElement) {
            damage = 30;
            addLog('Resisted! Only ' + damage + ' damage.', 'damage');
        } else {
            damage = 75;
            addLog('Normal damage: ' + damage, 'damage');
        }

        currentEnemy.health -= damage;
        updateHealthBars();

        if (currentEnemy.health <= 0) {
            victory();
            return;
        }

        const bossDamage = 30 + Math.floor(Math.random() * 21);
        playerHealth -= bossDamage;
        addLog('Boss attacks for ' + bossDamage + ' damage!', 'damage');
        updateHealthBars();

        if (playerHealth <= 0) {
            playerDefeated();
            return;
        }

        if (!currentEnemy.enraged && currentEnemy.health <= 500) {
            currentEnemy.enraged = true;
            addLog('The boss is ENRAGED!', 'critical');
        }
        
        // Prepare next element for next turn
        currentEnemy.nextElement = Math.floor(Math.random() * ELEMENTS);
        setTimeout(() => {
            addLog('Conjugator prepares ' + elementNames[currentEnemy.nextElement] + '!', 'critical');
            $('.element-btn').prop('disabled', false);
        }, 1000);
    }
}

function getElementStrength(element) {
    const strengths = [2, 3, 1, 0]; // Water>Fire, Air>Earth, Fire>Air, Earth>Water
    return strengths[element];
}

function victory() {
    showScreen('victoryCutscene');

    $('#victoryEnemyCount').text(enemiesDefeated);

    // Reset animations so replay works
    $('#victoryCutscene .cutscene-text').addClass('reset');
    setTimeout(() => {
        $('#victoryCutscene .cutscene-text').removeClass('reset');
    }, 50);

    // Show buttons after full animation
    setTimeout(() => {
        $('#victoryButtons').fadeIn(1500);
    }, 11000);
}

function continueFromScroll() {
    // Re-enable chest buttons
    $('.chest-buttons button').prop('disabled', false);
    
    // Return to battle and continue
    showScreen('battleScreen');
    nextEncounter();
}

function exitGame() {
    document.body.innerHTML = `
        <div style="
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            font-family:'Segoe UI', sans-serif;
            background:linear-gradient(135deg,#000428,#004e92);
            color:white;
            text-align:center;
        ">
            <div>
                <a href="game files/elemental_clash.html" class="navigation" ></i>Exit</a>
                </p>
            </div>
        </div>
    `;
}

$(document).ready(() => {
    setTimeout(() => {
        $('#introContinue').fadeIn(1500);
    }, 11000);
});