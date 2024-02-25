export async function insertLockedAgent(
    userId,
    agentId,
    token
) {
    if (!token) throw new Error("Missing Token");
    // if (!process.env.BASE_API_URL)
    //     throw new Error(
    //         "Missing Environment Configuration: BASE_API_URL"
    //     );

    try {
        const res = await fetch(
            // `${process.env.BASE_API_URL}
            `http://localhost:8000/api/v1/agents/lock`,
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