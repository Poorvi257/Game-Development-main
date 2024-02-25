export async function login (
    username,
    password
){
    if(!username || !password){
        throw new Error("Authentication details missing.")
    }
    // if (!process.env.BASE_API_URL)
    //     throw new Error(
    //         "Missing Environment Configuration: BASE_API_URL"
    //     );
    try {
        let response = await fetch(
            // `${process.env.BASE_API_URL}login`,
            "http://localhost:8000/api/v1/login",
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
    // if (!process.env.BASE_API_URL)
    //     throw new Error(
    //         "Missing Environment Configuration: BASE_API_URL"
    //     );
    try {
        let response = await fetch(
            // `${process.env.BASE_API_URL}register`,
            'http://localhost:8000/api/v1/register',
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