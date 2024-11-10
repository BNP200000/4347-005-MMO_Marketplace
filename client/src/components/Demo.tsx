/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // this is important

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Container, Button, Table , Form} from "react-bootstrap";
import {CheckCircleFill, XCircleFill} from "react-bootstrap-icons";
import DummyComponent from "./DummyComponent";

interface TableProp {
  tableName: string;
}

export default function Demo({ tableName }: TableProp) {
  const [message, setMessage] = useState("");
  const [err, setError] = useState();
  const [table, setTable] = useState<any[]>([]); // Store the fetched table
  const [columns, setColumns] = useState<string[]>([]);
  const [formData, setFormData] = useState<{[key: string]: any}>({});
  const [showForm, setShowForm] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const PORT = process.env.PORT || 5001;
  const URL = `http://localhost:${PORT}/${tableName}`;

  // Filter out columns that should not be modifiable
  const filterOut = ["class_id", "character_id", "user_id", "item_id", "listing_id", "transaction_id", "total_price"];
  if(tableName === "TRANSACTION") {
    filterOut.splice(filterOut.indexOf("listing_id"), 1);
  }

  // Handle GET request

  // Query the table on trigger, i.e. a button
  const handleQuery = () => {
    axios
      .get(URL)
      .then((res) => {
        setTable(res.data);
        if (res.data.length > 0) {
          setColumns(Object.keys(res.data[0]));
          setShowForm(true);
        }       
        setMessage(`Successfully fetched ${tableName}`);

        const initForm = res.data.length > 0 ? Object.keys(res.data[0]).reduce((acc, col) => {
          const value = res.data[0][col];

          if(typeof value === "boolean" || Array.isArray(value)) {
            acc[col] = value;
          } else if(col === "allowed_classes") {
            // Get the class names from the CLASS table
            axios.get(`http://localhost:${PORT}/CLASS`)
            .then((classRes) => {
              const classNames = classRes.data.map((classItem: any) => classItem.class_name);
              setClasses(classNames);
            })
            .catch((err) => {
              setError(err);
            });
          } else {
            acc[col] = "";
          }

          return acc;
        }, {} as {[key: string]: any}) : {};
        setFormData(initForm);
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Check if the form data is valid, i.e. no null values
  const formatFormData = (formData: Record<string, any>) => {
    if(["LISTING", "TRANSACTION", "ITEM"].includes(tableName)) {
      if(tableName === "TRANSACTION") {
        if(formData.hasOwnProperty("listing_id")) {
          formData.listing_id = Number(formData.listing_id);
        }
      } else {
        Object.keys(formData)
        .filter(key => key.endsWith("_id"))
        .forEach(key => delete formData[key]);
      }
    }

    // total_price will be set 0 but will be calculated from the LISTING table
    if(tableName === "TRANSACTION" && formData.hasOwnProperty("total_price")) {
      formData.total_price = 0;
    }

    const formattedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key, 
        (typeof value === "string" && (value.toLowerCase() === "null" || value.trim() === ""))
          ? null
          : (!isNaN(Number(value)) && typeof value === "string")
            ? Number(value)
            : value
      ])
    );

    return formattedData
  }

  // Handle POST request
  const handleInsert = () => {
    const formattedData = formatFormData(formData);
    setFormData(formattedData);
    console.log(`Sending: ${JSON.stringify(formattedData, null, 2)}`);
    axios
      .put(URL, formattedData)
      .then((res) => {
        setMessage(`Successfully updated record in ${tableName}`);
        handleQuery(); // Refresh the table data
      })
      .catch((err) => {
        setError(err);
      })
  }

  const handleUpdate = () => {
    const formattedData = formatFormData(formData);
    setFormData(formattedData);
    console.log(`Sending: ${JSON.stringify(formattedData, null, 2)}`);
    axios
      .post(URL, formattedData)
      .then((res) => {
        setMessage(`Successfully inserted into ${tableName}`);
        handleQuery(); // Refresh the table data
      })
      .catch((err) => {
        setError(err);
      })
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, type, checked, value} = e.target;
    setFormData((prevData) => {
      const newData = {...prevData};

      if(name === "allowed_classes") {
        //const currentClasses = newData[name] || [];
        newData[name] = (checked) ? [...(prevData[name] || []), value] : (prevData[name] || [])
        .filter((className: string) => className !== value);
      } else {
        newData[name] = type === "checkbox" ? checked : value;
      }

      return newData;
    })
  };

  // Load immediately
  useEffect(() => {
    setShowForm(false);
    setTable([]);
    setColumns([]);
    setFormData({});
    handleQuery();
  }, [PORT, tableName])

  // Format the table values
  const format = (data: any) => {
    if(Array.isArray(data)) {
      return data.length > 0 ? data.join(', ') : '[]';
    } else if(typeof data === "boolean") {
      return data ? <CheckCircleFill color="green" /> : <XCircleFill color="red" />
    } else if(/\d{0,4}-\d{0,2}-\d{0,2}T?\d{0,2}:\d{0,2}:\d{0,2}.\d{0,3}Z/.test(data)) {
      return data.split("T")[0];
    }
    return data;
  };

  // Display the table
  const tableData = table.length > 0 ? (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>
                {format(row[col])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <p>No data available for this table.</p>
  );

  const displayForm = showForm && tableName !== "USER" && (
    <Form>
      {columns
        .filter(col => !filterOut.includes(col))
        .map((col) => {
          return (
            <Form.Group controlId={`form${col}`} key={col}>
              <Form.Label>{col}</Form.Label>
              {col === "allowed_classes" ? (
                classes.map((item) => (
                  <Form.Check
                    type="checkbox"
                    label={item}
                    name={col}
                    key={item}
                    value={item}
                    checked={formData.allowed_classes?.includes(item)}
                    onChange={handleInput}
                  />
                ))
              ) : typeof formData[col] === "boolean" ? (
                <Form.Check 
                  type="checkbox"
                  label={col}
                  name={col}
                  onChange={handleInput}
                />
              ) : (
                <Form.Control
                  type="text"
                  placeholder={`Enter ${col}`}
                  name={col}
                  value={formData[col] || ""}
                  onChange={handleInput}
                />
              )}
            </Form.Group>
          );
        }
      )}
    </Form>
  );

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        gap: "16px",
        flexDirection: "column",
      }}
    >
      <h5 style={{ color: err ? "red" : message ? "green" : "black" }}>
        {err
          ? "Backend server not running! Please start it."
          : message
          ? `The message from Backend is: "${message}"`
          : "Asking backend for message..."}
      </h5>

      {tableData}

      {displayForm}

      <Container>
        <Row>
          {/*<Col><Button variant="primary" onClick={handleQuery}>QUERY</Button></Col>*/}
          <Col><Button variant="primary" onClick={handleInsert}>INSERT</Button></Col>
          <Col><Button variant="primary">DELETE</Button></Col>
          <Col><Button variant="primary" onClick = {handleUpdate}>UPDATE</Button></Col>
        </Row>
      </Container>

    </div>
  );
}
