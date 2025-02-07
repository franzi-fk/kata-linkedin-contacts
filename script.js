const apiUrl = "https://dummy-apis.netlify.app/api/contact-suggestions?count=8";

let contacts;

init();

async function init() {
  await fetchContacts();
  renderContacts();
}

async function fetchContacts() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    return (contacts = await response.json());
  } catch (error) {
    console.log(`Error fetching contacts: ${error}`);
  }
}

function renderContacts() {
  const contactsContainer = document.querySelector("#cnt-contact-sugg-body");

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
    const contactPortraitImg = document.createElement("img");
    contactPortraitImg.className = "contact-portrait-img";
    contactPortraitImg.src = contact.picture;
    contact.alt = "Portrait of Contact";
    const btnClose = document.createElement("button");
    btnClose.className = "btn-icn btn-close-tile";
    btnClose.innerHTML = "&#10005;";

    // Create tile body elements
    const contactName = document.createElement("h2");
    contactName.className = "contact-name";
    const contactProfession = document.createElement("p");
    contactProfession.className = "contact-profession";
    const contactConnections = document.createElement("p");
    contactConnections.className = "contact-connections";
    const btnAction = document.createElement("button");
    btnAction.className = "btn-secondary btn-tile-action";

    // Create text nodes
    const contactNameText = document.createTextNode(
      `${contact.name.first} ${contact.name.last}`
    );
    const contactProfessionText = document.createTextNode(contact.title);
    const contactConnectionsText = document.createTextNode(
      `${contact.mutualConnections} mutual connections`
    );
    const btnActionText = document.createTextNode("Connect");

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
    btnAction.append(btnActionText);
  });
}
