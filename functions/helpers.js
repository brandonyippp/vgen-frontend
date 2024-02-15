/* HELPER FUNCTIONS */

// Compare two arrays for element equality with optional <properties> array to examine arrays of objects
export const compareArrays = (arr1, arr2, properties = []) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (properties.length) {
      for (let j = 0; j < arr1.length; j++) {
        if (arr1[i][properties[j]] !== arr2[i][properties[j]]) {
          return false;
        }
      }
    } else {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
  }

  return true;
};

/* todo.js Helper Functions */

// Apply field used to change completion status without immediately moving todo to respective tab <all, incomplete, complete>
export const applySortingField = (todos) => {
  return todos.map((todo) => ({ ...todo, status: todo.completed }));
};

// Sort todo's by their creation date
export const sortByCreationDate = (todos) => {
  return todos.sort((a, b) => new Date(b.created) - new Date(a.created));
};

// Set all todo's in the all tab to the desired result
export const configureAllTab = (setStateFunction, checked) => {
  setStateFunction((prev) =>
    prev.map((item) => ({ ...item, status: checked }))
  );
};

export const configureIncompleteTab = (setStateFunction, checked) => {
  setStateFunction((prev) =>
    prev.map((item) => ({
      ...item,
      status: !item.completed ? checked : item.status,
    }))
  );
};

export const configureCompleteTab = (setStateFunction, checked) => {
  setStateFunction((prev) =>
    prev.map((item) => ({
      ...item,
      status: item.completed ? checked : item.status,
    }))
  );
};
