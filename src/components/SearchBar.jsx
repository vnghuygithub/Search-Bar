import React, { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

function SearchBar() {
  const [fieldName, setFieldNames] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    fieldNames: [],
    inputValues: [],
  });
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [inputValues, setInputValues] = useState([]);
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    fetchFieldNames(newInputValue);
    setInputValues([...inputValues, newInputValue]);
  };

  const toggleDropdown = () => {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown.style.display === "block" && inputValue.trim() === "") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  };

  const addOption = (fieldName, inputValue) => {
    const { fieldNames, inputValues } = selectedOptions;
    const updatedFieldNames = [...fieldNames, fieldName];
    const updatedInputValues = [...inputValues, inputValue];

    setSelectedOptions({
      fieldNames: updatedFieldNames,
      inputValues: updatedInputValues,
    });

    setInputValue("");
    inputRef.current.focus();
  };
  useEffect(() => {
    const uniqueFieldNames = [...new Set(selectedOptions.fieldNames)];
    const nonDuplicateFieldNames = fieldName.filter(
      (name) => !uniqueFieldNames.includes(name)
    );
    setFieldNames(nonDuplicateFieldNames);
  }, [selectedOptions]);

  const removeOption = (fieldName, inputValue) => {
    const { fieldNames, inputValues } = selectedOptions;
    const updatedFieldNames = fieldNames.filter((name) => name !== fieldName);
    const updatedInputValues = inputValues.filter(
      (value) => value !== inputValue
    );

    setSelectedOptions({
      fieldNames: updatedFieldNames,
      inputValues: updatedInputValues,
    });

    inputRef.current.focus();
  };

  useEffect(() => {
    const { fieldNames, inputValues } = selectedOptions;
    console.log("Selected Field Names:", fieldNames);
    console.log("Selected Input Values:", inputValues);
    console.log("Selected Options:", selectedOptions);
    console.log(fieldNames);
  }, [selectedOptions]);

  // #1 call api
  const fetchFieldNames = (inputValue) => {
    fetch("http://localhost:3000/employees")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        const results = json;
        console.log(results);
        if (results.length > 0) {
          const fieldNames = Object.keys(results[0]);
          console.log(fieldNames);
          setFieldNames(fieldNames);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched === false) {
      console.log("hasFetch");
      setHasFetched(true);
      fetchFieldNames(inputValue);
    }
  }, [inputValue]);

  const combinedUrl = selectedOptions.fieldNames
    .map((fieldName, index) => {
      const inputValue = selectedOptions.inputValues[index];
      return `${fieldName}_like=${inputValue}`;
    })
    .join("&");

  const fullUrl = `http://localhost:3000/employees?${combinedUrl}`;
  console.log(fullUrl);

  const fetchData = (inputValue) => {
    fetch(fullUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        const results = json;
        console.log(results);
        setResults(results);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  useEffect(() => {
    fetchData(inputValue);
  }, [selectedOptions]);

  return (
    <>
      <div style={{ display: "flex", width: "600px", top: 20 }}>
        <div className="tag-list" id="myTagList">
          {selectedOptions.fieldNames.map((selectedOption, index) => (
            <button
              className="tag-item"
              key={selectedOption}
              onClick={() =>
                removeOption(selectedOption, selectedOptions.inputValues[index])
              }
            >
              {selectedOption} | {selectedOptions.inputValues[index]} x
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Tìm ..."
          value={inputValue}
          onChange={handleChange}
          onClick={toggleDropdown}
          ref={inputRef}
          id="myInput"
          style={{ flex: 1 }}
        />
      </div>

      <ul
        class="dropdown"
        id="dropdownMenu"
        style={{ display: "none", listStyleType: "none" }}
      >
        {fieldName.map((fieldName) => (
          <li
            style={{ textDecoration: "none" }}
            onClick={() => addOption(fieldName, inputValue)}
          >
            Tìm kiếm <strong>{fieldName}</strong> cho "{inputValue}"
          </li>
        ))}
      </ul>

      <table style={{ marginTop: 20 }}>
        <tr>
          <td>employee_id</td>
          <td>fingerprint_id</td>
          <td>full_name</td>
          <td>department</td>
          <td>position</td>
          <td>personal_phone</td>
          <td>work_phone</td>
          <td>work_hours</td>
          <td>email</td>
          <td>termination_date</td>
        </tr>
        {results.map((result, index) => (
          <tr key={index}>
            <td>{result.employee_id}</td>
            <td>{result.fingerprint_id}</td>
            <td>{result.full_name}</td>
            <td>{result.department}</td>
            <td>{result.position}</td>
            <td>{result.personal_phone}</td>
            <td>{result.work_phone}</td>
            <td>{result.work_hours}</td>
            <td>{result.email}</td>
            <td>{result.termination_date}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default SearchBar;
