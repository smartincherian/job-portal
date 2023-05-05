import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { submit } from "../features/formSlice";

function TestingForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const dispatch = useDispatch();
  return (
    <div>
      <h2>Enter your name</h2>
      <input
        type="text"
        placeholder="enter name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="enter age"
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={() => dispatch(submit({ name, age }))}>Submit</button>
    </div>
  );
}

export default TestingForm;
