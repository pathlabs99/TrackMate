import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

// Initialize Ionic Storage lazily
let storage: Storage;

const initializeStorage = async () => {
  if (!storage) {
    storage = new Storage();
    await storage.create();
  }
  return storage;
};


export const saveOfflineSubmission = async (formData: any) => {
  try {
    const storageInstance = await initializeStorage();
    const pendingSubmissions = (await storageInstance.get('pendingSubmissions')) || [];
    
    const submissionWithTimestamp = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    pendingSubmissions.push(submissionWithTimestamp);
    await storageInstance.set('pendingSubmissions', pendingSubmissions);
    console.log('Survey saved offline:', submissionWithTimestamp);
  } catch (error) {
    console.error('Error saving offline submission:', error);
  }
};

export const generateCSV = async (formData: any): Promise<string> => {
  const headers = Object.keys(formData).join(',');
  const values = Object.values(formData)
    .map((value) => {
      if (Array.isArray(value)) return `"${value.join(';')}"`;
      return `"${value || ''}"`;
    })
    .join(',');
  return `${headers}\n${values}`;
};


export const isOnline = async (): Promise<boolean> => {
  try {
    // Check both navigator.onLine and Network plugin for more accurate results
    return navigator.onLine && Network.type !== 'none';
  } catch (error) {
    console.error('Error checking online status:', error);
    return navigator.onLine; // Fallback to navigator.onLine if Network plugin fails
  }
};

export const sendCSVToBTF = async (csv: string) => {
  const fileName = `survey_submission_${new Date().toISOString().split('T')[0]}.csv`;
  try {
    const response = await fetch('https://trackmate-server-0uvc.onrender.com/send-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        csvData: csv,
        fileName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit survey: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error sending CSV to server:', error);
    throw error;
  }
};

export const retryPendingSubmissions = async () => {
  try {
    const storageInstance = await initializeStorage();
    const isConnected = await isOnline();

    if (!isConnected) {
      console.log('Device is offline. Skipping retry of pending submissions.');
      return;
    }

    let pendingSubmissions = (await storageInstance.get('pendingSubmissions')) || [];
    if (pendingSubmissions.length === 0) {
      console.log('No pending submissions to retry.');
      return;
    }

    const updatedPending = [];
    for (const submission of pendingSubmissions) {
      try {
        const csv = await generateCSV(submission);
        await sendCSVToBTF(csv);
        console.log('Successfully synced submission:', submission);
      } catch (error) {
        console.error('Failed to sync submission:', error);
        updatedPending.push(submission); // Keep the submission for future retries
      }
    }

    // Update the pending submissions list in storage
    await storageInstance.set('pendingSubmissions', updatedPending);
    console.log('Pending submissions updated after retry.');
  } catch (error) {
    console.error('Error during retryPendingSubmissions:', error);
  }
};


export const startSyncProcess = async () => {
  
  setInterval(async () => {
    const isConnected = await isOnline();
    if (isConnected) {
      console.log('Device is online. Attempting to sync pending submissions...');
      await retryPendingSubmissions();
    }
  }, 5 * 60 * 1000); 
};


startSyncProcess();