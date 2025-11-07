import {useState} from 'react'
import './App.css'

interface FormData {
    username: string;
    password: string;
    email: string;
    firstname: string;
    lastname: string;
    biography: string;
    profileImage: File | null;
}

function App() {

    const Watermark = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url(/corno_hamal.svg) center center no-repeat',
            backgroundSize: 'contain',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 9999,
        }} />
    );


    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        email: "",
        firstname: "",
        lastname: "",
        biography: "",
        profileImage: null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            profileImage: e.target.files ? e.target.files[0] : null,
        }));
    };

    const toByteArray = async (file: File): Promise<number[]> => {
        const buffer = await file.arrayBuffer();
        return Array.from(new Uint8Array(buffer));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        let profileImageBytes: number[] | null = null;
        if (formData.profileImage) {
            profileImageBytes = await toByteArray(formData.profileImage);
        }

        const body = {
            ...formData,
            profileImage: profileImageBytes,
        };

        try {
            const response = await fetch("/create", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setMessage("Registrazione riuscita!");
                setFormData({
                    username: "",
                    password: "",
                    email: "",
                    firstname: "",
                    lastname: "",
                    biography: "",
                    profileImage: null,
                });
            } else {
                const text = await response.text();
                setMessage("Errore nella registrazione: " + text);
            }
        } catch (err: any) {
            setMessage("Errore di rete: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div style={{maxWidth: 400, margin: "auto", padding: 20, fontFamily: "sans-serif"}}>
            <Watermark />
            <h2>Benvenuto!</h2>

            <h3>Accedi con credenziali</h3>

            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input name="username" value={formData.username} onChange={handleChange} required/>
                </label>
                <br/>

                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </label>
                <br/>

                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </label>
                <br/>

                <label>
                    Nome:
                    <input name="firstname" value={formData.firstname} onChange={handleChange} required/>
                </label>
                <br/>

                <label>
                    Cognome:
                    <input name="lastname" value={formData.lastname} onChange={handleChange} required/>
                </label>
                <br/>

                <label>
                    Biografia:
                    <textarea name="biography" value={formData.biography} onChange={handleChange}/>
                </label>
                <br/>

                <label>
                    Immagine profilo:
                    <input type="file" accept="image/*" onChange={handleFileChange}/>
                </label>
                <br/>

                <button type="submit" disabled={loading}>
                    {loading ? "Invio..." : "Registrati"}
                </button>
            </form>

            {message && (
                <p style={{marginTop: 10, color: message.includes("Errore") ? "red" : "green"}}>{message}</p>
            )}

            <hr/>

            <h3>Oppure</h3>
            <div className="flex flex-col items-center gap-4 mt-10">
                <a href={import.meta.env.VITE_GOOGLE_LOGIN_URL} className="btn btn-google">
                    Accedi con Google
                </a>
            </div>
            <div className="flex flex-col items-center gap-4 mt-10">
                <a href={import.meta.env.VITE_KC_LOGIN_URL} className="btn btn-keycloak">
                    Accedi con Keycloak
                </a>
            </div>
        </div>
    );
}

export default App
