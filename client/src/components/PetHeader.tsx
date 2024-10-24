"use client";
import { useParams } from "next/navigation";

export default function PetHeader() {
  const params = useParams<{ petId: string }>();
  return <h1>Pet #{params.petId}</h1>;
}
