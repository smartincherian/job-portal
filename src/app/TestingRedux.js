import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrement,
  decrementBy5,
  increment,
  incrementBy5,
} from "../features/counterSlice";
import TestingForm from "./TestingForm";

function TestingRedux() {
  const dispatch = useDispatch();
  const { count1, count2 } = useSelector((state) => state.counter);
  const { name, age } = useSelector((state) => state.form);
  console.log(count1);

  console.log(name);

  return (
    <div>
      TestingRedux
      <h2>Count: {count1}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <h2>Count: {count2}</h2>
      <button onClick={() => dispatch(incrementBy5())}>Increment</button>
      <button onClick={() => dispatch(decrementBy5())}>Decrement</button>
      <TestingForm />
      name: {name}
      age: {age}
    </div>
  );
}

export default TestingRedux;
