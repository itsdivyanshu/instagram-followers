function extractUsernames(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const anchors = doc.querySelectorAll('a[href^="https://www.instagram.com/"]');
  return new Set([...anchors].map((a) => a.href.split("/")[3]).filter(Boolean));
}

document.getElementById("analyzeBtn").onclick = async () => {
  const followersFile = document.getElementById("followersFile").files[0];
  const followingFile = document.getElementById("followingFile").files[0];

  if (!followersFile || !followingFile) {
    alert("Please upload both files.");
    return;
  }

  const followersText = await followersFile.text();
  const followingText = await followingFile.text();

  const followers = extractUsernames(followersText);
  const following = extractUsernames(followingText);

  const notFollowingBack = [...followers].filter((x) => !following.has(x));
  const youDontFollowBack = [...following].filter((x) => !followers.has(x));
  const mutuals = [...followers].filter((x) => following.has(x));

  const renderList = (list, elementId, headerId) => {
    const ul = document.getElementById(elementId);
    ul.innerHTML = "";
    list.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user;
      ul.appendChild(li);
    });
    if (headerId) {
      const header = document.getElementById(headerId);
      if (header)
        header.textContent = `${header.dataset.base} (${list.length})`;
    }
  };

  renderList(notFollowingBack, "notFollowingBack", "notFollowingBackHeader");
  renderList(youDontFollowBack, "youDontFollowBack", "youDontFollowBackHeader");
  renderList(mutuals, "mutuals", "mutualsHeader");
};
