"use client"; // this is important

import Image from "next/image";
import styles from "./page.module.css";
import Demo from "@/components/Demo";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  // List of tables to display
  const tables = [
    "USER", "CLASS", "CHARACTER", "PARTY",
    "CHARACTER_FRIEND", "ITEM", "IN_INVENTORY", 
    "LISTING", "TRANSACTION"
  ];
  const [table, setTable] = useState("USER");

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTable(event.target.value);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/pet">Click to go to Pets Page</Link>

        <div>
          <label htmlFor="table-select" style={{marginRight:"8px"}}>
            Select Table:
          </label>
          <select 
            id="table-select"
            value={table}
            onChange={handleTableChange}
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}; 
          </select> 
          
        </div>

        <Demo tableName={table}/>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
