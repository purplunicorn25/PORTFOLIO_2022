"use strict";

/********************************************************************

Portfolio: Home Page
Anne Boutet
(✿◠‿◠)

The Home page of my Portfolio.

This program tracks the mouse movement and animates a serie of images as
a frame-by-frame video. The images represent an eclipse and the titles
of the projects are displayed on hover, meaning and the eclipse is total.

*********************************************************************/

// Constants
let CHECK_INTERVAL = 1;
let SCROLL_SPEED_DIVIDER = 4;
let THUMBNAIL_SIZE = 250;

// Variables
let projects = [];
let jsonLoaded = false;
let imgLoaded = false;
let visual = [];
let visualHTML = [];

let mouseIsOver = false;
let speedX = 0;
let speedY = 0;

let openWindown = [];

// Images
let buttonImage = "images/"

// When the document is loaded call setup
$(document).ready(preload);

// preload
//
// DGet JSON; Download the images before calling setup
function preload() {
  loadJSON();
  // Check if they are loaded
  let loading = setInterval(() => {
    if (imgLoaded === true && jsonLoaded === true) {
      // Call setup
      setup();
      // Clear the interval
      clearInterval(loading);
    }
  }, CHECK_INTERVAL)
}

// loadJSON
//
// Get data from JSON file, show error if fail, store data in global array if done
function loadJSON() {
  // Get the data from the JSON file
  $.getJSON("data/projects_data.json")
    .fail((request, textStatus, error) => {
      // Display the error in the console
      console.error(error);
    })
    .done((data) => {
      // Store the projects in an array
      projects = data.projects;
      // update boolean
      jsonLoaded = true;
      imgLoad();
    });
}

// framesLoad
//
// Preload the frames
function imgLoad() {
  for (let i = 0; i < projects.length; i++) {
    visual.push(projects[i].images);
  }
  if (visual.length == projects.length) {
    imgLoaded = true;
  }
}

// setup
//
// Display the images and numbers and animate everything
function setup() {
  variables();
  iniFlex();
  combineIMG();
  scrollParagraph();
}

// iniFlex
//
// Create a flexbox with boxes for each project
function iniFlex() {
  // Create array and text prior
  let divInsert = [];
  let divComp = "";
  // Add the title page
  divInsert.push(`<div class="pageTitle"><h1>&nbsp; B &nbsp; &nbsp;<br>A O P &nbsp;<br>N U O F<br>N T R O<br>E E T L<br>&nbsp; T - I<br>&nbsp; &nbsp; &nbsp; O</h1>
  <h6><a href="project/cv">C V</a><br><br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="mailto:anne.boutet@hotmail.com">C o n t a c t</a><br><br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a>A r c h i v e</a></h6></div>`);
  // State the correct number of divs
  for (let i = 0; i < projects.length; i++) {
    divInsert.push(`<div class="boxNumber" id="${i}"></div>`);
  }
  // Combine to create text
  for (let i = 0; i < divInsert.length; i++) {
    divComp = divInsert.join("");
  }

  // Create flexbox and append divs
  $('body').append(`<div class="flex-container">${divComp}</div>`);

  // Append Title and subtitles
  projectCell()
}

// projectCell
//
// Attach a specific title to each flexbox
function projectCell() {
  for (let i = 0; i < projects.length; i++) {
    // Center cells
    $(`#${i}`).css("margin", "auto");
    // Button to uncollapse
    $(`#${i}`).append(`<div class="buttonCollapse" id="buttonCollapse${i}">→</div>`);
    // Year
    $(`#${i}`).append(`<h3 class="year">${projects[i].year}</h3>`);
    // Title & Keywords
    $(`#${i}`).append(`<h3>${projects[i].name}</h3><h4>${projects[i].keywords}</h4>`);
    // Scrollable div
    $(`#${i}`).append(`<div class="info" id="info${i}"></div>`);
    // Description
    $(`#info${i}`).append(`<p>${projects[i].description}</p>`);
    // Link
    for (let ii = 0; ii < projects[i].link.length; ii++) {
      $(`#info${i}`).append(`<p><a class="links" target="_blank" href="${projects[i].link[ii].https}">${projects[i].link[ii].button}</a></p>`);
      // Only way to override a tag in css
      $(`.links`).css("text-decoration", "underline");
      console.log("link");
    }
  }
  expand();
  elongateButton();
}

// variables
//
// Array for if the open windows projects
function variables() {
  for (let i = 0; i < projects.length; i++) {
    let e = false;
    openWindown.push(e);
  }
}

