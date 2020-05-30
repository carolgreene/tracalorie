//These will all be iife's. Immediately invoked function expressions. wrap
//in parenthesis and invoke at the end of the function w/extra () 
//Will run automatically when the program runs

//-----------------STORAGE CONTROLLELR-----------------------------------------------

const StorageCtrl = (function() {
  return {
    //Public methods
    storeItem: function(item) {
      let items = [];
      //ck if any items in local storage
      if(localStorage.getItem('items') === null) {
        items = [];
        //push new item
        items.push(item);
        //set local storage- must stringify the array
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //must take the string & parse back into array
        items = JSON.parse(localStorage.getItem('items'));

        //push the new item & put everything back in local storage
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items))
      }

    }
  }
})()



//----------------------ITEM CONTROLLER------------------------------------------------


const ItemCtrl = (function() {
  //Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure/ state
  //everything above return is private & can't be accessed outside of the module
  //ie from the browser. If you want it to have public access, must be returned
  //ItemCtrl.data is not accessible, but ItemCtrl.logData() is
  const data = {           //this is like react state
    items: [
      //{id: 0, name: 'Steak Dinner', calories: 1200,},  //show some test data
      //{id: 1, name: 'Cookies', calories: 400,},
      //{id: 2, name: 'Eggs', calories: 300,}
    ],
    currentItem: null,
    totalCalories: 0
  }
  //Public methods
  return {  
    getItems: function() {   //function to return the items above
      return data.items
    },

    //add items
    addItem: function(name, calories) {
      //create id
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0
      }

      //calories to number
      calories = parseInt(calories);  //probably don't need this now that we changed 
                                      //calories type to number in index.html
      //Create new item
      newItem = new Item(ID, name, calories);

      //add item to items array
      data.items.push(newItem);

      return newItem
    },  
    
    getItemById: function(id) {
      let found = null;
      //loop through items
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item
        }        
      })
      return found
    },

    updateItem: function(name, calories) {
      //calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item
        }
      })
      return found
    },

    deleteItem: function(id) {
      //get ids
      const ids = data.items.map(function(item) {
        return item.id;
      })

      //get index
      const index = ids.indexOf(id);

      //Remove item
      data.items.splice(index,1);
    },

    //clear all items
    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem
    },

    getTotalCalories: function() {
      let total = 0
      data.items.forEach(function(item) {
        total += item.calories
      })

      //set total cal in data structure
      data.totalCalories = total;

      //return total
      return data.totalCalories;
    }, 

    logData: function() {
      return data
    }
  }
})();




//----------------UI CONTROLLER-----------------------------------------------------------------------


const UICtrl = (function() {
  //keep all UI selectors together incase they change
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
    totalCalories: '.total-calories'
  }

  //Public methods
  return {
    populateItemList: function(items) {
      let html = ''
      
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
      })

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    //get input from form
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //create li element
      const li = document.createElement('li')
      //add class
      li.className = 'collection-item';
      //add id
      li.id = `item-${item.id}`   //re-watch this to see why we do item-

      //add HTML
      li.innerHTML = `
      <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`
        // Insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      
      //turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`) {
         document.querySelector(`#${itemID}`).innerHTML = `<strong>
         ${item.name}: </strong> <em>${item.calories} Calories</em>
         <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></li>
         </a>`; 
        }
      })
    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = 
      ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = 
      ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn node list into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      })
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },    

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
 
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function() {
      return UISelectors;
    }
  }  
})();






//------------------APP CONTROLLER---------------------------------------------------------
//This is the main controller. pass in the ItemCtrl & UICtrl

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  //Load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener
    ('click', itemAddSubmit);  

    //Disable submit on enter- use this is bc if you hit enter when you're in edit mode
   //it adds it to the meal list. (could also put this in a function & only call it when in edit)
   document.addEventListener('keypress', function(e) {
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      return false;
    }
   })

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener
    ('click', itemEditClick);

    //Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener
    ('click', itemUpdateSubmit);

    //Update item event
    document.querySelector(UISelectors.deleteBtn).addEventListener
    ('click', itemDeleteSubmit);

    //Back Button event
    document.querySelector(UISelectors.backBtn).addEventListener
    ('click', function (e) {      
      UICtrl.clearEditState()
      //e.preventDefault()            to keep pg from refreshing, either preventDefault() or give the button a type="button"
    })                               //I gave the button a type. Otherwise it assumes it's a submit

    //Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener
    ('click', clearAllItemsClick);
  }

  //add item submit
  const itemAddSubmit = function(e) {
   //get form input from UI controller
   const input = UICtrl.getItemInput();   
    
   //ck for name & calories
   if(input.name !== '' && input.calories !== ''){
     // add item
     const newItem = ItemCtrl.addItem(input.name, input.calories)

     //Add item to UI list
     UICtrl.addListItem(newItem);

     //Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();

     //Add total calories to UI
     UICtrl.showTotalCalories(totalCalories);

     //Store in localStorage
     StorageCtrl.storeItem(newItem);

     //Clear Fields
     UICtrl.clearInput();
   }
     e.preventDefault();
  }

  //click edit item 
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      //get list item id (item: item-)
      const listId = e.target.parentNode.parentNode.id;
      
      //Break into an array
      const listIdArray = listId.split('-');
      
      //get the actual id & make it a number w/parseInt (listIdArray is [item:, 0])
      const id = parseInt(listIdArray[1]);
      
      //get item
      const itemToEdit = ItemCtrl.getItemById(id);
      
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();
    }
    
    e.preventDefault()
  }

  //Update item submit
  const itemUpdateSubmit = function(e) {
    //get item input
    const input = UICtrl.getItemInput();

    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //update UI
    UICtrl.updateListItem(updatedItem);
    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault()
  }

  //Delete button event
  const itemDeleteSubmit = function(e) {
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id)

    //delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault()    
  }

  //Clear items event
  const clearAllItemsClick = function() {
    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Remove all items from UI
    UICtrl.removeItems()

    //hide the ul
    UICtrl.hideList();
  }

  //Public methods
  return {
    init: function() {
      //Clear edit state/ set initial state
      UICtrl.clearEditState();
      //Fetch items from data structure
      const items = ItemCtrl.getItems();

      //check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with items
      UICtrl.populateItemList(items)
      }

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);      

      //load event listeners
      loadEventListeners()
      
    }
  }  
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize app- call init function
App.init();


