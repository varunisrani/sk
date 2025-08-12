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

  const parseDetectionData = (detection: DetectorResponse) => {
    // Handle error responses
    if (detection.error) {
      return { type: 'error', message: detection.message || 'Unknown error occurred' };
    }
    
    // Handle webhook responses with code and message
    if (detection.code && detection.message) {
      return {
        type: 'webhook_response',
        status: detection.code,
        message: detection.message,
        hint: detection.hint
      };
    }
    
    // Handle disengaged members list
    if (detection.disengagedMembers && Array.isArray(detection.disengagedMembers)) {
      return { type: 'disengaged_list', members: detection.disengagedMembers };
    }
    
    // Handle output field - check if it's a single detection result
    if (detection.output || detection.member_id) {
      try {
        // If it's a direct detection result object
        if (detection.member_id && detection.type) {
          return { type: 'detection_result', result: detection };
        }
        
        // Handle nested output structure
        let data = detection.output;
        if (typeof data === 'string') {
          return { type: 'message', message: data };
        }
        
        return { type: 'unknown', data: detection.output };
      } catch (e) {
        return { type: 'unknown', data: detection.output };
      }
    }
    
    // Handle direct message
    if (detection.message) {
      return { type: 'message', message: detection.message };
    }
    
    return { type: 'empty', message: 'Disengagement check completed' };
  };

  const getDetectionVariant = (detection: DetectorResponse) => {
    if (detection.error) return 'destructive';
    if (detection.code === 404) return 'secondary';
    if (detection.code && detection.code >= 400) return 'destructive';
    if (detection.disengagedMembers && detection.disengagedMembers.length > 0) return 'destructive';
    return 'default';
  };

  const getDetectionTitle = (detection: DetectorResponse) => {
    const parsed = parseDetectionData(detection);
    if (parsed.type === 'error') return 'API Error';
    if (detection.code === 404) return 'Webhook Not Active';
    if (detection.code && detection.code >= 400) return 'Webhook Error';
    if (parsed.type === 'disengaged_list') return 'Members Need Attention';
    if (parsed.type === 'detection_result') return 'Detection Results';
    return 'Engagement Status';
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'bg-red-100 text-red-800 border-red-200';
    if (priority <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const renderDetectionContent = (detection: DetectorResponse) => {
    const parsed = parseDetectionData(detection);
    
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
      
      case 'disengaged_list':
        return (
          <div className="space-y-3">
            <div className="text-sm font-medium text-red-800">
              Found {parsed.members.length} potentially disengaged member(s):
            </div>
            {parsed.members.map((member: any, idx: number) => (
              <div key={idx} className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{member.name || 'Unknown Member'}</h4>
                  <Badge variant="destructive" className="text-xs">
                    Needs Attention
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Last seen: {member.lastSeen || 'Unknown'}</div>
                  {member.daysAbsent && (
                    <div className="text-xs text-red-600 mt-1">
                      {member.daysAbsent} days absent
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'detection_result':
        const result = parsed.result;
        return (
          <div className={`border rounded-lg p-4 ${getPriorityColor(result.priority)}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{result.member_name || 'System Status'}</h4>
                {result.label && (
                  <div className="text-sm font-medium text-gray-700">{result.label}</div>
                )}
              </div>
              {result.priority && (
                <Badge variant="outline" className={`text-xs ${getPriorityColor(result.priority)}`}>
                  Priority: {result.priority}
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-700 space-y-1">
              {result.type && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Type:</span> {result.type.replace('_', ' ').toUpperCase()}
                </div>
              )}
              
              {result.due_date && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Due:</span> {format(new Date(result.due_date), 'PPP')}
                </div>
              )}
              
              {result.idempotency_key && (
                <div className="text-xs text-gray-400">
                  ID: {result.idempotency_key}
                </div>
              )}
            </div>
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
                <div>
                  {renderDetectionContent(detection)}
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