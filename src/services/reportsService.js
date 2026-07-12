export const getReport = (type, filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [];
      switch (type) {
        case 'vehicle':
          data = [
            { id: 'MH-01-VX', type: 'Heavy Truck', status: 'Active', mileage: '42,390 km' },
            { id: 'MH-02-TL', type: 'Light Van', status: 'In Shop', mileage: '12,012 km' },
            { id: 'MH-03-BU', type: 'Bus', status: 'Active', mileage: '89,420 km' },
            { id: 'MH-04-MX', type: 'Heavy Truck', status: 'Retired', mileage: '242,390 km' }
          ];
          break;
        case 'driver':
          data = [
            { id: 'DR-MH-4402', name: 'Mahesh Sharma', license: 'Heavy Duty', status: 'Available' },
            { id: 'DR-MH-9912', name: 'Pooja Patil', license: 'Passenger', status: 'On Trip' },
            { id: 'DR-MH-1102', name: 'Ravi Kumar', license: 'Hazmat', status: 'Suspended' },
            { id: 'DR-MH-5520', name: 'Priya Singh', license: 'Standard', status: 'Off Duty' }
          ];
          break;
        case 'trip':
          data = [
            { id: 'TRP-MH-01', origin: 'JNPT Port', destination: 'Andheri East', status: 'En Route', driver: 'Mahesh Sharma' },
            { id: 'TRP-MH-02', origin: 'Bhiwandi Hub', destination: 'Thane West', status: 'Pending', driver: 'Smita Jadhav' },
            { id: 'TRP-MH-03', origin: 'Navi Mumbai', destination: 'Pune Station', status: 'Completed', driver: 'Manish Varma' }
          ];
          break;
        case 'maintenance':
          data = [
            { id: 'MNT-01', vehicle: 'MH-01-VX', type: 'Oil Change', date: '2023-10-24', cost: '₹18,500' },
            { id: 'MNT-02', vehicle: 'MH-02-TL', type: 'Repair', date: '2023-10-25', cost: '₹1,24,000' },
            { id: 'MNT-03', vehicle: 'MH-03-FR', type: 'Tire Rotation', date: '2023-10-18', cost: '₹8,500' }
          ];
          break;
        case 'fuel':
          data = [
            { date: '2023-10-24', vehicle: 'MH-01-VX', volume: '124.5 L', cost: '₹18,675' },
            { date: '2023-10-24', vehicle: 'MH-02-TL', volume: '98.0 L', cost: '₹14,700' },
            { date: '2023-10-23', vehicle: 'MH-03-BU', volume: '150.2 L', cost: '₹22,530' }
          ];
          break;
        case 'expense':
          data = [
            { date: '2023-10-24', category: 'Toll', description: 'Bandra Worli Sea Link', amount: '₹1,250' },
            { date: '2023-10-23', category: 'Repair', description: 'Alternator replacement', amount: '₹45,000' },
            { date: '2023-10-22', category: 'Software', description: 'FleetControl Pro Subscription', amount: '₹1,20,000' }
          ];
          break;
        default:
          data = [];
      }
      
      // Apply filters
      let filteredData = [...data];
      
      if (filters?.status && filters.status !== 'All') {
        filteredData = filteredData.filter(item => 
          item.status && item.status.toLowerCase() === filters.status.toLowerCase()
        );
      }
      
      if (filters?.vehicle && filters.vehicle !== 'All') {
        filteredData = filteredData.filter(item => 
          item.vehicle && item.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()) ||
          item.id && item.id.toLowerCase().includes(filters.vehicle.toLowerCase())
        );
      }
      
      resolve(filteredData);
    }, 600); // simulate network delay
  });
};
