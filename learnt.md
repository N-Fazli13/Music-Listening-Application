<!-- The issue you're experiencing, where the text inside <li> elements appears briefly and then vanishes, is likely due to how the JavaScript is manipulating the DOM. This could happen if your JavaScript is inadvertently resetting or overwriting the content of the <ul> element after it has been populated.

Potential Causes and Solutions
JavaScript is Overwriting or Resetting Content

When you dynamically generate and insert content into the DOM, make sure that the content is not being overwritten by subsequent JavaScript operations. In your code, check if any part of the JavaScript after populating the list items is resetting or modifying the <ul> element.

For example, if you have this code:

javascript
Copy code
let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
songUL.innerHTML = "";  // This clears the existing content

for (const song of songs) {
    songUL.innerHTML += `<li>${song.replaceAll("%20", " ")}</li>`;
}
Ensure there is no other part of your script that might clear or modify songUL.innerHTML again after this loop runs. -->