import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { UserMinus, Users, Loader2, RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';

interface DetectorResponse {
  message?: string;
  output?: any;
  timestamp?: string;
  code?: number;
  hint?: string;
  error?: boolean;
  apiResponse?: boolean;
  disengagedMembers?: any[];
  [key: string]: any;
}

const BasicDisengagementDetector = () => {
  const [detections, setDetections] = useState<DetectorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkForDisengagement = async (isManual = false) => {
    try {
      if (isManual) {
        setIsManualLoading(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const res = await fetch('https://ssdsdss.app.n8n.cloud/webhook/e698cbc9-8ba0-47cc-8aec-937a97', {
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
      
      // Create new detection with the response
      const newDetection: DetectorResponse = {
        ...data,
        timestamp: new Date().toISOString(),
        apiResponse: true
      };
      
      // Always add the detection
      setDetections(prev => [newDetection, ...prev.slice(0, 9)]); // Keep last 10 detections
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking disengagement:', error);
      setError('Failed to check for disengaged members');
    } finally {
      setIsLoading(false);
      setIsManualLoading(false);
    }
  };

  const triggerManualCheck = async () => {
    await checkForDisengagement(true);
  };

  // Check immediately on mount
  useEffect(() => {
    checkForDisengagement();
  }, []);

  // Set up 24-hour interval
  useEffect(() => {
    const interval = setInterval(() => {
      checkForDisengagement();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const formatDetectionContent = (detection: DetectorResponse) => {
    // Handle error responses
    if (detection.error) {
      return detection.message || 'Unknown error occurred';
    }
    
    // Handle webhook responses with code and message
    if (detection.code && detection.message) {
      let content = `Status: ${detection.code}\nMessage: ${detection.message}`;
      if (detection.hint) {
        content += `\n\nHint: ${detection.hint}`;
      }
      return content;
    }
    
    // Handle disengaged members list
    if (detection.disengagedMembers && Array.isArray(detection.disengagedMembers)) {
      return `Found ${detection.disengagedMembers.length} potentially disengaged member(s):\n\n${
        detection.disengagedMembers.map((member: any, index: number) => 
          `${index + 1}. ${member.name || 'Unknown'} - Last seen: ${member.lastSeen || 'Unknown'}`
        ).join('\n')
      }`;
    }
    
    // Handle output field
    if (detection.output) {
      return typeof detection.output === 'string' ? detection.output : JSON.stringify(detection.output, null, 2);
    }
    
    // Handle direct message
    if (detection.message) {
      return detection.message;
    }
    
    // Fallback - show all data
    const { timestamp, apiResponse, error, ...cleanDetection } = detection;
    return Object.keys(cleanDetection).length > 0 ? JSON.stringify(cleanDetection, null, 2) : 'Disengagement check completed';
  };

  const getDetectionVariant = (detection: DetectorResponse) => {
    if (detection.error) return 'destructive';
    if (detection.code === 404) return 'secondary';
    if (detection.code && detection.code >= 400) return 'destructive';
    if (detection.disengagedMembers && detection.disengagedMembers.length > 0) return 'destructive';
    return 'default';
  };

  const getDetectionTitle = (detection: DetectorResponse) => {
    if (detection.error) return 'API Error';
    if (detection.code === 404) return 'Webhook Not Active';
    if (detection.code && detection.code >= 400) return 'Webhook Error';
    if (detection.disengagedMembers && detection.disengagedMembers.length > 0) return 'Members Need Attention';
    if (detection.output) return 'Detection Results';
    return 'Engagement Status';
  };

  const hasNewDetections = detections.length > 0;
  const hasDisengagedMembers = detections.some(d => d.disengagedMembers && d.disengagedMembers.length > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDisengagedMembers ? (
              <UserMinus className="h-5 w-5 text-red-500" />
            ) : (
              <Users className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">Basic Disengagement Detector</CardTitle>
            {hasNewDetections && (
              <Badge variant={hasDisengagedMembers ? 'destructive' : 'secondary'} className={hasDisengagedMembers ? 'bg-red-100 text-red-800' : ''}>
                {detections.length} check{detections.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => checkForDisengagement(false)}
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isManualLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isManualLoading ? 'Analyzing Members...' : 'Detect Disengagement'}
            </Button>
          </div>
        </div>
        <CardDescription>
          AI-powered detection of members who may be disengaging from church activities
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
      
      {detections.length > 0 && (
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {detections.map((detection, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                detection.error ? 'bg-gradient-to-r from-red-50 to-red-100' :
                detection.code === 404 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
                (detection.disengagedMembers && detection.disengagedMembers.length > 0) ? 'bg-gradient-to-r from-red-50 to-orange-50' :
                'bg-gradient-to-r from-blue-50 to-cyan-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getDetectionVariant(detection)} className="text-xs">
                      {getDetectionTitle(detection)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      #{detections.length - index}
                    </span>
                  </div>
                  {detection.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(detection.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <pre className="whitespace-pre-wrap font-sans bg-white p-3 rounded border text-gray-700 text-xs leading-relaxed">
                    {formatDetectionContent(detection)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      
      {detections.length === 0 && !isLoading && !error && (
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No disengagement analysis yet</p>
            <p className="text-xs mt-1">System will check automatically every 24 hours</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BasicDisengagementDetector;