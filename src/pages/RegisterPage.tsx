import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  // Church Information
  churchName: z.string().min(2, "Church name must be at least 2 characters"),
  churchAddress: z.string().min(5, "Please enter a complete address"),
  churchEmail: z.string().email("Please enter a valid church email"),
  churchPhone: z.string().optional(),
  churchWebsite: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  
  // Admin User Details
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  
  // Settings
  timezone: z.string().min(1, "Please select a timezone"),
  language: z.string().min(1, "Please select a language"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const timezones = [
  { value: "America/New_York", label: "Eastern Time (EST/EDT)" },
  { value: "America/Chicago", label: "Central Time (CST/CDT)" },
  { value: "America/Denver", label: "Mountain Time (MST/MDT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PST/PDT)" },
  { value: "UTC", label: "UTC" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      timezone: "America/New_York",
      language: "en"
    }
  });

  const watchedFields = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["churchName", "churchAddress", "churchEmail"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["fullName", "email", "password", "confirmPassword"];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    // Simulate registration process (replace with actual Supabase when connected)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Welcome to ECHAD SI Agent!",
        description: "Your church account has been created successfully.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Church Information", completed: currentStep > 1 },
    { number: 2, title: "Admin Details", completed: currentStep > 2 },
    { number: 3, title: "Settings", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-church-blue/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">ECHAD SI Agent</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Your Church Account</h1>
          <p className="text-muted-foreground">Set up your AI-powered church management system</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed 
                    ? "bg-success border-success text-success-foreground" 
                    : currentStep === step.number
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground"
                }`}>
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step.completed ? "bg-success" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your church"}
              {currentStep === 2 && "Create your administrator account"}
              {currentStep === 3 && "Configure your preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Step 1: Church Information */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="churchName">Church Name *</Label>
                      <Input
                        id="churchName"
                        placeholder="Grace Community Church"
                        {...register("churchName")}
                        className={errors.churchName ? "border-destructive" : ""}
                      />
                      {errors.churchName && (
                        <p className="text-sm text-destructive">{errors.churchName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="churchEmail">Church Email *</Label>
                      <Input
                        id="churchEmail"
                        type="email"
                        placeholder="info@gracechurch.com"
                        {...register("churchEmail")}
                        className={errors.churchEmail ? "border-destructive" : ""}
                      />
                      {errors.churchEmail && (
                        <p className="text-sm text-destructive">{errors.churchEmail.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="churchAddress">Address *</Label>
                    <Textarea
                      id="churchAddress"
                      placeholder="123 Main St, Anytown, ST 12345"
                      {...register("churchAddress")}
                      className={errors.churchAddress ? "border-destructive" : ""}
                    />
                    {errors.churchAddress && (
                      <p className="text-sm text-destructive">{errors.churchAddress.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="churchPhone">Phone</Label>
                      <Input
                        id="churchPhone"
                        placeholder="(555) 123-4567"
                        {...register("churchPhone")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="churchWebsite">Website</Label>
                      <Input
                        id="churchWebsite"
                        placeholder="https://gracechurch.com"
                        {...register("churchWebsite")}
                        className={errors.churchWebsite ? "border-destructive" : ""}
                      />
                      {errors.churchWebsite && (
                        <p className="text-sm text-destructive">{errors.churchWebsite.message}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Admin User Details */}
              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Pastor John Smith"
                        {...register("fullName")}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="pastor@gracechurch.com"
                        {...register("email")}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Choose a strong password"
                        {...register("password")}
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Settings */}
              {currentStep === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select 
                        value={watchedFields.timezone} 
                        onValueChange={(value) => setValue("timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language *</Label>
                      <Select 
                        value={watchedFields.language} 
                        onValueChange={(value) => setValue("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Default Features Enabled:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• AI-powered discipleship mapping</li>
                      <li>• Smart pastoral alerts</li>
                      <li>• Advanced analytics</li>
                      <li>• Communication tools</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      These can be customized later in your settings.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button type="button" variant="outline">
                      Already have an account?
                    </Button>
                  </Link>
                )}

                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;