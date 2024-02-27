export async function fetchAgentsAndRoles() {
    if (!process.env.REACT_APP_API_BASE_URL)
        throw new Error(
            "Missing Environment Configuration: REACT_APP_API_BASE_URL"
        );
    try {
        const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}agents/`,
            {
                method: "GET"
            }
        );

        if (res.status !== 200) return false;
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Internal Error", error)
        return false
    }
}