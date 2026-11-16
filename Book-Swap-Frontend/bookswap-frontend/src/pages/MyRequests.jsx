import { useEffect, useState } from "react";
import {
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    setHandoverDetails,
    confirmHandover
} from "../api/requestService";


function MyRequests() {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [handoverForms, setHandoverForms] = useState({});

    // // Temporary user IDs until authentication
    // const requesterId = 2;
    // const ownerId = 1;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const [sentResponse, receivedResponse] = await Promise.all([
                    getSentRequests(),
                    getReceivedRequests()
                ]);

                setSentRequests(sentResponse.data);
                setReceivedRequests(receivedResponse.data);
            } catch (error) {
                setError("Unable to load exchange requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (requestId) => {
    try {
        await acceptRequest(requestId);

        setReceivedRequests((previous) =>
            previous.map((request) =>
                request.id === requestId
                    ? { ...request, status: "ACCEPTED" }
                    : request
            )
        );
    } catch (error) {
        setError(error.response?.data?.message || "Unable to accept request.");
    }
};

const handleReject = async (requestId) => {
    try {
        await rejectRequest(requestId);

        setReceivedRequests((previous) =>
            previous.map((request) =>
                request.id === requestId
                    ? { ...request, status: "REJECTED" }
                    : request
            )
        );
    } catch (error) {
        setError(error.response?.data?.message || "Unable to reject request.");
    }
};

const handleCancel = async (requestId) => {
    try {
            await cancelRequest(requestId);

            setSentRequests((previous) =>
                previous.map((request) =>
                    request.id === requestId
                        ? { ...request, status: "CANCELLED" }
                        : request
                )
            );
        } catch (error) {
            setError(error.response?.data?.message || "Unable to cancel request.");
        }
    };

    const handleHandoverChange = (requestId, field, value) => {
        setHandoverForms((previous) => ({
            ...previous,
            [requestId]: {
                ...previous[requestId],
                [field]: value
            }
        }));
    };

    const handleSaveHandover = async (requestId) => {
        try {
            const response = await setHandoverDetails(
                requestId,
                handoverForms[requestId]
            );

            setReceivedRequests((previous) =>
                previous.map((request) =>
                    request.id === requestId ? response.data : request
                )
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save handover details."
            );
        }
    };

    const handleConfirmHandover = async (requestId) => {
        try {
            const response = await confirmHandover(requestId);

            const updatedRequest = response.data;

            setSentRequests((previous) =>
                previous.map((request) =>
                    request.id === requestId ? updatedRequest : request
                )
            );

            setReceivedRequests((previous) =>
                previous.map((request) =>
                    request.id === requestId ? updatedRequest : request
                )
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to confirm handover."
            );
        }
    };

    if (loading) return <p>Loading requests...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div className="my-requests-container">
            <h1>My Requests</h1>
            <p>Keep track of your book exchanges and requests.</p>

            <section>
                <h2>Sent Requests</h2>

                {sentRequests.length === 0 ? (
                    <p>You haven't sent any requests yet.</p>
                ) : (
                    sentRequests.map((request) => (
                        <div key={request.id} className="request-card">
                            <h3>{request.bookTitle}</h3>
                            <p>Owner: {request.ownerName}</p>
                            <span>{request.status}</span>
                            {request.handoverMethod && (
                            <div className="handover-info">
                                <h4>Handover Information</h4>

                                <p>
                                    Method: {request.handoverMethod === "IN_PERSON"
                                        ? "In Person"
                                        : "Courier"}
                                </p>

                                <p>Details: {request.handoverDetails}</p>

                                <p>
                                    Owner Confirmation: {request.ownerConfirmed
                                        ? "Confirmed"
                                        : "Pending"}
                                </p>

                                <p>
                                    Your Confirmation: {request.requesterConfirmed
                                        ? "Confirmed"
                                        : "Pending"}
                                </p>

                                {!request.requesterConfirmed && request.status === "ACCEPTED" && (
                                    <button onClick={() => handleConfirmHandover(request.id)}>
                                        Confirm Received
                                    </button>
                                )}
                            </div>
                        )}

                            {request.status === "PENDING" && (
                                <button onClick={() => handleCancel(request.id)}>    Cancel Request    </button>
                            )}
                        </div>
                    ))
                )}
            </section>

            <section>
                <h2>Received Requests</h2>

                {receivedRequests.length === 0 ? (
                    <p>You haven't received any requests yet.</p>
                ) : (
                    receivedRequests.map((request) => (
                        <div key={request.id} className="request-card">
                            <h3>{request.bookTitle}</h3>
                            <p>Requested by: {request.requesterName}</p>
                            <span>{request.status}</span>

                            {request.status === "ACCEPTED" &&
                                !request.handoverMethod &&
                                !request.ownerConfirmed &&
                                !request.requesterConfirmed && (
                            <div className="handover-form">
                                <h4>Arrange Book Handover</h4>

                                <select
                                    value={handoverForms[request.id]?.handoverMethod || ""}
                                    onChange={(e) =>
                                        handleHandoverChange(
                                            request.id,
                                            "handoverMethod",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">Select Handover Method</option>
                                    <option value="IN_PERSON">In Person</option>
                                    <option value="COURIER">Courier</option>
                                </select>

                                <textarea
                                    placeholder="Enter meeting or courier arrangement details"
                                    value={handoverForms[request.id]?.handoverDetails || ""}
                                    onChange={(e) =>
                                        handleHandoverChange(
                                            request.id,
                                            "handoverDetails",
                                            e.target.value
                                        )
                                    }
                                />

                                <button onClick={() => handleSaveHandover(request.id)}>
                                    Save Handover Details
                                </button>
                            </div>
                        )}

                        {request.handoverMethod && (
                            <div className="handover-info">
                                <h4>Handover Information</h4>

                                <p>
                                    Method: {request.handoverMethod === "IN_PERSON"
                                        ? "In Person"
                                        : "Courier"}
                                </p>

                                <p>Details: {request.handoverDetails}</p>

                                <p>
                                    Owner Confirmation: {request.ownerConfirmed
                                        ? "Confirmed"
                                        : "Pending"}
                                </p>

                                <p>
                                    Requester Confirmation: {request.requesterConfirmed
                                        ? "Confirmed"
                                        : "Pending"}
                                </p>

                                {!request.ownerConfirmed && request.status === "ACCEPTED" &&  (
                                    <button onClick={() => handleConfirmHandover(request.id)}>
                                        Confirm Handover
                                    </button>
                                )}
                            </div>
                        )}

                            {request.status === "PENDING" && (
                                <div className="request-actions">
                                    <button onClick={() => handleAccept(request.id)}>    Accept    </button>
                                    <button onClick={() => handleReject(request.id)}>    Reject    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

export default MyRequests;