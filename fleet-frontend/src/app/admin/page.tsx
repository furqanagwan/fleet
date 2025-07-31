"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: { name: string };
};

type Driver = {
  id: string;
  name: string;
  email: string;
};

function AdminDashboardContent() {
  const { user, token, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:3000/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setJobs(data);
  };

  const fetchDrivers = async () => {
    const res = await fetch("http://localhost:3000/users/drivers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDrivers(data);
  };

  const createJob = async () => {
    const res = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        assignedTo: assignedTo === "unassigned" ? undefined : assignedTo,
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setAssignedTo("");
      fetchJobs();
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchJobs();
      fetchDrivers();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Job</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            value={assignedTo}
            onValueChange={(val) => setAssignedTo(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign a driver (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name} ({driver.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={createJob}>Create Job</Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">All Jobs</h2>
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="py-4 space-y-1">
              <div className="font-medium">{job.title}</div>
              <div className="text-sm text-muted-foreground">
                {job.description}
              </div>
              <Badge variant="outline">Status: {job.status}</Badge>
              <div className="text-sm">
                Assigned To:{" "}
                <span className="font-medium">
                  {job.assignedTo?.name ?? "Unassigned"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireRole="ADMIN">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
