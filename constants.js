export const todoTabs = ["All", "Incomplete", "Complete"];

export const todoTabLiterals = {
  all: "All",
  incomplete: "Incomplete",
  complete: "Complete",
};

export const sortOptions = [
  "Creation Date ↑",
  "Creation Date ↓",
  "Alphabetical ↑",
  "Alphabetical ↓",
];

export const sortOptionLiterals = {
  creationDateAscending: "Creation Date ↑",
  creationDateDescending: "Creation Date ↓",
  alphabeticalAscending: "Alphabetical ↑",
  alphabeticalDescending: "Alphabetical ↓",
};

export const minPasswordLength = 6;

// Used by middleware
export const authenticatedPaths = ["/", "/create", "/todos"];
export const unauthenticatedPaths = ["/signup", "/signin"];
