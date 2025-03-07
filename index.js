/* sets up the necessary values and suits to be displayed for the game to run
* TODO: develop on the game logic to hide the dealer's second card
*  TODO: possible adding of chips? */
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
let deck = [];
let player1Hand = [];
let player2Hand = [];
let currentPlayer = 1;
let dealerHand = [];

/* creates a deck to be pulled from to deal the game */
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = shuffle(deck);
}

/* feeds the string for html to pass to html depending on the hand that is dealt
   which will be implemnted in the function, updateDisplay()
 */
function getCardImage(card) {
    return `img/${card.suit}/${card.value}.png`;
}

/* shuffles the generated deck from createDeck */
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

/* pop the card from the generated deck to be dealt to player */
function dealCard(hand) {
    hand.push(deck.pop());
}

/* function gets the value of cards. accounts for j, q, and k to be 10. on first ace dealt
    increases the value to 11. after hit however, will decrease by 10 and aces will be
    counted as 1 instead per black jack rules
 */
function getHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        if (['j', 'q', 'k'].includes(card.value)) {
            value += 10;
        } else if (card.value === 'a') {
            aces++;
            value += 11;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

/* starts the game by creating the deck, creating a fresh list to hold the hands for
    player 1, 2, and dealer, then deal the cards
 */
function startGame() {
    createDeck();
    player1Hand = [];
    player2Hand = [];
    dealerHand = [];
    dealCard(player1Hand);
    dealCard(player2Hand);
    dealCard(dealerHand);
    dealCard(player1Hand);
    dealCard(player2Hand);
    dealCard(dealerHand);
    updateDisplay();
}

/* function to hit */
function hit() {
    // checks to see if the first player is in play. deals to apropiate player
    if (currentPlayer === 1) {
        dealCard(player1Hand);
        updateDisplay();
        // continues until the player busts
        if (getHandValue(player1Hand) > 21) {
            document.getElementById('message').innerText = 'You Busted! Dealer Wins!';
            currentPlayer = 2;
        }
    }
    // plays player2's hand
    else{
        dealCard(player2Hand);
        updateDisplay();
        if (getHandValue(player2Hand) > 21) {
            document.getElementById('message').innerText = 'You Busted! Dealer Wins!';
            dealerTurn();
        }
    }
}

// function that ends the respective player's turn
function stand() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
        document.getElementById('message').innerText = 'Player 2\'s Turn!';
    }
    // if player 2 is in play and stands, jumps to player2
    else {
        dealerTurn();
    }
}

// function that plays dealer's hand. stands on 17
function dealerTurn() {
    while (getHandValue(dealerHand) < 17) {
        dealCard(dealerHand);
    }
    updateDisplay();
    determineWinner();
}

/* determines the winner */
function determineWinner() {
    // functions gets the playervalue of player 1, 2, and dealer
    let player1Value = getHandValue(player1Hand);
    let player2Value = getHandValue(player2Hand);
    let dealerValue = getHandValue(dealerHand);

    // reests the player counter to player 1 for next turn
    currentPlayer = 1;

    // creates an empty string to be passed to the html
    let message = '';

    // checks if dealer busted. if so, had player1, and 2 have not busted, both automatically
    // win their hand
    if (dealerValue > 21) {
        message = 'Dealer Busted! ';
        if (player1Value <= 21) message += 'Player 1 Wins! ';
        if (player2Value <= 21) message += 'Player 2 Wins!';
    }
    // if dealer has not busted, checks the values to see if the player's win based on beating
    // the dealer's hand, tied, or if the dealer beats their hand
    else {
        if (player1Value > dealerValue && player1Value <= 21) {
            message += 'Player 1 Wins! ';
        } else if (player1Value === dealerValue) {
            message += 'Player 1 Ties! ';
        } else {
            message += 'Dealer beats Player 1! ';
        }

        if (player2Value > dealerValue && player2Value <= 21) {
            message += 'Player 2 Wins! ';
        } else if (player2Value === dealerValue) {
            message += 'Player 2 Ties! ';
        } else {
            message += 'Dealer beats Player 2!';
        }
    }

    // updates the message on html file
    document.getElementById('message').innerText = message;
}

/* function updates the html display. checks the player's current hand and deals
   retrieves the proper card based on the value and suit the player has.
 */
function updateDisplay() {
    const player1Container = document.getElementById('player1-hand');
    const player2Container = document.getElementById('player2-hand');
    const dealerContainer = document.getElementById('dealer-hand');

    player1Container.innerHTML = '';
    player2Container.innerHTML = '';
    dealerContainer.innerHTML = '';

    // following pulls together the string for to feed the images for the cards to
    // html end
    player1Hand.forEach(card => {
        const img = document.createElement('img');
        img.src = getCardImage(card);
        img.classList.add('card');
        player1Container.appendChild(img);
    });

    player2Hand.forEach(card => {
        const img = document.createElement('img');
        img.src = getCardImage(card);
        img.classList.add('card');
        player2Container.appendChild(img);
    });

    dealerHand.forEach(card => {
        const img = document.createElement('img');
        img.src = getCardImage(card);
        img.classList.add('card');
        dealerContainer.appendChild(img);
    });

    // updates the players and dealer score on html end
    document.getElementById('player1-score').innerText = getHandValue(player1Hand);
    document.getElementById('player2-score').innerText = getHandValue(player2Hand);
    document.getElementById('dealer-score').innerText = getHandValue(dealerHand);
}

// listeners to check for clicks on the buttons to start game, hit, and stand
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);
