import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            This page doesn't exist — let's get you back to something real.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
