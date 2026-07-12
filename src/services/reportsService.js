export const getReport = (type, filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [];
      const indianNames = ['Mahesh Sharma', 'Pooja Patil', 'Ravi Kumar', 'Priya Singh', 'Amit Desai', 'Neha Gupta', 'Vikram Singh', 'Kavita Joshi', 'Rahul Verma', 'Sneha Reddy'];
      const locations = ['JNPT Port', 'Andheri East', 'Bhiwandi Hub', 'Thane West', 'Navi Mumbai', 'Pune Station', 'Dadar', 'Borivali', 'Vashi', 'Kalyan'];
      const statuses = ['Active', 'In Shop', 'Available', 'En Route', 'Pending', 'Completed', 'Suspended', 'Off Duty'];
      const vehicleTypes = ['Heavy Truck', 'Light Van', 'Bus', 'SUV', 'Minivan'];
      
      switch (type) {
        case 'vehicle':
          data = Array.from({ length: 200 }, (_, i) => ({
            id: `MH-${String((i % 50) + 1).padStart(2, '0')}-V${i+1}`,
            type: vehicleTypes[i % vehicleTypes.length],
            status: ['Active', 'In Shop', 'Available', 'Retired'][i % 4],
            mileage: `${Math.floor(Math.random() * 300000 + 5000)} km`,
            last_service: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
          }));
          break;
        case 'driver':
          data = Array.from({ length: 200 }, (_, i) => ({
            id: `DR-MH-${4000 + i}`,
            name: indianNames[i % indianNames.length] + (i > 9 ? ` ${i}` : ''),
            license: ['Heavy Duty', 'Passenger', 'Hazmat', 'Standard'][i % 4],
            status: ['Available', 'On Trip', 'Suspended', 'Off Duty'][i % 4],
            rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
          }));
          break;
        case 'trip':
          data = Array.from({ length: 200 }, (_, i) => ({
            id: `TRP-MH-${String(i+1).padStart(3, '0')}`,
            origin: locations[i % locations.length],
            destination: locations[(i + 3) % locations.length],
            status: ['En Route', 'Pending', 'Completed', 'Cancelled'][i % 4],
            driver: indianNames[i % indianNames.length],
            distance: `${Math.floor(Math.random() * 500 + 10)} km`
          }));
          break;
        case 'maintenance':
          data = Array.from({ length: 200 }, (_, i) => ({
            id: `MNT-${String(i+1).padStart(3, '0')}`,
            vehicle: `MH-${String((i % 50) + 1).padStart(2, '0')}-V${i+1}`,
            type: ['Oil Change', 'Repair', 'Tire Rotation', 'Engine Overhaul'][i % 4],
            date: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
            cost: `₹${(Math.floor(Math.random() * 50) + 5) * 1000}`
          }));
          break;
        case 'fuel':
          data = Array.from({ length: 200 }, (_, i) => ({
            date: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
            vehicle: `MH-${String((i % 50) + 1).padStart(2, '0')}-V${i+1}`,
            volume: `${(Math.random() * 100 + 20).toFixed(1)} L`,
            cost: `₹${Math.floor(Math.random() * 10000 + 2000)}`,
            station: locations[i % locations.length] + ' Pump'
          }));
          break;
        case 'expense':
          data = Array.from({ length: 200 }, (_, i) => ({
            date: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
            category: ['Toll', 'Repair', 'Software', 'Insurance', 'Wages'][i % 5],
            description: `Operational expense #${i+1}`,
            amount: `₹${(Math.floor(Math.random() * 100) + 1) * 500}`
          }));
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
