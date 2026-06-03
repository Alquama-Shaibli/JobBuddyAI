import API from "./axios";

export const getProfile = async () => {
    const response = await API.get('/user/profile');
    return response.data;
};

export const updateProfile = async (userId, formData) => {
    const response = await API.patch(
        `/user/profile/${userId}`,
        formData
    );
    return response.data;
};