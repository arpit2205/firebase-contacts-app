// console.log("hey");

const signedIn = document.querySelector("#signedIn");
const signedOut = document.querySelector("#signedOut");
const signInBtn = document.querySelector("#signInBtn");
const signOutBtn = document.querySelector("#signOutBtn");
const details = document.querySelector("#details");

const contacts = document.querySelector("#contacts");
const nameInput = document.querySelector("#name");
const numberInput = document.querySelector("#number");
const addBtn = document.querySelector("#add");
const list = document.querySelector("#list");

// addBtn.addEventListener("click", () => {
//   console.log(nameInput.value);
//   console.log(numberInput.value);
//   nameInput.value = "";
//   numberInput.value = "";
// });

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.addEventListener("click", () => {
  auth.signInWithPopup(provider);
});

signOutBtn.addEventListener("click", () => {
  auth.signOut();
});

auth.onAuthStateChanged((user) => {
  if (user) {
    signedIn.hidden = false;
    signedOut.hidden = true;
    details.innerHTML = `<h5>Hello <b>${user.displayName}</b>! You signed in with ${user.email}</h5>`;
    contacts.hidden = false;
  } else {
    signedIn.hidden = true;
    signedOut.hidden = false;
    details.innerHTML = "";
    contacts.hidden = true;
  }
});

const db = firebase.firestore();

let contactsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    contactsRef = db.collection("contacts");

    const { serverTimestamp } = firebase.firestore.FieldValue;

    addBtn.addEventListener("click", () => {
      contactsRef.add({
        uid: user.uid,
        name: nameInput.value,
        number: numberInput.value,
        createdAt: serverTimestamp(),
      });
    });

    unsubscribe = contactsRef
      .where("uid", "==", user.uid)
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<div class="row px-1 py-1"><h1>${doc.data().name}</h1><h4>${
            doc.data().number
          }</h4></div><hr class="px-2" />`;
        });
        list.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
  }
});
