export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 
  | 'site_foreman' 
  | 'shop_manager' 
  | 'truck_driver';

export type OrderStatus = 
  | 'pending' 
  | 'in_shop' 
  | 'being_pulled' 
  | 'ready_to_load'
  | 'loaded' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'foreman_confirmed'
  | 'back_ordered' 
  | 'cancelled';

export interface MaterialItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantityRequested: number;
  quantityAvailable: number;
  unitPrice: number;
  supplier: string;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  projectName: string;
  jobSite: string;
  requestedBy: User;
  assignedTo?: User;
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  materials: MaterialItem[];
  deliveryDate: string;
  specialNotes: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusUpdate[];
  backOrderedItems?: string[];
}

export interface StatusUpdate {
  id: string;
  status: OrderStatus;
  updatedBy: User;
  timestamp: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'order_created' | 'status_updated' | 'back_ordered' | 'special_note' | 'delivery_scheduled';
  orderId: string;
  message: string;
  timestamp: string;
  read: boolean;
  recipients: string[];
}