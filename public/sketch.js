 // PAGE OPERATION CODE
 // GLOBAL VARIABLES

 let selectArray = [];
 let masterSearch = [];

 //ADD SELECT EVENT LISTENERS

 document
     .getElementById("ki") //Sp - Ki
     .addEventListener("change", () => selectItem("ki")); //Sp - ki
 document
     .getElementById("ph") //phylumSelect - ph
     .addEventListener("change", () => selectItem("ph")); //phylumSelect  - ph
 document
     .getElementById("cl") //classSelect -  cl
     .addEventListener("change", () => selectItem("cl")); //classSelect - cl



 function makeOptionNew(kingSel, phylumSel, classSel, selector, query) {
     if (selector == "ph") {
         handleKingdom();
         handlePhylum();
         handleClass();
     }
     if (selector == "cl") {
         handleKingdom();
         handlePhylum();
         handleClass();
     }
     if (selector == "ki") {
         handleKingdom();
         handlePhylum();
         handleClass();
     }

     function handleKingdom() {
         let k = document.getElementById("ki");
         while (k.hasChildNodes()) {
             k.removeChild(k.lastChild);
         }

         kingSel.forEach(function (element, key) {
             k[key] = new Option(element, key);
         });
     }

     function handlePhylum() {
         let s = document.getElementById("ph");
         while (s.hasChildNodes()) {
             s.removeChild(s.lastChild);
         }
         phylumSel.forEach(function (element, key) {
             s[key] = new Option(element, key);
         });
     }

     function handleClass() {
         let c = document.getElementById("cl");
         while (c.hasChildNodes()) {
             c.removeChild(c.lastChild);
         }
         classSel.forEach(function (element, key) {
             c[key] = new Option(element, key);
         });
     }

     if (selector == "ph") {
         let myArray = phylumSel;
         for (let i = 0; i < myArray.length; i++) {
             if (myArray[i] == query) {
                 document.getElementById("ph").options[i].selected = true;
                 document.getElementById("ki").options[2].selected = true;
             }
         }
     }

     if (selector == "cl") {
         let myArray = classSel;
         for (let i = 0; i < myArray.length; i++) {
             if (myArray[i] == query) {
                 document.getElementById("cl").options[i].selected = true;
                 document.getElementById("ph").options[2].selected = true;
                 document.getElementById("ki").options[2].selected = true;
             }
         }
     }
     if (selector == "ki") {
         let myArray = kingSel;
         for (let i = 0; i < myArray.length; i++) {
             if (myArray[i] == query) {
                 document.getElementById("ki").options[i].selected = true;
                 document.getElementById("ph").options[0].selected = true;
                 document.getElementById("cl").options[0].selected = true;
             }
         }
     }
 }

 //Based on the select chosen and the item chosen, make new options lists

 function selectReducer(selector, query) {
     // USING THE GLOBAL VARIABLE selectArray
     let prop;
     let showList = [];
     let phylumSelNew = [];
     let classSelNew = [];
     let kingdomSelNew = [];
     if (selector == "ph") {
         prop = "sp_phylum";
     }
     if (selector == "cl") {
         prop = "sp_class";
     }
     if (selector == "ki") {
         prop = "sp_kingdom";
     }


     for (let i = 0; i < selectArray.length; i++) {
         if (selectArray[i][prop] == query || query == "") {
             showList.push(selectArray[i]);
         }
     }

     for (let i = 0; i < showList.length; i++) {
         kingdomSelNew.push("Select Kingdom");
         kingdomSelNew.push("All");
         kingdomSelNew.push(showList[i].sp_kingdom);

         phylumSelNew.push("Select Phylum");
         phylumSelNew.push("All");
         phylumSelNew.push(showList[i].sp_phylum);

         classSelNew.push("Select Class");
         classSelNew.push("All");
         classSelNew.push(showList[i].sp_class);
     }
     makeOptionNew(
         [...new Set(kingdomSelNew)],
         [...new Set(phylumSelNew)],
         [...new Set(classSelNew)],
         selector,
         query
     );
 }

 //FUNCTION TO SHOW ONLY THOSE PICTURES IN THE DOM THAT MEET
 // THE SELECTED ITEM IN DROPDOWN.
 // INVOKED BY EVENT LISTENERS, ONLY GIVEN THE SELECT DROPDOWN
 // NAME THAT FIRED

 //DOES INVOKE SELECT REDUCER FUNCTION PASSING SELECT OBJECT
 // THAT FIRED AND THE OPTION SELECTED.

 selectItem = function (selectItemName) {
     let selectorNew = selectItemName;
     let e = document.getElementById(selectorNew);
     let strUser = e.options[e.selectedIndex].text;
     if (strUser == "All" || strUser == "Select Kingdom" || strUser == "Select Phylum" || strUser == "Select Class") {
         strUser = "";
     }
     if (selectItemName === "cl" && strUser === "") {
         let f = document.getElementById("ph")
         let y = f.options[f.selectedIndex].text;
         strUser = y;
         selectorNew = "ph"
     }
     if (selectItemName === "ph" && strUser === "") {
         let f = document.getElementById("ki")
         let y = f.options[f.selectedIndex].text;
         strUser = y;
         selectorNew = "ki"
     }


     const hidden = document.getElementsByClassName("sp_pictures");

     //This part hides the pictures and puts them back
     for (let i = 0; i < hidden.length; i++) {
         let regex = RegExp(strUser);
         if (
             regex.test(document.getElementById(hidden[i].id).className) ===
             false
         ) {
             document.getElementById(hidden[i].id).className += " displayClass";


         } else {
             if (
                 document
                 .getElementById(hidden[i].id)
                 .className.match(/(?:^|\s)displayClass(?!\S)/)
             ) {
                 document.getElementById(
                         hidden[i].id
                     ).className = document
                     .getElementById(hidden[i].id)
                     .className.replace(/(?:^|\s)displayClass(?!\S)/g, "");
             }
         }
     }
     //make select options
     selectReducer(selectorNew, strUser);
 };

 // CODE TO MAKE THE DOM
 //ALL CODE BELOW HERE IS ONLY RUN AT INITIAL LOAD
 //MAKES A DOM OF ALL THE PICTURES, THAT ARE LATER
 //HIDDEN BASED ON CLASS NAMES.
 // SETS A GLOBAL VARIABLE THAT HAS ALL THE COMBINATIONS
 // OF POSSIBLE KING-PHYLUM-CLASS
 const button = document.getElementById("makeDom");
 button.addEventListener("click", event => {
     dataLoad();
     button.style.display = "none";
 });

 dataFind = async function () {
     const api_url = "/dataFind";
     const dbData = await fetch(api_url);
     const json = await dbData.json();
     return json;
 };

 //master control function for pictures
 dataLoad = async function () {
     const dataPass = await dataFind();
     const picArray = await makePicArray(dataPass);
     const dom = await makeDom(picArray);
     selectArray = makeSelectsObject(picArray);
     // console.log(selectArray);
     makeSelectsKingdom(picArray);
     makeSelectsPhylum(picArray);
     makeSelectsClass(picArray);

 };

 // makes the array of scientific names and
 //URL for those items having pictures and redUpdate info.

 makePicArray = function (input) {
     const PicArrayReturn = [];
     const NoURL =
         "upload.wikimedia.org/wikipedia/commons/7/74/Red_Pencil_Icon.png";
     const inputO = input;
     const arrayO = Object.values(inputO);

     for (let i = 0; i < 1000;
         // arrayO.length - 1; 
         i++) {
         if (
             arrayO[i].imageURL === "" ||
             arrayO[i].imageURL === NoURL ||
             arrayO[i].hasOwnProperty("redUpdate") === false
         ) {} else {
             if (arrayO[i].redUpdate.main_common_name == null) {
                 arrayO[i].redUpdate.main_common_name = "---";
             }
             blue(i);
         }
     }

     function blue(i) {
         PicArrayReturn.push({
             name: arrayO[i].scientific_name,
             PicURL: arrayO[i].imageURL,
             sp_kingdom: arrayO[i].redUpdate.kingdom,
             sp_phylum: arrayO[i].redUpdate.phylum,
             sp_class: arrayO[i].redUpdate.class,
             commonName: arrayO[i].redUpdate.main_common_name,
             artist: arrayO[i].imageAuthor,
             attrUrl: arrayO[i].licenseUrl,
             attrLicense: arrayO[i].licenseShort
         });
     }

     return PicArrayReturn;
 };

 //Function that makes array of the option choices.
 function makeSelectsObject(input) {
     let target = [];
     let finalUnique = [];
     for (let i = 1; i < input.length; i++) {
         target.push(input[i].sp_class);
     }
     const optionTypes = [...new Set(target)];


     for (let i = 0; i < optionTypes.length; i++) {
         let result = input.find(obj => {
             return obj.sp_class === optionTypes[i];
         });
         finalUnique.push({
             sp_class: result.sp_class,
             sp_phylum: result.sp_phylum,
             sp_kingdom: result.sp_kingdom
         });
     }

     return finalUnique;
 }
 makeSelectsKingdom = function (input) {
     let arr = [];
     for (let i = 0; i < input.length; i++) {
         arr.push(input[i].sp_kingdom);
     }
     let uniqueItemsPre = [...new Set(arr)];
     uniqueItemsPre = uniqueItemsPre.sort();
     let uniqueItems = uniqueItemsPre;

     for (let i = 0; i < uniqueItems.length; i++) {
         let option = document.createElement("option");
         option.value = uniqueItems[i];
         option.text = uniqueItems[i];
         ki.appendChild(option);
     }
 };

 // THis function makes the phylum selects for the pictures
 // base case is already defined in DOM
 makeSelectsPhylum = function (input) {
     let arr = [];
     for (let i = 0; i < input.length; i++) {
         arr.push(input[i].sp_phylum);
     }
     let uniqueItemsPre = [...new Set(arr)];
     uniqueItemsPre = uniqueItemsPre.sort();
     let uniqueItems = uniqueItemsPre;

     for (let i = 0; i < uniqueItems.length; i++) {
         let option = document.createElement("option");
         option.value = uniqueItems[i];
         option.text = uniqueItems[i];
         ph.appendChild(option);
     }
 };
 makeSelectsClass = function (input) {
     let arr = [];
     for (let i = 0; i < input.length; i++) {
         arr.push(input[i].sp_class);
     }

     let uniqueItemsPre = [...new Set(arr)];
     uniqueItemsPre = uniqueItemsPre.sort();
     let uniqueItems = uniqueItemsPre;

     for (let i = 0; i < uniqueItems.length; i++) {
         let option = document.createElement("option");
         option.value = uniqueItems[i];
         option.text = uniqueItems[i];
         cl.appendChild(option);
     }
 };

 //This function takes in the array created by picArray which
 // is a subset of the database and creates the DOM elements
 // for those species in the picArray.

 makeDom = function (input) {
     const inputArr = input;
     console.log("number of animals = ", inputArr.length);
     for (let i = 0; i <

         inputArr.length / 2; i++) {
         const attributeString =
             "inlineBlock" +
             " " +
             "sp_pictures" +
             " " +
             inputArr[i].sp_kingdom +
             " " +
             inputArr[i].sp_phylum +
             " " +
             inputArr[i].sp_class;
         if (inputArr[i].attrLicense == undefined) {
             inputArr[i].attrLicense = "---";
         }

         const root = document.createElement("div");
         const elemImg = document.createElement("img");
         const elemText = document.createElement("p");
         const elemText2 = document.createElement("p");
         const artist = document.createElement("p");

         elemImg.setAttribute("src", "https://" + inputArr[i].PicURL);
         elemImg.setAttribute("height", "180px");
         elemImg.setAttribute("width", "240px");
         elemImg.setAttribute("name", i);

         artist.setAttribute("class", "attri");
         root.id = "picture" + i;
         elemText.textContent = inputArr[i].name;
         elemText2.textContent = inputArr[i].commonName;
         if (inputArr[i].artist == undefined) {
             artist.textContent = "No Artist Listed "
         } else {
             artist.textContent = "Image By: " + inputArr[i].artist.substring(0, 28) + " - ";
         }

         root.setAttribute("class", attributeString);
         root.appendChild(elemImg);
         root.appendChild(artist);
         if (inputArr[i].attrLicense == "Public domain" || inputArr[i].attrLicense == "No restrictions" ||
             inputArr[i].attrLicense == "---") {
             const license = document.createElement("span");
             license.setAttribute("class", "attri")
             license.textContent = inputArr[i].attrLicense;
             artist.appendChild(license);

         } else {
             const a = document.createElement('a');
             a.setAttribute("href", inputArr[i].attrUrl)
             a.textContent = inputArr[i].attrLicense;
             a.setAttribute("class", "attri");
             artist.appendChild(a);
         }
         root.appendChild(elemText2);
         root.appendChild(elemText);
         myDiv.appendChild(root);
         sleep("4");

     }

     // this function ceates an event listener for getting
     // the wikipedia.org page for the clicked picture.
     document
         .querySelector("#myDiv")
         .addEventListener("click", function (event) {

             if (document.getElementById("iframe1") != null) {
                 frame = document.getElementById("iframe1");
                 frame.parentNode.removeChild(frame);

             } else {
                 if (event.target.tagName.toLowerCase() == "img") {
                     let pass = event.target.name;
                     iframeFromPic(inputArr[pass].name, "picture" + pass);

                 }
             }
         });

     function makeIframe(ipass) {
         let ifind = ipass;
     }
 };
 const sleep = function (milliseconds) {
     var start = new Date().getTime();
     for (var i = 0; i < 1e7; i++) {
         if (new Date().getTime() - start > milliseconds) {
             break;
         }
     }
 };


 /// This code makes the iframe when user
 // clicks on a picture.  If picture is present it
 // removes it and makes new picture.

 function iframeFromPic(namePass, idName) {
     const passedName = namePass;
     const passedId = idName;
     let url = `https://en.wikipedia.org/wiki/${passedName}`;

     if (document.getElementById("iframe1") === null) {
         letPicDiv = document.getElementById("mainPopPic"); //passedId);
         let ifrm = document.createElement("iframe");
         ifrm.setAttribute("src", url);
         ifrm.id = "iframe1";
         letPicDiv.appendChild(ifrm);
         ifrm.setAttribute("sandbox", "");
     } else {
         frame = document.getElementById("iframe1");
         frame.parentNode.removeChild(frame);
         letPicDiv = document.getElementById("mainPopPic");
         let ifrm = document.createElement("iframe");
         ifrm.setAttribute("src", url);
         ifrm.setAttribute("sandbox", "");
         ifrm.id = "iframe1";
         letPicDiv.appendChild(ifrm);
     }
 };


 //  This function listens for the esc key and
 // removes the iframe if present.
 window.onkeyup = function (event) {
     if (event.keyCode == 27) {
         if (document.getElementById("iframe1") != null) {
             frame = document.getElementById("iframe1");
             frame.parentNode.removeChild(frame);
         }
     }
 };