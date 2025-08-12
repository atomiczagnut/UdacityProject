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

//Let's populate the DOM with one card for testing purposes

const projectList = document.querySelector("#projectList");

//The line below will test if we can build an instance of our ProjectCard

//const firstCard = new ProjectCard("project_personal", "Personal Website", "Showcase your skills and projects.", "Build a website to highlight your programming abilities, experience, and portfolio. This is a great way to showcase your work to potential employers.", "./images/personal_site_card.webp", "./images/personal_site_spotlight.webp", "https://example.com/project1");

//This is to test if we can build one without an object
//But I keep getting 'undefined'

const projectCard = document.createElement("div");
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

projectList.append(projectCard);

//Populate the Projects section with a for..in loop, and try to handle missing data
//This is where I need the most help!

getProjectsData().then( response => {
    
    for (let key in response) {
        if (response.hasOwnProperty(key)) {
            
            projectsData.project_id = response.project_id;
            projectsData.project_name = response.project_name;
            projectsData.short_description = response.short_description;
            projectsData.long_description = response.long_description;
            projectsData.card_image = response.card_image;
            projectsData.spotlight_image = response.card_image;
            projectsData.url = response.url;
        } else {
            //This is where we handle errors, such as missing data
            //Probably with multiple if else statements
            //Route missing card images to the spotlight image
            //Or the other way around
            console.error(`Project Card error: ${console.error}`);
        }
    };

    //This should push each Project Card data into the global array called projectsData
    let projectCard = new ProjectCard(projectsData.project_id, projectsData.project_name, projectsData.short_description, projectsData.long_description, projectsData.card_image, projectsData.spotlight_image, projectsData.url);
    projectsData.push(projectCard);
});

//use try/catch to handle any other errors

//validitation stuff

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailAddressForm = document.QuerySelector = "#contactEmail";

if (emailAddressForm !== validEmail) {
    
}
