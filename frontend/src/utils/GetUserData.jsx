export default async function getUserData(token, id) {
    const response = await fetch(`http://localhost:3000/api/playlists/user/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', "Authorization": `Bearer ${token}`},
    })
    if (response.status === 200) {
        return response.json()
    } else {
        return null
    }
}