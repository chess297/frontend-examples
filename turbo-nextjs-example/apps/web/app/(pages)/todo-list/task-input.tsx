"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "@/lib/actions";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function TaskInput() {
  const [name, setName] = useState("");
  const addTask = async () => {
    createTask(name);
    setName("");
  };

  return (
    <div className="flex justify-between my-8">
      <Input
        type="text"
        className="flex-1 "
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="What needs to be done?"
      />
      <Button type="button" size={"icon"} className="mx-4" onClick={addTask}>
        <PlusIcon />
      </Button>
    </div>
  );
}
