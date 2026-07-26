import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/free-claim-assessment-success')({
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Request Received!</h1>
        
        <p className="text-lg text-muted-foreground">
          Thank you for reaching out. We have successfully received your details. 
          One of our claim experts will review your information and contact you shortly.
        </p>

        <div className="pt-6">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
