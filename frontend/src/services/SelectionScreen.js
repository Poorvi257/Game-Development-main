export async function fetchAgentsAndRoles() {
    // if (!process.env.BASE_API_URL)
    //     throw new Error(
    //         "Missing Environment Configuration: BASE_API_URL"
    //     );
    try {
        const res = await fetch(
            // `${process.env.BASE_API_URL}
            `http://localhost:8000/api/v1/agents/`,
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