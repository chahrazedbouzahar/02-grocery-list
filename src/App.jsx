import './App.css';
import groceryCartImg from "./assets/grocery-cart.png" 
import { useState, useEffect } from "react";

function App() {
  const [inputvalue, setInputValue] = useState("");
  const [groceryItems, setGroceryItems] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Save grocery items to local storage
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
  }, [groceryItems]);

  useEffect(() => {
    // Retrieve grocery items from local storage
    const storedItems = JSON.parse(localStorage.getItem('groceryItems'));
    if (storedItems) {
      setGroceryItems(storedItems);
    }
  }, []);

  useEffect(() => {
    determineCompletedStatus();
  }, [groceryItems]);

  const handleChangeInputValue = (e) =>{
    setInputValue(e.target.value);
  };

  const determineCompletedStatus = () =>{
    if(!groceryItems.length) {
      return setIsCompleted(false)
    }

    let isAllCompleted = true;

    groceryItems.forEach(item => {
      if (!item.completed) {
        isAllCompleted = false;
      }
    })
    setIsCompleted(isAllCompleted);
  };

  const handleAddGroceryItem =(e) => {
    if(e.key === 'Enter') {
      if(inputvalue) {
        const updatedGroceryList = [...groceryItems]  
        const itemIndex = updatedGroceryList.findIndex(item => item.name === inputvalue);
        if(itemIndex === -1) {
          updatedGroceryList.push({
            name: inputvalue,
            quantity: 1,
            completed: false
          })
        } else {
          updatedGroceryList[itemIndex].quantity++
        }

        setGroceryItems(updatedGroceryList)
        setInputValue("");
      }
    }
  };

  const handleRemoveItem = (name) => {
    setGroceryItems([...groceryItems].filter(item => item.name !== name));
  }

  const handleUpdateCompleteStatus =(status, index) => {
    const updatedGroceryList = [...groceryItems]  ;
    updatedGroceryList[index].completed = status;
    setGroceryItems(updatedGroceryList);
  }

  const renderGroceryList = () => {
    return groceryItems.map((item, index) => (
      <li key={item.name}>
        <div className='container'>
          <input type="checkbox" 
            onChange={(e) => {
              handleUpdateCompleteStatus(e.target.checked, index)
            }}
            value={item.completed}
            checked={item.completed}
          />
          <p>{item.name} {item.quantity > 1 && <span>x{item.quantity}</span>}</p>
        </div>
        <div>
          <button className='remove-button' onClick={() =>handleRemoveItem(item.name)}>X</button>
        </div>
      </li>
    )); 
  };

  const handleResetGroceryList = () => {
    const confirmReset = window.confirm('Are you sure you want to clear the list? This will delete all your items.');
    if (confirmReset) {
      localStorage.removeItem('groceryItems');
      setGroceryItems([]);
    }
  };

  return (
    <main className="App">
      <div>
        <div>
          {isCompleted && <h4 className='success'>You're Done</h4>}
          <div className='header'>
            <h1>Shopping List</h1>
            <img src={groceryCartImg} alt="" />
            <input 
              type="text" 
              placeholder='Add an item' 
              className='item-input' 
              onChange={handleChangeInputValue}
              onKeyDown={handleAddGroceryItem}
              value={inputvalue}
            />
          </div>
        </div>
        <ul>{renderGroceryList()}</ul>
        <button onClick={handleResetGroceryList} style={{ backgroundColor: '#f44336', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', marginTop: '10px', cursor: 'pointer', borderRadius: '5px' }}>
  <span>Clear List</span>
</button>
      </div>
    </main>
  );
}

export default App;
