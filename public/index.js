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
   * TODO: Describe what your init function does here.
   */
  function init() {
    let filterButton = qs("#filter-container form");
    filterButton.addEventListener("submit", function(evt) {
      evt.preventDefault();
      getVehicles();
    });

    filterBehavior();
    toggleLoginForm();
  }

  /**
   * Adds the event listener necessary for toggling the login popup
   */
  function toggleLoginForm() {
    id("profile-btn").addEventListener("click", () => {
      id("log-in-form").classList.toggle("hidden");
    });
  }

  /**
   * get data of vehicles from API
   */
  async function getVehicles() {
    try {
      let resp = await fetch("abc");
      await statusCheck(resp);
    } catch (err) {
      let txt = gen("p");
      let board = id("main-container");
      board.appendChild(txt);
    }
  }

  /**
   * Set up how inputs for filters should behave
   */
  function filterBehavior() {
    let allTypeButton = qs("#type-filter input");
    allTypeButton.addEventListener("click", changeTypeButtons);

    let typeButtons = qsa("#type-filter input");
    for (let i = 1; i < typeButtons.length; i++) {
      typeButtons[i].addEventListener("click", changeAllTypeButton);
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