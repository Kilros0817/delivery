import { User, Order, MaterialItem, UserRole } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john@company.com', role: 'site_foreman' },
  { id: '3', name: 'Mike Wilson', email: 'mike@company.com', role: 'shop_manager' },
  { id: '6', name: 'Tom Rodriguez', email: 'tom@company.com', role: 'truck_driver' },
  { id: '7', name: 'Carlos Martinez', email: 'carlos@company.com', role: 'truck_driver' },
  { id: '8', name: 'David Johnson', email: 'david@company.com', role: 'truck_driver' },
  { id: '9', name: 'Robert Chen', email: 'robert@company.com', role: 'truck_driver' },
];

export const mockTruckDrivers = [
  {
    id: '6',
    name: 'Tom Rodriguez',
    email: 'tom@company.com',
    phone: '(555) 123-4567',
    truckNumber: 'TRUCK-001',
    licenseNumber: 'CDL-NY-123456',
    status: 'out_for_delivery',
    currentLocation: 'En route to Wall Street',
    estimatedReturn: '2024-01-15T16:00:00Z',
    ordersAssigned: 1,
    completedToday: 2
  },
  {
    id: '7',
    name: 'Carlos Martinez',
    email: 'carlos@company.com',
    phone: '(555) 234-5678',
    truckNumber: 'TRUCK-002',
    licenseNumber: 'CDL-NY-234567',
    status: 'loading',
    currentLocation: 'Shop - Loading Bay 2',
    estimatedReturn: '2024-01-15T18:00:00Z',
    ordersAssigned: 2,
    completedToday: 1
  },
  {
    id: '8',
    name: 'David Johnson',
    email: 'david@company.com',
    phone: '(555) 345-6789',
    truckNumber: 'TRUCK-003',
    licenseNumber: 'CDL-NY-345678',
    status: 'available',
    currentLocation: 'Shop - Parking Area',
    estimatedReturn: null,
    ordersAssigned: 0,
    completedToday: 3
  },
  {
    id: '9',
    name: 'Robert Chen',
    email: 'robert@company.com',
    phone: '(555) 456-7890',
    truckNumber: 'TRUCK-004',
    licenseNumber: 'CDL-NY-456789',
    status: 'maintenance',
    currentLocation: 'Shop - Maintenance Bay',
    estimatedReturn: '2024-01-16T08:00:00Z',
    ordersAssigned: 0,
    completedToday: 0
  }
];

