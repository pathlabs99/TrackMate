import React, { useRef, useState } from 'react';
import { QuestionComponentProps } from './types';
import { Button, Box, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';

export const PhotoCapture: React.FC<QuestionComponentProps> = ({ 
  question,
  value,
  onChange,
  error
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value as string || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Stop the camera stream
      stream.getTracks().forEach(track => track.stop());

      // Convert to base64
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(imageDataUrl);
      onChange(question.id, imageDataUrl);
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Fallback to file input if camera access fails
      fileInputRef.current?.click();
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setPreviewUrl(imageDataUrl);
        onChange(question.id, imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onChange(question.id, '');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
      
      {previewUrl ? (
        <Box sx={{ textAlign: 'center' }}>
          <img 
            src={previewUrl} 
            alt="Captured" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px',
              borderRadius: '8px',
              marginBottom: '16px'
            }} 
          />
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            sx={{ mt: 1 }}
          >
            Clear Photo
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAltIcon />}
            onClick={handleCapture}
          >
            Take Photo
          </Button>
          {error && (
            <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
