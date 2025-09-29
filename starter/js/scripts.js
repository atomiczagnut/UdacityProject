//Final Project for Udacity Nanodegree in FrontEnd Development
//By Colin Trierweiler
//JavaScript that manipulates a DOM of an exisiting (and fairly sparse), website.
//The point is to populate it with elements, especially cards that define projects
//It is meant to teach working with the DOM and JavaScript

//This is a default image in case anything fails

const placeHolderImage = "card_placeholder_bg.webp";

//Mobile breakpoint is a global variable

const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

//The spotlightProject needs to be a global variable, so I'm declaring it now

let spotlightProject = {};

//The spotlightProjectNum variable will make it easier to scroll though the array of projects with the arrows
//Setting it to zero will default to the first one

let spotlightProjectNum = 0;

//Global object.  It works, but is it best practice?
//Function to fix errors in paths by deleting the first '.' in the path string

function fixPath(pathToBeFixed) {
    return pathToBeFixed.slice(1);
};

//Logic for switching arrow handlers
let currentLeftHandler = null;
let currentRightHandler = null;

function updateArrowListeners(leftHandler, rightHandler) {
    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    //Remove existing listeners
    if (currentLeftHandler) {
        leftArrow.removeEventListener("click", currentLeftHandler);
        rightArrow.removeEventListener("click", currentRightHandler);
    };

    //Add new listeners
    currentLeftHandler = leftHandler;
    currentRightHandler = rightHandler;

    leftArrow.addEventListener("click", currentLeftHandler);
    rightArrow.addEventListener("click", currentRightHandler);
};

//Name in the title

const myName = "Colin Trierweiler";
const titleElement = document.querySelector("h1");
titleElement.textContent = myName;

//get the About Me data

