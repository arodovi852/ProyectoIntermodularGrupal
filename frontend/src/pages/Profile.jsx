import getUserData from "../utils/GetUserData.jsx";
import {useEffect, useState} from "react";
import Sliders from "../components/Sliders/Sliders.jsx";
import styles from "./styles.module.css"

function Profile() {
    const [playlists, setPlaylists] = useState([]);
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    useEffect(() => {
        const fetchData = async () => {
            const element = await getUserData(token, id)
            if (element.success) {
                console.log(element.data);
                setPlaylists(element.data);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Mis Playlists</h1>
            <div>{playlists.map((playlist) => (
                <div key={playlist.id} className={styles.playlist}>
                    <img src={playlist.coverImageUrl} alt="cover" className={styles.image}/>
                    <div className={styles.info}>
                        <h3 className={styles.h3}>{playlist.name}</h3>
                        <p className={styles.p}>{playlist.trackCount} canciones</p>
                        <Sliders></Sliders>
                    </div>
                </div>
            ))}
            </div>
        </div>
  );
}

export default Profile;
