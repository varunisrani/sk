import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Heart, HeartHandshake, Loader2, RefreshCw, Send } from 'lucide-react';
import { format } from 'date-fns';

interface AlertResponse {
  message?: string;
  output?: any;
  timestamp?: string;
  code?: number;
  hint?: string;
  error?: boolean;
  apiResponse?: boolean;
  [key: string]: any;
}

const AIPastorAlert = () => {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkForAlerts = async (isManual = false) => {
    try {
      if (isManual) {
        setIsManualLoading(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const res = await fetch('https://ssdsdss.app.n8n.cloud/webhook/e698cbc9-8ba0-47cc-8aec-937a97b75', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Handle different response types
      const contentType = res.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // If it's not JSON, treat as text
        const text = await res.text();
        data = { message: text, type: 'text' };
      }
      
      // Create new alert with the response
      const newAlert: AlertResponse = {
        ...data,
        timestamp: new Date().toISOString(),
        apiResponse: true
      };
      
      // Always add the alert
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking AI Pastor Alert:', error);
      setError('Failed to check for pastor guidance');
    } finally {
      setIsLoading(false);
      setIsManualLoading(false);
    }
  };

  const triggerManualCheck = async () => {
    await checkForAlerts(true);
  };

  // Check immediately on mount
  useEffect(() => {
    checkForAlerts();
  }, []);

  // Set up 24-hour interval
  useEffect(() => {
    const interval = setInterval(() => {
      checkForAlerts();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const formatAlertContent = (alert: AlertResponse) => {
    // Handle error responses
    if (alert.error) {
      return alert.message || 'Unknown error occurred';
    }
    
    // Handle webhook responses with code and message
    if (alert.code && alert.message) {
      let content = `Status: ${alert.code}\nMessage: ${alert.message}`;
      if (alert.hint) {
        content += `\n\nHint: ${alert.hint}`;
      }
      return content;
    }
    
    // Handle output field
    if (alert.output) {
      return typeof alert.output === 'string' ? alert.output : JSON.stringify(alert.output, null, 2);
    }
    
    // Handle direct message
    if (alert.message) {
      return alert.message;
    }
    
    // Fallback - show all data
    const { timestamp, apiResponse, error, ...cleanAlert } = alert;
    return Object.keys(cleanAlert).length > 0 ? JSON.stringify(cleanAlert, null, 2) : 'New pastor guidance received';
  };

  const getAlertVariant = (alert: AlertResponse) => {
    if (alert.error) return 'destructive';
    if (alert.code === 404) return 'secondary';
    if (alert.code && alert.code >= 400) return 'destructive';
    return 'default';
  };

  const getAlertTitle = (alert: AlertResponse) => {
    if (alert.error) return 'API Error';
    if (alert.code === 404) return 'Webhook Not Active';
    if (alert.code && alert.code >= 400) return 'Webhook Error';
    if (alert.output) return 'Pastor Guidance';
    return 'Pastor Message';
  };

  const hasNewAlerts = alerts.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasNewAlerts ? (
              <HeartHandshake className="h-5 w-5 text-purple-500" />
            ) : (
              <Heart className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">AI Pastor Guidance</CardTitle>
            {hasNewAlerts && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {alerts.length} message{alerts.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => checkForAlerts(false)}
              disabled={isLoading || isManualLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Quick Check
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={triggerManualCheck}
              disabled={isLoading || isManualLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isManualLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isManualLoading ? 'Receiving Guidance...' : 'Request Pastor Guidance'}
            </Button>
          </div>
        </div>
        <CardDescription>
          Daily spiritual guidance and pastoral messages - checks every 24 hours
          {lastChecked && (
            <span className="block text-xs mt-1">
              Last checked: {format(lastChecked, 'PPp')}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      {error && (
        <CardContent>
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        </CardContent>
      )}
      
      {alerts.length > 0 && (
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.map((alert, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                alert.error ? 'bg-gradient-to-r from-red-50 to-red-100' :
                alert.code === 404 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
                'bg-gradient-to-r from-purple-50 to-pink-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getAlertVariant(alert)} className="text-xs">
                      {getAlertTitle(alert)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      #{alerts.length - index}
                    </span>
                  </div>
                  {alert.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <pre className="whitespace-pre-wrap font-sans bg-white p-3 rounded border text-gray-700 text-xs leading-relaxed">
                    {formatAlertContent(alert)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      
      {alerts.length === 0 && !isLoading && !error && (
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pastoral guidance yet</p>
            <p className="text-xs mt-1">System will check automatically every 24 hours</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AIPastorAlert;