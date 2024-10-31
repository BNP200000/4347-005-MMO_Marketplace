"use client"; // this is important

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Container, Button, Table , Form} from "react-bootstrap";
import {CheckCircleFill, XCircleFill} from "react-bootstrap-icons";
import DummyComponent from "./DummyComponent";

interface TableProp {
  tableName: string;
}

export default function Demo({tableName}: TableProp) {
  const [message, setMessage] = useState("");
  const [err, setError] = useState();
  const [table, setTable] = useState<any[]>([]); // Store the fetched table
  const [columns, setColumns] = useState<string[]>([]);
  const [formData, setFormData] = useState<{[key: string]: any}>({});
  const [showForm, setShowForm] = useState(false);
  const PORT = process.env.PORT || 5001;
  const filterOut = tableName === "ITEM" || tableName === "LISTING"
  ? ["item_id", "listing_id"] : [];

  // Handle GET request
  const handleQuery = () => {
    axios
      .get(`http://localhost:${PORT}/${tableName}`)
      .then((res) => {
        setTable(res.data);
        if(res.data.length > 0) {
          setColumns(Object.keys(res.data[0]));
          setShowForm(true);
        }       
        setMessage(`Successfully fetched ${tableName}`);

        const initForm = res.data.length > 0 ? Object.keys(res.data[0]).reduce((acc, col) => {
          acc[col] = "";
          return acc;
        }, {} as {[key: string]: any}) : {};
        setFormData(initForm);

      })
      .catch((err) => {
        console.error("ERROR = " + err);
        setError(err);
      });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
  }

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

  const displayForm = showForm && (
    <Form>
      <h6>INSERT {tableName}</h6>
      {columns
        .filter(col => !filterOut.includes(col))
        .map((col) => (
        <Form.Group controlId={`form${col}`} key={col}>
          <Form.Label></Form.Label>
          <Form.Control
            type="text"
            placeholder={`Enter ${col}`}
            name={col}
            value={formData[col] || ""}
            onChange={handleInput}
            required
          />
        </Form.Group>
      ))}
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
          <Col><Button variant="primary" onClick={handleQuery}>QUERY</Button></Col>
          <Col><Button variant="primary">INSERT</Button></Col>
          <Col><Button variant="primary">DELETE</Button></Col>
          <Col><Button variant="primary">UPDATE</Button></Col>
        </Row>
      </Container>

    </div>
  );
}
