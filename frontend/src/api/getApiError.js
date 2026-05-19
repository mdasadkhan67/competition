/** Map axios/API errors to user-friendly messages (hide raw SSL/DB errors). */
export function getApiError(error, { notFoundMessage = "Registration not found" } = {}) {
    if (!error?.response) {
        return {
            type: "network",
            message:
                "Cannot reach the server. Make sure the backend is running (port 5000) and try again.",
        };
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message || "";

    if (status === 404) {
        return { type: "not_found", message: notFoundMessage };
    }

    if (
        status >= 500 ||
        /ssl|openssl|tls|mongodb|mongo/i.test(serverMessage)
    ) {
        return {
            type: "server",
            message:
                "The server could not load your status right now. Please try again in a few minutes or contact support.",
        };
    }

    return {
        type: "other",
        message: serverMessage || "Something went wrong. Please try again.",
    };
}
