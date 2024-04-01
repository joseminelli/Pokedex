const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");

inputElement.addEventListener("input", () => {
  handleInputChange(inputElement);
});
search_icon.addEventListener("click", handleSearchCloseOnClick);

function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  if (inputValue !== "") {
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}

function handleSearchCloseOnClick() {
  document.querySelector("#search-input").value = "";
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible");
}

function handleSortIconOnClick() {
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open");
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}
