// app/types/trash.types.ts
export interface TrashCategory {
  id: string;
  trash_name: string;
  trash_icon: string;
  estimated_price: number;
  variety: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTrashCategoryRequest {
  name: string;
  variety: string;
  estimated_price: string;
  icon: File;
}

export interface UpdateTrashCategoryRequest {
  name: string;
  variety: string;
  estimated_price: string;
  icon?: File;
}

export interface TrashCategoryResponse {
  meta: {
    status: number;
    message: string;
  };
  data: TrashCategory[];
}