async function getAboutMeData() {
    const aboutMeDataURL = "./data/aboutMeData.json";
    try {
        const response = await fetch(aboutMeDataURL);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
};

let aboutMeData = {
    aboutMe: "",
    headshot: ""
};

//Populate the About Me Section

getAboutMeData().then( response => {
    aboutMeData.aboutMe = response.aboutMe;
    aboutMeData.headshot = response.headshot;

    //About Me section

    const aboutMeContainer = document.querySelector("#aboutMe");

    //About Me text

    const aboutMeText = document.createElement("p");    
    aboutMeText.textContent = aboutMeData.aboutMe;
    aboutMeContainer.append(aboutMeText);

    //About Me headshot

    const headshotContainer = document.createElement("div");
    headshotContainer.classList.add("headshotContainer");

    const headshotImg = document.createElement("img");
    headshotImg.setAttribute("src", fixPath(aboutMeData.headshot));
    headshotImg.setAttribute("alt", "A headshot image");

    headshotContainer.append(headshotImg);
    aboutMeContainer.append(headshotContainer);
});

//Global object for the projects data
//Should it be an empty array that we populate with objects?

let projectsData = [];

//get the Projects data

async function getProjectsData() {
    const projectsDataURL = "./data/projectsData.json";
    try {
        const response = await fetch(projectsDataURL);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
};

//Create a class for your project card data

class ProjectCard {
    constructor(id, name, short_desc, long_desc, card_img, spotlight_img, url) {
        this.id = id;
        this.name = name;
        this.short_desc = short_desc;
        this.long_desc = long_desc;
        this.card_img = card_img;
        this.spotlight_img = spotlight_img;
        this.url = url;
    };

    //Method to build each card
    
    buildCard() {
        const projectCard = document.createElement("div");
        projectCard.classList.add("projectCard");
        projectCard.id = this.id;

        const cardName = document.createElement("h4");
        cardName.textContent = this.name;
        projectCard.append(cardName);

        const cardImage = document.createElement("img");
        cardImage.setAttribute("src", this.card_img);
        projectCard.append(cardImage);

        const cardText = document.createElement("p");
        cardText.textContent = this.short_desc;
        projectCard.append(cardText);

        //Attach event listener to each project card
        //Almost verbatim copied from a Google search about using event listeners with JSON
        //However, it still needed some tweaking

        projectCard.addEventListener("click", function(event) {
            const clickedProjectId = event.currentTarget.id;
            console.log(`Clicked ${clickedProjectId}`)
            spotlightProject = projectsData.find(p => p.id === clickedProjectId);
            console.log("Selected Project: ", spotlightProject.id);

            spotlightProject.buildProjectSpotlight();
        });

        return projectCard;
    };

    //Method to build the spotlight
    
    buildProjectSpotlight() {

        const spotlightContainer = document.querySelector("#projectSpotlight");
        const spotlightTitles = document.querySelector("#spotlightTitles");

        //Clear previous content
        spotlightTitles.innerHTML = "";

        //Build new spotlight
        spotlightContainer.style.backgroundImage = `url(${this.spotlight_img})`;

        const spotlightTitle = document.createElement("h3");
        spotlightTitle.textContent = this.name;
        spotlightTitles.append(spotlightTitle);

        const spotlightText = document.createElement("p");
        spotlightText.textContent = this.long_desc;
        spotlightTitles.append(spotlightText);

        const spotlightLink = document.createElement("a");
        spotlightLink.textContent = "Click here to see more...";
        spotlightLink.setAttribute("href", this.url);
        spotlightTitles.append(spotlightLink);

        return spotlightContainer;
    };
};

//Populate the project list with the project card data

const projectList = document.querySelector("#projectList");

getProjectsData().then( response => {
    for (let key in response ) {
        
        let project_id = response[key].project_id;
        let project_name = response[key].project_name;
        let short_description = response[key].short_description;
        let long_description = response[key].long_description;
        let cardImg = response[key].card_image || "./starter/images/card_placeholder_bg.webp";
        let card_img = fixPath(cardImg);
        let spotlightImg = response[key].spotlight_image || "./starter/images/spotlight_placeholder_bg.webp";
        let spotlight_img = fixPath(spotlightImg);
        let url = response[key].url;
    
        let projectCardInstance = new ProjectCard(project_id, project_name, short_description, long_description, card_img, spotlight_img, url) 
    
        projectsData.push(projectCardInstance);

        projectList.append(projectCardInstance.buildCard());

    };

    //Display the first project by default
    
    projectsData[0].buildProjectSpotlight();
    
    //Check initial state of media
    handleMediaChange(mobileBreakpoint);

    //Listen for changes in media
    mobileBreakpoint.addEventListener("change", handleMediaChange);
});

//Responsive design handler for the arrows
    
//Handle media query changes
function handleMediaChange(mediaQuery) {
    if (mediaQuery.matches) {
        setupHorizontalScroll();
    } else {
        setupVerticalScroll();
    }
};

function setupVerticalScroll() {
        
    function scrollUp() {
        projectList.scrollBy({
            top: -200,
            behavior: "smooth"
        });
    };

    function scrollDown() {
        projectList.scrollBy({
            top: 200,
            behavior: "smooth"
        });
    };

    updateArrowListeners(scrollUp, scrollDown);
};

function setupHorizontalScroll() {

    function scrollLeft() {
        projectList.scrollBy({
            left: -200,
            behavior: "smooth"
        });
    };
        
    function scrollRight() {
        projectList.scrollBy({
            left: 200,
            behavior: "smooth"
        });
    };

    updateArrowListeners(scrollLeft, scrollRight);
};

//Validitation stuff

const legalChars = /[^a-zA-Z0-9@._-]/; 

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailAddressForm = document.querySelector("#contactEmail");
const emailErrorDisplay = document.querySelector("#emailError");

//Message validation

const msgForm = document.querySelector("#contactMessage");
const msgFormError = document.querySelector("#messageError");
const charsInMsg = document.querySelector("#charactersLeft");
const submitButton = document.querySelector("#formsubmit");
const entireForm = document.querySelector("#formSection")

//Function for the character counter

const handleNumberOfChars = () => {
    let msgLength = msgForm.value.length;
    charsInMsg.textContent = `Characters: ${msgLength} / 300`;
    if (legalChars.test(msgForm.value)) {
        msgFormError.textContent = "Message contains illegal characters!";
    } else if (msgLength > 300) {
        msgFormError.textContent = "Message contains too many characters!";
    } else {
        msgFormError.textContent = "";
    };
};

//Event listener for the character counter

msgForm.addEventListener("input", handleNumberOfChars);

//Function for e-mail validation

const handleValidateEmail = (event) => {
    
    //Disable the default action of submit
    event.preventDefault();
    //This line is for debugging
    console.log("Submit prevented");
    
    //Get the e-mail into a variable
    const emailValue = emailAddressForm.value.trim();

    //Clear previous errors
    emailErrorDisplay.textContent = "";

    //Make sure the e-mail form is filled out
    if (emailValue === "") {
        emailErrorDisplay.textContent = "E-mail must be filled out!";
        return false;

    //Make sure the e-mail includes valid characters 
    } else if (legalChars.test(emailValue)) {
        emailErrorDisplay.textContent = "E-mail contains invalid characters!";
        return false;
    
    //Make sure the e-mail is valid
    } else if (!emailValue.match(validEmail)) {
        emailErrorDisplay.textContent = "Invalid E-Mail Address!";
        return false;
    };

    //Success!
    alert("Successful submission!");
    return true;
};

//Event listener for the submit button
entireForm.addEventListener("submit", handleValidateEmail);