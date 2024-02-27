export async function insertLockedAgent(
    userId,
    agentId,
    token
) {
    if (!token) throw new Error("Missing Token");
    if (!process.env.REACT_APP_API_BASE_URL)
        throw new Error(
            "Missing Environment Configuration: REACT_APP_API_BASE_URL"
        );
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}agents/lock`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: "POST",
                body: JSON.stringify({
                    userId, 
                    agentId
                })
            }
        );

        if (res.status !== 200) return false;
        return await res.json();
    } catch (e) {
        console.error('Error locking agent:', e);
        return false;
    }
}