import React from "react";
import { useSelector } from "react-redux";
import "./JobSelected.css";

function JobSelected() {
  const listingSelected = useSelector(
    (state) => state.listings.listingSelected
  );
  return (
    <div>
      <h3 className="job-selected-text job-selected-title">
        <span className="job-selected-field">Title: </span>
        {listingSelected.title}
      </h3>

      <h4 className="job-selected-text job-selected-company-name">
        <span className="job-selected-field">Company Name: </span>
        {listingSelected.companyName}
      </h4>
      <h4 className="job-selected-text job-selected-location">
        <span className="job-selected-field">Location: </span>
        {listingSelected.location}
      </h4>
      <h4 className="job-selected-text job-selected-type">
        <span className="job-selected-field">Type: </span>
        {listingSelected.type}
      </h4>
      <div className="job-selected-inside-div">
        <h4 className="job-selected-text job-selected-inside-div-font">
          <span className="job-selected-field">Brief Description: </span>
          {listingSelected.briefDescription}
        </h4>
        <h4 className="job-selected-text job-selected-inside-div-font">
          <span className="job-selected-field">Requirements : </span>
          <div className="listing-selected-list">
            {listingSelected.requirements.map((element, array) => (
              <li key={element}>{element}</li>
            ))}
          </div>
        </h4>

        <h4 className="job-selected-text job-selected-inside-div-font">
          <span className="job-selected-field">Qualifications Required: </span>
          {listingSelected.qualifications}
        </h4>
      </div>
    </div>
  );
}

export default JobSelected;
