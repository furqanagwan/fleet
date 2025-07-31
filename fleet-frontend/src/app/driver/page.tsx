"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
};

export default function DriverDashboard() {
  const { user, token, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:3000/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setJobs(data);
  };

  const updateStatus = async (jobId: string, status: string) => {
    await fetch(`http://localhost:3000/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchJobs();
  };

  useEffect(() => {
    if (user?.role === "DRIVER") {
      fetchJobs();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <Button variant="destructive" onClick={logout}>
          Log out
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge
                variant={
                  job.status === "PENDING"
                    ? "secondary"
                    : job.status === "ACCEPTED"
                      ? "default"
                      : "success"
                }
              >
                Status: {job.status}
              </Badge>

              {job.status === "PENDING" && (
                <Button onClick={() => updateStatus(job.id, "ACCEPTED")}>
                  Accept Job
                </Button>
              )}

              {job.status === "ACCEPTED" && (
                <Button
                  variant="success"
                  onClick={() => updateStatus(job.id, "COMPLETED")}
                >
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
