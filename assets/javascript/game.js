//Array for possible game words
let hangmanWords = ["Gregor Clegane", "Joffrey Baratheon", "Dragonstone", "Winter Is Coming", "Lord of Light", "The Night King", "King's Landing", "Valar Morghulis", "Valar Dohaeris", "Milk of the Poppy", "The Red Wedding", "Rains of Castamere", "Cersei Lannister", "Valyrian Steel", "White Walkers", "Blood of My Blood", "Dothraki Screamer", "Faceless Men", "Hand of the King", "Iron Throne", "Xaro Xhoan Daxos", "Barristan Selmy", "Astapor", "Yunkai", "Three Eyed Raven", "Widow's Wail", "Dracarys", "The King of the North", "Dragonglass", "Faith of the Seven", "The Mad King", "The Long Night", "The Doom of Valyria"]

//variable to hold the random game word (not to be displayed)
let gameWord;

//array to hold each character of the gameWord
let gameLetters = [];

//variable to clone the length of the gameWord w/ underscores
let underscores = [];

//array for incorrect letters the player guesses
let guessedLetters = [];

//sets the maximum # of tries.  this should never change
const maxTries = 8;

//counter for the # of guesses player has left
let remainingGuesses;

//counter for wins/losses
let wins = 0;
let losses = 0;

//array to hold the two sets of hangman picture progressions
let pictureSet = ["Stark", "Wall"];

let hasFinished = false;

//resetGame() function needs to reset remainingGuesses to 8; choose a random word from the array; build out the underscores[] array; and write that array to the document. 
function resetGame() {

    hasFinished = false;

    //This will hide the "You Lose" text when restarting after a loss
    document.getElementById("resultsDisplay").style.display = 'none';
    $("#winsCounter").text(wins);
    $("#lossCounter").text(losses);

    //This will delete the embedded video that gets built in after a loss
    let node = document.getElementById('executionClip');
    while (node.hasChildNodes()) {
      node.removeChild(node.firstChild);
    }

    //sets remaining guesses to 8
    remainingGuesses = maxTries;

    //resets underscores to none
    underscores = [];

    //resets Guessed Letters to blank
    guessedLetters = [];

    //generate random word/phrase
    gameWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];

    //generate set of pictures to use
    pictureSetSelection = pictureSet[Math.floor(Math.random() * pictureSet.length)];

    //New function to set up 'underscores' array. 
    for (var i = 0; i < gameWord.length; i++) {
        if (gameWord.charAt(i) == " ") {
            underscores.push("  ");
        } else if (gameWord.charAt(i) == "'") {
            underscores.push("'");
        } else {
            underscores.push("_ ");
        }
    }
    if (wins === 0) {
        alert("WARNING: This game is dark and full of spoilers");
    }
    updateDisplay();
}

//Check entered key to see if it's a letter.  If so, change it to lowercase and continue.  
document.onkeydown = function (event) {
  if (hasFinished === true) {
      resetGame();
  } 
  else {
    //set userGuess variable to the key that was pressed
    userGuess = event.key;
    //If statement that will only process if the key pressed was a letter
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      //This alert should only pop if it's a letter.  I'll probably delete or modify this - it's mainly here for my reference right now instead of console log
      alert(`You guessed ${userGuess.toUpperCase()}`);
      //This will set up function 'makeGuess' with a lowercase letter
      evaluateGuess(event.key.toLowerCase());
    }
  }
}

//This fx will look at the letter and see if it exists in the gameWord var.
//If so, we will push that letter to the underscore index that is equal to the index where the letter exists in the gameWord
//If not, we will reduce guesses by 1

function evaluateGuess(letter) {
  //This variable is holding the index(es) where the guessed letter appears in the gameWord
  let positions = [];
  let gameWordLowercase = gameWord.toLowerCase();

  //For loop is checking if/where characters match in the gameWord
  for (var i = 0; i < gameWord.length; i++) {
    if (gameWordLowercase.charAt(i) === letter) {
      //this pushes the index of the letter match to the positions array above
      positions.push(i);
    }
  }
  //First 'If' condition analyzes the 'positions' array.  If there's nothing in there, that means the letter does not exist in the gameWord, so we'll decrement remainingGuesses. 
  if (positions.length <= 0) {
    if (guessedLetters.indexOf(` ${letter.toUpperCase()}`) === -1) {
        //If it's not there, we're pushing it to the guessedLetters array
        guessedLetters.push(` ${letter.toUpperCase()}`);
        remainingGuesses--;
    } else {
        alert(`You already guessed '${letter.toUpperCase()}'. Pick another letter.`);
    }
    //Start 2nd condition
  } else {
      //Here we run a loop thru all entries in 'positions' array and change the letter in that position in the game word to the initial user's input
      positions.map((val, j) => {
        underscores[positions[j]] = letter.toUpperCase();
      })
    }
  updateDisplay();
}

function updateDisplay() {
  let displayUnderscores = underscores.join("");
  document.getElementById("underscores").innerText = displayUnderscores;
  document.getElementById("remainingGuesses").innerText = remainingGuesses;
  document.getElementById("guessedLetters").innerText = guessedLetters;
  document.getElementById("hangmanIndex").src=`assets/images/${pictureSetSelection}${remainingGuesses}.PNG`;
  checkWins();
}

function checkWins() {
  if (underscores.indexOf("_ ") === -1) {
    wins++;
    document.getElementById("winsCounter").innerText = wins;
    hasFinished = true;

    //After win, populate 'WINNER' message
    let theDiv = document.getElementById("resultsDisplay");
    theDiv.innerText = "You Win!  Press any key to play again!"
  } else if (remainingGuesses <= 0) {
      hasFinished = true;
      losses++;
      $("#lossCounter").text(losses);

    //After loss, populate iframe clip
    if (pictureSetSelection === "Stark") {
      let iframe = document.createElement("iframe");
      iframe.setAttribute("src", "https://www.youtube.com/embed/EeWvXwN0Pxc?autoplay=1");
      document.getElementById("executionClip").appendChild(iframe);
    }
    //This is the second iFrame scenario
    else {
      let iframe2 = document.createElement("iframe");
      iframe2.setAttribute("src", "https://www.youtube.com/embed/D0rB5XpmPiQ?autoplay=1")
      document.getElementById("executionClip").appendChild(iframe2);
    }

    //After loss, populate 'LOSER' message
    let theDiv = document.getElementById("resultsDisplay");
    theDiv.innerText = "You Lose.  Press any key to play again!"
  }
}