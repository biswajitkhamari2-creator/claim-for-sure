import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, Phone, Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft, Loader2,
  FileText, Upload, CheckCircle, MapPin, IndianRupee, Calendar, FileUp, X,
  Clock, PhoneCall, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User as SupabaseUser } from "@supabase/supabase-js";

const insuranceTypes = [
  "Health Insurance",
  "Motor Insurance",
  "Life Insurance",
  "Travel Insurance",
  "Corporate Insurance",
  "Property Insurance",
  "Other",
];

const insuranceCompanies = [
  "LIC of India",
  "ICICI Prudential",
  "HDFC Life",
  "Max Life Insurance",
  "Bajaj Allianz",
  "SBI Life",
  "Tata AIA",
  "Star Health",
  "New India Assurance",
  "United India Insurance",
  "National Insurance",
  "Oriental Insurance",
  "IFFCO Tokio",
  "Reliance General",
  "Future Generali",
  "Other",
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Other"
];

interface ClaimFormData {
  city: string;
  state: string;
  insuranceType: string;
  insuranceCompany: string;
  policyNumber: string;
  claimAmount: string;
  rejectionDate: string;
  rejectionReason: string;
  termsAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const redirectTo = searchParams.get("redirect");
  const defaultTab = mode === "login" ? "login" : mode === "signup" ? "signup" : "login";
  
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect logged in users to dashboard
  useEffect(() => {
    if (user && activeTab === "login") {
      navigate("/dashboard");
    }
  }, [user, activeTab, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  
  // Claim form state (after signup)
  const [signupStep, setSignupStep] = useState(1); // 1=account, 2=claim, 3=documents, 4=review
  const [signedUpUser, setSignedUpUser] = useState<SupabaseUser | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [claimId, setClaimId] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [claimFormData, setClaimFormData] = useState<ClaimFormData>({
    city: "",
    state: "",
    insuranceType: "",
    insuranceCompany: "",
    policyNumber: "",
    claimAmount: "",
    rejectionDate: "",
    rejectionReason: "",
    termsAccepted: false,
  });

  const totalSteps = 4;
  const progress = (signupStep / totalSteps) * 100;

  const updateClaimFormData = (field: keyof ClaimFormData, value: string | boolean) => {
    setClaimFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupName,
            phone: signupPhone,
          },
        },
      });

      if (error) throw error;

      // Update profile with phone if provided
      if (signupPhone && data.user) {
        await supabase
          .from("profiles")
          .update({ phone: signupPhone })
          .eq("user_id", data.user.id);
      }

      setSignedUpUser(data.user);
      toast.success("Account created! Now submit your claim.");
      setSignupStep(2); // Move to claim details
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const validateClaimDetails = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!claimFormData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!claimFormData.state) {
      newErrors.state = "Please select your state";
    }
    if (!claimFormData.insuranceType) {
      newErrors.insuranceType = "Please select insurance type";
    }
    if (!claimFormData.insuranceCompany) {
      newErrors.insuranceCompany = "Please select insurance company";
    }
    if (!claimFormData.policyNumber.trim()) {
      newErrors.policyNumber = "Policy number is required";
    }
    if (!claimFormData.claimAmount.trim()) {
      newErrors.claimAmount = "Claim amount is required";
    } else if (isNaN(Number(claimFormData.claimAmount)) || Number(claimFormData.claimAmount) <= 0) {
      newErrors.claimAmount = "Please enter a valid amount";
    }
    if (!claimFormData.rejectionDate) {
      newErrors.rejectionDate = "Rejection date is required";
    }
    if (!claimFormData.rejectionReason.trim()) {
      newErrors.rejectionReason = "Please describe the rejection reason";
    } else if (claimFormData.rejectionReason.trim().length < 10) {
      newErrors.rejectionReason = "Please provide more details (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReview = (): boolean => {
    const newErrors: FormErrors = {};
    if (!claimFormData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateClaimId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `CFS-${year}-${random}`;
  };

  const handleClaimSubmit = async () => {
    if (!validateReview()) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    const newClaimId = generateClaimId();

    try {
      // Ensure user_id is set - critical for RLS security
      if (!signedUpUser?.id) {
        throw new Error("User authentication required. Please sign in again.");
      }

      // 1. Insert claim FIRST (before file uploads) to satisfy storage RLS policy
      const { error: claimError } = await supabase.from("claims").insert({
        claim_id: newClaimId,
        full_name: signupName,
        phone: signupPhone,
        email: signupEmail,
        city: claimFormData.city,
        state: claimFormData.state,
        insurance_type: claimFormData.insuranceType,
        insurance_company: claimFormData.insuranceCompany,
        policy_number: claimFormData.policyNumber,
        claim_amount: Number(claimFormData.claimAmount),
        rejection_date: claimFormData.rejectionDate,
        rejection_reason: claimFormData.rejectionReason,
        documents: [],
        user_id: signedUpUser.id, // Now guaranteed to be non-null
      });

      if (claimError) throw claimError;

      // 2. Upload files AFTER claim exists - storage policy validates against claims table
      const documentUrls: string[] = [];
      
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${newClaimId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('claim-documents')
            .upload(fileName, file);
          
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }
          
          documentUrls.push(fileName);
        }

        // 3. Update claim with document URLs if any were uploaded
        if (documentUrls.length > 0) {
          const { error: updateError } = await supabase
            .from('claims')
            .update({ documents: documentUrls })
            .eq('claim_id', newClaimId);
          
          if (updateError) {
            console.error('Error updating claim with documents:', updateError);
          }
        }
      }

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-claim-confirmation", {
          body: {
            email: signupEmail,
            fullName: signupName,
            claimId: newClaimId,
            insuranceType: claimFormData.insuranceType,
            insuranceCompany: claimFormData.insuranceCompany,
            claimAmount: Number(claimFormData.claimAmount),
          },
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }

      setClaimId(newClaimId);
      setIsSubmitted(true);
      toast.success(`Claim submitted! ID: ${newClaimId}`);
    } catch (error: any) {
      console.error("Error submitting claim:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.name !== fileName));
  };

  const nextStep = () => {
    if (signupStep === 2 && !validateClaimDetails()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (signupStep < totalSteps) {
      setSignupStep(signupStep + 1);
    }
  };

  const prevStep = () => {
    if (signupStep > 2) setSignupStep(signupStep - 1);
  };

  const formatAmount = (amount: string): string => {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getInsuranceTypeLabel = (value: string): string => {
    return insuranceTypes.find(t => t.toLowerCase() === value) || value;
  };

  const getInsuranceCompanyLabel = (value: string): string => {
    return insuranceCompanies.find(c => c.toLowerCase() === value) || value;
  };

  const getStateLabel = (value: string): string => {
    return indianStates.find(s => s.toLowerCase() === value) || value;
  };

  const handleTabChange = (value: string) => {
    const tab = value === "signup" ? "signup" : "login";
    setActiveTab(tab);
    setSignupStep(1);
    setIsSubmitted(false);

    const params = new URLSearchParams();
    params.set("mode", tab);
    if (redirectTo) params.set("redirect", redirectTo);

    navigate(`/auth?${params.toString()}`, { replace: true });
  };

  // If in claim submission flow (step 2+), show full-page claim form
  if (activeTab === "signup" && signupStep >= 2) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg text-primary leading-tight">
                    Claim For Sure
                  </span>
                </div>
              </Link>
            </div>

            {!isSubmitted && (
              <>
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Step {signupStep} of {totalSteps}</span>
                    <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex justify-between mt-4">
                    {[
                      { icon: User, label: "Account" },
                      { icon: FileText, label: "Claim" },
                      { icon: Upload, label: "Documents" },
                      { icon: CheckCircle, label: "Review" },
                    ].map((s, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col items-center ${
                          i + 1 <= signupStep ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                          i + 1 < signupStep 
                            ? "bg-primary text-primary-foreground" 
                            : i + 1 === signupStep 
                              ? "bg-primary/10 text-primary border-2 border-primary" 
                              : "bg-muted text-muted-foreground"
                        }`}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Form Card */}
            <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
              {/* Step 2: Claim Details */}
              {signupStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-1">
                      Claim Details
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tell us about your rejected insurance claim
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="city" 
                          placeholder="Mumbai" 
                          className={`pl-10 ${errors.city ? 'border-destructive' : ''}`}
                          value={claimFormData.city}
                          onChange={(e) => updateClaimFormData('city', e.target.value)}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={claimFormData.state} 
                        onValueChange={(value) => updateClaimFormData('state', value)}
                      >
                        <SelectTrigger className={`mt-1 ${errors.state ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase()}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="insuranceType">Insurance Type *</Label>
                      <Select 
                        value={claimFormData.insuranceType}
                        onValueChange={(value) => updateClaimFormData('insuranceType', value)}
                      >
                        <SelectTrigger className={`mt-1 ${errors.insuranceType ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.insuranceType && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.insuranceType}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company">Insurance Company *</Label>
                      <Select 
                        value={claimFormData.insuranceCompany}
                        onValueChange={(value) => updateClaimFormData('insuranceCompany', value)}
                      >
                        <SelectTrigger className={`mt-1 ${errors.insuranceCompany ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceCompanies.map((company) => (
                            <SelectItem key={company} value={company.toLowerCase()}>
                              {company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.insuranceCompany && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.insuranceCompany}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="policyNumber">Policy Number *</Label>
                      <div className="relative mt-1">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="policyNumber" 
                          placeholder="POL123456789" 
                          className={`pl-10 ${errors.policyNumber ? 'border-destructive' : ''}`}
                          value={claimFormData.policyNumber}
                          onChange={(e) => updateClaimFormData('policyNumber', e.target.value)}
                        />
                      </div>
                      {errors.policyNumber && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.policyNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="claimAmount">Claim Amount (₹) *</Label>
                      <div className="relative mt-1">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="claimAmount" 
                          type="number" 
                          placeholder="500000" 
                          className={`pl-10 ${errors.claimAmount ? 'border-destructive' : ''}`}
                          value={claimFormData.claimAmount}
                          onChange={(e) => updateClaimFormData('claimAmount', e.target.value)}
                        />
                      </div>
                      {errors.claimAmount && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.claimAmount}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="rejectionDate">Date of Rejection *</Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="rejectionDate" 
                          type="date" 
                          className={`pl-10 ${errors.rejectionDate ? 'border-destructive' : ''}`}
                          value={claimFormData.rejectionDate}
                          onChange={(e) => updateClaimFormData('rejectionDate', e.target.value)}
                        />
                      </div>
                      {errors.rejectionDate && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.rejectionDate}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                      <Textarea 
                        id="rejectionReason" 
                        placeholder="Briefly describe why your claim was rejected..."
                        className={`mt-1 min-h-[100px] ${errors.rejectionReason ? 'border-destructive' : ''}`}
                        value={claimFormData.rejectionReason}
                        onChange={(e) => updateClaimFormData('rejectionReason', e.target.value)}
                      />
                      {errors.rejectionReason && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Documents */}
              {signupStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-1">
                      Upload Documents
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Upload your policy and rejection documents (optional)
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileUp className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-medium text-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, JPG, PNG, DOC up to 10MB each
                      </p>
                    </label>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-3">Recommended Documents:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        Policy copy / Policy document
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        Rejection letter from insurance company
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                        Hospital bills / Repair bills (if applicable)
                      </li>
                    </ul>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Uploaded Files:</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <span className="text-sm text-foreground">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeFile(file.name)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {signupStep === 4 && !isSubmitted && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-1">
                      Review & Submit
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Please review your information before submitting
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-muted/30 rounded-xl p-4">
                      <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
                        <User className="w-4 h-4" />
                        Account Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Name:</div>
                        <div className="text-foreground">{signupName || '-'}</div>
                        <div className="text-muted-foreground">Mobile:</div>
                        <div className="text-foreground">{signupPhone || '-'}</div>
                        <div className="text-muted-foreground">Email:</div>
                        <div className="text-foreground">{signupEmail || '-'}</div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Claim Details
                        </h4>
                        <button 
                          onClick={() => setSignupStep(2)}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Location:</div>
                        <div className="text-foreground">
                          {claimFormData.city && claimFormData.state 
                            ? `${claimFormData.city}, ${getStateLabel(claimFormData.state)}` 
                            : '-'}
                        </div>
                        <div className="text-muted-foreground">Insurance Type:</div>
                        <div className="text-foreground">{getInsuranceTypeLabel(claimFormData.insuranceType) || '-'}</div>
                        <div className="text-muted-foreground">Company:</div>
                        <div className="text-foreground">{getInsuranceCompanyLabel(claimFormData.insuranceCompany) || '-'}</div>
                        <div className="text-muted-foreground">Policy Number:</div>
                        <div className="text-foreground">{claimFormData.policyNumber || '-'}</div>
                        <div className="text-muted-foreground">Claim Amount:</div>
                        <div className="text-foreground font-semibold">
                          {claimFormData.claimAmount ? `₹${formatAmount(claimFormData.claimAmount)}` : '-'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Documents
                        </h4>
                        <button 
                          onClick={() => setSignupStep(3)}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {uploadedFiles.length > 0 
                          ? `${uploadedFiles.length} file(s) uploaded`
                          : "No files uploaded"
                        }
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="terms" 
                        checked={claimFormData.termsAccepted}
                        onCheckedChange={(checked) => updateClaimFormData('termsAccepted', checked as boolean)}
                        className={errors.termsAccepted ? 'border-destructive' : ''}
                      />
                      <div>
                        <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                          I confirm that all information provided is accurate and I agree to the{" "}
                          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                          {" "}and{" "}
                          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                        {errors.termsAccepted && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.termsAccepted}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Screen */}
              {isSubmitted && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Claim Submitted Successfully!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for trusting us with your insurance claim
                  </p>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 inline-block">
                    <p className="text-sm text-muted-foreground mb-1">Your Claim Reference ID</p>
                    <p className="font-display text-2xl font-bold text-primary">{claimId}</p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-6 text-left mb-8 max-w-md mx-auto">
                    <h4 className="font-semibold text-foreground mb-4">What happens next?</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Mail className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          A confirmation email has been sent to your registered email address
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Our expert team will review your case within 24-48 hours
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <PhoneCall className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          A dedicated claim advisor will contact you within 2 business days
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    variant="hero" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {!isSubmitted && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={signupStep === 2}
                    className={signupStep === 2 ? "invisible" : ""}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {signupStep < totalSteps ? (
                    <Button variant="hero" onClick={nextStep}>
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      variant="hero" 
                      size="lg"
                      onClick={handleClaimSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Claim
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Help Box */}
            {!isSubmitted && (
              <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <p className="text-foreground font-semibold mb-2">🎯 Connect directly to our Claim Fighter — No Bot! 🤝</p>
                <p className="text-muted-foreground mb-3">Need help filling the form?</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <a href="tel:+919439572073" className="text-primary hover:underline font-medium">
                    📞 Call +91 94395 72073
                  </a>
                  <span className="text-muted-foreground">or</span>
                  <a 
                    href="https://wa.me/919439572073" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-primary leading-tight">
                Claim For Sure
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                We fight for your rights
              </span>
            </div>
          </Link>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Submit Claim</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground">
                    Login to track your claims and more
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Signup Tab (Step 1: Account) */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Submit Your Claim
                  </h1>
                  <p className="text-muted-foreground">
                    Create an account to submit and track your claim
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Rajesh Kumar"
                        className="pl-10"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signupPhone">Mobile Number (Optional)</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signupPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signupEmail">Email Address *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signupPassword">Password *</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        className="pl-10 pr-10"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <Button variant="hero" className="w-full" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account & Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 indian-pattern opacity-20" />
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="font-display text-3xl font-bold mb-4">
            Your Claim Journey Starts Here
          </h2>
          <p className="text-white/80 mb-8">
            Track your claims, upload documents, and communicate with our experts - 
            all from one secure dashboard.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">₹50Cr+</div>
              <div className="text-sm opacity-80">Claims Recovered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
