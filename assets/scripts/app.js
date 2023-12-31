const ATTACK_VALUE = 10; 
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let battleLog = [];
let lastLogEntry;

function getMaxLifeValues() {
    const enteredValue = prompt('Maximum life for you and the monster.', '100');
    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw {"message": 'User entered invalid input'}; // throws error if user input is NaN
    }
    return parsedValue;
}

let chosenMaXLife;

try {
    chosenMaXLife = getMaxLifeValues();
} catch (error) {
    console.log(error);
     chosenMaXLife = 100;
    alert('You entered something wrong, Default health set to 100');
    //throw error;
} /* finally {

}
 */
let currentMonsterHealth = chosenMaXLife;
let currentPlayerHealth = chosenMaXLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaXLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry;
    if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
        switch (ev) {
            case LOG_EVENT_PLAYER_ATTACK:
                logEntry.target = 'MONSTER';
                break;
        };
    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaXLife;
    currentPlayerHealth = chosenMaXLife;
    resetGame(chosenMaXLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,
         playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
        );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(LOG_EVENT_GAME_OVER,
            'PLAYER WON',
           currentMonsterHealth,
           currentPlayerHealth
           );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(LOG_EVENT_GAME_OVER,
            'MONSTER WON',
           currentMonsterHealth,
           currentPlayerHealth
           );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw');
        writeToLog(LOG_EVENT_GAME_OVER,
            'A DRAW',
           currentMonsterHealth,
           currentPlayerHealth
           );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    /* if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    } */
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent,
        damage,
       currentMonsterHealth,
       currentPlayerHealth
       );
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaXLife - HEAL_VALUE) {
        alert("You can't heal to more than your max initial health.");
        healValue = chosenMaXLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL,
        healValue,
       currentMonsterHealth,
       currentPlayerHealth
       );
    endRound();
}

function printLogHandler() {
     for (let i = 0; i < 3; i++ ) {
        console.log('__________');
    } 
   let j = 0;
   outerWhile: do {
    console.log('Outer', j);
    innerFor: for (let k = 0; k < 5; k++) {
        if (k === 3) {
            break outerWhile;
            //continue outerWhile; careful => this creates an infinite loop!
        }
        console.log('Inner', k);
    }
    j++;
   } while (j < 3);
    /* for (let i = 10; i > 0;) {
        i--;
        console.log(i); // uses javascript for loop to iterate through battle log entries
    } */
    /* for (let i = 0; i < battleLog.length; i++) {
        console.log(battleLog[i]);
    } */
    let i = 0;
    for (const logEntry of battleLog) { 
        if (!lastLogEntry  && lastLogEntry !== 0 || lastLogEntry < i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLogEntry = i;
            break;
        }
        i++;
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);