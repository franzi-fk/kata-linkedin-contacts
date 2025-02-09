/*_____________ GLOBAL SCOPE ____________*/

const apiUrl = "https://dummy-apis.netlify.app/api/contact-suggestions?count=";

let contacts;
let numPendingInvitations = 0;

/*_____________ INIT ____________*/

init();

/*_____________ FUNCTION DEFINITIONS ____________*/

async function init() {
  await fetchContacts();
  renderContacts();
  loadPendingInv();
  renderPendingInvitationsState();

  // attach event listener to the entire container (event delegation) -> cannot be on btn itself bec btn is not in dom yet
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-tile-action")) {
      changeConnectionState(event);
    }

    if (event.target.classList.contains("btn-close-tile")) {
      removeContactTile(event);
    }
  });
}

function loadPendingInv() {
  if (localStorage.numPendingInvitations) {
    numPendingInvitations = JSON.parse(localStorage.numPendingInvitations);
  } else {
    numPendingInvitations = 0;
  }
}

async function fetchContacts() {
  if (localStorage.contacts) {
    contacts = JSON.parse(localStorage.contacts);
  } else {
    try {
      const response = await fetch(`${apiUrl}8`);

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      return (contacts = await response.json());
    } catch (error) {
      console.log(`Error fetching contacts: ${error}`);
    }
  }
}

function renderContacts() {
  const contactsContainer = document.querySelector("#cnt-contact-sugg-body");
  contactsContainer.innerHTML = "";

  contacts.forEach((contact) => {
    // Create div containers
    const contactTile = document.createElement("div");
    contactTile.className = "contact-tile";
    const contactTileHeader = document.createElement("div");
    contactTileHeader.className = "contact-tile-header";
    const contactTileBody = document.createElement("div");
    contactTileBody.className = "contact-tile-body";
    const spaceDiv = document.createElement("div");

    // Create tile header elements
    const contactHeaderImg = document.createElement("div");
    contactHeaderImg.className = "contact-header-img";
    contactHeaderImg.style.setProperty("--bg-img", `url(${contact.picture})`);
    const contactPortraitImg = document.createElement("img");
    contactPortraitImg.className = "contact-portrait-img";
    contactPortraitImg.src = contact.picture;
    contact.alt = "Portrait of Contact";
    const btnClose = document.createElement("button");
    btnClose.className = "btn-icn btn-close-tile";
    btnClose.innerHTML = "&#10005;";
    btnClose.contactObj = contact;

    // Create tile body elements
    const contactName = document.createElement("h2");
    contactName.className = "contact-name";
    const contactProfession = document.createElement("p");
    contactProfession.className = "contact-profession";
    const contactConnections = document.createElement("p");
    contactConnections.className = "contact-connections";
    const btnAction = document.createElement("button");
    btnAction.className = "btn-secondary btn-tile-action";
    btnAction.contactObj = contact;

    // Create text
    const contactNameText = document.createTextNode(
      `${contact.name.first} ${contact.name.last}`
    );
    const contactProfessionText = document.createTextNode(contact.title);
    const contactConnectionsText = document.createTextNode(
      `${contact.mutualConnections} mutual connections`
    );
    btnAction.innerText = btnAction.contactObj.connect ? "Pending" : "Connect";

    // Append everything
    contactsContainer.append(contactTile);
    contactTile.append(contactTileHeader, contactTileBody);
    contactTileHeader.append(contactHeaderImg, contactPortraitImg, btnClose);
    contactTileBody.append(
      contactName,
      contactProfession,
      spaceDiv,
      contactConnections,
      btnAction
    );
    contactName.append(contactNameText);
    contactProfession.append(contactProfessionText);
    contactConnections.append(contactConnectionsText);

    // Set contact connection state (pending or not connected)
    contact.connect = contact.connect ? true : false;
  });
}

function changeConnectionState(event) {
  const contact = event.target.contactObj;
  contact.connect = !contact.connect;
  numPendingInvitations += contact.connect ? 1 : -1;
  renderButtonConnectionState();
  renderPendingInvitationsState();
  updateLocalStorage();
}

function renderButtonConnectionState() {
  const allBtnConnect = document.querySelectorAll(".btn-secondary");
  allBtnConnect.forEach((btn) => {
    btn.innerText = btn.contactObj.connect ? "Pending" : "Connect";
  });
}

function renderPendingInvitationsState() {
  const pendingInv = document.querySelector("#pending-inv");

  if (numPendingInvitations <= 0) {
    pendingInv.innerText = "No pending invitations";
  } else if (numPendingInvitations > 0) {
    pendingInv.innerText = `${numPendingInvitations} pending invitations`;
  }
}

function updateLocalStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
  localStorage.setItem("numPendingInvitations", numPendingInvitations);
}

async function removeContactTile(event) {
  const eventContact = event.target.contactObj;
  contacts = contacts.filter((contact) => contact !== eventContact);
  await fetchOneNewContact();
  renderContacts();
  updateLocalStorage();
}

async function fetchOneNewContact() {
  let newContact;
  let contactAlreadyExists = true;

  while (contactAlreadyExists) {
    // keep fetching until we find a newContact that is not in contacts yet
    try {
      const response = await fetch(`${apiUrl}&count=1`);

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      newContact = await response.json(); // response is an array
      newContact = newContact[0]; // save the contact object as newContact

      // check if the newContact already exists in the contacts array
      contactAlreadyExists = contacts.some(
        (contact) =>
          contact.name.first === newContact.name.first &&
          contact.name.last === newContact.name.last
      );
    } catch (error) {
      console.log(`Error fetching contact: ${error}`);
      return;
    }
  }

  // once a unique contact is fetched, add it to the contacts array
  contacts.push(newContact);
}
