// Generate winning number
var generateWinningNumber = function() {
    return Math.ceil(Math.random() * 100);
};

// Shuffle
var shuffle = function(arr) {
    var m = arr.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
};

// Game class
var Game = function() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
};

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || typeof num !== "number") {
        throw "That is an invalid guess.";
    }
    this.playersGuess = num;
    return this.checkGuess();
};

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        return "You Win!";
    } else if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
        return "You have already guessed that number.";
    } else {
        this.pastGuesses.push(this.playersGuess);
    }

    var currDiff = this.difference();

    if (this.pastGuesses.length >= 5) {
        return "You Lose.";
    } else if (currDiff < 10) {
        return "You're burning up!";
    } else if (currDiff < 25) {
        return "You're lukewarm.";
    } else if (currDiff < 50) {
        return "You're a bit chilly.";
    } else {
        return "You're ice cold!";
    }
};

Game.prototype.provideHint = function() {
    var output = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(output);
};

var newGame = function() {
    return new Game();
};

function grabPlayerGuess(game) {
    var playersGuess = +$("#player-input").val();
    $("#player-input").val("");
    respondToAnswer(game.playersGuessSubmission(playersGuess));
}

function respondToAnswer(response) {
    $("#title").text(response);
    updatePastGuesses(game);
    if (response === "You Win!" || response === "You Lose.") {
        $("#subtitle").text("Hit reset to play again.");
        disableElements(["#submit","#player-input","#hint"], true);
    } else if (response !== "You have already guessed that number.") {
        if (game.isLower()) {
            $("#subtitle").text("Guess higher.");
        } else {
            $("#subtitle").text("Guess lower.");
        }
    }
}

function disableElements(elements, bool) {
    elements.forEach(function(el) {
        $(el).prop("disabled", bool);
    });
}

function updatePastGuesses(game) {
    var guessListChildren = $("#guess-list").children();
    game.pastGuesses.forEach(function(guess, index) {
        $(guessListChildren[index]).text(guess);
    });
}

// Initiate the game in the global space
var game = newGame();

// On document load
$(document).ready(function() {
    // Event listeners
    // Submit button
    $("#submit").on("click", function() {
        grabPlayerGuess(game);
    });
    // Player input
    $("#player-input").on("keypress", function(event) {
        if (event.which === 13) {
            grabPlayerGuess(game);
        }
    });

    // Reset button
    $("#reset").on("click", function() {
        game = newGame();
        $("#title").text("Guessing Game!");
        $("#subtitle").text("Guess a number between 1 - 100");
        $(".guess").text("-");
        disableElements(["#submit","#player-input","#hint"], false);
    });

    // Hint button
    $("#hint").on("click", function() {
        $("#title").text("Hint: " + game.provideHint().join(", "));
        disableElements(["#hint"], true);
    });
});
