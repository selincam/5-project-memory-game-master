/*
 * Create a list that holds all of your cards
 */
let symbols = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb'],
    open = [],
    numStars = 3,
    moveCalculator = 0,
    matched = 0,
    timer = {
        seconds: 0,
        minutes: 0,
    };

// sets the star by the number of clicks
const amazing = 10;
const good = 15;
const notbad = 20;

//abbreviations for ease of use
const $timer = $('.timer')
const $moves = $('.moves')

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// shows cards
function showCards() {
    symbols = shuffle(symbols);
    let dataIndex = 0;
    $.each($('.card i'), function(){
      $(this).attr('class', 'fa ');
      $(this).attr('data', dataIndex++);
    });
};

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// starts timer
let startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }
    let time = String(timer.minutes) + ':' + String(timer.seconds);
    $timer.text(time);
};

function isValid(card) {
    return!(card.hasClass('open') || card.hasClass('match'));
};

// checks matching cards
function checkMatch() {
    let card1 = open[0];
    let card2 = open[1];
    if (card1.children().attr('class') === card2.children().attr('class')) {
        addMatchAnimation(card1);
        addMatchAnimation(card2);
        return true;
    } else {
        addNotMatchAnimation(card1);
        addNotMatchAnimation(card2);
        return false;
    }
};

let addMatchAnimation = function(card) {
    card.animate({marginTop: '-=50px', marginBottom: '+=50px'}, 300);
    card.animate({marginTop: '+=100px', marginBottom: '-=100px'}, 300);
    card.animate({marginTop: '-=50px', marginBottom: '+=50px'}, 300);
};

let addNotMatchAnimation = function(card) {
    card.animate({marginRight: '-=50px', marginLeft: '+=50px'}, 300);
    card.animate({marginRight: '+=100px', marginLeft: '-=100px'}, 300);
    card.animate({marginRight: '-=50px', marginLeft: '+=50px'}, 300);
};

let addAnimateCardOpening = function(card) {
    if(open.length === 0) {
        card.animate({height: '-=20px', width: '-=20px', marginLeft: '+=20px'}, 300);
        card.animate({height: '+=20px', width: '+=20px', marginLeft: '-=20px'}, 300);
    }
};

// set the cards selected as match
let setMatch = function() {
    open.forEach(function(card) {
        card.addClass('match');
    });
    open = [];
    matched += 2;
    if (Won()) {
        clearInterval(timer.clearTime);
        gameOver();
    }
};

// determines how to win
function Won() {
    return matched === 16;
};

// game is completed
function gameOver() {
    $('.num-stars').text(numStars);
    $('.over').addClass('show');
};

// updates move colculator
function updateMoveCalculator() {
    $moves.text(moveCalculator);
    if (moveCalculator === amazing || moveCalculator === good || moveCalculator === notbad) {
        removeStar();
    }
};

// resets timer
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $timer.text('0:0');
    timer.clearTime = setInterval(startTimer, 1000);
};

// reduces the number of stars by the number of clicks
function removeStar() {
    $('.fa-star').last().attr('class', 'fa fa-star-o');
    numStars--;
};

// resets stars
function resetStars() {
    $('.fa-star-o').attr('class', 'fa fa-star');
    numStars = 3;
};

let resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass('open');
        card.toggleClass('show');
    });
    open = [];
};

function cardClicked() {
    if (isValid( $(this) )) {
        openCard( $(this) );
        if (open.length === 2) {
            moveCalculator++;
            updateMoveCalculator();
            if (checkMatch()) {
                setMatch();
            } else {
                setTimeout(resetOpen, 800);
            }
        }
    }
};

function openCard(card) {
    if (!card.hasClass('open')) {
        addSymbol(card);
        card.addClass('open show');
        addAnimateCardOpening(card);
        open.push(card);
    }
};

function addSymbol(card) {
    let child = card.children();
    child.addClass(symbols[child.attr('data')]);
};

// resets game to the initial state
function resetGame() {
    open = [];
    matched = 0;
    moveCalculator = 0;
    resetTimer();
    updateMoveCalculator();
    $('.card').attr('class', 'card');
    showCards();
    resetStars();
};

// play again button
let playAgain = function() {
    resetGame();
    $('.over').removeClass('show');
};

$('.card').click(cardClicked);
$('.restart').click(resetGame);
$('.play-again').click(playAgain);
showCards();
timer.clearTime = setInterval(startTimer, 1000);
