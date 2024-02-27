export async function login (
    username,
    password
){
    if(!username || !password){
        throw new Error("Authentication details missing.")
    }
    if (!process.env.REACT_APP_API_BASE_URL)
        throw new Error(
            "Missing Environment Configuration: REACT_APP_API_BASE_URL"
        );
    try {
        let response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}login`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        )

        if (!response.ok) throw new Error('Failed to login');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return true
    } catch (error) {
        console.log("Internal Error ", error)
        return false
    }
}

export async function signUp (
    username,
    password
){
    if(!username || !password){
        throw new Error("Authentication details missing.")
    }
    if (!process.env.REACT_APP_API_BASE_URL)
        throw new Error(
            "Missing Environment Configuration: REACT_APP_API_BASE_URL"
        );
    try {
        let response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        )

        if (!response.ok) throw new Error('Failed to register');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return true
    } catch (error) {
        console.log("Internal Error ", error)
        return false
    }
}