// elongateButton
//
// Add more arrows on hover; Boolean for the side of the arrows
function elongateButton() {
  for (let i = 0; i < projects.length; i++) {
    $(`#buttonCollapse${i}`).mouseenter(() => {
      if (openWindown[i]) {
        $(`#buttonCollapse${i}`).append("<br>←<br>←<br>←<br>←<br>←<br>←<br>←");
      } else {
        $(`#buttonCollapse${i}`).append("<br>→<br>→<br>→<br>→<br>→<br>→<br>→");
      }
    }).mouseleave(() => {
      if (openWindown[i]) {
        $(`#buttonCollapse${i}`, this).empty();
        $(`#buttonCollapse${i}`, this).append("←");
      } else {
        $(`#buttonCollapse${i}`, this).empty();
        $(`#buttonCollapse${i}`, this).append("→");
      }
    });
  }
}

// combineIMG
//
//
function combineIMG() {
  // For each project
  for (let i = 0; i < projects.length; i++) {
    // Create array and text prior
    let divInsert = [];
    let divComp = "";
    // State the correct number of index (images)
    for (let ii = 0; ii < projects[i].images.length; ii++) {
      divInsert.push(`<img class="images" src="${projects[i].images[ii].src}"><div class="imgName">${projects[i].images[ii].name}</div><div class="imgSource">${projects[i].images[ii].source}</div>`);
      // Join the array to make text
      for (let ii = 0; ii < divInsert.length; ii++) {
        divComp = divInsert.join("");
      }
    }
    // The index of visualHTML corresponds to the number of projects
    visualHTML.push(divComp);
  }
}

// expand
//
//
function expand() {
  // On click expand the div flexbox and reveal images
  for (let i = 0; i < projects.length; i++) {
    $(`#buttonCollapse${i}`).click(() => {
      if (openWindown[i]) {
        $(`#${i}`).css("width", "450px");
        $(`#visual${i}`).remove();
        $(`.restore`).remove();
        openWindown[i] = false;
        console.log(openWindown);
      } else {
        openWindown[i] = true;
        elongateButton();
        $(`#${i}`).css("width", "35%");
        // Add the images
        $(`#${i}`).append(`<div class="visuals" id="visual${i}">${visualHTML[i]}</div>`);
        //Add videos
        if (projects[i].videos.length > 0) {
          $(`#visual${i}`).append(`<video width="100%" controls><source src="${projects[i].videos[0]}"></video>`);
        }
        // Up button
        $(`#${i}`).append(`<div class="restore">↑</div>`);
        $(`.restore`).click(() => {
          $(`#${i}`).animate({
            scrollTop: 0
          }, "slow");
          return false;
        });
      }
      scrollImages();
    });
  }
}

// scrollParagraph
//
// Turn vertical wheel movement into horizontal movement
// Slowdown scroll motions
function scrollParagraph() {
  // Check if the mouse in on a scrollable paragraph
  for (let i = 0; i < projects.length; i++) {
    let paragraph = document.getElementById(`info${i}`);
    document.addEventListener('mousemove', () => {
      paragraph.addEventListener('mouseover', () => {
        let rect = paragraph.getBoundingClientRect();
        // console.log(rect);
        if (rect.height > 500) {
          mouseIsOver = true;
          speedY = 0;
        }
      });
      paragraph.addEventListener('mouseout', () => {
        mouseIsOver = false;
      });
    });
  };
  scrollYtoX();
}

// scrollImages
//
//
function scrollImages() {
  for (let i = 0; i < projects.length; i++) {
    $(".visuals").mouseover(() => {
      mouseIsOver = true;
      speedY = 0;
    }).mouseout(() => {
      mouseIsOver = false;
    })
    break;
  }
}

//
//
//
function scrollYtoX() {
  // Transform Y in X
  document.addEventListener("wheel", (e) => {
    // Value of wheel movement in Y
    let scrollMotion = e.deltaY;
    // Pixel value of scroll X position
    let deltaX = window.scrollX;
    // Round value of the scroll length/speed
    if (mouseIsOver == true) {
      speedY = 0;
    } else {
      speedY = Math.abs(scrollMotion / SCROLL_SPEED_DIVIDER);
    }
    // If positive Y wheel movement positive increase, on the opposite decrease
    if (scrollMotion > 0) {
      $(window).scrollLeft(deltaX + speedY);
    } else if (scrollMotion < 0) {
      $(window).scrollLeft(deltaX - speedY);
    }
  });
  // Slow scrollX
  document.addEventListener("wheel", (e) => {
    // Value of wheel movement in Y
    let scrollMotion = e.deltaX;
    // Pixel value of scroll X position
    let deltaX = window.scrollX;
    // Round value of the scroll length/speed
    speedX = Math.abs(scrollMotion / SCROLL_SPEED_DIVIDER);
    if (scrollMotion > 0) {
      $(window).scrollLeft(deltaX + speedX);
    } else if (scrollMotion < 0) {
      $(window).scrollLeft(deltaX - speedX);
    }
  });
}