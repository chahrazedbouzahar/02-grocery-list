import './App.css';
import groceryCartImg from './assets/grocery-cart.png';



import { useState, useEffect } from "react"



function App() {
  // Initialize groceryItems state with stored items from local storage
  const [inputValue, setInputValue] = useState("");
  const [groceryItems, setGroceryItems] = useState(
    JSON.parse(localStorage.getItem("groceryItems")) || []
  );
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    determineCompletedStatus();
  }, [groceryItems]);

  const handleChangeInputValue = (e) => {
    setInputValue(e.target.value);
  };

  const determineCompletedStatus = () => {
    if (!groceryItems.length) {
      return setIsCompleted(false);
    }

    let isAllCompleted = true;

    groceryItems.forEach((item) => {
      if (!item.completed) {
        isAllCompleted = false;
      }
    });

    setIsCompleted(isAllCompleted);
  };

  const handleAddGroceryItem = (e) => {
    if (e.key === "Enter") {
      if (inputValue) {
        const updatedGroceryList = [...groceryItems];
        const itemIndex = updatedGroceryList.findIndex(
          (item) => item.name === inputValue
        );

        if (itemIndex === -1) {
          updatedGroceryList.push({
            name: inputValue,
            quantity: 1,
            completed: false,
          });
        } else {
          updatedGroceryList[itemIndex].quantity++;
        }

        setGroceryItems(updatedGroceryList);
        setInputValue("");
      }
    }
  };

  const handleRemoveItem = (name) => {
    setGroceryItems([...groceryItems].filter((item) => item.name !== name));
  };

  const handleUpdateCompleteStatus = (status, index) => {
    const updatedGroceryList = [...groceryItems];
    updatedGroceryList[index].completed = status;
    setGroceryItems(updatedGroceryList);
  };

  // Save groceryItems to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(groceryItems));
  }, [groceryItems]);

  // Clear local storage when all items are completed
  useEffect(() => {
    if (isCompleted) {
      localStorage.removeItem("groceryItems");
    }
  }, [isCompleted]);


  const renderGroceryList = () => {
    return groceryItems.map((item, index) => (
      <li key={item.name}>
        <div className="container">
          <input
            type="checkbox"
            onChange={(e) => {
              handleUpdateCompleteStatus(e.target.checked, index);
            }}
            value={item.completed}
            checked={item.completed}
          />
          <p>
            {item.name} {item.quantity > 1 && <span>x{item.quantity}</span>}
          </p>
        </div>
        <div>
          <button
            className="remove-button"
            onClick={() => handleRemoveItem(item.name)}
          >
            X
          </button>
        </div>
      </li>
    ));
  };

  const handleResetGroceryList = () => {
    // Show a confirmation dialog before resetting
    const confirmReset = window.confirm(
      "Are you sure you want to clear the list? This will delete all your items."
    );
  
    if (confirmReset) {
      // Clear the grocery list and local storage
      setGroceryItems([]);
      localStorage.removeItem("groceryItems");
    }
  };
  

  return (
    <main className="App">
      <div>
        <div>
          {isCompleted && <h4 className="success">You're Done</h4>}
          <div className="header">
            <h1>Shopping List</h1>
            <img src={groceryCartImg} alt="" />
            <input
              type="text"
              placeholder="Add an item"
              className="item-input"
              onChange={handleChangeInputValue}
              onKeyDown={handleAddGroceryItem}
              value={inputValue}
            />
          </div>
        </div>
        <ul>{renderGroceryList()}</ul>
        <button onClick={handleResetGroceryList}style={{
            backgroundColor: '#f44336',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            marginTop: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >clear List</button>
      </div>
    </main>
  );
}

export default App;