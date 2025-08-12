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

  const parseAlertData = (alert: AlertResponse) => {
    // Handle error responses
    if (alert.error) {
      return { type: 'error', message: alert.message || 'Unknown error occurred' };
    }
    
    // Handle webhook responses with code and message
    if (alert.code && alert.message) {
      return {
        type: 'webhook_response',
        status: alert.code,
        message: alert.message,
        hint: alert.hint
      };
    }
    
    // Handle output field - try to extract pastor guidance data
    if (alert.output) {
      try {
        // Navigate through nested object structure to find actual output
        let data = alert.output;
        
        // Handle nested object structure like "[object Object]": { "[object Object]": ... }
        while (data && typeof data === 'object' && !Array.isArray(data)) {
          const keys = Object.keys(data);
          if (keys.length === 1 && keys[0].includes('object Object')) {
            data = data[keys[0]];
          } else if (data.output && Array.isArray(data.output)) {
            data = data.output;
            break;
          } else {
            break;
          }
        }
        
        if (Array.isArray(data)) {
          return { type: 'guidance_list', guidance: data };
        }
        
        return { type: 'unknown', data: typeof alert.output === 'string' ? alert.output : alert.output };
      } catch (e) {
        return { type: 'unknown', data: alert.output };
      }
    }
    
    // Handle direct message
    if (alert.message) {
      return { type: 'message', message: alert.message };
    }
    
    return { type: 'empty', message: 'New pastor guidance received' };
  };

  const getAlertVariant = (alert: AlertResponse) => {
    if (alert.error) return 'destructive';
    if (alert.code === 404) return 'secondary';
    if (alert.code && alert.code >= 400) return 'destructive';
    return 'default';
  };

  const getAlertTitle = (alert: AlertResponse) => {
    const parsed = parseAlertData(alert);
    if (parsed.type === 'error') return 'API Error';
    if (alert.code === 404) return 'Webhook Not Active';
    if (alert.code && alert.code >= 400) return 'Webhook Error';
    if (parsed.type === 'guidance_list') return 'Pastor Guidance';
    return 'Pastor Message';
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'bg-red-100 text-red-800 border-red-200';
    if (priority <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 3) return 'High Priority';
    if (priority <= 6) return 'Medium Priority';
    return 'Low Priority';
  };

  const renderAlertContent = (alert: AlertResponse) => {
    const parsed = parseAlertData(alert);
    
    switch (parsed.type) {
      case 'error':
        return (
          <div className="text-sm text-red-600">
            {parsed.message}
          </div>
        );
      
      case 'webhook_response':
        return (
          <div className="text-sm space-y-2">
            <div><span className="font-medium">Status:</span> {parsed.status}</div>
            <div><span className="font-medium">Message:</span> {parsed.message}</div>
            {parsed.hint && <div><span className="font-medium">Hint:</span> {parsed.hint}</div>}
          </div>
        );
      
      case 'guidance_list':
        return (
          <div className="space-y-3">
            {parsed.guidance.map((item: any, idx: number) => (
              <div key={idx} className={`border rounded-lg p-4 ${getPriorityColor(item.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title || 'System Message'}</h4>
                    {item.member_name && item.member_name !== 'System Status' && (
                      <div className="text-sm font-medium text-gray-700">For: {item.member_name}</div>
                    )}
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${getPriorityColor(item.priority)}`}
                  >
                    {getPriorityLabel(item.priority)}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-700 space-y-2">
                  {item.description && (
                    <div className="leading-relaxed">{item.description}</div>
                  )}
                  
                  {item.type && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Type:</span> {item.type.replace('_', ' ').toUpperCase()}
                    </div>
                  )}
                  
                  {item.due_date && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Due:</span> {format(new Date(item.due_date), 'PPP')}
                    </div>
                  )}
                  
                  {item.language && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Language:</span> {item.language.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'message':
        return <div className="text-sm">{parsed.message}</div>;
      
      case 'unknown':
        return (
          <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded border text-gray-700 text-xs leading-relaxed overflow-x-auto">
            {typeof parsed.data === 'string' ? parsed.data : JSON.stringify(parsed.data, null, 2)}
          </pre>
        );
      
      default:
        return <div className="text-sm text-gray-500">{parsed.message}</div>;
    }
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
                <div>
                  {renderAlertContent(alert)}
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