import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Upload,
  MessageCircle,
  User,
  Search,
  Calendar,
  Mail,
  ArrowRight,
  Loader2,
  RefreshCw,
  LogOut,
  Download,
  Eye
} from "lucide-react";

interface Claim {
  id: string;
  claim_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  insurance_type: string;
  insurance_company: string;
  policy_number: string;
  claim_amount: number;
  rejection_date: string;
  rejection_reason: string;
  status: string;
  created_at: string;
  updated_at: string;
  documents?: string[] | null;
}

const statusConfig: Record<string, { label: string; color: string; progress: number }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800 border-yellow-200", progress: 20 },
  "in-review": { label: "Under Review", color: "bg-blue-100 text-blue-800 border-blue-200", progress: 40 },
  legal: { label: "Legal Processing", color: "bg-purple-100 text-purple-800 border-purple-200", progress: 60 },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800 border-green-200", progress: 100 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200", progress: 0 },
};

const insuranceTypeLabels: Record<string, string> = {
  health: "Health Insurance",
  life: "Life Insurance",
  motor: "Motor Insurance",
  travel: "Travel Insurance",
  home: "Home Insurance",
  business: "Business Insurance",
};

const companyLogos: Record<string, { initials: string; bg: string; text: string }> = {
  "LIC of India": { initials: "LIC", bg: "bg-blue-600", text: "text-white" },
  "ICICI Prudential": { initials: "ICICI", bg: "bg-orange-500", text: "text-white" },
  "HDFC Life": { initials: "HDFC", bg: "bg-blue-800", text: "text-white" },
  "Max Life Insurance": { initials: "MAX", bg: "bg-red-600", text: "text-white" },
  "Bajaj Allianz": { initials: "BA", bg: "bg-blue-500", text: "text-white" },
  "SBI Life": { initials: "SBI", bg: "bg-blue-700", text: "text-white" },
  "Tata AIA": { initials: "TATA", bg: "bg-blue-900", text: "text-white" },
  "Star Health": { initials: "SH", bg: "bg-yellow-500", text: "text-black" },
  "New India Assurance": { initials: "NIA", bg: "bg-green-600", text: "text-white" },
  "United India Insurance": { initials: "UII", bg: "bg-red-700", text: "text-white" },
  "National Insurance": { initials: "NIC", bg: "bg-green-700", text: "text-white" },
  "Oriental Insurance": { initials: "OIC", bg: "bg-purple-600", text: "text-white" },
  "IFFCO Tokio": { initials: "IT", bg: "bg-teal-600", text: "text-white" },
  "Reliance General": { initials: "RG", bg: "bg-red-500", text: "text-white" },
  "Future Generali": { initials: "FG", bg: "bg-orange-600", text: "text-white" },
};

