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
     if (selector == "ph" || selector == "cl" || selector == "ki") {
         handleKingdom();
         handlePhylum();
         handleClass();
     }
     // if (selector == "cl") {
     //     handleKingdom();
     //     handlePhylum();
     //     handleClass();
     // }
     // if (selector == "ki") {
     //     handleKingdom();
     //     handlePhylum();
     //     handleClass();
     // }

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

 const selectItem = function (selectItemName) {
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
         selectorNew = "ki";
     }


     const hidden = document.getElementsByClassName("sp_picturesDiv");

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
     if (window.confirm("This will refresh the page to reset.")) {
         window.location.reload(true);
     }
 });

 const selectMine = document.getElementById("selectHowMany");
 selectMine.addEventListener("change", event => {
     getSelectNumberOfPictures();
     //     console.log("select changed");
     //     button.style.display = "none";
 });

 function getSelectNumberOfPictures() {
     let s = document.getElementById("selectHowMany");
     let selectChoiceMade = s.options[s.selectedIndex].value;
     let howManyPicturesInArray;
     if (selectChoiceMade === "") {
         howManyPicturesInArray = 50;
     } else if (selectChoiceMade === "All") {
         howManyPicturesInArray = "All";
         dataLoad(howManyPicturesInArray);
         //         console.log(howManyPicturesInArray);
     } else {
         howManyPicturesInArray = selectChoiceMade;
         dataLoad(howManyPicturesInArray);
     }
     s.style.display = "none";

 }








 async function dataFind() {
     const api_url = "/dataFind";
     const dbData = await fetch(api_url);
     const json = await dbData.json();
     return json;
 };

 //master control function for pictures
 const dataLoad = async function (howManyObjectsInArray) {
     const dataPass = await dataFind();
     const picArray = await makePicArray(dataPass, howManyObjectsInArray);
     const dom = await makeDom(picArray);
     selectArray = makeSelectsObject(picArray);
     // console.log(selectArray);
     makeSelectsKingdom(picArray);
     makeSelectsPhylum(picArray);
     makeSelectsClass(picArray);

 };


 // makes the array of scientific names and
 //URL for those items having pictures and redUpdate info.

 const makePicArray = function (input, howManyPicturesInArray) {
     const PicArrayReturn = [];
     const NoURL =
         "upload.wikimedia.org/wikipedia/commons/7/74/Red_Pencil_Icon.png";
     const inputO = input;
     const arrayOPre = Object.values(inputO);
     // console.log(arrayO.length - 1);
     if (howManyPicturesInArray === "All") {
         howManyPicturesInArray = arrayO.length - 1;
     }
     let arrayO = NaiveShuffle(arrayOPre)

     function NaiveShuffle(arr) {
         var i, temp, j, len = arr.length;
         for (i = 0; i < len; i++) {
             j = ~~(Math.random() * len);
             temp = arr[i];
             arr[i] = arr[j];
             arr[j] = temp;
         }
         return arr;
     }

     for (let i = 0; i < howManyPicturesInArray;
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
             makeArrayForPictures(i);
         }
     }

     function makeArrayForPictures(i) {
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
 const makeSelectsKingdom = function (input) {
     let ki = document.getElementById("ki");
     let arr = [];
     for (let i = 0; i < input.length; i++) {
         arr.push(input[i].sp_kingdom);
     }

     const uniqueItems = getUniqueItemsForOptions(arr);

     for (let i = 0; i < uniqueItems.length; i++) {
         let option = document.createElement("option");
         option.value = uniqueItems[i];
         option.text = uniqueItems[i];
         ki.appendChild(option);
     }
 };

 // THis function makes the phylum selects for the pictures
 // base case is already defined in DOM
 const makeSelectsPhylum = function (input) {
     let ph = document.getElementById("ph");
     let arr = [];
     for (let i = 0; i < input.length; i++) {
         arr.push(input[i].sp_phylum);
     }

     const uniqueItems = getUniqueItemsForOptions(arr);

     for (let i = 0; i < uniqueItems.length; i++) {
         let option = document.createElement("option");
         option.value = uniqueItems[i];
         option.text = uniqueItems[i];
         ph.appendChild(option);
     }
 };
 const makeSelectsClass = function (input) {
     let cl = document.getElementById("cl");
     let arr = [];
     for (let i = 0; i < input.length; i++) {
         arr.push(input[i].sp_class);
     }

     const uniqueItems = getUniqueItemsForOptions(arr);

     for (let i = 0; i < uniqueItems.length; i++) {

         let option = document.createElement("option");
         option.value = uniqueItems[i];
         option.text = uniqueItems[i];
         cl.appendChild(option);
     }
 };

 function getUniqueItemsForOptions(arr) {
     let uniqueItemsPre = [...new Set(arr)];
     let uniqueItemsPre1 = uniqueItemsPre.sort();
     return uniqueItemsPre1;

 }



 //This function takes in the array created by picArray which
 // is a subset of the database and creates the DOM elements
 // for those species in the picArray.

 const makeDom = function (input) {
     const myDiv = document.getElementById("myDiv");
     const inputArr = input;
     console.log("number of animals = ", inputArr.length);
     for (let i = 0; i <

         inputArr.length; i++) {
         const attributeString =
             "inlineBlock" +
             " " +
             "sp_picturesDiv" +
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
         //         elemImg.setAttribute("height", "180px");
         elemImg.setAttribute("class", "pictureOfOrg");
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
         .querySelector("body")
         .addEventListener("click", function (event) {

             if (document.getElementById("iframe1") != null) {
                 const frame = document.getElementById("iframe1");
                 frame.parentNode.removeChild(frame);

             } else {
                 if (event.target.tagName.toLowerCase() == "img") {
                     let pass = event.target.name;
                     checkForIphone(inputArr[pass].name);

                 }
             }
         });

 };
 const sleep = function (milliseconds) {
     var start = new Date().getTime();
     for (var i = 0; i < 1e7; i++) {
         if (new Date().getTime() - start > milliseconds) {
             break;
         }
     }
 };

 function checkForIphone(namePass) {
     let url = `https://en.wikipedia.org/wiki/${namePass}`;
     if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {

         openAndReuseOneTabPerAttribute("myextension-myattribute", url);
         //do nothing its an iphone some code
     } // some code..
     else {
         //  openAndReuseOneTabPerAttribute("myextension-myattribute", url);
         iframeFromPic(url);
     }
 }
 /// This code makes the iframe when user
 // clicks on a picture.  If picture is present it
 // removes it and makes new picture.

 function iframeFromPic(namePass) {

     let url = namePass;
     //`https://en.wikipedia.org/wiki/${namePass}`;

     if (document.getElementById("iframe1") === null) {
         let PicDiv = document.getElementById("mainPopPic"); //passedId);
         let ifrm = document.createElement("iframe");
         ifrm.setAttribute("src", url);
         ifrm.id = "iframe1";
         PicDiv.appendChild(ifrm);
         ifrm.setAttribute("sandbox", "");
     } else {
         const frame = document.getElementById("iframe1");
         frame.parentNode.removeChild(frame);
         let PicDiv = document.getElementById("mainPopPic");
         let ifrm = document.createElement("iframe");
         ifrm.setAttribute("src", url);
         ifrm.setAttribute("sandbox", "");
         ifrm.id = "iframe1";
         PicDiv.appendChild(ifrm);
     }
 };


 //  This function listens for the esc key and
 // removes the iframe if present.
 window.onkeyup = function (event) {
     if (event.keyCode == 27) {
         if (document.getElementById("iframe1") != null) {
             const frame = document.getElementById("iframe1");
             frame.parentNode.removeChild(frame);
         }
     }
 };

 function openAndReuseOneTabPerAttribute(attrName, url) {
     let windowObjectReference = null; // global variable

     if (windowObjectReference == null || windowObjectReference.closed)
     /* if the pointer to the window object in memory does not exist
        or if such pointer exists but the window was closed */

     {
         windowObjectReference = window.open(url, "special page");
         /* then create it. The new window will be created and
            will be brought on top of any other window. */
     } else {
         windowObjectReference.focus();
         /* else the window reference must exist and the window
            is not closed; therefore, we can bring it back on top of any other
            window with the focus() method. There would be no need to re-create
            the window or to reload the referenced resource. */
     };

 }