const ATTACK_VALUE = 10; 
const MONSTER_ATTACK_VALUE = 14;

let chosenMaXLife = 100;
let currentMonsterHealth = chosenMaXLife;
let currentPlayerHealth = chosenMaXLife;

adjustHealthBars(chosenMaXLife);

function attackHandler() {
    const damage = dealMonsterDamage(ATTACK_VALUE);
    currentMonsterHealth -= damage;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    if (currentMonsterHealth <= 0) {
        alert('You won!');
    } else if (currentPlayerHealth <= 0) {
        alert('You lost!');
    }
}

attackBtn.addEventListener('click', attackHandler);