"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FixSchemaButtonProps {
  onSuccess?: () => void;
}

export default function FixSchemaButton({ onSuccess }: FixSchemaButtonProps) {
  const [isFixing, setIsFixing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFix = async () => {
    setIsFixing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/schema-fix");
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage(
          "Database schema fixed successfully! Please try your operation again.",
        );
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setSuccess(false);
        setMessage(`Error: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to fix database schema. Please contact support.");
      console.error("Error fixing schema:", error);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded" data-oid="jdcvygi">
      <h3 className="text-lg font-medium mb-2" data-oid="frrve92">
        Database Schema Issue
      </h3>
      <p className="text-sm text-gray-600 mb-4" data-oid="aaalxow">
        There seems to be an issue with the database schema. This can happen
        when the database is not properly initialized. Click the button below to
        fix the issue.
      </p>

      <Button
        onClick={handleFix}
        disabled={isFixing || success}
        variant={success ? "outline" : "default"}
        data-oid="sgkzfw."
      >
        {isFixing ? "Fixing..." : success ? "Fixed!" : "Fix Database Schema"}
      </Button>

      {message && (
        <div
          className={`mt-2 p-2 rounded text-sm ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          data-oid="i7sbkxf"
        >
          {message}
        </div>
      )}
    </div>
  );
}
