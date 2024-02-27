export async function getProfileHistory(
    userId,
    token
) {
    if (!token) throw new Error("Missing Token");
    if (!process.env.REACT_APP_API_BASE_URL)
        throw new Error(
            "Missing Environment Configuration: REACT_APP_API_BASE_URL"
        );
        try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}agents/history/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: "GET"
            }
        );

        if (res.status !== 200) return false;
        const data =  await res.json();
        return data
    } catch (e) {
        console.error('Error locking agent:', e);
        return false;
    }
}