import axiosInstance from "./axiosInstance";

// Create an exchange or giveaway request
export const createRequest = (requestData) => {
    return axiosInstance.post("/exchange-requests", requestData);
};

// Get requests sent by the logged-in user
export const getSentRequests = () => {
    return axiosInstance.get("/exchange-requests/sent");
};

// Get requests received by the logged-in user
export const getReceivedRequests = () => {
    return axiosInstance.get("/exchange-requests/received");
};

// Accept a request
export const acceptRequest = (requestId) => {
    return axiosInstance.put(
        `/exchange-requests/${requestId}/accept`
    );
};

// Reject a request
export const rejectRequest = (requestId) => {
    return axiosInstance.put(
        `/exchange-requests/${requestId}/reject`
    );
};

// Cancel a request
export const cancelRequest = (requestId) => {
    return axiosInstance.put(
        `/exchange-requests/${requestId}/cancel`
    );
};

// Set handover method and arrangement details
export const setHandoverDetails = (requestId, handoverData) => {
    return axiosInstance.put(
        `/exchange-requests/${requestId}/handover`,
        handoverData
    );
};

// Confirm book handover or receipt
export const confirmHandover = (requestId) => {
    return axiosInstance.put(
        `/exchange-requests/${requestId}/confirm-handover`
    );
};