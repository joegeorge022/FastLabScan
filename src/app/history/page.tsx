'use client';

import { useSessions, downloadSession, downloadExcel, downloadJSON, downloadCSV } from '@/hooks/useSessions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { Download, MoreVertical, FileSpreadsheet, FileJson, FileText, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

export default function HistoryPage() {
  const { sessions, deleteSession } = useSessions();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold">Attendance History</h1>
          <Link href="/">
            <Button variant="outline" size="sm">New Session</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid gap-4">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <p>No attendance sessions recorded yet.</p>
                  <Link href="/" className="text-primary hover:underline mt-2 inline-block">
                    Start a new session
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base sm:text-lg">
                        {session.department} - Year {session.year}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(session.date, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 px-3 py-1.5 rounded-lg">
                        <div className="text-xs text-primary font-medium">Students</div>
                        <div className="text-lg font-bold text-primary text-center">{session.students.length}</div>
                      </div>
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 transition-all duration-200 active:scale-95"
                            >
                              <MoreVertical className="h-4 w-4 transition-transform duration-200" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 transition-all duration-200"
                            sideOffset={8}
                          >
                            <DropdownMenuItem 
                              onClick={() => {
                                downloadExcel(session);
                              }}
                              className="transition-colors duration-150 active:scale-[0.98] cursor-pointer"
                            >
                              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                              <span>Export Excel</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                downloadJSON(session);
                              }}
                              className="transition-colors duration-150 active:scale-[0.98] cursor-pointer"
                            >
                              <FileJson className="mr-2 h-4 w-4 text-blue-600" />
                              <span>Export JSON</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                downloadCSV(session);
                              }}
                              className="transition-colors duration-150 active:scale-[0.98] cursor-pointer"
                            >
                              <FileText className="mr-2 h-4 w-4 text-orange-600" />
                              <span>Export CSV</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                deleteSession(session.id);
                              }}
                              className="text-destructive focus:text-destructive transition-colors duration-150 active:scale-[0.98] cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 