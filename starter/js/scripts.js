//Final Project for Udacity Nanodegree in FrontEnd Development
//By Colin Trierweiler
//JavaScript that manipulates a DOM of an exisiting (and fairly sparse), website.
//The point is to populate it with elements, especially cards that define projects
//It is meant to teach working with the DOM and JavaScript
//It has slowly driven me insane :P

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

//I just want to note, everything above this line seems to work!
//Don't mess with it!

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

//Global object for the projects data
//Should it be an empty array that we populate with objects?

let projectsData = [];

//Create a class for your project card data
//This might need to be tweaked

class ProjectCard {
    constrcutor(id, name, short_desc, long_desc, card_img, spotlight_img, url) {
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
    };

    //Method for the Project Spotlight

    buildProjectSpotlight() {
        const spotlightContainer = document.createElement("div");
        spotlightContainer.id = "projectSpotlight";

        spotlightContainer.style.backgroundImage = `url(${this.spotlight_img})`;

        const spotlightTitle = document.createElement("h3");
        spotlightTitle.id = "spotlightTitles";
        spotlightContainer.append(spotlightTitle);

        const spotlightText = document.createElement("p");
        spotlightText.textContent = this.long_desc;
        spotlightContainer.append(spotlightText);

        const spotlightLink = document.createElement("a");
        spotlightLink.textContent = "Click here to see more...";
        spotlightLink.setAttribute("href", this.url);
        spotlightContainer.append(spotlightLink);
    };
};

//The line below will test if we can build an instance of our ProjectCard

//const firstCard = new ProjectCard("project_personal", "Personal Website", "Showcase your skills and projects.", "Build a website to highlight your programming abilities, experience, and portfolio. This is a great way to showcase your work to potential employers.", "./images/personal_site_card.webp", "./images/personal_site_spotlight.webp", "https://example.com/project1");

//This is to test if we can build one without an object
//So, I was getting 'undefined', but now it works, so I am doing something right!

//Once the objects start working, delete the comment block below

/* const projectCard = document.createElement("div");
projectCard.classList.add("projectCard");
projectCard.id = "personal_project";

const cardName = document.createElement("h4");
cardName.textContent = "Personal Website";
projectCard.append(cardName);

const cardImage = document.createElement("img");
cardImage.setAttribute("src", "./images/personal_site_card.webp");
projectCard.append(cardImage);

const cardText = document.createElement("p");
cardText.textContent = "This is a personal website.";
projectCard.append(cardText);

projectList.append(projectCard); */

//Populate the Projects section with a for..in loop, and try to handle missing data
//This is where I need the most help!

getProjectsData().then( response => {
    for (let key in response) {
        if (response.hasOwnProperty(key)) {
            project_id = response.project_id;
            project_name = response.project_name;
            short_description = response.short_description;
            long_description = response.long_description;
            card_image = response.card_image;
            spotlight_image = response.spotlight_image;
            url = response.url;
        } else {
            if (response.card_image === undefined) {
                card_image = response.spotlight_image;
            } else if (response.spotlight_image === undefined) {
                spotlight_image = response.card_image;
            } else {
            console.error(`Project Card error: ${console.error}`);
        }
    }
    let projectCardInstance = new ProjectCard(project_id, project_name, short_description, long_description, card_image, spotlight_image, url);
    projectsData.push(projectCardInstance);
    };
});

//Let's populate the DOM with one card for testing purposes

const projectList = document.querySelector("#projectList");

projectList.append(projectsData[0].buildCard());

//Use try/catch to handle any other errors

//Validitation stuff

//All of this should have happen after we click the button with id #formSubmit
//Except for the character counting event listener

//E-mail validation

const legalChars = /[^a-zA-Z0-9@._-]/ 

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailAddressForm = document.QuerySelector("#contactEmail");
const emailErrorDisplay = document.QuerySelector("#emailError");

if (emailAddressForm === "") {
    emailErrorDisplay.textContent = "E-mail must be filled out!";
} else if (emailAddressForm !== validEmail) {
    emailErrorDisplay.textContent = "Invalid E-Mail Address!";
} else if (emailAddressForm !== legalChars) {
    emailErrorDisplay.textContent = "E-mail contains invalid characters!";
};

//Message validation

const msgForm = document.QuerySelector("#contactMessage");
const msgFormError = document.QuerySelector("#messageError");
let charsInMsg = document.querySelector("#charactersLeft");
let msgLength = msgForm.length;

//Add an event listener that watches how many characters are in the msgForm
//It updates the charsInMsg, and sends a signal to msgFormError if that exeeds 300 

//TODO: That will need to be a function

function handleNumberOfChars(numberOfChars) {
    charsInMsg = `Charcters: ${msgLength}/300`
}
 
if (msgForm !== legalChars) {
    msgFormError.textContent = "Message contains illegal characters!";
} else if (msgLength > 300) {
    msgFormError.textContent = "Message conatains too many characters!";
}

