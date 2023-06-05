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
  let cartObj = {};
  let cartPurchase = false;
  let singlePurchase = {};
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
    toggleCheckoutScreen();
    navigateBetweenForms();
    closeForms();
    buyNowButtonBehavior();
    addToCartButtonBehavior();
    backFromVehicleView();
    backFromCheckout();
    updateCartObjFromLocalStorage();
    vehicleViewBehaviors();
    userFormBehaviors();
    accountFunctions();
    confirmPurchase();
    messageButtonBehavior();
    renderCartItemsFromLocalStorage()

    console.log(document.cookie);
    if (document.cookie) {
      showAccount();
    }

    try {
      await getVehicles();
    } catch (err) {
      showMessage(err["message"]);
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
    let checkoutHidden = id("check-out-container").classList.contains("hidden");
    if (logInHidden && signUpHidden && accountHidden && checkoutHidden) {
      toggleForm("cart");
    }
  }

  /**
   * initializes toggling the checkout screen whent he checkout
   * button in the cart is clicked
   */
  function toggleCheckoutScreen() {
    id("check-out-btn").addEventListener("click", () => {
      hideCurrentView();
      cartPurchase = true;
      goToCheckout(Object.values(cartObj));
    })
  }

  /**
   * helper function that hides the current view when the checkout button
   * is clicked
   */
 function hideCurrentView() {
   let currentView = "";
   if (!id("main-container").classList.contains("hidden")) {
     currentView = "main-container";
   } else {
     currentView = "vehicle-container";
   }
   id(currentView).classList.add("hidden");
   id("cart").classList.add("hidden");
   id("check-out-container").classList.remove("hidden");
 }

 /**
   * go to checkout view where users can confirm purchase
   * @param {Object} vehicles - all vehicles in checkout stage
   */
  function goToCheckout(vehicles) {
    console.log(vehicles);
    id("check-out-contents").innerHTML = "";
    for (let i = 0; i < vehicles.length; i++) {
      addVehicleToCheckout(vehicles[i]);
    }
  }

  function addVehicleToCheckout(info) {
    console.log(info);
    let entry = gen("section");
    entry.classList.add("vehicle-checkout");
    let name = gen("h3");
    name.textContent = info["name"];
    let pic = gen("img");
    pic.src = info["img-src"];
    pic.alt = info["img-alt"];
    let count = gen("p");
    count.textContent = "Quantity: " + info["count"];
    let price = gen("p");
    price.textContent = "$" + info["price"] + " x " + info["count"];
    entry.appendChild(name);
    entry.appendChild(pic);
    entry.appendChild(count);
    entry.appendChild(price);
    id("check-out-contents").appendChild(entry);
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
    });

    qs(".search-bar-container").addEventListener("click", () => {
      hideForm("log-in-form");
      hideForm("sign-up-form");
    });
  }

  /**
   * toggles the home screen back into view when the "Back to Searching!"
   * button is clicked on the selected vehicle view and clears the
   * vehicle info card
   */
  function backFromVehicleView() {
    id("vehicle-view-back-btn").addEventListener("click", () => {
      id("vehicle-container").classList.add("hidden");
      id("main-container").classList.remove("hidden");
      id("info-container").innerHTML = "";
    });
  }

  /**
   * toggles the home screen back into view when the "Back to Searching!"
   * button is clicked on the checkout screen and clears the
   * checkout screen content
   */
  function backFromCheckout() {
    id("check-out-back-btn").addEventListener("click", () => {
      id("check-out-container").classList.add("hidden");
      id("main-container").classList.remove("hidden");
      id("info-container").innerHTML = "";
    });
  }

  /**
   * confirms purchase in checkout view
   */
  function confirmPurchase() {
    id("confirm-purchase-btn").addEventListener("click", async () => {
      await makePurchase();
    })
  }

  async function makePurchase() {
    try {
      let username = document.cookie.split("=")[1];
      let data = new FormData();
      data.append("user", username);
      console.log(JSON.stringify(cartObj));
      if (cartPurchase) {
        data.append("purchase", JSON.stringify(cartObj));
        cartObj = {};
        window.localStorage.removeItem("cart");
      } else {
        data.append("purchase", JSON.stringify(singlePurchase));
      }
      let resp = await fetch("/purchase", {method: "POST", body: data});
      await statusCheck(resp);
      resp = await resp.text();
      showMessage("Purchase Successful! Your Transaction Code is " + resp);
    } catch (err) {
      showMessage(err["message"]);
    }
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
   * updates the module global variable for the cart from local storage
   */
  function updateCartObjFromLocalStorage(){
    if (window.localStorage.getItem("cart")) {
      cartObj = JSON.parse(window.localStorage.getItem("cart"));
    }
  }

  /**
   * renders the cart items from localStroage if non-empty
   */
  function renderCartItemsFromLocalStorage() {
    if (window.localStorage.getItem("cart")) {
      let vehicles = Object.values(JSON.parse(window.localStorage.getItem("cart")));
      for (let i = 0; i < vehicles.length; i++) {
        let vehicleID = vehicles[i].id;
        let imgSrc = vehicles[i]["img-src"];
        let imgAlt = vehicles[i]["img-alt"];
        let name = vehicles[i].name;
        let price = vehicles[i].price;
        let card = gen("div");
        card.classList.add("cart-card");
        card.id = vehicleID;

        let img = genVehicleImage(imgSrc, imgAlt);
        card.appendChild(img);

        let infoContainer = genVehicleInfoContainer(name, price, vehicleID);
        card.appendChild(infoContainer);

        id("cart-card-container").appendChild(card);
        calculateCartTotal(vehicles[i]);
      }
    }
  }

  /**
   * helper function that calculates the cart totals when
   * the cart is rendered from localStorage
   * @param {Object} vehicle - vehicle that is in the cart
   */
  function calculateCartTotal(vehicle) {
    for(let i = 0; i < vehicle.count; i++) {
      incrementCartItemCount(vehicle.id);
      incrementCartTotal(vehicle.id, vehicle.price);
      if (i > 0) {
        incrementVehicleCartCount(vehicle.id, false);
      }
    }
  }

  /**
   * intiliazes button for adding selected item to cart
   */
  function addToCartButtonBehavior() {
    id("add-to-cart-btn").addEventListener("click", addItemToCart);
  }

  /**
   * intiliazes button for buy now
   */
  function buyNowButtonBehavior() {
    id("buy-now").addEventListener("click", async function() {
      hideCurrentView();
      cartPurchase = false;
      await buyNow();
    });
  }

  async function buyNow() {
    try {
      singlePurchase = {};
      let vehicleID = id("selected-name").textContent.split(" ").join("-").toLowerCase();
      singlePurchase[vehicleID] = createLocalStorageObject();
      console.log(singlePurchase);
      console.log(cartObj);
      await goToCheckout(Object.values(singlePurchase));
    } catch (err) {
      showMessage(err["message"]);
    }
  }

  /**
   * adds the selected item to the cart
   */
  function addItemToCart() {
    let vehicleObj= createLocalStorageObject();
    let vehicleImg = vehicleObj["img-src"];
    let vehicleImgAlt = vehicleObj["img-alt"];
    let vehicleName = vehicleObj["name"];
    let vehicleID = vehicleObj["id"];
    let price = vehicleObj["price"];
    incrementCartTotal(vehicleID, parseInt(price));
    incrementCartItemCount(vehicleID);

    if (qs(`#cart-card-container #${vehicleID}`)) {
      incrementVehicleCartCount(vehicleID, true);
    } else {
      cartObj[vehicleID] = vehicleObj;
      window.localStorage.setItem("cart", JSON.stringify(cartObj));
      let card = gen("div");
      card.classList.add("cart-card");
      card.id = vehicleID;

      let img = genVehicleImage(vehicleImg, vehicleImgAlt);
      card.appendChild(img);

      let infoContainer = genVehicleInfoContainer(vehicleName, price, vehicleID);
      card.appendChild(infoContainer);

      id("cart-card-container").appendChild(card);
    }
    console.log(cartObj);
    console.log(JSON.stringify(cartObj));
  }

  /**
   * creates an object for storing data about a particular vehicle that is
   * added to the cart to local storage
   * @returns {Object} - object containing data about a particular vehicle
   */
  function createLocalStorageObject() {
    let vehicleName = id("selected-name").textContent;
    let vehicleID = vehicleName.split(" ").join("-").toLowerCase();
    let vehicleImg = "img/vehicles/" + vehicleID + ".png";
    let vehicleImgAlt = id("selected-img").alt;
    let price = id("selected-price").textContent;
    let vehicleObj = {};
    vehicleObj["name"] = vehicleName;
    vehicleObj["id"] = vehicleID;
    vehicleObj["img-src"] = vehicleImg;
    vehicleObj["img-alt"] = vehicleImgAlt;
    vehicleObj["price"] = parseInt(price);
    vehicleObj["count"] = 1;
    console.log(vehicleObj);
    return vehicleObj;
  }

  /**
   * helper method that adds/removes information elements when the cart
   * is empty vs non-empty
   */
  function cartEmptyToggles() {
    id("empty-cart-message").classList.toggle("hidden");
    id("check-out-btn").classList.toggle("hidden");
    id("cart-info").classList.toggle("hidden");
    id("cart-card-container").classList.toggle("hidden");
  }

  /**
   * helper function that generates the vehicle image
   * for a card in the cart
   * @param {string} source - source of image
   * @param {string} alt - alt text for image
   * @returns {HTMLElement} - img element of vehicle
   */
  function genVehicleImage(source, alt) {
    let img = gen("img");
    img.src = source;
    img.alt = alt;
    img.classList.add("cart-img");
    return img;
  }

  /**
   * helper function that generates the elements for the
   * info portion of the vehicle card in the cart
   * @param {string} vehicleName - name of vehicle
   * @param {string} price - price of vehicle
   * @param {string} vehicleID - id of vehicle
   * @returns {HTMLElement} - div containing info elements
   */
  function genVehicleInfoContainer(vehicleName, price, vehicleID) {
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

    let countContainer = genCountContainer(price, vehicleID);
    infoContainer.appendChild(countContainer);
    return infoContainer;
  }

  /**
   * helper function that generates elements for the increment
   * and decrement functionality for a vehicle card in the cart
   * @param {string} price - vehicle price
   * @param {string} vehicleID - vehicle id
   * @returns {HTMLElement} - div containing count and inc/dec buttons
   */
  function genCountContainer(price, vehicleID) {
    let countContainer = gen("div");
    countContainer.classList.add("cart-card-count-container");

    let decrementButton = gen("button");
    decrementButton.textContent = "-";
    decrementButton.classList.add("count-btn");
    decrementButton.addEventListener("click", () => {
      decrementCartItemCount();
      decrementCartTotal(parseInt(price));
      decrementVehicleCartCount(vehicleID);
    });
    countContainer.appendChild(decrementButton);

    let count = gen("span");
    count.textContent = "1";
    count.classList.add("cart-card-count");
    countContainer.appendChild(count);

    let incrementButton = gen("button");
    incrementButton.textContent = "+";
    incrementButton.classList.add("count-btn");
    incrementButton.addEventListener("click", () => {
      incrementCartItemCount(vehicleID);
      incrementCartTotal(vehicleID, parseInt(price));
      incrementVehicleCartCount(vehicleID, true);
    });
    countContainer.appendChild(incrementButton);
    return countContainer;
  }

  /**
   * helper function that increments the count of items in the cart when
   * and item is added
   * @param {string} vehicleID - vehicle id
   */
  function incrementCartItemCount(vehicleID) {
    let currentCount = parseInt(id("cart-items").textContent);
    if (currentCount === 0) {
      cartEmptyToggles();
    }
    if (enoughInStock(vehicleID)) {
      id("cart-items").textContent = currentCount + 1;
    }
  }

  /**
   * helper function that increments the total cost of items in the cart when
   * and item is added
   * @param {string} vehicleID - vehicle id
   * @param {string} currentCost - vehicle price
   */
  function incrementCartTotal(vehicleID, currentCost) {
    if (enoughInStock(vehicleID)) {
      id("cart-total").textContent = parseInt(id("cart-total").textContent) + currentCost;
    }
  }

  /**
   * helper function that increments the count for a particular vehicle card
   * in the cart if there is enough in stock
   * @param {string} vehicleID - vehicle id
   * @param {boolean} updateLocalStorage - flag for if local storage should be updated
   */
  function incrementVehicleCartCount(vehicleID, updateLocalStorage) {
    let currentCount = qs(`#${vehicleID} .cart-card-count`);
    if (enoughInStock(vehicleID)) {
      currentCount.textContent = parseInt(currentCount.textContent) + 1;
      if (updateLocalStorage) {
        cartObj[vehicleID]["count"] += 1;
        window.localStorage.setItem("cart", JSON.stringify(cartObj));
      }
    }
  }

  /**
   * helper function that decrements the count of items in the cart when
   * and item is added
   */
  function decrementCartItemCount() {
    let numItems = parseInt(id("cart-items").textContent);
    if (numItems > 1) {
      id("cart-items").textContent = parseInt(id("cart-items").textContent) - 1;
    } else {
      id("cart-items").textContent = 0;
      cartEmptyToggles();
    }
  }

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

    qs("#account-form .close").addEventListener('click', () => {
      toggleForm("account-form");
    });

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
   * helper function that decrements the total cost of items in the cart when
   * and item is added
   * @param {number} currentCost - cost of selected vehicle
   */
  function decrementCartTotal(currentCost) {
    let currentTotal = parseInt(id("cart-total").textContent);
    if (currentTotal - currentCost > 0) {
      id("cart-total").textContent = parseInt(id("cart-total").textContent) - currentCost;
    } else {
      id("cart-total").textContent = 0;
    }
  }

   /**
   * helper function that decrements the count for a particular vehicle card
   * in the cart
   * @param {string} vehicleID - id of the vehicle card we want to increment
   * the count for
   */
  function decrementVehicleCartCount(vehicleID) {
    let currentCount = qs(`#${vehicleID} .cart-card-count`);
    if (parseInt(currentCount.textContent) > 1) {
      currentCount.textContent = parseInt(currentCount.textContent) - 1;
      cartObj[vehicleID]["count"] -= 1;
    } else {
      id("cart-card-container").removeChild(id(vehicleID))
      delete cartObj[vehicleID];
    }
    window.localStorage.setItem("cart", JSON.stringify(cartObj));
  }

  /**
   * helper function that checks if there is enough vehicles in stock
   * to add to the cart
   * @returns {boolean} - true if there are enough vehicles in stock to add to cart,
   * fals otherwise
   */
  function enoughInStock(vehicleID) {
    let currentCount = qs(`#${vehicleID} .cart-card-count`);
    let selectedStock = id("selected-stock");
    return (!currentCount || !selectedStock) ||
    (parseInt(currentCount.textContent) < parseInt(selectedStock.textContent));
  }

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
      showMessage(err["message"]);
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
      showMessage(err["message"]);
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
      showMessage(err["message"]);
    }
  }

  /**
   * displays information of a specific vehicle
   * @param {Object} resp - information of a specific vehicle
   */
  function vehicleInfo(resp) {
    id("vehicle-container").classList.remove("hidden");
    id("main-container").classList.add("hidden");

    let info = genVehicleInfoElements(resp);

    let pic = gen("img");
    pic.src = resp["picture"];
    pic.alt = resp["name"];
    pic.id = "selected-img";

    id("info-container").appendChild(info);
    id("info-container").appendChild(pic);
  }

  /**
   * helper function that generates the html elements for displaying a vehicles
   * info on the page
   * @param {JSON} resp
   * @returns {HTMLElement} - div containing the info for a particular vehicle
   */
  function genVehicleInfoElements(resp) {
    let name = gen("h1");
    name.id = "selected-name";
    name.textContent = resp["name"];

    let price = gen("p");
    price.textContent = "$";
    let priceAmount = gen("span");
    priceAmount.textContent = resp["price"];
    priceAmount.id = "selected-price";
    price.appendChild(priceAmount);

    let inStock = gen("p");
    inStock.textContent = " left!";
    let inStockAmount = gen("span");
    inStockAmount.textContent = resp["in-stock"];
    inStockAmount.id = "selected-stock";
    inStock.prepend(inStockAmount);

    let rating = genVehicleRating(resp);

    let info = gen("div");
    info.appendChild(name);
    info.appendChild(price);
    info.appendChild(inStock);
    info.appendChild(rating);

    return info;
  }

  /**
   * helper function that generates the html elements for displaying a vehicles
   * rating on the page
   * @param {JSON} resp
   * @returns {HTMLElement} - paragraph containing the vehicle rating if present,
   * or "No Ratings Yet!" if not
   */
  function genVehicleRating(resp) {
    let rating = gen("p");
    console.log(resp);
    if (resp["rating"] !== null) {
      rating.textContent = "Rating: " + (Math.round(resp["rating"] * 100) / 100) + "/5";
    } else {
      rating.textContent = "No Ratings Yet!"
    }
    return rating;
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
      showMessage(err["message"]);
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
      showMessage("Review Added Successfully!");
    } catch (err) {
      console.log(err);
      showMessage(err["message"]);
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
      showMessage(err["message"]);
    }
  }

  /**
   * displays the main page
   */
  function mainPageView() {
    id("main-container").classList.remove("hidden");
    id("vehicle-container").classList.add("hidden");
    id("history-page").classList.add("hidden");
    id("check-out-container").classList.add("hidden");
    id("message-page").classList.add("hidden");
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
      showMessage(err["message"]);
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
        showMessage(err["message"]);
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
      showMessage(err["message"]);
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
      showMessage(err["message"]);
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
   * adds event listeners to various buttons
   */
  function messageButtonBehavior() {
    qs("#message-page button").addEventListener("click", async function() {
      await home();
    })
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
      showMessage(err["message"]);
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
      showMessage(err["message"]);
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
      showMessage(resp);
    } catch (err) {
      showMessage(err["message"]);
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
      showMessage(err["message"]);
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
    } catch (err) {
      showMessage(err["message"]);
    }
  }

  /**
   * displays a helpful message when certain actions are performed or when error occurs
   * @param {string} msg - message to be displayed
   */
  function showMessage(msg) {
    console.log(msg);
    qs("#message-page p").textContent = msg;
    id("message-page").classList.remove("hidden");
    id("main-container").classList.add("hidden");
    id("vehicle-container").classList.add("hidden");
    id("check-out-container").classList.add("hidden");
    id("history-page").classList.add("hidden");
    id("sign-up-form").classList.add("hidden");
    id("log-in-form").classList.add("hidden");
    id("account-form").classList.add("hidden");
    id("deposit-form").classList.add("hidden");
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