export const mockMaterials: MaterialItem[] = [
  // Black Steel Piping
  { id: '1', name: 'Black Steel Pipe 1"', description: '1 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 100, quantityAvailable: 85, unitPrice: 4.25, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '2', name: 'Black Steel Pipe 1.25"', description: '1.25 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 80, quantityAvailable: 75, unitPrice: 5.50, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '3', name: 'Black Steel Pipe 1.5"', description: '1.5 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 60, quantityAvailable: 55, unitPrice: 6.75, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '4', name: 'Black Steel Pipe 2"', description: '2 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 50, quantityAvailable: 45, unitPrice: 9.25, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '5', name: 'Black Steel Pipe 2.5"', description: '2.5 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 40, quantityAvailable: 35, unitPrice: 12.50, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '6', name: 'Black Steel Pipe 3"', description: '3 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 30, quantityAvailable: 28, unitPrice: 16.75, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '7', name: 'Black Steel Pipe 4"', description: '4 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 25, quantityAvailable: 20, unitPrice: 24.50, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },
  { id: '8', name: 'Black Steel Pipe 6"', description: '6 inch black steel pipe Schedule 40', unit: 'feet', quantityRequested: 15, quantityAvailable: 12, unitPrice: 42.75, supplier: 'Ferguson Plumbing', category: 'Black Steel Piping' },

  // Galvanized Steel Piping
  { id: '9', name: 'Galvanized Steel Pipe 1"', description: '1 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 100, quantityAvailable: 90, unitPrice: 5.25, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '10', name: 'Galvanized Steel Pipe 1.25"', description: '1.25 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 80, quantityAvailable: 70, unitPrice: 6.75, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '11', name: 'Galvanized Steel Pipe 1.5"', description: '1.5 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 60, quantityAvailable: 58, unitPrice: 8.25, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '12', name: 'Galvanized Steel Pipe 2"', description: '2 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 50, quantityAvailable: 42, unitPrice: 11.50, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '13', name: 'Galvanized Steel Pipe 2.5"', description: '2.5 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 40, quantityAvailable: 38, unitPrice: 15.25, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '14', name: 'Galvanized Steel Pipe 3"', description: '3 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 30, quantityAvailable: 25, unitPrice: 20.50, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '15', name: 'Galvanized Steel Pipe 4"', description: '4 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 25, quantityAvailable: 22, unitPrice: 29.75, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },
  { id: '16', name: 'Galvanized Steel Pipe 6"', description: '6 inch galvanized steel pipe Schedule 40', unit: 'feet', quantityRequested: 15, quantityAvailable: 10, unitPrice: 52.25, supplier: 'Ferguson Plumbing', category: 'Galvanized Steel Piping' },

  // Victaulic Couplings
  { id: '17', name: 'Victaulic Coupling 1"', description: '1 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 50, quantityAvailable: 45, unitPrice: 18.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '18', name: 'Victaulic Coupling 1.25"', description: '1.25 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 40, quantityAvailable: 35, unitPrice: 22.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '19', name: 'Victaulic Coupling 1.5"', description: '1.5 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 35, quantityAvailable: 30, unitPrice: 26.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '20', name: 'Victaulic Coupling 2"', description: '2 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 30, quantityAvailable: 28, unitPrice: 34.25, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '21', name: 'Victaulic Coupling 2.5"', description: '2.5 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 25, quantityAvailable: 20, unitPrice: 42.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '22', name: 'Victaulic Coupling 3"', description: '3 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 20, quantityAvailable: 18, unitPrice: 52.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '23', name: 'Victaulic Coupling 4"', description: '4 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 15, quantityAvailable: 12, unitPrice: 68.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '24', name: 'Victaulic Coupling 6"', description: '6 inch Victaulic rigid coupling Style 77', unit: 'pieces', quantityRequested: 10, quantityAvailable: 8, unitPrice: 125.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },

  // Victaulic Tees
  { id: '25', name: 'Victaulic Tee 1"', description: '1 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 25, quantityAvailable: 20, unitPrice: 28.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '26', name: 'Victaulic Tee 1.25"', description: '1.25 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 20, quantityAvailable: 18, unitPrice: 35.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '27', name: 'Victaulic Tee 1.5"', description: '1.5 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 18, quantityAvailable: 15, unitPrice: 42.25, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '28', name: 'Victaulic Tee 2"', description: '2 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 15, quantityAvailable: 12, unitPrice: 56.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '29', name: 'Victaulic Tee 2.5"', description: '2.5 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 12, quantityAvailable: 10, unitPrice: 72.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '30', name: 'Victaulic Tee 3"', description: '3 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 10, quantityAvailable: 8, unitPrice: 89.25, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '31', name: 'Victaulic Tee 4"', description: '4 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 8, quantityAvailable: 6, unitPrice: 125.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '32', name: 'Victaulic Tee 6"', description: '6 inch Victaulic grooved tee', unit: 'pieces', quantityRequested: 5, quantityAvailable: 4, unitPrice: 225.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },

  // Victaulic Elbows
  { id: '33', name: 'Victaulic Elbow 1"', description: '1 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 30, quantityAvailable: 25, unitPrice: 24.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '34', name: 'Victaulic Elbow 1.25"', description: '1.25 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 25, quantityAvailable: 22, unitPrice: 29.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '35', name: 'Victaulic Elbow 1.5"', description: '1.5 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 22, quantityAvailable: 18, unitPrice: 35.25, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '36', name: 'Victaulic Elbow 2"', description: '2 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 20, quantityAvailable: 16, unitPrice: 46.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '37', name: 'Victaulic Elbow 2.5"', description: '2.5 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 15, quantityAvailable: 12, unitPrice: 58.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '38', name: 'Victaulic Elbow 3"', description: '3 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 12, quantityAvailable: 10, unitPrice: 72.25, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '39', name: 'Victaulic Elbow 4"', description: '4 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 10, quantityAvailable: 8, unitPrice: 98.50, supplier: 'Victaulic Supply', category: 'Victaulic Material' },
  { id: '40', name: 'Victaulic Elbow 6"', description: '6 inch Victaulic grooved 90° elbow', unit: 'pieces', quantityRequested: 6, quantityAvailable: 5, unitPrice: 175.75, supplier: 'Victaulic Supply', category: 'Victaulic Material' },

  // Steel Screw Material - Black
  { id: '41', name: 'Black Steel Screw 1"', description: '1 inch black steel screw fitting', unit: 'pieces', quantityRequested: 100, quantityAvailable: 85, unitPrice: 3.25, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },
  { id: '42', name: 'Black Steel Screw 1.25"', description: '1.25 inch black steel screw fitting', unit: 'pieces', quantityRequested: 80, quantityAvailable: 75, unitPrice: 4.50, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },
  { id: '43', name: 'Black Steel Screw 1.5"', description: '1.5 inch black steel screw fitting', unit: 'pieces', quantityRequested: 60, quantityAvailable: 55, unitPrice: 5.75, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },
  { id: '44', name: 'Black Steel Screw 2"', description: '2 inch black steel screw fitting', unit: 'pieces', quantityRequested: 50, quantityAvailable: 45, unitPrice: 7.25, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },

  // Steel Screw Material - Galvanized
  { id: '45', name: 'Galvanized Steel Screw 1"', description: '1 inch galvanized steel screw fitting', unit: 'pieces', quantityRequested: 100, quantityAvailable: 90, unitPrice: 4.25, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },
  { id: '46', name: 'Galvanized Steel Screw 1.25"', description: '1.25 inch galvanized steel screw fitting', unit: 'pieces', quantityRequested: 80, quantityAvailable: 70, unitPrice: 5.75, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },
  { id: '47', name: 'Galvanized Steel Screw 1.5"', description: '1.5 inch galvanized steel screw fitting', unit: 'pieces', quantityRequested: 60, quantityAvailable: 58, unitPrice: 7.25, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },
  { id: '48', name: 'Galvanized Steel Screw 2"', description: '2 inch galvanized steel screw fitting', unit: 'pieces', quantityRequested: 50, quantityAvailable: 42, unitPrice: 9.50, supplier: 'Industrial Fasteners', category: 'Steel Screw Material' },

  // Hilti Drop-in Shields
  { id: '49', name: 'Hilti Drop-in Shield 3/8"', description: '3/8 inch Hilti drop-in anchor shield', unit: 'pieces', quantityRequested: 200, quantityAvailable: 180, unitPrice: 1.85, supplier: 'Hilti Store NYC', category: 'Installing Material' },
  { id: '50', name: 'Hilti Drop-in Shield 1/2"', description: '1/2 inch Hilti drop-in anchor shield', unit: 'pieces', quantityRequested: 150, quantityAvailable: 140, unitPrice: 2.25, supplier: 'Hilti Store NYC', category: 'Installing Material' },

  // Threaded Rod
  { id: '51', name: 'Threaded Rod 3/8"', description: '3/8 inch all-thread rod galvanized', unit: 'feet', quantityRequested: 500, quantityAvailable: 450, unitPrice: 1.25, supplier: 'Fastenal', category: 'Installing Material' },
  { id: '52', name: 'Threaded Rod 1/2"', description: '1/2 inch all-thread rod galvanized', unit: 'feet', quantityRequested: 400, quantityAvailable: 380, unitPrice: 1.85, supplier: 'Fastenal', category: 'Installing Material' },

  // Pipe Hanging Material
  { id: '53', name: 'Pipe Hanger 1"', description: '1 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 100, quantityAvailable: 85, unitPrice: 4.75, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '54', name: 'Pipe Hanger 1.25"', description: '1.25 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 80, quantityAvailable: 75, unitPrice: 5.25, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '55', name: 'Pipe Hanger 1.5"', description: '1.5 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 70, quantityAvailable: 65, unitPrice: 5.75, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '56', name: 'Pipe Hanger 2"', description: '2 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 60, quantityAvailable: 55, unitPrice: 6.50, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '57', name: 'Pipe Hanger 2.5"', description: '2.5 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 50, quantityAvailable: 45, unitPrice: 7.25, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '58', name: 'Pipe Hanger 3"', description: '3 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 40, quantityAvailable: 35, unitPrice: 8.75, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '59', name: 'Pipe Hanger 4"', description: '4 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 30, quantityAvailable: 25, unitPrice: 12.50, supplier: 'B-Line Systems', category: 'Installing Material' },
  { id: '60', name: 'Pipe Hanger 6"', description: '6 inch adjustable pipe hanger', unit: 'pieces', quantityRequested: 20, quantityAvailable: 18, unitPrice: 18.75, supplier: 'B-Line Systems', category: 'Installing Material' },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    projectName: 'Manhattan Financial District Tower',
    jobSite: '125 Wall Street, New York, NY 10005',
    requestedBy: mockUsers[0],
    assignedTo: mockUsers[2],
    status: 'ready_to_load',
    priority: 'high',
    materials: [
      mockMaterials[0], // Black Steel Pipe 1"
      mockMaterials[16], // Victaulic Coupling 1"
      mockMaterials[48], // Hilti Drop-in Shield 3/8"
      mockMaterials[52] // Pipe Hanger 1"
    ],
    deliveryDate: '2024-01-15',
    specialNotes: 'Deliver to loading dock on Stone Street side, contact site supervisor upon arrival. Security clearance required.',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    statusHistory: [
      { id: '1', status: 'pending', updatedBy: mockUsers[0], timestamp: '2024-01-10T08:00:00Z' },
      { id: '2', status: 'in_shop', updatedBy: mockUsers[1], timestamp: '2024-01-10T10:15:00Z', notes: 'Materials received in shop' },
      { id: '3', status: 'being_pulled', updatedBy: mockUsers[1], timestamp: '2024-01-12T14:30:00Z', notes: 'Started pulling materials' },
      { id: '4', status: 'ready_to_load', updatedBy: mockUsers[1], timestamp: '2024-01-13T09:00:00Z', notes: 'Materials ready for truck loading' },
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    projectName: 'Hudson Yards Residential Complex',
    jobSite: '555 West 30th Street, New York, NY 10001',
    requestedBy: mockUsers[0],
    status: 'back_ordered',
    priority: 'medium',
    materials: [
      mockMaterials[6], // Black Steel Pipe 4"
      mockMaterials[22], // Victaulic Coupling 4"
      mockMaterials[30], // Victaulic Tee 4"
      mockMaterials[58] // Pipe Hanger 4"
    ],
    deliveryDate: '2024-01-18',
    specialNotes: 'Coordinate with building management for elevator access. Weather dependent delivery.',
    createdAt: '2024-01-11T09:30:00Z',
    updatedAt: '2024-01-13T11:45:00Z',
    statusHistory: [
      { id: '4', status: 'pending', updatedBy: mockUsers[0], timestamp: '2024-01-11T09:30:00Z' },
      { id: '5', status: 'in_shop', updatedBy: mockUsers[1], timestamp: '2024-01-11T11:00:00Z', notes: 'Materials received in shop' },
      { id: '6', status: 'back_ordered', updatedBy: mockUsers[1], timestamp: '2024-01-13T11:45:00Z', notes: 'Victaulic Coupling 4" temporarily out of stock, expected restock Jan 20' },
    ],
    backOrderedItems: ['Victaulic Coupling 4"']
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    projectName: 'Brooklyn Bridge Maintenance',
    jobSite: 'Brooklyn Bridge Approach, New York, NY 10038',
    requestedBy: mockUsers[0],
    assignedTo: mockUsers[2],
    status: 'delivered',
    priority: 'urgent',
    materials: [
      mockMaterials[11], // Galvanized Steel Pipe 2"
      mockMaterials[19] // Victaulic Coupling 2"
    ],
    deliveryDate: '2024-01-12',
    specialNotes: 'Early morning delivery required before 6 AM to avoid traffic restrictions. DOT permits required.',
    createdAt: '2024-01-09T16:00:00Z',
    updatedAt: '2024-01-12T05:45:00Z',
    statusHistory: [
      { id: '7', status: 'pending', updatedBy: mockUsers[0], timestamp: '2024-01-09T16:00:00Z' },
      { id: '8', status: 'in_shop', updatedBy: mockUsers[1], timestamp: '2024-01-09T17:30:00Z', notes: 'Materials received in shop' },
      { id: '9', status: 'being_pulled', updatedBy: mockUsers[1], timestamp: '2024-01-10T07:00:00Z' },
      { id: '10', status: 'ready_to_load', updatedBy: mockUsers[1], timestamp: '2024-01-11T15:00:00Z' },
      { id: '11', status: 'loaded', updatedBy: mockUsers[1], timestamp: '2024-01-11T16:30:00Z' },
      { id: '12', status: 'out_for_delivery', updatedBy: mockUsers[2], timestamp: '2024-01-12T04:00:00Z' },
      { id: '13', status: 'delivered', updatedBy: mockUsers[2], timestamp: '2024-01-12T05:45:00Z', notes: 'Delivered successfully, signed by site supervisor' },
    ]
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    projectName: 'Times Square Office Building',
    jobSite: '1500 Broadway, New York, NY 10036',
    requestedBy: mockUsers[0],
    assignedTo: mockUsers[2], // Tom Rodriguez
    status: 'loaded',
    priority: 'high',
    materials: [
      mockMaterials[3], // Black Steel Pipe 2"
      mockMaterials[19], // Victaulic Coupling 2"
      mockMaterials[27], // Victaulic Tee 2"
      mockMaterials[55] // Pipe Hanger 2"
    ],
    deliveryDate: '2024-01-16',
    specialNotes: 'Delivery to 42nd Street entrance. Contact building security first.',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    statusHistory: [
      { id: '14', status: 'pending', updatedBy: mockUsers[0], timestamp: '2024-01-12T10:00:00Z' },
      { id: '15', status: 'in_shop', updatedBy: mockUsers[1], timestamp: '2024-01-12T11:30:00Z', notes: 'Materials received in shop' },
      { id: '16', status: 'being_pulled', updatedBy: mockUsers[1], timestamp: '2024-01-14T08:00:00Z' },
      { id: '17', status: 'ready_to_load', updatedBy: mockUsers[1], timestamp: '2024-01-15T13:00:00Z' },
      { id: '18', status: 'loaded', updatedBy: mockUsers[1], timestamp: '2024-01-15T14:00:00Z', notes: 'Assigned to driver: Tom Rodriguez' },
    ]
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    projectName: 'Central Park West Residential',
    jobSite: '200 Central Park West, New York, NY 10024',
    requestedBy: mockUsers[0],
    assignedTo: mockUsers[2], // Tom Rodriguez
    status: 'out_for_delivery',
    priority: 'medium',
    materials: [
      mockMaterials[8], // Galvanized Steel Pipe 1"
      mockMaterials[17], // Victaulic Coupling 1"
      mockMaterials[49], // Hilti Drop-in Shield 3/8"
      mockMaterials[53] // Pipe Hanger 1"
    ],
    deliveryDate: '2024-01-15',
    specialNotes: 'Residential building - use service entrance on 69th Street.',
    createdAt: '2024-01-11T14:00:00Z',
    updatedAt: '2024-01-15T07:30:00Z',
    statusHistory: [
      { id: '19', status: 'pending', updatedBy: mockUsers[0], timestamp: '2024-01-11T14:00:00Z' },
      { id: '20', status: 'in_shop', updatedBy: mockUsers[1], timestamp: '2024-01-11T15:30:00Z', notes: 'Materials received in shop' },
      { id: '21', status: 'being_pulled', updatedBy: mockUsers[1], timestamp: '2024-01-13T09:00:00Z' },
      { id: '22', status: 'ready_to_load', updatedBy: mockUsers[1], timestamp: '2024-01-14T16:00:00Z' },
      { id: '23', status: 'loaded', updatedBy: mockUsers[1], timestamp: '2024-01-14T17:00:00Z', notes: 'Assigned to driver: Tom Rodriguez' },
      { id: '24', status: 'out_for_delivery', updatedBy: mockUsers[2], timestamp: '2024-01-15T07:30:00Z' },
    ]
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    projectName: 'Lower East Side Renovation',
    jobSite: '150 Rivington Street, New York, NY 10002',
    requestedBy: mockUsers[0],
    assignedTo: mockUsers[2], // Tom Rodriguez
    status: 'delivered',
    priority: 'low',
    materials: [
      mockMaterials[1], // Black Steel Pipe 1.25"
      mockMaterials[18], // Victaulic Coupling 1.25"
      mockMaterials[54] // Pipe Hanger 1.25"
    ],
    deliveryDate: '2024-01-13',
    specialNotes: 'Small street - truck parking may be limited. Call ahead.',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-13T15:45:00Z',
    statusHistory: [
      { id: '25', status: 'pending', updatedBy: mockUsers[0], timestamp: '2024-01-10T11:00:00Z' },
      { id: '26', status: 'in_shop', updatedBy: mockUsers[1], timestamp: '2024-01-10T12:30:00Z', notes: 'Materials received in shop' },
      { id: '27', status: 'being_pulled', updatedBy: mockUsers[1], timestamp: '2024-01-11T10:00:00Z' },
      { id: '28', status: 'ready_to_load', updatedBy: mockUsers[1], timestamp: '2024-01-12T14:00:00Z' },
      { id: '29', status: 'loaded', updatedBy: mockUsers[1], timestamp: '2024-01-12T15:00:00Z', notes: 'Assigned to driver: Tom Rodriguez' },
      { id: '30', status: 'out_for_delivery', updatedBy: mockUsers[2], timestamp: '2024-01-13T08:00:00Z' },
      { id: '31', status: 'delivered', updatedBy: mockUsers[2], timestamp: '2024-01-13T15:45:00Z', notes: 'Delivered successfully, received by site foreman' },
    ]
  }
];

export const rolePermissions: Record<UserRole, string[]> = {
  site_foreman: ['create_order', 'view_orders', 'add_notes'],
  shop_manager: ['view_all_orders', 'update_status', 'assign_driver', 'add_notes'],
  truck_driver: ['view_assigned_deliveries', 'update_delivery_status', 'add_notes'],
};