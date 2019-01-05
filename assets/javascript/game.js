  let hangmanWords = ["Gregor Clegane", "Joffrey Baratheon", "Dragonstone", "Winter Is Coming", "Lord of Light", "The Night King", "King's Landing", "Valar Morghulis", "Valar Dohaeris", "Milk of the Poppy", "The Red Wedding", "Rains of Castamere", "Cersei Lannister", "Valyrian Steel", "White Walkers", "Blood of My Blood", "Dothraki Screamer", "Faceless Men", "Hand of the King", "Iron Throne", "Xaro Xhoan Daxos", "Barristan Selmy", "Astapor", "Yunkai", "Three Eyed Raven", "Widow's Wail", "Dracarys", "The King of the North", "Dragonglass", "Faith of the Seven", "The Mad King", "The Long Night", "The Doom of Valyria"]

  let gameWord;
  let underscores = [];
  let incorrectGuesses = [];
  let wins = 0;
  let losses = 0;
  let remainingGuesses = 8;
  let gameOver = false;
  let pictureSet = ["Stark", "Wall"];
  resetGame();
  $("#resultsDisplay").text("WARNING: This Game Is Dark and Full of Spoilers");
  $("#start-button").click(resetGame);
  
  function resetGame() {//Set everything back to defaults
    gameOver = false;
    remainingGuesses = 8;
    incorrectGuesses = [];
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
      if (val == "'") {return ("'")}
      else if (val ==" ") {return ("  ")}
      else {return ("_ ")}
    })  
    updateDisplay();
  }

document.onkeydown = event => {
  if (gameOver) {
      resetGame();
  } 
  else {
    let userGuess = event.key;
    if (event.keyCode >= 65 && event.keyCode <= 90) {
      $("#resultsDisplay").text(`"${userGuess.toUpperCase()}" Is Correct!`);
      evaluateGuess(userGuess.toLowerCase());
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
    if (incorrectGuesses.indexOf(` ${letter.toUpperCase()}`) === -1) {
        //If it's not there, we're pushing it to the incorrectGuesses array
        incorrectGuesses.push(` ${letter.toUpperCase()}`);
        remainingGuesses--;
        $("#resultsDisplay").text(`There are no ${letter.toUpperCase()}'s.  Try again.`);
    } else {
        $("#resultsDisplay").text(`You already guessed '${letter.toUpperCase()}'. Try again.`);
    }
  } else {
      //Here we map thru all entries in 'underscores' array and change the letter in that position in the game word to the initial user's input
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
  $("#incorrectGuesses").text(incorrectGuesses);
  $("#hangmanIndex").attr("src",`assets/images/${pictureSetSelection}${remainingGuesses}.PNG`);
  checkWins();
}

function checkWins() {
  if (underscores.indexOf("_ ") === -1) {
    wins++;
    $("#winsCounter").text(wins);
    gameOver = true;
    $("#game_area").hide();
    $("#resultsDisplay").text("You Win!  Press Any Key to Play Again!");
    if (pictureSetSelection === "Stark") {
      $("#hangmanIndex").attr("src", "assets/images/HappyStark.jpg");
    }
    else {
      $("#hangmanIndex").attr("src", "assets/images/HappyAlliser.jpg");
    }
  } else if (remainingGuesses <= 0) {
      gameOver = true;
      losses++;
      $("#lossCounter").text(losses);
      let iframe = document.createElement("iframe");
      if (pictureSetSelection === "Stark") {
        iframe.setAttribute("src", "https://www.youtube.com/embed/EeWvXwN0Pxc?autoplay=1");
      }
      else {
        iframe.setAttribute("src", "https://www.youtube.com/embed/D0rB5XpmPiQ?autoplay=1")
      }
    $("#executionClip").append(iframe);
    $("#resultsDisplay").text("You Lose. Press Any Key to Play Again!");
  }
}