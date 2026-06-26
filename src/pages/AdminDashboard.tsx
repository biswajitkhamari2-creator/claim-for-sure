import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Search,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle2,
  IndianRupee,
  Calendar,
  Bell,
  Loader2,
  ExternalLink,
  Menu,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Filter,
  RefreshCw,
  Save,
  AlertTriangle,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Claim = Tables<"claims">;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-review": "bg-blue-100 text-blue-800 border-blue-200",
  legal: "bg-purple-100 text-purple-800 border-purple-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  "in-review": "Under Review",
  legal: "Legal Action",
  resolved: "Resolved",
  rejected: "Rejected",
};

type ActiveTab = "dashboard" | "claims" | "users" | "settings";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoAssignClaims, setAutoAssignClaims] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  
  // Document preview state (blob-based to avoid Chrome blocking)
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to access admin dashboard");
        navigate("/auth");
        return;
      }

      setAdminEmail(user.email || "");

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        console.error("Error checking admin role:", roleError);
        toast.error("Access denied");
        navigate("/");
        return;
      }

      if (!roleData) {
        toast.error("You don't have admin access");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchClaims();
    } catch (error) {
      console.error("Error:", error);
      navigate("/auth");
    }
  };

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error: any) {
      console.error("Error fetching claims:", error);
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users when switching to users tab
  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab]);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setSettingsSaving(false);
  };

  const updateClaimStatus = async (claimId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("claims")
        .update({ status: newStatus })
        .eq("id", claimId);

      if (error) throw error;

      toast.success("Status updated successfully");
      fetchClaims();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Extract file path from URL or use as-is if already a path
  const getFilePathFromDoc = (doc: string): string => {
    // Handle both old format (full public URL) and new format (just file path)
    const marker = "/storage/v1/object/public/claim-documents/";
    const idx = doc.indexOf(marker);
    if (idx !== -1) {
      return doc.substring(idx + marker.length);
    }
    // New format: doc is already just the file path
    return doc;
  };

  // Open document using blob download (avoids Chrome blocking)
  const handleOpenDocument = async (doc: string) => {
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewBlobUrl(null);
    
    const filePath = getFilePathFromDoc(doc);
    const fileName = filePath.split("/").pop() || "document";
    setPreviewFileName(fileName);

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
      toast.error("Failed to load document preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  // Close document preview and revoke blob URL
  const handleClosePreview = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewBlobUrl(null);
    setPreviewFileName("");
    setPreviewError(null);
  };

  // Determine if file is an image
  const isImageFile = (fileName: string): boolean => {
    const ext = fileName.toLowerCase().split(".").pop();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext || "");
  };

  // Determine if file is a PDF
  const isPdfFile = (fileName: string): boolean => {
    return fileName.toLowerCase().endsWith(".pdf");
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claim_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter((user) => {
    const searchLower = userSearchTerm.toLowerCase();
    return (
      (user.full_name?.toLowerCase() || "").includes(searchLower) ||
      (user.email?.toLowerCase() || "").includes(searchLower) ||
      (user.phone?.toLowerCase() || "").includes(searchLower)
    );
  });

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    resolved: claims.filter((c) => c.status === "resolved").length,
    inReview: claims.filter((c) => c.status === "in-review").length,
    totalAmount: claims.reduce((sum, c) => sum + Number(c.claim_amount), 0),
    totalUsers: users.length,
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard Overview";
      case "claims": return "All Claims";
      case "users": return "User Management";
      case "settings": return "Settings";
      default: return "Admin Dashboard";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-primary via-primary to-primary/90 text-primary-foreground z-50 transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 h-full flex flex-col">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="font-display font-bold leading-tight">Claim For Sure</span>
                  <span className="text-[10px] opacity-80">Admin Panel</span>
                </div>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" as ActiveTab },
              { icon: FileText, label: "All Claims", tab: "claims" as ActiveTab, badge: stats.pending },
              { icon: Users, label: "Users", tab: "users" as ActiveTab },
              { icon: Settings, label: "Settings", tab: "settings" as ActiveTab },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.tab 
                    ? 'bg-white text-primary shadow-lg' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.tab ? 'text-primary' : ''}`} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {sidebarOpen && item.badge && item.badge > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeTab === item.tab 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {sidebarOpen && activeTab === item.tab && (
                  <ChevronRight className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="pt-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/50 h-16 flex items-center px-6 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-xl font-bold text-foreground">
                {getTabTitle()}
              </h1>
              {activeTab === "claims" && (
                <Badge variant="secondary" className="hidden md:flex">
                  {filteredClaims.length} claims
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setActiveTab("claims")}
              >
                <Bell className="w-5 h-5" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                    {stats.pending}
                  </span>
                )}
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold shadow-md">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold">Administrator</div>
                  <div className="text-xs text-muted-foreground">{adminEmail}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Claims</div>
                </div>
                <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-xs text-yellow-600 font-semibold px-2 py-1 bg-yellow-50 rounded-full">Action needed</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-semibold">
                      {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stats.resolved}</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <IndianRupee className="w-6 h-6 text-accent" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    ₹{(stats.totalAmount / 100000).toFixed(1)}L
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("claims")}
                  className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">View All Claims</h3>
                  <p className="text-sm text-muted-foreground">Manage and review all submitted claims</p>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Users className="w-8 h-8 text-primary" />
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">User Management</h3>
                  <p className="text-sm text-muted-foreground">View and manage registered users</p>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Settings className="w-8 h-8 text-primary" />
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure system preferences</p>
                </button>
              </div>

              {/* Recent Claims */}
              <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-border/50 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-foreground">Recent Claims</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("claims")}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="divide-y divide-border/50">
                  {claims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {claim.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{claim.full_name}</div>
                          <div className="text-xs text-muted-foreground">{claim.claim_id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground">₹{Number(claim.claim_amount).toLocaleString('en-IN')}</span>
                        <Badge className={statusColors[claim.status] || statusColors.pending}>
                          {statusLabels[claim.status] || claim.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Claims Tab */}
          {activeTab === "claims" && (
            <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    All Claims
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search claims..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Claim ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredClaims.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No claims found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-medium text-primary">{claim.claim_id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                                {claim.full_name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{claim.full_name}</div>
                                <div className="text-xs text-muted-foreground">{claim.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-foreground">{claim.insurance_type}</div>
                            <div className="text-xs text-muted-foreground">{claim.insurance_company}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-foreground">₹{Number(claim.claim_amount).toLocaleString('en-IN')}</span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={statusColors[claim.status] || statusColors.pending}>
                              {statusLabels[claim.status] || claim.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(claim.created_at).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedClaim(claim)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateClaimStatus(claim.id, "in-review")}>
                                  Mark as In Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateClaimStatus(claim.id, "legal")}>
                                  Mark as Legal Action
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateClaimStatus(claim.id, "resolved")}>
                                  Mark as Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateClaimStatus(claim.id, "rejected")}>
                                  Mark as Rejected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/20">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredClaims.length} of {claims.length} claims
                </span>
                <Button variant="outline" size="sm" onClick={fetchClaims}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Registered Users ({users.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchUsers}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No users found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold">
                                  {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-foreground">{user.full_name || "No name"}</div>
                                  <div className="text-xs text-muted-foreground">ID: {user.user_id.slice(0, 8)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm text-foreground">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                {user.email || "Not provided"}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm text-foreground">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                {user.phone || "Not provided"}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {new Date(user.created_at).toLocaleDateString('en-IN')}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Admin Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">Configure your admin panel preferences</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts for new claims</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  {/* Auto-assign */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Auto-assign Claims</Label>
                      <p className="text-sm text-muted-foreground">Automatically assign new claims to available agents</p>
                    </div>
                    <Switch
                      checked={autoAssignClaims}
                      onCheckedChange={setAutoAssignClaims}
                    />
                  </div>

                  <Separator />

                  {/* Danger Zone */}
                  <div className="pt-4">
                    <h3 className="text-base font-medium text-destructive flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Cache
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-border/50 bg-muted/20">
                  <Button onClick={handleSaveSettings} disabled={settingsSaving}>
                    {settingsSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Claim Details Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Claim Details - {selectedClaim?.claim_id}</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="font-medium">{selectedClaim.full_name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{selectedClaim.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium">{selectedClaim.phone}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <p className="font-medium">{selectedClaim.city}, {selectedClaim.state}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Insurance Type</label>
                <p className="font-medium">{selectedClaim.insurance_type}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Insurance Company</label>
                <p className="font-medium">{selectedClaim.insurance_company}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Policy Number</label>
                <p className="font-medium">{selectedClaim.policy_number}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Claim Amount</label>
                <p className="font-medium">₹{Number(selectedClaim.claim_amount).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Rejection Date</label>
                <p className="font-medium">{new Date(selectedClaim.rejection_date).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <Badge className={statusColors[selectedClaim.status] || statusColors.pending}>
                  {statusLabels[selectedClaim.status] || selectedClaim.status}
                </Badge>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">Rejection Reason</label>
                <p className="font-medium">{selectedClaim.rejection_reason}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">Documents</label>
                {selectedClaim.documents && selectedClaim.documents.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClaim.documents.map((doc, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDocument(doc)}
                        className="inline-flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        Document {index + 1}
                        <Eye className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">No documents uploaded</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog (blob-based to avoid Chrome blocking) */}
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
              <p className="text-destructive mb-4">{previewError}</p>
              <p className="text-sm text-muted-foreground">
                The document could not be loaded. Please try again or contact support.
              </p>
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

export default AdminDashboard;