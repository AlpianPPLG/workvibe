import { Metadata } from 'next';
import { MessagesComponent } from '@/components/MessagesComponent';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Chat with your team and colleagues',
};

export default function MessagesPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Connect and collaborate with your team
        </p>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <MessagesComponent />
      </div>
    </main>
  );
}
