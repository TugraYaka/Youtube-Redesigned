import backendConfig from "../config/backendConfig";

export const videoService = {
    uploadVideo: async (formData) => {
        if (backendConfig.useCustomBackend) {
            try {
                const response = await fetch('/api/videos', {
                    method: 'POST',
                    body: formData, 
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Backend error response:', errorText);
                    let errorData;
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        errorData = { message: errorText };
                    }
                    console.error('Parsed error data:', errorData);
                    throw new Error(errorData.message || 'Failed to upload video');
                }

                return await response.json();
            } catch (error) {
                console.error("Video Upload Error:", error);
                throw error;
            }
        } else {
            console.warn("Upload not supported for this backend configuration yet.");
            
            return { success: true, message: "Mock upload success" };
        }
    }
};
