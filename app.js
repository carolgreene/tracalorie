//These will all be iife's. Immediately invoked function expressions. wrap
//in parenthesis and invoke at the end of the function w/extra () 
//Will run automatically when the program runs

//Storage Controller

//Item Controller
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
      {id: 0, name: 'Steak Dinner', calories: 1200,},  //show some test data
      {id: 1, name: 'Cookies', calories: 400,},
      {id: 2, name: 'Eggs', calories: 300,}
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
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);

      //add item to items array
      data.items.push(newItem);

      return newItem
    },    

    logData: function() {
      return data
    }
  }
})();

//UI Controller
const UICtrl = (function() {
  //keep all UI selectors together incase they change
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
  }

  //Public methods
  return {
    populateItemList: function(items) {
      let html = '';

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

    getSelectors: function() {
      return UISelectors;
    }

  }
  
})();

//App Controller- This is the main controller. pass in the ItemCtrl & UICtrl
const App = (function(ItemCtrl, UICtrl) {
  //Load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener
    ('click', itemAddSubmit);
  }

  //add event submit
  const itemAddSubmit = function(e) {
   //get form input from UI controller
   const input = UICtrl.getItemInput();
    
   //ck for name & calories
   if(input.name !== '' && input.calories !== ''){
 // add item
    const newItem = ItemCtrl.addItem(input.name, input.calories)
   }
    e.preventDefault();
  }

  //Public methods
  return {
    init: function() {
      //Fetch items from data structure
      const items = ItemCtrl.getItems();

      //Populate list with items
      UICtrl.populateItemList(items)

      //load event listeners
      loadEventListeners()
      
    }
  }
  
})(ItemCtrl, UICtrl);

//Initialize app- call init function
App.init();