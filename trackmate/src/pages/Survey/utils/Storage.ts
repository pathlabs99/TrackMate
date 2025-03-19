import { Storage } from '@ionic/storage';
import { FormData } from '../models/FormData';

interface Submission extends FormData {
  timestamp: string;
}

let storage: Storage;

const initializeStorage = async () => {
  if (!storage) {
    storage = new Storage();
    await storage.create();
  }
  return storage;
};

export const saveOfflineSubmission = async (formData: FormData) => {
  try {
    const storageInstance = await initializeStorage();
    const pendingSubmissions: Submission[] = (await storageInstance.get('pendingSubmissions')) || [];
    const submissionWithTimestamp: Submission = { ...formData, timestamp: new Date().toISOString() };
    pendingSubmissions.push(submissionWithTimestamp);
    await storageInstance.set('pendingSubmissions', pendingSubmissions);
    console.log('Survey saved offline:', submissionWithTimestamp);
  } catch (error) {
    console.error('Error saving offline submission:', error);
    throw error;
  }
};

export const getPendingSubmissions = async (): Promise<Submission[]> => {
  const storageInstance = await initializeStorage();
  return (await storageInstance.get('pendingSubmissions')) || [];
};

export const updatePendingSubmissions = async (submissions: Submission[]) => {
  const storageInstance = await initializeStorage();
  await storageInstance.set('pendingSubmissions', submissions);
};