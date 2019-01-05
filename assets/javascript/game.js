  //Array for possible game words
  let hangmanWords = ["Gregor Clegane", "Joffrey Baratheon", "Dragonstone", "Winter Is Coming", "Lord of Light", "The Night King", "King's Landing", "Valar Morghulis", "Valar Dohaeris", "Milk of the Poppy", "The Red Wedding", "Rains of Castamere", "Cersei Lannister", "Valyrian Steel", "White Walkers", "Blood of My Blood", "Dothraki Screamer", "Faceless Men", "Hand of the King", "Iron Throne", "Xaro Xhoan Daxos", "Barristan Selmy", "Astapor", "Yunkai", "Three Eyed Raven", "Widow's Wail", "Dracarys", "The King of the North", "Dragonglass", "Faith of the Seven", "The Mad King", "The Long Night", "The Doom of Valyria"]

  //variable to hold the random game word (not to be displayed)
  let gameWord;

  //variable to clone the length of the gameWord w/ underscores
  let underscores = [];

  //array for incorrect letters the player guesses
  let guessedLetters = [];

  //counter for wins/losses/guesses
  let wins = 0;
  let losses = 0;
  let remainingGuesses = 8;

  //array to hold the two sets of hangman picture progressions
  let pictureSet = ["Stark", "Wall"];

  let hasFinished = false;
  resetGame();
  $("#resultsDisplay").text("WARNING: This Game Is Dark and Full of Spoilers");

  $("#start-button").click(resetGame);
  
  function resetGame() {//Set everything back to defaults
    hasFinished = false;
    remainingGuesses = 8;
    guessedLetters = [];
    $("#game_area").show();
    $("#resultsDisplay").text("Good Luck!");
    $("#winsCounter").text(wins);
    $("#lossCounter").text(losses);
    $("#executionClip").empty();

    //generate random word/phrase & a set of images to use
    gameWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    console.log(gameWord);
    pictureSetSelection = pictureSet[Math.floor(Math.random() * pictureSet.length)];

    let gameWordToArray = [...gameWord.toUpperCase()];

    underscores = gameWordToArray.map(val => {
      if (val == "'") {
        return ("'");
      }
      else if (val ==" ") {
        return ("  ");
      }
      else {
        return ("_ ")
      }
    })  
    updateDisplay();
  }

//Check entered key to see if it's a letter.  If so, change it to lowercase and continue.  
document.onkeydown = event => {
  if (hasFinished === true) {
      resetGame();
  } 
  else {
    //set userGuess variable to the key that was pressed
    let userGuess = event.key;
    //If statement that will only process if the key pressed was a letter
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      $("#resultsDisplay").text(`"${userGuess.toUpperCase()}" Is Correct!`);
      //This will set up function 'makeGuess' with a lowercase letter
      evaluateGuess(event.key.toLowerCase());
    }
  }
}

//Check guess and either push to incorrect guesses, or replace underscore w/ letter
function evaluateGuess(letter) {
  let gameWordToArray = [...gameWord.toLowerCase()];
  let positions = gameWordToArray.filter((val, i) => {
    if (val === letter) {return letter};
  })

  //First 'If' condition analyzes the 'positions' array.  If there's nothing in there, that means the letter does not exist in the gameWord, so we'll decrement remainingGuesses. 
  if (positions.length <= 0) {
    if (guessedLetters.indexOf(` ${letter.toUpperCase()}`) === -1) {
        //If it's not there, we're pushing it to the guessedLetters array
        guessedLetters.push(` ${letter.toUpperCase()}`);
        remainingGuesses--;
        $("#resultsDisplay").text(`There are no ${letter.toUpperCase()}'s.  Try again.`);
    } else {
        $("#resultsDisplay").text(`You already guessed '${letter.toUpperCase()}'. Try again.`);
    }
    //Start 2nd condition
  } else {
      //Here we map thru all entries in 'positions' array and change the letter in that position in the game word to the initial user's input
      gameWordToArray.map((val, i) => {
        if (val === letter) {
          underscores[i] = letter.toUpperCase();
        }
      })
    }
  updateDisplay();
}

function updateDisplay() {
  let displayUnderscores = underscores.join("");
  $("#underscores").text(displayUnderscores);
  $("#remainingGuesses").text(remainingGuesses);
  $("#guessedLetters").text(guessedLetters);
  $("#hangmanIndex").attr("src",`assets/images/${pictureSetSelection}${remainingGuesses}.PNG`);
  checkWins(displayUnderscores);
}

function checkWins() {
  if (underscores.indexOf("_ ") === -1) {
    wins++;
    $("#winsCounter").text(wins);
    hasFinished = true;

    //After win, populate 'WINNER' message
    $("#game_area").hide();
    $("#resultsDisplay").text("You Win!  Press Any Key to Play Again!");
    if (pictureSetSelection === "Stark") {
      $("#hangmanIndex").attr("src", "assets/images/HappyStark.jpg");
    }
    else {
      $("#hangmanIndex").attr("src", "assets/images/HappyAlliser.jpg");
    }
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
    $("#resultsDisplay").text("You Lose. Press Any Key to Play Again!");
  }
}