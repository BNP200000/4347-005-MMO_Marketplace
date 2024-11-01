"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button, Nav, Navbar } from "react-bootstrap";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  // Function to determine the color based on the active state
  const getLinkColor = (slug: string) => {
    return pathname === slug ? "#FFFFFF" : "#A3A2A2"; // Active vs inactive color
  };
  return (
    <header>
      <Navbar
        expand="lg"
        style={{ width: "100%", padding: "0.5rem 1rem" }}
        className="bg-dark navbar-dark"
      >
        {/* Left-most part: Logo and Title */}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <span
            className="text-white d-none d-md-block"
            style={{ fontSize: "1.2rem" }}
          >
            MMO Marketplace
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarResponsive" />

        <Navbar.Collapse
          id="navbarResponsive"
          className="justify-content-center"
        >
          <Nav className="align-items-center">
            <Nav.Link
              href="/pet"
              className="mx-2"
              style={{ color: getLinkColor("/pet") }}
              onClick={() => router.push("/pet")}
            >
              Pet
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex align-items-center">
          <Button
            variant="primary"
            className="d-none d-lg-block me-3"
            onClick={() => console.log("TODO")}
          >
            Logout
          </Button>
        </div>
      </Navbar>
    </header>
  );
}
