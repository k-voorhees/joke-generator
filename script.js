// grabbing DOM elements that will be used later
const categoryTitle = document.querySelector("#category-title");
const navBar = document.getElementById("navBar");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
const JokeText = document.getElementById("jokeText");
const randomButton = document.getElementById("random-btn");

// creating Global Variables
let categoryArray = []; // list of categories
let jokesArray = []; // stores the jokes - depending on the category selected
let previousJokes = []; // stores the previous jokes

// fetch inside function to be used later. we need to return a new Promise.
function getData() {
  return new Promise((resolve, reject) => {
    // returning a new Promise that we can use later outside the fetch
    fetch("./stupidstuff.json") // grabs the file
      .then((response) => response.json()) // gets response in json format
      .then((fetchedData) => {
        let data = fetchedData;
        resolve(data); // what we are resolving with the promise
      });
  });
}
// CREATING THE CATEGORY BUTTONS
getData().then((data) => {
  // adding categories to an array
  for (let i = 0; i < data.length; i++) {
    categoryArray.push(data[i].category);
  }
  categoryArray.sort(); // sorting the array
  categoryArray = [...new Set(categoryArray)]; // getting rid of duplicates by making our array a Set.

  for (let i = 0; i < categoryArray.length; i++) {
    // creating the new elements
    const newCategoryEl = document.createElement("li"); // new list item
    newCategoryEl.className = "category"; // adding classnames
    const newCategoryButtonEl = document.createElement("button"); // new button
    newCategoryButtonEl.className = "category-button"; // adding classnames
    const buttonText = document.createTextNode(categoryArray[i]); // adding text to the button
    // connect new elements
    newCategoryButtonEl.appendChild(buttonText); // connecting button text to the button
    newCategoryEl.appendChild(newCategoryButtonEl); // connecting the button to the new list item
    // connect to existing elements
    navBar.appendChild(newCategoryEl); // connecting the new list item to the existing list
    // changing displayed category and setting the category of the jokes to be displayed
    newCategoryButtonEl.addEventListener("click", () => {
      categoryTitle.innerText = categoryArray[i];
      setCategory(categoryArray[i]); // function to set the category
    });
  }
});

// FILLING THE JOKE ARRAY TO BE USED FOR THE FIRST TIME
getData().then((data) => {
  for (let i = 0; i < data.length; i++) {
    jokesArray.push(data[i].body);
  }
});
// SETS THE JOKE ARRAY BACK TO RANDOM IF ANOTHER CATEGORY WAS PREVIOUSLY SELECTED
function setRandomJokes() {
  getData().then((data) => {
    categoryTitle.innerText = "Random Joke";
    for (let i = 0; i < data.length; i++) {
      jokesArray.push(data[i].body);
    }
  });
  newJoke(); // displays a joke when the random button is pressed
}

// DISPLAYS A NEW JOKE IN THE TEXT BOX
function newJoke() {
  let jokeNum = Math.floor(Math.random() * jokesArray.length); // gets random integer
  if (jokesArray[jokeNum].length > 0) {
    JokeText.innerText = jokesArray[jokeNum]; // changes the text of the joke-area based on array index of the random int
    previousJokes.unshift(jokeNum); // stores the previous joke index- unshift to store at the front for easy access later
  } else {
    newJoke(); // filters out blank jokes that may be in the dataset - will not display a blank joke text box
  }
}

// functionality for previous button
function prevJoke() {
  if (previousJokes.length > 1) {
    // checks to make sure there is a previous joke to go back to
    JokeText.innerText = jokesArray[previousJokes[1]]; // sets the joke area text to the previous joke
    previousJokes.shift(); // removes the current joke from the previous list
  } else {
    return; // if no previous jokes, returns to main
  }
}
// SETS THE CATEGORY ON CATEGORY BUTTON CLICK
function setCategory(selectedCategory) {
  getData().then((data) => {
    jokesArray = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].category === selectedCategory && data[i].body.length > "") {
        jokesArray.push(data[i].body);
      }
    }
  });
}

// EVENT LISTENERS
nextButton.addEventListener("click", newJoke);
prevButton.addEventListener("click", prevJoke);
randomButton.addEventListener("click", setRandomJokes);
