import cron from 'node-cron';

const job = cron.schedule('*/2 * * * *', () => {
  console.log('Cron job is running for every 2 minutes');
});

export default job;
