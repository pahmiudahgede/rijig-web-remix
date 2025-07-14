import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs
} from "@remix-run/node";
import { useLoaderData, useFetcher, useRevalidator } from "@remix-run/react";
import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  RefreshCw
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "~/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import ApprovalService from "~/services/admin/approval.service";
import type {
  PendingUser,
  UserRole,
  ApprovalAction
} from "~/types/approval.types";

interface LoaderData {
  pendingUsers: {
    pengelola: PendingUser[];
    pengepul: PendingUser[];
  };
  summary: {
    totalPending: number;
    pengelolaPending: number;
    pengepulPending: number;
  };
}

interface ActionData {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Fetch pending users for both roles
    const [pengelolaResponse, pengepulResponse] = await Promise.all([
      ApprovalService.getPendingUsers("pengelola"),
      ApprovalService.getPendingUsers("pengepul")
    ]);

    const pengelolaUsers = pengelolaResponse.data?.users || [];
    const pengepulUsers = pengepulResponse.data?.users || [];

    const summary = {
      totalPending: pengelolaResponse.data?.summary.total_pending || 0,
      pengelolaPending: pengelolaResponse.data?.summary.pengelola_pending || 0,
      pengepulPending: pengepulResponse.data?.summary.pengepul_pending || 0
    };

