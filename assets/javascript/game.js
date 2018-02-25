//Array for possible game words
var hangmanWords = ["Gregor Clegane", "Joffrey Baratheon", "Dragonstone", "Winter Is Coming", "Lord of Light", "The Night King", "King's Landing", "Valar Morghulis", "Valar Dohaeris"]

//variable to hold the random game word (not to be displayed)
var gameWord;

//array to hold each character of the gameWord
var gameLetters = [];

//variable to clone the length of the gameWord w/ underscores
var underscores = [];

//array for incorrect letters the player guesses
var guessedLetters = [];

//counter for the # of guesses player has left
var remainingGuesses = 0;

//counter for wins
var wins = 0;


//Trigger game start by calling function  w/ a button click (button in HTML)

document.onkeyup = resetGame();

//startGame() function needs to reset remainingGuesses to 0; choose a random word from the array; build out the underscores[] array; and write that array to the document.  Right now it's writing to the first line, but this will be updated once CSS is coded
function resetGame() {

    //sets remaining guesses to 8
    remainingGuesses = 8;

    //resets underscores to none
    underscores = "";

    //resets Guessed Letters to blank
    guessedLetters = [];

    //generate random word/phrase
    gameWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)]
    
    //alert is just for my reference and will be deleted on final
    alert(gameWord);

    //sets up the underscores array
    for (var i = 0; i < gameWord.length; i++) {
        underscores = underscores + "_ ";
    }   

    //writes underscores array to doc (will be updated when CSS coded)
    document.querySelector("#gameWord").innerHTML = underscores;

    //writes blank guessedLetters array to doc
    document.querySelector("#guessedLetters").innerHTML = guessedLetters;

    //displays remaining guesses in the HTML span
    document.querySelector("#remainingGuesses").innerHTML = remainingGuesses;

    //changes image to intact Ned Stark ****NOT WORKING****
    document.getElementById("hangmanImage").src = "assets/images/stark6.jpg";
}

//Check entered key to see if it's a letter.  If so, change it to lowercase and continue.  

document.onkeydown = function(event) {
    //set userGuess variable to the key that was pressed
    userGuess = event.key;
    //If statement that will only process if the key pressed was a letter
    if (event.keyCode >= 65 && event.keyCode <=90) {
        //This will set up function 'makeGuess' with a lowercase letter
        makeGuess(event.key.toLowerCase());
    }  
}


//function based off the letter from the above event
function makeGuess(letter) {
    //If statement checking the guessedLetter array for the letter.  -1 means it's not there
    if (guessedLetters.indexOf(letter) === -1) {
        //If it's not there, we're pushing it to the array
        guessedLetters.push(letter);
        //and then setting up a new fx to continue evaluating
        evaluateGuess(letter);
    }
}

//This fx will look at the letter and see if it exists in the gameWord var.
//If so, we will push that letter to the underscore index that is equal to the index where the letter exists in the gameWord
//If not, we will reduce guesses by 1

function evaluateGuess(letter) {
    
    //This variable is holding the index(es) where the guessed letter appears in the gameWord
    var positions = [];
    
    //For loop is checking if/where characters match in the gameWord
    for (var i = 0; i < gameWord.length; i++) {
        if (gameWord.charAt(i) === letter) {
            //this pushes the index of the letter match to the positions array above
            positions.push(i);
        }
    }

    if (positions.length <= 0) {
        remainingGuesses--;
    } else {
        
    }

}


//If it's correct, replace the appropriate underscore with the correct letter

//If it's incorrect, add the letter to the 'Misses' heading and cycle to the next img

//Also - incorrect guesses will need to add to a counter that will cause a game over at 8