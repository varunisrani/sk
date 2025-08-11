import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Textarea } from './textarea';
import { Label } from './label';
import { Loader2 } from 'lucide-react';

interface AICommunicationDialogProps {
  onCreated?: () => void;
  trigger?: React.ReactNode;
}

const AICommunicationDialog = ({ onCreated, trigger }: AICommunicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [errors, setErrors] = useState({
    message: ''
  });

  const validateForm = () => {
    const newErrors = {
      message: ''
    };
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setResponse('Processing your request...');
      
      const res = await fetch('/api/ai-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: formData.message
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Display the full JSON response
      if (data.output) {
        setResponse(typeof data.output === 'string' ? data.output : JSON.stringify(data.output, null, 2));
      } else {
        setResponse(JSON.stringify(data, null, 2));
      }
      
      onCreated?.();
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Error connecting to the AI system. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      message: ''
    });
    setResponse('');
    setErrors({
      message: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>AI Communication</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Communication</DialogTitle>
          <DialogDescription>Send a message to the AI system for processing and assistance.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message here..."
                className={`mt-2 ${errors.message ? 'border-red-500' : ''}`}
                rows={4}
              />
              {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
            </div>
          </div>
          </div>
          {response && (
            <div>
              <Label>Response</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.message.trim()}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AICommunicationDialog;
