// Storage Controller
const StorageCtrl = (function() {
  
  // Public methods
  return {
    storeItem: function(item) {
      let items;

      // Check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];

        // Push new item
        items.push(item);

        // Set LS
        localStorage.setItem('items', JSON.stringify(items));

      } else {
        // Get what is already in LS
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      // Re set LS
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(ID) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if (ID === item.id) {
          items.splice(index, 1);
        }
      });

      // Re set LS
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();


// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Publics methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);
      
      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);
      
      return newItem;
    },
    getItemByID: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      
      return found;
    },
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];


    },
    setCurrentItem: function(itemToEdit) {
      data.currentItem = itemToEdit;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  }
})();



// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    cardTitle: '.card-title'
  }
  
  // Publics methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn nodelist into array (so I can loop through it with foreach)
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeItems: function (){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      // Show buttons
      UICtrl.setEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    setInitialState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.cardTitle).textContent = 'Add Meal / Food Item';
    },
    setEditState: function() {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.cardTitle).textContent = 'Edit Meal / Food Item';
    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();



// App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.setInitialState);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id
      const listID = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIDArray = listID.split('-');

      // Get actual ID
      const ID = parseInt(listIDArray[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemByID(ID);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Item update submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.setEditState();

    e.preventDefault();
  }

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
  
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    
    // Fetch items from data structure
    const items = ItemCtrl.getItems();
    
    // Check if any items
    if (items.length === 0) {
      // Hide UL
      UICtrl.hideList();
    }

    // Clear State
    UICtrl.setInitialState();

    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function(e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from LS
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();

    // Clear State
    UICtrl.setInitialState();

    e.preventDefault();
  }

  // Public methods
  return {
    init: function() {
      // Set inital state, the standard non-editing state
      UICtrl.setInitialState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
      }

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
AppCtrl.init();