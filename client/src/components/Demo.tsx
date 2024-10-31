"use client"; // this is important

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Container, Button, Table } from "react-bootstrap";
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
  
  const PORT = process.env.PORT || 5001;

  // GET
  useEffect(() => {
    axios
      .get(`http://localhost:${PORT}/${tableName}`)
      .then((res) => {
        setTable(res.data);
        if(res.data.length > 0) {
          setColumns(Object.keys(res.data[0]));
        }       
        setMessage(`Successfully fetched ${tableName}`);
      })
      .catch((err) => {
        console.error("ERROR = " + err);
        setError(err);
      });
  }, [tableName]);

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


      <h5>Now for some demo components..</h5>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Container>
        <Row>
          <Col>1 of 2</Col>
          <Col>2 of 2</Col>
          <Col>3 of 3</Col>
          <Col>4 of 4</Col>
        </Row>
      </Container>
      <DummyComponent />
    </div>
  );
}
