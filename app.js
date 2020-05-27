//These will all be iffe's. Immediately invoked function expressions. wrap
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
    logData: function() {
      return data
    }
  }
})();

//UI Controller
const UICtrl = (function() {

  //Public methods
  return {

  }
  
})();

//App Controller- This is the main controller. pass in the ItemCtrl & UICtrl
const App = (function(ItemCtrl, UICtrl) {
  //console.log(ItemCtrl.logData())

  //Public methods
  return {
    init: function() {
      console.log('initializing app...')
    }
  }
  
})(ItemCtrl, UICtrl);

//Initialize app- call init function
App.init();