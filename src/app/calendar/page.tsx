import { Metadata } from 'next';
import { DatePickerWithRange } from '@/components/CalendarComponent';

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Interactive calendar with date range selection',
};

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your schedule with our interactive calendar
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Select Date Range</h2>
          <DatePickerWithRange className="mb-4" />
          
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-medium">Upcoming Events</h3>
            <div className="space-y-2">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Team Meeting</h4>
                    <p className="text-sm text-muted-foreground">
                      Today, 10:00 AM - 11:30 AM
                    </p>
                  </div>
                  <button className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    Join
                  </button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Project Deadline</h4>
                    <p className="text-sm text-muted-foreground">
                      Tomorrow, 11:59 PM
                    </p>
                  </div>
                  <button className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
