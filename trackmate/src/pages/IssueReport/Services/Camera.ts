// Services/Camera.ts
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from "@capacitor/camera";
import { isPlatform } from "@ionic/react";

export class Camera {
  /**
   * Take a picture or select from gallery
   * @param sourceType Camera or Photos library
   * @returns DataUrl of the image or null
   */
  static async takePicture(sourceType: CameraSource): Promise<string | null> {
    try {
      // For web browsers, use a different approach
      if (!isPlatform("capacitor")) {
        return await this.handleWebCamera(sourceType);
      } else {
        return await this.handleNativeCamera(sourceType);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      throw error;
    }
  }

  // Handle camera for web browsers
  private static async handleWebCamera(sourceType: CameraSource): Promise<string | null> {
    // If we're in a browser and using the camera
    if (sourceType === CameraSource.Camera) {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment' // Prefer back camera
          } 
        });

        // Create video element to show preview
        const video = document.createElement('video');
        video.srcObject = stream;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.zIndex = '9999';
        document.body.appendChild(video);

        // Create capture button
        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Take Photo';
        captureBtn.style.position = 'fixed';
        captureBtn.style.bottom = '20px';
        captureBtn.style.left = '50%';
        captureBtn.style.transform = 'translateX(-50%)';
        captureBtn.style.zIndex = '10000';
        captureBtn.style.padding = '12px 24px';
        captureBtn.style.backgroundColor = '#3880ff';
        captureBtn.style.color = 'white';
        captureBtn.style.border = 'none';
        captureBtn.style.borderRadius = '8px';
        document.body.appendChild(captureBtn);

        // Wait for video to be ready
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();
            resolve(null);
          };
        });

        // Wait for user to capture
        const imageDataUrl = await new Promise<string>((resolve) => {
          captureBtn.onclick = () => {
            // Create canvas and draw video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);

            // Convert to data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

            // Clean up
            stream.getTracks().forEach(track => track.stop());
            video.remove();
            captureBtn.remove();

            resolve(dataUrl);
          };
        });

        return imageDataUrl;
      } catch (error) {
        console.error('Error accessing camera:', error);
        // Fallback to file input if camera access fails
        return this.handleFileInput();
      }
    } else {
      // For gallery selection, use file input
      return this.handleFileInput();
    }
  }

  // Handle file input for both fallback and gallery selection
  private static async handleFileInput(): Promise<string | null> {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    // Create a promise to wait for user input
    const filePromise = new Promise<File | null>((resolve) => {
      input.onchange = (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          resolve(files[0]);
        } else {
          resolve(null);
        }
      };

      // Handle cancel
      input.onclick = () => {
        const cancelCheck = setTimeout(() => {
          if (input.files?.length === 0 || !input.files) {
            resolve(null);
          }
        }, 1000);

        input.onchange = (event) => {
          clearTimeout(cancelCheck);
          const files = (event.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            resolve(files[0]);
          } else {
            resolve(null);
          }
        };
      };
    });

    // Trigger file selection
    input.click();

    // Wait for user to select a file
    const file = await filePromise;
    if (!file) {
      return null; // User canceled
    }

    // Read the file as data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  // Handle camera for native platforms
  private static async handleNativeCamera(sourceType: CameraSource): Promise<string | null> {
    const image = await CapacitorCamera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: sourceType,
      saveToGallery: false,
    });

    return image.dataUrl || null;
  }
}
