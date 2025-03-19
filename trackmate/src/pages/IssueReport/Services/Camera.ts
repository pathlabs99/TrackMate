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
     // Create a file input element
     const input = document.createElement("input");
     input.type = "file";
     input.accept = "image/*";
     input.capture = "environment"; // Use the back camera if available

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

       // If the user cancels, resolve with null
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

     // Trigger the file selection
     input.click();

     // Wait for user to select a file
     const file = await filePromise;
     if (!file) {
       return null; // User canceled
     }

     // Read the file as a data URL
     const reader = new FileReader();
     const dataUrlPromise = new Promise<string>((resolve) => {
       reader.onload = () => {
         resolve(reader.result as string);
       };
     });

     reader.readAsDataURL(file);
     return await dataUrlPromise;
   } else {
     // For gallery on web, use a regular file picker
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
     });

     // Trigger the file selection
     input.click();

     // Wait for user to select a file
     const file = await filePromise;
     if (!file) {
       return null; // User canceled
     }

     // Read the file as a data URL
     const reader = new FileReader();
     const dataUrlPromise = new Promise<string>((resolve) => {
       reader.onload = () => {
         resolve(reader.result as string);
       };
     });

     reader.readAsDataURL(file);
     return await dataUrlPromise;
   }
}

  /**
   * Handle camera for native mobile devices
   */

  private static async handleNativeCamera(sourceType: CameraSource): Promise<string | null> {
    try {
      // Request camera permissions
      if (sourceType === CameraSource.Camera) {
        const permissionState = await CapacitorCamera.checkPermissions();
        if (permissionState.camera !== 'granted') {
          const requestResult = await CapacitorCamera.requestPermissions({
            permissions: ['camera']
          });
          
          if (requestResult.camera !== 'granted') {
            throw new Error("Camera permission denied");
          }
        }
      }

      // For photo gallery
      if (sourceType === CameraSource.Photos) {
        const permissionState = await CapacitorCamera.checkPermissions();
        if (permissionState.photos !== 'granted') {
          const requestResult = await CapacitorCamera.requestPermissions({
            permissions: ['photos']
          });
          
          if (requestResult.photos !== 'granted') {
            throw new Error("Photos permission denied");
          }
        }
      }

      // Get the photo
      const image = await CapacitorCamera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: sourceType,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error("Capacitor camera error:", error);
      throw error;
    }
  }
}
