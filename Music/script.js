//Copyright © 2020 Singh Karanbir. All rights riserved.
//Body element
const bodyElement = document.getElementById("bodyId");

//Text field: it permits to search an artist
const searchedArtist = document.getElementById("searchedArtist");

//Button that starts the searching 
const searchBtn = document.getElementById("searchBtn");

//Container of the artists' cards
const artistsCardListContainer = document.getElementById("artistsCardList");
//let tmpArtistsCardListContainer;

//Container of the searched artists
const searchedArtistsListContainer = document.getElementById("searchedArtistsList");
searchedArtistsListContainer.style.display = "none";

//List of artists
let artistsList = [];

//list of artists' cards
let artistsCardsList = [];

//Search artists
function searchArtists() {
    if (searchedArtist.value === null || searchedArtist.value === "") {
        searchedArtistsListContainer.innerHTML = "";
        artistsCardListContainer.style.display = "";
        searchedArtistsListContainer.style.display = "none";
        return;
    }
    artistsCardListContainer.style.display = "none";
    searchedArtistsListContainer.style.display = "";

    searchedArtistsListContainer.innerHTML = "";

    //Lista di stringhe dei nomi ricercati: Es: The Beatles -> ["The","Beatles"], serve a suddividere le varie parole
    let searchedValues = searchedArtist.value.split(" ");

    //Iterazione delle lista delle carte: serve per ricercare gli artisti
    artistsCardsList.forEach(val => {

        //Es. Black Sabbath -> ["Black","Sabbath"], serve a suddividere le varie parole
        let values = val.childNodes[1].childNodes[0].innerText.split(" ");

        //Controllo dell'artista ricercato: controlla sia il nome e cognome di un artista
        //in questo modo se si ricerca per cognome funziona lo stesso
        //Come risultato si ottengono tutti gli artisti che incominciano per delle determinate lettere, sia per il nome che per il cognome
        for (let i = 0; i < values.length; i++) {
            let tmp = values[i].toUpperCase();

            for (let j = 0; j < searchedValues.length; j++) {
                let tmp2 = searchedValues[j].toUpperCase();

                //Controllo...
                if (tmp.substr(0, tmp2.length).length >= tmp2.length) {
                    if (tmp.substr(0, tmp2.length) === tmp2) {
                        //Visualizzazione della carta, se trova delle concordanze
                        searchedArtistsListContainer.appendChild(val);
                        break;
                    }
                }
            }
        }
        searchBtn.blur();
    });
}

//Creates the card of an artist
function getArtistCard(artist) {
    if (artist.name === undefined || artist.image_url === undefined)
        return null;
    let artistCard = document.createElement("div");
    artistCard.className = "card";

    let artistImg = document.createElement("img");
    artistImg.src = artist.image_url;
    artistImg.className = "card-img-top";
    artistCard.appendChild(artistImg);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerText = artist.name;
    cardBody.appendChild(cardTitle);

    let cardFooter = document.createElement("div");
    cardFooter.className = "card-footer";

    let eventsBtn = document.createElement("a");
    eventsBtn.className = "btn btn-primary";
    eventsBtn.innerText = "Check Events";
    eventsBtn.style.backgroundColor = "green";
    eventsBtn.onmouseover = () => { eventsBtn.style.opacity = "0.7" };
    eventsBtn.onmouseout = () => { eventsBtn.style.opacity = "1" };
    eventsBtn.onclick = () => { getArtistEvent(artist.name) };

    let fbBtn = document.createElement("a");
    fbBtn.className = "fa fa-facebook";
    fbBtn.innerHTML = " Facebook";
    fbBtn.href = "" + artist.facebook_page_url;
    fbBtn.style.marginLeft = "50px";
    fbBtn.style.borderRadius = "200px"
    fbBtn.style.backgroundColor = "white";

    cardFooter.appendChild(eventsBtn);
    cardFooter.appendChild(fbBtn);

    artistCard.appendChild(cardBody);
    artistCard.appendChild(cardFooter);

    return artistCard;
}

//Exhibits artists' cards on page
function exhibitCards() {
    artistsList.forEach(artist => {
        let card = getArtistCard(artist);
        if (card !== null) {
            artistsCardsList.push(card);
            artistsCardListContainer.appendChild(card);
        }
    });
    //tmpArtistsCardListContainer = artistsCardListContainer.cloneNode(true);
}

//Data fetch: artists' info
async function getArtists() {
    //In questa copia del progetto, mi sono salvato tutti gli artisti e le loro informazioni in un file json
    artistsList = await fetch('artists.json').then(r => r.json());
}

