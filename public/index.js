/**
 * Names: Simon Studen, Vincent Kao
 * Date: May 1, 2023
 * Section: CSE 154
 *
 * this is the js file for our final project and will determine the behavior of
 * our vehicle-selling website including filters and more
 */
"use strict";

(function() {

  // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE
  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * initializes event handlers required at page load
   */
  async function init() {
    mainPageBehaviors();
    toggleLoginForm();
    toggleCart();
    navigateBetweenForms();
    closeForms();
    addToCartButtonBehavior();
    vehicleViewBehaviors();
    userFormBehaviors();
    accountFunctions();

    console.log(document.cookie);
    if (document.cookie) {
      showAccount();
    }

    try {
      await getVehicles();
    } catch (err) {

    }
  }

  /**
   * Adds the event listener necessary for toggling the login popup
   */
  function toggleLoginForm() {
    id("profile-btn").addEventListener("click", profileButtonBehavior);
  }

  /**
   * helper function that limits certain behavior when clicking profile button
   */
  function profileButtonBehavior() {
    let signUpHidden = id("sign-up-form").classList.contains("hidden");
    let cartHidden = id("cart").classList.contains("hidden");
    if (signUpHidden && cartHidden) {
      toggleForm("log-in-form");
    }
  }

  /**
   * Adds the event listener necessary for toggling the cart into view
   */
  function toggleCart() {
    id("cart-btn").addEventListener("click", cartButtonBehavior);
  }

  /**
   * helper function that limits certain behavior when clicking cart button
   */
  function cartButtonBehavior() {
    let logInHidden = id("log-in-form").classList.contains("hidden");
    let signUpHidden = id("sign-up-form").classList.contains("hidden");
    let accountHidden = id("account-form").classList.contains("hidden");
    if (logInHidden && signUpHidden && accountHidden) {
      toggleForm("cart");
    }
  }

  /**
   * intiliazes button for adding selected item to cart
   */
  function addToCartButtonBehavior() {
    id("add-to-cart-btn").addEventListener("click", addItemToCart);
  }

  /**
   * adds the selected item to the cart
   */
  function addItemToCart() {
    removeEmptyCartMessage();
    let vehicleName = id("selected-name").textContent;
    let price = id("selected-price").textContent;
    let stock = id("selected-stock").textContent;
    let vehicleImg = id("selected-img").src;
    let vehicleImgAlt = id("selected-img").alt;

    let card = gen("div");
    card.classList.add("cart-card");

    let img = gen("img");
    img.src = vehicleImg;
    img.alt = vehicleImgAlt;
    img.classList.add("cart-img");
    card.appendChild(img);

    let infoContainer = gen('div');
    infoContainer.classList.add('cart-card-info');

    let title = gen("h1");
    title.textContent = vehicleName;
    title.classList.add("cart-card-title");
    infoContainer.appendChild(title);

    let cardPrice = gen("h2");
    cardPrice.textContent = "$" + price;
    cardPrice.classList.add("cart-card-price");
    infoContainer.appendChild(cardPrice);

    let countContainer = gen("div");
    countContainer.classList.add("cart-card-count-container");

    let decrementButton = gen("button");
    decrementButton.textContent = "-";
    decrementButton.classList.add("count-btn");
    countContainer.appendChild(decrementButton);

    let count = gen("span");
    count.textContent = "1";
    count.classList.add("cart-card-count");
    countContainer.appendChild(count);

    let incrementButton = gen("button");
    incrementButton.textContent = "+";
    incrementButton.classList.add("count-btn");
    countContainer.appendChild(incrementButton);
    infoContainer.appendChild(countContainer);

    card.appendChild(infoContainer);

    id("cart").appendChild(card);
  }

  /**
   * helper function that removes the empty cart messsage when
   * an item is added
   */
  function removeEmptyCartMessage() {
    if(!id("empty-cart-message").classList.contains('hidden')) {
      id("empty-cart-message").classList.add("hidden");
    }
  }

  /**
   * Adds the event listener necessary for navigating between login
   * and signup forms
   */
  function navigateBetweenForms() {
    id("log-in-link").addEventListener("click", switchForms);
    id("sign-up-link").addEventListener("click", switchForms);
  }

  /**
   * Toggles which form is displayed to the user
  */
  function switchForms() {
    toggleForm("log-in-form");
    toggleForm("sign-up-form");
  }

  /**
   * initializes event listeners for closing log in and
   * sign up forms
   */
  function closeForms() {
    qs("#log-in-form .close").addEventListener("click", () => {
      toggleForm("log-in-form");
    });

    qs("#sign-up-form .close").addEventListener("click", () => {
      toggleForm("sign-up-form");
    });

    qs("#cart .close").addEventListener("click", () => {
      toggleForm("cart");
    });

    qs("#account-form .close").addEventListener("click", () => {
      toggleForm("account-form");
    });

    qs("#deposit-form .close").addEventListener("click", () => {
      toggleForm("deposit-form");
    })

    id("main-container").addEventListener("click", () => {
      hideForm("log-in-form");
      hideForm("sign-up-form");
      hideForm("account-form");
    });

    qs(".search-bar-container").addEventListener("click", () => {
      hideForm("log-in-form");
      hideForm("sign-up-form");
      hideForm("account-form");
    });
  }


  /**
   * helper function that toggles a given form in our out of view
   * @param {string} formId - id of the form to toggle
   */
  function toggleForm(formId) {
    id(formId).classList.toggle("hidden");
  }

  /**
   * hides a given form out of view
   * @param {string} formId - id of the form to toggle
   */
  function hideForm(formId) {
    id(formId).classList.add("hidden");
  }

  /**
   * changes how vehicles are displayed on main page
   */
  function changeCardView() {
    let cards = qsa(".vehicle-card");
    for (let i = 0; i < cards.length; i++) {
      if (this.value === "compact") {
        cards[i].classList.add("compact");
      } else {
        cards[i].classList.remove("compact");
      }
    }
  }

  /**
   * get data of vehicles from API
   */
  async function getVehicles() {
    try {
      const type = qs("input[name=type]:checked").value;
      const price = qs("input[name=price]:checked").value;
      let resp = await fetch("/vehicles?type=" + type +"&maxPrice=" + price);
      await statusCheck(resp);
      resp = await resp.text();
      await displayVehicles(resp);
    } catch (err) {
      let txt = gen("p");
      let board = id("main-container");
      board.appendChild(txt);
    }
  }

  /**
   * displays vehicles on main page
   * @param {string} resp - name of all vehicles to be displayed
   */
  async function displayVehicles(resp) {
    try {
      id("vehicles-view").innerHTML = "";
      const vehicles = resp.trim().split("\n");
      for (let i = 0; i < vehicles.length; i++) {
        let resp = await fetch("/vehicles/" + vehicles[i]);
        resp = await resp.json();
        makeVehicleCard(resp);
      }
    } catch (err) {

    }
  }

  /**
   * creates and adds vehicle card on main page
   * @param {Object} resp - info of vehicle to make a card
   */
  function makeVehicleCard(resp) {
    let card = gen("section");
    card.classList.add("vehicle-card");
    if (qs("input[name=layout]:checked").value === "compact") {
      card.classList.add("compact");
    }
    let name = gen("h2");
    name.textContent = resp["name"];
    let pic = gen("img");
    pic.src = resp["picture"];
    pic.alt = resp["name"];
    let price = gen("p");
    price.textContent = "$" + resp["price"];
    card.appendChild(name);
    card.appendChild(pic);
    card.appendChild(price);
    card.addEventListener("click", function() {
      vehiclePage(resp);
    })
    id("vehicles-view").appendChild(card);
  }

  /**
   * shows a page for a selected vehicle with more details
   * @param {Object} resp - info of vehicle to show more details
   */
  async function vehiclePage(resp) {
    try {
      id("info-container").innerHTML = "";
      vehicleInfo(resp);
      await vehicleReview(resp["name"]);
    } catch (err) {

    }
  }

  /**
   * displays information of a specific vehicle
   * @param {Object} resp - information of a specific vehicle
   */
  function vehicleInfo(resp) {
    id("vehicle-container").classList.remove("hidden");
    id("main-container").classList.add("hidden");
    let name = gen("h1");
    name.textContent = resp["name"];
    let price = gen("p");
    price.textContent = "$" + resp["price"];
    let inStock = gen("p");
    inStock.textContent = resp["in-stock"] + " left!";
    let rating = gen("p");
    if (resp["rating"] !== null) {
      rating.textContent = "Rating: " + (Math.round(resp["rating"] * 100) / 100) + "/5";
    } else {
      rating.textContent = "No Ratings Yet!"
    }
    let pic = gen("img");
    pic.src = resp["picture"];
    pic.alt = resp["name"];
    let info = gen("div");
    info.appendChild(name);
    info.appendChild(price);
    info.appendChild(inStock);
    info.appendChild(rating);
    id("info-container").appendChild(info);
    id("info-container").appendChild(pic);
  }

  /**
   * retrieves all reviews for a vehicle
   * @param {string} name - name of the vehicle
   */
  async function vehicleReview(name) {
    try {
      let resp = await fetch("/reviews/" + name);
      await statusCheck(resp);
      resp = await resp.json();
      id("reviews").innerHTML = "";
      displayReviews(resp, false);
    } catch (err) {

    }
  }

  /**
   * displays all reviews for a certain vehicle
   * @param {Object} resp - all reviews for a vehicle
   * @param {boolean} add - whether the review was just added
   */
  function displayReviews(resp, add) {
    if (resp.length === 0) {
      id("no-reviews").classList.remove("hidden");
      id("reviews").style.height = "0px";
    } else {
      id("no-reviews").classList.add("hidden");
      id("reviews").style.height = "400px";
    }
    for (let i = 0; i < resp.length; i++) {
      let review = gen("section");
      review.classList.add("review-card");
      let user = gen("h3");
      user.textContent = resp[i]["user"];
      let rating = gen("p");
      rating.textContent = "Rating: " + resp[i]["rating"];
      let comment = gen("p");
      comment.textContent = resp[i]["comment"];
      let date = gen("p");
      date.textContent = (new Date(resp[i]["date"])).toLocaleString();
      review.appendChild(user);
      review.appendChild(rating);
      review.appendChild(comment);
      review.appendChild(date);
      if (add) {
        id("reviews").prepend(review);
      } else {
        id("reviews").appendChild(review);
      }
    }
  }

  /**
   * shows form where users can add a review to a vehicle
   */
  function addReview() {
    id("add-review").classList.remove("hidden");
    id("rate").selectedIndex = 0;
    qs("#add-review input").value = "";
  }

  /**
   * adds a review to a vehicle
   */
  async function submitReview() {
    try {
      let vehicle = qs("#info-container h1").textContent;
      let username = document.cookie.split("=")[1];
      let rating = id("rate").value;
      let comment = qs("#add-review input").value;
      let data = new FormData();
      data.append("vehicle", vehicle);
      data.append("user", username);
      data.append("rating", rating);
      data.append("comment", comment);
      let resp = await fetch("/reviews/new", {method: "POST", body: data});
      await statusCheck(resp);
      resp = await resp.json();
      let arr = [];
      arr.push(resp);
      displayReviews(arr, true);
      id("add-review").classList.add("hidden");
    } catch (err) {

    }
  }

  /**
   * sets up how buttons on main page behave
   */
  function mainPageBehaviors() {
    qs("header > nav > div").addEventListener("click", home);
    id("reset").addEventListener("click", resetFilter);
    qs("#filter-container form").addEventListener("submit", async function(evt) {
      evt.preventDefault();
      await getVehicles();
    });
    document.getElementsByName("layout")[0].addEventListener("click", changeCardView);
    document.getElementsByName("layout")[1].addEventListener("click", changeCardView);
  }

  /**
   * sets up how buttons on vehicle view behave
   */
  function vehicleViewBehaviors() {
    qs("#rating-container > button").addEventListener("click", addReview);
    id("add-review").addEventListener("submit", async function(evt) {
      evt.preventDefault();
      await submitReview();
    });
    qs("#action-container > button").addEventListener("click", mainPageView);
  }

  /**
   * displays the main page
   */
  async function home() {
    try {
      await resetFilter();
      mainPageView();
    } catch (err) {

    }
  }

  /**
   * displays the main page
   */
  function mainPageView() {
    id("main-container").classList.remove("hidden");
    id("vehicle-container").classList.add("hidden");
    id("history-page").classList.add("hidden");
  }

  /**
   * reset vehicle filters to default values
   */
  async function resetFilter() {
    qs("input[name=type]").checked = true;
    qs("input[name=price]").checked = true;
    try {
      await getVehicles();
    } catch (err) {

    }
  }

  /**
   * sets up signing up and logging in
   */
  function userFormBehaviors() {
    qs("#sign-up-form form").addEventListener("submit", async function(evt) {
      evt.preventDefault();
      await signUp();
    });
    qs("#log-in-form form").addEventListener("submit", async function(evt) {
      evt.preventDefault();
      await logIn();
    });
  }

  /**
   * signs up a user
   */
  async function signUp() {
    if (id("set-password").value === id("confirm-password").value) {
      qs("#sign-up-form > form > p").classList.add("hidden");
      try {
        let data = new FormData();
        data.append("username", id("create-user").value);
        data.append("email", id("create-email").value);
        data.append("password", id("set-password").value);
        let resp = await fetch("/account/create", {method: "POST", body: data});
        await statusCheck(resp);
        resp = await resp.json();
        await userLogIn(resp["username"], resp["password"]);
      } catch (err) {

      }
    } else { // passwords don't match
      qs("#sign-up-form > form > p").classList.remove("hidden");
    }
  }

  /**
   * logs in a user
   */
  async function logIn() {
    try {
      await userLogIn(id("login-user").value, id("login-password").value);
    } catch (err) {

    }
  }

  /**
   * logs in a user
   */
  async function userLogIn(username, password) {
    try {
      let data = new FormData();
      data.append("username", username);
      data.append("password", password);
      let resp = await fetch("/login", {method: "POST", body: data});
      await statusCheck(resp);
      showAccount();
    } catch (err) {

    }
  }

  /**
   * turns profile button for guest user to my account for logged-in users
   */
  function showAccount() {
    id("profile-btn").classList.add("hidden");
    id("account-btn").classList.remove("hidden");
    hideForm("sign-up-form");
    hideForm("log-in-form");
  }

  /**
   * add event listeners to my account buttons
   */
  function accountFunctions() {
    id("account-btn").addEventListener("click", accountButtonBehavior);
    id("deposit").addEventListener("click", async function() {
      await deposit();
    });
    id("confirm-deposit").addEventListener("click", async function(evt) {
      evt.preventDefault();
      await makeDeposit();
    })
    id("history").addEventListener("click", async function() {
      await history();
    });
    id("log-out").addEventListener("click", async function() {
      await logOut();
    });
  }

  /**
   * shows account menu with different buttons for different actions
   */
  function accountButtonBehavior() {
    let cart = id("cart").classList.contains("hidden");
    let deposit = id("deposit-form").classList.contains("hidden");
    if (cart && deposit) {
      toggleForm("account-form");
    }
  }

  /**
   * shows the deposit form where user's can make deposit
   */
  async function deposit() {
    id("account-form").classList.add("hidden");
    try {
      let cart = id("cart").classList.contains("hidden");
      if (cart && deposit) {
        toggleForm("deposit-form");
      }
      await getMyBalance();
    } catch (err) {

    }
  }

  /**
   * retrieves a logged-in user's balance
   */
  async function getMyBalance() {
    try {
      let username = document.cookie.split("=")[1];
      let data = new FormData();
      data.append("user", username);
      let resp = await fetch("/balance", {method: "POST", body: data});
      resp = await resp.text();
      id("current-balance").textContent = "My Current Balance: $" + resp;
    } catch (err) {

    }
  }

  /**
   * makes deposit for a logged-in user
   */
  async function makeDeposit() {
    try {
      let username = document.cookie.split("=")[1];
      let amount = qs("#deposit-form form input").value;
      let data = new FormData();
      data.append("user", username);
      data.append("amount", amount);
      let resp = await fetch("/deposit", {method: "POST", body: data});
      qs("#deposit-form form input").value = "";
      id("deposit-form").classList.add("hidden");
      resp = await resp.text();
      await showMessage(resp);
    } catch (err) {

    }
  }

  /**
   * retieves transaction history of a logged-in user
   */
  async function history() {
    try {
      let username = document.cookie.split("=")[1];
      let data = new FormData();
      data.append("user", username);
      let resp = await fetch("/account/history", {method: "POST", body: data});
      resp = await resp.json();
      showHistory(resp);
    } catch (err) {

    }
  }

  /**
   * shows the transaction history of a user
   * @param {Object} resp - data for all transactions made by a user
   */
  function showHistory(resp) {
    id("account-form").classList.add("hidden");
    id("main-container").classList.add("hidden");
    id("vehicle-container").classList.add("hidden");
    id("history-page").classList.remove("hidden");
    for (let i = 0; i < resp.length; i++) {
      let entry = gen("section");
      entry.classList.add("history-card");
      let code = gen("p");
      code.textContent = resp[i]["code"];
      let vehicle = gen("p");
      vehicle.textContent = resp[i]["vehicle"];
      let date = gen("p");
      date.textContent = (new Date(resp[i]["date"])).toLocaleString();
      entry.appendChild(code);
      entry.appendChild(vehicle);
      entry.appendChild(date);
      id("previous-purchases").appendChild(entry);
    }
  }

  /**
   * allows a logged-in user to log out
   */
  async function logOut() {
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    id("account-form").classList.add("hidden");
    id("account-btn").classList.add("hidden");
    id("profile-btn").classList.remove("hidden");
    try {
      await home();
    } catch (error) {

    }
  }

  /**
   * displays a helpful message when certain actions are performed
   * @param {string} msg - message to be displayed
   */
  async function showMessage(msg) {

  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Note: You may use these in your code, but remember that your code should not have
   * unused functions. Remove this comment in your own code.
   */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Checks status from API response and throws error if needed   *
   * @param {Response} res - response from API
   * @returns {Response} response from API
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }
})();