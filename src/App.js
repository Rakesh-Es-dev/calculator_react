import React, { useState } from "react";

import Container from "./components/Container";
import Display from "./components/Display";
import ButtonContainer from "./components/ButtonContainer";
import Buttons from "./components/Buttons";
// buttons to be dispayed in 2d Array
const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

//converting Number to String
const convertString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

//Removing the Spaces
const eliminateSpaces = (num) => num.toString().replace(/\s/g, "");
//App Component
const App = () => {
  //calculator State where the sign, number and the result is stored
  const [calculator, setCalculator] = useState({
    sign: "",
    num: 0,
    res: 0,
  });

  //EventListener for Number Click
  const numClickHandler = (e) => {
    e.preventDefault();
    //Value of the button Clicked
    const value = e.target.innerHTML;
    //to allow only 16 digit Calculations
    if (eliminateSpaces(calculator.num).length < 16) {
      //setting the State
      setCalculator({
        //copying all state values of calculator
        ...calculator,
        //changes in num variable of the state
        num:
          //if existing num is 0 and value enter is 0 then the num is set to 0 else append value to number
          // and then convert it to string
          calculator.num === 0 && value === "0"
            ? "0"
            : convertString(Number(eliminateSpaces(calculator.num + value))),
        //changes in res variable of the state if the sign is present then the result is 0
        // else the res value from the previous state
        res: !calculator.sign ? 0 : calculator.res,
      });
    }
  };
  //event Listener for the Decimal point button click
  const decimalClickHandler = (e) => {
    e.preventDefault();
    //Value of the button Clicked
    const value = e.target.innerHTML;
    //setting the State
    setCalculator({
      //copying all state values of calculator
      ...calculator,
      //if the num doesn't has the decimal point the we will append the decimal point
      // else the number from the previous state is taken
      num: !calculator.num.toString().includes(".")
        ? calculator.num + value
        : calculator.num,
    });
  };
  // event listner for +,-,/,X
  const operationClickHandler = (e) => {
    e.preventDefault();
    //Value of the button Clicked
    const value = e.target.innerHTML;
    //setting the State
    setCalculator({
      //copying all state values of calculator
      ...calculator,
      //updating sign of the state to the value clicked
      sign: value,
      //if res is not present and num is present then the result will be num else res
      res: !calculator.res && calculator.num ? calculator.num : calculator.res,
      num: 0,
    });
  };
  //event Listener for =
  const equalsClickHandler = () => {
    // check if sign and number is present
    if (calculator.sign && calculator.num) {
      //function calculate the result
      const math = (a, b, sign) => {
        switch (sign) {
          case "+":
            return a + b;
          case "-":
            return a - b;
          case "X":
            return a * b;
          case "/":
            return a / b;
        }
      };
      //seting calculator state
      setCalculator({
        //copying previous state
        ...calculator,
        //change res of the state
        res:
          //handling divide by zero error
          calculator.num === "0" && calculator.sign === "/"
            ? "Can't divide with 0"
            : convertString(
                math(
                  Number(eliminateSpaces(calculator.res)),
                  Number(eliminateSpaces(calculator.num)),
                  calculator.sign
                )
              ),
        //reseting sign of the state
        sign: "",
        //resseting num of the state
        num: 0,
      });
    }
  };
  //event handler for +/-
  const invertClickHandler = () => {
    setCalculator({
      ...calculator,
      //multiplying num with -1
      num: calculator.num
        ? convertString(eliminateSpaces(calculator.num) * -1)
        : 0,
      //multiply the res with -1
      res: calculator.res
        ? convertString(eliminateSpaces(calculator.res) * -1)
        : 0,
      //reseting sign Value
      sign: "",
    });
  };

  //Event listener for %
  const percentClickHandler = () => {
    //coverting num to float value
    let num = calculator.num ? parseFloat(eliminateSpaces(calculator.num)) : 0;
    //coverting res to float value
    let res = calculator.res ? parseFloat(eliminateSpaces(calculator.res)) : 0;
    setCalculator({
      //copying the state values
      ...calculator,
      //diving the num by 100 and storing it to num
      num: (num /= 100),
      //diving the res by 100 and storing it to res
      res: (res /= 100),
      //reseting sign value
      sign: "",
    });
  };
  //event listener for reseting the calculator
  const resetClickHandler = () => {
    setCalculator({
      //copying the state values
      ...calculator,
      //changing sign to empty
      sign: "",
      //changing number to 0
      num: 0,
      //changing result to 0
      res: 0,
    });
  };

  return (
    <Container>
      <Display value={calculator.num ? calculator.num : calculator.res} />
      <ButtonContainer>
        {btnValues.flat().map((btn, i) => {
          return (
            <Buttons
              key={i}
              className={btn === "=" ? "btn equals" : "btn"}
              value={btn}
              onClick={
                btn === "C"
                  ? resetClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? operationClickHandler
                  : btn === "."
                  ? decimalClickHandler
                  : numClickHandler
              }
            />
          );
        })}
      </ButtonContainer>
    </Container>
  );
};

export default App;
