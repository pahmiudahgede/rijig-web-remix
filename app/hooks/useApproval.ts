// app/hooks/useApproval.ts
import { useState, useCallback } from "react";
import ApprovalService from "~/services/admin/approval.service";
import type { PendingUser, UserRole, ApprovalAction } from "~/types/approval.types";

interface UseApprovalState {
  pengelolaUsers: PendingUser[];
  pengepulUsers: PendingUser[];
  loading: boolean;
  processingAction: boolean;
  totalPending: {
    pengelola: number;
    pengepul: number;
    total: number;
  };
  error: string | null;
}

interface UseApprovalActions {
  loadPendingUsers: () => Promise<void>;
  performApprovalAction: (userId: string, action: ApprovalAction) => Promise<boolean>;
  getApprovalDetails: (userId: string) => Promise<PendingUser | null>;
  refreshData: () => Promise<void>;
}

export function useApproval(): UseApprovalState & UseApprovalActions {
  const [state, setState] = useState<UseApprovalState>({
    pengelolaUsers: [],
    pengepulUsers: [],
    loading: false,
    processingAction: false,
    totalPending: {
      pengelola: 0,
      pengepul: 0,
      total: 0
    },
    error: null
  });

  const loadPendingUsers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await ApprovalService.getAllPendingUsers();
      
      setState(prev => ({
        ...prev,
        pengelolaUsers: result.pengelola.data?.users || [],
        pengepulUsers: result.pengepul.data?.users || [],
        totalPending: {
          pengelola: result.pengelola.data?.summary.pengelola_pending || 0,
          pengepul: result.pengepul.data?.summary.pengepul_pending || 0,
          total: result.pengelola.data?.summary.total_pending || 0
        },
        loading: false
      }));
    } catch (error) {
      console.error("Error loading pending users:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Gagal memuat data pengguna pending"
      }));
    }
  }, []);

  const performApprovalAction = useCallback(async (
    userId: string, 
    action: ApprovalAction
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, processingAction: true, error: null }));
    
    try {
      const response = await ApprovalService.performApprovalAction({
        user_id: userId,
        action
      });

      if (response.meta.status === 200) {
        // Remove the user from the appropriate list after successful action
        setState(prev => ({
          ...prev,
          pengelolaUsers: prev.pengelolaUsers.filter(user => user.id !== userId),
          pengepulUsers: prev.pengepulUsers.filter(user => user.id !== userId),
          totalPending: {
            ...prev.totalPending,
            pengelola: Math.max(0, prev.totalPending.pengelola - 
              (prev.pengelolaUsers.some(user => user.id === userId) ? 1 : 0)),
            pengepul: Math.max(0, prev.totalPending.pengepul - 
              (prev.pengepulUsers.some(user => user.id === userId) ? 1 : 0)),
            total: Math.max(0, prev.totalPending.total - 1)
          },
          processingAction: false
        }));
        
        return true;
      }
      
      setState(prev => ({ ...prev, processingAction: false }));
      return false;
    } catch (error) {
      console.error("Error performing approval action:", error);
      setState(prev => ({
        ...prev,
        processingAction: false,
        error: `Gagal ${action === "approved" ? "menyetujui" : "menolak"} pengguna`
      }));
      return false;
    }
  }, []);

  const getApprovalDetails = useCallback(async (userId: string): Promise<PendingUser | null> => {
    try {
      const response = await ApprovalService.getApprovalDetails(userId);
      return response.data || null;
    } catch (error) {
      console.error("Error loading user details:", error);
      setState(prev => ({
        ...prev,
        error: "Gagal memuat detail pengguna"
      }));
      return null;
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadPendingUsers();
  }, [loadPendingUsers]);

  return {
    ...state,
    loadPendingUsers,
    performApprovalAction,
    getApprovalDetails,
    refreshData
  };
}