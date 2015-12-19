// zarzdzanie widokiem, komunikaty do gracza,  zmiany css w zaleznosci od trafienia lub pudła
var view ={
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit : function(location) {
        var cell= document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss: function(location) {
        var cell= document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

// model statków, iloci, rozmiszczania, a także akcji ognia
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    // statki na sztywno stara wersja
    // ships: [
    //     { locations: ["06", "16", "26"], hits: ["", "", ""] },
    //     { locations: ["24", "34", "44"], hits: ["", "", ""] },
    //     { locations: ["10", "11", "12"], hits: ["", "", "hit"] }
    // ],
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
    // akcja ogien, sprawdzenie trafienia statku, komunikaty do gracza, czy statek calkowicie zatanal
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("trafiles statek!!!");

                if (this.isSunk(ship)) {
                    view.displayMessage("Zatopiłeś mój okręt!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Spudłowałeś :-P");
        return false;
    },

    // funkcja pomocnicza sprawdzajaca czy statek zatnał
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
//generowanie losowych statkow
//
//
//
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Tablica okrętów: ");
        console.log(this.ships);
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) { // W poziomie.
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else { // W pionie.
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

// kontroler przechowuje liczbe prob, przetwarz wspolrzedne wpisane przez  gracza przekazuje do modelu i wykrywa koniec gry

var controller = {
    guesses:0,

    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            // liczba prob
            this.guesses++;
            // przekazanie lokalizacji do strzału
            var hit=model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("zatopiłe wszystkie okrety w: "+ this.guesses+" probach");
            }
        }
    },
// funkcja omijaca konwenter dla klikniecia odpowiedniego ID
    kliku: function (guess) {
        var location = guess;

            // liczba prob
            this.guesses++;
            // przekazanie lokalizacji do strzału
            var hit=model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("zatopiłe wszystkie okrety w: "+ this.guesses+" probach");
                var kolorWygranej = document.getElementById("wygrana");
                kolorWygranej.className = "contener";
        }
    },
}

function parseGuess(guess) {
    //tablica prawidłowych współrzednych
    var alphabet =["A","B","C","D","E","F","G"]
    //sprawdzenie wpisu gracza
    if (guess === null || guess.length !== 2) {
        view.displayMessage("ups wpisz proszę literę i cyfrę");
    } else {
        //pobieranie pierwszego znaku przekazanego przez gracza
        firstChar = guess.charAt(0);
        // powiekszenie do dzuej litery
        firstCharUpp = firstChar.toUpperCase();
        // konwesrja na liczbę litery
        var row= alphabet.indexOf(firstCharUpp);
        //pobranie drugiej cyfry
        var column =guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            view.displayMessage("ups to nie sa współrzedne!");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize)
            {
            view.displayMessage("ups pole poza plansza");
           } else {
            return row + column;
           }
    }
    return null;
}



// obsluga entera
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess= guessInput.value;
    controller.processGuess(guess);
    guessInput.value="";
}

function klikniecieMyszka() {
    // var guessInput = document.getElementsByTagName("00");
    // var checkMe = guessInput.getAttribute("id");
    // console.log(checkMe);
    // controller.kliku(checkMe);
    // guessInput.value="";
    console.log("dupa");
}

// pobranie strzalu gracza z wpisu i klikniecia ognia
function init() {
    var fireButton =  document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    // z klawiatury i enter
    var guessInput= document.getElementById("guessInput");
    guessInput.onkeypress= handleKeyPress;
    //generowanie statkow
    model.generateShipLocations();
    // klikniecie odpowiedniego pola
    var tdEl = document.getElementsByTagName("td");
    for (var i = 0; i < tdEl.length; i++) {
        tdEl[i].addEventListener("click", function() {
            var checkMe = this.getAttribute("id");
            klikniecieMyszka(checkMe);
       });
   }
}



function klikniecieMyszka(checkMe) {
    // var guessInput = document.getElementsByTagName("00");
    // var checkMe = guessInput.getAttribute("id");
    // console.log(checkMe);
    // controller.kliku(checkMe);
    // guessInput.value="";
    console.log("klik");
    console.log(checkMe);
    controller.kliku(checkMe);
}

window.onload = init;



