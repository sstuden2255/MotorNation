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
    let filterButton = qs("#filter-container form");
    filterButton.addEventListener("submit", async function(evt) {
      evt.preventDefault();
      await getVehicles();
    });

    filterBehavior();
    toggleLoginForm();
    toggleCart();
    navigateBetweenForms();
    closeForms();
    addToCartButtonBehavior();

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
    if (logInHidden && signUpHidden) {
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
    // TODO: hide empty shopping cart message
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
    count.classList.add("cart-cart-count");
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
    qs("#log-in-form .close").addEventListener('click', () => {
      toggleForm("log-in-form");
    });

    qs("#sign-up-form .close").addEventListener('click', () => {
      toggleForm("sign-up-form");
    });

    qs("#cart .close").addEventListener('click', () => {
      toggleForm("cart");
    });

    id("main-container").addEventListener("click", () => {
      hideForm("log-in-form");
      hideForm("sign-up-form");
    });

    qs(".search-bar-container").addEventListener("click", () => {
      hideForm("log-in-form");
      hideForm("sign-up-form");
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
      const vehicles = resp.split("\n");
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

  }

  /**
   * Set up how inputs for filters should behave
   */
  function filterBehavior() {
    let reset = id("reset");
    reset.addEventListener("click", resetFilter);
  }

  /**
   * TODO:
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
   * When all types is checked, every type is selected
   * when all type is unchecked, every type is unchecked
   */
  function changeTypeButtons() {
    let typeButtons = qsa("#type-filter input");
    for (let i = 1; i < typeButtons.length; i++) {
      if (this.checked) {
        typeButtons[i].checked = true;
      } else {
        typeButtons[i].checked = false;
      }
    }
  }

  /**
   * When all buttons are checked, all type will be checked automatically
   */
  function changeAllTypeButton() {
    let allChecked = true;
    let typeButtons = qsa("#type-filter input");
    for (let i = 1; i < typeButtons.length; i++) {
      if (!typeButtons[i].checked) {
        allChecked = false;
      }
    }
    qs("#type-filter input").checked = allChecked;
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