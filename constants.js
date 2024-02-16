/* Constants */

// todo.js Constants
export const todoTabs = ["All", "Incomplete", "Complete"];

export const todoTabLiterals = {
  all: "All",
  incomplete: "Incomplete",
  complete: "Complete",
};

export const sortOptionLiterals = {
  creationDateAscending: "Creation Date ↑",
  creationDateDescending: "Creation Date ↓",
  alphabeticalAscending: "Alphabetical ↑",
  alphabeticalDescending: "Alphabetical ↓",
};

export const sortOptions = [
  "Creation Date ↑",
  "Creation Date ↓",
  "Alphabetical ↑",
  "Alphabetical ↓",
];

export const todoHeaders = [
  "Todo Name",
  "Status",
  "Created (mm/dd/yy)",
  "Action",
];

export const minPasswordLength = 6;

// Used by middleware
export const authenticatedPaths = ["/", "/create", "/todos"];
export const unauthenticatedPaths = ["/signup", "/signin"];
