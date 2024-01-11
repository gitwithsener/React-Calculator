import { useState } from "react";
import { evaluate } from 'mathjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

const buttons = [
    { id: "clear", label: "AC", className: "light-gray", value: "clear" },
    { id: "negative", label: "+/-", className: "light-gray", value: "negative" },
    { id: "percentage", label: "%", className: "light-gray", value: "percentage" },
    { id: "seven", label: "7", className: "dark-gray", value: "7" },
    { id: "eight", label: "8", className: "dark-gray", value: "8" },
    { id: "nine", label: "9", className: "dark-gray", value: "9" },
    { id: "divide", label: "/", className: "grey", value: "/" },
    { id: "four", label: "4", className: "dark-gray", value: "4" },
    { id: "five", label: "5", className: "dark-gray", value: "5" },
    { id: "six", label: "6", className: "dark-gray", value: "6" },
    { id: "multiply", label: "*", className: "grey", value: "*" },
    { id: "one", label: "1", className: "dark-gray", value: "1" },
    { id: "two", label: "2", className: "dark-gray", value: "2" },
    { id: "three", label: "3", className: "dark-gray", value: "3" },
    { id: "subtract", label: "-", className: "grey", value: "-" },
    { id: "zero", label: "0", className: "dark-gray", value: "0" },
    { id: "decimal", label: ".", className: "dark-gray", value: "." },
    { id: "add", label: "+", className: "grey", value: "+" },
    { id: "equals", label: "=", className: "grey", value: "=" },
  ];

const Display = ({ response, statement }) => {
    return (
    <div id="display">
      <div className="statement">{statement}</div>
      <div className="result">{response}</div>
    </div>
    );
  };

const Button = ({ className, id, value, onClick, label }) => {
    return (
      <button
        className={className}
        id={id}
        value={value}
        onClick={() => onClick(value)}
      >
        {label}
      </button>
    );
  };

  const Author = () => {
    return (
      <div className='author'>Designed and Coded By<br></br>
      <span>R. Sener Kulaksiz</span>
      </div>
    );
  };

  function App() {
    const [response, setResponse] = useState("");
    const [statement, setStatement] = useState("0");
    const et = statement.trim();
  
    const isOperator = (value) => /[*/+-]/.test(value);
  
    const handleClick = (item) => {
      if (item === "clear") {
        setResponse("");
        setStatement("0");
      } else if (item === "negative") {
        if (response) setResponse((r) => (r.startsWith('-') ? r.slice(1) : `-${r}`));
      } else if (item === "percentage" && response) {
        if (response === "") return;
        setResponse((parseFloat(response) / 100).toString());
      } else if (isOperator(item)) {
        setStatement((s) => (isOperator(s.charAt(s.length - 1)) ? s.slice(0, -1) + item : s + ` ${item} `));
      } else if (item === "=") {
        calculated();
      } else if (item === "0") {
        if (statement.charAt(0) !== "0") {
          setStatement(statement + item);
        }
      } else if (item === ".") {
        // split by operators and get last number
        const lastNumber = statement.split(/[-+*/]/).pop();
        if (lastNumber && lastNumber.includes('.')) return;
        setStatement((s) => s + item);
      } else {
        if (statement.charAt(0) === "0") {
          setStatement(statement.slice(1) + item);
        } else {
          setStatement(statement + item);
        }
      }
    };
  
    const calculated = () => {
      // if last char is an operator, do nothing
      if (isOperator(et.charAt(et.length - 1)) || et === "") return;

      const tokens = et.match(/(\d+\.?\d*|\D)/g);
      const filteredTokens = [];
      let lastToken = null;

      try {
        for (const token of tokens) {
          if (isOperator(token)) {
            if (isOperator(lastToken) && token !== "-" && lastToken !== "-") {
              // If consecutive operators and not a negative sign, replace the last one
              filteredTokens.pop();
            }
          }
          filteredTokens.push(token);
          lastToken = token;
        }

        const newStatement = filteredTokens.join(" ");
        // Evaluate the new expression and update the answer
        const result = eval(response + newStatement);
        // Check if the result is a valid number
        if (!isNaN(result) && typeof result === 'number') {
          setResponse(result.toString());
        } else {
          throw new Error('Invalid result');
        }
        // Clear the expression
        setStatement("");
      } catch (error) {
        console.error('Calculation error:', error);
        // Handle the error, e.g., display an error message to the user
      }
    };
    
    return (
      <>
      <div>
      <div className='calculator'>
        <Display statement={statement} response={response} />
        {buttons.map((button) => (
          <Button
          key={button.id} 
          className={button.className} 
          id={button.id} 
          value={button.value}
          onClick={handleClick}
          label={button.label}
          />
        ))}
      </div>
      <Author />
    </div>
    </>
    );
  }
  export default App;