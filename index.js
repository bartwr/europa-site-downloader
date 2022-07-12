import fetch from 'node-fetch';
import fs from 'fs';
import { parse } from 'json2csv';

// VARIABLEN
const URL = "https://ec.europa.eu/info/law/better-regulation/brpapi/allFeedback?publicationId=29585848"
const BOEIENDE_VELDEN = [
  "language",
  "id",
  "country",
  "surname",
  "status",
  "attachments",
  "dateFeedback",
  "publication",
  "userType",
  "feedback",
  "historyEventOccurs",
  "firstName"
];

const startDownloading = async () => {
  console.log("starting script ...\n\n")

  // Get all responses
  const responses = await fetchResponses();

  // Create CSV and download it
  const csv = parse(responses, {fields: BOEIENDE_VELDEN});

  // Download CSV
  fs.writeFile('./data.csv', csv, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });    

  // EINDE
  console.log("ending script..");
}

const fetchResponses = async () => {
  // HIER EEN LOOP
  // "PAGINANUMMER" VAN 0 TOT 188
  const aantal_inzendingen_per_pagina = 100;
  let aantal_paginas = 1;//Variable that will be overwritten with actual amount of pages
  let allResponses = [];// Variable to store all responses of different pages
  for(let paginanummer = 0; paginanummer <= aantal_paginas-1; paginanummer++) {
    console.log(`Downloading page ${paginanummer}`)
    // THIS LINE USES FETCH SOFTWARE TO DOWNLOAD DOCUMENTS FROM THE INTERNET
    const response = await fetch(`${URL}&page=${paginanummer}&size=${aantal_inzendingen_per_pagina}`);
    const responseJson = await response.json();
    aantal_paginas = responseJson.page.totalPages;
    // Add all responses to allResponses var
    for(let idx in responseJson._embedded.feedback) {
      allResponses.push(responseJson._embedded.feedback[idx]);
    };
  }

  return allResponses;
}

// BEGIN
startDownloading();
