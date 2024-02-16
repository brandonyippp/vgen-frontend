import * as Constants from "../constants.js";

/* HELPER FUNCTIONS */

/* TEST/DEBUGGING FUNCTIONS */

// Enumerate the number of differences between either array elements directly, or object properties of array of objects
export const enumerateArrayDifferences = (
  altered,
  original,
  properties = []
) => {
  const len =
    altered.length !== original.length
      ? Math.min(altered.length, original.length)
      : altered.length;
  let count = 0;

  for (let i = 0; i < len; i++) {
    if (properties.length) {
      for (let j = 0; j < altered.length; j++) {
        if (altered[i][properties[j]] !== original[i][properties[j]]) {
          count++;
        }
      }
    } else {
      if (altered[i] !== original[i]) {
        count++;
      }
    }
  }

  return count + Math.abs(altered.length - original.length);
};

// Return all elements in altered that differed from original at respective i'th position
export const returnArrayDifferences = (altered, original, properties = []) => {
  let min = Math.min(altered.length, original.length);
  let max = Math.min(altered.length, original.length);

  const len = altered.length !== original.length ? min : altered.length;

  let res = [];

  for (let i = 0; i < len; i++) {
    if (properties.length) {
      for (let j = 0; j < altered.length; j++) {
        if (altered[i][properties[j]] !== original[i][properties[j]]) {
          res.push(altered[i]);
        }
      }
    } else {
      if (altered[i] !== original[i]) {
        res.push(altered[i]);
      }
    }
  }

  // Collect the rest of the elements
  while (min < max) {
    res.push(min === altered.length ? original[min] : altered[min]);
    min++;
  }

  return res;
};

// Compare two arrays for element equality with optional <properties> array to examine arrays of objects
export const compareArrays = (altered, original, properties = []) => {
  if (altered.length !== original.length) {
    return false;
  }

  for (let i = 0; i < altered.length; i++) {
    if (properties.length) {
      for (let j = 0; j < altered.length; j++) {
        if (altered[i][properties[j]] !== original[i][properties[j]]) {
          return false;
        }
      }
    } else {
      if (altered[i] !== original[i]) {
        return false;
      }
    }
  }

  return true;
};

/* todo.js Helper Functions */

export const getFilteredActiveList = (list, activeTab) => {
  if (activeTab === Constants.todoTabLiterals.all) {
    return list;
  } else if (activeTab === Constants.todoTabLiterals.incomplete) {
    return list.filter((todo) => !todo.completed);
  } else if (activeTab === Constants.todoTabLiterals.complete) {
    return list.filter((todo) => todo.completed);
  }
};

// Parent function for below-sort methods, used when sorting todo's on various tabs on given criterion
export const sortByCriteria = (list, sortOption) => {
  if (sortOption === Constants.sortOptionLiterals.creationDateAscending) {
    sortByCreationDate(list, false);
  } else if (
    sortOption === Constants.sortOptionLiterals.creationDateDescending
  ) {
    sortByCreationDate(list);
  } else if (
    sortOption === Constants.sortOptionLiterals.alphabeticalAscending
  ) {
    sortByAlphabetical(list, false);
  } else if (
    sortOption === Constants.sortOptionLiterals.alphabeticalDescending
  ) {
    sortByAlphabetical(list);
  }
};

// Apply field used to establish local changes to completion checked of todo (todo.completed controls actual placement of todo in respective tab)
// checked can be thought of as a preliminary change to completion checked before updating DB
export const applySortingField = (todos) => {
  return todos.map((todo) => ({ ...todo, checked: false }));
};

// Sort todo's by their creation date
export const sortByCreationDate = (todos, descending = true) => {
  return todos.sort((a, b) =>
    descending
      ? new Date(b.created) - new Date(a.created)
      : new Date(a.created) - new Date(b.created)
  );
};

export const sortByAlphabetical = (todos, descending = true) => {
  return todos.sort((a, b) =>
    descending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  );
};

// Set all todo's in the all tab to the desired result
export const configureAllTab = (setStateFunction, checked) => {
  setStateFunction((prev) =>
    prev.map((item) => ({ ...item, checked: checked }))
  );
};

export const configureIncompleteTab = (setStateFunction, checked) => {
  setStateFunction((prev) =>
    prev.map((item) => ({
      ...item,
      checked: !item.completed ? checked : item.checked,
    }))
  );
};

export const configureCompleteTab = (setStateFunction, checked) => {
  setStateFunction((prev) =>
    prev.map((item) => ({
      ...item,
      checked: item.completed ? checked : item.checked,
    }))
  );
};
