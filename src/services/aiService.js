export const getInsights = async () => {
  // Simulating an API call to an AI service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          type: 'warning',
          icon: 'car_repair',
          text: 'Vehicle MH-03-BU has the highest maintenance cost this month (₹45,000).',
          highlight: 'MH-03-BU'
        },
        {
          id: 2,
          type: 'success',
          icon: 'sports_score',
          text: 'Driver Mahesh Sharma completed the most trips (14 trips).',
          highlight: 'Mahesh Sharma'
        },
        {
          id: 3,
          type: 'danger',
          icon: 'trending_up',
          text: 'Overall fuel cost increased by 15% compared to last week.',
          highlight: '15%'
        },
        {
          id: 4,
          type: 'info',
          icon: 'route',
          text: 'Route #402 (Andheri) is experiencing unusual delays.',
          highlight: 'Route #402'
        }
      ]);
    }, 800);
  });
};
