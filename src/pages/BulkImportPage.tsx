import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/FileUpload';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ImportRow {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export default function BulkImportPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({ success: 0, errors: 0, total: 0 });

  const downloadTemplate = () => {
    const csvContent = [
      'name,email,phone_number,birthday,address,city,country,discipleship_stage,baptized,saved_status',
      'John Doe,john@example.com,+1234567890,1990-01-15,123 Main St,Springfield,USA,Growing,true,true',
      'Jane Smith,jane@example.com,+1987654321,1985-05-20,456 Oak Ave,Springfield,USA,Mature,true,true'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    
    // Parse CSV file (simplified - in real app, use proper CSV parser)
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const data: ImportRow[] = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',');
          return {
            id: `row-${index}`,
            name: values[0] || '',
            email: values[1] || '',
            phone_number: values[2] || '',
            status: 'pending' as const,
          };
        });
      
      setImportData(data);
      setStep('preview');
    };
    
    reader.readAsText(uploadedFile);
  };

  const startImport = async () => {
    setStep('importing');
    setProgress(0);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Simulate import process
    for (let i = 0; i < importData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
      
      const row = importData[i];
      const updatedData = [...importData];
      
      // Simulate success/failure (90% success rate)
      if (Math.random() > 0.1 && row.name.trim()) {
        updatedData[i] = { ...row, status: 'success' };
        successCount++;
      } else {
        updatedData[i] = { 
          ...row, 
          status: 'error', 
          error: row.name.trim() ? 'Email already exists' : 'Name is required' 
        };
        errorCount++;
      }
      
      setImportData(updatedData);
      setProgress(((i + 1) / importData.length) * 100);
    }
    
    setResults({ success: successCount, errors: errorCount, total: importData.length });
    setStep('results');
    
    toast({
      title: "Import completed",
      description: `${successCount} members imported successfully, ${errorCount} errors.`,
    });
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <Badge 
            variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
          >
            {status === 'success' && <CheckCircle className="mr-1 h-3 w-3" />}
            {status === 'error' && <XCircle className="mr-1 h-3 w-3" />}
            {status === 'pending' && <AlertCircle className="mr-1 h-3 w-3" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'error',
      header: 'Error',
      cell: ({ row }: any) => {
        const error = row.original.error;
        return error ? <span className="text-destructive text-sm">{error}</span> : null;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/members')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Bulk Import Members</h1>
        <p className="text-muted-foreground">
          Import multiple members from a CSV file
        </p>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Template</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download the CSV template with the required columns and example data.
              </p>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="block w-full text-sm border rounded-lg cursor-pointer"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 'preview' && (
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Review the data below before importing. {importData.length} rows detected.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Data Preview</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back
                </Button>
                <Button onClick={startImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Import
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={importData}
                searchKey="name"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Importing */}
      {step === 'importing' && (
        <Card>
          <CardHeader>
            <CardTitle>Importing Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} />
            <p className="text-center text-muted-foreground">
              Importing members... {Math.round(progress)}% complete
            </p>
            <DataTable
              columns={columns}
              data={importData}
              searchKey="name"
              pageSize={10}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === 'results' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{results.success}</div>
                <p className="text-xs text-muted-foreground">Successfully Imported</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{results.errors}</div>
                <p className="text-xs text-muted-foreground">Errors</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{results.total}</div>
                <p className="text-xs text-muted-foreground">Total Rows</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Import Results</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => {
                  setStep('upload');
                  setImportData([]);
                  setFile(null);
                }}>
                  Import More
                </Button>
                <Button onClick={() => navigate('/dashboard/members')}>
                  View Members
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={importData}
                searchKey="name"
                pageSize={25}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}