//Creates the card of an artist, on check events button clicked
function getArtistEventsCard(artist) {
    if (artist.name === undefined || artist.image_url === undefined)
        return null;
    let artistCard = document.createElement("div");
    artistCard.className = "card";

    let artistImg = document.createElement("img");
    artistImg.src = artist.image_url;
    artistImg.className = "card-img-top";
    artistCard.appendChild(artistImg);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerText = artist.name;
    cardBody.appendChild(cardTitle);

    let cardFooter = document.createElement("div");
    cardFooter.className = "card-footer";

    let fbBtn = document.createElement("a");
    fbBtn.className = "btn btn-primary fa fa-facebook";
    fbBtn.style.backgroundColor = "#3b5998";
    fbBtn.style.borderColor = "#3b5998";
    fbBtn.style.marginLeft = "94px";
    fbBtn.onmouseover = () => { fbBtn.style.opacity = "0.7" };
    fbBtn.onmouseout = () => { fbBtn.style.opacity = "1" };
    fbBtn.onclick = () => { window.open(artist.facebook_page_url, "_blank") };
    

    let mainLinkBtn = document.createElement("a");
    mainLinkBtn.className = "btn btn-primary";
    mainLinkBtn.innerText = "Another Link";
    mainLinkBtn.style.backgroundColor = "yellow";
    mainLinkBtn.style.color = "black";
    mainLinkBtn.style.borderColor = "yellow"
    mainLinkBtn.onmouseover = () => { mainLinkBtn.style.opacity = "0.7" };
    mainLinkBtn.onmouseout = () => { mainLinkBtn.style.opacity = "1" };
    mainLinkBtn.onclick = () => { window.open(artist.url, "_blank") };

    cardFooter.appendChild(mainLinkBtn);
    cardFooter.appendChild(fbBtn);

    artistCard.appendChild(cardBody);
    artistCard.appendChild(cardFooter);

    return artistCard;
}


//Get an artist's events
function getArtistEvent(artistName) {
    fetch("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=1&date=all")
        .then(res => res.json())
        .then(b => {
            let eventsList = b;
            let artist = null;

            for (let i = 0; i < artistsList.length; i++) {
                if (artistsList[i].name === artistName) {
                    artist = artistsList[i];
                    break;
                }
            }

            searchedArtist.disabled = true;
            searchBtn.disabled = true;
            artistsCardListContainer.style.display = "none";
            searchedArtistsListContainer.innerHTML = "";
            createElementsOnCheckEventsCLicked(artist, eventsList);
        });
}

//Creates the elements to display on page
function createElementsOnCheckEventsCLicked(artist, eventsList) {
    if (artist === null) {
        return;
    }
    let firstCont = document.createElement("div");
    firstCont.className = "row";
    firstCont.id = "events-items";

    let secondCont = document.createElement("div");
    secondCont.style.marginLeft = "18px";

    let card = getArtistEventsCard(artist);
    card.id = "artist-ev";


    let button = document.createElement('button');
    button.id = "back-btn"
    button.type = "button";
    button.className = "btn btn-light";
    button.innerHTML = "<svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-arrow-left' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z'/></svg>";
    button.style.borderRadius = "10px";
    button.style.marginLeft = "18px";
    button.style.marginTop = "10px";
    button.onclick = () => { onBackBtnClicked() };

    secondCont.appendChild(button);
    secondCont.appendChild(card);

    firstCont.appendChild(secondCont);
    firstCont.appendChild(createListOfEvents(eventsList));

    bodyElement.appendChild(firstCont);
}

//Creates the list of events to display on page
function createListOfEvents(eventsList) {
    let container = document.createElement("div");
    container.className = "list-group";
    container.style.marginTop = "60px";
    container.style.marginLeft = "20px";

    eventsList.reverse().forEach(event => {
        let elem = document.createElement("a");
        elem.className = "list-group-item list-group-item-action";
        elem.appendChild(singleEventContent(event));

        container.appendChild(elem);;
    })

    return container;
}

//Single event format
function singleEventContent(event) {
    let container = document.createElement("div");
    container.className = "row";
    container.onclick = () => {
        window.open(event.url, "_blank");
    }

    let nameCont = document.createElement("div");
    nameCont.className = "col-sm";
    nameCont.innerHTML = "<p style='font-weight: bold'>At: </p><p>" + event.venue.name + "</p>";

    let datetimeCont = document.createElement("div");
    datetimeCont.className = "col-sm";
    datetimeCont.innerHTML = "<p style='font-weight: bold'>Datetime: </p><p>" + event.datetime + "</p>";

    let zoneCont = document.createElement("div");
    zoneCont.className = "col-sm";
    zoneCont.innerHTML = "<p style='font-weight: bold'>Location: </p><p>" + event.venue.city + ", " + event.venue.country + "</p>";

    container.appendChild(datetimeCont);
    container.appendChild(zoneCont);
    container.appendChild(nameCont);

    return container;
}

function onBackBtnClicked() {
    searchedArtist.disabled = false;
    searchBtn.disabled = false;

    artistsCardListContainer.style.display = "";
    bodyElement.removeChild(document.getElementById("events-items"));
}

async function main() {
    //fetch artits' data
    await getArtists();

    //Creates cards
    exhibitCards();
}

searchBtn.onclick = () => {
    searchArtists();
}

searchedArtist.onblur = () => {
    searchArtists();
}

main();