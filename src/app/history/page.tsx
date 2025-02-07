'use client';

import { useSessions } from '@/hooks/useSessions';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function History() {
  const { sessions, downloadSession, deleteSession } = useSessions();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Attendance History</h1>
          <Button asChild>
            <Link href="/">New Session</Link>
          </Button>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No attendance sessions yet
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {new Date(session.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{session.department}</TableCell>
                    <TableCell>{session.year}</TableCell>
                    <TableCell>{session.students.length}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => downloadSession(session)}
                        className="mr-2"
                      >
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => deleteSession(session.id)}
                        className="text-destructive"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
} 