const getCompanyLogo = (company: string) => {
  return companyLogos[company] || { initials: company.substring(0, 2).toUpperCase(), bg: "bg-gray-500", text: "text-white" };
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Document preview state (blob-based to avoid Chrome blocking)
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const selectedClaimData = selectedClaim
    ? claims.find((c) => c.id === selectedClaim) || null
    : null;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setClaims([]);
    navigate("/");
  };

  const getFilePathFromDoc = (doc: string): string => {
    // Handle both old format (full public URL) and new format (just file path)
    const marker = "/storage/v1/object/public/claim-documents/";
    const idx = doc.indexOf(marker);
    if (idx !== -1) return doc.substring(idx + marker.length);
    // New format: doc is already just the file path
    return doc;
  };

  const isImageFile = (fileName: string): boolean => {
    const ext = fileName.toLowerCase().split(".").pop();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext || "");
  };

  const isPdfFile = (fileName: string): boolean => {
    return fileName.toLowerCase().endsWith(".pdf");
  };

  const handleOpenDocument = async (doc: string) => {
    setPreviewLoading(true);
    setPreviewError(null);

    const filePath = getFilePathFromDoc(doc);
    const fileName = filePath.split("/").pop() || "document";
    setPreviewFileName(fileName);

    // Clean up previous blob
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }

    try {
      const { data, error } = await supabase.storage
        .from("claim-documents")
        .download(filePath);

      if (error) throw error;

      const blobUrl = URL.createObjectURL(data);
      setPreviewBlobUrl(blobUrl);
    } catch (err: any) {
      console.error("Error downloading document:", err);
      setPreviewError(err.message || "Failed to load document");
      toast.error("Unable to open document");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewBlobUrl(null);
    setPreviewFileName("");
    setPreviewError(null);
  };

  // Real-time subscription for claim updates
  useEffect(() => {
    if (!userEmail) return;

    const channel = supabase
      .channel('claims-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims',
          filter: `email=eq.${userEmail}`
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setClaims(prev => [payload.new as Claim, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setClaims(prev => 
              prev.map(claim => 
                claim.id === (payload.new as Claim).id ? payload.new as Claim : claim
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setClaims(prev => 
              prev.filter(claim => claim.id !== (payload.old as Claim).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail]);

  const fetchClaims = async (email: string) => {
    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("claims")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setClaims(data || []);
    } catch (err) {
      console.error("Error fetching claims:", err);
      toast.error("Failed to fetch claims");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (userEmail) {
      fetchClaims(userEmail);
    }
  };

  // Calculate statistics
  const totalClaims = claims.length;
  const inProgressClaims = claims.filter(c => ["pending", "in-review", "legal"].includes(c.status)).length;
  const resolvedClaims = claims.filter(c => c.status === "resolved").length;
  const totalRecovered = claims
    .filter(c => c.status === "resolved")
    .reduce((sum, c) => sum + Number(c.claim_amount), 0);

  // Filter claims by search
  const filteredClaims = claims.filter(claim =>
    claim.claim_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.insurance_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (insuranceTypeLabels[claim.insurance_type] || claim.insurance_type).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Auto-fetch claims for authenticated user
  useEffect(() => {
    const fetchUserClaims = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const email = session.user.email;
        setUserEmail(email);
        fetchClaims(email);
      }
    };
    
    if (isAuthenticated && !userEmail) {
      fetchUserClaims();
    }
  }, [isAuthenticated, userEmail]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen dashboard-bg flex items-center justify-center">
        <div className="floating-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=dashboard" replace />;
  }

  return (
    <div className="min-h-screen dashboard-bg">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-success/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 h-16">
        <div className="h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 hero-gradient rounded-lg flex items-center justify-center shadow-lg glow-primary">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-primary hidden sm:block">
              Claim For Sure
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading} className="hover:bg-primary/10">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="shadow-md">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 relative">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {claims.length > 0 ? `Welcome back! 👋` : "No claims found"}
              </h1>
              <p className="text-muted-foreground mt-1">
                Tracking claims for: <span className="font-medium text-primary">{userEmail}</span>
              </p>
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="floating-card p-12 text-center animate-slide-up">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                No claims found
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any claims associated with this email address. Try a different email or contact us for help.
              </p>
            </div>
          ) : (
            <>
              {/* Floating Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {/* Total Claims */}
                <div className="floating-stat group animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-50" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{totalClaims}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Claims</div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="floating-stat group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-50" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{inProgressClaims}</div>
                    <div className="text-sm text-muted-foreground font-medium">In Progress</div>
                  </div>
                </div>

                {/* Resolved */}
                <div className="floating-stat group animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full opacity-50" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{resolvedClaims}</div>
                    <div className="text-sm text-muted-foreground font-medium">Resolved</div>
                  </div>
                </div>

                {/* Amount Recovered */}
                <div className="floating-stat group animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full opacity-50" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-xl font-bold text-white">₹</span>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{formatAmount(totalRecovered)}</div>
                    <div className="text-sm text-muted-foreground font-medium">Recovered</div>
                  </div>
                </div>
              </div>

              {/* Claims Section - Floating Card */}
              <div className="floating-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.5s' }}>
                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Your Claims
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search claims..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/50 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claims List */}
                <div className="divide-y divide-border/30">
                  {filteredClaims.map((claim, index) => {
                    const status = statusConfig[claim.status] || statusConfig.pending;
                    return (
                      <div
                        key={claim.id}
                        className="p-4 lg:p-6 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all cursor-pointer group"
                        onClick={() => setSelectedClaim(claim.id)}
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            <div className={`w-14 h-14 rounded-xl ${getCompanyLogo(claim.insurance_company).bg} ${getCompanyLogo(claim.insurance_company).text} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                              <span className="text-xs font-bold">{getCompanyLogo(claim.insurance_company).initials}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                  {claim.claim_id}
                                </span>
                                <Badge className={`${status.color} shadow-sm`}>
                                  {status.label}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {insuranceTypeLabels[claim.insurance_type] || claim.insurance_type} - {claim.insurance_company}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(claim.created_at).toLocaleDateString('en-IN')}
                                </span>
                                <span className="font-bold text-foreground bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                                  ₹{Number(claim.claim_amount).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-36 hidden lg:block">
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-bold text-primary">{status.progress}%</span>
                              </div>
                              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                                  style={{ width: `${status.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions - Floating Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <button
                  onClick={() => {
                    if (claims.length === 0) {
                      toast.error("No claims found to attach documents to");
                      return;
                    }
                    toast.message("Open a claim to view your uploaded documents.");
                    setSelectedClaim(claims[0].id);
                  }}
                  className="floating-card p-6 text-left group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Upload className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 text-lg">Documents</h3>
                    <p className="text-sm text-muted-foreground">View documents you uploaded with your claim</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="floating-card p-6 text-left group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 text-lg">Contact Support</h3>
                    <p className="text-sm text-muted-foreground">Send a message or WhatsApp support</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    toast.message("Profile editing requires login. Redirecting...");
                    navigate("/auth");
                  }}
                  className="floating-card p-6 text-left group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 text-lg">Edit Profile</h3>
                    <p className="text-sm text-muted-foreground">Update your personal information</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Claim Details Dialog */}
      <Dialog
        open={!!selectedClaimData}
        onOpenChange={(open) => {
          if (!open) setSelectedClaim(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Claim Details {selectedClaimData ? `- ${selectedClaimData.claim_id}` : ""}
            </DialogTitle>
          </DialogHeader>

          {selectedClaimData && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusConfig[selectedClaimData.status]?.color || statusConfig.pending.color}>
                  {statusConfig[selectedClaimData.status]?.label || selectedClaimData.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Submitted: {new Date(selectedClaimData.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Insurance</p>
                  <p className="font-medium">
                    {insuranceTypeLabels[selectedClaimData.insurance_type] || selectedClaimData.insurance_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedClaimData.insurance_company}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Policy Number</p>
                  <p className="font-medium">{selectedClaimData.policy_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Claim Amount</p>
                  <p className="font-medium">₹{Number(selectedClaimData.claim_amount).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Rejection Reason</p>
                <p className="font-medium">{selectedClaimData.rejection_reason}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Documents</p>
                {selectedClaimData.documents && selectedClaimData.documents.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedClaimData.documents.map((doc, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDocument(doc)}
                        className="inline-flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Document {idx + 1}
                        <Eye className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" onClick={() => navigate("/contact")}>Contact Support</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog
        open={previewLoading || !!previewBlobUrl || !!previewError}
        onOpenChange={(open) => {
          if (!open) handleClosePreview();
        }}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {previewFileName ? `Document: ${previewFileName}` : "Document Preview"}
            </DialogTitle>
          </DialogHeader>

          {previewLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading document...</span>
            </div>
          )}

          {previewError && (
            <div className="text-center py-8">
              <p className="text-destructive mb-2">{previewError}</p>
              <p className="text-sm text-muted-foreground">Please try again.</p>
            </div>
          )}

          {previewBlobUrl && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={previewBlobUrl} download={previewFileName}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>

              <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
                {isPdfFile(previewFileName) && (
                  <iframe
                    src={previewBlobUrl}
                    title="Document preview"
                    className="w-full h-[70vh]"
                  />
                )}
                {isImageFile(previewFileName) && (
                  <img
                    src={previewBlobUrl}
                    alt="Document preview"
                    className="max-w-full max-h-[70vh] mx-auto"
                  />
                )}
                {!isPdfFile(previewFileName) && !isImageFile(previewFileName) && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="w-16 h-16 mb-4" />
                    <p>Preview not available for this file type.</p>
                    <p className="text-sm">Please download the file to view it.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