    return json<LoaderData>({
      pendingUsers: {
        pengelola: pengelolaUsers,
        pengepul: pengepulUsers
      },
      summary
    });
  } catch (error) {
    console.error("Error loading users:", error);
    return json<LoaderData>({
      pendingUsers: { pengelola: [], pengepul: [] },
      summary: { totalPending: 0, pengelolaPending: 0, pengepulPending: 0 }
    });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action") as ApprovalAction;
  const userId = formData.get("userId") as string;

  if (!action || !userId) {
    return json<ActionData>(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const response = await ApprovalService.performApprovalAction({
      user_id: userId,
      action
    });

    return json<ActionData>({
      success: true,
      message:
        action === "approved"
          ? "User berhasil disetujui"
          : "User berhasil ditolak",
      data: response.data
    });
  } catch (error) {
    console.error("Error performing approval action:", error);
    return json<ActionData>(
      {
        error:
          action === "approved" ? "Gagal menyetujui user" : "Gagal menolak user"
      },
      { status: 500 }
    );
  }
};

export default function UserManagement() {
  const { pendingUsers, summary } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionData>();
  const revalidator = useRevalidator();
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    action: ApprovalAction;
    userName: string;
  }>({
    open: false,
    userId: "",
    action: "approved",
    userName: ""
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: ""
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getUserName = (user: PendingUser) => {
    return (
      user.company_profile?.company_name ||
      user.identity_card?.fullname ||
      `User ${user.phone.slice(-4)}`
    );
  };

  const handleApprovalAction = (
    userId: string,
    action: ApprovalAction,
    userName: string
  ) => {
    setConfirmDialog({
      open: true,
      userId,
      action,
      userName
    });
  };

  const confirmAction = () => {
    const formData = new FormData();
    formData.append("action", confirmDialog.action);
    formData.append("userId", confirmDialog.userId);

    fetcher.submit(formData, { method: "post" });
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const isLoading = fetcher.state !== "idle" || revalidator.state !== "idle";

  // Handle action response
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      if (fetcher.data.success) {
        setNotification({
          show: true,
          type: "success",
          message: fetcher.data.message || "Action berhasil"
        });
        // Refresh data after successful action
        setTimeout(() => revalidator.revalidate(), 100);
      } else if (fetcher.data.error) {
        setNotification({
          show: true,
          type: "error",
          message: fetcher.data.error
        });
      }

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  }, [fetcher.data, fetcher.state, revalidator]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manajemen Pengguna
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola persetujuan registrasi pengelola dan pengepul
          </p>
        </div>
        <Button
          onClick={() => revalidator.revalidate()}
          disabled={isLoading}
          variant="outline"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Menunggu Approval
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary.totalPending}
            </div>
            <p className="text-xs text-muted-foreground">registrasi pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pengelola Pending
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary.pengelolaPending}
            </div>
            <p className="text-xs text-muted-foreground">
              menunggu persetujuan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pengepul Pending
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.pengepulPending}
            </div>
            <p className="text-xs text-muted-foreground">
              menunggu persetujuan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Tables with Tabs */}
      <Tabs defaultValue="pengelola" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pengelola" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Pengelola ({summary.pengelolaPending})
          </TabsTrigger>
          <TabsTrigger value="pengepul" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Pengepul ({summary.pengepulPending})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pengelola">
          <UserTable
            users={pendingUsers.pengelola}
            role="pengelola"
            isLoading={isLoading}
            onViewDetails={setSelectedUser}
            onApprovalAction={handleApprovalAction}
            getUserName={getUserName}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="pengepul">
          <UserTable
            users={pendingUsers.pengepul}
            role="pengepul"
            isLoading={isLoading}
            onViewDetails={setSelectedUser}
            onApprovalAction={handleApprovalAction}
            getUserName={getUserName}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail {selectedUser?.role.role_name}</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetailView user={selectedUser} />}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmDialog.action === "approved" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Konfirmasi{" "}
              {confirmDialog.action === "approved"
                ? "Persetujuan"
                : "Penolakan"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin{" "}
              {confirmDialog.action === "approved" ? "menyetujui" : "menolak"}{" "}
              registrasi{" "}
              <span className="font-semibold">{confirmDialog.userName}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={isLoading}
              className={
                confirmDialog.action === "approved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              {confirmDialog.action === "approved"
                ? "Ya, Setujui"
                : "Ya, Tolak"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success/Error Messages */}
      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded border ${
            notification.type === "success"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

// Separate component for the user table
function UserTable({
  users,
  role,
  isLoading,
  onViewDetails,
  onApprovalAction,
  getUserName,
  formatDate
}: {
  users: PendingUser[];
  role: UserRole;
  isLoading: boolean;
  onViewDetails: (user: PendingUser) => void;
  onApprovalAction: (
    userId: string,
    action: ApprovalAction,
    userName: string
  ) => void;
  getUserName: (user: PendingUser) => string;
  formatDate: (date: string) => string;
}) {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Daftar {role === "pengelola" ? "Pengelola" : "Pengepul"}
          </CardTitle>
          <CardDescription>
            {role === "pengelola" ? "Pengelola" : "Pengepul"} yang menunggu
            persetujuan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada {role} yang menunggu approval</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Daftar {role === "pengelola" ? "Pengelola" : "Pengepul"}
        </CardTitle>
        <CardDescription>
          {role === "pengelola" ? "Pengelola" : "Pengepul"} yang menunggu
          persetujuan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Info</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          user.company_profile?.company_logo ||
                          user.identity_card?.card_photo
                        }
                      />
                      <AvatarFallback>
                        {getUserName(user).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{getUserName(user)}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.id.slice(-8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">{user.phone}</div>
                  {user.company_profile?.company_email && (
                    <div className="text-xs text-muted-foreground">
                      {user.company_profile.company_email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role.role_name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-600"
                  >
                    {user.registration_status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(user.submitted_at)}</div>
                  <div className="text-xs text-muted-foreground">
                    Step {user.registration_progress}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => onViewDetails(user)}
                      >
                        <Eye className="h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-green-600"
                        onClick={() =>
                          onApprovalAction(
                            user.id,
                            "approved",
                            getUserName(user)
                          )
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                        Setujui
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-red-600"
                        onClick={() =>
                          onApprovalAction(
                            user.id,
                            "rejected",
                            getUserName(user)
                          )
                        }
                      >
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Component untuk detail view
function UserDetailView({ user }: { user: PendingUser }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      {/* Company Profile untuk Pengelola */}
      {user.company_profile && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Company Name
              </label>
              <p>{user.company_profile.company_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Company Type
              </label>
              <p>{user.company_profile.company_type}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Address
              </label>
              <p>{user.company_profile.company_address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone
              </label>
              <p>{user.company_profile.company_phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p>{user.company_profile.company_email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Identity Card untuk Pengepul */}
      {user.identity_card && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Identity Card</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p>{user.identity_card.fullname}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Number
              </label>
              <p className="font-mono">
                {user.identity_card.identification_number}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </label>
              <p>{user.identity_card.date_of_birth}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Place of Birth
              </label>
              <p>{user.identity_card.place_of_birth}</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Registration Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Phone
            </label>
            <p className="font-mono">{user.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <Badge variant="outline">{user.role.role_name}</Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Submitted At
            </label>
            <p>{formatDate(user.submitted_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Progress
            </label>
            <p>Step {user.registration_progress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
