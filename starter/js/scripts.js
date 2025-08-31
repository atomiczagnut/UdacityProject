//Final Project for Udacity Nanodegree in FrontEnd Development
//By Colin Trierweiler
//JavaScript that manipulates a DOM of an exisiting (and fairly sparse), website.
//The point is to populate it with elements, especially cards that define projects
//It is meant to teach working with the DOM and JavaScript
//It has slowly driven me insane :P

//This is a default image in case anything fails

const placeHolderImage = "card_placeholder_bg.webp";

//Function to fix errors in paths by deleting the first '.' in the path string

function fixPath(pathToBeFixed) {
    return pathToBeFixed.slice(1);
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

//Global object.  It works, but is it best practice?

let aboutMeData = {
    aboutMe: "",
    headshot: ""
};

//Populate the About Me Section

getAboutMeData().then( response => {
    aboutMeData.aboutMe = response.aboutMe;
    aboutMeData.headshot = response.headshot;

    //About Me section

    aboutMeContainer = document.querySelector("#aboutMe");

    //About Me text

    aboutMeText = document.createElement("p");    
    aboutMeText.textContent = aboutMeData.aboutMe;
    aboutMeContainer.append(aboutMeText);

    //About Me headshot

    headshotContainer = document.createElement("div");
    headshotContainer.classList.add("headshotContainer");

    headshotImg = document.createElement("img");
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

        projectCard.addEventListener("click", function(event) {
            const clickedProjectId = event.target.id;
            spotlightProject = projectsData.find(p => p.id == clickedProjectId);
            console.log("Selected Project: ", spotlightProject.project_name);
        });

        return projectCard;
    };

    //Method to build the spotlight
    
    buildProjectSpotlight() {

        const spotlightContainer = document.querySelector("#projectSpotlight");
        const spotlightTitles = document.querySelector("#spotlightTitles");

        spotlightContainer.style.backgroundImage = `url(${this.spotlight_img})`;

        const spotlightTitle = document.createElement("h3");
        spotlightTitle.textContent = this.project_name;
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
        if (true) {
            project_id = response[key].project_id;
            project_name = response[key].project_name;
            short_description = response[key].short_description;
            long_description = response[key].long_description;
            const cardImg = response[key].card_image || "./starter/images/card_placeholder_bg.webp";
            card_img = fixPath(cardImg);
            const spotlightImg = response[key].spotlight_image || "./starter/images/spotlight_placeholder_bg.webp";
            spotlight_img = fixPath(spotlightImg);
            url = response[key].url;
            
            let projectCardInstance = new ProjectCard(project_id, project_name, short_description, long_description, card_img, spotlight_img, url) 
            
            projectsData.push(projectCardInstance);

            projectList.append(projectCardInstance.buildCard());
        };
    };

    //Find out how many project cards there are

    const numberOfProjects = projectsData.length;

    //The spotlightProjectNum variable will make it easier to scroll though the array of projects with the arrows

    let spotlightProjectNum = 0; 

    //Spotlight one project
    //Default to the first one

    let spotlightProject = projectsData[spotlightProjectNum].buildProjectSpotlight();

    //The functions for the arrows

    function arrowLeftHandler() {
        console.log("Left arrow clicked!");
        spotlightProjectNum -= 1;
        if (spotlightProjectNum === 0) {
            spotlightProjectNum = (numberOfProjects - 1);
        };
            spotlightProject = projectsData[spotlightProjectNum]; 
        };

    function arrowRightHandler() {
        console.log("Right arrow clicked!");
        (spotlightProjectNum += 1) % numberOfProjects;
            spotlightProject = projectsData[spotlightProjectNum]; 
        };

    //Add event handlers for the arrows around here

    document.querySelector(".arrow-left").addEventListener("click", arrowLeftHandler);
    document.querySelector(".arrow-right").addEventListener("click", arrowRightHandler);
});

//Try not to beat yourself up too, much.  You are trying your best

//Use try/catch to handle any other errors

//Validitation stuff

//E-mail validation

const legalChars = /[^a-zA-Z0-9@._-]/; 

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailAddressForm = document.querySelector("#contactEmail");
const emailErrorDisplay = document.querySelector("#emailError");

if (emailAddressForm === "") {
    emailErrorDisplay.textContent = "E-mail must be filled out!";
} else if (emailAddressForm !== validEmail) {
    emailErrorDisplay.textContent = "Invalid E-Mail Address!";
} else if (emailAddressForm !== legalChars) {
    emailErrorDisplay.textContent = "E-mail contains invalid characters!";
};

//Message validation

const msgForm = document.querySelector("#contactMessage");
const msgFormError = document.querySelector("#messageError");
let charsInMsg = document.querySelector("#charactersLeft");
let msgLength = msgForm.length;

//Add an event listener that watches how many characters are in the msgForm
//It updates the charsInMsg, and sends a signal to msgFormError if that exeeds 300 

const handleNumberOfChars = () => {
    charsInMsg.textContent = `Charcters: ${msgLength} / 300`;
    if (msgForm !== legalChars) {
        msgFormError.textContent = "Message contains illegal characters!";
    } else if (msgLength > 300) {
        msgFormError.textContent = "Message conatains too many characters!";
    };
};

//TODO: Work on making it an event listener

msgForm.addEventListener("input", handleNumberOfChars);

//I need to work more on Event Listeners!