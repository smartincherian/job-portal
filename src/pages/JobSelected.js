import React from "react";
import { useSelector } from "react-redux";

function JobSelected() {
  const listingSelected = useSelector(
    (state) => state.listings.listingSelected
  );
  return (
    <div>
      <h2>
        <span className="listing-selected-field">Title: </span>
        {listingSelected.title}
      </h2>
      <h3>
        <span className="listing-selected-field">Company Name: </span>
        {listingSelected.companyName}
      </h3>
      <h4>
        <span className="listing-selected-field">Location: </span>
        {listingSelected.location}
      </h4>
      <h4>
        <span className="listing-selected-field">Type: </span>
        {listingSelected.type}
      </h4>
      <h4>
        <span className="listing-selected-field">Brief Description: </span>
        {listingSelected.briefDescription}
      </h4>
      <h4>
        <span className="listing-selected-field">Requirements : </span>
        <div className="listing-selected-list">
          {listingSelected.requirements.map((element, array) => (
            <li key={element}>{element}</li>
          ))}
        </div>
      </h4>

      <h4>
        <span className="listing-selected-field">
          Qualifications Required:{" "}
        </span>
        {listingSelected.qualifications}
      </h4>
    </div>
  );
}

export default JobSelected;
